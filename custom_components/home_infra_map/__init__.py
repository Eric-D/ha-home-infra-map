"""Home Infra Map: electrical boards and home network, documented and monitored."""

from __future__ import annotations

import asyncio
import logging
from pathlib import Path
from typing import Any

import homeassistant.helpers.config_validation as cv
import probatio as vol
from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry, ConfigEntryState
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse, callback
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError, Unauthorized
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.start import async_at_started
from homeassistant.helpers.typing import ConfigType

from .const import (
    CARD_FILENAME,
    CARD_RESOURCE_URL,
    CARD_URL,
    CONF_HOUSE_NAME,
    CONF_IMPORT_FROM_OPNSENSE,
    CONF_OPNSENSE,
    CONF_SNMP_SOURCES,
    DOMAIN,
)
from .coordinator import (
    HomeInfraMapConfigEntry,
    OpnsenseCoordinator,
    PingCoordinator,
    RuntimeData,
    SnmpCoordinator,
    build_opnsense_client,
)
from .entity import PlannedEntity, entity_plan
from .importer import ImportError_, export_document, parse_document
from .models import JsonDict
from .photos import PhotoView, async_import_photo
from .snmp import SnmpClient
from .store import ModelStore
from .websocket import async_register_websocket

_LOGGER = logging.getLogger(__name__)

PLATFORMS: list[Platform] = [Platform.BINARY_SENSOR, Platform.SENSOR]

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

SERVICE_IMPORT_YAML = "import_yaml"
SERVICE_EXPORT_YAML = "export_yaml"
SERVICE_REFRESH = "refresh"
SERVICE_GENERATE_DASHBOARD = "generate_dashboard"
_DATA_SETUP = f"{DOMAIN}_setup_done"


# ---------------------------------------------------------------------------
# Card loading.
#
# The card is declared as a *Lovelace resource*, not via add_extra_js_url:
# Home Assistant installs @webcomponents/scoped-custom-element-registry, which
# replaces window.customElements with its own table. A module injected with
# add_extra_js_url can run before the polyfill; its definition then lands in
# the native registry, invisible to HA ("Custom element doesn't exist"),
# intermittently and mostly on fast loads. Lovelace resources are loaded by
# the panel, after the polyfill. add_extra_js_url is only the fallback when
# resources are not editable (YAML mode). See CONTRIBUTING.md.
# ---------------------------------------------------------------------------


def _get_lovelace_resources(hass: HomeAssistant) -> Any:
    lovelace = hass.data.get("lovelace")
    resources = getattr(lovelace, "resources", None)
    if resources is None or getattr(resources, "store", None) is None:
        return None
    return resources


async def _async_register_lovelace_resource(hass: HomeAssistant) -> bool:
    try:
        resources = _get_lovelace_resources(hass)
        if resources is None:
            return False
        if not resources.loaded:
            await resources.async_get_info()
        for item in resources.async_items():
            url = str(item.get("url", ""))
            if url.split("?", maxsplit=1)[0] != CARD_URL:
                continue
            if url != CARD_RESOURCE_URL:
                await resources.async_update_item(item["id"], {"url": CARD_RESOURCE_URL})
                _LOGGER.info("Lovelace resource updated: %s", CARD_RESOURCE_URL)
            return True
        await resources.async_create_item({"res_type": "module", "url": CARD_RESOURCE_URL})
        _LOGGER.info("Lovelace resource registered: %s", CARD_RESOURCE_URL)
        return True
    except Exception:
        # Never block the integration setup because of the card.
        _LOGGER.exception("Could not register the Lovelace resource")
        return False


async def _async_setup_card(hass: HomeAssistant) -> None:
    if await _async_register_lovelace_resource(hass):
        return
    _LOGGER.warning(
        "Lovelace resources are not editable (YAML mode?): falling back to "
        "add_extra_js_url. For a reliable load declare the resource yourself: "
        "url %s, type module",
        CARD_RESOURCE_URL,
    )
    add_extra_js_url(hass, CARD_RESOURCE_URL)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register the card, the websocket API, the photo view and services."""
    if hass.data.get(_DATA_SETUP):
        return True
    hass.data[_DATA_SETUP] = True

    card_path = Path(__file__).parent / "www" / CARD_FILENAME
    if card_path.is_file():
        await hass.http.async_register_static_paths(
            [StaticPathConfig(CARD_URL, str(card_path), cache_headers=False)]
        )
        # Register right away: lovelace is a dependency of frontend (ours), so
        # its resource collection already exists. Waiting for "started" left a
        # window where HA already serves the UI (HTTP is up during startup):
        # a page opened then loads the resource list without the card and
        # never reloads it, showing "Configuration error" until a refresh
        # (reproduced with Playwright on a fresh instance).
        if not await _async_register_lovelace_resource(hass):
            async_at_started(hass, _async_setup_card)
    else:
        _LOGGER.error("Card file missing (%s): reinstall the integration from HACS", card_path)

    hass.http.register_view(PhotoView())
    async_register_websocket(hass)
    _register_services(hass)
    return True


# ---------------------------------------------------------------------------
# Config entry
# ---------------------------------------------------------------------------


def loaded_entry(hass: HomeAssistant) -> HomeInfraMapConfigEntry:
    """Return the loaded config entry or raise a user-facing error."""
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.state is ConfigEntryState.LOADED and getattr(entry, "runtime_data", None):
            return entry
    raise ServiceValidationError(translation_domain=DOMAIN, translation_key="not_configured")


def snmp_switch_ids(runtime: RuntimeData) -> set[str]:
    """Ids of the model switches fed by an SNMP source."""
    ids = set()
    for coord in runtime.snmp.values():
        if (sw := coord.switch()) is not None:
            ids.add(sw["id"])
    return ids


def current_plan(hass: HomeAssistant, entry: HomeInfraMapConfigEntry) -> list[PlannedEntity]:
    """Entities the model currently calls for."""
    runtime = entry.runtime_data
    return entity_plan(
        hass,
        entry.entry_id,
        runtime.store.model,
        snmp_switch_ids=snmp_switch_ids(runtime),
        has_snmp=bool(runtime.snmp),
        has_firewall=runtime.opnsense is not None and runtime.opnsense.firewall_enabled,
    )


@callback
def _cleanup_registries(hass: HomeAssistant, entry: HomeInfraMapConfigEntry) -> None:
    """Remove entities and devices the model no longer calls for."""
    plan = current_plan(hass, entry)
    expected = {p.unique_id for p in plan}
    ent_reg = er.async_get(hass)
    for ent in er.async_entries_for_config_entry(ent_reg, entry.entry_id):
        if ent.unique_id not in expected:
            ent_reg.async_remove(ent.entity_id)
    model = entry.runtime_data.store.model
    owners = {f"{entry.entry_id}_{d['id']}" for d in model["network"]["devices"]}
    owners |= {f"{entry.entry_id}_switch_{s['id']}" for s in model["network"]["switches"]}
    owners |= {f"{entry.entry_id}_board_{b['id']}" for b in model["boards"]}
    dev_reg = dr.async_get(hass)
    for device in dr.async_entries_for_config_entry(dev_reg, entry.entry_id):
        idents = {i[1] for i in device.identifiers if i[0] == DOMAIN}
        if idents and not idents & owners:
            dev_reg.async_update_device(device.id, remove_config_entry_id=entry.entry_id)


async def async_setup_entry(hass: HomeAssistant, entry: HomeInfraMapConfigEntry) -> bool:
    """Set up from a config entry. Never fails because a source is down."""
    store = ModelStore(hass, entry.data.get(CONF_HOUSE_NAME, ""))
    await store.async_load()

    ping = PingCoordinator(hass, entry, store)
    runtime = RuntimeData(store=store, ping=ping)
    entry.runtime_data = runtime

    if opn_conf := entry.options.get(CONF_OPNSENSE):
        runtime.opnsense = OpnsenseCoordinator(hass, entry, build_opnsense_client(hass, opn_conf))
    for source in entry.options.get(CONF_SNMP_SOURCES, []):
        client = SnmpClient(source, hass.async_add_executor_job)
        runtime.snmp[source["id"]] = SnmpCoordinator(hass, entry, source, client, store)

    # async_refresh (not async_config_entry_first_refresh): an unreachable
    # router or switch must leave the documentation usable; only the related
    # entities become unavailable.
    await ping.async_refresh()
    if runtime.opnsense:
        await runtime.opnsense.async_refresh()
    for coord in runtime.snmp.values():
        await coord.async_refresh()

    if entry.data.get(CONF_IMPORT_FROM_OPNSENSE):
        await _async_initial_opnsense_import(hass, entry)

    _cleanup_registries(hass, entry)
    lock = asyncio.Lock()

    async def _async_apply_model() -> None:
        # Serialised: two quick edits must not add the same entity twice.
        async with lock:
            for coord in runtime.snmp.values():
                await coord.async_resync()
            for sync in runtime.platform_syncs:
                await sync.async_sync()
            _cleanup_registries(hass, entry)
        # Direct refresh, not the debounced request: new devices must get a
        # state right away instead of staying unavailable for a cooldown.
        await ping.async_refresh()

    @callback
    def _on_model_change(_model: JsonDict, _revision: int) -> None:
        if entry.state is ConfigEntryState.LOADED:
            entry.async_create_task(hass, _async_apply_model(), f"{DOMAIN} apply model")

    entry.async_on_unload(store.async_add_listener(_on_model_change))
    entry.async_on_unload(entry.add_update_listener(_async_update_listener))
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def _async_initial_opnsense_import(hass: HomeAssistant, entry: HomeInfraMapConfigEntry) -> None:
    """One-shot import chosen at the end of the config flow."""
    from .websocket import apply_opnsense_import, opnsense_proposals

    runtime = entry.runtime_data
    if runtime.opnsense is None or not runtime.opnsense.data:
        return  # router down: keep the flag, retry at next start
    proposals = opnsense_proposals(entry)
    network = apply_opnsense_import(
        runtime.store.model["network"],
        proposals,
        [v["interface"] for v in proposals["vlans"]],
        [d["key"] for d in proposals["devices"]],
    )
    await runtime.store.async_save_section("network", network, None)
    hass.config_entries.async_update_entry(entry, data={**entry.data, CONF_IMPORT_FROM_OPNSENSE: False})
    _LOGGER.info(
        "Imported %d VLANs and %d devices from OPNsense", len(proposals["vlans"]), len(proposals["devices"])
    )


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Reload when options (sources, intervals) change."""
    hass.config_entries.async_schedule_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: HomeInfraMapConfigEntry) -> bool:
    """Unload a config entry."""
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)


async def async_remove_config_entry_device(
    hass: HomeAssistant, entry: ConfigEntry, device_entry: dr.DeviceEntry
) -> bool:
    """Devices are managed from the card; allow removing stale ones."""
    return True


# ---------------------------------------------------------------------------
# Services
# ---------------------------------------------------------------------------

IMPORT_SCHEMA = vol.Schema({vol.Required("path"): cv.string})
EXPORT_SCHEMA = vol.Schema({vol.Optional("path"): cv.string})


def _config_path(hass: HomeAssistant, path: str) -> Path:
    """Resolve a path inside /config, refusing anything outside."""
    config_dir = Path(hass.config.config_dir).resolve()
    candidate = Path(path)
    if not candidate.is_absolute():
        candidate = config_dir / candidate
    resolved = candidate.resolve()
    if config_dir not in (resolved, *resolved.parents):
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="path_outside_config",
            translation_placeholders={"path": path},
        )
    return resolved


async def async_import_text(
    hass: HomeAssistant,
    entry: HomeInfraMapConfigEntry,
    text: str,
    source_dir: Path | None = None,
) -> JsonDict:
    """Import a YAML document into the model; returns a summary."""
    from homeassistant.helpers import area_registry as ar

    areas = ar.async_get(hass)

    def resolve_area(name: str) -> str | None:
        area = areas.async_get_area_by_name(name)
        return area.id if area else None

    try:
        result = parse_document(text, resolve_area)
    except (ImportError_, vol.Invalid) as err:
        raise ServiceValidationError(
            translation_domain=DOMAIN,
            translation_key="import_failed",
            translation_placeholders={"error": str(err)},
        ) from err
    store = entry.runtime_data.store
    model = {**store.model}
    if result.boards is not None:
        boards = result.boards
        if source_dir is not None:
            for board in boards:
                rel = result.photos.get(board["id"])
                if rel:
                    board["photo_path"] = await async_import_photo(hass, source_dir / rel, board["id"])
        model["boards"] = boards
    if result.network is not None:
        model["network"] = result.network
    if result.house_name:
        model["house_name"] = result.house_name
    await store.async_replace(model)
    network = store.model["network"]
    return {
        "sections": result.sections,
        "boards": len(store.model["boards"]),
        "rows": sum(len(b["rows"]) for b in store.model["boards"]),
        "modules": sum(len(r["modules"]) for b in store.model["boards"] for r in b["rows"]),
        "vlans": len(network["vlans"]),
        "devices": len(network["devices"]),
        "switches": len(network["switches"]),
    }


async def _require_admin(hass: HomeAssistant, call: ServiceCall) -> None:
    """Writing services are reserved to administrators (system calls allowed)."""
    if call.context.user_id is None:
        return
    user = await hass.auth.async_get_user(call.context.user_id)
    if user is None or not user.is_admin:
        raise Unauthorized(context=call.context)


def _register_services(hass: HomeAssistant) -> None:
    async def _import(call: ServiceCall) -> ServiceResponse:
        await _require_admin(hass, call)
        entry = loaded_entry(hass)
        path = _config_path(hass, call.data["path"])

        def _read() -> str:
            return path.read_text(encoding="utf-8")

        try:
            text = await hass.async_add_executor_job(_read)
        except OSError as err:
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="file_unreadable",
                translation_placeholders={"path": str(call.data["path"])},
            ) from err
        return await async_import_text(hass, entry, text, path.parent)

    async def _export(call: ServiceCall) -> ServiceResponse:
        if call.data.get("path"):
            await _require_admin(hass, call)
        entry = loaded_entry(hass)
        text = export_document(entry.runtime_data.store.model)
        response: JsonDict = {"yaml": text}
        if call.data.get("path"):
            path = _config_path(hass, call.data["path"])

            def _write() -> None:
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(text, encoding="utf-8")

            try:
                await hass.async_add_executor_job(_write)
            except OSError as err:
                raise HomeAssistantError(f"cannot write {path}: {err}") from err
            response["path"] = str(path)
        return response

    async def _generate_dashboard(call: ServiceCall) -> ServiceResponse:
        from .websocket import dashboard_for

        entry = loaded_entry(hass)
        text = dashboard_for(hass, entry)
        response: JsonDict = {"yaml": text}
        if call.data.get("path"):
            await _require_admin(hass, call)
            path = _config_path(hass, call.data["path"])

            def _write() -> None:
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(text, encoding="utf-8")

            await hass.async_add_executor_job(_write)
            response["path"] = str(path)
        return response

    async def _refresh(call: ServiceCall) -> None:
        runtime = loaded_entry(hass).runtime_data
        await runtime.ping.async_request_refresh()
        if runtime.opnsense:
            await runtime.opnsense.async_request_refresh()
        for coord in runtime.snmp.values():
            await coord.async_request_refresh()
        runtime.firewall_cache.clear()

    hass.services.async_register(
        DOMAIN,
        SERVICE_IMPORT_YAML,
        _import,
        schema=IMPORT_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_EXPORT_YAML,
        _export,
        schema=EXPORT_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_GENERATE_DASHBOARD,
        _generate_dashboard,
        schema=EXPORT_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(DOMAIN, SERVICE_REFRESH, _refresh)
