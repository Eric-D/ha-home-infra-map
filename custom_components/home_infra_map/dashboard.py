"""Example dashboard generated from the user's own model.

Produces a Lovelace view (sections layout) in YAML, to paste in a dashboard
in "raw configuration editor" mode. Nothing is written to the dashboards:
the user stays in control of their UI.
"""

from __future__ import annotations

from typing import Any

import yaml

from .const import CARD_TAG
from .models import JsonDict

_TITLES = {
    "fr": {
        "view": "Maison",
        "electricity": "Électricité",
        "network": "Réseau",
        "topology": "Topologie",
        "vlans": "VLAN",
        "switch": "Switch",
        "power": "Puissance par rangée",
        "latency": "Latence (24 h)",
        "blocks": "Blocages pare-feu (24 h)",
        "devices": "Équipements",
    },
    "en": {
        "view": "House",
        "electricity": "Electricity",
        "network": "Network",
        "topology": "Topology",
        "vlans": "VLANs",
        "switch": "Switch",
        "power": "Power per row",
        "latency": "Latency (24 h)",
        "blocks": "Firewall blocks (24 h)",
        "devices": "Devices",
    },
}


def _card(**config: Any) -> JsonDict:
    return {"type": f"custom:{CARD_TAG}", **config}


def _heading(text: str) -> JsonDict:
    return {"type": "heading", "heading": text}


def _ids(entities: dict[str, list[JsonDict]], owner: str, key: str) -> list[str]:
    return [e["entity_id"] for e in entities.get(owner, []) if e["key"] == key]


def generate_dashboard(
    model: JsonDict, entities: dict[str, list[JsonDict]], language: str = "fr"
) -> JsonDict:
    """Return a Lovelace view config built from the model and its entities."""
    t = _TITLES.get(language.split("-", maxsplit=1)[0], _TITLES["en"])
    sections: list[JsonDict] = []

    for board in model["boards"]:
        cards: list[JsonDict] = [
            _heading(f"{t['electricity']} · {board['name']}"),
            _card(view="electricity", board=board["id"], grid_options={"columns": "full"}),
        ]
        row_power = [e for row in board["rows"] for e in _ids(entities, row["id"], "row_power")]
        board_power = _ids(entities, board["id"], "board_power")
        if row_power or board_power:
            cards.append(
                {
                    "type": "history-graph",
                    "title": t["power"],
                    "hours_to_show": 24,
                    "entities": board_power + row_power,
                }
            )
        sections.append({"type": "grid", "cards": cards})

    network = model["network"]
    if network["devices"] or network["vlans"] or network["switches"]:
        net_cards: list[JsonDict] = [
            _heading(t["network"]),
            _card(view="network", network_view="topology", grid_options={"columns": "full"}),
        ]
        if network["vlans"]:
            net_cards.append(_card(view="network", network_view="vlan", grid_options={"columns": "full"}))
        if network["switches"]:
            net_cards.append(_card(view="network", network_view="switch", grid_options={"columns": "full"}))
        sections.append({"type": "grid", "cards": net_cards})

        vlan_names = {v["id"]: v["name"] for v in network["vlans"]}
        by_vlan: dict[str, list[str]] = {}
        latency: list[str] = []
        blocks: list[str] = []
        for device in network["devices"]:
            online = _ids(entities, device["id"], "online")
            if online:
                by_vlan.setdefault(vlan_names.get(device.get("vlan_id") or "", "—"), []).extend(online)
            latency += _ids(entities, device["id"], "latency")
            blocks += _ids(entities, device["id"], "blocks")
        dev_cards: list[JsonDict] = [_heading(t["devices"])]
        for vlan_name, ids in by_vlan.items():
            dev_cards.append(
                {
                    "type": "glance",
                    "title": vlan_name,
                    "show_state": False,
                    "columns": 4,
                    "entities": ids,
                }
            )
        if latency:
            dev_cards.append(
                {"type": "history-graph", "title": t["latency"], "hours_to_show": 24, "entities": latency}
            )
        if blocks:
            dev_cards.append(
                {
                    "type": "entities",
                    "title": t["blocks"],
                    "state_color": True,
                    "entities": blocks,
                }
            )
        if len(dev_cards) > 1:
            sections.append({"type": "grid", "cards": dev_cards})

    if not sections:
        sections.append({"type": "grid", "cards": [_card(view="electricity")]})
    return {
        "title": t["view"],
        "path": "home-infra-map",
        "icon": "mdi:home-lightning-bolt-outline",
        "type": "sections",
        "max_columns": 3,
        "sections": sections,
    }


def dashboard_yaml(view: JsonDict) -> str:
    """YAML of a view, ready to paste under `views:` of a dashboard."""
    header = (
        "# Example view generated by Home Infra Map.\n"
        "# Dashboard > ⋮ > Edit > ⋮ > Raw configuration editor, then paste under `views:`.\n"
    )
    body: str = yaml.safe_dump([view], allow_unicode=True, sort_keys=False, width=100)
    return header + body
