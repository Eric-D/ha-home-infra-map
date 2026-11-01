"""Websocket API used by the card (prefix `home_infra_map/`).

Read commands are open to every authenticated user; commands that change the
model (or probe the network on demand) require an administrator, enforced
here with @websocket_api.require_admin — not only hidden in the card.
"""

from __future__ import annotations

import ipaddress
import logging
import time

import probatio as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import entity_registry as er

from .const import (
    CONF_DEFAULT_VIEW,
    CONF_FIREWALL_ANALYSIS,
    CONF_OPNSENSE_INTERVAL,
    CONF_PING_INTERVAL,
    CONF_SNMP_INTERVAL,
    DEFAULT_OPNSENSE_INTERVAL,
    DEFAULT_PING_INTERVAL,
    DEFAULT_SNMP_INTERVAL,
    DOMAIN,
    FIREWALL_CACHE_SECONDS,
    UPLINK_MAC_THRESHOLD,
    VERSION,
)
from .coordinator import HomeInfraMapConfigEntry, RuntimeData
from .dashboard import dashboard_yaml, generate_dashboard
from .entity import device_entities
from .firewall import FirewallData, analyze, parse_interfaces, recent_blocks
from .importer import export_document
from .models import DEVICE_SCHEMA, JsonDict, find_device, new_id, normalize_mac, vlan_for_ip
from .nfc15100 import check_boards
from .opnsense import OPNsenseError
from .ping import PingUnavailableError, async_ping_hosts
from .snmp import locate_mac
from .store import RevisionConflictError

_LOGGER = logging.getLogger(__name__)

VLAN_PALETTE = [
    "#607d8b",
    "#ff9800",
    "#9c27b0",
    "#795548",
    "#2196f3",
    "#4caf50",
    "#00bcd4",
    "#f44336",
    "#3f51b5",
]


def _entry(hass: HomeAssistant) -> HomeInfraMapConfigEntry | None:
    from . import loaded_entry

    try:
        return loaded_entry(hass)
    except HomeAssistantError:
        return None


def _require_entry(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg_id: int
) -> HomeInfraMapConfigEntry | None:
    entry = _entry(hass)
    if entry is None:
        connection.send_error(msg_id, "not_configured", "Home Infra Map is not configured")
    return entry


# ---------------------------------------------------------------------------
# Payload builders
# ---------------------------------------------------------------------------


def settings_payload(entry: HomeInfraMapConfigEntry) -> JsonDict:
    """Non-secret settings for the card."""
    opts = entry.options
    runtime = entry.runtime_data
    return {
        "default_view": opts.get(CONF_DEFAULT_VIEW, "electricity"),
        "ping_interval_s": opts.get(CONF_PING_INTERVAL, DEFAULT_PING_INTERVAL),
        "snmp_interval_s": opts.get(CONF_SNMP_INTERVAL, DEFAULT_SNMP_INTERVAL),
        "opnsense_interval_s": opts.get(CONF_OPNSENSE_INTERVAL, DEFAULT_OPNSENSE_INTERVAL),
        "firewall_analysis": bool(opts.get(CONF_FIREWALL_ANALYSIS, True)) and runtime.opnsense is not None,
        "sources": {
            "opnsense": runtime.opnsense is not None,
            "snmp": [{"id": c.source_id, "host": c.source.get("host")} for c in runtime.snmp.values()],
        },
    }


def entities_payload(hass: HomeAssistant, entry: HomeInfraMapConfigEntry) -> JsonDict:
    """Map owners (device/switch/board/row) to their actual entity ids."""
    from . import current_plan

    ent_reg = er.async_get(hass)
    result: dict[str, list[JsonDict]] = {}
    for planned in current_plan(hass, entry):
        entity_id = (
            ent_reg.async_get_entity_id(planned.platform, DOMAIN, planned.unique_id) or planned.entity_id
        )
        key = planned.extra.get("row_id") or planned.owner_id
        result.setdefault(key, []).append({"key": planned.key, "entity_id": entity_id, **planned.extra})
    return result


def live_payload(runtime: RuntimeData) -> JsonDict:
    """Live data not represented by entities (switch ports, gateways)."""
    switches: dict[str, JsonDict] = {}
    for coord in runtime.snmp.values():
        sw = coord.switch()
        if sw is None:
            continue
        switches[sw["id"]] = {
            "available": coord.last_update_success,
            "sys_name": (coord.data or {}).get("sys_name"),
            "ports": (coord.data or {}).get("ports", {}),
        }
    opn = runtime.opnsense
    gateways: list[JsonDict] = []
    if opn is not None and opn.data:
        for gw in opn.data.get("gateways", []):
            gateways.append(
                {
                    "name": gw.get("name"),
                    "status": gw.get("status_translated") or gw.get("status"),
                    "delay": gw.get("delay"),
                    "loss": gw.get("loss"),
                    "online": str(gw.get("status") or gw.get("status_translated") or "").lower()
                    in ("none", "online", "ok"),
                }
            )
    return {
        "ping": runtime.ping.data or {},
        "ping_available": runtime.ping.last_update_success,
        "switches": switches,
        "opnsense": {
            "configured": opn is not None,
            "available": bool(opn and opn.last_update_success),
            "gateways": gateways,
        },
    }


def full_payload(hass: HomeAssistant, entry: HomeInfraMapConfigEntry) -> JsonDict:
    """Everything the card needs at load."""
    store = entry.runtime_data.store
    return {
        "version": VERSION,
        "revision": store.revision,
        "section_revisions": store.section_revisions,
        "model": store.model,
        "settings": settings_payload(entry),
        "entities": entities_payload(hass, entry),
        "live": live_payload(entry.runtime_data),
        "checks": check_boards(store.model["boards"], store.model["boxes"]),
    }


# ---------------------------------------------------------------------------
# Commands
# ---------------------------------------------------------------------------


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/get"})
@callback
def ws_get(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: JsonDict) -> None:
    """Return the full model."""
    if (entry := _require_entry(hass, connection, msg["id"])) is None:
        return
    connection.send_result(msg["id"], full_payload(hass, entry))


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/subscribe"})
@callback
def ws_subscribe(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: JsonDict) -> None:
    """Push model changes and live data updates."""
    if (entry := _require_entry(hass, connection, msg["id"])) is None:
        return
    runtime = entry.runtime_data

    @callback
    def _model_changed(_model: JsonDict, _revision: int) -> None:
        connection.send_message(
            websocket_api.event_message(msg["id"], {"kind": "model", **full_payload(hass, entry)})
        )

    @callback
    def _live_changed() -> None:
        connection.send_message(
            websocket_api.event_message(msg["id"], {"kind": "live", "live": live_payload(runtime)})
        )

    unsubs = [
        runtime.store.async_add_listener(_model_changed),
        runtime.ping.async_add_listener(_live_changed),
    ]
    if runtime.opnsense:
        unsubs.append(runtime.opnsense.async_add_listener(_live_changed))
    unsubs.extend(c.async_add_listener(_live_changed) for c in runtime.snmp.values())

    @callback
    def _unsub() -> None:
        for unsub in unsubs:
            unsub()

    connection.subscriptions[msg["id"]] = _unsub
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/save",
        vol.Required("section"): vol.In(["boards", "network", "house_name", "boxes"]),
        vol.Required("data"): vol.Any(list, dict, str),
        vol.Optional("expected_revision"): vol.Any(None, int),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_save(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: JsonDict) -> None:
    """Replace one section, refusing outdated edits."""
    if (entry := _require_entry(hass, connection, msg["id"])) is None:
        return
    store = entry.runtime_data.store
    try:
        await store.async_save_section(msg["section"], msg["data"], msg.get("expected_revision"))
    except RevisionConflictError as err:
        connection.send_error(msg["id"], "conflict", str(err))
        return
    except vol.Invalid as err:
        connection.send_error(msg["id"], "invalid_format", str(err))
        return
    connection.send_result(
        msg["id"], {"revision": store.revision, "section_revisions": store.section_revisions}
    )


def _arp_lookup(runtime: RuntimeData, ip: str) -> tuple[str | None, str | None]:
    """MAC of an IP from ARP, then reservations, then leases."""
    data = runtime.opnsense.data if runtime.opnsense and runtime.opnsense.data else None
    if not data:
        return None, None
    for row in data.get("arp", []):
        if str(row.get("ip")) == ip and row.get("mac") and not row.get("expired"):
            return normalize_mac(row["mac"]), "arp"
    for row in data.get("reservations", []):
        if str(row.get("ip_address")) == ip and row.get("hw_address"):
            return normalize_mac(row["hw_address"]), "reservation"
    for row in data.get("leases", []):
        if str(row.get("address")) == ip and row.get("hwaddr"):
            return normalize_mac(row["hwaddr"]), "lease"
    return None, None


def _vlan_lookup(entry: HomeInfraMapConfigEntry, ip: str) -> JsonDict | None:
    model = entry.runtime_data.store.model
    vlan = vlan_for_ip(model["network"]["vlans"], ip)
    if vlan is not None:
        return {"vlan_id": vlan["id"], "name": vlan["name"], "subnet": vlan["subnet"], "source": "model"}
    opn = entry.runtime_data.opnsense
    if opn and opn.data:
        try:
            addr = ipaddress.ip_address(ip)
        except ValueError:
            return None
        for iface in parse_interfaces(opn.data.get("interfaces", [])).values():
            for net in iface.subnets:
                if addr.version == net.version and addr in net:
                    return {
                        "vlan_id": None,
                        "name": iface.description,
                        "subnet": str(net),
                        "source": "opnsense",
                    }
    return None


def _port_lookup(entry: HomeInfraMapConfigEntry, mac: str) -> JsonDict | None:
    runtime = entry.runtime_data
    model = runtime.store.model
    router_macs = [d["mac"] for d in model["network"]["devices"] if d["kind"] == "router" and d.get("mac")]
    for coord in runtime.snmp.values():
        sw = coord.switch()
        if not coord.data or sw is None:
            continue
        found = locate_mac(coord.data, mac, router_macs, UPLINK_MAC_THRESHOLD)
        if found:
            ap = next(
                (
                    d
                    for d in model["network"]["devices"]
                    if d["kind"] == "ap" and d.get("switch_id") == sw["id"] and d.get("port") == found["port"]
                ),
                None,
            )
            return {
                **found,
                "switch_id": sw["id"],
                "switch_name": sw["name"],
                "via": found.get("via") or (ap["name"] if ap else None),
                "via_device_id": ap["id"] if ap else None,
            }
    return None


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/probe",
        vol.Required("host"): str,
        vol.Optional("ping", default=True): bool,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_probe(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: JsonDict) -> None:
    """Ping a host and detect VLAN, MAC and switch port."""
    if (entry := _require_entry(hass, connection, msg["id"])) is None:
        return
    host = msg["host"].strip()
    result: JsonDict = {"host": host, "ping": None, "vlan": None, "mac": None, "port": None}
    if msg["ping"] and host:
        try:
            res = (await async_ping_hosts([host]))[host]
            result["ping"] = {"alive": res["alive"], "rtt_ms": res["rtt_ms"], "ip": res.get("ip")}
        except PingUnavailableError as err:
            result["ping"] = {"alive": None, "rtt_ms": None, "error": str(err)}
    ip = (result["ping"] or {}).get("ip") or host
    result["vlan"] = _vlan_lookup(entry, ip)
    mac, mac_source = _arp_lookup(entry.runtime_data, ip)
    if mac:
        result["mac"] = {"value": mac, "source": mac_source}
        result["port"] = _port_lookup(entry, mac)
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/preview_entities", vol.Required("device"): dict}
)
@callback
def ws_preview_entities(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: JsonDict
) -> None:
    """Entity ids that a (new or edited) device would get."""
    if (entry := _require_entry(hass, connection, msg["id"])) is None:
        return
    try:
        device = DEVICE_SCHEMA({**msg["device"], "name": msg["device"].get("name") or "?"})
    except vol.Invalid as err:
        connection.send_error(msg["id"], "invalid_format", str(err))
        return
    runtime = entry.runtime_data
    ent_reg = er.async_get(hass)
    plan = device_entities(
        hass,
        entry.entry_id,
        device,
        has_snmp=bool(runtime.snmp),
        has_firewall=runtime.opnsense is not None and runtime.opnsense.firewall_enabled,
    )
    connection.send_result(
        msg["id"],
        [
            {
                "key": p.key,
                "entity_id": ent_reg.async_get_entity_id(p.platform, DOMAIN, p.unique_id) or p.entity_id,
                **p.extra,
            }
            for p in plan
        ],
    )


def opnsense_proposals(entry: HomeInfraMapConfigEntry) -> JsonDict:
    """VLANs and devices that OPNsense knows about (preview, no write)."""
    runtime = entry.runtime_data
    data = runtime.opnsense.data if runtime.opnsense else None
    network = runtime.store.model["network"]
    if not data:
        return {"vlans": [], "devices": []}
    tags: dict[str, int] = {}
    for vlan in data.get("vlans", []):
        try:
            tags[str(vlan.get("descr") or vlan.get("vlanif"))] = int(vlan.get("tag"))
        except TypeError, ValueError:
            continue
    vlans = []
    for iface in parse_interfaces(data.get("interfaces", [])).values():
        if not iface.subnets or iface.identifier.startswith("wan") or iface.identifier == "lo0":
            continue
        subnet = (
            str(next(n for n in iface.subnets if n.version == 4))
            if any(n.version == 4 for n in iface.subnets)
            else str(iface.subnets[0])
        )
        existing = next(
            (
                v
                for v in network["vlans"]
                if v.get("interface") == iface.identifier or v.get("subnet") == subnet
            ),
            None,
        )
        vlans.append(
            {
                "interface": iface.identifier,
                "name": iface.description,
                "tag": tags.get(iface.description),
                "subnet": subnet,
                "existing_id": existing["id"] if existing else None,
            }
        )
    known_macs = {d.get("mac") for d in network["devices"] if d.get("mac")}
    known_hosts = {d.get("host") for d in network["devices"]}
    devices = []
    for row in data.get("reservations", []):
        ip = str(row.get("ip_address") or "").strip()
        if not ip:
            continue
        try:
            mac = normalize_mac(row.get("hw_address"))
        except vol.Invalid:
            mac = None
        name = str(row.get("description") or row.get("hostname") or ip).strip()
        devices.append(
            {
                "key": mac or ip,
                "name": name,
                "host": ip,
                "mac": mac,
                "exists": (mac in known_macs) or (ip in known_hosts),
            }
        )
    return {"vlans": vlans, "devices": devices}


def apply_opnsense_import(
    model_network: JsonDict, proposals: JsonDict, vlan_keys: list[str], device_keys: list[str]
) -> JsonDict:
    """Merge selected proposals into a copy of the network section."""
    network = {
        **model_network,
        "vlans": [dict(v) for v in model_network["vlans"]],
        "devices": list(model_network["devices"]),
    }
    for index, prop in enumerate(p for p in proposals["vlans"] if p["interface"] in vlan_keys):
        target = next((v for v in network["vlans"] if v["id"] == prop["existing_id"]), None)
        if target is not None:
            target.update(
                interface=prop["interface"], subnet=prop["subnet"], tag=prop["tag"] or target.get("tag")
            )
        else:
            network["vlans"].append(
                {
                    "id": new_id(),
                    "name": prop["name"],
                    "tag": prop["tag"],
                    "subnet": prop["subnet"],
                    "interface": prop["interface"],
                    "color": VLAN_PALETTE[(len(network["vlans"]) + index) % len(VLAN_PALETTE)],
                }
            )
    for prop in proposals["devices"]:
        if prop["key"] not in device_keys or prop["exists"]:
            continue
        vlan = vlan_for_ip(network["vlans"], prop["host"])
        network["devices"].append(
            {
                "id": new_id(),
                "name": prop["name"],
                "host": prop["host"],
                "mac": prop["mac"],
                "vlan_id": vlan["id"] if vlan else None,
                "monitor": {"ping": True},
            }
        )
    return network


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/import_opnsense",
        vol.Optional("apply", default=False): bool,
        vol.Optional("vlans", default=list): [str],
        vol.Optional("devices", default=list): [str],
        vol.Optional("expected_revision"): vol.Any(None, int),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_import_opnsense(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: JsonDict
) -> None:
    """Preview (default) or apply an import of VLANs and DHCP reservations."""
    if (entry := _require_entry(hass, connection, msg["id"])) is None:
        return
    runtime = entry.runtime_data
    if runtime.opnsense is None:
        connection.send_error(msg["id"], "not_configured", "OPNsense is not configured")
        return
    if not runtime.opnsense.data:
        await runtime.opnsense.async_refresh()
    if not runtime.opnsense.last_update_success or not runtime.opnsense.data:
        connection.send_error(msg["id"], "unavailable", "OPNsense is unreachable")
        return
    proposals = opnsense_proposals(entry)
    if not msg["apply"]:
        connection.send_result(msg["id"], proposals)
        return
    network = apply_opnsense_import(runtime.store.model["network"], proposals, msg["vlans"], msg["devices"])
    try:
        await runtime.store.async_save_section("network", network, msg.get("expected_revision"))
    except RevisionConflictError as err:
        connection.send_error(msg["id"], "conflict", str(err))
        return
    except vol.Invalid as err:
        connection.send_error(msg["id"], "invalid_format", str(err))
        return
    connection.send_result(msg["id"], {"applied": True, "revision": runtime.store.revision})


async def firewall_report(hass: HomeAssistant, entry: HomeInfraMapConfigEntry, device: JsonDict) -> JsonDict:
    """Analysis + recent blocks for a device, cached FIREWALL_CACHE_SECONDS."""
    runtime = entry.runtime_data
    opn = runtime.opnsense
    if opn is None or not opn.firewall_enabled:
        return {"available": False, "reason": "not_configured"}
    if not opn.last_update_success or not opn.data:
        return {"available": False, "reason": "unavailable"}
    host = device.get("host") or ""
    try:
        ipaddress.ip_address(host)
    except ValueError:
        return {"available": False, "reason": "not_an_ip"}
    cached = runtime.firewall_cache.get(device["id"])
    if cached and time.monotonic() - cached[0] < FIREWALL_CACHE_SECONDS:
        return cached[1]
    data = opn.data
    model = runtime.store.model
    host_names = {d["host"]: d["name"] for d in model["network"]["devices"] if d.get("host")}
    fw = FirewallData(
        rules=data.get("rules", []),
        aliases=data.get("aliases", {}),
        interfaces=parse_interfaces(data.get("interfaces", [])),
        nat_rules=data.get("nat", []),
        host_names=host_names,
    )
    report: JsonDict = {"available": True, **analyze(fw, host)}
    try:
        log = await opn.client.get_firewall_log(host, rows=500)
    except OPNsenseError:
        log = [r for r in data.get("firewall_log", []) if r.get("src") == host]
    try:
        resolver = await opn.client.get_resolver_log(host, rows=500)
    except OPNsenseError:
        resolver = []
    report["blocks"] = recent_blocks(log, host, fw.rules, resolver)
    report["blocks_24h"] = data.get("blocks_24h", {}).get(host, 0)
    hits: dict[str, int] = {}
    for row in log:
        label = str(row.get("label") or "")
        if label:
            hits[label] = hits.get(label, 0) + 1
    report["rule_hits"] = hits
    report["fetched_at"] = data.get("fetched_at")
    runtime.firewall_cache[device["id"]] = (time.monotonic(), report)
    return report


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/firewall", vol.Required("device_id"): str})
@websocket_api.async_response
async def ws_firewall(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: JsonDict) -> None:
    """Firewall analysis of one device (read-only)."""
    if (entry := _require_entry(hass, connection, msg["id"])) is None:
        return
    device = find_device(entry.runtime_data.store.model, msg["device_id"])
    if device is None:
        connection.send_error(msg["id"], "not_found", "unknown device")
        return
    connection.send_result(msg["id"], await firewall_report(hass, entry, device))


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/checks"})
@callback
def ws_checks(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: JsonDict) -> None:
    """Electrical warnings."""
    if (entry := _require_entry(hass, connection, msg["id"])) is None:
        return
    model = entry.runtime_data.store.model
    connection.send_result(msg["id"], check_boards(model["boards"], model["boxes"]))


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/export"})
@callback
def ws_export(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: JsonDict) -> None:
    """Full export (YAML) and model (JSON). No secret is part of the model."""
    if (entry := _require_entry(hass, connection, msg["id"])) is None:
        return
    model = entry.runtime_data.store.model
    connection.send_result(msg["id"], {"yaml": export_document(model), "json": model})


@websocket_api.websocket_command(
    {vol.Required("type"): f"{DOMAIN}/import_yaml", vol.Required("content"): str}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_import_yaml(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: JsonDict
) -> None:
    """Import pasted YAML (native or legacy house format)."""
    from . import async_import_text

    if (entry := _require_entry(hass, connection, msg["id"])) is None:
        return
    try:
        summary = await async_import_text(hass, entry, msg["content"])
    except HomeAssistantError as err:
        connection.send_error(msg["id"], "invalid_format", str(err))
        return
    connection.send_result(msg["id"], summary)


def dashboard_for(hass: HomeAssistant, entry: HomeInfraMapConfigEntry) -> str:
    """YAML of the example view built from the current model."""
    view = generate_dashboard(
        entry.runtime_data.store.model, entities_payload(hass, entry), hass.config.language or "en"
    )
    return dashboard_yaml(view)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/generate_dashboard"})
@callback
def ws_generate_dashboard(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: JsonDict
) -> None:
    """Example dashboard view (YAML) built from the user's data."""
    if (entry := _require_entry(hass, connection, msg["id"])) is None:
        return
    connection.send_result(msg["id"], {"yaml": dashboard_for(hass, entry)})


@callback
def async_register_websocket(hass: HomeAssistant) -> None:
    """Register all commands."""
    for handler in (
        ws_get,
        ws_subscribe,
        ws_save,
        ws_probe,
        ws_preview_entities,
        ws_import_opnsense,
        ws_firewall,
        ws_checks,
        ws_export,
        ws_import_yaml,
        ws_generate_dashboard,
    ):
        websocket_api.async_register_command(hass, handler)
