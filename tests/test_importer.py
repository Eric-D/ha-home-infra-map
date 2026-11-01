"""YAML import/export of the example house files."""

from __future__ import annotations

from collections import Counter

import probatio as vol
import pytest

from custom_components.home_infra_map.importer import (
    ImportError_,
    export_document,
    guess_circuit_kind,
    guess_device_kind,
    parse_document,
    parse_ma,
    parse_rating,
)
from custom_components.home_infra_map.models import ModuleIndex, upstream_rcd

from .conftest import fixture_text


def test_electricity_example_counts() -> None:
    result = parse_document(fixture_text("electricite.yaml"))
    assert result.sections == ["boards"]
    assert result.boards is not None
    main, garage = result.boards
    assert [len(b["rows"]) for b in result.boards] == [3, 1]
    assert (main["modules_per_row"], garage["modules_per_row"]) == (13, 8)
    kinds = Counter(m["kind"] for b in result.boards for row in b["rows"] for m in row["modules"])
    assert kinds == {"breaker": 18, "rcbo": 2, "rcd": 3, "device": 5, "spacer": 3}
    assert [r["label"] for r in main["rows"]] == ["R1", "R2", "R3"]
    assert result.photos == {main["id"]: "photos/tableau_principal.jpg"}


def test_electricity_values() -> None:
    main, garage = parse_document(fixture_text("electricite.yaml")).boards  # type: ignore[misc]
    r1 = main["rows"][0]["modules"]
    rcd = r1[0]
    assert (rcd["ref"], rcd["rating_a"], rcd["sensitivity_ma"], rcd["rcd_type"]) == ("T1-R1-ID", 40, 30, "AC")
    assert rcd["width_modules"] == 2
    first = r1[1]
    assert (first["ref"], first["curve"], first["rating_a"], first["circuit_name"]) == (
        "T1-R1-1",
        "C",
        10,
        "Éclairage séjour",
    )
    assert first["circuit_kind"] == "lighting"
    assert [m["kind"] for m in r1].count("spacer") == 1 and r1[7]["width_modules"] == 2
    r2 = main["rows"][1]["modules"]
    assert r2[1]["cable_mm2"] == 6.0 and r2[2]["cable_mm2"] == 2.5
    assert r2[4]["notes"] == "Pièce : Cuisine"
    assert r2[7]["circuit_kind"] == "water_heater"
    assert r2[-1]["kind"] == "device" and r2[-1]["model"] == "CT 20A"
    # unquoted comma inside a flow mapping is glued back
    assert main["rows"][2]["modules"][3]["label"] == "Module de mesure (compteur, 3 voies)"
    # protection rule: last RCD to the left
    assert upstream_rcd(main["rows"][1], r2[3]["id"])["ref"] == "T1-R2-ID"  # type: ignore[index]
    # RCBOs on the garage board protect themselves
    rcbo = garage["rows"][0]["modules"][1]
    assert (rcbo["kind"], rcbo["width_modules"], rcbo["rcd_type"]) == ("rcbo", 2, "A")
    assert upstream_rcd(garage["rows"][0], rcbo["id"]) is rcbo


def test_supply_feeds_and_status() -> None:
    result = parse_document(fixture_text("electricite.yaml"))
    main, garage = result.boards  # type: ignore[misc]
    assert result.warnings == []
    meter, head = main["supply"]
    assert (meter["kind"], meter["subscribed_kva"], meter["power_entity_id"]) == (
        "meter",
        9.0,
        "sensor.compteur_puissance_apparente",
    )
    assert (head["kind"], head["ref"], head["rating_a"], head["sensitivity_ma"]) == (
        "main_breaker",
        "T1-AGCP",
        45,
        500,
    )
    r1 = main["rows"][0]["modules"]
    assert [m["status"] for m in r1 if m["ref"] in ("T1-R1-3", "T1-R1-8", "T1-R1-1")] == [
        "active",
        "off",
        "spare",
    ]
    feeder = main["rows"][2]["modules"][-1]
    assert (feeder["ref"], feeder["fed_by"], feeder["circuit_kind"]) == ("T1-R3-4", head["id"], "feeder")
    assert garage["fed_by"] == feeder["id"]
    index = ModuleIndex(result.boards)  # type: ignore[arg-type]
    # the feeder skips the RCD on its left: only the 500 mA main breaker upstream
    assert index.protector(feeder) is head
    assert [m["ref"] for m in index.chain(garage["rows"][0]["modules"][0])] == [
        "T1-R3-4",
        "T1-AGCP",
        "T1-CPT",
    ]
    assert index.protector(main["rows"][2]["modules"][1])["ref"] == "T1-R3-ID"  # type: ignore[index]
    assert {m["ref"] for m in index.fed(head["id"])} == {"T1-R1-ID", "T1-R2-ID", "T1-R3-ID", "T1-R3-4"}


def test_unknown_feed_reference_is_reported() -> None:
    doc = """
tableaux:
  - id: T9
    nom: Seul
    rangees:
      - id: T9-R1
        elements:
          - disjoncteur: {repere: T9-R1-1, calibre: C16, alimente_par: T9-R1-42}
          - disjoncteur: {repere: T9-R1-2, calibre: C16, alimente_par: arrivee}
          - disjoncteur: {repere: T9-R1-3, calibre: C16, reserve: true, etat: "?"}
          - disjoncteur: {repere: T9-R1-4, calibre: C16, etat: disjoncté, alerte: [Chauffe, Bornier noirci]}
          - disjoncteur: {repere: T9-R1-5, calibre: C16, alerte: Étiquette fausse, alerte_niveau: info}
"""
    result = parse_document(doc)
    assert len(result.warnings) == 2
    modules = result.boards[0]["rows"][0]["modules"]  # type: ignore[index]
    assert [m["fed_by"] for m in modules] == [None] * 5
    assert [m["status"] for m in modules] == ["active", "active", "spare", "off", "active"]
    assert [(m["alert"], m["alert_level"]) for m in modules[3:]] == [
        ("Chauffe\nBornier noirci", "warning"),
        ("Étiquette fausse", "info"),
    ]


def test_network_example_counts() -> None:
    network = parse_document(fixture_text("reseau.yaml")).network
    assert network is not None
    assert len(network["vlans"]) == 6
    assert len(network["devices"]) == 18
    assert network["uplink"] == {
        "isp": "FAI Démo (fibre)",
        "box_name": "Box Démo",
        "box_ip": "192.168.1.254",
        "public_ip": "198.51.100.23",
    }
    [switch] = network["switches"]
    assert switch["ports_count"] == 28 and switch["sfp_ports"] == [25, 26, 27, 28]
    assert switch["port_labels"]["9"] == "Point d'accès étage"
    vlans = {v["name"]: v for v in network["vlans"]}
    assert vlans["Admin"]["tag"] is None and vlans["Objets"]["tag"] == 30
    assert vlans["Admin"]["role"] == "Routeur, switch, points d'accès"
    station = next(d for d in network["devices"] if d["host"] == "192.168.30.40")
    assert station["vlan_id"] == vlans["Objets"]["id"]
    assert station["port"] == 9 and station["port_source"] == "manual"
    ap = next(d for d in network["devices"] if d["name"] == "Point d'accès étage")
    assert ap["kind"] == "ap" and station["parent_device_id"] == ap["id"]
    assert all(
        d["monitor"] == {"ping": True, "latency": False, "tcp_port": None, "offline_alert_minutes": None}
        for d in network["devices"]
    )


def test_roundtrip_native_format() -> None:
    boards = parse_document(fixture_text("electricite.yaml")).boards
    network = parse_document(fixture_text("reseau.yaml")).network
    text = export_document({"house_name": "Maison", "boards": boards, "network": network})
    again = parse_document(text)
    assert again.boards == boards and again.network == network and again.house_name == "Maison"
    assert "api_key" not in text


@pytest.mark.parametrize(
    ("text", "error"),
    [("- a\n- b", "mapping"), ("foo: [", "invalid YAML"), ("foo: 1", "nothing to import")],
)
def test_invalid_documents(text: str, error: str) -> None:
    with pytest.raises(ImportError_, match=error):
        parse_document(text)


def test_invalid_native_document() -> None:
    with pytest.raises(vol.Invalid):
        parse_document("boards:\n  - name: ''\n")


def test_helpers() -> None:
    assert parse_rating("C16") == ("C", 16)
    assert parse_rating("40A") == (None, 40)
    assert parse_rating("?") == (None, None)
    assert parse_rating("x") == (None, None)
    assert parse_ma("30mA") == 30 and parse_ma("?") is None
    assert guess_circuit_kind("Éclairage RDC") == "lighting"
    assert guess_circuit_kind("Plaque de cuisson") == "cooking"
    assert guess_circuit_kind("Lave-linge") == "dedicated"
    assert guess_circuit_kind("?") == "unknown"
    assert guess_circuit_kind("Portail") == "other"
    assert guess_device_kind("Caméra entrée") == "camera"
    assert guess_device_kind("x", "routeur") == "router"
    assert guess_device_kind("Téléviseur salon") == "other"


def test_area_resolver_and_extra_fields() -> None:
    text = """
tableaux:
  - nom: T
    rangees:
      - id: T9-R1
        differentiel: {calibre: 40A, sensibilite: 30mA, type: a}
        disjoncteurs:
          - {calibre: B16, circuit: Prises cuisine, pieces: [Cuisine, Grenier], section: "2,5 mm²",
             entite_puissance: sensor.cuisine_power}
        modules:
          - {type: Shelly, modele: "?", entite_ha: switch.shelly}
"""
    board = parse_document(text, lambda name: "kitchen" if name == "Cuisine" else None).boards[0]  # type: ignore[index]
    rcd, breaker, device = board["rows"][0]["modules"]
    assert rcd["rcd_type"] == "A"
    assert breaker["area_ids"] == ["kitchen"] and "Grenier" in breaker["notes"]
    assert breaker["cable_mm2"] == 2.5 and breaker["power_entity_id"] == "sensor.cuisine_power"
    assert breaker["circuit_kind"] == "sockets"
    assert device["entity_ids"] == ["switch.shelly"] and device["model"] is None


WIDE_BOARD = """
tableaux:
  - nom: Garage
    modules_par_rangee: 13
    rangees:
      - id: T2-R1
        capacite: 18
        elements:
          - differentiel: {calibre: 40A, sensibilite: 30mA, type: A, largeur: 2}
          - disjoncteur: {calibre: C16, circuit: Prises garage}
          - vide: 2
          - disjoncteur: {calibre: C32, circuit: Borne de recharge, largeur: 2}
          - module: {type: Contacteur heures creuses, largeur: 1}
          - disjoncteur: {calibre: C20, sensibilite: 30mA, type: A, circuit: Lave-linge}
      - id: T2-R2
        differentiel: {calibre: 63A, sensibilite: 30mA, largeur: 4}
        disjoncteurs:
          - {calibre: C10, circuit: Éclairage}
          - {vide: 3}
          - {calibre: C20, circuit: Four, modules: "2"}
        modules:
          - {vide: 1}
          - {type: Parafoudre, largeur: 2}
"""


def test_widths_holes_order_and_capacity() -> None:
    [board] = parse_document(WIDE_BOARD).boards  # type: ignore[misc]
    assert board["modules_per_row"] == 13
    r1, r2 = board["rows"]
    assert r1["capacity"] == 18 and r2["capacity"] is None
    assert [(m["kind"], m["width_modules"]) for m in r1["modules"]] == [
        ("rcd", 2),
        ("breaker", 1),
        ("spacer", 2),
        ("breaker", 2),
        ("device", 1),
        ("rcbo", 1),
    ]
    assert [m["ref"] for m in r1["modules"]] == [
        "T2-R1-ID",
        "T2-R1-1",
        "T2-R1-V1",
        "T2-R1-2",
        "T2-R1-M1",
        "T2-R1-3",
    ]
    rcbo = r1["modules"][-1]
    assert rcbo["sensitivity_ma"] == 30 and rcbo["rcd_type"] == "A"
    assert [(m["kind"], m["width_modules"]) for m in r2["modules"]] == [
        ("rcd", 4),
        ("breaker", 1),
        ("spacer", 3),
        ("breaker", 2),
        ("spacer", 1),
        ("device", 2),
    ]
    # round trip keeps everything
    again = parse_document(export_document({"house_name": "", "boards": [board], "network": {}})).boards
    assert again == [board]


def test_invalid_element() -> None:
    bad = (
        "tableaux:\n  - nom: X\n    rangees:\n      - id: R1\n        elements:\n          - {fusible: {}}\n"
    )
    with pytest.raises(ImportError_, match="elements"):
        parse_document(bad)
