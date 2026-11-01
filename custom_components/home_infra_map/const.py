"""Constants for the Home Infra Map integration."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "home_infra_map"
NAME: Final = "Home Infra Map"

# Kept in sync by the release workflow (see tests/test_manifest.py).
VERSION: Final = "0.4.0"

CARD_TAG: Final = "home-infra-map-card"
CARD_FILENAME: Final = "home-infra-map-card.js"
CARD_URL: Final = f"/{DOMAIN}/{CARD_FILENAME}"
# Same exact URL for both injection mechanisms: an ES module is evaluated once
# per URL, so a double registration costs nothing.
CARD_RESOURCE_URL: Final = f"{CARD_URL}?v={VERSION}"

STORAGE_KEY: Final = DOMAIN
STORAGE_VERSION: Final = 1
STORAGE_MINOR_VERSION: Final = 2

PHOTO_DIR: Final = "home_infra_map/photos"  # relative to /config, NOT under www
PHOTO_URL: Final = f"/api/{DOMAIN}/photo"
PHOTO_MAX_BYTES: Final = 20 * 1024 * 1024
PHOTO_MAX_SIDE: Final = 2400

# Config entry data / options keys
CONF_HOUSE_NAME: Final = "house_name"
CONF_OPNSENSE: Final = "opnsense"
CONF_SNMP_SOURCES: Final = "snmp_sources"
CONF_URL: Final = "url"
CONF_API_KEY: Final = "api_key"
CONF_API_SECRET: Final = "api_secret"  # noqa: S105 - key name, not a secret
CONF_VERIFY_SSL: Final = "verify_ssl"
CONF_SNMP_VERSION: Final = "version"
CONF_COMMUNITY: Final = "community"
CONF_USERNAME: Final = "username"
CONF_AUTH_PROTOCOL: Final = "auth_protocol"
CONF_AUTH_KEY: Final = "auth_key"
CONF_PRIV_PROTOCOL: Final = "priv_protocol"
CONF_PRIV_KEY: Final = "priv_key"
CONF_HOST: Final = "host"
CONF_PORT: Final = "port"
CONF_PING_INTERVAL: Final = "ping_interval_s"
CONF_SNMP_INTERVAL: Final = "snmp_interval_s"
CONF_OPNSENSE_INTERVAL: Final = "opnsense_interval_s"
CONF_DEFAULT_VIEW: Final = "default_view"
CONF_FIREWALL_ANALYSIS: Final = "firewall_analysis"
CONF_IMPORT_FROM_OPNSENSE: Final = "import_from_opnsense"

DEFAULT_PING_INTERVAL: Final = 60
DEFAULT_SNMP_INTERVAL: Final = 300
DEFAULT_OPNSENSE_INTERVAL: Final = 300
PING_INTERVAL_RANGE: Final = (30, 600)
SNMP_INTERVAL_RANGE: Final = (60, 3600)
OPNSENSE_INTERVAL_RANGE: Final = (60, 3600)

VIEWS: Final = ("electricity", "network")
NETWORK_VIEWS: Final = ("topology", "vlan", "switch")

SNMP_VERSIONS: Final = ("v2c", "v3")
SNMP_AUTH_PROTOCOLS: Final = ("none", "md5", "sha", "sha224", "sha256", "sha384", "sha512")
SNMP_PRIV_PROTOCOLS: Final = ("none", "des", "3des", "aes", "aes192", "aes256")

# Secrets: never logged, never exposed in attributes, redacted in diagnostics.
SECRET_KEYS: Final = frozenset({CONF_API_KEY, CONF_API_SECRET, CONF_COMMUNITY, CONF_AUTH_KEY, CONF_PRIV_KEY})

EVENT_DEVICE_OFFLINE: Final = f"{DOMAIN}_device_offline"
EVENT_DEVICE_ONLINE: Final = f"{DOMAIN}_device_online"
SIGNAL_MODEL_UPDATED: Final = f"{DOMAIN}_model_updated"

FIREWALL_CACHE_SECONDS: Final = 300
UPLINK_MAC_THRESHOLD: Final = 8  # a port seeing more MACs than this is an uplink/AP

# Entity-id suffixes. HA builds entity ids from translated names in the
# *system* language; we pin them explicitly so the ids previewed in the card
# are exactly the ids created (see entity.py).
ENTITY_SUFFIXES: Final[dict[str, dict[str, str]]] = {
    "fr": {
        "online": "en_ligne",
        "latency": "latence",
        "tcp": "port",
        "switch_port": "port_switch",
        "blocks": "blocages",
        "power": "puissance",
        "alerts": "alertes",
        "port": "port",
    },
    "en": {
        "online": "online",
        "latency": "latency",
        "tcp": "port",
        "switch_port": "switch_port",
        "blocks": "blocks",
        "power": "power",
        "alerts": "alerts",
        "port": "port",
    },
}
