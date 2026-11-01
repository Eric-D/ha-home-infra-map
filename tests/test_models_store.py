"""Model validation and persistence."""

from __future__ import annotations

from typing import Any

import probatio as vol
import pytest
from homeassistant.core import HomeAssistant

from custom_components.home_infra_map.const import STORAGE_KEY
from custom_components.home_infra_map.models import (
    board_power_entities,
    find_device,
    normalize_mac,
    validate_boards,
    validate_network,
    vlan_for_ip,
)
from custom_components.home_infra_map.store import ModelStore, RevisionConflictError, migrate_document


def test_validation_defaults_and_cleanup() -> None:
    network = validate_network(
        {
            "vlans": [{"id": "v1", "name": "Objets", "subnet": "192.168.30.7/24", "color": "bad"}],
            "devices": [
                {
                    "id": "d1",
                    "name": "A",
                    "mac": "02-00-AA-bb-cc-dd",
                    "vlan_id": "gone",
                    "parent_device_id": "d1",
                }
            ],
        }
    )
    assert network["vlans"][0]["subnet"] == "192.168.30.0/24"
    assert network["vlans"][0]["color"] == "#607d8b"
    device = network["devices"][0]
    assert device["mac"] == "02:00:aa:bb:cc:dd"
    assert device["vlan_id"] is None and device["parent_device_id"] is None
    assert device["monitor"]["ping"] is True


@pytest.mark.parametrize(
    "bad",
    [
        {"devices": [{"id": "x", "name": "a"}, {"id": "x", "name": "b"}]},
        {"devices": [{"name": "a", "mac": "zz"}]},
        {"vlans": [{"name": "a", "subnet": "nope"}]},
        {"devices": [{"name": "a", "kind": "toaster"}]},
    ],
)
def test_validation_errors(bad: dict[str, Any]) -> None:
    with pytest.raises(vol.Invalid):
        validate_network(bad)


def test_boards_validation() -> None:
    boards = validate_boards(
        [
            {
                "name": "B",
                "rows": [
                    {
                        "label": "R1",
                        "modules": [{"kind": "rcd"}, {"kind": "breaker", "power_entity_id": "sensor.p"}],
                    }
                ],
            }
        ]
    )
    assert boards[0]["rows"][0]["modules"][0]["width_modules"] == 2
    assert board_power_entities(boards[0]) == ["sensor.p"]
    with pytest.raises(vol.Invalid):
        validate_boards(
            [{"name": "B", "rows": [{"modules": [{"kind": "breaker", "power_entity_id": "Bad Id"}]}]}]
        )
    with pytest.raises(vol.Invalid):
        validate_boards(
            [{"name": "B", "rows": [{"modules": [{"id": "m", "kind": "rcd"}, {"id": "m", "kind": "rcd"}]}]}]
        )


def test_helpers() -> None:
    vlans = validate_network(
        {"vlans": [{"name": "big", "subnet": "10.0.0.0/8"}, {"name": "iot", "subnet": "10.0.30.0/24"}]}
    )["vlans"]
    assert vlan_for_ip(vlans, "10.0.30.40")["name"] == "iot"  # type: ignore[index]
    assert vlan_for_ip(vlans, "10.9.0.1")["name"] == "big"  # type: ignore[index]
    assert vlan_for_ip(vlans, "host.lan") is None
    assert normalize_mac(None) is None
    assert find_device({"network": {"devices": []}}, "x") is None


def test_migration_1_1() -> None:
    old = {
        "revision": 2,
        "model": {
            "network": {"devices": [{"name": "a", "port_auto": False}, {"name": "b", "port_auto": True}]}
        },
    }
    new = migrate_document(1, 1, old)
    assert [d["port_source"] for d in new["model"]["network"]["devices"]] == ["manual", "auto"]
    assert "port_auto" in old["model"]["network"]["devices"][0]  # input not mutated
    with pytest.raises(NotImplementedError):
        migrate_document(99, 1, old)


async def test_store_save_conflict_and_reload(hass: HomeAssistant, hass_storage: dict[str, Any]) -> None:
    store = ModelStore(hass, "Maison")
    await store.async_load()
    assert store.model["house_name"] == "Maison" and store.revision == 0
    seen: list[int] = []
    remove = store.async_add_listener(lambda _m, rev: seen.append(rev))
    await store.async_save_section("boards", [{"name": "T1"}], 0)
    assert store.section_revisions["boards"] == 1 and seen == [1]
    with pytest.raises(RevisionConflictError):
        await store.async_save_section("boards", [], 0)
    # an automatic update does not invalidate the user's revision
    await store.async_save_section("network", {"devices": [{"id": "d", "name": "D"}]}, None)
    assert await store.async_update_devices({"d": {"port": 3}})
    assert not await store.async_update_devices({"d": {"port": 3}})
    assert store.section_revisions["network"] == 1
    await store.async_save_section("network", store.model["network"], 1)
    with pytest.raises(vol.Invalid):
        await store.async_save_section("nope", {}, None)
    await store.async_save_section("house_name", "Chalet", None)
    remove()
    assert hass_storage[STORAGE_KEY]["data"]["model"]["house_name"] == "Chalet"

    again = ModelStore(hass, "x")
    await again.async_load()
    assert again.model == store.model
    assert again.revision == store.revision
    assert again.section_revisions == store.section_revisions


async def test_store_migrates_and_recovers(hass: HomeAssistant, hass_storage: dict[str, Any]) -> None:
    hass_storage[STORAGE_KEY] = {
        "version": 1,
        "minor_version": 1,
        "key": STORAGE_KEY,
        "data": {
            "revision": 4,
            "model": {"network": {"devices": [{"id": "d", "name": "D", "port_auto": False}]}},
        },
    }
    store = ModelStore(hass, "Maison")
    await store.async_load()
    assert store.model["network"]["devices"][0]["port_source"] == "manual"
    assert store.revision == 4


async def test_store_invalid_data_is_backed_up(hass: HomeAssistant, hass_storage: dict[str, Any]) -> None:
    hass_storage[STORAGE_KEY] = {
        "version": 1,
        "minor_version": 2,
        "key": STORAGE_KEY,
        "data": {"revision": 1, "model": {"boards": [{"name": ""}]}},
    }
    store = ModelStore(hass, "Maison")
    await store.async_load()
    assert store.model["boards"] == []
    await hass.async_block_till_done()
    assert f"{STORAGE_KEY}.invalid_backup" in hass_storage


async def test_listener_errors_are_contained(hass: HomeAssistant) -> None:
    store = ModelStore(hass, "M")
    await store.async_load()

    def boom(_m: Any, _r: int) -> None:
        raise RuntimeError("x")

    store.async_add_listener(boom)
    await store.async_replace({"boards": [], "network": {}})
    assert store.revision == 1


def test_feeds_are_cleaned() -> None:
    from custom_components.home_infra_map.models import ModuleIndex

    boards = validate_boards(
        [
            {
                "name": "A",
                "supply": [
                    {"id": "m", "kind": "meter"},
                    {"id": "h", "kind": "main_breaker", "fed_by": "nope"},
                ],
                "rows": [
                    {
                        "modules": [
                            {"id": "r", "kind": "rcd", "fed_by": "b"},
                            {"id": "b", "kind": "breaker"},
                            {"id": "s", "kind": "breaker", "fed_by": "s"},
                            {"id": "f", "kind": "breaker", "fed_by": "h"},
                        ]
                    }
                ],
            },
            {"name": "B", "fed_by": "f", "rows": [{"modules": [{"id": "x", "kind": "breaker"}]}]},
            {"name": "C", "fed_by": "y", "rows": [{"modules": [{"id": "y", "kind": "breaker"}]}]},
        ]
    )
    a, b, c = boards
    assert [m["fed_by"] for m in a["rows"][0]["modules"]] == [None, None, None, "h"]
    assert a["supply"][1]["fed_by"] is None and a["supply"][0]["width_modules"] == 4
    assert b["fed_by"] == "f" and c["fed_by"] is None
    index = ModuleIndex(boards)
    assert [m["id"] for m in index.chain(b["rows"][0]["modules"][0])] == ["f", "h", "m"]
    assert index.feeder(a["supply"][0]) is None
    assert index.protector(a["rows"][0]["modules"][1])["id"] == "r"  # type: ignore[index]
