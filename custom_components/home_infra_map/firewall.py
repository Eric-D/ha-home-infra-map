"""Per-device firewall analysis (read-only, no packet tester).

Pure module: input is the raw OPNsense data (rules, aliases, interfaces, NAT,
logs), output is JSON for the card. Nothing here talks to the network.

Semantics follow OPNsense/pf:
- floating rules first, then interface rules, by ascending `sequence`;
- with `quick`, the first matching rule wins (interface rules are quick);
- no match -> default deny.

When something cannot be decided safely (URL/GeoIP aliases, unresolved names,
`tagged`, policy routing, non-quick floating rules, missing sequence), the line
is kept and flagged `probable` with a reason instead of being silently wrong.
"""

from __future__ import annotations

import ipaddress
import re
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import Any, Final

from .models import JsonDict

type Net = ipaddress.IPv4Network | ipaddress.IPv6Network
type Addr = ipaddress.IPv4Address | ipaddress.IPv6Address

ANY_V4: Final = ipaddress.ip_network("0.0.0.0/0")
ANY_V6: Final = ipaddress.ip_network("::/0")
PRIVATE_V4: Final = [
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
]
UNRESOLVABLE_ALIAS_TYPES: Final = frozenset(
    {"url", "urltable", "urljson", "geoip", "dynipv6host", "mac", "asn", "authgroup", "internal"}
)
_TRUE = ("1", 1, True, "true", "yes")


def _subnet_of(inner: Net, outer: Net) -> bool:
    """Version-safe subnet_of."""
    if isinstance(inner, ipaddress.IPv4Network) and isinstance(outer, ipaddress.IPv4Network):
        return inner.subnet_of(outer)
    if isinstance(inner, ipaddress.IPv6Network) and isinstance(outer, ipaddress.IPv6Network):
        return inner.subnet_of(outer)
    return False


def _is_true(value: Any) -> bool:
    return value in _TRUE


@dataclass
class Resolved:
    """An address spec resolved to networks (None = unknown)."""

    nets: list[Net] | None
    kind: str  # any | router | network | alias | address | private | unknown
    label: str
    value: str
    reason: str | None = None

    def contains(self, ip: Addr) -> bool | None:
        if self.nets is None:
            return None
        return any(ip.version == n.version and ip in n for n in self.nets)

    def covers_net(self, net: Net) -> bool | None:
        """True if every address of `net` is in this spec."""
        if self.nets is None:
            return None
        return any(
            (
                isinstance(net, ipaddress.IPv4Network)
                and isinstance(n, ipaddress.IPv4Network)
                and net.subnet_of(n)
            )
            or (
                isinstance(net, ipaddress.IPv6Network)
                and isinstance(n, ipaddress.IPv6Network)
                and net.subnet_of(n)
            )
            for n in self.nets
        )

    def intersects_net(self, net: Net) -> bool | None:
        if self.nets is None:
            return None
        return any(net.version == n.version and net.overlaps(n) for n in self.nets)

    @property
    def is_any(self) -> bool:
        return self.kind == "any"


@dataclass
class Interface:
    """An OPNsense interface with its addresses."""

    identifier: str
    description: str
    addresses: list[Addr] = field(default_factory=list)
    subnets: list[Net] = field(default_factory=list)


@dataclass
class FirewallData:
    """Everything the engine needs."""

    rules: list[JsonDict]
    aliases: dict[str, JsonDict]  # name -> {type, content: [str], resolved: [str] | None, description}
    interfaces: dict[str, Interface]
    nat_rules: list[JsonDict] = field(default_factory=list)
    host_names: dict[str, str] = field(default_factory=dict)  # ip -> device name


def parse_interfaces(rows: list[JsonDict]) -> dict[str, Interface]:
    """Build interfaces from /api/interfaces/overview/interfaces_info rows."""
    result: dict[str, Interface] = {}
    for row in rows:
        ident = str(row.get("identifier") or "").strip()
        if not ident:
            continue
        iface = Interface(ident, str(row.get("description") or ident))
        entries = row.get("ipv4") or []
        if isinstance(entries, dict):
            entries = [entries]
        for entry in entries:
            text = entry.get("ipaddr") if isinstance(entry, dict) else entry
            if not text:
                continue
            try:
                ip_if = ipaddress.ip_interface(str(text))
            except ValueError:
                continue
            iface.addresses.append(ip_if.ip)
            iface.subnets.append(ip_if.network)
        result[ident] = iface
    return result


def parse_aliases(rows: list[JsonDict], resolved: dict[str, list[str]]) -> dict[str, JsonDict]:
    """Build the alias table from search_item rows + alias_util results."""
    result: dict[str, JsonDict] = {}
    for row in rows:
        name = str(row.get("name") or "").strip()
        if not name:
            continue
        content = row.get("content") or ""
        if isinstance(content, dict):  # some versions return a selectable map
            content = "\n".join(k for k, v in content.items() if isinstance(v, dict) and v.get("selected"))
        result[name] = {
            "type": str(row.get("type") or "").lower(),
            "content": [c.strip() for c in re.split(r"[\n,]", str(content)) if c.strip()],
            "resolved": resolved.get(name),
            "description": str(row.get("description") or ""),
        }
    return result


def _parse_net(text: str) -> Net | None:
    try:
        return ipaddress.ip_network(text.strip(), strict=False)
    except ValueError:
        return None


class Engine:
    """Evaluates rules for one device."""

    def __init__(self, data: FirewallData) -> None:
        """Index the data."""
        self.data = data
        self._cache: dict[str, Resolved] = {}

    # --- address resolution -------------------------------------------------

    def interface_of(self, ip: Addr) -> Interface | None:
        best: tuple[int, Interface] | None = None
        for iface in self.data.interfaces.values():
            for net in iface.subnets:
                if ip.version == net.version and ip in net and (best is None or net.prefixlen > best[0]):
                    best = (net.prefixlen, iface)
        return best[1] if best else None

    def _alias_nets(self, name: str, depth: int = 0) -> tuple[list[Net] | None, str | None]:
        alias = self.data.aliases[name]
        if alias["type"] in UNRESOLVABLE_ALIAS_TYPES:
            return None, f"alias_{alias['type']}"
        entries = alias["resolved"] if alias["resolved"] is not None else alias["content"]
        nets: list[Net] = []
        for entry in entries:
            net = _parse_net(entry)
            if net is not None:
                nets.append(net)
                continue
            if entry in self.data.aliases and depth < 5:
                sub, reason = self._alias_nets(entry, depth + 1)
                if sub is None:
                    return None, reason
                nets.extend(sub)
                continue
            if entry in self.data.interfaces:
                nets.extend(self.data.interfaces[entry].subnets)
                continue
            # FQDN not resolved by alias_util, or unknown token
            return None, "alias_unresolved"
        return nets, None

    def resolve(self, token: Any) -> Resolved:
        text = str(token or "").strip()
        if text in self._cache:
            return self._cache[text]
        res = self._resolve(text)
        self._cache[text] = res
        return res

    def _resolve(self, text: str) -> Resolved:
        if text in ("", "any", "*"):
            return Resolved([ANY_V4, ANY_V6], "any", "any", "any")
        if text == "(self)":
            addrs = [a for i in self.data.interfaces.values() for a in i.addresses]
            return Resolved([ipaddress.ip_network(a) for a in addrs], "router", "", "(self)")
        if text in self.data.interfaces:
            iface = self.data.interfaces[text]
            return Resolved(list(iface.subnets), "network", iface.description, text)
        if text.endswith("ip") and text[:-2] in self.data.interfaces:
            iface = self.data.interfaces[text[:-2]]
            router_nets: list[Net] = [ipaddress.ip_network(a) for a in iface.addresses]
            value = ", ".join(str(a) for a in iface.addresses)
            return Resolved(router_nets, "router", iface.description, value)
        net = _parse_net(text)
        if net is not None:
            name = self.data.host_names.get(str(net.network_address)) if net.num_addresses == 1 else None
            return Resolved(
                [net], "address", name or "", str(net) if net.num_addresses > 1 else str(net.network_address)
            )
        if text in self.data.aliases:
            nets, reason = self._alias_nets(text)
            kind = "alias"
            if (
                nets
                and all(any(_subnet_of(n, p) for p in PRIVATE_V4) for n in nets if n.version == 4)
                and ("private" in text.lower() or "rfc1918" in text.lower())
            ):
                kind = "private"
            return Resolved(nets, kind, self.data.aliases[text]["description"], text, reason)
        return Resolved(None, "unknown", text, text, "unknown_token")

    # --- rule helpers --------------------------------------------------------

    @staticmethod
    def is_floating(rule: JsonDict) -> bool:
        return _is_true(rule.get("floating")) or not str(rule.get("interface") or "").strip()

    @staticmethod
    def interfaces_of(rule: JsonDict) -> list[str]:
        return [i.strip() for i in str(rule.get("interface") or "").split(",") if i.strip()]

    def ordered_rules(self) -> list[tuple[JsonDict, list[str]]]:
        """Return enabled rules in evaluation order, with order-related reasons."""
        indexed = [(i, r) for i, r in enumerate(self.data.rules) if _is_true(r.get("enabled", "1"))]

        def seq(rule: JsonDict) -> int | None:
            try:
                return int(str(rule.get("sequence")).strip())
            except TypeError, ValueError:
                return None

        def key(item: tuple[int, JsonDict]) -> tuple[int, int, int, int]:
            idx, rule = item
            s = seq(rule)
            return (0 if self.is_floating(rule) else 1, 0 if s is not None else 1, s or 0, idx)

        result = []
        for _idx, rule in sorted(indexed, key=key):
            reasons = []
            if seq(rule) is None:
                reasons.append("no_sequence")
            if self.is_floating(rule) and not _is_true(rule.get("quick", "1")):
                reasons.append("not_quick")
            if str(rule.get("tagged") or "").strip() or str(rule.get("tag") or "").strip():
                reasons.append("tagged")
            gateway = str(rule.get("gateway") or "").strip()
            if gateway and gateway.lower() not in ("default", "none"):
                reasons.append("route_to")
            if _is_true(rule.get("interfacenot")):
                reasons.append("interface_not")
            result.append((rule, reasons))
        return result

    @staticmethod
    def _ipproto_ok(rule: JsonDict, ip: Addr) -> bool:
        proto = str(rule.get("ipprotocol") or "inet").lower()
        if proto in ("inet46", ""):
            return True
        return (proto == "inet") == (ip.version == 4)

    @staticmethod
    def _direction_ok(rule: JsonDict, wanted: str = "in") -> bool:
        direction = str(rule.get("direction") or "in").lower()
        return direction in (wanted, "any", "")

    def _match(self, token: Any, negate: bool, ip: Addr) -> tuple[bool | None, Resolved]:
        res = self.resolve(token)
        hit = res.contains(ip)
        if hit is None:
            return None, res
        return (not hit) if negate else hit, res

    # --- ports / protocols ---------------------------------------------------

    def ports(self, token: Any) -> tuple[list[tuple[int, int]] | None, str, bool]:
        """Return (ranges or None=any, label, known)."""
        text = str(token or "").strip()
        if text in ("", "any"):
            return None, "", True
        label = text
        entries = [text]
        if text in self.data.aliases:
            entries = self.data.aliases[text]["content"]
            label = text
        ranges: list[tuple[int, int]] = []
        for entry in entries:
            match = re.match(r"^(\d+)(?:[-:](\d+))?$", entry.strip())
            if not match:
                return None, label, False
            low = int(match.group(1))
            ranges.append((low, int(match.group(2) or low)))
        return ranges, label, True

    @staticmethod
    def protocols(rule: JsonDict) -> set[str] | None:
        text = str(rule.get("protocol") or "any").strip().lower()
        if text in ("any", ""):
            return None
        return set(text.split("/"))

    # --- outputs -------------------------------------------------------------

    def _dest_json(self, rule: JsonDict) -> JsonDict:
        res = self.resolve(rule.get("destination_net"))
        return {
            "kind": res.kind,
            "value": res.value,
            "label": res.label,
            "not": _is_true(rule.get("destination_not")),
        }

    def _line(self, rule: JsonDict, reasons: list[str], specific: bool) -> JsonDict:
        _ranges, port_label, known = self.ports(rule.get("destination_port"))
        if not known:
            reasons = [*reasons, "ports_unresolved"]
        dest = self.resolve(rule.get("destination_net"))
        if dest.reason:
            reasons = [*reasons, dest.reason]
        protos = self.protocols(rule)
        return {
            "uuid": rule.get("uuid"),
            "sequence": rule.get("sequence"),
            "action": str(rule.get("action") or "pass").lower(),
            "description": str(rule.get("description") or ""),
            "floating": self.is_floating(rule),
            "destination": self._dest_json(rule),
            "ports": port_label,
            "protocol": "/".join(sorted(p.upper() for p in protos)) if protos else "any",
            "specific": specific,
            "probable": bool(reasons),
            "reasons": reasons,
        }

    def outbound(self, ip: Addr) -> JsonDict:
        """What can the device do: applicable rules in evaluation order."""
        iface = self.interface_of(ip)
        lines: list[JsonDict] = []
        unreachable = 0
        stopped = False
        meta: list[tuple[JsonDict, Resolved]] = []
        for rule, reasons in self.ordered_rules():
            applies = self.is_floating(rule) or (
                iface is not None and iface.identifier in self.interfaces_of(rule)
            )
            if not applies or not self._ipproto_ok(rule, ip) or not self._direction_ok(rule):
                continue
            hit, src = self._match(rule.get("source_net"), _is_true(rule.get("source_not")), ip)
            if hit is False:
                continue
            if stopped:
                unreachable += 1
                continue
            line_reasons = list(reasons)
            if hit is None:
                line_reasons.append(src.reason or "source_unresolved")
            specific = self._is_specific(src, iface)
            lines.append(self._line(rule, line_reasons, specific))
            meta.append((rule, self.resolve(rule.get("destination_net"))))
            if (
                hit is True
                and _is_true(rule.get("quick", "1"))
                and not line_reasons
                and self.resolve(rule.get("destination_net")).is_any
                and not _is_true(rule.get("destination_not"))
                and self.protocols(rule) is None
                and self.ports(rule.get("destination_port"))[0] is None
            ):
                stopped = True
        visible, redundant = self._drop_redundant(lines, meta)
        return {
            "interface": iface.identifier if iface else None,
            "interface_label": iface.description if iface else None,
            "rules": visible,
            "redundant": redundant,
            "unreachable_count": unreachable,
            "default_deny": not stopped,
        }

    def _is_specific(self, src: Resolved, iface: Interface | None) -> bool:
        """True when the source targets this device rather than its whole network."""
        if src.kind in ("any", "network", "private") or src.nets is None:
            return False
        if iface is None:
            return True
        return not any(src.covers_net(net) for net in iface.subnets)

    def _drop_redundant(
        self, lines: list[JsonDict], meta: list[tuple[JsonDict, Resolved]]
    ) -> tuple[list[JsonDict], list[JsonDict]]:
        """Hide a pass rule fully covered by a later pass rule.

        Only pass rules are folded, and only when no block/reject rule in
        between may intersect: removing them would not change behaviour.
        Typical case: a multi-interface "anyone -> Home Assistant TCP" rule
        followed by the VLAN's own "-> Home Assistant, all ports".
        """
        hidden: set[int] = set()
        for i, line in enumerate(lines):
            if line["action"] != "pass" or line["probable"] or line["specific"] or line["destination"]["not"]:
                continue
            rule_i, dest_i = meta[i]
            if dest_i.nets is None:
                continue
            ports_i = self.ports(rule_i.get("destination_port"))[0]
            protos_i = self.protocols(rule_i)
            for j in range(i + 1, len(lines)):
                other = lines[j]
                rule_j, dest_j = meta[j]
                if other["action"] != "pass":
                    if dest_j.nets is None or any(dest_j.intersects_net(n) is not False for n in dest_i.nets):
                        break
                    continue
                if other["probable"] or other["destination"]["not"] or dest_j.nets is None:
                    continue
                ports_j = self.ports(rule_j.get("destination_port"))[0]
                protos_j = self.protocols(rule_j)
                if (
                    all(dest_j.covers_net(n) for n in dest_i.nets)
                    and (protos_j is None or (protos_i is not None and protos_i <= protos_j))
                    and (
                        ports_j is None
                        or (
                            ports_i is not None
                            and all(any(a >= c and b <= d for c, d in ports_j) for a, b in ports_i)
                        )
                    )
                ):
                    hidden.add(i)
                    break
        visible = [line for i, line in enumerate(lines) if i not in hidden]
        redundant = [
            {"uuid": lines[i]["uuid"], "description": lines[i]["description"], "covered": True}
            for i in sorted(hidden)
        ]
        return visible, redundant

    def _source_coverage(self, rule: JsonDict, iface: Interface) -> tuple[str, Resolved]:
        """How much of an interface's network a rule source covers.

        Returns "full", "partial", "none" or "unknown".
        """
        src = self.resolve(rule.get("source_net"))
        negate = _is_true(rule.get("source_not"))
        if src.value == iface.identifier or src.kind == "any":
            return ("none" if negate else "full"), src
        if src.nets is None or not iface.subnets:
            return "unknown", src
        covers = any(src.covers_net(n) for n in iface.subnets)
        inter = any(src.intersects_net(n) for n in iface.subnets)
        if negate:
            covers, inter = (not inter), (not covers)
        if covers:
            return "full", src
        return ("partial" if inter else "none"), src

    def inbound(self, ip: Addr) -> list[JsonDict]:
        """Who can reach the device: verdict per source interface.

        verdict: allowed | blocked | partial (some hosts/ports only) |
        same_network (traffic stays on the switch, not filtered by the router).
        """
        own = self.interface_of(ip)
        ordered = self.ordered_rules()
        result: list[JsonDict] = []
        for iface in self.data.interfaces.values():
            entry: JsonDict = {
                "interface": iface.identifier,
                "label": iface.description,
                "verdict": "blocked",
                "rule": None,
                "ports": "",
                "probable": False,
                "reasons": [],
                "default": True,
            }
            if own is not None and iface.identifier == own.identifier:
                entry.update(verdict="same_network", default=False)
                result.append(entry)
                continue
            partial_pass: JsonDict | None = None
            partial_block = False
            reasons_acc: list[str] = []
            for rule, reasons in ordered:
                applies = self.is_floating(rule) or iface.identifier in self.interfaces_of(rule)
                if not applies or not self._ipproto_ok(rule, ip) or not self._direction_ok(rule):
                    continue
                coverage, src = self._source_coverage(rule, iface)
                if coverage == "none":
                    continue
                hit, dst = self._match(rule.get("destination_net"), _is_true(rule.get("destination_not")), ip)
                if hit is False:
                    continue
                rule_reasons = list(reasons)
                if hit is None:
                    rule_reasons.append(dst.reason or "destination_unresolved")
                if coverage == "unknown":
                    rule_reasons.append(src.reason or "source_unresolved")
                action = str(rule.get("action") or "pass").lower()
                _ranges, port_label, _known = self.ports(rule.get("destination_port"))
                narrow = coverage == "partial" or bool(port_label) or self.protocols(rule) is not None
                ref = {"uuid": rule.get("uuid"), "description": str(rule.get("description") or "")}
                reasons_acc.extend(r for r in rule_reasons if r not in reasons_acc)
                if narrow:
                    if action == "pass" and partial_pass is None:
                        partial_pass = {"rule": ref, "ports": port_label}
                    elif action != "pass":
                        partial_block = True
                    continue
                if action == "pass":
                    verdict = "partial" if partial_block else "allowed"
                else:
                    verdict = "partial" if partial_pass else "blocked"
                entry.update(verdict=verdict, rule=ref, ports=port_label, default=False)
                if partial_pass and verdict == "partial" and action != "pass":
                    entry.update(rule=partial_pass["rule"], ports=partial_pass["ports"])
                break
            else:
                if partial_pass:
                    entry.update(
                        verdict="partial",
                        rule=partial_pass["rule"],
                        ports=partial_pass["ports"],
                        default=False,
                    )
            entry["reasons"] = reasons_acc
            entry["probable"] = bool(reasons_acc)
            if iface.identifier.startswith("wan") or iface.description.lower().startswith("wan"):
                forwards = self.nat_to(ip)
                if forwards:
                    entry["nat"] = forwards
                    if entry["verdict"] == "blocked":
                        entry.update(verdict="partial", default=False)
            result.append(entry)
        return result

    def nat_to(self, ip: Addr) -> list[JsonDict]:
        """Port forwards whose target is the device."""
        result = []
        for rule in self.data.nat_rules:
            if not _is_true(rule.get("enabled", "1")) or _is_true(rule.get("disabled")):
                continue
            target = str(rule.get("target") or rule.get("redirect_targetip") or "").strip()
            res = self.resolve(target)
            if res.contains(ip):
                result.append(
                    {
                        "uuid": rule.get("uuid"),
                        "description": str(rule.get("description") or rule.get("descr") or ""),
                        "interface": str(rule.get("interface") or ""),
                        "protocol": str(rule.get("protocol") or ""),
                        "external_port": str(rule.get("destination_port") or rule.get("dstbeginport") or ""),
                        "target_port": str(rule.get("local_port") or rule.get("local-port") or ""),
                    }
                )
        return result


def _parse_ts(value: Any) -> datetime | None:
    if not value:
        return None
    try:
        ts = datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except ValueError:
        return None
    return ts


_RESOLVER_RE = re.compile(r"(\d{1,3}(?:\.\d{1,3}){3})\s+([A-Za-z0-9._-]+?)\.?\s+(?:A|AAAA|HTTPS|CNAME)\s+IN")


def recent_blocks(
    log_rows: list[JsonDict],
    ip: str,
    rules: list[JsonDict],
    resolver_rows: list[JsonDict] | None = None,
    limit: int = 20,
) -> list[JsonDict]:
    """Last firewall blocks from `ip`, with the DNS name queried just before."""
    by_uuid = {str(r.get("uuid")): str(r.get("description") or "") for r in rules}
    queries: list[tuple[datetime, str]] = []
    for row in resolver_rows or []:
        match = _RESOLVER_RE.search(str(row.get("line") or row.get("message") or ""))
        ts = _parse_ts(row.get("timestamp") or row.get("__timestamp__"))
        if match and ts and match.group(1) == ip:
            queries.append((ts, match.group(2)))
    queries.sort()
    result: list[JsonDict] = []
    for row in log_rows:
        if str(row.get("action") or "").lower() not in ("block", "reject"):
            continue
        if str(row.get("src") or "") != ip:
            continue
        ts = _parse_ts(row.get("__timestamp__") or row.get("timestamp"))
        name = None
        if ts is not None:
            before = [q for q in queries if timedelta(0) <= ts - q[0] <= timedelta(seconds=120)]
            if before:
                name = before[-1][1]
        label = str(row.get("label") or row.get("rid") or "")
        result.append(
            {
                "time": ts.isoformat() if ts else None,
                "destination": str(row.get("dst") or ""),
                "port": str(row.get("dstport") or ""),
                "protocol": str(row.get("protoname") or row.get("proto") or ""),
                "interface": str(row.get("interface") or ""),
                "rule_uuid": label or None,
                "rule": by_uuid.get(label),
                "dns_name": name,
            }
        )
    result.sort(key=lambda r: r["time"] or "", reverse=True)
    return result[:limit]


def count_blocks(log_rows: list[JsonDict], since: datetime) -> dict[str, int]:
    """Count blocked packets per source IP since a moment."""
    counts: dict[str, int] = {}
    for row in log_rows:
        if str(row.get("action") or "").lower() not in ("block", "reject"):
            continue
        ts = _parse_ts(row.get("__timestamp__") or row.get("timestamp"))
        if (
            ts is None
            or (ts.tzinfo is not None and ts < since)
            or (ts.tzinfo is None and ts < since.replace(tzinfo=None))
        ):
            continue
        src = str(row.get("src") or "")
        if src:
            counts[src] = counts.get(src, 0) + 1
    return counts


def analyze(data: FirewallData, ip_text: str) -> JsonDict:
    """Full analysis of one device."""
    try:
        ip = ipaddress.ip_address(ip_text)
    except ValueError:
        return {"error": "not_an_ip"}
    engine = Engine(data)
    out = engine.outbound(ip)
    return {
        "ip": str(ip),
        "outbound": out,
        "inbound": engine.inbound(ip),
        "nat": engine.nat_to(ip),
    }
