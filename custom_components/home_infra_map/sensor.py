"""Sensors: latency, switch port, firewall blocks, switch ports, power sums."""

from __future__ import annotations

from typing import Any

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorStateClass,
)
from homeassistant.const import STATE_UNAVAILABLE, STATE_UNKNOWN, EntityCategory, UnitOfPower, UnitOfTime
from homeassistant.core import Event, EventStateChangedData, HomeAssistant, callback
from homeassistant.helpers.entity import Entity
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.helpers.event import async_track_state_change_event
from homeassistant.helpers.update_coordinator import CoordinatorEntity, DataUpdateCoordinator

from . import current_plan
from .coordinator import HomeInfraMapConfigEntry, OpnsenseCoordinator, PingCoordinator, SnmpCoordinator
from .entity import PlannedEntity, PlatformSync, board_device_info, network_device_info, switch_device_info
from .models import JsonDict, board_alerts, find_device, row_power_entities

PARALLEL_UPDATES = 0


async def async_setup_entry(
    hass: HomeAssistant,
    entry: HomeInfraMapConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Create the sensors the model calls for (kept in sync with the model)."""
    runtime = entry.runtime_data

    def factory(planned: PlannedEntity) -> Entity | None:
        model = runtime.store.model
        snmp_by_switch: dict[str, SnmpCoordinator] = {}
        for coord in runtime.snmp.values():
            if (sw := coord.switch()) is not None:
                snmp_by_switch[sw["id"]] = coord
        if planned.key in ("latency", "switch_port", "blocks"):
            device = find_device(model, planned.owner_id)
            if device is None:
                return None
            if planned.key == "latency":
                return LatencySensor(runtime.ping, entry.entry_id, planned, device)
            if planned.key == "switch_port":
                dev_coord = snmp_by_switch.get(device.get("switch_id") or "") or next(
                    iter(runtime.snmp.values()), None
                )
                if dev_coord is None:
                    return None
                return DeviceSwitchPortSensor(dev_coord, entry.entry_id, planned, device)
            if runtime.opnsense is None:
                return None
            return BlocksSensor(runtime.opnsense, entry.entry_id, planned, device)
        if planned.key == "port":
            switch = next((s for s in model["network"]["switches"] if s["id"] == planned.owner_id), None)
            port_coord = snmp_by_switch.get(planned.owner_id)
            if switch is None or port_coord is None:
                return None
            return SwitchPortSensor(port_coord, entry.entry_id, planned, switch)
        board = next((b for b in model["boards"] if b["id"] == planned.owner_id), None)
        if board is None:
            return None
        if planned.key == "alerts":
            return AlertsSensor(hass, entry.entry_id, planned, board)
        if planned.key == "row_power":
            row = next(r for r in board["rows"] if r["id"] == planned.extra["row_id"])
            sources = row_power_entities(row)
        else:
            sources = [e for r in board["rows"] for e in row_power_entities(r)]
        return PowerSumSensor(hass, entry.entry_id, planned, board, sources)

    sync = PlatformSync(hass, "sensor", lambda: current_plan(hass, entry), factory, async_add_entities)
    runtime.platform_syncs.append(sync)
    await sync.async_sync()


class _DeviceEntity[CoordT: DataUpdateCoordinator[Any]](CoordinatorEntity[CoordT], SensorEntity):
    _attr_has_entity_name = True

    def __init__(self, coordinator: CoordT, entry_id: str, planned: PlannedEntity, device: JsonDict) -> None:
        super().__init__(coordinator)
        self._device_id = device["id"]
        self._attr_unique_id = planned.unique_id
        self.entity_id = planned.entity_id
        self._attr_translation_key = planned.key
        self._attr_device_info = network_device_info(coordinator.hass, entry_id, device)


class LatencySensor(_DeviceEntity[PingCoordinator]):
    """Round-trip time in ms."""

    _attr_device_class = SensorDeviceClass.DURATION
    _attr_native_unit_of_measurement = UnitOfTime.MILLISECONDS
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_suggested_display_precision = 1

    @property
    def available(self) -> bool:
        """Unavailable while ICMP is not usable."""
        return super().available and self._device_id in (self.coordinator.data or {})

    @property
    def native_value(self) -> float | None:
        """Return the RTT, None when the device does not answer."""
        return ((self.coordinator.data or {}).get(self._device_id) or {}).get("rtt_ms")


class DeviceSwitchPortSensor(_DeviceEntity[SnmpCoordinator]):
    """Switch port where the device MAC is seen."""

    @property
    def _device(self) -> JsonDict:
        return find_device(self.coordinator.store.model, self._device_id) or {}

    @property
    def native_value(self) -> int | None:
        """Return the port number (last known)."""
        port = self._device.get("port")
        return int(port) if port is not None else None

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Switch, speed, native VLAN, LLDP neighbour, last seen."""
        device = self._device
        model = self.coordinator.store.model
        switch = next((s for s in model["network"]["switches"] if s["id"] == device.get("switch_id")), None)
        port_info = ((self.coordinator.data or {}).get("ports") or {}).get(str(device.get("port")), {})
        lldp = port_info.get("lldp") or {}
        return {
            "switch": switch["name"] if switch else None,
            "speed_mbps": port_info.get("speed_mbps"),
            "native_vlan": port_info.get("pvid"),
            "lldp_neighbor": lldp.get("sys_name"),
            "source": device.get("port_source"),
            "last_seen": device.get("last_seen_port_at"),
        }


class BlocksSensor(_DeviceEntity[OpnsenseCoordinator]):
    """Packets from the device blocked by the firewall over 24 h."""

    _attr_state_class = SensorStateClass.MEASUREMENT

    @property
    def native_value(self) -> int:
        """Return the 24 h block count."""
        return int(((self.coordinator.data or {}).get("blocks_24h") or {}).get(self._host, 0))

    def __init__(
        self, coordinator: OpnsenseCoordinator, entry_id: str, planned: PlannedEntity, device: JsonDict
    ) -> None:
        """Remember the host (entities are recreated when it changes)."""
        super().__init__(coordinator, entry_id, planned, device)
        self._host = device.get("host")


class SwitchPortSensor(CoordinatorEntity[SnmpCoordinator], SensorEntity):
    """Link state of one switch port (diagnostic)."""

    _attr_has_entity_name = True
    _attr_entity_category = EntityCategory.DIAGNOSTIC
    _attr_device_class = SensorDeviceClass.ENUM
    _attr_translation_key = "port"

    def __init__(
        self, coordinator: SnmpCoordinator, entry_id: str, planned: PlannedEntity, switch: JsonDict
    ) -> None:
        """Initialise."""
        super().__init__(coordinator)
        self._port = int(planned.extra["port"])
        self._attr_unique_id = planned.unique_id
        self.entity_id = planned.entity_id
        self._attr_translation_placeholders = {"port": str(self._port)}
        self._attr_entity_registry_enabled_default = bool(planned.extra.get("used"))
        self._attr_options = ["up", "down"]
        self._attr_device_info = switch_device_info(entry_id, switch)

    @property
    def _info(self) -> JsonDict:
        ports: dict[str, JsonDict] = (self.coordinator.data or {}).get("ports") or {}
        return ports.get(str(self._port), {})

    @property
    def native_value(self) -> str | None:
        """Return up / down."""
        up = self._info.get("up")
        return None if up is None else ("up" if up else "down")

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Speed, PoE, LLDP, VLANs and devices seen."""
        info = self._info
        macs = set(info.get("macs", []))
        devices = [
            d["name"] for d in self.coordinator.store.model["network"]["devices"] if d.get("mac") in macs
        ]
        return {
            "name": info.get("name"),
            "alias": info.get("alias"),
            "speed_mbps": info.get("speed_mbps"),
            "poe": info.get("poe"),
            "native_vlan": info.get("pvid"),
            "tagged_vlans": info.get("tagged_vlans"),
            "lldp_neighbor": (info.get("lldp") or {}).get("sys_name"),
            "mac_count": len(macs),
            "devices": devices,
        }


class PowerSumSensor(SensorEntity):
    """Sum of the linked power sensors of a row or a board."""

    _attr_has_entity_name = True
    _attr_should_poll = False
    _attr_device_class = SensorDeviceClass.POWER
    _attr_native_unit_of_measurement = UnitOfPower.WATT
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_suggested_display_precision = 0

    def __init__(
        self, hass: HomeAssistant, entry_id: str, planned: PlannedEntity, board: JsonDict, sources: list[str]
    ) -> None:
        """Initialise."""
        self._sources = sources
        self._attr_unique_id = planned.unique_id
        self.entity_id = planned.entity_id
        self._attr_translation_key = planned.key
        if planned.key == "row_power":
            self._attr_translation_placeholders = {"row": str(planned.extra.get("label") or "")}
        self._attr_device_info = board_device_info(hass, entry_id, board)
        self._attr_available = False

    async def async_added_to_hass(self) -> None:
        """Track the source sensors."""
        self.async_on_remove(async_track_state_change_event(self.hass, self._sources, self._on_change))
        self._recompute()

    @callback
    def _on_change(self, _event: Event[EventStateChangedData]) -> None:
        self._recompute()
        self.async_write_ha_state()

    @callback
    def _recompute(self) -> None:
        total = 0.0
        count = 0
        for entity_id in self._sources:
            state = self.hass.states.get(entity_id)
            if state is None or state.state in (STATE_UNAVAILABLE, STATE_UNKNOWN, ""):
                continue
            try:
                value = float(state.state)
            except ValueError:
                continue
            unit = state.attributes.get("unit_of_measurement")
            if unit == UnitOfPower.KILO_WATT:
                value *= 1000
            elif unit == UnitOfPower.MILLIWATT:
                value /= 1000
            total += value
            count += 1
        self._attr_available = count > 0
        self._attr_native_value = round(total, 1) if count else None
        self._attr_extra_state_attributes = {"sources": self._sources, "counted": count}


class AlertsSensor(SensorEntity):
    """Number of alerts written by the owner on a board; the list in attributes.

    Re-created by PlatformSync whenever an alert changes (fingerprint).
    """

    _attr_has_entity_name = True
    _attr_should_poll = False
    _attr_translation_key = "alerts"

    def __init__(self, hass: HomeAssistant, entry_id: str, planned: PlannedEntity, board: JsonDict) -> None:
        self._attr_unique_id = planned.unique_id
        self.entity_id = planned.entity_id
        self._attr_device_info = board_device_info(hass, entry_id, board)
        alerts = board_alerts(board)
        self._attr_native_value = len(alerts)
        self._attr_extra_state_attributes = {
            "alerts": [{"ref": a["ref"], "text": a["text"], "level": a["level"]} for a in alerts],
            "warnings": sum(1 for a in alerts if a["level"] == "warning"),
        }
