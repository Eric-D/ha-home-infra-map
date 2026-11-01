"""Repository invariants hassfest/HACS do not check."""

from __future__ import annotations

import json
import re
from pathlib import Path

import yaml

from custom_components.home_infra_map import const

ROOT = Path(__file__).resolve().parent.parent
INTEG = ROOT / "custom_components" / "home_infra_map"


def _manifest() -> dict:
    return json.loads((INTEG / "manifest.json").read_text())


def test_versions_in_sync() -> None:
    """The release workflow rewrites these: a substitution that stops
    matching would serve a stale bundle behind a fresh cache buster."""
    version = _manifest()["version"]
    assert version == const.VERSION
    package = json.loads((ROOT / "frontend" / "package.json").read_text())
    assert package["version"] == version
    version_ts = (ROOT / "frontend" / "src" / "version.ts").read_text()
    assert f"'{version}'" in version_ts or f'"{version}"' in version_ts
    pyproject = (ROOT / "pyproject.toml").read_text()
    assert f'version = "{version}"' in pyproject


def test_hacs_floor() -> None:
    hacs = json.loads((ROOT / "hacs.json").read_text())
    assert hacs["homeassistant"] == "2026.10.0"
    assert hacs["name"] == _manifest()["name"] == "Home Infra Map"


def test_no_core_dependency_in_manifest() -> None:
    """hassfest refuses Home Assistant core deps in a custom manifest."""
    reqs = " ".join(_manifest()["requirements"]).lower()
    for core_dep in ("aiohttp", "pyyaml", "voluptuous", "probatio", "pillow", "requests"):
        assert core_dep not in reqs


def test_translations_complete_and_in_sync() -> None:
    strings = json.loads((INTEG / "strings.json").read_text())
    en = json.loads((INTEG / "translations" / "en.json").read_text())
    fr = json.loads((INTEG / "translations" / "fr.json").read_text())
    assert strings == en  # strings.json is never read at runtime

    def keys(d: dict, prefix: str = "") -> set[str]:
        out = set()
        for k, v in d.items():
            out |= keys(v, f"{prefix}{k}.") if isinstance(v, dict) else {prefix + k}
        return out

    assert keys(en) == keys(fr)
    # every service has its translation
    services = yaml.safe_load((INTEG / "services.yaml").read_text())
    assert set(services) == set(en["services"])
    # every error code returned by the flows is translated
    source = (INTEG / "config_flow.py").read_text() + (INTEG / "validation.py").read_text()
    for code in set(re.findall(r'"base": "([a-z_]+)"', source)):
        assert code in en["config"]["error"], code


DATA_FILES = [
    *sorted((ROOT / "tests" / "fixtures").glob("*")),
    *sorted((ROOT / "docs" / "examples").glob("*")),
    ROOT / "frontend" / "dev" / "fixture.json",
    ROOT / "frontend" / "dev" / "harness.ts",
    ROOT / "README.md",
    ROOT / "README.en.md",
]
# Fictional demo house only: its subnets, documentation ranges (RFC 5737), RFC 1918 aliases.
ALLOWED_IP = re.compile(
    r"^(192\.168\.(1|10|20|30|40|50|60)\.\d+|10\.8\.0\.\d+|10\.9\.0\.1|198\.51\.100\.\d+|203\.0\.113\.\d+"
    r"|10\.0\.0\.0|172\.16\.0\.0|192\.168\.0\.0|8\.8\.8\.8|127\.0\.0\.1|0\.0\.0\.0)$"
)


def test_only_fictional_network_data_is_committed() -> None:
    """No real house data: invented MACs (02:00:5e:…) and demo address plan only."""
    for path in DATA_FILES:
        text = path.read_text(encoding="utf-8", errors="ignore")
        for mac in re.findall(r"\b(?:[0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}\b", text):
            assert mac.lower().startswith(("02:00:5e:", "02:00:00:00:00:")), (path.name, mac)
        for ip in re.findall(r"(?<![\d.])\d{1,3}(?:\.\d{1,3}){3}(?![\d.])", text):
            assert ALLOWED_IP.match(ip), (path.name, ip)
