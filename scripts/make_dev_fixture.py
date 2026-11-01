"""Build frontend/dev/fixture.json: the payloads the card receives, computed by
the real backend functions from the anonymised example files.

Used by the card dev harness, the frontend tests and the README screenshots.
Run: python -I scripts/make_dev_fixture.py (from the repo root, in the venv).
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from types import SimpleNamespace

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from custom_components.home_infra_map import firewall as fw  # noqa: E402
from custom_components.home_infra_map.entity import entity_plan  # noqa: E402
from custom_components.home_infra_map.importer import parse_document  # noqa: E402
from custom_components.home_infra_map.nfc15100 import check_boards  # noqa: E402

FIX = ROOT / "tests" / "fixtures"
STAR = "192.168.30.40"  # reference device of the firewall tab (weather station)

# Circuits the owner identified, to show the "live" state of the mockup.
# Live power of a few circuits of the fictional demo board: ref -> (entity, watts)
CIRCUITS = {
    "T1-R1-1": ("sensor.eclairage_sejour_puissance", 42),
    "T1-R1-2": ("sensor.eclairage_chambres_puissance", 18),
    "T1-R1-3": ("sensor.eclairage_exterieur_puissance", 0),
    "T1-R1-4": ("sensor.prises_sejour_puissance", 96),
    "T1-R1-7": ("sensor.lave_linge_puissance", 1120),
    "T1-R2-1": ("sensor.plaque_cuisson_puissance", 0),
    "T1-R2-2": ("sensor.four_puissance", 0),
    "T1-R2-3": ("sensor.lave_vaisselle_puissance", 3),
    "T2-R1-2": ("sensor.borne_recharge_puissance", 3700),
}


def main() -> None:
    hass = SimpleNamespace(config=SimpleNamespace(language="fr"))
    boards = parse_document((FIX / "electricite.yaml").read_text())
    network = parse_document((FIX / "reseau.yaml").read_text()).network
    assert boards.boards is not None and network is not None
    states: dict[str, dict] = {}
    for board in boards.boards:
        board["photo_path"] = None
        for row in board["rows"]:
            for module in row["modules"]:
                if module["ref"] in CIRCUITS:
                    entity, watts = CIRCUITS[module["ref"]]
                    module["power_entity_id"] = entity
                    if module["ref"] == "T1-R1-7":
                        module["cable_mm2"] = 2.5
                    states[entity] = {
                        "state": str(watts),
                        "attributes": {
                            "unit_of_measurement": "W",
                            "device_class": "power",
                            "friendly_name": module["circuit_name"],
                        },
                    }
                if module["kind"] == "device" and (module.get("label") or "").startswith("Module de mesure"):
                    module["power_entity_id"] = "sensor.compteur_tableau_puissance"
                    states["sensor.compteur_tableau_puissance"] = {
                        "state": "1279",
                        "attributes": {"unit_of_measurement": "W", "device_class": "power"},
                    }
    for device in network["devices"]:
        if device["name"].startswith(
            ("Serveur domotique", "NAS", "Point d'accès", "Routeur", "Station météo")
        ):
            device["monitor"]["latency"] = True
        if device["name"].startswith("Imprimante"):
            device["monitor"]["offline_alert_minutes"] = 5
    model = {"house_name": "Maison", "boards": boards.boards, "network": network}
    sw = network["switches"][0]
    sw["snmp_source_id"] = "snmp1"
    plan = entity_plan(hass, "entry", model, snmp_switch_ids={sw["id"]}, has_snmp=True, has_firewall=True)  # type: ignore[arg-type]
    entities: dict[str, list] = {}
    for p in plan:
        entities.setdefault(p.extra.get("row_id") or p.owner_id, []).append(
            {"key": p.key, "entity_id": p.entity_id, **p.extra}
        )

    offline = {"Sonnette vidéo (hors ligne)", "Imprimante (Wi-Fi)"}
    ping = {}
    for i, d in enumerate(network["devices"]):
        alive = d["name"] not in offline
        ping[d["id"]] = {
            "alive": alive,
            "rtt_ms": round(1 + (i * 7 % 13) * 0.6, 1) if alive else None,
            "tcp": None,
        }
        for e in entities.get(d["id"], []):
            if e["key"] == "online":
                states[e["entity_id"]] = {
                    "state": "on" if alive else "off",
                    "attributes": {"device_class": "connectivity"},
                }
            if e["key"] == "latency":
                states[e["entity_id"]] = {
                    "state": str(ping[d["id"]]["rtt_ms"]) if alive else "unknown",
                    "attributes": {"unit_of_measurement": "ms"},
                }
            if e["key"] == "blocks":
                states[e["entity_id"]] = {
                    "state": "12" if d["host"] == STAR else "0",
                    "attributes": {},
                }
            if e["key"] == "switch_port":
                states[e["entity_id"]] = {
                    "state": str(d["port"]) if d["port"] else "unknown",
                    "attributes": {},
                }
    ports = {}
    for p in range(1, sw["ports_count"] + 1):
        devs = [d for d in network["devices"] if d.get("port") == p]
        up = bool(devs) or str(p) in sw["port_labels"]
        ports[str(p)] = {
            "port": p,
            "if_index": 1000000 + p,
            "name": f"GigabitEthernet 1/{p}" if p <= 24 else f"10GigabitEthernet 1/{p - 24}",
            "alias": sw["port_labels"].get(str(p), ""),
            "up": up,
            "speed_mbps": (10000 if p > 24 else 1000) if up else None,
            "pvid": 1,
            "tagged_vlans": [20, 30, 40] if p in (8, 9) else [],
            "untagged_vlans": [1],
            "lldp": {"sys_name": "AP-Etage", "port_id": "eth0"} if p == 9 else None,
            "poe": up and p <= 24 and p not in (17, 21, 23),
            "macs": [d["mac"] for d in devs if d.get("mac")],
        }
    live = {
        "ping": ping,
        "ping_available": True,
        "switches": {sw["id"]: {"available": True, "sys_name": "SW-DEMO-24P", "ports": ports}},
        "opnsense": {
            "configured": True,
            "available": True,
            "gateways": [
                {"name": "WAN_DHCP", "status": "Online", "delay": "9.8 ms", "loss": "0.0 %", "online": True},
                {
                    "name": "VPN_SORTANT",
                    "status": "Online",
                    "delay": "14.2 ms",
                    "loss": "0.0 %",
                    "online": True,
                },
            ],
        },
    }
    opn = json.loads((FIX / "opnsense.json").read_text())
    data = fw.FirewallData(
        rules=opn["filter_rules"]["rows"],
        aliases=fw.parse_aliases(opn["aliases"]["rows"], opn["alias_resolved"]),
        interfaces=fw.parse_interfaces(opn["interfaces_info"]["rows"]),
        nat_rules=opn["d_nat"]["rows"],
        host_names={d["host"]: d["name"] for d in network["devices"]},
    )
    star = next(d for d in network["devices"] if d["host"] == STAR)
    report = {"available": True, **fw.analyze(data, STAR)}
    report["blocks"] = fw.recent_blocks(
        opn["firewall_log"]["rows"], STAR, data.rules, opn["resolver_log"]["rows"]
    )
    report["blocks_24h"] = 12
    report["rule_hits"] = {"00000000-0000-4000-8000-000000001510": 12}
    report["fetched_at"] = "2026-11-01T13:45:00+00:00"
    payload = {
        "version": "0.1.0",
        "revision": 3,
        "section_revisions": {"boards": 1, "network": 1, "house_name": 0},
        "model": model,
        "settings": {
            "default_view": "electricity",
            "ping_interval_s": 60,
            "snmp_interval_s": 300,
            "opnsense_interval_s": 300,
            "firewall_analysis": True,
            "sources": {"opnsense": True, "snmp": [{"id": "snmp1", "host": sw["host"]}]},
        },
        "entities": entities,
        "live": live,
        "checks": check_boards(model["boards"]),
    }
    out = {"get": payload, "states": states, "firewall": {star["id"]: report}}
    text = json.dumps(out, ensure_ascii=False, indent=1) + "\n"
    # Stable ids (in order of appearance) so regenerating gives the same file.
    ids: dict[str, str] = {}
    text = re.sub(r"\b[0-9a-f]{32}\b", lambda m: ids.setdefault(m.group(0), f"demo{len(ids) + 1:028d}"), text)
    (ROOT / "frontend" / "dev" / "fixture.json").write_text(text)
    print("written", len(states), "states")


if __name__ == "__main__":
    main()
