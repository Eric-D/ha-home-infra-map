"""Read-only OPNsense client."""

from __future__ import annotations

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker

from custom_components.home_infra_map.opnsense import (
    ALLOWED_ENDPOINTS,
    ForbiddenEndpointError,
    OPNsenseAuthError,
    OPNsenseClient,
    OPNsenseConnectionError,
    OPNsensePermissionError,
    check_endpoint,
    normalize_url,
)

from .conftest import OPN_URL, mock_opnsense


def _client(hass: HomeAssistant) -> OPNsenseClient:
    return OPNsenseClient(async_get_clientsession(hass), OPN_URL, "k", "s", verify_ssl=False)


@pytest.mark.parametrize(
    ("path", "method"),
    [
        ("/api/firewall/filter/set_rule", "POST"),
        ("/api/firewall/filter/apply", "POST"),
        ("/api/firewall/filter/add_rule", "POST"),
        ("/api/firewall/filter/del_rule/x", "POST"),
        ("/api/core/service/restart/unbound", "POST"),
        ("/api/interfaces/vlan_settings/reconfigure", "POST"),
        ("/api/diagnostics/interface/get_arp", "POST"),
        ("/api/unknown/read", "GET"),
        ("/api/firewall/alias_util/list/a/b", "GET"),
    ],
)
def test_write_endpoints_are_refused(path: str, method: str) -> None:
    with pytest.raises(ForbiddenEndpointError):
        check_endpoint(path, method)


def test_allow_list_is_read_only() -> None:
    for path, method in ALLOWED_ENDPOINTS.items():
        check_endpoint(path + ("x" if path.endswith("/") else ""), method)


def test_normalize_url() -> None:
    assert normalize_url("192.168.10.1") == "https://192.168.10.1"
    assert normalize_url("http://192.168.10.1:8443/") == "http://192.168.10.1:8443"
    assert normalize_url("https://fw/api") == "https://fw"


async def test_reads(hass: HomeAssistant, aioclient_mock: AiohttpClientMocker) -> None:
    mock_opnsense(aioclient_mock)
    client = _client(hass)
    assert client.url == OPN_URL
    assert len(await client.get_arp()) == 18
    assert len(await client.get_interfaces()) == 7
    assert len(await client.get_rules()) == 15
    assert len(await client.get_nat_rules()) == 1
    assert len(await client.get_aliases()) == 6
    assert len(await client.get_vlans()) == 4
    assert len(await client.get_reservations()) == 13
    assert len(await client.get_leases()) == 18
    assert len(await client.get_gateways()) == 2
    assert await client.resolve_alias("Objets_Meteo") == ["192.168.30.40"]
    assert len(await client.get_firewall_log("192.168.30.40")) == 5
    assert len(await client.get_resolver_log()) == 2
    assert await client.check_privileges() == []
    # every call went to an allow-listed, read-only endpoint
    for method, url, *_ in aioclient_mock.mock_calls:
        check_endpoint(str(url).split(":8443", 1)[1], method.upper())


@pytest.mark.parametrize(
    ("status", "exc"),
    [(401, OPNsenseAuthError), (403, OPNsensePermissionError), (500, OPNsenseConnectionError)],
)
async def test_errors(
    hass: HomeAssistant, aioclient_mock: AiohttpClientMocker, status: int, exc: type
) -> None:
    aioclient_mock.get(OPN_URL + "/api/diagnostics/interface/get_arp", status=status)
    with pytest.raises(exc):
        await _client(hass).test_connection()


async def test_timeout_and_bad_json(hass: HomeAssistant, aioclient_mock: AiohttpClientMocker) -> None:
    aioclient_mock.get(OPN_URL + "/api/diagnostics/interface/get_arp", exc=TimeoutError())
    aioclient_mock.get(OPN_URL + "/api/routes/gateway/status", text="not json")
    client = _client(hass)
    with pytest.raises(OPNsenseConnectionError):
        await client.get_arp()
    with pytest.raises(OPNsenseConnectionError):
        await client.get_gateways()


async def test_missing_privileges_listed(hass: HomeAssistant, aioclient_mock: AiohttpClientMocker) -> None:
    aioclient_mock.get(OPN_URL + "/api/interfaces/overview/interfaces_info", json={"rows": []})
    aioclient_mock.get(OPN_URL + "/api/kea/dhcpv4/search_reservation", status=403)
    aioclient_mock.post(OPN_URL + "/api/firewall/filter/search_rule", status=403)
    aioclient_mock.get(OPN_URL + "/api/firewall/alias/search_item", json=[])
    aioclient_mock.post(OPN_URL + "/api/diagnostics/log/core/filter", json={})
    aioclient_mock.get(OPN_URL + "/api/routes/gateway/status", json="x")
    missing = await _client(hass).check_privileges()
    assert missing == ["Services: Kea DHCPv4", "Firewall: Rules"]
