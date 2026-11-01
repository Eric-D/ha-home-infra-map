"""Data model of Home Infra Map: schemas, normalisation and pure helpers.

The model is stored as plain JSON-compatible dicts (it goes to `.storage` and
over the websocket as-is). Every write path goes through `validate_*` so the
stored document is always normalised: missing keys get their defaults, unknown
keys are dropped, enums are checked.
"""

from __future__ import annotations

import ipaddress
import re
import uuid
from typing import Any, Final

import probatio as vol

type JsonDict = dict[str, Any]

MODULE_KINDS: Final = ("rcd", "breaker", "rcbo", "device", "spacer", "meter", "main_breaker")
# Kinds of the service entrance (board `supply`), drawn above the rails.
SUPPLY_KINDS: Final = ("meter", "main_breaker")
# active = in service; off = switched off / tripped; spare = installed for
# future works, not wired.
MODULE_STATUSES: Final = ("active", "off", "spare")
ALERT_LEVELS: Final = ("warning", "info")
RCD_TYPES: Final = ("AC", "A", "F", "B", "?")
CURVES: Final = ("B", "C", "D", "?")
CIRCUIT_KINDS: Final = (
    "lighting",
    "sockets",
    "dedicated",
    "cooking",
    "water_heater",
    "heating",
    "feeder",
    "other",
    "unknown",
)
DEVICE_KINDS: Final = (
    "router",
    "switch",
    "ap",
    "server",
    "nas",
    "camera",
    "iot",
    "computer",
    "phone",
    "printer",
    "other",
)
PORT_SOURCES: Final = ("auto", "manual")
DEFAULT_WIDTH: Final = {
    "rcd": 2,
    "breaker": 1,
    "rcbo": 1,
    "device": 1,
    "spacer": 1,
    "meter": 4,
    "main_breaker": 2,
}

_MAC_RE = re.compile(r"^[0-9a-f]{2}(:[0-9a-f]{2}){5}$")
_COLOR_RE = re.compile(r"^#[0-9a-fA-F]{6}$")


def new_id() -> str:
    """Return a new stable internal identifier."""
    return uuid.uuid4().hex


def normalize_mac(value: Any) -> str | None:
    """Return a lowercase colon-separated MAC, or None if not a MAC."""
    if value is None or value == "":
        return None
    text = re.sub(r"[^0-9a-fA-F]", "", str(value)).lower()
    if len(text) != 12:
        raise vol.Invalid(f"invalid MAC address: {value!r}")
    return ":".join(text[i : i + 2] for i in range(0, 12, 2))


def _optional_str(value: Any) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    return text or None


def _str(value: Any) -> str:
    return "" if value is None else str(value).strip()


def _cidr(value: Any) -> str | None:
    if value in (None, ""):
        return None
    try:
        return str(ipaddress.ip_network(str(value).strip(), strict=False))
    except ValueError as err:
        raise vol.Invalid(f"invalid subnet: {value!r}") from err


def _color(value: Any) -> str:
    text = _str(value)
    if not _COLOR_RE.match(text):
        return "#607d8b"
    return text.lower()


def _opt_int(minimum: int, maximum: int) -> Any:
    return vol.Any(None, vol.All(vol.Coerce(int), vol.Range(min=minimum, max=maximum)))


def _opt_float(minimum: float, maximum: float) -> Any:
    return vol.Any(None, vol.All(vol.Coerce(float), vol.Range(min=minimum, max=maximum)))


def _entity_id(value: Any) -> str | None:
    text = _optional_str(value)
    if text is None:
        return None
    if not re.match(r"^[a-z0-9_]+\.[a-z0-9_]+$", text):
        raise vol.Invalid(f"invalid entity id: {value!r}")
    return text


_ID = vol.All(vol.Coerce(str), vol.Length(min=1, max=64))

MODULE_SCHEMA: Final = vol.Schema(
    {
        vol.Optional("id", default=new_id): _ID,
        vol.Required("kind"): vol.In(MODULE_KINDS),
        vol.Optional("ref", default=""): _str,
        vol.Optional("width_modules"): vol.All(vol.Coerce(int), vol.Range(min=1, max=24)),
        vol.Optional("model", default=None): _optional_str,
        vol.Optional("notes", default=None): _optional_str,
        vol.Optional("status", default="active"): vol.In(MODULE_STATUSES),
        # alert written by the owner ("socket on a lighting circuit"…)
        vol.Optional("alert", default=None): _optional_str,
        vol.Optional("alert_level", default="warning"): vol.In(ALERT_LEVELS),
        # module feeding this one; None = automatic (last RCD to the left on
        # the row, else the board's service entrance)
        vol.Optional("fed_by", default=None): _optional_str,
        # protection
        vol.Optional("rating_a", default=None): _opt_int(1, 250),
        vol.Optional("curve", default="C"): vol.In(CURVES),
        vol.Optional("sensitivity_ma", default=None): _opt_int(1, 1000),
        vol.Optional("rcd_type", default="?"): vol.In(RCD_TYPES),
        vol.Optional("cable_mm2", default=None): _opt_float(0.5, 240),
        # meter: subscribed power (kVA)
        vol.Optional("subscribed_kva", default=None): _opt_float(1, 250),
        # circuit
        vol.Optional("circuit_name", default="?"): _str,
        vol.Optional("circuit_kind", default="unknown"): vol.In(CIRCUIT_KINDS),
        # sockets or light points on the circuit
        vol.Optional("points_count", default=None): _opt_int(0, 99),
        vol.Optional("area_ids", default=list): [_str],
        vol.Optional("power_entity_id", default=None): _entity_id,
        vol.Optional("energy_entity_id", default=None): _entity_id,
        vol.Optional("switch_entity_id", default=None): _entity_id,
        # "device" modules (Shelly, contactor, DIN socket, ...)
        vol.Optional("label", default=""): _str,
        vol.Optional("entity_ids", default=list): [_entity_id],
    },
    extra=vol.REMOVE_EXTRA,
)

ROW_SCHEMA: Final = vol.Schema(
    {
        vol.Optional("id", default=new_id): _ID,
        vol.Optional("label", default=""): _str,
        # DIN slots of this rail when it differs from the board's
        vol.Optional("capacity", default=None): _opt_int(1, 96),
        vol.Optional("modules", default=list): [MODULE_SCHEMA],
    },
    extra=vol.REMOVE_EXTRA,
)

BOARD_SCHEMA: Final = vol.Schema(
    {
        vol.Optional("id", default=new_id): _ID,
        vol.Required("name"): vol.All(_str, vol.Length(min=1, max=120)),
        vol.Optional("location", default=None): _optional_str,
        vol.Optional("area_id", default=None): _optional_str,
        vol.Optional("photo_path", default=None): _optional_str,
        # DIN slots per rail (13, 18, 24…); None = not documented
        vol.Optional("modules_per_row", default=None): _opt_int(1, 96),
        # service entrance, upstream first (utility meter, main breaker…)
        vol.Optional("supply", default=list): [MODULE_SCHEMA],
        # module of another board feeding this one (sub-board)
        vol.Optional("fed_by", default=None): _optional_str,
        vol.Optional("rows", default=list): [ROW_SCHEMA],
    },
    extra=vol.REMOVE_EXTRA,
)

VLAN_SCHEMA: Final = vol.Schema(
    {
        vol.Optional("id", default=new_id): _ID,
        vol.Required("name"): vol.All(_str, vol.Length(min=1, max=64)),
        vol.Optional("tag", default=None): _opt_int(1, 4094),
        vol.Optional("subnet", default=None): _cidr,
        vol.Optional("color", default="#607d8b"): _color,
        vol.Optional("role", default=""): _str,
        vol.Optional("access_summary", default=""): _str,
        vol.Optional("interface", default=None): _optional_str,
    },
    extra=vol.REMOVE_EXTRA,
)

UPLINK_SCHEMA: Final = vol.Schema(
    {
        vol.Optional("isp", default=""): _str,
        vol.Optional("box_name", default=""): _str,
        vol.Optional("box_ip", default=None): _optional_str,
        vol.Optional("public_ip", default=None): _optional_str,
    },
    extra=vol.REMOVE_EXTRA,
)

SWITCH_SCHEMA: Final = vol.Schema(
    {
        vol.Optional("id", default=new_id): _ID,
        vol.Required("name"): vol.All(_str, vol.Length(min=1, max=120)),
        vol.Optional("host", default=None): _optional_str,
        vol.Optional("model", default=None): _optional_str,
        vol.Optional("ports_count", default=24): vol.All(vol.Coerce(int), vol.Range(min=1, max=128)),
        vol.Optional("sfp_ports", default=list): [vol.All(vol.Coerce(int), vol.Range(min=1, max=128))],
        vol.Optional("snmp_source_id", default=None): _optional_str,
        vol.Optional("port_labels", default=dict): {vol.Coerce(str): _str},
    },
    extra=vol.REMOVE_EXTRA,
)

MONITOR_SCHEMA: Final = vol.Schema(
    {
        vol.Optional("ping", default=True): bool,
        vol.Optional("latency", default=False): bool,
        vol.Optional("tcp_port", default=None): _opt_int(1, 65535),
        vol.Optional("offline_alert_minutes", default=None): _opt_int(1, 10080),
    },
    extra=vol.REMOVE_EXTRA,
)

DEVICE_SCHEMA: Final = vol.Schema(
    {
        vol.Optional("id", default=new_id): _ID,
        vol.Required("name"): vol.All(_str, vol.Length(min=1, max=120)),
        vol.Optional("host", default=""): _str,
        vol.Optional("mac", default=None): normalize_mac,
        vol.Optional("vlan_id", default=None): _optional_str,
        vol.Optional("switch_id", default=None): _optional_str,
        vol.Optional("port", default=None): _opt_int(0, 512),
        vol.Optional("port_source", default="auto"): vol.In(PORT_SOURCES),
        vol.Optional("last_seen_port_at", default=None): _optional_str,
        vol.Optional("area_id", default=None): _optional_str,
        vol.Optional("parent_device_id", default=None): _optional_str,
        vol.Optional("kind", default="other"): vol.In(DEVICE_KINDS),
        vol.Optional("model", default=None): _optional_str,
        vol.Optional("notes", default=None): _optional_str,
        vol.Optional("monitor", default=dict): MONITOR_SCHEMA,
    },
    extra=vol.REMOVE_EXTRA,
)

NETWORK_SCHEMA: Final = vol.Schema(
    {
        vol.Optional("vlans", default=list): [VLAN_SCHEMA],
        vol.Optional("uplink", default=dict): UPLINK_SCHEMA,
        vol.Optional("switches", default=list): [SWITCH_SCHEMA],
        vol.Optional("devices", default=list): [DEVICE_SCHEMA],
    },
    extra=vol.REMOVE_EXTRA,
)

SECTIONS: Final = ("boards", "network")


def _fill_module_defaults(module: JsonDict) -> JsonDict:
    module.setdefault("width_modules", DEFAULT_WIDTH[module["kind"]])
    return module


def _unique_ids(items: list[JsonDict], what: str) -> None:
    seen: set[str] = set()
    for item in items:
        if item["id"] in seen:
            raise vol.Invalid(f"duplicate {what} id: {item['id']}")
        seen.add(item["id"])


def validate_boards(value: Any) -> list[JsonDict]:
    """Validate and normalise the list of electrical boards."""
    boards: list[JsonDict] = vol.Schema([BOARD_SCHEMA])(value)
    _unique_ids(boards, "board")
    modules: list[JsonDict] = []
    for board in boards:
        _unique_ids(board["rows"], "row")
        for module in board["supply"]:
            _fill_module_defaults(module)
            modules.append(module)
        for row in board["rows"]:
            for module in row["modules"]:
                _fill_module_defaults(module)
                modules.append(module)
    _unique_ids(modules, "module")
    _clean_feeds(boards)
    return boards


def _clean_feeds(boards: list[JsonDict]) -> None:
    """Clear dangling or looping `fed_by` links instead of rejecting the save.

    Deleting a module must not make the boards unsavable; a link closing a
    loop (A fed by B fed by A) is dropped.
    """
    index = ModuleIndex(boards)
    for module in index.modules.values():
        if module["fed_by"] not in index.modules or module["fed_by"] == module["id"]:
            module["fed_by"] = None
    for board in boards:
        if board["fed_by"] not in index.modules:
            board["fed_by"] = None
    for module in index.modules.values():
        if module["fed_by"] and index.loops(module):
            module["fed_by"] = None
    for board in boards:
        if board["fed_by"]:
            index = ModuleIndex(boards)
            if any(index.loops(m) for m in index.board_modules(board)):
                board["fed_by"] = None


def validate_network(value: Any) -> JsonDict:
    """Validate and normalise the network section."""
    network: JsonDict = NETWORK_SCHEMA(value)
    _unique_ids(network["vlans"], "vlan")
    _unique_ids(network["switches"], "switch")
    _unique_ids(network["devices"], "device")
    vlan_ids = {v["id"] for v in network["vlans"]}
    switch_ids = {s["id"] for s in network["switches"]}
    device_ids = {d["id"] for d in network["devices"]}
    for device in network["devices"]:
        # Dangling references are cleared rather than rejected: deleting a
        # VLAN must not make the whole network section unsavable.
        if device["vlan_id"] not in vlan_ids:
            device["vlan_id"] = None
        if device["switch_id"] not in switch_ids:
            device["switch_id"] = None
        if device["parent_device_id"] not in device_ids or device["parent_device_id"] == device["id"]:
            device["parent_device_id"] = None
    return network


def empty_model(house_name: str = "") -> JsonDict:
    """Return an empty model."""
    return {
        "house_name": house_name,
        "boards": [],
        "network": validate_network({}),
    }


def validate_model(value: Any) -> JsonDict:
    """Validate a full model document (without the revision counter)."""
    if not isinstance(value, dict):
        raise vol.Invalid("model must be a mapping")
    return {
        "house_name": _str(value.get("house_name")),
        "boards": validate_boards(value.get("boards") or []),
        "network": validate_network(value.get("network") or {}),
    }


# ---------------------------------------------------------------------------
# Pure helpers
# ---------------------------------------------------------------------------


def parse_ip(host: str | None) -> ipaddress.IPv4Address | ipaddress.IPv6Address | None:
    """Return the IP address if `host` is a literal IP."""
    if not host:
        return None
    try:
        return ipaddress.ip_address(host.strip())
    except ValueError:
        return None


def vlan_for_ip(vlans: list[JsonDict], host: str | None) -> JsonDict | None:
    """Return the VLAN whose subnet contains `host` (most specific first)."""
    ip = parse_ip(host)
    if ip is None:
        return None
    best: tuple[int, JsonDict] | None = None
    for vlan in vlans:
        if not vlan.get("subnet"):
            continue
        net = ipaddress.ip_network(vlan["subnet"], strict=False)
        if ip.version == net.version and ip in net and (best is None or net.prefixlen > best[0]):
            best = (net.prefixlen, vlan)
    return best[1] if best else None


def iter_modules(board: JsonDict) -> list[tuple[JsonDict, JsonDict]]:
    """Return (row, module) pairs of a board in physical order."""
    return [(row, module) for row in board["rows"] for module in row["modules"]]


def upstream_rcd(row: JsonDict, module_id: str) -> JsonDict | None:
    """Return the RCD protecting a module: the last RCD to its left in the row.

    An RCBO protects itself. Returns None when nothing is found; the caller
    decides whether a head RCD of the board applies.
    """
    current: JsonDict | None = None
    for module in row["modules"]:
        if module["id"] == module_id:
            return module if module["kind"] == "rcbo" else current
        if module["kind"] == "rcd":
            current = module
    return None


class ModuleIndex:
    """Who feeds whom, across every board.

    A module is fed by its explicit `fed_by`, else (on a rail) by the last RCD
    to its left, else by the last element of its board's service entrance,
    else by the module feeding the board. Entrance elements are chained in
    order (meter, then main breaker).
    """

    def __init__(self, boards: list[JsonDict]) -> None:
        self.modules: dict[str, JsonDict] = {}
        self._default: dict[str, str | None] = {}
        for board in boards:
            head = board["fed_by"]
            for module in board["supply"]:
                self.modules[module["id"]] = module
                self._default[module["id"]] = head
                head = module["id"]
            for row in board["rows"]:
                rcd: str | None = None
                for module in row["modules"]:
                    self.modules[module["id"]] = module
                    if module["kind"] in SUPPLY_KINDS or module["kind"] == "rcd":
                        self._default[module["id"]] = head
                        if module["kind"] == "rcd":
                            rcd = module["id"]
                    else:
                        self._default[module["id"]] = rcd or head

    def board_modules(self, board: JsonDict) -> list[JsonDict]:
        """Every module of a board, entrance first."""
        return [*board["supply"], *(m for row in board["rows"] for m in row["modules"])]

    def feeder(self, module: JsonDict) -> JsonDict | None:
        """Module directly upstream of `module` (None at the head)."""
        target = module.get("fed_by") or self._default.get(module["id"])
        return self.modules.get(target) if target else None

    def chain(self, module: JsonDict) -> list[JsonDict]:
        """Modules upstream of `module`, nearest first (stops on a loop)."""
        result: list[JsonDict] = []
        seen = {module["id"]}
        current = self.feeder(module)
        while current is not None and current["id"] not in seen:
            result.append(current)
            seen.add(current["id"])
            current = self.feeder(current)
        return result

    def loops(self, module: JsonDict) -> bool:
        """True when following the feeds from `module` comes back to it."""
        seen = {module["id"]}
        current = self.feeder(module)
        while current is not None:
            if current["id"] in seen:
                return bool(current["id"] == module["id"])
            seen.add(current["id"])
            current = self.feeder(current)
        return False

    def protector(self, module: JsonDict) -> JsonDict | None:
        """Residual-current device protecting `module` (an RCBO protects itself).

        The main breaker counts when its sensitivity is known (500 mA
        typically): the caller then flags it as not 30 mA.
        """
        if module["kind"] == "rcbo":
            return module
        for upstream in self.chain(module):
            if upstream["kind"] in ("rcd", "rcbo"):
                return upstream
            if upstream["kind"] == "main_breaker" and upstream.get("sensitivity_ma"):
                return upstream
        return None

    def fed(self, module_id: str) -> list[JsonDict]:
        """Modules directly fed by `module_id`."""
        return [m for m in self.modules.values() if (self.feeder(m) or {}).get("id") == module_id]


def board_alerts(board: JsonDict) -> list[JsonDict]:
    """Alerts written by the owner on the modules of a board (entrance first)."""
    modules = [*board.get("supply", []), *(m for row in board["rows"] for m in row["modules"])]
    return [
        {
            "module_id": m["id"],
            "ref": m.get("ref") or "",
            "text": m["alert"],
            "level": m.get("alert_level") or "warning",
        }
        for m in modules
        if m.get("alert")
    ]


def row_capacity(board: JsonDict, row: JsonDict) -> int | None:
    """DIN slots of a rail: the row's own value, else the board's."""
    capacity: int | None = row.get("capacity") or board.get("modules_per_row")
    return capacity


def row_used_slots(row: JsonDict) -> int:
    """DIN slots taken by the modules of a row (holes included)."""
    return sum(int(m.get("width_modules") or 1) for m in row["modules"])


def board_power_entities(board: JsonDict) -> list[str]:
    """Return every power entity linked to a board."""
    return [eid for row in board["rows"] for eid in row_power_entities(row)]


def row_power_entities(row: JsonDict) -> list[str]:
    """Return the power entities linked to the modules of a row (deduplicated)."""
    result: list[str] = []
    for module in row["modules"]:
        eid = module.get("power_entity_id")
        if eid and eid not in result:
            result.append(eid)
    return result


def find_device(model: JsonDict, device_id: str) -> JsonDict | None:
    """Return a network device by id."""
    devices: list[JsonDict] = model["network"]["devices"]
    return next((d for d in devices if d["id"] == device_id), None)
