# Notes for contributors (humans and agents)

Decisions that look like oversights but are not. Do not "fix" them without
reading the reason.

## The card is a Lovelace resource, not `add_extra_js_url`

`__init__._async_setup_card` registers `/home_infra_map/home-infra-map-card.js?v=<VERSION>`
in the Lovelace resource collection; `add_extra_js_url` is only the fallback
when resources are not editable (YAML mode). Home Assistant installs
`@webcomponents/scoped-custom-element-registry`, which replaces
`window.customElements`; a script injected in the document can run before it,
define the element in the native registry, and stay invisible to HA
("Custom element doesn't exist"), intermittently, mostly on *fast* loads.
Lovelace resources are loaded by the panel, after the polyfill. This was
diagnosed the hard way on a previous custom card. The card also re-registers
itself and re-emits `ll-rebuild` on orphan error cards at module end — keep it.

The resource is registered *in `async_setup`*, not at `async_at_started`
(which is only a retry): HA serves the UI while it is still starting, and a
page opened in that window loads the resource list once, without the card,
showing "Configuration error" until reloaded. Reproduced on a fresh instance
by `scripts/screenshots/run.sh`; `lovelace` is set up before us because it is
a dependency of `frontend`.

Card invariants: guarded `customElements.define`, `window.customCards.push`,
`getGridOptions()` returns `rows: 'auto'` (a number makes sections view clip
the card and overlap the next one), `setConfig` only throws on a non-object
config, no synchronous `performUpdate()` in `connectedCallback`, `render()`
always returns a visible `<ha-card>`.

## No config-entry reload on model edits

Entities follow the model through `entity.PlatformSync` (add / remove /
re-create on fingerprint change). A reload per edit made the entry absent for
a moment: a second service call or websocket command failed with
"not configured" (seen in the tests while importing two files in a row).
Options changes (sources, intervals) still reload: coordinators depend on them.

## Entity ids are pinned

`entity.object_id()` builds `home_infra_map_<owner>_<suffix>` with suffixes in
the *system* language (`ENTITY_SUFFIXES`). That is what the card previews
(`home_infra_map/preview_entities`) and what gets created. Unique ids derive
from the config entry id and stable internal UUIDs, never from names, so a
rename keeps history.

## Read-only, enforced in code

`opnsense.check_endpoint` refuses anything not allow-listed or looking like a
write; tests assert every call made goes through it. `snmp.py` never imports
`set_cmd`. pysnmp is imported, and its engine created, in the executor: both
read MIB files (blocking I/O in the event loop otherwise).

## Store revisions are per section

User saves carry `expected_revision` of *their* section. Automatic updates
(SNMP port detection) bump only the global revision, so a background refresh
never makes an edit in progress fail with a conflict.

## Validation library

HA 2026.10 replaced voluptuous with `probatio` (voluptuous is only an alias
installed by HA). Import `probatio as vol`.

## Requirements

Never list a Home Assistant core dependency (aiohttp, PyYAML, Pillow,
probatio…) in `manifest.json` `requirements`: hassfest rejects it.
`tests/test_repository.py` keeps the list honest.

## Translations

`strings.json` is never read at runtime for a custom integration; HA loads
`translations/<lang>.json` with `en` as the fallback. All three are generated
by `scripts/gen_translations.py` — edit that script, not the JSON files. CI
checks they are up to date.

## Photos

Stored under `/config/home_infra_map/photos/`, NOT `/config/www` (served at
`/local/` without authentication). Served by an authenticated view; the card
signs the URL (`auth/sign_path`). Re-encoded with Pillow (core dependency):
no EXIF, max 2400 px.

## Firewall engine

Pure (`firewall.py`), tested against `tests/fixtures/opnsense.json`. When a
case cannot be decided safely the line is kept with `probable: true` and a
reason code (translated by the card). Only *pass* rules are folded as
redundant: folding block rules would hide "internal networks blocked", which
the owner wants to see.

## Running the checks

```
uv venv .venv --python 3.14
uv pip install --python .venv/bin/python -r requirements_test.txt
python scripts/manifest_requirements.py && uv pip install --python .venv/bin/python -r manifest-requirements.txt
.venv/bin/pytest --cov
.venv/bin/ruff check . && .venv/bin/ruff format --check . && .venv/bin/mypy custom_components/home_infra_map
(cd frontend && npm ci && npm run typecheck && npm run lint && npm test && npm run build)
git diff --exit-code --stat custom_components/home_infra_map/www/home-infra-map-card.js
```

hassfest can be run locally from a sparse clone of home-assistant/core at the
floor tag: `python -m script.hassfest --integration-path custom_components/home_infra_map`.

Versions are written by the release workflow from the `vX.Y.Z` tag in
`manifest.json`, `const.py`, `pyproject.toml`, `frontend/package.json`,
`frontend/src/version.ts`; `tests/test_repository.py` checks they agree.
