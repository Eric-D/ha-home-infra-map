#!/usr/bin/env bash
# End-to-end check on a real Home Assistant + README screenshots.
#   1. boots HA (dev venv, port 8123 must be free) with the integration,
#      imports the anonymised examples, checks in Chromium that the card loads
#      as a Lovelace resource without error cards;
#   2. shoots docs/img/*.png from the card dev harness (frontend/dev).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
WORK="${WORK:-$(mktemp -d)}"
mkdir -p "$WORK"
cd "$ROOT/scripts/screenshots"
[ -d node_modules ] || npm install --no-audit --no-fund -s
(cd "$ROOT/frontend" && npm run build >/dev/null)
"$ROOT/.venv/bin/python" -I setup_ha.py "$WORK/ha" > "$WORK/ha.json"
trap 'kill "$(python3 -c "import json;print(json.load(open(\"$WORK/ha.json\"))[\"pid\"])")" 2>/dev/null || true; kill %1 2>/dev/null || true' EXIT
node shoot_ha.mjs http://127.0.0.1:8123 "$WORK/e2e"
(cd "$ROOT/frontend" && npx vite --config vite.dev.config.ts --port 5173 --strictPort >/dev/null 2>&1) &
sleep 5
node shoot_harness.mjs "$ROOT/docs/img"
echo "E2E artefacts in $WORK/e2e"
