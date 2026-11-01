"""Websocket API: payloads, detection, admin enforcement."""

from __future__ import annotations

from pathlib import Path
from typing import Any
from unittest.mock import AsyncMock

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockUser
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.home_infra_map.const import DOMAIN

from .conftest import fixture_text, make_entry, mock_opnsense


@pytest.fixture
async def loaded(
    hass: HomeAssistant, ping_ok: AsyncMock, aioclient_mock: AiohttpClientMocker, snmp_ok: AsyncMock
) -> Any:
    mock_opnsense(aioclient_mock)
    entry = make_entry(opnsense=True, snmp=True)
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def _ws(client: Any, msg: dict[str, Any]) -> dict[str, Any]:
    """Send a command and return its result, skipping subscription events."""
    await client.send_json_auto_id(msg)
    while True:
        resp = await client.receive_json()
        if resp.get("type") == "result":
            return resp


async def test_not_configured(hass: HomeAssistant, hass_ws_client: WebSocketGenerator) -> None:
    from homeassistant.setup import async_setup_component

    assert await async_setup_component(hass, DOMAIN, {})
    client = await hass_ws_client(hass)
    resp = await _ws(client, {"type": f"{DOMAIN}/get"})
    assert resp["error"]["code"] == "not_configured"


async def test_get_subscribe_save(
    hass: HomeAssistant, loaded: Any, hass_ws_client: WebSocketGenerator
) -> None:
    client = await hass_ws_client(hass)
    resp = await _ws(client, {"type": f"{DOMAIN}/get"})
    assert resp["success"]
    result = resp["result"]
    assert result["settings"]["sources"]["opnsense"] is True
    assert result["live"]["opnsense"]["gateways"][0]["name"] == "WAN_DHCP"
    assert "api_key" not in str(result) and "KEY-SHOULD-NOT-LEAK" not in str(result)
    # the SNMP source created its switch in the model
    assert result["model"]["network"]["switches"][0]["name"] == "SW-DEMO-24P"

    sub = await _ws(client, {"type": f"{DOMAIN}/subscribe"})
    assert sub["success"]
    rev = result["section_revisions"]["boards"]
    saved = await _ws(
        client,
        {
            "type": f"{DOMAIN}/save",
            "section": "boards",
            "data": [{"name": "Tableau 1"}],
            "expected_revision": rev,
        },
    )
    assert saved["success"], saved
    await hass.async_block_till_done()
    assert loaded.runtime_data.store.model["boards"][0]["name"] == "Tableau 1"

    stale = await _ws(
        client, {"type": f"{DOMAIN}/save", "section": "boards", "data": [], "expected_revision": rev}
    )
    assert stale["error"]["code"] == "conflict"
    bad = await _ws(client, {"type": f"{DOMAIN}/save", "section": "boards", "data": [{"name": ""}]})
    assert bad["error"]["code"] == "invalid_format"


async def test_non_admin_cannot_edit(
    hass: HomeAssistant, loaded: Any, hass_ws_client: WebSocketGenerator, hass_read_only_access_token: str
) -> None:
    client = await hass_ws_client(hass, hass_read_only_access_token)
    assert (await _ws(client, {"type": f"{DOMAIN}/get"}))["success"]
    assert (await _ws(client, {"type": f"{DOMAIN}/checks"}))["success"]
    for msg in (
        {"type": f"{DOMAIN}/save", "section": "boards", "data": []},
        {"type": f"{DOMAIN}/probe", "host": "192.168.30.40"},
        {"type": f"{DOMAIN}/import_opnsense"},
        {"type": f"{DOMAIN}/import_yaml", "content": "boards: []"},
    ):
        resp = await _ws(client, msg)
        assert resp["error"]["code"] == "unauthorized", msg
    assert loaded.runtime_data.store.revision >= 0


async def test_add_device_by_ip_detects_everything(
    hass: HomeAssistant, loaded: Any, hass_ws_client: WebSocketGenerator
) -> None:
    client = await hass_ws_client(hass)
    await _ws(client, {"type": f"{DOMAIN}/import_yaml", "content": fixture_text("reseau.yaml")})
    await hass.async_block_till_done()
    probe = (await _ws(client, {"type": f"{DOMAIN}/probe", "host": "192.168.30.40"}))["result"]
    assert probe["ping"] == {"alive": True, "rtt_ms": 4.0, "ip": "192.168.30.40"}
    assert probe["vlan"]["name"] == "Objets" and probe["vlan"]["subnet"] == "192.168.30.0/24"
    assert probe["mac"] == {"value": "02:00:5e:30:00:40", "source": "arp"}
    assert probe["port"]["port"] == 9 and probe["port"]["via"] == "AP-Etage"

    device = {"name": "Station meteo", "host": "192.168.30.40", "monitor": {"ping": True, "latency": True}}
    preview = (await _ws(client, {"type": f"{DOMAIN}/preview_entities", "device": device}))["result"]
    ids = {p["key"]: p["entity_id"] for p in preview}
    assert ids["online"] == "binary_sensor.home_infra_map_station_meteo_en_ligne"
    assert ids["latency"] == "sensor.home_infra_map_station_meteo_latence"

    get = (await _ws(client, {"type": f"{DOMAIN}/get"}))["result"]
    network = get["model"]["network"]
    network["devices"].append({**device, "mac": probe["mac"]["value"], "vlan_id": probe["vlan"]["vlan_id"]})
    saved = await _ws(
        client,
        {
            "type": f"{DOMAIN}/save",
            "section": "network",
            "data": network,
            "expected_revision": get["section_revisions"]["network"],
        },
    )
    assert saved["success"], saved
    await hass.async_block_till_done()
    for entity_id in ids.values():
        state = hass.states.get(entity_id)
        assert state is not None, entity_id
    assert hass.states.get(ids["online"]).state == "on"  # type: ignore[union-attr]
    assert hass.states.get(ids["latency"]).state == "4.0"  # type: ignore[union-attr]
    port = hass.states.get("sensor.home_infra_map_station_meteo_port_switch")
    assert port is not None and port.state == "9"  # detected by the SNMP refresh

    bad = await _ws(client, {"type": f"{DOMAIN}/preview_entities", "device": {"mac": "zz"}})
    assert bad["error"]["code"] == "invalid_format"


async def test_import_opnsense_preview_then_apply(
    hass: HomeAssistant, loaded: Any, hass_ws_client: WebSocketGenerator
) -> None:
    client = await hass_ws_client(hass)
    preview = (await _ws(client, {"type": f"{DOMAIN}/import_opnsense"}))["result"]
    assert len(preview["vlans"]) == 6 and len(preview["devices"]) == 13
    assert loaded.runtime_data.store.model["network"]["devices"] == []  # nothing written yet
    keys = [d["key"] for d in preview["devices"][:3]]
    applied = await _ws(
        client, {"type": f"{DOMAIN}/import_opnsense", "apply": True, "vlans": ["opt3"], "devices": keys}
    )
    assert applied["success"]
    network = loaded.runtime_data.store.model["network"]
    assert [v["name"] for v in network["vlans"]] == ["Objets"]
    assert len(network["devices"]) == 3
    assert all(d["monitor"]["ping"] and not d["monitor"]["latency"] for d in network["devices"])
    again = (await _ws(client, {"type": f"{DOMAIN}/import_opnsense"}))["result"]
    assert sum(d["exists"] for d in again["devices"]) == 3
    assert next(v for v in again["vlans"] if v["interface"] == "opt3")["existing_id"]
    applied = await _ws(
        client,
        {"type": f"{DOMAIN}/import_opnsense", "apply": True, "vlans": ["opt3"], "expected_revision": -1},
    )
    assert applied["error"]["code"] == "conflict"


async def test_firewall_command(hass: HomeAssistant, loaded: Any, hass_ws_client: WebSocketGenerator) -> None:
    client = await hass_ws_client(hass)
    await _ws(client, {"type": f"{DOMAIN}/import_yaml", "content": fixture_text("reseau.yaml")})
    model = loaded.runtime_data.store.model
    station = next(d for d in model["network"]["devices"] if d["host"] == "192.168.30.40")
    resp = (await _ws(client, {"type": f"{DOMAIN}/firewall", "device_id": station["id"]}))["result"]
    assert resp["available"]
    assert [r["specific"] for r in resp["outbound"]["rules"]] == [False, False, False, False, True, False]
    assert resp["blocks"][0]["dns_name"] == "firmware.example.net"
    assert resp["blocks_24h"] == 3
    cached = (await _ws(client, {"type": f"{DOMAIN}/firewall", "device_id": station["id"]}))["result"]
    assert cached == resp
    missing = await _ws(client, {"type": f"{DOMAIN}/firewall", "device_id": "nope"})
    assert missing["error"]["code"] == "not_found"


async def test_firewall_unavailable_cases(
    hass: HomeAssistant, ping_ok: AsyncMock, hass_ws_client: WebSocketGenerator
) -> None:
    entry = make_entry()
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await entry.runtime_data.store.async_save_section(
        "network", {"devices": [{"id": "d", "name": "D", "host": "nas.lan"}]}, None
    )
    client = await hass_ws_client(hass)
    resp = (await _ws(client, {"type": f"{DOMAIN}/firewall", "device_id": "d"}))["result"]
    assert resp == {"available": False, "reason": "not_configured"}
    resp = await _ws(client, {"type": f"{DOMAIN}/import_opnsense"})
    assert resp["error"]["code"] == "not_configured"
    probe = (await _ws(client, {"type": f"{DOMAIN}/probe", "host": "192.168.60.5"}))["result"]
    assert probe["mac"] is None and probe["vlan"] is None


async def test_export_import_checks_dashboard(
    hass: HomeAssistant, loaded: Any, hass_ws_client: WebSocketGenerator
) -> None:
    client = await hass_ws_client(hass)
    imported = await _ws(
        client, {"type": f"{DOMAIN}/import_yaml", "content": fixture_text("electricite.yaml")}
    )
    assert imported["result"]["modules"] == 30
    checks = (await _ws(client, {"type": f"{DOMAIN}/checks"}))["result"]
    assert any(c["code"] == "rcd_type_a" for c in checks)
    export = (await _ws(client, {"type": f"{DOMAIN}/export"}))["result"]
    assert "T1-R3-ID" in export["yaml"] and export["json"]["boards"]
    dash = (await _ws(client, {"type": f"{DOMAIN}/generate_dashboard"}))["result"]
    assert "network_view: switch" in dash["yaml"]
    bad = await _ws(client, {"type": f"{DOMAIN}/import_yaml", "content": "- nope"})
    assert bad["error"]["code"] == "invalid_format"
    assert not Path(hass.config.path("home_infra_map/photos")).exists()  # pasted content: no photo copy


async def test_read_only_user_exists(hass_read_only_user: MockUser) -> None:
    assert not hass_read_only_user.is_admin
