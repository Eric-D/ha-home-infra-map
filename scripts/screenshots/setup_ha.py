"""Boot a throw-away Home Assistant with the integration, for checks and screenshots.

Real HA (from the dev venv), real frontend, the integration copied in
custom_components, onboarding and config flow driven through the public API,
example files imported with the integration's own service. No personal data:
only the anonymised files of tests/fixtures.

Usage: python -I scripts/screenshots/setup_ha.py <config_dir>   (port 8123 must be free)
Prints a JSON line {"url", "token"} once ready; HA keeps running (the caller
stops it).
"""

from __future__ import annotations

import contextlib
import json
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CONFIG = Path(sys.argv[1]).resolve()
PORT = 8123  # a non-default port makes HA 2026.10 ask for a confirmation in the UI
BASE = f"http://127.0.0.1:{PORT}"
CLIENT = f"{BASE}/"

CONFIGURATION = f"""
homeassistant:
  name: Maison (démo)
  country: FR
  language: fr
  time_zone: Europe/Paris
  unit_system: metric
  latitude: 45.0
  longitude: 4.0
  elevation: 400
http:
frontend:
config:
lovelace:
history:
recorder:
  db_url: "sqlite:///{CONFIG}/home-assistant_v2.db"
logger:
  default: warning
  logs:
    custom_components.home_infra_map: debug
"""


def req(method: str, path: str, data: object = None, token: str | None = None, form: bool = False) -> object:
    body = None
    headers = {}
    if data is not None:
        if form:
            body = urllib.parse.urlencode(data).encode()  # type: ignore[arg-type]
            headers["Content-Type"] = "application/x-www-form-urlencoded"
        else:
            body = json.dumps(data).encode()
            headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = f"Bearer {token}"
    request = urllib.request.Request(BASE + path, data=body, method=method, headers=headers)
    with urllib.request.urlopen(request, timeout=60) as resp:
        text = resp.read().decode()
        return json.loads(text) if text else None


def main() -> None:
    if CONFIG.exists():
        shutil.rmtree(CONFIG)
    (CONFIG / "custom_components").mkdir(parents=True)
    shutil.copytree(
        ROOT / "custom_components" / "home_infra_map",
        CONFIG / "custom_components" / "home_infra_map",
        ignore=shutil.ignore_patterns("__pycache__"),
    )
    (CONFIG / "configuration.yaml").write_text(CONFIGURATION)
    house = CONFIG / "maison"
    house.mkdir()
    for name in ("electricite.yaml", "reseau.yaml"):
        shutil.copy(ROOT / "tests" / "fixtures" / name, house / name)

    log = open(CONFIG / "hass.log", "w")  # noqa: SIM115 - lives as long as HA
    # cwd=CONFIG: the copy under test is imported, not the repository checkout
    proc = subprocess.Popen(
        [sys.executable, "-m", "homeassistant", "-c", str(CONFIG)], stdout=log, stderr=log, cwd=CONFIG
    )
    for _ in range(240):
        try:
            req("GET", "/api/onboarding")
            break
        except urllib.error.URLError, ConnectionError, OSError:
            if proc.poll() is not None:
                sys.exit("HA exited, see hass.log")
            time.sleep(1)
    user = req(
        "POST",
        "/api/onboarding/users",
        {
            "client_id": CLIENT,
            "name": "Démo",
            "username": "demo",
            "password": "demo1234demo",
            "language": "fr",
        },
    )
    tokens = req(
        "POST",
        "/auth/token",
        {
            "grant_type": "authorization_code",
            "code": user["auth_code"],  # type: ignore[index]
            "client_id": CLIENT,
        },
        form=True,
    )
    token = tokens["access_token"]  # type: ignore[index]
    for step, payload in (
        ("core_config", {}),
        ("analytics", {}),
        ("integration", {"client_id": CLIENT, "redirect_uri": CLIENT}),
    ):
        with contextlib.suppress(urllib.error.HTTPError):
            req("POST", f"/api/onboarding/{step}", payload, token)

    flow = req("POST", "/api/config/config_entries/flow", {"handler": "home_infra_map"}, token)
    flow = req("POST", f"/api/config/config_entries/flow/{flow['flow_id']}", {"house_name": "Maison"}, token)  # type: ignore[index]
    flow = req("POST", f"/api/config/config_entries/flow/{flow['flow_id']}", {"url": ""}, token)  # type: ignore[index]
    flow = req("POST", f"/api/config/config_entries/flow/{flow['flow_id']}", {"host": ""}, token)  # type: ignore[index]
    assert flow["type"] == "create_entry", flow  # type: ignore[index]

    for name in ("electricite.yaml", "reseau.yaml"):
        result = req(
            "POST",
            "/api/services/home_infra_map/import_yaml?return_response",
            {"path": f"maison/{name}"},
            token,
        )
        print("import", name, json.dumps(result, ensure_ascii=False), file=sys.stderr)
    print(json.dumps({"url": BASE, "token": token, "pid": proc.pid}), flush=True)


if __name__ == "__main__":
    main()
