"""Integration setup, entities, services, robustness, diagnostics."""

from __future__ import annotations

import json
import shutil
from pathlib import Path
from typing import Any
from unittest.mock import AsyncMock, patch

import pytest
from freezegun.api import FrozenDateTimeFactory
from homeassistant.config_entries import ConfigEntryState
from homeassistant.const import STATE_UNAVAILABLE
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError, Unauthorized
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import issue_registry as ir
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockUser
from pytest_homeassistant_custom_component.components.diagnostics import (
    get_diagnostics_for_config_entry,
)
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker
from pytest_homeassistant_custom_component.typing import ClientSessionGenerator

from custom_components.home_infra_map.const import DOMAIN, EVENT_DEVICE_OFFLINE

from .conftest import FIXTURES, SECRETS, make_entry, mock_opnsense


async def _setup(hass: HomeAssistant, entry: Any) -> None:
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()


async def _import_examples(hass: HomeAssistant) -> None:
    target = Path(hass.config.config_dir) / "maison"
    target.mkdir(parents=True, exist_ok=True)
    for name in ("electricite.yaml", "reseau.yaml"):
        shutil.copy(FIXTURES / name, target / name)
    for name in ("electricite.yaml", "reseau.yaml"):
        await hass.services.async_call(DOMAIN, "import_yaml", {"path": f"maison/{name}"}, blocking=True)
    await hass.async_block_till_done()


async def test_setup_without_sources(hass: HomeAssistant, ping_ok: AsyncMock) -> None:
    entry = make_entry()
    await _setup(hass, entry)
    assert entry.state is ConfigEntryState.LOADED
    assert hass.services.has_service(DOMAIN, "import_yaml")
    response = await hass.services.async_call(DOMAIN, "export_yaml", {}, blocking=True, return_response=True)
    assert "boards: []" in response["yaml"]  # type: ignore[index]
    assert await hass.config_entries.async_unload(entry.entry_id)


async def test_import_examples_creates_entities(
    hass: HomeAssistant, ping_ok: AsyncMock, aioclient_mock: AiohttpClientMocker, snmp_ok: AsyncMock
) -> None:
    mock_opnsense(aioclient_mock)
    entry = make_entry(opnsense=True, snmp=True)
    await _setup(hass, entry)
    await _import_examples(hass)
    entry = hass.config_entries.async_get_entry(entry.entry_id)
    assert entry is not None and entry.state is ConfigEntryState.LOADED
    model = entry.runtime_data.store.model
    assert [len(b["rows"]) for b in model["boards"]] == [3, 1]
    assert len(model["network"]["vlans"]) == 6 and len(model["network"]["devices"]) == 18

    online = hass.states.get("binary_sensor.home_infra_map_station_meteo_wi_fi_en_ligne")
    assert online is not None and online.state == "on"
    camera = hass.states.get("binary_sensor.home_infra_map_sonnette_video_hors_ligne_en_ligne")
    assert camera is not None and camera.state == "off"
    blocks = hass.states.get("sensor.home_infra_map_station_meteo_wi_fi_blocages")
    assert blocks is not None and blocks.state == "3"
    port = hass.states.get("sensor.home_infra_map_station_meteo_wi_fi_port_switch")
    assert port is not None and port.state == "9"
    assert port.attributes["lldp_neighbor"] == "AP-Etage"
    for state in hass.states.async_all():
        for secret in SECRETS.values():
            assert secret not in json.dumps(dict(state.attributes), default=str)

    # switch ports: diagnostic, enabled only when used
    ent_reg = er.async_get(hass)
    p9 = ent_reg.async_get("sensor.home_infra_map_switch_principal_24_ports_poe_port_9")
    p5 = ent_reg.async_get("sensor.home_infra_map_switch_principal_24_ports_poe_port_5")
    assert p9 is not None and p9.disabled_by is None
    assert p5 is not None and p5.disabled_by is er.RegistryEntryDisabler.INTEGRATION
    assert hass.states.get(p9.entity_id).state == "up"  # type: ignore[union-attr]

    # device registry: MAC connection
    dev_reg = dr.async_get(hass)
    device = dev_reg.async_get_device_by_connection(
        (dr.CONNECTION_NETWORK_MAC, "02:00:5e:30:00:40"), entry.entry_id
    )
    assert device is not None and device.name.startswith("Station météo")


async def test_power_sum_entities(hass: HomeAssistant, ping_ok: AsyncMock) -> None:
    entry = make_entry()
    await _setup(hass, entry)
    hass.states.async_set("sensor.a", "100", {"unit_of_measurement": "W"})
    hass.states.async_set("sensor.b", "1.5", {"unit_of_measurement": "kW"})
    hass.states.async_set("sensor.c", "unavailable")
    store = entry.runtime_data.store
    boards = [
        {
            "name": "Tableau 1",
            "rows": [
                {
                    "label": "R1",
                    "modules": [
                        {"kind": "rcd", "ref": "T1-R1-ID"},
                        {"kind": "breaker", "ref": "T1-R1-1", "power_entity_id": "sensor.a"},
                        {"kind": "breaker", "ref": "T1-R1-2", "power_entity_id": "sensor.b"},
                    ],
                },
                {
                    "label": "R2",
                    "modules": [{"kind": "breaker", "ref": "T1-R2-1", "power_entity_id": "sensor.c"}],
                },
                {"label": "R3", "modules": [{"kind": "breaker", "ref": "T1-R3-1"}]},
            ],
        }
    ]
    await store.async_save_section("boards", boards, None)
    await hass.async_block_till_done()
    assert hass.states.get("sensor.home_infra_map_t1_r1_puissance").state == "1600.0"  # type: ignore[union-attr]
    assert hass.states.get("sensor.home_infra_map_t1_r2_puissance").state == STATE_UNAVAILABLE  # type: ignore[union-attr]
    assert hass.states.get("sensor.home_infra_map_t1_r3_puissance") is None
    total = hass.states.get("sensor.home_infra_map_t1_puissance")
    assert total is not None and total.state == "1600.0" and total.attributes["unit_of_measurement"] == "W"
    hass.states.async_set("sensor.c", "50", {"unit_of_measurement": "W"})
    await hass.async_block_till_done()
    assert hass.states.get("sensor.home_infra_map_t1_puissance").state == "1650.0"  # type: ignore[union-attr]

    # removing the link removes the entities (registry cleanup on reload)
    boards[0]["rows"] = boards[0]["rows"][2:]
    await store.async_save_section("boards", boards, None)
    await hass.async_block_till_done()
    assert er.async_get(hass).async_get("sensor.home_infra_map_t1_r1_puissance") is None


async def test_alerts_entity_follows_the_model(hass: HomeAssistant, ping_ok: AsyncMock) -> None:
    entry = make_entry()
    await _setup(hass, entry)
    store = entry.runtime_data.store
    module = {"kind": "breaker", "ref": "T1-R1-1", "circuit_name": "Éclairage"}
    boards = [{"name": "Tableau 1", "rows": [{"label": "R1", "modules": [module]}]}]
    await store.async_save_section("boards", boards, None)
    await hass.async_block_till_done()
    state = hass.states.get("sensor.home_infra_map_t1_alertes")
    assert state is not None and state.state == "0" and state.attributes["alerts"] == []

    module["alert"] = "Prise sur un circuit éclairage"
    boards[0]["supply"] = [
        {"kind": "main_breaker", "ref": "T1-AGCP", "alert": "Déclenche", "alert_level": "info"}
    ]
    await store.async_save_section("boards", boards, None)
    await hass.async_block_till_done()
    state = hass.states.get("sensor.home_infra_map_t1_alertes")
    assert state is not None and state.state == "2"
    assert state.attributes["warnings"] == 1
    assert state.attributes["alerts"] == [
        {"ref": "T1-AGCP", "text": "Déclenche", "level": "info"},
        {"ref": "T1-R1-1", "text": "Prise sur un circuit éclairage", "level": "warning"},
    ]


async def test_sources_down_do_not_break_setup(
    hass: HomeAssistant, ping_ok: AsyncMock, aioclient_mock: AiohttpClientMocker
) -> None:
    aioclient_mock.get("http://192.168.10.1:8443/api/diagnostics/interface/get_arp", exc=TimeoutError())
    with patch(
        "custom_components.home_infra_map.snmp.SnmpClient.snapshot", AsyncMock(side_effect=OSError("down"))
    ):
        entry = make_entry(opnsense=True, snmp=True)
        await _setup(hass, entry)
        await _import_examples(hass)
    assert entry.state is ConfigEntryState.LOADED
    runtime = entry.runtime_data
    assert runtime.opnsense is not None and not runtime.opnsense.last_update_success
    blocks = hass.states.get("sensor.home_infra_map_camera_entree_blocages")
    assert blocks is not None and blocks.state == STATE_UNAVAILABLE
    port = hass.states.get("sensor.home_infra_map_camera_entree_port_switch")
    assert port is not None and port.state == STATE_UNAVAILABLE
    # ping-based entities and documentation still work
    assert hass.states.get("binary_sensor.home_infra_map_camera_entree_en_ligne").state == "on"  # type: ignore[union-attr]
    assert len(runtime.store.model["boards"]) == 2


async def test_ping_unavailable_marks_entities_unavailable(hass: HomeAssistant) -> None:
    from custom_components.home_infra_map.ping import PingUnavailableError

    with patch(
        "custom_components.home_infra_map.coordinator.async_ping_hosts",
        AsyncMock(side_effect=PingUnavailableError("no icmp")),
    ):
        entry = make_entry()
        await _setup(hass, entry)
        await entry.runtime_data.store.async_save_section(
            "network",
            {
                "devices": [
                    {"name": "NAS", "host": "192.168.50.20", "monitor": {"ping": True, "latency": True}}
                ]
            },
            None,
        )
        await hass.async_block_till_done()
    assert hass.states.get("binary_sensor.home_infra_map_nas_en_ligne").state == STATE_UNAVAILABLE  # type: ignore[union-attr]
    assert hass.states.get("sensor.home_infra_map_nas_latence").state == STATE_UNAVAILABLE  # type: ignore[union-attr]


async def test_offline_alert_event_and_issue(hass: HomeAssistant, freezer: FrozenDateTimeFactory) -> None:
    alive = {"value": True}

    async def _ping(hosts: list[str]) -> dict[str, Any]:
        return {
            h: {"alive": alive["value"], "rtt_ms": 1.0 if alive["value"] else None, "ip": h} for h in hosts
        }

    events: list[Any] = []
    hass.bus.async_listen(EVENT_DEVICE_OFFLINE, events.append)
    with (
        patch("custom_components.home_infra_map.coordinator.async_ping_hosts", side_effect=_ping),
        patch("custom_components.home_infra_map.coordinator.time.monotonic") as mono,
        patch("custom_components.home_infra_map.coordinator.async_tcp_check", AsyncMock(return_value=False)),
    ):
        mono.return_value = 0.0
        entry = make_entry()
        await _setup(hass, entry)
        await entry.runtime_data.store.async_save_section(
            "network",
            {
                "devices": [
                    {
                        "id": "ap",
                        "name": "Point acces etage",
                        "host": "192.168.10.12",
                        "monitor": {"ping": True, "offline_alert_minutes": 5, "tcp_port": 8080},
                    }
                ]
            },
            None,
        )
        await hass.async_block_till_done()
        assert hass.states.get("binary_sensor.home_infra_map_point_acces_etage_port_8080").state == "off"  # type: ignore[union-attr]
        coordinator = hass.config_entries.async_get_entry(entry.entry_id).runtime_data.ping  # type: ignore[union-attr]
        alive["value"] = False
        await coordinator.async_refresh()
        mono.return_value = 6 * 60.0
        await coordinator.async_refresh()
        await hass.async_block_till_done()
        assert len(events) == 1 and events[0].data["name"] == "Point acces etage"
        assert ir.async_get(hass).async_get_issue(DOMAIN, "offline_ap") is not None
        await coordinator.async_refresh()
        assert len(events) == 1  # only once
        alive["value"] = True
        await coordinator.async_refresh()
        assert ir.async_get(hass).async_get_issue(DOMAIN, "offline_ap") is None


async def test_services_errors_and_admin(
    hass: HomeAssistant, ping_ok: AsyncMock, hass_read_only_user: MockUser
) -> None:
    from homeassistant.core import Context

    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(DOMAIN, "export_yaml", {}, blocking=True, return_response=True)
    entry = make_entry()
    await _setup(hass, entry)
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(DOMAIN, "import_yaml", {"path": "../etc/passwd"}, blocking=True)
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(DOMAIN, "import_yaml", {"path": "missing.yaml"}, blocking=True)
    bad = Path(hass.config.config_dir) / "bad.yaml"
    bad.parent.mkdir(parents=True, exist_ok=True)
    bad.write_text("foo: 1")
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(DOMAIN, "import_yaml", {"path": "bad.yaml"}, blocking=True)
    with pytest.raises(Unauthorized):
        await hass.services.async_call(
            DOMAIN,
            "import_yaml",
            {"path": "bad.yaml"},
            blocking=True,
            context=Context(user_id=hass_read_only_user.id),
        )
    response = await hass.services.async_call(
        DOMAIN, "export_yaml", {"path": "home_infra_map/export.yaml"}, blocking=True, return_response=True
    )
    assert Path(response["path"]).is_file()  # type: ignore[index]
    response = await hass.services.async_call(
        DOMAIN,
        "generate_dashboard",
        {"path": "home_infra_map/dash.yaml"},
        blocking=True,
        return_response=True,
    )
    assert "custom:home-infra-map-card" in response["yaml"]  # type: ignore[index]
    await hass.services.async_call(DOMAIN, "refresh", {}, blocking=True)


async def test_import_copies_photo_without_metadata(hass: HomeAssistant, ping_ok: AsyncMock) -> None:
    from PIL import Image

    entry = make_entry()
    await _setup(hass, entry)
    folder = Path(hass.config.config_dir) / "maison"
    (folder / "photos").mkdir(parents=True, exist_ok=True)
    shutil.copy(FIXTURES / "electricite.yaml", folder / "electricite.yaml")
    img = Image.new("RGB", (4000, 100), "white")
    exif = Image.Exif()
    exif[272] = "Phone"
    img.save(folder / "photos" / "tableau_principal.jpg", exif=exif)
    await hass.services.async_call(DOMAIN, "import_yaml", {"path": "maison/electricite.yaml"}, blocking=True)
    board = entry.runtime_data.store.model["boards"][0]
    assert board["photo_path"].startswith(board["id"] + ".jpg?v=")
    stored = Path(hass.config.path("home_infra_map/photos", f"{board['id']}.jpg"))
    with Image.open(stored) as out:
        assert max(out.size) == 2400 and not out.getexif()


async def test_photo_view(
    hass: HomeAssistant,
    ping_ok: AsyncMock,
    hass_client: ClientSessionGenerator,
    hass_read_only_user: MockUser,
) -> None:
    import io

    from PIL import Image

    await async_setup_component(hass, "http", {})
    entry = make_entry()
    await _setup(hass, entry)
    client = await hass_client()
    buf = io.BytesIO()
    Image.new("RGB", (10, 10)).save(buf, format="PNG")
    resp = await client.post("/api/home_infra_map/photo/board1", data={"file": buf.getvalue()})
    assert resp.status == 200
    assert (await resp.json())["photo_path"].startswith("board1.jpg")
    resp = await client.get("/api/home_infra_map/photo/board1")
    assert resp.status == 200 and resp.headers["Content-Type"] == "image/jpeg"
    assert (await client.get("/api/home_infra_map/photo/none")).status == 404
    assert (await client.get("/api/home_infra_map/photo/..%2Fx")).status in (400, 404)
    resp = await client.post("/api/home_infra_map/photo/board1", data={"file": b"not an image"})
    assert resp.status == 400
    resp = await client.post("/api/home_infra_map/photo/board1", data={"other": b"x"})
    assert resp.status == 400


async def test_diagnostics_have_no_secret(
    hass: HomeAssistant,
    ping_ok: AsyncMock,
    aioclient_mock: AiohttpClientMocker,
    snmp_ok: AsyncMock,
    hass_client: ClientSessionGenerator,
) -> None:
    mock_opnsense(aioclient_mock)
    await async_setup_component(hass, "diagnostics", {})
    entry = make_entry(opnsense=True, snmp=True)
    await _setup(hass, entry)
    diag = await get_diagnostics_for_config_entry(hass, hass_client, entry)
    text = json.dumps(diag)
    for secret in SECRETS.values():
        assert secret not in text
    assert "192.168.10.1:8443" not in text
    assert diag["coordinators"]["opnsense"]["last_update_success"] is True


async def test_initial_opnsense_import(
    hass: HomeAssistant, ping_ok: AsyncMock, aioclient_mock: AiohttpClientMocker
) -> None:
    mock_opnsense(aioclient_mock)
    entry = make_entry(opnsense=True)
    hass.config_entries.async_update_entry  # noqa: B018
    entry = type(entry)(
        domain=DOMAIN,
        unique_id=DOMAIN,
        data={"house_name": "M", "import_from_opnsense": True},
        options=entry.options,
    )
    await _setup(hass, entry)
    network = entry.runtime_data.store.model["network"]
    assert len(network["vlans"]) == 6  # 7 interfaces minus WAN
    assert len(network["devices"]) == 13
    assert entry.data["import_from_opnsense"] is False
    objets = next(v for v in network["vlans"] if v["name"] == "Objets")
    assert objets["tag"] == 30 and objets["subnet"] == "192.168.30.0/24"
