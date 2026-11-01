"""Shared fixtures: real Home Assistant test harness, mocked network."""

from __future__ import annotations

import json
from collections.abc import Generator
from pathlib import Path
from typing import Any
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker

from custom_components.home_infra_map.const import (
    CONF_API_KEY,
    CONF_API_SECRET,
    CONF_AUTH_KEY,
    CONF_AUTH_PROTOCOL,
    CONF_DEFAULT_VIEW,
    CONF_FIREWALL_ANALYSIS,
    CONF_HOST,
    CONF_HOUSE_NAME,
    CONF_OPNSENSE,
    CONF_PRIV_KEY,
    CONF_PRIV_PROTOCOL,
    CONF_SNMP_SOURCES,
    CONF_SNMP_VERSION,
    CONF_URL,
    CONF_USERNAME,
    CONF_VERIFY_SSL,
    DOMAIN,
)

FIXTURES = Path(__file__).parent / "fixtures"
OPN_URL = "http://192.168.10.1:8443"
SECRETS = {
    "api_key": "KEY-SHOULD-NOT-LEAK",
    "api_secret": "SECRET-SHOULD-NOT-LEAK",
    "auth_key": "AUTHPASS-SHOULD-NOT-LEAK",
    "priv_key": "PRIVPASS-SHOULD-NOT-LEAK",
}


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations: Any) -> None:
    """Load custom_components/ in every test."""


@pytest.fixture(autouse=True)
def _french(hass: HomeAssistant, tmp_path: Path) -> None:
    """French system language (entity-id suffixes) and an isolated /config."""
    hass.config.language = "fr"
    hass.config.config_dir = str(tmp_path)


def load_json(name: str) -> Any:
    return json.loads((FIXTURES / name).read_text(encoding="utf-8"))


def fixture_text(name: str) -> str:
    return (FIXTURES / name).read_text(encoding="utf-8")


OPNSENSE_CONF = {
    CONF_URL: OPN_URL,
    CONF_API_KEY: SECRETS["api_key"],
    CONF_API_SECRET: SECRETS["api_secret"],
    CONF_VERIFY_SSL: False,
}
SNMP_SOURCE = {
    "id": "snmp1",
    CONF_HOST: "192.168.10.2",
    "port": 161,
    CONF_SNMP_VERSION: "v3",
    CONF_USERNAME: "homeinfra",
    CONF_AUTH_PROTOCOL: "md5",
    CONF_AUTH_KEY: SECRETS["auth_key"],
    CONF_PRIV_PROTOCOL: "des",
    CONF_PRIV_KEY: SECRETS["priv_key"],
}


def make_entry(*, opnsense: bool = False, snmp: bool = False, **options: Any) -> MockConfigEntry:
    opts: dict[str, Any] = {
        CONF_SNMP_SOURCES: [dict(SNMP_SOURCE)] if snmp else [],
        CONF_DEFAULT_VIEW: "electricity",
        CONF_FIREWALL_ANALYSIS: True,
        **options,
    }
    if opnsense:
        opts[CONF_OPNSENSE] = dict(OPNSENSE_CONF)
    return MockConfigEntry(
        domain=DOMAIN, title="Maison", unique_id=DOMAIN, data={CONF_HOUSE_NAME: "Maison"}, options=opts
    )


def mock_opnsense(aioclient_mock: AiohttpClientMocker, *, status: int = 200) -> None:
    """Register every read-only endpoint with the anonymised fixture data."""
    data = load_json("opnsense.json")
    base = OPN_URL
    if status != 200:
        for path in ("/api/diagnostics/interface/get_arp",):
            aioclient_mock.get(base + path, status=status)
        return
    aioclient_mock.get(base + "/api/diagnostics/interface/get_arp", json=data["arp"])
    aioclient_mock.get(base + "/api/interfaces/overview/interfaces_info", json=data["interfaces_info"])
    aioclient_mock.get(base + "/api/interfaces/vlan_settings/search_item", json=data["vlans"])
    aioclient_mock.get(base + "/api/kea/dhcpv4/search_reservation", json=data["reservations"])
    aioclient_mock.get(base + "/api/kea/leases4/search", json=data["leases"])
    aioclient_mock.get(base + "/api/routes/gateway/status", json=data["gateways"])
    aioclient_mock.post(base + "/api/firewall/filter/search_rule", json=data["filter_rules"])
    aioclient_mock.post(base + "/api/firewall/d_nat/search_rule", json=data["d_nat"])
    aioclient_mock.get(base + "/api/firewall/alias/search_item", json=data["aliases"])
    for name, values in data["alias_resolved"].items():
        aioclient_mock.get(
            f"{base}/api/firewall/alias_util/list/{name}", json={"rows": [{"ip": v} for v in values]}
        )
    aioclient_mock.post(base + "/api/diagnostics/log/core/filter", json=data["firewall_log"])
    aioclient_mock.post(base + "/api/diagnostics/log/core/resolver", json=data["resolver_log"])


def snmp_snapshot(network: dict[str, Any] | None = None) -> dict[str, Any]:
    """A switch snapshot: the weather station is on port 9, behind the upstairs AP."""
    ap_mac = "02:00:5e:10:00:12"
    station = "02:00:5e:30:00:40"
    router = "02:00:5e:10:00:01"
    server = "02:00:5e:50:00:10"
    ports = {
        str(p): {
            "port": p,
            "if_index": 1000000 + p,
            "name": f"GigabitEthernet 1/{p}",
            "alias": "",
            "up": p in (2, 9, 24),
            "speed_mbps": 1000 if p in (2, 9, 24) else None,
            "pvid": 1,
            "tagged_vlans": [20, 30, 40] if p == 9 else [],
            "untagged_vlans": [1],
            "lldp": {"sys_name": "AP-Etage", "port_id": "eth0"} if p == 9 else None,
            "poe": p == 9,
            "macs": [],
        }
        for p in range(1, 29)
    }
    ports["9"]["macs"] = [ap_mac, station]
    ports["24"]["macs"] = [router, ap_mac, station, server]
    ports["2"]["macs"] = [server]
    return {
        "sys_name": "SW-DEMO-24P",
        "ports": ports,
        "mac_ports": {
            ap_mac: [9, 24],
            station: [24, 9],
            router: [24],
            server: [2, 24],
        },
    }


@pytest.fixture
def ping_ok() -> Generator[AsyncMock]:
    """Every host answers in 4 ms except 192.168.30.12 (offline doorbell)."""

    async def _ping(hosts: list[str]) -> dict[str, dict[str, Any]]:
        return {
            h: {"alive": h != "192.168.30.12", "rtt_ms": None if h == "192.168.30.12" else 4.0, "ip": h}
            for h in hosts
        }

    with (
        patch("custom_components.home_infra_map.coordinator.async_ping_hosts", side_effect=_ping) as mock,
        patch("custom_components.home_infra_map.websocket.async_ping_hosts", side_effect=_ping),
        patch("custom_components.home_infra_map.coordinator.async_tcp_check", return_value=True),
    ):
        yield mock


@pytest.fixture
def snmp_ok() -> Generator[AsyncMock]:
    with (
        patch(
            "custom_components.home_infra_map.snmp.SnmpClient.snapshot",
            new=AsyncMock(side_effect=snmp_snapshot),
        ) as mock,
        patch(
            "custom_components.home_infra_map.snmp.SnmpClient.get_sys_name",
            new=AsyncMock(return_value="SW-DEMO-24P"),
        ),
    ):
        yield mock
