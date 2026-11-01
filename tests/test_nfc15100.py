"""Electrical consistency checks."""

from __future__ import annotations

from collections import Counter
from typing import Any

from custom_components.home_infra_map.importer import parse_document
from custom_components.home_infra_map.models import validate_boards
from custom_components.home_infra_map.nfc15100 import check_board, check_boards

from .conftest import fixture_text


def _board(modules: list[dict[str, Any]]) -> dict[str, Any]:
    return validate_boards([{"name": "B", "rows": [{"label": "R1", "modules": modules}]}])[0]


def test_example_board() -> None:
    boards = parse_document(fixture_text("electricite.yaml")).boards
    codes = Counter(w["code"] for w in check_boards(boards))  # type: ignore[arg-type]
    # T1-R1-8 is a spare: not counted; the garage feeder only has the 500 mA head
    assert codes == {
        "unidentified": 3,
        "rcd_sum": 1,
        "rcd_type_a": 1,
        "feeder_no_rcd": 1,
        "manual": 1,
        "too_many_points": 1,
    }
    [manual] = [w for w in check_boards(boards) if w["code"] == "manual"]  # type: ignore[arg-type]
    assert (manual["ref"], manual["severity"]) == ("T1-R1-2", "warning")
    assert manual["params"] == {"text": "Prise sur un circuit éclairage (chambre 2)"}
    [type_a] = [w for w in check_boards(boards) if w["code"] == "rcd_type_a"]  # type: ignore[arg-type]
    assert type_a["ref"] == "T1-R1-7" and type_a["params"]["rcd_type"] == "AC"  # washing machine behind AC


def test_breaker_fed_by_the_head_is_not_30ma() -> None:
    [board] = validate_boards(
        [
            {
                "name": "B",
                "supply": [{"id": "h", "kind": "main_breaker", "rating_a": 60, "sensitivity_ma": 500}],
                "rows": [
                    {
                        "modules": [
                            {"kind": "rcd", "sensitivity_ma": 30, "rcd_type": "A"},
                            {
                                "id": "c40",
                                "kind": "breaker",
                                "rating_a": 40,
                                "circuit_name": "PAC",
                                "fed_by": "h",
                            },
                            {"kind": "breaker", "rating_a": 2, "circuit_name": "x", "status": "spare"},
                        ]
                    }
                ],
            }
        ]
    )
    found = [(w["ref"], w["code"], w["params"]) for w in check_board(board)]
    assert found == [("", "no_rcd_30ma", {"sensitivity_ma": 500})]


def test_points_per_circuit() -> None:
    board = _board(
        [
            {"kind": "rcd", "sensitivity_ma": 30, "rcd_type": "A"},
            {
                "kind": "breaker",
                "ref": "L",
                "rating_a": 10,
                "circuit_kind": "lighting",
                "circuit_name": "x",
                "points_count": 9,
            },
            {
                "kind": "breaker",
                "ref": "P16",
                "rating_a": 16,
                "circuit_kind": "sockets",
                "circuit_name": "x",
                "points_count": 9,
            },
            {
                "kind": "breaker",
                "ref": "P20",
                "rating_a": 20,
                "circuit_kind": "sockets",
                "circuit_name": "x",
                "points_count": 12,
            },
            {
                "kind": "breaker",
                "ref": "D",
                "rating_a": 20,
                "circuit_kind": "dedicated",
                "circuit_name": "x",
                "points_count": 3,
            },
        ]
    )
    found = [(w["ref"], w["params"]["max"]) for w in check_board(board) if w["code"] == "too_many_points"]
    assert found == [("L", 8), ("P16", 8)]


def test_too_many_breakers() -> None:
    board = _board(
        [{"kind": "rcd", "rating_a": 63, "sensitivity_ma": 30}]
        + [{"kind": "breaker", "rating_a": 2, "circuit_name": "x"} for _ in range(9)]
    )
    assert [w["params"] for w in check_board(board) if w["code"] == "too_many_breakers"] == [
        {"count": 9, "max": 8}
    ]


def test_each_rule() -> None:
    board = _board(
        [
            {"kind": "breaker", "ref": "A", "rating_a": 16, "circuit_name": "x"},
            {"kind": "rcd", "ref": "ID", "rating_a": 40, "sensitivity_ma": 300, "rcd_type": "AC"},
            {"kind": "breaker", "ref": "B", "rating_a": 20, "circuit_name": "Lave-linge", "cable_mm2": 1.5},
            {
                "kind": "breaker",
                "ref": "C",
                "rating_a": 20,
                "circuit_name": "Lumières",
                "circuit_kind": "lighting",
            },
            {
                "kind": "breaker",
                "ref": "D",
                "rating_a": 32,
                "circuit_name": "Prises",
                "circuit_kind": "sockets",
            },
            {
                "kind": "rcbo",
                "ref": "E",
                "rating_a": 20,
                "sensitivity_ma": 30,
                "rcd_type": "A",
                "circuit_kind": "cooking",
                "circuit_name": "Four",
            },
        ]
    )
    found = {(w["ref"], w["code"]) for w in check_board(board)}
    assert ("A", "no_rcd") in found
    assert ("B", "no_rcd_30ma") in found
    assert ("B", "rcd_type_a") in found
    assert ("B", "cable_rating") in found
    assert ("C", "kind_rating") in found
    assert ("D", "kind_rating") in found
    assert not any(ref == "E" for ref, _ in found)
    assert all(w["severity"] in ("warning", "info") for w in check_board(board))


def test_clean_board_has_no_warning() -> None:
    board = _board(
        [
            {"kind": "rcd", "rating_a": 40, "sensitivity_ma": 30, "rcd_type": "A"},
            {
                "kind": "breaker",
                "rating_a": 16,
                "circuit_name": "Prises",
                "circuit_kind": "sockets",
                "cable_mm2": 2.5,
            },
            {"kind": "spacer"},
        ]
    )
    assert check_board(board) == []


def test_row_overflow() -> None:
    board = validate_boards(
        [
            {
                "name": "B",
                "modules_per_row": 4,
                "rows": [
                    {
                        "label": "R1",
                        "modules": [
                            {"kind": "rcd", "rating_a": 40, "sensitivity_ma": 30},
                            {"kind": "spacer", "width_modules": 3},
                        ],
                    },
                    {
                        "label": "R2",
                        "capacity": 6,
                        "modules": [
                            {"kind": "rcd", "rating_a": 40, "sensitivity_ma": 30},
                            {"kind": "spacer", "width_modules": 3},
                        ],
                    },
                ],
            }
        ]
    )[0]
    over = [w for w in check_board(board) if w["code"] == "row_overflow"]
    assert [w["params"] for w in over] == [{"row": "R1", "used": 5, "capacity": 4}]
