"""Coordinators: ICMP/TCP probing, OPNsense and SNMP polling."""

from __future__ import annotations

import asyncio
import logging
import time
from dataclasses import dataclass, field
from datetime import timedelta
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import issue_registry as ir
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util import dt as dt_util

from .const import (
    CONF_API_KEY,
    CONF_API_SECRET,
    CONF_FIREWALL_ANALYSIS,
    CONF_OPNSENSE_INTERVAL,
    CONF_PING_INTERVAL,
    CONF_SNMP_INTERVAL,
    CONF_URL,
    CONF_VERIFY_SSL,
    DEFAULT_OPNSENSE_INTERVAL,
    DEFAULT_PING_INTERVAL,
    DEFAULT_SNMP_INTERVAL,
    DOMAIN,
    EVENT_DEVICE_OFFLINE,
    EVENT_DEVICE_ONLINE,
    UPLINK_MAC_THRESHOLD,
)
from .firewall import count_blocks, parse_aliases
from .models import JsonDict, new_id
from .opnsense import (
    OPNsenseAuthError,
    OPNsenseClient,
    OPNsenseError,
    OPNsensePermissionError,
)
from .ping import PingUnavailableError, async_ping_hosts, async_tcp_check
from .snmp import SnmpClient, SnmpError, locate_mac
from .store import ModelStore

_LOGGER = logging.getLogger(__name__)

type HomeInfraMapConfigEntry = ConfigEntry[RuntimeData]


@dataclass
class RuntimeData:
    """Objects living as long as the config entry."""

    store: ModelStore
    ping: PingCoordinator
    opnsense: OpnsenseCoordinator | None = None
    snmp: dict[str, SnmpCoordinator] = field(default_factory=dict)
    firewall_cache: dict[str, tuple[float, JsonDict]] = field(default_factory=dict)
    platform_syncs: list[Any] = field(default_factory=list)


# ---------------------------------------------------------------------------
# Ping
# ---------------------------------------------------------------------------


class PingCoordinator(DataUpdateCoordinator[dict[str, JsonDict]]):
    """Pings every monitored device in one async_multiping per cycle."""

    config_entry: HomeInfraMapConfigEntry

    def __init__(self, hass: HomeAssistant, entry: HomeInfraMapConfigEntry, store: ModelStore) -> None:
        """Initialise."""
        super().__init__(
            hass,
            _LOGGER,
            config_entry=entry,
            name=f"{DOMAIN} ping",
            update_interval=timedelta(
                seconds=int(entry.options.get(CONF_PING_INTERVAL, DEFAULT_PING_INTERVAL))
            ),
        )
        self.store = store
        self._offline_since: dict[str, float] = {}
        self._alerted: set[str] = set()

    def _targets(self) -> list[JsonDict]:
        return [
            d
            for d in self.store.model["network"]["devices"]
            if d.get("host")
            and (d["monitor"]["ping"] or d["monitor"]["latency"] or d["monitor"].get("tcp_port"))
        ]

    async def _async_update_data(self) -> dict[str, JsonDict]:
        devices = self._targets()
        if not devices:
            return {}
        hosts = sorted({d["host"] for d in devices if d["monitor"]["ping"] or d["monitor"]["latency"]})
        try:
            results = await async_ping_hosts(hosts) if hosts else {}
        except PingUnavailableError as err:
            raise UpdateFailed(f"ICMP unavailable: {err}") from err

        tcp_devices = [d for d in devices if d["monitor"].get("tcp_port")]
        tcp_results = await asyncio.gather(
            *(async_tcp_check(d["host"], d["monitor"]["tcp_port"]) for d in tcp_devices)
        )
        tcp_by_id = {d["id"]: ok for d, ok in zip(tcp_devices, tcp_results, strict=True)}

        now = time.monotonic()
        data: dict[str, JsonDict] = {}
        for device in devices:
            res = results.get(device["host"], {"alive": None, "rtt_ms": None})
            data[device["id"]] = {
                "alive": res["alive"],
                "rtt_ms": res["rtt_ms"],
                "tcp": tcp_by_id.get(device["id"]),
                "checked_at": dt_util.utcnow().isoformat(),
            }
            self._track_offline(device, res["alive"], now)
        return data

    def _track_offline(self, device: JsonDict, alive: bool | None, now: float) -> None:
        """Fire an event and raise a repair issue after offline_alert_minutes."""
        device_id = device["id"]
        minutes = device["monitor"].get("offline_alert_minutes")
        issue_id = f"offline_{device_id}"
        if alive:
            self._offline_since.pop(device_id, None)
            if device_id in self._alerted:
                self._alerted.discard(device_id)
                ir.async_delete_issue(self.hass, DOMAIN, issue_id)
                self.hass.bus.async_fire(
                    EVENT_DEVICE_ONLINE,
                    {"device_id": device_id, "name": device["name"], "host": device["host"]},
                )
            return
        if alive is None or not minutes:
            return
        since = self._offline_since.setdefault(device_id, now)
        if device_id in self._alerted or now - since < minutes * 60:
            return
        self._alerted.add(device_id)
        self.hass.bus.async_fire(
            EVENT_DEVICE_OFFLINE,
            {
                "device_id": device_id,
                "name": device["name"],
                "host": device["host"],
                "offline_minutes": round((now - since) / 60),
            },
        )
        ir.async_create_issue(
            self.hass,
            DOMAIN,
            issue_id,
            is_fixable=False,
            is_persistent=False,
            severity=ir.IssueSeverity.WARNING,
            translation_key="device_offline",
            translation_placeholders={
                "name": device["name"],
                "host": device["host"],
                "minutes": str(minutes),
            },
        )


# ---------------------------------------------------------------------------
# OPNsense
# ---------------------------------------------------------------------------


def build_opnsense_client(hass: HomeAssistant, conf: JsonDict) -> OPNsenseClient:
    """Create a client from the stored options."""
    return OPNsenseClient(
        async_get_clientsession(hass, verify_ssl=bool(conf.get(CONF_VERIFY_SSL, True))),
        conf[CONF_URL],
        conf[CONF_API_KEY],
        conf[CONF_API_SECRET],
        bool(conf.get(CONF_VERIFY_SSL, True)),
    )


def _referenced_aliases(rules: list[JsonDict], aliases: list[JsonDict]) -> list[str]:
    names = {str(a.get("name")) for a in aliases}
    used: set[str] = set()
    for rule in rules:
        for key in ("source_net", "destination_net", "destination_port"):
            value = str(rule.get(key) or "")
            if value in names:
                used.add(value)
    return sorted(used)


class OpnsenseCoordinator(DataUpdateCoordinator[JsonDict]):
    """Reads ARP, DHCP, interfaces, gateways and (optionally) firewall data."""

    config_entry: HomeInfraMapConfigEntry

    def __init__(self, hass: HomeAssistant, entry: HomeInfraMapConfigEntry, client: OPNsenseClient) -> None:
        """Initialise."""
        super().__init__(
            hass,
            _LOGGER,
            config_entry=entry,
            name=f"{DOMAIN} opnsense",
            update_interval=timedelta(
                seconds=int(entry.options.get(CONF_OPNSENSE_INTERVAL, DEFAULT_OPNSENSE_INTERVAL))
            ),
        )
        self.client = client
        self.firewall_enabled = bool(entry.options.get(CONF_FIREWALL_ANALYSIS, True))
        self._warned: set[str] = set()

    async def _optional(self, name: str, coro: Any, default: Any) -> Any:
        """Run an optional call: a missing privilege disables only that feature."""
        try:
            return await coro
        except OPNsensePermissionError as err:
            if name not in self._warned:
                self._warned.add(name)
                _LOGGER.warning("OPNsense: privilege '%s' missing, %s disabled", err.privilege, name)
            return default

    async def _async_update_data(self) -> JsonDict:
        try:
            arp = await self.client.get_arp()
        except OPNsenseAuthError as err:
            raise UpdateFailed("OPNsense rejected the API key (401)") from err
        except OPNsenseError as err:
            raise UpdateFailed(f"OPNsense unreachable: {err}") from err

        try:
            interfaces, vlans, reservations, leases, gateways = await asyncio.gather(
                self._optional("interfaces", self.client.get_interfaces(), []),
                self._optional("vlans", self.client.get_vlans(), []),
                self._optional("reservations", self.client.get_reservations(), []),
                self._optional("leases", self.client.get_leases(), []),
                self._optional("gateways", self.client.get_gateways(), []),
            )
            data: JsonDict = {
                "arp": arp,
                "interfaces": interfaces,
                "vlans": vlans,
                "reservations": reservations,
                "leases": leases,
                "gateways": gateways,
                "rules": [],
                "nat": [],
                "aliases": {},
                "blocks_24h": {},
                "firewall_log": [],
                "fetched_at": dt_util.utcnow().isoformat(),
            }
            if self.firewall_enabled:
                await self._fetch_firewall(data)
        except OPNsenseError as err:
            raise UpdateFailed(f"OPNsense error: {err}") from err
        return data

    async def _fetch_firewall(self, data: JsonDict) -> None:
        rules, nat, alias_rows, log = await asyncio.gather(
            self._optional("firewall rules", self.client.get_rules(), []),
            self._optional("NAT", self.client.get_nat_rules(), []),
            self._optional("aliases", self.client.get_aliases(), []),
            self._optional("firewall log", self.client.get_firewall_log("block", rows=5000), []),
        )
        semaphore = asyncio.Semaphore(4)
        resolved: dict[str, list[str]] = {}

        async def _resolve(name: str) -> None:
            async with semaphore:
                try:
                    resolved[name] = await self.client.resolve_alias(name)
                except OPNsenseError:
                    _LOGGER.debug("Alias %s could not be resolved", name)

        await asyncio.gather(*(_resolve(n) for n in _referenced_aliases(rules, alias_rows)))
        data["rules"] = rules
        data["nat"] = nat
        data["aliases"] = parse_aliases(alias_rows, resolved)
        data["firewall_log"] = log
        data["blocks_24h"] = count_blocks(log, dt_util.now() - timedelta(hours=24))


# ---------------------------------------------------------------------------
# SNMP
# ---------------------------------------------------------------------------


class SnmpCoordinator(DataUpdateCoordinator[JsonDict]):
    """Reads one switch; updates auto-detected device ports in the model."""

    config_entry: HomeInfraMapConfigEntry

    def __init__(
        self,
        hass: HomeAssistant,
        entry: HomeInfraMapConfigEntry,
        source: JsonDict,
        client: SnmpClient,
        store: ModelStore,
    ) -> None:
        """Initialise."""
        super().__init__(
            hass,
            _LOGGER,
            config_entry=entry,
            name=f"{DOMAIN} snmp {source.get('host')}",
            update_interval=timedelta(
                seconds=int(entry.options.get(CONF_SNMP_INTERVAL, DEFAULT_SNMP_INTERVAL))
            ),
        )
        self.source = source
        self.source_id: str = source["id"]
        self.client = client
        self.store = store

    def switch(self) -> JsonDict | None:
        """Return the model switch fed by this source."""
        switches: list[JsonDict] = self.store.model["network"]["switches"]
        for sw in switches:
            if sw.get("snmp_source_id") == self.source_id:
                return sw
        for sw in switches:
            if sw.get("host") and sw["host"] == self.source.get("host"):
                return sw
        return None

    async def _async_update_data(self) -> JsonDict:
        try:
            snapshot = await self.client.snapshot()
        except SnmpError as err:
            raise UpdateFailed(f"SNMP error on {self.source.get('host')}: {err}") from err
        except Exception as err:  # pysnmp raises a variety of internal errors
            raise UpdateFailed(f"SNMP failure on {self.source.get('host')}: {err!r}") from err
        await self._sync_model(snapshot)
        return snapshot

    async def async_resync(self) -> None:
        """Re-apply the last snapshot to the model (no SNMP traffic).

        Called after a user edit, so a device just added with its MAC gets
        its port immediately instead of at the next poll.
        """
        if self.data:
            await self._sync_model(self.data)

    async def _sync_model(self, snapshot: JsonDict) -> None:
        switch = self.switch()
        network = self.store.model["network"]
        if switch is None:
            ports = [int(p) for p in snapshot["ports"]] or [24]
            new_switch = {
                "id": new_id(),
                "name": snapshot.get("sys_name") or self.source.get("host") or "Switch",
                "host": self.source.get("host"),
                "ports_count": max(ports),
                "snmp_source_id": self.source_id,
            }
            await self.store.async_save_section(
                "network", {**network, "switches": [*network["switches"], new_switch]}, None
            )
            switch = self.switch()
            if switch is None:
                return
        router_macs = [d["mac"] for d in network["devices"] if d["kind"] == "router" and d.get("mac")]
        now = dt_util.utcnow().isoformat()
        updates: dict[str, JsonDict] = {}
        for device in network["devices"]:
            if device["port_source"] != "auto" or not device.get("mac"):
                continue
            if device.get("switch_id") not in (None, switch["id"]):
                continue
            found = locate_mac(snapshot, device["mac"], router_macs, UPLINK_MAC_THRESHOLD)
            if found is None:
                continue  # keep the last known port (MAC aged out after inactivity)
            updates[device["id"]] = {
                "switch_id": switch["id"],
                "port": found["port"],
                "last_seen_port_at": now,
            }
        if updates:
            # last_seen changes every cycle: only persist when the port moved,
            # or at most every hour, to spare the disk.
            significant = {k: v for k, v in updates.items() if self._changed(k, v)}
            if significant:
                await self.store.async_update_devices(significant)
        self._last_seen = {k: v["last_seen_port_at"] for k, v in updates.items()}

    def _changed(self, device_id: str, patch: JsonDict) -> bool:
        for device in self.store.model["network"]["devices"]:
            if device["id"] != device_id:
                continue
            if device.get("port") != patch["port"] or device.get("switch_id") != patch["switch_id"]:
                return True
            last = device.get("last_seen_port_at")
            if not last:
                return True
            parsed = dt_util.parse_datetime(last)
            return parsed is None or dt_util.utcnow() - parsed > timedelta(hours=1)
        return False

    def last_seen(self, device_id: str) -> str | None:
        """Return the last time the device MAC was seen in the table this session."""
        return getattr(self, "_last_seen", {}).get(device_id)
