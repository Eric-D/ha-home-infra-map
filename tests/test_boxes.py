"""Junction boxes: import of the hand-written `boites:`, cleaning, points, re-import."""

from __future__ import annotations

import copy
from pathlib import Path

from custom_components.home_infra_map.importer import (
    export_document,
    parse_document,
    parse_position,
    remap_box_circuits,
)
from custom_components.home_infra_map.models import (
    circuit_points,
    effective_circuits,
    validate_boxes,
    validate_model,
)
from custom_components.home_infra_map.nfc15100 import check_boards

FIX = Path(__file__).parent / "fixtures" / "electricite.yaml"


def _load():
    result = parse_document(FIX.read_text())
    assert result.boards is not None and result.boxes is not None
    ids = {m["ref"]: m["id"] for b in result.boards for r in b["rows"] for m in r["modules"]}
    return result, ids


def test_positions() -> None:
    assert parse_position("G1") == ("left", 1)
    assert parse_position("haut 2") == ("top", 2)
    assert parse_position("D") == ("right", None)
    assert parse_position("?") == (None, None)
    assert parse_position(None) == (None, None)


def test_boxes_are_imported_with_their_unknowns() -> None:
    result, ids = _load()
    assert not result.warnings
    assert "boxes" in result.sections
    hall, room1, room2, _attic = result.boxes  # type: ignore[misc]
    assert hall["sides"] == {"top": 3, "bottom": 2, "left": 2, "right": 2}
    by_pos = {(c["side"], c["position"]): c for c in hall["conduits"]}
    assert by_pos[("left", 1)]["end"] == "board"
    assert by_pos[("left", 1)]["circuits"] == [ids["T1-R1-5"]]
    assert by_pos[("top", 3)]["end"] == "spare"
    link = by_pos[("bottom", 1)]
    assert link["end"] == "box" and link["end_box_id"] == room1["id"]
    assert link["end_conduit_id"] == room1["conduits"][0]["id"]
    to_room2 = by_pos[("right", 1)]
    assert to_room2["end_box_id"] == room2["id"] and to_room2["end_conduit_id"] is None
    grey = by_pos[(None, None)]
    assert grey["label"] == "gaine grise" and grey["end"] == "unknown" and grey["circuits"] == []
    joined, earth, switched, pair = hall["connectors"]
    assert joined["wire"] == "all" and len(joined["conduits"]) == 3
    assert pair["kind"] == "Liaison" and pair["wire"] == "all" and len(pair["conduits"]) == 2
    assert earth["wire"] == "earth" and earth["conduits"] == [] and earth["circuit"] is None
    assert switched["wire"] == "switched"
    # side known, position not
    assert (room2["conduits"][0]["side"], room2["conduits"][0]["position"]) == ("bottom", None)
    assert room2["circuits"] == [ids["T1-R1-5"], ids["T1-R1-2"]]
    window = room2["conduits"][1]["point"]
    assert window == {
        "kind": "socket",
        "label": "fenêtre",
        "room": "Chambre 2",
        "count": 1,
        "entity_id": None,
        "alert": "noircie, à remplacer",
    }


def test_circuits_carried_through_the_links() -> None:
    result, ids = _load()
    attic = result.boxes[3]  # type: ignore[index]
    circuits = effective_circuits(result.boxes)  # type: ignore[arg-type]
    by_pos = {f"{c['side']}{c['position']}": c for c in attic["conduits"]}
    assert by_pos["right1"]["circuits"] == []  # not written…
    assert circuits[by_pos["right1"]["id"]] == [ids["T1-R1-1"]]  # …but carried by the link
    assert circuits[by_pos["bottom2"]["id"]] == []  # joined to a conduit of unknown circuit
    # the earth Wago joins every circuit: it does not carry them
    assert circuit_points(result.boxes, ids["T1-R2-4"]) == {"socket": 2}  # type: ignore[arg-type]
    assert circuit_points(result.boxes, ids["T1-R3-1"]) == {"socket": 2}  # type: ignore[arg-type]


def test_points_counted_from_the_boxes() -> None:
    result, ids = _load()
    assert circuit_points(result.boxes, ids["T1-R1-5"]) == {"socket": 6}  # type: ignore[arg-type]
    assert circuit_points(result.boxes, ids["T1-R1-2"]) == {"light": 2, "socket": 1}  # type: ignore[arg-type]
    boards = copy.deepcopy(result.boards)
    for b in boards:  # type: ignore[union-attr]
        for r in b["rows"]:
            for m in r["modules"]:
                m["points_count"] = None
                if m["ref"] == "T1-R1-5":
                    m["rating_a"], m["circuit_kind"] = 16, "sockets"
    boxes = copy.deepcopy(result.boxes)
    for n in range(4):
        boxes[1]["conduits"].append(  # type: ignore[index]
            {"circuits": [ids["T1-R1-5"]], "end": "point", "point": {"kind": "socket", "label": f"x{n}"}}
        )
    boxes = validate_boxes(boxes, boards)
    codes = [w["code"] for w in check_boards(boards, boxes)]  # type: ignore[arg-type]
    assert "too_many_points" in codes  # 10 sockets on a 16 A circuit


def test_dangling_references_are_cleaned() -> None:
    result, ids = _load()
    boxes = copy.deepcopy(result.boxes)
    hall = boxes[0]  # type: ignore[index]
    hall["conduits"][0]["circuits"].append("gone")
    hall["conduits"][1]["position"] = 1
    hall["conduits"][1]["side"] = "left"  # same hole as G1
    hall["connectors"][0]["conduits"].append("gone")
    boxes.append({"name": "Autre", "conduits": [{"end": "box", "end_box_id": "gone"}]})  # type: ignore[union-attr]
    cleaned = validate_boxes(boxes, result.boards)
    assert cleaned[0]["conduits"][0]["circuits"] == [ids["T1-R1-5"]]
    assert cleaned[0]["conduits"][1]["position"] is None
    assert "gone" not in cleaned[0]["connectors"][0]["conduits"]
    assert cleaned[-1]["conduits"][0]["end"] == "unknown"


def test_round_trip_and_reimport_keeps_the_circuits() -> None:
    result, ids = _load()
    model = validate_model({"boards": result.boards, "boxes": result.boxes, "network": {}})
    again = parse_document(export_document(model))
    assert again.boxes == model["boxes"]
    # boards re-imported alone: new ids, same repères
    fresh = parse_document(FIX.read_text().split("\nboites:")[0])
    assert fresh.boxes is None
    boxes = copy.deepcopy(model["boxes"])
    remap_box_circuits(boxes, model["boards"], fresh.boards)  # type: ignore[arg-type]
    new_ids = {m["ref"]: m["id"] for b in fresh.boards for r in b["rows"] for m in r["modules"]}  # type: ignore[union-attr]
    assert boxes[0]["conduits"][0]["circuits"] == [new_ids["T1-R1-5"]]
    assert new_ids["T1-R1-5"] != ids["T1-R1-5"]
