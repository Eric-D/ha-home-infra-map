"""Config and options flows."""

from __future__ import annotations

from typing import Any
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker

from custom_components.home_infra_map.const import DOMAIN

from .conftest import OPN_URL, make_entry, mock_opnsense

OPN_INPUT = {"url": OPN_URL, "api_key": "k", "api_secret": "s", "verify_ssl": False}
SNMP_INPUT: dict[str, Any] = {
    "host": "192.168.10.2",
    "port": 161,
    "version": "v3",
    "username": "Ha",
    "auth_protocol": "md5",
    "auth_key": "authpass1",
    "priv_protocol": "des",
    "priv_key": "privpass1",
}


async def _start(hass: HomeAssistant) -> dict[str, Any]:
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    assert result["type"] is FlowResultType.FORM and result["step_id"] == "user"
    return await hass.config_entries.flow.async_configure(result["flow_id"], {"house_name": " Maison "})


async def test_full_flow(
    hass: HomeAssistant, aioclient_mock: AiohttpClientMocker, ping_ok: AsyncMock, snmp_ok: AsyncMock
) -> None:
    mock_opnsense(aioclient_mock)
    result = await _start(hass)
    assert result["step_id"] == "opnsense"
    result = await hass.config_entries.flow.async_configure(result["flow_id"], OPN_INPUT)
    assert result["step_id"] == "snmp"
    result = await hass.config_entries.flow.async_configure(result["flow_id"], SNMP_INPUT)
    assert result["step_id"] == "finish"
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"import_from_opnsense": True})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "Maison"
    entry = result["result"]
    assert entry.data == {"house_name": "Maison", "import_from_opnsense": False}  # import done at setup
    assert entry.options["opnsense"]["url"] == OPN_URL
    [source] = entry.options["snmp_sources"]
    assert source["username"] == "Ha" and "community" not in source and source["id"]
    await hass.async_block_till_done()
    assert len(entry.runtime_data.store.model["network"]["devices"]) == 13


async def test_flow_without_sources(hass: HomeAssistant, ping_ok: AsyncMock) -> None:
    result = await _start(hass)
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"url": ""})
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"host": ""})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert "opnsense" not in result["result"].options


@pytest.mark.parametrize(
    ("status", "error"),
    [(401, "invalid_auth"), (403, "missing_privileges"), (None, "cannot_connect")],
)
async def test_opnsense_errors(
    hass: HomeAssistant, aioclient_mock: AiohttpClientMocker, status: int | None, error: str
) -> None:
    url = OPN_URL + "/api/diagnostics/interface/get_arp"
    if status is None:
        aioclient_mock.get(url, exc=TimeoutError())
    else:
        aioclient_mock.get(url, status=status)
    result = await _start(hass)
    result = await hass.config_entries.flow.async_configure(result["flow_id"], OPN_INPUT)
    assert result["errors"] == {"base": error}
    if status == 403:
        assert "Diagnostics: ARP Table" in result["description_placeholders"]["privileges"]
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {**OPN_INPUT, "api_secret": ""}
    )
    assert result["errors"] == {"base": "missing_credentials"}


@pytest.mark.parametrize(
    ("patch_input", "error"),
    [
        ({"version": "v3", "username": ""}, "snmp_missing_user"),
        ({"version": "v3", "auth_key": "short"}, "snmp_short_key"),
        ({"version": "v3", "priv_key": "short"}, "snmp_short_key"),
        ({"version": "v2c", "community": ""}, "snmp_missing_community"),
        ({}, "snmp_failed"),
    ],
)
async def test_snmp_errors(hass: HomeAssistant, patch_input: dict[str, Any], error: str) -> None:
    result = await _start(hass)
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"url": ""})
    with patch(
        "custom_components.home_infra_map.snmp.SnmpClient.get_sys_name", AsyncMock(side_effect=TimeoutError)
    ):
        result = await hass.config_entries.flow.async_configure(
            result["flow_id"], {**SNMP_INPUT, **patch_input}
        )
    assert result["errors"] == {"base": error}


async def test_single_instance(hass: HomeAssistant, ping_ok: AsyncMock) -> None:
    make_entry().add_to_hass(hass)
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    assert result["type"] is FlowResultType.ABORT


async def test_options_flow(
    hass: HomeAssistant, aioclient_mock: AiohttpClientMocker, ping_ok: AsyncMock, snmp_ok: AsyncMock
) -> None:
    mock_opnsense(aioclient_mock)
    entry = make_entry(opnsense=True, snmp=True)
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    async def menu(step: str) -> dict[str, Any]:
        result = await hass.config_entries.options.async_init(entry.entry_id)
        assert result["type"] is FlowResultType.MENU
        assert "snmp_remove" in result["menu_options"]
        return await hass.config_entries.options.async_configure(result["flow_id"], {"next_step_id": step})

    result = await menu("settings")
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "ping_interval_s": 30,
            "snmp_interval_s": 600,
            "opnsense_interval_s": 120,
            "default_view": "network",
            "firewall_analysis": False,
        },
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    assert entry.options["ping_interval_s"] == 30 and entry.options["firewall_analysis"] is False
    assert entry.runtime_data.ping.update_interval.total_seconds() == 30  # reloaded

    # OPNsense: empty secrets keep the stored ones
    result = await menu("opnsense")
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"url": OPN_URL, "verify_ssl": True}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert entry.options["opnsense"]["api_key"] == "KEY-SHOULD-NOT-LEAK"
    await hass.async_block_till_done()

    result = await menu("snmp_add")
    result = await hass.config_entries.options.async_configure(result["flow_id"], {**SNMP_INPUT, "host": ""})
    assert result["errors"] == {"base": "snmp_missing_host"}
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {**SNMP_INPUT, "host": "10.0.0.2", "version": "v2c", "community": "public"}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    assert len(entry.options["snmp_sources"]) == 2

    result = await menu("snmp_remove")
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"sources": ["snmp1"]})
    await hass.async_block_till_done()
    assert [s["host"] for s in entry.options["snmp_sources"]] == ["10.0.0.2"]

    result = await menu("opnsense")
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"url": ""})
    await hass.async_block_till_done()
    assert "opnsense" not in entry.options


async def test_options_opnsense_error(
    hass: HomeAssistant, aioclient_mock: AiohttpClientMocker, ping_ok: AsyncMock
) -> None:
    aioclient_mock.get(OPN_URL + "/api/diagnostics/interface/get_arp", status=401)
    entry = make_entry()
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert "snmp_remove" not in result["menu_options"]
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "opnsense"}
    )
    result = await hass.config_entries.options.async_configure(result["flow_id"], OPN_INPUT)
    assert result["errors"] == {"base": "invalid_auth"}
