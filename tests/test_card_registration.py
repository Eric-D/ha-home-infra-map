"""The card is registered as a Lovelace resource (add_extra_js_url only as fallback).

Why: Home Assistant replaces window.customElements with a scoped registry
polyfill; a script injected with add_extra_js_url can define the element in
the native registry before the polyfill and stay invisible ("Custom element
doesn't exist"). Lovelace resources load after the polyfill. See CONTRIBUTING.md.
"""

from __future__ import annotations

from types import SimpleNamespace
from typing import Any
from unittest.mock import patch

from homeassistant.core import HomeAssistant

from custom_components import home_infra_map as integ
from custom_components.home_infra_map.const import CARD_RESOURCE_URL, CARD_URL


class FakeResources:
    def __init__(self, items: list[dict[str, Any]], store: Any = True) -> None:
        self.items = items
        self.store = store
        self.loaded = False

    async def async_get_info(self) -> None:
        self.loaded = True

    def async_items(self) -> list[dict[str, Any]]:
        return self.items

    async def async_create_item(self, data: dict[str, Any]) -> None:
        self.items.append({"id": "new", **data})

    async def async_update_item(self, item_id: str, data: dict[str, Any]) -> None:
        next(i for i in self.items if i["id"] == item_id).update(data)


async def test_resource_created(hass: HomeAssistant) -> None:
    res = FakeResources([{"id": "1", "url": "/other.js"}])
    hass.data["lovelace"] = SimpleNamespace(resources=res)
    with patch.object(integ, "add_extra_js_url") as extra:
        await integ._async_setup_card(hass)
    assert {"id": "new", "res_type": "module", "url": CARD_RESOURCE_URL} in res.items
    assert res.loaded
    extra.assert_not_called()


async def test_resource_version_updated_not_duplicated(hass: HomeAssistant) -> None:
    res = FakeResources([{"id": "1", "url": f"{CARD_URL}?v=0.0.1"}])
    hass.data["lovelace"] = SimpleNamespace(resources=res)
    await integ._async_setup_card(hass)
    assert res.items == [{"id": "1", "url": CARD_RESOURCE_URL}]
    await integ._async_setup_card(hass)
    assert len(res.items) == 1


async def test_yaml_mode_falls_back(hass: HomeAssistant) -> None:
    hass.data["lovelace"] = SimpleNamespace(resources=FakeResources([], store=None))
    with patch.object(integ, "add_extra_js_url") as extra:
        await integ._async_setup_card(hass)
    extra.assert_called_once_with(hass, CARD_RESOURCE_URL)


async def test_broken_resources_never_break_setup(hass: HomeAssistant) -> None:
    class Broken(FakeResources):
        def async_items(self) -> list[dict[str, Any]]:
            raise RuntimeError("boom")

    hass.data["lovelace"] = SimpleNamespace(resources=Broken([]))
    with patch.object(integ, "add_extra_js_url") as extra:
        await integ._async_setup_card(hass)
    extra.assert_called_once()


async def test_async_setup_registers_immediately(hass: HomeAssistant) -> None:
    """No wait for 'started': the UI is served during startup."""
    from homeassistant.setup import async_setup_component

    from custom_components.home_infra_map.const import DOMAIN

    res = FakeResources([])
    with patch.object(integ, "_get_lovelace_resources", return_value=res):
        assert await async_setup_component(hass, DOMAIN, {})
    assert [i["url"] for i in res.items] == [CARD_RESOURCE_URL]
