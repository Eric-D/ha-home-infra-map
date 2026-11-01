"""Binary sensors: device presence (ICMP) and TCP service."""

from __future__ import annotations

from typing import Any

from homeassistant.components.binary_sensor import BinarySensorDeviceClass, BinarySensorEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity import Entity
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from . import current_plan
from .coordinator import HomeInfraMapConfigEntry, PingCoordinator
from .entity import PlannedEntity, PlatformSync, network_device_info
from .models import JsonDict, find_device

PARALLEL_UPDATES = 0


async def async_setup_entry(
    hass: HomeAssistant,
    entry: HomeInfraMapConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Create the binary sensors the model calls for."""
    runtime = entry.runtime_data

    def factory(planned: PlannedEntity) -> Entity | None:
        device = find_device(runtime.store.model, planned.owner_id)
        if device is None:
            return None
        return DeviceProbeBinarySensor(runtime.ping, entry.entry_id, planned, device)

    sync = PlatformSync(hass, "binary_sensor", lambda: current_plan(hass, entry), factory, async_add_entities)
    runtime.platform_syncs.append(sync)
    await sync.async_sync()


class DeviceProbeBinarySensor(CoordinatorEntity[PingCoordinator], BinarySensorEntity):
    """Online (ICMP) or TCP port state of a device."""

    _attr_has_entity_name = True
    _attr_device_class = BinarySensorDeviceClass.CONNECTIVITY

    def __init__(
        self, coordinator: PingCoordinator, entry_id: str, planned: PlannedEntity, device: JsonDict
    ) -> None:
        """Initialise."""
        super().__init__(coordinator)
        self._device_id = device["id"]
        self._key = planned.key
        self._attr_unique_id = planned.unique_id
        self.entity_id = planned.entity_id
        self._attr_translation_key = planned.key
        if planned.key == "tcp":
            self._attr_translation_placeholders = {"port": str(planned.extra["port"])}
        self._attr_device_info = network_device_info(coordinator.hass, entry_id, device)

    @property
    def _result(self) -> JsonDict | None:
        return (self.coordinator.data or {}).get(self._device_id)

    @property
    def available(self) -> bool:
        """Unavailable when ICMP itself is not usable or no result yet."""
        result = self._result
        if not super().available or result is None:
            return False
        value = result["tcp"] if self._key == "tcp" else result["alive"]
        return value is not None

    @property
    def is_on(self) -> bool | None:
        """Return True when the device answers."""
        result = self._result
        if result is None:
            return None
        return bool(result["tcp"] if self._key == "tcp" else result["alive"])

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Host and last round-trip time."""
        device = find_device(self.coordinator.store.model, self._device_id) or {}
        result = self._result or {}
        attrs: dict[str, Any] = {"host": device.get("host")}
        if self._key == "online":
            attrs["rtt_ms"] = result.get("rtt_ms")
        return attrs
