"""Firewall engine: the 3D printer case of the mockup and edge cases."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

import pytest

from custom_components.home_infra_map import firewall as fw

from .conftest import load_json


def _data(rules: list[dict[str, Any]] | None = None, **overrides: Any) -> fw.FirewallData:
    opn = load_json("opnsense.json")
    return fw.FirewallData(
        rules=rules if rules is not None else opn["filter_rules"]["rows"],
        aliases=overrides.get("aliases") or fw.parse_aliases(opn["aliases"]["rows"], opn["alias_resolved"]),
        interfaces=fw.parse_interfaces(opn["interfaces_info"]["rows"]),
        nat_rules=opn["d_nat"]["rows"],
        host_names={"192.168.50.10": "Serveur domotique"},
    )


def _rule(seq: int | None, action: str, iface: str, src: str, dst: str, **kw: Any) -> dict[str, Any]:
    rule = {
        "uuid": f"r{seq}",
        "enabled": "1",
        "action": action,
        "quick": "1",
        "interface": iface,
        "direction": "in",
        "ipprotocol": "inet",
        "protocol": "any",
        "source_net": src,
        "source_not": "0",
        "destination_net": dst,
        "destination_not": "0",
        "destination_port": "",
        "description": f"rule {seq}",
    }
    if seq is not None:
        rule["sequence"] = str(seq)
    rule.update(kw)
    return rule


def test_weather_station_outbound_matches_mockup() -> None:
    report = fw.analyze(_data(), "192.168.30.40")
    out = report["outbound"]
    assert out["interface"] == "opt3" and out["interface_label"] == "Objets"
    lines = [(r["action"], r["description"]) for r in out["rules"]]
    assert lines == [
        ("pass", "Objets → routeur : DNS"),
        ("pass", "Objets → routeur : NTP"),
        ("pass", "Objets → domotique (192.168.50.10), tous ports"),
        ("block", "Objets : INTERDIT vers les réseaux internes"),
        ("pass", "Station météo → service météo uniquement"),
        ("block", "Objets : tout le reste d'Internet est BLOQUÉ"),
    ]
    specific = [r["description"] for r in out["rules"] if r["specific"]]
    assert specific == ["Station météo → service météo uniquement"]
    dns = out["rules"][0]
    assert dns["destination"] == {"kind": "router", "value": "192.168.30.1", "label": "Objets", "not": False}
    assert (dns["ports"], dns["protocol"]) == ("53", "TCP/UDP")
    assert out["rules"][2]["destination"]["label"] == "Serveur domotique"
    assert out["rules"][3]["destination"]["kind"] == "private"
    assert out["rules"][4]["destination"]["kind"] == "alias"
    assert out["rules"][5]["destination"]["kind"] == "any"
    assert not any(r["probable"] for r in out["rules"])
    # the shared "anyone -> home server (TCP)" rule is covered by the Objets one
    assert [r["uuid"] for r in out["redundant"]] == ["00000000-0000-4000-8000-000000001331"]
    assert out["default_deny"] is False


def test_weather_station_inbound() -> None:
    inbound = {e["label"]: e["verdict"] for e in fw.analyze(_data(), "192.168.30.40")["inbound"]}
    assert inbound == {
        "Admin": "allowed",
        "Serveurs": "allowed",
        "Famille": "allowed",
        "Objets": "same_network",
        "Invités": "blocked",
        "VPN": "allowed",
        "WAN": "blocked",
    }


def test_home_server_inbound_with_nat_and_partial() -> None:
    report = fw.analyze(_data(), "192.168.50.10")
    by = {e["label"]: e for e in report["inbound"]}
    assert by["Objets"]["verdict"] == "allowed"
    assert by["Invités"]["verdict"] == "blocked"
    assert by["WAN"]["verdict"] == "partial"
    assert by["WAN"]["nat"][0]["external_port"] == "443"
    assert report["nat"][0]["description"] == "HTTPS → proxy de la domotique"


def test_unresolved_alias_is_probable() -> None:
    opn = load_json("opnsense.json")
    aliases = fw.parse_aliases(opn["aliases"]["rows"], {})  # FQDN aliases not resolved
    report = fw.analyze(_data(aliases=aliases), "192.168.30.40")
    cloud = next(r for r in report["outbound"]["rules"] if "météo" in r["description"])
    assert cloud["probable"] and "alias_unresolved" in cloud["reasons"]


def test_url_alias_source_is_probable_and_listed() -> None:
    aliases = {"Blocklist": {"type": "urltable", "content": [], "resolved": None, "description": ""}}
    rules = [_rule(1, "block", "opt3", "Blocklist", "any"), _rule(2, "pass", "opt3", "opt3", "any")]
    out = fw.analyze(_data(rules, aliases=aliases), "192.168.30.40")["outbound"]
    assert out["rules"][0]["probable"] and "alias_urltable" in out["rules"][0]["reasons"]
    assert out["default_deny"] is False


def test_ordering_floating_missing_sequence_and_flags() -> None:
    rules = [
        _rule(None, "pass", "opt3", "opt3", "1.1.1.1"),
        _rule(5, "block", "opt3", "opt3", "8.8.8.8", tagged="x"),
        _rule(9, "pass", "", "any", "9.9.9.9", quick="0"),
        _rule(3, "pass", "opt3", "opt3", "203.0.113.0/24", gateway="VPN_SORTANT"),
        _rule(4, "pass", "opt3", "opt3", "any", enabled="0"),
        _rule(6, "pass", "opt3", "opt3", "any", source_not="1"),
        _rule(7, "pass", "opt3", "any", "any", ipprotocol="inet6"),
        _rule(8, "pass", "opt3", "opt3", "any", direction="out"),
    ]
    out = fw.analyze(_data(rules), "192.168.30.40")["outbound"]
    order = [r["uuid"] for r in out["rules"]]
    assert order == ["r9", "r3", "r5", "rNone"]
    reasons = {r["uuid"]: r["reasons"] for r in out["rules"]}
    assert reasons == {"r9": ["not_quick"], "r3": ["route_to"], "r5": ["tagged"], "rNone": ["no_sequence"]}
    assert out["default_deny"] is True


def test_stop_after_quick_any_any() -> None:
    rules = [_rule(1, "pass", "opt3", "opt3", "any"), _rule(2, "block", "opt3", "opt3", "any")]
    out = fw.analyze(_data(rules), "192.168.30.40")["outbound"]
    assert len(out["rules"]) == 1 and out["unreachable_count"] == 1


def test_inbound_ports_partial_block_and_negation() -> None:
    rules = [
        _rule(1, "pass", "lan", "lan", "192.168.30.40", destination_port="80", protocol="TCP"),
        _rule(2, "block", "opt2", "opt2", "192.168.30.40", destination_port="22"),
        _rule(3, "pass", "opt2", "opt2", "any"),
        _rule(4, "pass", "opt1", "192.168.50.10", "192.168.30.40"),
        _rule(5, "block", "wireguard", "wireguard", "192.168.30.40", destination_not="1"),
        _rule(6, "pass", "wireguard", "lan", "192.168.30.40", source_not="1"),
        _rule(7, "pass", "opt4", "UnknownThing", "192.168.30.40"),
    ]
    by = {e["label"]: e for e in fw.analyze(_data(rules), "192.168.30.40")["inbound"]}
    assert by["Admin"]["verdict"] == "partial" and by["Admin"]["ports"] == "80"
    assert by["Famille"]["verdict"] == "partial"
    assert by["Serveurs"]["verdict"] == "partial"
    assert by["VPN"]["verdict"] == "allowed"
    assert by["Invités"]["probable"]
    assert by["WAN"]["default"] is True


def test_port_alias_and_ranges() -> None:
    engine = fw.Engine(_data())
    assert engine.ports("Web_Ports")[:2] == ([(80, 80), (443, 443)], "Web_Ports")
    assert engine.ports("1000-2000")[0] == [(1000, 2000)]
    assert engine.ports("weird")[2] is False
    assert engine.resolve("(self)").kind == "router"
    assert engine.resolve("nonsense").nets is None
    assert fw.analyze(_data(), "not-an-ip") == {"error": "not_an_ip"}


def test_recent_blocks_and_counts() -> None:
    opn = load_json("opnsense.json")
    rules = opn["filter_rules"]["rows"]
    blocks = fw.recent_blocks(
        opn["firewall_log"]["rows"], "192.168.30.40", rules, opn["resolver_log"]["rows"]
    )
    assert [b["time"][11:16] for b in blocks] == ["13:42", "13:12", "09:05"]
    assert blocks[0]["destination"] == "203.0.113.80" and blocks[0]["port"] == "443"
    assert blocks[0]["dns_name"] == "firmware.example.net"
    assert blocks[0]["rule"] == "Objets : tout le reste d'Internet est BLOQUÉ"
    assert blocks[2]["dns_name"] is None
    since = datetime(2026, 11, 1, 0, 0, tzinfo=timezone(timedelta(hours=1)))
    counts = fw.count_blocks(opn["firewall_log"]["rows"], since)
    assert counts == {"192.168.30.40": 3, "192.168.30.10": 1}
    assert fw.count_blocks([{"action": "block", "src": "x", "__timestamp__": "bad"}], since) == {}
    naive = [{"action": "block", "src": "1.2.3.4", "__timestamp__": "2026-11-01T12:00:00"}]
    assert fw.count_blocks(naive, since) == {"1.2.3.4": 1}


@pytest.mark.parametrize("content", ["10.0.0.0/8\n", {"10.0.0.0/8": {"selected": 1}}])
def test_parse_aliases_variants(content: Any) -> None:
    aliases = fw.parse_aliases([{"name": "N", "type": "network", "content": content}, {"name": ""}], {})
    assert aliases["N"]["content"] == ["10.0.0.0/8"]


def test_parse_interfaces_variants() -> None:
    ifaces = fw.parse_interfaces(
        [
            {"identifier": "lan", "ipv4": {"ipaddr": "10.0.0.1/24"}},
            {"identifier": "x", "ipv4": [{"ipaddr": "bad"}, {}]},
            {},
        ]
    )
    assert str(ifaces["lan"].subnets[0]) == "10.0.0.0/24" and ifaces["x"].subnets == []


def test_nested_alias_and_interface_member() -> None:
    aliases = fw.parse_aliases(
        [
            {"name": "Inner", "type": "host", "content": "192.168.30.40"},
            {"name": "Outer", "type": "host", "content": "Inner\nopt1"},
        ],
        {},
    )
    engine = fw.Engine(_data(aliases=aliases))
    res = engine.resolve("Outer")
    assert res.nets is not None and len(res.nets) == 2
