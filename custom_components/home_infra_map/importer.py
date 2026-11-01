"""YAML import / export.

Two input formats are accepted:

- the *native* format, produced by `export_yaml` (English keys, same shape as
  the stored model) — lossless round trip;
- the *legacy* French format of the hand-written house files (`tableaux:` for
  the electrical boards, `vlans:` / `equipements:` for the network), see
  `tests/fixtures/*.yaml`.

Parsing is pure (no Home Assistant objects) so it can be unit tested.
"""

from __future__ import annotations

import math
import re
from collections.abc import Callable
from dataclasses import dataclass, field
from typing import Any

import probatio as vol
import yaml

from .const import VERSION
from .models import (
    JsonDict,
    new_id,
    normalize_mac,
    validate_boards,
    validate_network,
    vlan_for_ip,
)

type AreaResolver = Callable[[str], str | None]


@dataclass
class ImportResult:
    """Sections found in an imported document."""

    boards: list[JsonDict] | None = None
    network: JsonDict | None = None
    house_name: str | None = None
    # board id -> photo path as written in the source file (relative)
    photos: dict[str, str] = field(default_factory=dict)
    warnings: list[str] = field(default_factory=list)

    @property
    def sections(self) -> list[str]:
        """Return the names of the sections present."""
        names = []
        if self.boards is not None:
            names.append("boards")
        if self.network is not None:
            names.append("network")
        return names


class ImportError_(vol.Invalid):  # noqa: N801 - avoid shadowing builtin ImportError
    """Raised when a document cannot be imported."""


def _unknown(value: Any) -> bool:
    return value is None or str(value).strip() in ("", "?", "—", "-")


def _clean(value: Any) -> str | None:
    if _unknown(value):
        return None
    return str(value).strip()


_RATING_RE = re.compile(r"^\s*([BCD])?\s*(\d+(?:[.,]\d+)?)\s*A?\s*$", re.IGNORECASE)
_MA_RE = re.compile(r"^\s*(\d+)\s*m?A?\s*$", re.IGNORECASE)
_IP_RE = re.compile(r"\b(\d{1,3}(?:\.\d{1,3}){3})\b")


def parse_rating(value: Any) -> tuple[str | None, int | None]:
    """Parse 'C16' / '40A' / '?' into (curve, amps)."""
    if _unknown(value):
        return None, None
    match = _RATING_RE.match(str(value))
    if not match:
        return None, None
    curve = match.group(1).upper() if match.group(1) else None
    return curve, int(float(match.group(2).replace(",", ".")))


def parse_ma(value: Any) -> int | None:
    """Parse '30mA' into 30."""
    if _unknown(value):
        return None
    match = _MA_RE.match(str(value))
    return int(match.group(1)) if match else None


_CIRCUIT_KEYWORDS: list[tuple[str, tuple[str, ...]]] = [
    ("water_heater", ("chauffe-eau", "chauffe eau", "cumulus", "ballon")),
    ("cooking", ("plaque", "cuisson", "four", "cuisinière", "induction")),
    ("heating", ("chauffage", "radiateur", "pac", "pompe à chaleur", "plancher chauffant")),
    ("lighting", ("éclairage", "eclairage", "lumière", "lumiere", "spots")),
    ("feeder", ("tableau divisionnaire", "départ", "depart", "sous-tableau")),
    (
        "dedicated",
        ("lave-linge", "lave linge", "lave-vaisselle", "lave vaisselle", "sèche-linge", "congélateur"),
    ),
    ("sockets", ("prise", "prises", "pc ")),
]


def guess_circuit_kind(name: str | None) -> str:
    """Guess a circuit kind from its name; 'unknown' when not identified."""
    if not name or name.strip() in ("?", ""):
        return "unknown"
    lowered = name.lower()
    for kind, keywords in _CIRCUIT_KEYWORDS:
        if any(k in lowered for k in keywords):
            return kind
    return "other"


_DEVICE_KIND_TYPES = {
    "routeur": "router",
    "router": "router",
    "serveur": "server",
    "server": "server",
    "switch": "switch",
    "commutateur": "switch",
    "antenne": "ap",
    "ap": "ap",
    "nas": "nas",
    "caméra": "camera",
    "camera": "camera",
    "iot": "iot",
    "ordinateur": "computer",
    "pc": "computer",
    "computer": "computer",
    "téléphone": "phone",
    "phone": "phone",
    "imprimante": "printer",
    "printer": "printer",
}

_DEVICE_KIND_KEYWORDS: list[tuple[str, tuple[str, ...]]] = [
    ("router", ("opnsense", "pfsense", "routeur", "router")),
    ("switch", ("switch",)),
    ("ap", ("antenne wi-fi", "access point", "point d'accès", "borne wi-fi")),
    ("nas", ("nas",)),
    ("camera", ("caméra", "camera", "camér")),
    ("printer", ("imprimante", "printer")),
    ("server", ("proxmox", "serveur", "server", "home assistant", "vm ", "contrôleur")),
    ("phone", ("téléphone", "phone", "iphone", "pixel")),
    ("computer", ("pc ", "ordinateur", "laptop", "portable")),
    (
        "iot",
        (
            "shelly",
            "esp32",
            "esp8266",
            "clim",
            "zigbee",
            "tondeuse",
            "lave-linge",
            "tablette",
        ),
    ),
]


def guess_device_kind(name: str, declared: Any = None) -> str:
    """Map a declared type or a device name to a device kind."""
    if declared and str(declared).strip().lower() in _DEVICE_KIND_TYPES:
        return _DEVICE_KIND_TYPES[str(declared).strip().lower()]
    lowered = f"{name.lower()} "
    for kind, keywords in _DEVICE_KIND_KEYWORDS:
        if any(k in lowered for k in keywords):
            return kind
    return "other"


def _entity_or_none(value: Any) -> str | None:
    text = _clean(value)
    if text and re.match(r"^[a-z0-9_]+\.[a-z0-9_]+$", text):
        return text
    return None


_MODULE_KEYS = frozenset(
    {"type", "modele", "entite_ha", "note", "repere", "largeur", "modules", "etat", "alimente_par", "reserve"}
)

_SPARE_WORDS = ("reserve", "réserve", "spare", "non raccorde", "non raccordé", "futur")
_OFF_WORDS = ("coupe", "coupé", "ouvert", "off", "disjoncte", "disjoncté", "hors service", "hs")
# `alimente_par:` values meaning "straight from the service entrance"
_HEAD_REFS = ("arrivee", "arrivée", "branchement", "agcp", "tete", "tête", "disjoncteur de branchement")
_FED_REF = "_fed_ref"


def parse_status(item: JsonDict, circuit: Any = None) -> str:
    """`etat: réserve` / `etat: coupé` (or `reserve: true`) -> spare / off / active."""
    if item.get("reserve") is True:
        return "spare"
    text = (_clean(item.get("etat")) or "").lower()
    if text and any(text.startswith(w) for w in _SPARE_WORDS):
        return "spare"
    if text and any(text.startswith(w) for w in _OFF_WORDS):
        return "off"
    if (_clean(circuit) or "").lower().startswith(("réserve", "reserve")):
        return "spare"
    return "active"


def _common(item: JsonDict, circuit: Any = None) -> JsonDict:
    """Fields shared by every element: state, `alimente_par`, width."""
    extra: JsonDict = {"status": parse_status(item, circuit), **_width(item)}
    if fed := _clean(item.get("alimente_par")):
        extra[_FED_REF] = fed
    return extra


def _rejoin_flow_commas(mod: JsonDict) -> JsonDict:
    """Repair `{type: Module de mesure (compteur, 3 voies)}`.

    In a YAML flow mapping an unquoted comma ends the value: the rest of the
    text becomes a key with a null value. When the `type` has an unclosed
    parenthesis, glue those null keys back, in order.
    """
    label = mod.get("type")
    if not isinstance(label, str) or label.count("(") <= label.count(")"):
        return mod
    extra = [k for k, v in mod.items() if k not in _MODULE_KEYS and v is None]
    if not extra:
        return mod
    fixed = {k: v for k, v in mod.items() if k not in extra}
    fixed["type"] = ", ".join([label, *map(str, extra)])
    return fixed


def _width(item: JsonDict) -> dict[str, int]:
    """`largeur: 2` (or `modules: 2`) = number of DIN slots (18 mm) taken."""
    for key in ("largeur", "modules"):
        value = item.get(key)
        if isinstance(value, int) and not isinstance(value, bool) and value > 0:
            return {"width_modules": value}
        if isinstance(value, str) and value.strip().isdigit():
            return {"width_modules": int(value.strip())}
    return {}


def _int_or_none(value: Any) -> int | None:
    if isinstance(value, bool):
        return None
    if isinstance(value, int):
        return value
    if isinstance(value, str) and value.strip().isdigit():
        return int(value.strip())
    return None


def _spacer(value: Any, ref: str) -> JsonDict:
    """`{vide: 2}` / `vide: 2` = an empty place of 2 slots (1 if no number)."""
    width = _int_or_none(value) or 1
    return {"kind": "spacer", "ref": ref, "width_modules": width}


def _legacy_rcd(diff: JsonDict, ref: str) -> JsonDict:
    _curve, amps = parse_rating(diff.get("calibre"))
    rcd_type = _clean(diff.get("type"))
    return {
        "kind": "rcd",
        "ref": _clean(diff.get("repere")) or ref,
        "model": _clean(diff.get("modele")),
        "rating_a": amps,
        "sensitivity_ma": parse_ma(diff.get("sensibilite")),
        "rcd_type": rcd_type.upper() if rcd_type else "?",
        "notes": _clean(diff.get("note")),
        **_common(diff),
    }


def _legacy_breaker(disj: JsonDict, ref: str, resolve_area: AreaResolver | None) -> JsonDict:
    curve, amps = parse_rating(disj.get("calibre"))
    circuit = disj.get("circuit")
    circuit_name = "?" if _unknown(circuit) else str(circuit).strip()
    notes = [n for n in [_clean(disj.get("note"))] if n]
    area_ids: list[str] = []
    for piece in disj.get("pieces") or []:
        area_id = resolve_area(str(piece)) if resolve_area else None
        if area_id:
            area_ids.append(area_id)
        else:
            notes.append(f"Pièce : {piece}")
    cable = disj.get("section")
    sensitivity = parse_ma(disj.get("sensibilite"))
    is_rcbo = bool(disj.get("differentiel")) or sensitivity is not None
    module: JsonDict = {
        "kind": "rcbo" if is_rcbo else "breaker",
        "ref": _clean(disj.get("repere")) or ref,
        "model": _clean(disj.get("modele")),
        "rating_a": amps,
        "curve": curve or "?",
        "cable_mm2": None
        if _unknown(cable)
        else float(str(cable).lower().replace("mm2", "").replace("mm²", "").replace(",", ".")),
        "circuit_name": circuit_name,
        "circuit_kind": guess_circuit_kind(circuit_name),
        "area_ids": area_ids,
        "power_entity_id": _entity_or_none(disj.get("entite_puissance")),
        "notes": "\n".join(notes) or None,
        **_common(disj, circuit),
    }
    if is_rcbo:
        rcd_type = _clean(disj.get("type"))
        module["sensitivity_ma"] = sensitivity or 30
        module["rcd_type"] = (
            rcd_type.upper() if rcd_type and rcd_type.upper() in ("AC", "A", "F", "B") else "?"
        )
    return module


def _legacy_device(raw: JsonDict, ref: str) -> JsonDict:
    mod = _rejoin_flow_commas(raw)
    notes = [n for n in [_clean(mod.get("note"))] if n]
    entity = _entity_or_none(mod.get("entite_ha"))
    if not entity and _clean(mod.get("entite_ha")):
        notes.append(f"Entité HA : {mod.get('entite_ha')}")
    model = mod.get("modele")
    if model is not None and not _clean(model):
        model = None
    return {
        "kind": "device",
        "ref": _clean(mod.get("repere")) or ref,
        "label": _clean(mod.get("type")) or "?",
        "model": str(model).strip() if model else None,
        "entity_ids": [entity] if entity else [],
        "notes": "\n".join(notes) or None,
        **_common(mod),
    }


_ELEMENT_KINDS = ("differentiel", "disjoncteur", "module", "vide")


def _legacy_row(rangee: JsonDict, row_ref: str, resolve_area: AreaResolver | None) -> list[JsonDict]:
    """Modules of a row in physical order (left to right).

    Two layouts are accepted:
    - `elements:` an ordered list, each item being `{differentiel: {...}}`,
      `{disjoncteur: {...}}`, `{module: {...}}` or `{vide: 2}`;
    - the historical one: `differentiel`, then `disjoncteurs`, then `modules`
      (each list may contain `{vide: n}` holes).
    Any item may carry `largeur: n` (DIN slots taken).
    """
    modules: list[JsonDict] = []
    counters = {"disjoncteur": 0, "module": 0, "vide": 0}

    def add(kind: str, value: Any) -> None:
        if kind == "vide":
            counters["vide"] += 1
            modules.append(_spacer(value, f"{row_ref}-V{counters['vide']}"))
        elif kind == "differentiel":
            modules.append(_legacy_rcd(value or {}, f"{row_ref}-ID"))
        elif kind == "disjoncteur":
            counters["disjoncteur"] += 1
            modules.append(_legacy_breaker(value or {}, f"{row_ref}-{counters['disjoncteur']}", resolve_area))
        else:
            counters["module"] += 1
            modules.append(_legacy_device(value or {}, f"{row_ref}-M{counters['module']}"))

    def is_hole(item: Any) -> bool:
        return isinstance(item, dict) and "vide" in item and len(item) == 1

    if isinstance(rangee.get("elements"), list):
        for index, element in enumerate(rangee["elements"], start=1):
            if (
                not isinstance(element, dict)
                or len(element) != 1
                or next(iter(element)) not in _ELEMENT_KINDS
            ):
                raise ImportError_(
                    f"{row_ref}: elements[{index}] must be one of "
                    "{differentiel: …}, {disjoncteur: …}, {module: …}, {vide: n}"
                )
            kind, value = next(iter(element.items()))
            add(kind, value)
        return modules

    if diff := rangee.get("differentiel"):
        add("differentiel", diff)
    for key, kind in (("disjoncteurs", "disjoncteur"), ("modules", "module")):
        for item in rangee.get(key) or []:
            if is_hole(item):
                add("vide", item["vide"])
            else:
                add(kind, item)
    return modules


def _parse_kva(value: Any) -> float | None:
    if _unknown(value):
        return None
    match = re.match(r"^\s*(\d+(?:[.,]\d+)?)", str(value))
    return float(match.group(1).replace(",", ".")) if match else None


def _legacy_supply(arrivee: Any, code: str) -> list[JsonDict]:
    """`arrivee: {compteur: {...}, disjoncteur: {...}}` -> service entrance.

    The meter comes first (upstream), then the main breaker.
    """
    if not isinstance(arrivee, dict):
        return []
    supply: list[JsonDict] = []
    meter = arrivee.get("compteur")
    if isinstance(meter, dict):
        supply.append(
            {
                "kind": "meter",
                "ref": _clean(meter.get("repere")) or f"{code}-CPT",
                "model": _clean(meter.get("modele")),
                "subscribed_kva": _parse_kva(meter.get("puissance_souscrite") or meter.get("puissance")),
                "power_entity_id": _entity_or_none(meter.get("entite_puissance")),
                "energy_entity_id": _entity_or_none(meter.get("entite_energie")),
                "notes": _clean(meter.get("note")),
                "status": parse_status(meter),
            }
        )
    breaker = arrivee.get("disjoncteur") or arrivee.get("disjoncteur_branchement")
    if isinstance(breaker, dict):
        _curve, amps = parse_rating(breaker.get("calibre"))
        supply.append(
            {
                "kind": "main_breaker",
                "ref": _clean(breaker.get("repere")) or f"{code}-AGCP",
                "model": _clean(breaker.get("modele")),
                "rating_a": amps,
                "sensitivity_ma": parse_ma(breaker.get("sensibilite")),
                "notes": _clean(breaker.get("note")),
                "status": parse_status(breaker),
            }
        )
    return supply


def _resolve_feeds(boards: list[JsonDict], board_refs: dict[str, str], result: ImportResult) -> None:
    """Turn the `alimente_par:` references (repères) into module ids."""
    by_ref: dict[str, str] = {}
    for board in boards:
        for module in [*board["supply"], *(m for row in board["rows"] for m in row["modules"])]:
            module.setdefault("id", new_id())
            if module.get("ref"):
                by_ref.setdefault(str(module["ref"]).lower(), module["id"])

    def resolve(ref: str, board: JsonDict) -> str | None:
        key = ref.strip().lower()
        if key in _HEAD_REFS:
            if board["supply"]:
                return str(board["supply"][-1]["id"])
            result.warnings.append(f"{ref}: no service entrance (arrivee:) on board {board['name']}")
            return None
        if key in by_ref:
            return by_ref[key]
        result.warnings.append(f"alimente_par: unknown reference {ref!r}")
        return None

    for board in boards:
        if ref := board_refs.get(board["id"]):
            board["fed_by"] = resolve(ref, board)
        for module in [*board["supply"], *(m for row in board["rows"] for m in row["modules"])]:
            if ref := module.pop(_FED_REF, None):
                module["fed_by"] = resolve(ref, board)


def _legacy_boards(
    tableaux: list[Any], resolve_area: AreaResolver | None, result: ImportResult
) -> list[JsonDict]:
    boards: list[JsonDict] = []
    board_refs: dict[str, str] = {}
    for t_index, tableau in enumerate(tableaux, start=1):
        if not isinstance(tableau, dict):
            raise ImportError_(f"tableaux[{t_index}] must be a mapping")
        board_id = new_id()
        board: JsonDict = {
            "id": board_id,
            "name": _clean(tableau.get("nom")) or str(tableau.get("id") or f"Tableau {t_index}"),
            "location": _clean(tableau.get("emplacement")),
            # slots per DIN rail (13, 18, 24…); a row may override it
            "modules_per_row": _int_or_none(tableau.get("modules_par_rangee")),
            "supply": _legacy_supply(
                tableau.get("arrivee") or tableau.get("branchement"), str(tableau.get("id") or f"T{t_index}")
            ),
            "rows": [],
        }
        if fed := _clean(tableau.get("alimente_par")):
            board_refs[board_id] = fed
        if photo := _clean(tableau.get("photo")):
            result.photos[board_id] = photo
        for r_index, rangee in enumerate(tableau.get("rangees") or [], start=1):
            row_ref = str(rangee.get("id") or f"R{r_index}")
            label = row_ref.rsplit("-", maxsplit=1)[-1] if "-" in row_ref else row_ref
            board["rows"].append(
                {
                    "label": label,
                    "capacity": _int_or_none(rangee.get("modules_par_rangee") or rangee.get("capacite")),
                    "modules": _legacy_row(rangee, row_ref, resolve_area),
                }
            )
        boards.append(board)
    _resolve_feeds(boards, board_refs, result)
    return validate_boards(boards)


def _parse_box(value: Any) -> tuple[str, str | None]:
    text = _clean(value) or ""
    match = _IP_RE.search(text)
    ip = match.group(1) if match else None
    # em dash, en dash and hyphen are all used as separators in house files
    name = re.split(r"\s+[—–-]\s+", text)[0].strip() if ip else text  # noqa: RUF001
    return name, ip


def _legacy_network(doc: JsonDict) -> JsonDict:
    internet = doc.get("internet") or {}
    box_name, box_ip = _parse_box(internet.get("box"))
    network: JsonDict = {
        "uplink": {
            "isp": _clean(internet.get("fai")) or "",
            "box_name": box_name,
            "box_ip": box_ip,
            "public_ip": _clean(internet.get("ip_publique")),
        },
        "vlans": [],
        "switches": [],
        "devices": [],
    }
    vlan_by_name: dict[str, str] = {}
    for vlan in doc.get("vlans") or []:
        vid = new_id()
        name = str(vlan.get("id") or vlan.get("nom") or "").strip()
        tag = vlan.get("tag")
        network["vlans"].append(
            {
                "id": vid,
                "name": name,
                "tag": None if _unknown(tag) else int(tag),
                "subnet": _clean(vlan.get("reseau")),
                "color": _clean(vlan.get("couleur")) or "#607d8b",
                "role": _clean(vlan.get("role")) or "",
                "access_summary": _clean(vlan.get("acces")) or "",
            }
        )
        vlan_by_name[name.lower()] = vid

    equipements = doc.get("equipements") or []
    switch_ports = {int(k): str(v) for k, v in (doc.get("switch_ports") or {}).items()}
    ports_seen = set(switch_ports) | {int(e["port"]) for e in equipements if not _unknown(e.get("port"))}

    switch: JsonDict | None = None
    for equip in equipements:
        if guess_device_kind(str(equip.get("nom", "")), equip.get("type")) == "switch":
            max_port = max(ports_seen, default=24)
            copper = 24 if max_port > 24 else max(8, max_port)
            total = max(copper, int(math.ceil(max_port / 4) * 4))
            switch = {
                "id": new_id(),
                "name": str(equip.get("nom")),
                "host": _clean(equip.get("ip")),
                "ports_count": total,
                "sfp_ports": list(range(copper + 1, total + 1)),
                "port_labels": {str(k): v for k, v in sorted(switch_ports.items())},
            }
            network["switches"].append(switch)
            break
    if switch is None and ports_seen:
        max_port = max(ports_seen)
        switch = {
            "id": new_id(),
            "name": "Switch",
            "ports_count": max(8, int(math.ceil(max_port / 4) * 4)),
            "port_labels": {str(k): v for k, v in sorted(switch_ports.items())},
        }
        network["switches"].append(switch)

    for equip in equipements:
        name = str(equip.get("nom") or "").strip()
        host = _clean(equip.get("ip")) or ""
        vlan_name = (_clean(equip.get("vlan")) or "").lower()
        vlan_id = vlan_by_name.get(vlan_name)
        if vlan_id is None:
            found = vlan_for_ip(network["vlans"], host)
            vlan_id = found["id"] if found else None
        port = None if _unknown(equip.get("port")) else int(equip["port"])
        network["devices"].append(
            {
                "id": new_id(),
                "name": name,
                "host": host,
                "mac": normalize_mac(_clean(equip.get("mac"))),
                "vlan_id": vlan_id,
                "switch_id": switch["id"] if switch and port is not None else None,
                "port": port,
                # a port written in the house file is a human statement
                "port_source": "manual" if port is not None else "auto",
                "kind": guess_device_kind(name, equip.get("type")),
                "notes": _clean(equip.get("note")),
                "monitor": {"ping": True, "latency": False},
            }
        )

    # Wi-Fi clients sit on the port of their access point: link them.
    ap_by_port = {
        d["port"]: d["id"] for d in network["devices"] if d["kind"] == "ap" and d["port"] is not None
    }
    for device in network["devices"]:
        parent = ap_by_port.get(device["port"])
        if parent and parent != device["id"] and device["kind"] not in ("switch", "router"):
            device["parent_device_id"] = parent
    return validate_network(network)


def parse_document(text: str, resolve_area: AreaResolver | None = None) -> ImportResult:
    """Parse an import document (native or legacy format)."""
    try:
        doc = yaml.safe_load(text)
    except yaml.YAMLError as err:
        raise ImportError_(f"invalid YAML: {err}") from err
    if not isinstance(doc, dict):
        raise ImportError_("the document must be a YAML mapping")

    result = ImportResult()
    if "boards" in doc or "network" in doc:
        if "boards" in doc:
            result.boards = validate_boards(doc.get("boards") or [])
        if "network" in doc:
            result.network = validate_network(doc.get("network") or {})
        if doc.get("house_name"):
            result.house_name = str(doc["house_name"])
        return result

    if "tableaux" in doc:
        result.boards = _legacy_boards(doc.get("tableaux") or [], resolve_area, result)
    if "equipements" in doc or "vlans" in doc:
        result.network = _legacy_network(doc)
    if not result.sections:
        raise ImportError_(
            "nothing to import: expected 'boards'/'network' or 'tableaux'/'vlans'/'equipements'"
        )
    return result


def export_document(model: JsonDict) -> str:
    """Serialise the model to the native YAML format (no secrets: none are stored)."""
    payload = {
        "home_infra_map": VERSION,
        "house_name": model.get("house_name", ""),
        "boards": model["boards"],
        "network": model["network"],
    }
    header = (
        "# Home Infra Map export — re-importable with home_infra_map.import_yaml\n"
        "# Contains your house documentation: keep it private.\n"
    )
    body: str = yaml.safe_dump(payload, allow_unicode=True, sort_keys=False, width=100)
    return header + body
