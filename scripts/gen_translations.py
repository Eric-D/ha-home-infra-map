"""Generate strings.json and translations/{en,fr}.json from one source.

strings.json is never read at runtime for a custom integration: Home
Assistant only loads translations/<lang>.json, with `en` as the fallback.
Run: python scripts/gen_translations.py
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "custom_components" / "home_infra_map"

SNMP_FIELDS = {
    "en": {
        "host": "Switch host (empty = skip)",
        "port": "SNMP port",
        "version": "SNMP version",
        "community": "Community (v2c)",
        "username": "User (v3)",
        "auth_protocol": "Authentication protocol (v3)",
        "auth_key": "Authentication password (v3)",
        "priv_protocol": "Privacy protocol (v3)",
        "priv_key": "Privacy password (v3)",
    },
    "fr": {
        "host": "Hôte du switch (vide = ignorer)",
        "port": "Port SNMP",
        "version": "Version SNMP",
        "community": "Communauté (v2c)",
        "username": "Utilisateur (v3)",
        "auth_protocol": "Protocole d'authentification (v3)",
        "auth_key": "Mot de passe d'authentification (v3)",
        "priv_protocol": "Protocole de chiffrement (v3)",
        "priv_key": "Mot de passe de chiffrement (v3)",
    },
}
OPN_FIELDS = {
    "en": {
        "url": "OPNsense URL (empty = skip)",
        "api_key": "API key",
        "api_secret": "API secret",
        "verify_ssl": "Verify the certificate",
    },
    "fr": {
        "url": "URL d'OPNsense (vide = ignorer)",
        "api_key": "Clé d'API",
        "api_secret": "Secret d'API",
        "verify_ssl": "Vérifier le certificat",
    },
}
OPN_DESC = {
    "en": (
        "Optional. Read-only API user (see README for the exact privileges). "
        "Accepts http://ip:port or https://host.\n\nMissing privileges:\n{privileges}"
    ),
    "fr": (
        "Facultatif. Utilisateur d'API en lecture seule (droits exacts dans le README). "
        "Accepte http://ip:port ou https://hôte.\n\nDroits manquants :\n{privileges}"
    ),
}
SNMP_DESC = {
    "en": "Optional. Read-only SNMP access to a switch (v3 recommended). Tested by reading sysName.",
    "fr": "Facultatif. Accès SNMP en lecture seule à un switch (v3 recommandé). Testé en lisant sysName.",
}
ERRORS = {
    "en": {
        "cannot_connect": "Cannot reach OPNsense. Check the URL (http/https and port).",
        "invalid_auth": "OPNsense rejected the key or secret (401).",
        "missing_privileges": "The API user lacks a required privilege (403). Missing: {privileges}",
        "missing_credentials": "Key and secret are required.",
        "snmp_failed": "No SNMP answer (wrong host, credentials or protocols?).",
        "snmp_missing_user": "SNMPv3 needs a user.",
        "snmp_missing_community": "SNMPv2c needs a community.",
        "snmp_missing_host": "Enter the switch host.",
        "snmp_short_key": "SNMPv3 passwords must be at least 8 characters.",
    },
    "fr": {
        "cannot_connect": "OPNsense injoignable. Vérifiez l'URL (http/https et port).",
        "invalid_auth": "OPNsense refuse la clé ou le secret (401).",
        "missing_privileges": "Il manque un droit à l'utilisateur d'API (403). Manquant : {privileges}",
        "missing_credentials": "La clé et le secret sont obligatoires.",
        "snmp_failed": "Pas de réponse SNMP (hôte, identifiants ou protocoles ?).",
        "snmp_missing_user": "SNMPv3 nécessite un utilisateur.",
        "snmp_missing_community": "SNMPv2c nécessite une communauté.",
        "snmp_missing_host": "Indiquez l'hôte du switch.",
        "snmp_short_key": "Les mots de passe SNMPv3 font au moins 8 caractères.",
    },
}
SETTINGS = {
    "en": {
        "ping_interval_s": "Ping interval",
        "snmp_interval_s": "SNMP interval",
        "opnsense_interval_s": "OPNsense interval",
        "default_view": "Default view of the card",
        "firewall_analysis": "Firewall analysis",
    },
    "fr": {
        "ping_interval_s": "Intervalle de ping",
        "snmp_interval_s": "Intervalle SNMP",
        "opnsense_interval_s": "Intervalle OPNsense",
        "default_view": "Vue par défaut de la carte",
        "firewall_analysis": "Analyse du pare-feu",
    },
}

T = {
    "en": {
        "title": "Home Infra Map",
        "welcome": "Welcome",
        "welcome_desc": "Home Infra Map documents your electrical boards and your network. Everything else is optional.",
        "house_name": "House name",
        "sources_opn": "Source: OPNsense",
        "sources_snmp": "Source: SNMP switch",
        "finish": "Finish",
        "finish_desc": "Ready. Missing optional OPNsense privileges (features disabled):\n{privileges}",
        "import": "Import VLANs and DHCP reservations from OPNsense",
        "already": "Home Infra Map is already configured.",
        "menu": "Options",
        "menu_settings": "Intervals and display",
        "menu_opn": "OPNsense source",
        "menu_snmp_add": "Add an SNMP switch",
        "menu_snmp_remove": "Remove SNMP switches",
        "remove_sources": "Switches to remove",
        "online": "Online",
        "tcp": "Port {port}",
        "latency": "Latency",
        "switch_port": "Switch port",
        "blocks": "Firewall blocks",
        "port": "Port {port}",
        "up": "Up",
        "down": "Down",
        "row_power": "{row} power",
        "board_power": "Power",
        "issue_title": "{name} is offline",
        "issue_desc": "{name} ({host}) has not answered for more than {minutes} minutes.",
        "not_configured": "Home Infra Map is not configured.",
        "path_outside": "The path {path} is outside the configuration folder.",
        "import_failed": "Import failed: {error}",
        "file_unreadable": "Cannot read {path}.",
        "svc_import": "Import YAML",
        "svc_import_desc": "Import boards and/or network from a YAML file in /config (native export or house file format).",
        "path": "Path",
        "path_desc": "Path relative to /config.",
        "svc_export": "Export YAML",
        "svc_export_desc": "Export the whole documentation as YAML (returned, and written if a path is given).",
        "export_path_desc": "Optional file to write, relative to /config.",
        "svc_dash": "Generate an example dashboard",
        "svc_dash_desc": "Build a dashboard view (YAML) from your boards, network and created entities.",
        "svc_refresh": "Refresh",
        "svc_refresh_desc": "Refresh ping, OPNsense and SNMP data now.",
        "views": {"electricity": "Electricity", "network": "Network"},
    },
    "fr": {
        "title": "Home Infra Map",
        "welcome": "Bienvenue",
        "welcome_desc": "Home Infra Map documente vos tableaux électriques et votre réseau. Le reste est facultatif.",
        "house_name": "Nom de la maison",
        "sources_opn": "Source : OPNsense",
        "sources_snmp": "Source : switch SNMP",
        "finish": "Terminer",
        "finish_desc": "C'est prêt. Droits OPNsense facultatifs manquants (fonctions désactivées) :\n{privileges}",
        "import": "Importer les VLAN et les réservations DHCP depuis OPNsense",
        "already": "Home Infra Map est déjà configuré.",
        "menu": "Options",
        "menu_settings": "Intervalles et affichage",
        "menu_opn": "Source OPNsense",
        "menu_snmp_add": "Ajouter un switch SNMP",
        "menu_snmp_remove": "Retirer des switchs SNMP",
        "remove_sources": "Switchs à retirer",
        "online": "En ligne",
        "tcp": "Port {port}",
        "latency": "Latence",
        "switch_port": "Port switch",
        "blocks": "Blocages",
        "port": "Port {port}",
        "up": "Actif",
        "down": "Inactif",
        "row_power": "{row} puissance",
        "board_power": "Puissance",
        "issue_title": "{name} est hors ligne",
        "issue_desc": "{name} ({host}) ne répond plus depuis plus de {minutes} minutes.",
        "not_configured": "Home Infra Map n'est pas configuré.",
        "path_outside": "Le chemin {path} est en dehors du dossier de configuration.",
        "import_failed": "Import impossible : {error}",
        "file_unreadable": "Impossible de lire {path}.",
        "svc_import": "Importer un YAML",
        "svc_import_desc": "Importe les tableaux et/ou le réseau depuis un fichier YAML de /config (export natif ou format des fichiers de la maison).",
        "path": "Chemin",
        "path_desc": "Chemin relatif à /config.",
        "svc_export": "Exporter en YAML",
        "svc_export_desc": "Exporte toute la documentation en YAML (renvoyée, et écrite si un chemin est donné).",
        "export_path_desc": "Fichier à écrire (facultatif), relatif à /config.",
        "svc_dash": "Générer un exemple de tableau de bord",
        "svc_dash_desc": "Construit une vue de tableau de bord (YAML) à partir de vos tableaux, de votre réseau et des entités créées.",
        "svc_refresh": "Actualiser",
        "svc_refresh_desc": "Actualise maintenant le ping, OPNsense et SNMP.",
        "views": {"electricity": "Électricité", "network": "Réseau"},
    },
}


def build(lang: str) -> dict:
    t = T[lang]
    snmp_step = {"title": t["sources_snmp"], "description": SNMP_DESC[lang], "data": SNMP_FIELDS[lang]}
    opn_step = {"title": t["sources_opn"], "description": OPN_DESC[lang], "data": OPN_FIELDS[lang]}
    return {
        "title": t["title"],
        "config": {
            "step": {
                "user": {
                    "title": t["welcome"],
                    "description": t["welcome_desc"],
                    "data": {"house_name": t["house_name"]},
                },
                "opnsense": opn_step,
                "snmp": snmp_step,
                "finish": {
                    "title": t["finish"],
                    "description": t["finish_desc"],
                    "data": {"import_from_opnsense": t["import"]},
                },
            },
            "error": ERRORS[lang],
            "abort": {"already_configured": t["already"], "single_instance_allowed": t["already"]},
        },
        "options": {
            "step": {
                "init": {
                    "title": t["menu"],
                    "menu_options": {
                        "settings": t["menu_settings"],
                        "opnsense": t["menu_opn"],
                        "snmp_add": t["menu_snmp_add"],
                        "snmp_remove": t["menu_snmp_remove"],
                    },
                },
                "settings": {"title": t["menu_settings"], "data": SETTINGS[lang]},
                "opnsense": opn_step,
                "snmp_add": snmp_step,
                "snmp_remove": {"title": t["menu_snmp_remove"], "data": {"sources": t["remove_sources"]}},
            },
            "error": ERRORS[lang],
        },
        "selector": {
            "snmp_version": {"options": {"v2c": "v2c", "v3": "v3"}},
            "auth_protocol": {
                "options": {
                    k: (k.upper() if k != "none" else ("Aucun" if lang == "fr" else "None"))
                    for k in ("none", "md5", "sha", "sha224", "sha256", "sha384", "sha512")
                }
            },
            "priv_protocol": {
                "options": {
                    k: (k.upper() if k != "none" else ("Aucun" if lang == "fr" else "None"))
                    for k in ("none", "des", "3des", "aes", "aes192", "aes256")
                }
            },
            "default_view": {"options": t["views"]},
        },
        "entity": {
            "binary_sensor": {"online": {"name": t["online"]}, "tcp": {"name": t["tcp"]}},
            "sensor": {
                "latency": {"name": t["latency"]},
                "switch_port": {"name": t["switch_port"]},
                "blocks": {"name": t["blocks"]},
                "port": {"name": t["port"], "state": {"up": t["up"], "down": t["down"]}},
                "row_power": {"name": t["row_power"]},
                "board_power": {"name": t["board_power"]},
            },
        },
        "issues": {"device_offline": {"title": t["issue_title"], "description": t["issue_desc"]}},
        "exceptions": {
            "not_configured": {"message": t["not_configured"]},
            "path_outside_config": {"message": t["path_outside"]},
            "import_failed": {"message": t["import_failed"]},
            "file_unreadable": {"message": t["file_unreadable"]},
        },
        "services": {
            "import_yaml": {
                "name": t["svc_import"],
                "description": t["svc_import_desc"],
                "fields": {"path": {"name": t["path"], "description": t["path_desc"]}},
            },
            "export_yaml": {
                "name": t["svc_export"],
                "description": t["svc_export_desc"],
                "fields": {"path": {"name": t["path"], "description": t["export_path_desc"]}},
            },
            "generate_dashboard": {
                "name": t["svc_dash"],
                "description": t["svc_dash_desc"],
                "fields": {"path": {"name": t["path"], "description": t["export_path_desc"]}},
            },
            "refresh": {"name": t["svc_refresh"], "description": t["svc_refresh_desc"]},
        },
    }


def main() -> None:
    def dump(path: Path, data: dict) -> None:
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    dump(ROOT / "strings.json", build("en"))
    (ROOT / "translations").mkdir(exist_ok=True)
    dump(ROOT / "translations" / "en.json", build("en"))
    dump(ROOT / "translations" / "fr.json", build("fr"))


if __name__ == "__main__":
    main()
