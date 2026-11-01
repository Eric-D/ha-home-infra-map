"""Write manifest-requirements.txt from manifest.json (single source of truth)."""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
manifest = json.loads((ROOT / "custom_components" / "home_infra_map" / "manifest.json").read_text())
(ROOT / "manifest-requirements.txt").write_text("\n".join(manifest["requirements"]) + "\n")
print("\n".join(manifest["requirements"]))
