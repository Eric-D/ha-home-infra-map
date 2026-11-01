"""Electrical consistency checks inspired by NF C 15-100.

These are *hints* ("à vérifier"), never blocking, and they do not replace an
electrician: the data is often incomplete and the standard has many cases
this module does not model. Each warning carries a `code` translated by the
card and the parameters needed to phrase it.
"""

from __future__ import annotations

import re
from typing import Final

from .models import JsonDict, ModuleIndex, board_alerts, circuit_points, row_capacity, row_used_slots

MAX_BREAKERS_PER_RCD: Final = 8
# Highest rating commonly allowed per copper cross-section (mm² -> A).
MAX_RATING_BY_SECTION: Final[dict[float, int]] = {1.5: 16, 2.5: 20, 4.0: 25, 6.0: 32}
MAX_RATING_BY_KIND: Final[dict[str, int]] = {"lighting": 16, "sockets": 20}
RCD_SUM_RATIO: Final = 2.5
MAX_LIGHT_POINTS: Final = 8
# sockets: 16 A (1.5 mm²) -> 8, 20 A (2.5 mm²) -> 12
MAX_SOCKETS_BY_RATING: Final[dict[int, int]] = {16: 8, 20: 12}


def max_points(module: JsonDict) -> int | None:
    """Highest number of points allowed on a circuit, None when no rule applies."""
    kind = module.get("circuit_kind")
    if kind == "lighting":
        return MAX_LIGHT_POINTS
    if kind == "sockets":
        rating = module.get("rating_a")
        return MAX_SOCKETS_BY_RATING.get(int(rating)) if rating else None
    return None


TYPE_A_NAMES: Final = re.compile(r"lave[- ]linge|washing|plaque|cuisson|induction|hob|cooktop", re.IGNORECASE)


def _warning(
    code: str, board: JsonDict, module: JsonDict | None, severity: str = "warning", **params: object
) -> JsonDict:
    return {
        "code": code,
        "severity": severity,
        "board_id": board["id"],
        "module_id": module["id"] if module else None,
        "ref": module.get("ref") if module else board["name"],
        "params": params,
    }


def _is_unidentified(module: JsonDict) -> bool:
    return str(module.get("circuit_name") or "").strip() in ("", "?")


def derived_points(module: JsonDict, boxes: list[JsonDict]) -> int | None:
    """Points of a circuit counted from the boxes (lights or sockets per its kind)."""
    counts = circuit_points(boxes, module["id"])
    if not counts:
        return None
    if module.get("circuit_kind") == "lighting":
        return counts.get("light", 0)
    if module.get("circuit_kind") == "sockets":
        return counts.get("socket", 0) + counts.get("outlet", 0)
    return None


def check_board(
    board: JsonDict, index: ModuleIndex | None = None, boxes: list[JsonDict] | None = None
) -> list[JsonDict]:
    """Return the warnings of one board.

    `index` resolves the feeds across boards (sub-board fed by a breaker of
    another board); without it the board is checked on its own.
    """
    index = index or ModuleIndex([board])
    warnings: list[JsonDict] = [
        {
            "code": "manual",
            "severity": alert["level"],
            "board_id": board["id"],
            "module_id": alert["module_id"],
            "ref": alert["ref"],
            "params": {"text": alert["text"]},
        }
        for alert in board_alerts(board)
    ]
    # RCD id -> breakers it protects (wherever they sit)
    groups: dict[str, list[JsonDict]] = {}
    for row in board["rows"]:
        capacity = row_capacity(board, row)
        used = row_used_slots(row)
        if capacity and used > capacity:
            warnings.append(
                {
                    "code": "row_overflow",
                    "severity": "warning",
                    "board_id": board["id"],
                    "module_id": None,
                    "ref": row.get("label") or "",
                    "params": {"row": row.get("label") or "", "used": used, "capacity": capacity},
                }
            )
        for module in row["modules"]:
            if module["kind"] == "rcd":
                groups.setdefault(module["id"], [])
    for row in board["rows"]:
        for module in row["modules"]:
            kind = module["kind"]
            # a spare breaker is not wired: nothing to check yet
            if kind not in ("breaker", "rcbo") or module.get("status") == "spare":
                continue

            protector = index.protector(module)
            if protector is not None and kind == "breaker" and protector["kind"] == "rcd":
                groups.setdefault(protector["id"], []).append(module)

            sensitivity = protector.get("sensitivity_ma") if protector else None
            not_30ma = protector is None or sensitivity is None or sensitivity > 30
            if not_30ma and module.get("circuit_kind") == "feeder":
                # a feeder to a sub-board may rely on the RCDs of that board
                warnings.append(
                    _warning("feeder_no_rcd", board, module, severity="info", sensitivity_ma=sensitivity)
                )
            elif protector is None:
                warnings.append(_warning("no_rcd", board, module))
            elif not_30ma:
                warnings.append(_warning("no_rcd_30ma", board, module, sensitivity_ma=sensitivity))

            needs_type_a = module.get("circuit_kind") == "cooking" or bool(
                TYPE_A_NAMES.search(str(module.get("circuit_name") or ""))
            )
            if (
                needs_type_a
                and protector is not None
                and protector["kind"] != "main_breaker"
                and protector.get("rcd_type") not in ("A", "F", "B")
            ):
                warnings.append(
                    _warning(
                        "rcd_type_a",
                        board,
                        module,
                        rcd_ref=protector.get("ref"),
                        rcd_type=protector.get("rcd_type") or "?",
                    )
                )

            rating = module.get("rating_a")
            section = module.get("cable_mm2")
            if rating and section:
                limit = MAX_RATING_BY_SECTION.get(float(section))
                if limit is not None and rating > limit:
                    warnings.append(
                        _warning(
                            "cable_rating", board, module, rating_a=rating, cable_mm2=section, max_a=limit
                        )
                    )
            kind_limit = MAX_RATING_BY_KIND.get(str(module.get("circuit_kind")))
            if rating and kind_limit and rating > kind_limit:
                warnings.append(
                    _warning(
                        "kind_rating",
                        board,
                        module,
                        circuit_kind=module.get("circuit_kind"),
                        rating_a=rating,
                        max_a=kind_limit,
                    )
                )
            # typed by the owner, else counted from the junction boxes
            points = module.get("points_count")
            if points is None and boxes:
                points = derived_points(module, boxes)
            limit_points = max_points(module)
            if points and limit_points is not None and points > limit_points:
                warnings.append(
                    _warning(
                        "too_many_points",
                        board,
                        module,
                        circuit_kind=module.get("circuit_kind"),
                        count=points,
                        max=limit_points,
                    )
                )
            if _is_unidentified(module):
                warnings.append(_warning("unidentified", board, module, severity="info"))

    for rcd_id, breakers in groups.items():
        rcd_module = index.modules[rcd_id]
        if len(breakers) > MAX_BREAKERS_PER_RCD:
            warnings.append(
                _warning(
                    "too_many_breakers", board, rcd_module, count=len(breakers), max=MAX_BREAKERS_PER_RCD
                )
            )
        total = sum(b.get("rating_a") or 0 for b in breakers)
        rating = rcd_module.get("rating_a")
        if rating and total > rating * RCD_SUM_RATIO:
            warnings.append(
                _warning("rcd_sum", board, rcd_module, severity="info", total_a=total, rating_a=rating)
            )
    return warnings


def check_boards(boards: list[JsonDict], boxes: list[JsonDict] | None = None) -> list[JsonDict]:
    """Return the warnings of every board."""
    index = ModuleIndex(boards)
    return [w for board in boards for w in check_board(board, index, boxes)]
