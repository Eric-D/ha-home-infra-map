"""Persistence of the Home Infra Map model in `.storage/home_infra_map`."""

from __future__ import annotations

import copy
import logging
from collections.abc import Callable
from typing import Any

import probatio as vol
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.storage import Store

from .const import STORAGE_KEY, STORAGE_MINOR_VERSION, STORAGE_VERSION
from .models import JsonDict, empty_model, validate_boards, validate_boxes, validate_model, validate_network

_LOGGER = logging.getLogger(__name__)

type ModelListener = Callable[[JsonDict, int], None]


class RevisionConflictError(Exception):
    """Raised when a save is based on an outdated revision."""

    def __init__(self, current: int) -> None:
        """Remember the current revision for the client."""
        super().__init__(f"model changed since it was loaded (current revision {current})")
        self.current = current


def migrate_document(old_major: int, old_minor: int, data: JsonDict) -> JsonDict:
    """Migrate a stored document to the current version.

    Pure function so it can be unit-tested without Home Assistant.

    History:
    - 1.1: devices carried `port_auto: bool`; replaced by `port_source`.
    - 1.2: current (boxes added without a version bump: missing = []).
    """
    if old_major > STORAGE_VERSION:
        raise NotImplementedError(f"storage version {old_major} is newer than supported")
    data = copy.deepcopy(data)
    if old_major == 1 and old_minor < 2:
        for device in (data.get("model", {}).get("network", {}) or {}).get("devices", []) or []:
            if "port_auto" in device:
                device["port_source"] = "auto" if device.pop("port_auto") else "manual"
    return data


class _VersionedStore(Store[JsonDict]):
    async def _async_migrate_func(
        self, old_major_version: int, old_minor_version: int, old_data: JsonDict
    ) -> JsonDict:
        return migrate_document(old_major_version, old_minor_version, old_data)


class ModelStore:
    """Holds the model in memory and persists it atomically."""

    def __init__(self, hass: HomeAssistant, house_name: str = "") -> None:
        """Initialise the store."""
        self.hass = hass
        self._store = _VersionedStore(hass, STORAGE_VERSION, STORAGE_KEY, minor_version=STORAGE_MINOR_VERSION)
        self._house_name = house_name
        self._model: JsonDict = empty_model(house_name)
        self._revision = 0
        # Per-section revisions guard user edits. Automatic updates (detected
        # switch port) bump only the global revision, so a background SNMP
        # refresh never makes an edit in progress fail with a conflict.
        self._section_revisions: dict[str, int] = {"boards": 0, "network": 0, "house_name": 0, "boxes": 0}
        self._listeners: list[ModelListener] = []

    @property
    def model(self) -> JsonDict:
        """Return the live model. Callers must not mutate it."""
        return self._model

    @property
    def revision(self) -> int:
        """Return the global revision counter, bumped on each change."""
        return self._revision

    @property
    def section_revisions(self) -> dict[str, int]:
        """Return the per-section revisions used for conflict detection."""
        return dict(self._section_revisions)

    async def async_load(self) -> None:
        """Load the model from disk; an unreadable model never blocks startup."""
        data = await self._store.async_load()
        if not data:
            self._model = empty_model(self._house_name)
            return
        try:
            self._model = validate_model(data.get("model", {}))
        except vol.Invalid:
            _LOGGER.exception(
                "Stored Home Infra Map model is invalid; starting from an empty model. "
                "The previous file is kept as a backup"
            )
            backup = Store[JsonDict](self.hass, 1, f"{STORAGE_KEY}.invalid_backup")
            await backup.async_save(data)
            self._model = empty_model(self._house_name)
        self._revision = int(data.get("revision", 0))
        stored = data.get("section_revisions") or {}
        for key in self._section_revisions:
            self._section_revisions[key] = int(stored.get(key, 0))
        if not self._model["house_name"]:
            self._model["house_name"] = self._house_name

    async def _async_commit(self, model: JsonDict, sections: tuple[str, ...] = ()) -> None:
        self._model = model
        self._revision += 1
        for section in sections:
            self._section_revisions[section] += 1
        await self._store.async_save(
            {
                "revision": self._revision,
                "section_revisions": self._section_revisions,
                "model": self._model,
            }
        )
        for listener in list(self._listeners):
            try:
                listener(self._model, self._revision)
            except Exception:
                _LOGGER.exception("Error in model listener")

    async def async_save_section(self, section: str, value: Any, expected_revision: int | None) -> JsonDict:
        """Validate and replace one section of the model."""
        if section not in self._section_revisions:
            raise vol.Invalid(f"unknown section: {section}")
        current = self._section_revisions[section]
        if expected_revision is not None and expected_revision != current:
            raise RevisionConflictError(current)
        model = copy.deepcopy(self._model)
        if section == "boards":
            model["boards"] = validate_boards(value)
            # deleted circuits disappear from the boxes too
            model["boxes"] = validate_boxes(model["boxes"], model["boards"])
        elif section == "boxes":
            model["boxes"] = validate_boxes(value, model["boards"])
        elif section == "network":
            model["network"] = validate_network(value)
        else:
            model["house_name"] = str(value or "").strip()
        await self._async_commit(model, (section,))
        return self._model

    async def async_replace(self, value: Any) -> JsonDict:
        """Replace the whole model (import)."""
        model = validate_model(value)
        await self._async_commit(model, tuple(self._section_revisions))
        return self._model

    async def async_update_devices(self, updates: dict[str, JsonDict]) -> bool:
        """Apply automatic field updates to devices (e.g. detected port).

        Used by coordinators; no revision check because the change is
        computed from the current model. Returns True if something changed.
        """
        model = copy.deepcopy(self._model)
        changed = False
        for device in model["network"]["devices"]:
            patch = updates.get(device["id"])
            if not patch:
                continue
            for key, val in patch.items():
                if device.get(key) != val:
                    device[key] = val
                    changed = True
        if changed:
            await self._async_commit(validate_model(model))
        return changed

    @callback
    def async_add_listener(self, listener: ModelListener) -> Callable[[], None]:
        """Register a listener called after each change."""
        self._listeners.append(listener)

        @callback
        def _remove() -> None:
            if listener in self._listeners:
                self._listeners.remove(listener)

        return _remove
