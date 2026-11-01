"""Build tests/fixtures/opnsense.json: OPNsense API answers for the fictional
demo house of tests/fixtures/reseau.yaml (no real network data anywhere).

Reference firewall case: the weather station 192.168.30.40 in the "Objets"
VLAN, with a rule of its own (alias Objets_Meteo -> Meteo_Cloud).
Run: python -I scripts/make_test_fixtures.py
"""

from __future__ import annotations

import json
from pathlib import Path

import yaml

FIX = Path(__file__).resolve().parent.parent / "tests" / "fixtures"
HA = "192.168.50.10"
STAR = "192.168.30.40"


def iface(ident: str, descr: str, ip: str) -> dict:
    return {"identifier": ident, "description": descr, "ipv4": [{"ipaddr": ip}]}


def rule(  # noqa: PLR0917 - mirrors the columns of the OPNsense rule table
    seq: int,
    action: str,
    ifc: str,
    src: str,
    dst: str,
    port: str = "",
    proto: str = "any",
    desc: str = "",
    **kw: str,
) -> dict:
    data = {
        "uuid": f"00000000-0000-4000-8000-{seq:012d}",
        "enabled": "1",
        "sequence": str(seq),
        "action": action,
        "quick": "1",
        "interface": ifc,
        "direction": "in",
        "ipprotocol": "inet",
        "protocol": proto,
        "source_net": src,
        "source_not": "0",
        "source_port": "",
        "destination_net": dst,
        "destination_not": "0",
        "destination_port": port,
        "description": desc,
        "log": "0" if action == "pass" else "1",
    }
    data.update(kw)
    return data


def main() -> None:
    net = yaml.safe_load((FIX / "reseau.yaml").read_text())
    devices = net["equipements"]
    interfaces = [
        iface("lan", "Admin", "192.168.10.1/24"),
        iface("opt1", "Serveurs", "192.168.50.1/24"),
        iface("opt2", "Famille", "192.168.20.1/24"),
        iface("opt3", "Objets", "192.168.30.1/24"),
        iface("opt4", "Invités", "192.168.40.1/24"),
        iface("wireguard", "VPN", "10.8.0.1/24"),
        iface("wan", "WAN", "192.168.1.2/24"),
    ]
    rules = [
        rule(100, "pass", "lan", "lan", "any", desc="Admin : accès total"),
        rule(200, "pass", "wireguard", "wireguard", "any", desc="VPN : accès total"),
        rule(300, "pass", "opt1", "opt1", "any", desc="Serveurs : accès total"),
        rule(400, "block", "opt2", "opt2", "lan", desc="Famille : pas d'accès au réseau Admin"),
        rule(401, "pass", "opt2", "opt2", "any", desc="Famille : accès total"),
        rule(
            600,
            "block",
            "opt4",
            "opt4",
            "PrivateNetworks",
            desc="Invités : interdit vers les réseaux internes",
        ),
        rule(601, "pass", "opt4", "opt4", "any", desc="Invités : Internet"),
        rule(
            1331,
            "pass",
            "lan,opt1,opt2,opt3,wireguard",
            "any",
            HA,
            proto="TCP",
            desc="Accès à la domotique depuis les réseaux internes",
        ),
        rule(1500, "pass", "opt3", "opt3", "opt3ip", "53", proto="TCP/UDP", desc="Objets → routeur : DNS"),
        rule(1501, "pass", "opt3", "opt3", "opt3ip", "123", proto="UDP", desc="Objets → routeur : NTP"),
        rule(1502, "pass", "opt3", "opt3", HA, desc=f"Objets → domotique ({HA}), tous ports"),
        rule(
            1503,
            "block",
            "opt3",
            "opt3",
            "PrivateNetworks",
            desc="Objets : INTERDIT vers les réseaux internes",
        ),
        rule(
            1504,
            "pass",
            "opt3",
            "Objets_Cameras",
            "Cameras_Cloud",
            "Web_Ports",
            proto="TCP",
            desc="Caméras → mises à jour du fabricant uniquement",
        ),
        rule(
            1509,
            "pass",
            "opt3",
            "Objets_Meteo",
            "Meteo_Cloud",
            proto="TCP",
            desc="Station météo → service météo uniquement",
        ),
        rule(1510, "block", "opt3", "opt3", "any", desc="Objets : tout le reste d'Internet est BLOQUÉ"),
    ]
    aliases = [
        {
            "name": "PrivateNetworks",
            "type": "network",
            "content": "10.0.0.0/8\n172.16.0.0/12\n192.168.0.0/16",
            "description": "Réseaux internes (RFC 1918)",
        },
        {
            "name": "Objets_Cameras",
            "type": "host",
            "content": "192.168.30.10\n192.168.30.11\n192.168.30.12",
            "description": "Caméras",
        },
        {
            "name": "Cameras_Cloud",
            "type": "host",
            "content": "updates.cameras.example.com",
            "description": "Mises à jour caméras",
        },
        {"name": "Web_Ports", "type": "port", "content": "80\n443", "description": "HTTP/HTTPS"},
        {"name": "Objets_Meteo", "type": "host", "content": STAR, "description": "Station météo"},
        {
            "name": "Meteo_Cloud",
            "type": "host",
            "content": "api.weather.example.com\nmqtt.weather.example.com",
            "description": "Service météo",
        },
    ]
    resolved = {
        "PrivateNetworks": ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"],
        "Objets_Cameras": ["192.168.30.10", "192.168.30.11", "192.168.30.12"],
        "Cameras_Cloud": ["198.51.100.40"],
        "Web_Ports": ["80", "443"],
        "Objets_Meteo": [STAR],
        "Meteo_Cloud": ["198.51.100.60", "198.51.100.61"],
    }
    nat = [
        {
            "uuid": "nat-0001",
            "enabled": "1",
            "interface": "wan",
            "protocol": "tcp",
            "destination_port": "443",
            "target": HA,
            "local_port": "443",
            "description": "HTTPS → proxy de la domotique",
        }
    ]
    arp = [
        {
            "ip": d["ip"],
            "mac": d["mac"],
            "intf": "",
            "intf_description": d.get("vlan", ""),
            "manufacturer": "",
            "hostname": "",
            "expired": False,
            "expires": 1200,
        }
        for d in devices
    ]
    reservations = [
        {
            "uuid": f"res-{i:03d}",
            "ip_address": d["ip"],
            "hw_address": d["mac"],
            "hostname": "",
            "description": d["nom"],
            "subnet": "",
        }
        for i, d in enumerate(devices)
        if not d["ip"].startswith("192.168.10.")
    ]
    leases = [{"address": d["ip"], "hwaddr": d["mac"], "hostname": ""} for d in devices]
    vlans = [
        {"vlanif": f"vlan0{t}", "if": "ix0", "tag": str(t), "descr": n}
        for t, n in [(50, "Serveurs"), (20, "Famille"), (30, "Objets"), (40, "Invités")]
    ]
    block = "00000000-0000-4000-8000-000000001510"
    log = [
        {
            "__timestamp__": "2026-11-01T13:42:12+01:00",
            "action": "block",
            "interface": "vlan030",
            "src": STAR,
            "dst": "203.0.113.80",
            "dstport": "443",
            "protoname": "tcp",
            "label": block,
        },
        {
            "__timestamp__": "2026-11-01T13:12:03+01:00",
            "action": "block",
            "interface": "vlan030",
            "src": STAR,
            "dst": "203.0.113.80",
            "dstport": "443",
            "protoname": "tcp",
            "label": block,
        },
        {
            "__timestamp__": "2026-11-01T09:05:44+01:00",
            "action": "block",
            "interface": "vlan030",
            "src": STAR,
            "dst": "8.8.8.8",
            "dstport": "53",
            "protoname": "udp",
            "label": block,
        },
        {
            "__timestamp__": "2026-11-01T12:00:00+01:00",
            "action": "block",
            "interface": "vlan030",
            "src": "192.168.30.10",
            "dst": "203.0.113.9",
            "dstport": "80",
            "protoname": "tcp",
            "label": block,
        },
        {
            "__timestamp__": "2026-11-01T12:00:01+01:00",
            "action": "pass",
            "interface": "vlan030",
            "src": STAR,
            "dst": "192.168.30.1",
            "dstport": "53",
            "protoname": "udp",
            "label": "00000000-0000-4000-8000-000000001500",
        },
    ]
    resolver = [
        {"timestamp": "2026-11-01T13:42:11+01:00", "line": f"info: {STAR} firmware.example.net. A IN"},
        {"timestamp": "2026-11-01T13:12:02+01:00", "line": f"info: {STAR} firmware.example.net. A IN"},
    ]
    gateways = {
        "items": [
            {
                "name": "WAN_DHCP",
                "status_translated": "Online",
                "delay": "9.8 ms",
                "loss": "0.0 %",
                "address": "192.168.1.254",
            },
            {
                "name": "VPN_SORTANT",
                "status_translated": "Online",
                "delay": "14.2 ms",
                "loss": "0.0 %",
                "address": "10.9.0.1",
            },
        ]
    }
    data = {
        "interfaces_info": {"rows": interfaces, "total": len(interfaces)},
        "filter_rules": {"rows": rules, "total": len(rules)},
        "aliases": {"rows": aliases},
        "alias_resolved": resolved,
        "d_nat": {"rows": nat},
        "arp": arp,
        "reservations": {"rows": reservations},
        "leases": {"rows": leases},
        "vlans": {"rows": vlans},
        "firewall_log": {"rows": log},
        "resolver_log": {"rows": resolver},
        "gateways": gateways,
        "kea_subnets": {"rows": []},
    }
    (FIX / "opnsense.json").write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n")
    print(len(devices), "devices,", len(reservations), "reservations")


if __name__ == "__main__":
    main()
