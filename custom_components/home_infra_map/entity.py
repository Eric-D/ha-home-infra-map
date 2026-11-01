"""Entity helpers: device info, predictable entity ids, entity plan."""

from __future__ import annotations

import re
from collections.abc import Callable
from dataclasses import dataclass, field
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.device_registry import CONNECTION_NETWORK_MAC, DeviceInfo
from homeassistant.helpers.entity import Entity
from homeassistant.util import slugify

from .const import DOMAIN, ENTITY_SUFFIXES
from .models import JsonDict, board_alerts, board_power_entities, row_power_entities


def suffixes(hass: HomeAssistant) -> dict[str, str]:
    """Return entity-id suffixes in the system language (fr or en)."""
    lang = (hass.config.language or "en").split("-")[0].lower()
    return ENTITY_SUFFIXES.get(lang, ENTITY_SUFFIXES["en"])


def object_id(*parts: str) -> str:
    """Return `home_infra_map_<parts>` slugified."""
    return slugify("_".join([DOMAIN, *[p for p in parts if p]]))


def board_code(board: JsonDict) -> str:
    """Short code of a board: 'T1' from refs like 'T1-R3-1', else its name."""
    prefixes = {
        str(m.get("ref") or "").split("-")[0]
        for row in board["rows"]
        for m in row["modules"]
        if re.match(r"^[A-Za-z]+\d+-", str(m.get("ref") or ""))
    }
    if len(prefixes) == 1:
        return prefixes.pop()
    return str(board["name"])


def area_name(hass: HomeAssistant, area_id: str | None) -> str | None:
    """Return an area name for suggested_area."""
    if not area_id:
        return None
    area = ar.async_get(hass).async_get_area(area_id)
    return area.name if area else None


def network_device_info(hass: HomeAssistant, entry_id: str, device: JsonDict) -> DeviceInfo:
    """Device registry entry of a monitored network device."""
    info = DeviceInfo(
        identifiers={(DOMAIN, f"{entry_id}_{device['id']}")},
        name=device["name"],
        model=device.get("model") or device["kind"],
        manufacturer="Home Infra Map",
    )
    if device.get("mac"):
        info["connections"] = {(CONNECTION_NETWORK_MAC, device["mac"])}
    if area := area_name(hass, device.get("area_id")):
        info["suggested_area"] = area
    return info


def switch_device_info(entry_id: str, switch: JsonDict) -> DeviceInfo:
    """Device registry entry of a switch."""
    return DeviceInfo(
        identifiers={(DOMAIN, f"{entry_id}_switch_{switch['id']}")},
        name=switch["name"],
        model=switch.get("model") or "switch",
        manufacturer="Home Infra Map",
    )


def board_device_info(hass: HomeAssistant, entry_id: str, board: JsonDict) -> DeviceInfo:
    """Device registry entry of an electrical board."""
    info = DeviceInfo(
        identifiers={(DOMAIN, f"{entry_id}_board_{board['id']}")},
        name=board["name"],
        model="electrical board",
        manufacturer="Home Infra Map",
    )
    if area := area_name(hass, board.get("area_id")):
        info["suggested_area"] = area
    return info


@dataclass
class PlannedEntity:
    """One entity the integration should expose."""

    platform: str
    key: str  # online | latency | tcp | switch_port | blocks | port | row_power | board_power
    unique_id: str
    entity_id: str
    owner_id: str  # device / switch / board id
    extra: JsonDict = field(default_factory=dict)
    # Data the entity object captures at creation: when it changes, the
    # entity is re-created (same unique_id, so same entity_id and history).
    fingerprint: tuple[Any, ...] = ()


def device_entities(
    hass: HomeAssistant,
    entry_id: str,
    device: JsonDict,
    *,
    has_snmp: bool,
    has_firewall: bool,
) -> list[PlannedEntity]:
    """Entities created for a network device (also used for the card preview)."""
    sfx = suffixes(hass)
    name = device["name"]
    mon = device["monitor"]
    plan: list[PlannedEntity] = []
    base = f"{entry_id}_{device['id']}"
    fp = (
        name,
        device.get("host"),
        device.get("mac"),
        device.get("area_id"),
        device["kind"],
        device.get("model"),
    )
    if mon.get("ping"):
        plan.append(
            PlannedEntity(
                "binary_sensor",
                "online",
                f"{base}_online",
                f"binary_sensor.{object_id(name, sfx['online'])}",
                device["id"],
            )
        )
    if mon.get("latency"):
        plan.append(
            PlannedEntity(
                "sensor",
                "latency",
                f"{base}_latency",
                f"sensor.{object_id(name, sfx['latency'])}",
                device["id"],
            )
        )
    if port := mon.get("tcp_port"):
        plan.append(
            PlannedEntity(
                "binary_sensor",
                "tcp",
                f"{base}_tcp_{port}",
                f"binary_sensor.{object_id(name, sfx['tcp'], str(port))}",
                device["id"],
                {"port": port},
            )
        )
    if has_snmp and device.get("mac") and device["kind"] not in ("switch",):
        plan.append(
            PlannedEntity(
                "sensor",
                "switch_port",
                f"{base}_switch_port",
                f"sensor.{object_id(name, sfx['switch_port'])}",
                device["id"],
            )
        )
    if has_firewall and device.get("host"):
        plan.append(
            PlannedEntity(
                "sensor", "blocks", f"{base}_blocks", f"sensor.{object_id(name, sfx['blocks'])}", device["id"]
            )
        )
    for planned in plan:
        planned.fingerprint = fp
    return plan


def entity_plan(
    hass: HomeAssistant,
    entry_id: str,
    model: JsonDict,
    *,
    snmp_switch_ids: set[str],
    has_snmp: bool,
    has_firewall: bool,
) -> list[PlannedEntity]:
    """Every entity the current model calls for."""
    sfx = suffixes(hass)
    plan: list[PlannedEntity] = []
    network = model["network"]
    for device in network["devices"]:
        plan.extend(device_entities(hass, entry_id, device, has_snmp=has_snmp, has_firewall=has_firewall))
    for switch in network["switches"]:
        if switch["id"] not in snmp_switch_ids:
            continue
        used = {d["port"] for d in network["devices"] if d.get("switch_id") == switch["id"] and d.get("port")}
        used |= {int(p) for p in switch.get("port_labels", {})}
        for port in range(1, switch["ports_count"] + 1):
            plan.append(
                PlannedEntity(
                    "sensor",
                    "port",
                    f"{entry_id}_switch_{switch['id']}_port_{port}",
                    f"sensor.{object_id(switch['name'], sfx['port'], str(port))}",
                    switch["id"],
                    {"port": port, "used": port in used},
                    fingerprint=(switch["name"], switch.get("model")),
                )
            )
    for board in model["boards"]:
        code = board_code(board)
        board_fp = (board["name"], board.get("area_id"))
        any_power = False
        for row in board["rows"]:
            if any(m.get("power_entity_id") for m in row["modules"]):
                any_power = True
                plan.append(
                    PlannedEntity(
                        "sensor",
                        "row_power",
                        f"{entry_id}_row_{row['id']}_power",
                        f"sensor.{object_id(code, row['label'] or 'r', sfx['power'])}",
                        board["id"],
                        {"row_id": row["id"], "label": row["label"]},
                        fingerprint=(*board_fp, row["label"], tuple(row_power_entities(row))),
                    )
                )
        alerts = board_alerts(board)
        plan.append(
            PlannedEntity(
                "sensor",
                "alerts",
                f"{entry_id}_board_{board['id']}_alerts",
                f"sensor.{object_id(code, sfx['alerts'])}",
                board["id"],
                # re-created when an alert changes: the state follows the model
                fingerprint=(*board_fp, tuple((a["ref"], a["text"], a["level"]) for a in alerts)),
            )
        )
        if any_power:
            plan.append(
                PlannedEntity(
                    "sensor",
                    "board_power",
                    f"{entry_id}_board_{board['id']}_power",
                    f"sensor.{object_id(code, sfx['power'])}",
                    board["id"],
                    fingerprint=(*board_fp, tuple(board_power_entities(board))),
                )
            )
    return plan


type EntityFactory = Callable[[PlannedEntity], Entity | None]


class PlatformSync:
    """Keeps one platform's entities in line with the model, without reloading.

    A full config-entry reload on every edit made the integration briefly
    absent: a second service call or websocket command in that window failed
    with "not configured". Instead, each platform adds the entities the plan
    gains, removes those it loses, and re-creates those whose fingerprint
    changed (same unique_id, so the entity_id and history are kept).
    """

    def __init__(
        self,
        hass: HomeAssistant,
        platform: str,
        plan_getter: Callable[[], list[PlannedEntity]],
        factory: EntityFactory,
        add_entities: Callable[[list[Entity]], None],
    ) -> None:
        """Initialise."""
        self.hass = hass
        self.platform = platform
        self._plan_getter = plan_getter
        self._factory = factory
        self._add = add_entities
        self._live: dict[str, tuple[tuple[Any, ...], Entity]] = {}

    async def async_sync(self) -> None:
        """Apply the current plan."""
        wanted = {p.unique_id: p for p in self._plan_getter() if p.platform == self.platform}
        to_remove: list[Entity] = []
        for uid, (fingerprint, entity) in list(self._live.items()):
            planned = wanted.get(uid)
            if planned is None or planned.fingerprint != fingerprint:
                to_remove.append(entity)
                del self._live[uid]
                if planned is None and entity.entity_id:
                    er.async_get(self.hass).async_remove(entity.entity_id)
        for entity in to_remove:
            if entity.hass is not None:
                await entity.async_remove()
        new: list[Entity] = []
        for uid, planned in wanted.items():
            if uid in self._live:
                continue
            created = self._factory(planned)
            if created is not None:
                self._live[uid] = (planned.fingerprint, created)
                new.append(created)
        if new:
            self._add(new)
