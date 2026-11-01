"""Diagnostics: configuration and state, with every secret redacted."""

from __future__ import annotations

from typing import Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.core import HomeAssistant

from .const import CONF_URL, SECRET_KEYS
from .coordinator import HomeInfraMapConfigEntry

# Secrets + values that identify the house on the Internet.
TO_REDACT = {*SECRET_KEYS, CONF_URL, "public_ip", "mac", "hw_address", "hwaddr"}


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: HomeInfraMapConfigEntry
) -> dict[str, Any]:
    """Return redacted diagnostics."""
    runtime = entry.runtime_data
    model = runtime.store.model
    network = model["network"]
    return {
        "entry": {
            "data": async_redact_data(dict(entry.data), TO_REDACT),
            "options": async_redact_data(dict(entry.options), TO_REDACT),
        },
        "model": {
            "revision": runtime.store.revision,
            "boards": len(model["boards"]),
            "modules": sum(len(r["modules"]) for b in model["boards"] for r in b["rows"]),
            "vlans": len(network["vlans"]),
            "switches": async_redact_data(network["switches"], TO_REDACT),
            "devices": len(network["devices"]),
            "uplink": async_redact_data(network["uplink"], TO_REDACT),
        },
        "coordinators": {
            "ping": {
                "last_update_success": runtime.ping.last_update_success,
                "targets": len(runtime.ping.data or {}),
            },
            "opnsense": None
            if runtime.opnsense is None
            else {
                "last_update_success": runtime.opnsense.last_update_success,
                "firewall_analysis": runtime.opnsense.firewall_enabled,
                "counts": {
                    k: len(v) for k, v in (runtime.opnsense.data or {}).items() if isinstance(v, (list, dict))
                },
            },
            "snmp": {
                coord.source_id: {
                    "last_update_success": coord.last_update_success,
                    "sys_name": (coord.data or {}).get("sys_name"),
                    "ports": len((coord.data or {}).get("ports", {})),
                }
                for coord in runtime.snmp.values()
            },
        },
    }
