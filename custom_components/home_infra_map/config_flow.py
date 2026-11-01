"""Config and options flows: everything is configured from the UI."""

from __future__ import annotations

from typing import Any

import probatio as vol
from homeassistant.config_entries import ConfigEntry, ConfigFlow, ConfigFlowResult, OptionsFlow
from homeassistant.core import callback
from homeassistant.helpers.selector import (
    BooleanSelector,
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectOptionDict,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
    TextSelectorConfig,
    TextSelectorType,
)

from .const import (
    CONF_API_KEY,
    CONF_API_SECRET,
    CONF_AUTH_KEY,
    CONF_AUTH_PROTOCOL,
    CONF_COMMUNITY,
    CONF_DEFAULT_VIEW,
    CONF_FIREWALL_ANALYSIS,
    CONF_HOST,
    CONF_HOUSE_NAME,
    CONF_IMPORT_FROM_OPNSENSE,
    CONF_OPNSENSE,
    CONF_OPNSENSE_INTERVAL,
    CONF_PING_INTERVAL,
    CONF_PORT,
    CONF_PRIV_KEY,
    CONF_PRIV_PROTOCOL,
    CONF_SNMP_INTERVAL,
    CONF_SNMP_SOURCES,
    CONF_SNMP_VERSION,
    CONF_URL,
    CONF_USERNAME,
    CONF_VERIFY_SSL,
    DEFAULT_OPNSENSE_INTERVAL,
    DEFAULT_PING_INTERVAL,
    DEFAULT_SNMP_INTERVAL,
    DOMAIN,
    NAME,
    OPNSENSE_INTERVAL_RANGE,
    PING_INTERVAL_RANGE,
    SNMP_AUTH_PROTOCOLS,
    SNMP_INTERVAL_RANGE,
    SNMP_PRIV_PROTOCOLS,
    SNMP_VERSIONS,
    VIEWS,
)
from .models import JsonDict, new_id
from .validation import async_validate_opnsense, async_validate_snmp

_PASSWORD = TextSelector(TextSelectorConfig(type=TextSelectorType.PASSWORD))
_URL = TextSelector(TextSelectorConfig(type=TextSelectorType.URL))


def _select(options: tuple[str, ...], key: str) -> SelectSelector:
    return SelectSelector(
        SelectSelectorConfig(options=list(options), mode=SelectSelectorMode.DROPDOWN, translation_key=key)
    )


def _opnsense_schema(defaults: JsonDict, keep_secrets: bool) -> vol.Schema:
    return vol.Schema(
        {
            vol.Optional(CONF_URL, description={"suggested_value": defaults.get(CONF_URL, "")}): _URL,
            vol.Optional(CONF_API_KEY): _PASSWORD if keep_secrets else TextSelector(),
            vol.Optional(CONF_API_SECRET): _PASSWORD,
            vol.Optional(CONF_VERIFY_SSL, default=defaults.get(CONF_VERIFY_SSL, True)): BooleanSelector(),
        }
    )


def _snmp_schema(defaults: JsonDict) -> vol.Schema:
    return vol.Schema(
        {
            vol.Optional(
                CONF_HOST, description={"suggested_value": defaults.get(CONF_HOST, "")}
            ): TextSelector(),
            vol.Optional(CONF_PORT, default=defaults.get(CONF_PORT, 161)): NumberSelector(
                NumberSelectorConfig(min=1, max=65535, mode=NumberSelectorMode.BOX)
            ),
            vol.Optional(CONF_SNMP_VERSION, default=defaults.get(CONF_SNMP_VERSION, "v3")): _select(
                SNMP_VERSIONS, "snmp_version"
            ),
            vol.Optional(CONF_COMMUNITY): _PASSWORD,
            vol.Optional(
                CONF_USERNAME, description={"suggested_value": defaults.get(CONF_USERNAME, "")}
            ): TextSelector(),
            vol.Optional(CONF_AUTH_PROTOCOL, default=defaults.get(CONF_AUTH_PROTOCOL, "sha")): _select(
                SNMP_AUTH_PROTOCOLS, "auth_protocol"
            ),
            vol.Optional(CONF_AUTH_KEY): _PASSWORD,
            vol.Optional(CONF_PRIV_PROTOCOL, default=defaults.get(CONF_PRIV_PROTOCOL, "aes")): _select(
                SNMP_PRIV_PROTOCOLS, "priv_protocol"
            ),
            vol.Optional(CONF_PRIV_KEY): _PASSWORD,
        }
    )


def _clean_snmp(user_input: JsonDict) -> JsonDict:
    conf = {k: v for k, v in user_input.items() if v not in (None, "")}
    conf[CONF_HOST] = str(conf.get(CONF_HOST, "")).strip()
    conf[CONF_PORT] = int(conf.get(CONF_PORT, 161))
    if conf.get(CONF_SNMP_VERSION) == "v2c":
        for key in (CONF_USERNAME, CONF_AUTH_KEY, CONF_PRIV_KEY, CONF_AUTH_PROTOCOL, CONF_PRIV_PROTOCOL):
            conf.pop(key, None)
    else:
        conf.pop(CONF_COMMUNITY, None)
    return conf


def _privileges_text(missing: list[str]) -> str:
    return "\n".join(f"- {p}" for p in missing) if missing else "-"


class HomeInfraMapConfigFlow(ConfigFlow, domain=DOMAIN):
    """Initial setup: name, optional sources, optional OPNsense import."""

    VERSION = 1

    def __init__(self) -> None:
        """Initialise the flow state."""
        self._data: JsonDict = {}
        self._options: JsonDict = {CONF_SNMP_SOURCES: []}
        self._missing: list[str] = []

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> HomeInfraMapOptionsFlow:
        """Return the options flow."""
        return HomeInfraMapOptionsFlow()

    async def async_step_user(self, user_input: JsonDict | None = None) -> ConfigFlowResult:
        """Welcome screen: house name."""
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()
        if user_input is not None:
            self._data[CONF_HOUSE_NAME] = user_input[CONF_HOUSE_NAME].strip()
            return await self.async_step_opnsense()
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({vol.Required(CONF_HOUSE_NAME, default="Maison"): TextSelector()}),
        )

    async def async_step_opnsense(self, user_input: JsonDict | None = None) -> ConfigFlowResult:
        """Optional OPNsense source."""
        errors: dict[str, str] = {}
        if user_input is not None:
            if not str(user_input.get(CONF_URL) or "").strip():
                return await self.async_step_snmp()
            conf = dict(user_input)
            errors, self._missing = await async_validate_opnsense(self.hass, conf)
            if not errors:
                self._options[CONF_OPNSENSE] = conf
                return await self.async_step_snmp()
        return self.async_show_form(
            step_id="opnsense",
            data_schema=self.add_suggested_values_to_schema(
                _opnsense_schema({}, keep_secrets=True), user_input or {}
            ),
            errors=errors,
            description_placeholders={"privileges": _privileges_text(self._missing)},
        )

    async def async_step_snmp(self, user_input: JsonDict | None = None) -> ConfigFlowResult:
        """Optional SNMP switch (more can be added later in the options)."""
        errors: dict[str, str] = {}
        if user_input is not None:
            conf = _clean_snmp(user_input)
            if not conf[CONF_HOST]:
                return await self.async_step_finish()
            errors, _name = await async_validate_snmp(self.hass, conf)
            if not errors:
                self._options[CONF_SNMP_SOURCES] = [{**conf, "id": new_id()}]
                return await self.async_step_finish()
        return self.async_show_form(step_id="snmp", data_schema=_snmp_schema(user_input or {}), errors=errors)

    async def async_step_finish(self, user_input: JsonDict | None = None) -> ConfigFlowResult:
        """Summary and optional import from OPNsense."""
        has_opnsense = CONF_OPNSENSE in self._options
        if user_input is not None or not has_opnsense:
            self._data[CONF_IMPORT_FROM_OPNSENSE] = bool((user_input or {}).get(CONF_IMPORT_FROM_OPNSENSE))
            return self.async_create_entry(
                title=self._data.get(CONF_HOUSE_NAME) or NAME,
                data=self._data,
                options={
                    **self._options,
                    CONF_PING_INTERVAL: DEFAULT_PING_INTERVAL,
                    CONF_SNMP_INTERVAL: DEFAULT_SNMP_INTERVAL,
                    CONF_OPNSENSE_INTERVAL: DEFAULT_OPNSENSE_INTERVAL,
                    CONF_DEFAULT_VIEW: "electricity",
                    CONF_FIREWALL_ANALYSIS: True,
                },
            )
        return self.async_show_form(
            step_id="finish",
            data_schema=vol.Schema(
                {vol.Optional(CONF_IMPORT_FROM_OPNSENSE, default=True): BooleanSelector()}
            ),
            description_placeholders={"privileges": _privileges_text(self._missing)},
        )


class HomeInfraMapOptionsFlow(OptionsFlow):
    """Sources, intervals and display settings."""

    def __init__(self) -> None:
        """Initialise flow state (the entry comes from the base class property)."""
        self._missing: list[str] = []

    async def async_step_init(self, user_input: JsonDict | None = None) -> ConfigFlowResult:
        """Menu."""
        menu = ["settings", "opnsense", "snmp_add"]
        if self.config_entry.options.get(CONF_SNMP_SOURCES):
            menu.append("snmp_remove")
        return self.async_show_menu(step_id="init", menu_options=menu)

    def _save(self, **changes: Any) -> ConfigFlowResult:
        return self.async_create_entry(data={**self.config_entry.options, **changes})

    async def async_step_settings(self, user_input: JsonDict | None = None) -> ConfigFlowResult:
        """Intervals, default view, firewall analysis."""
        opts = self.config_entry.options
        if user_input is not None:
            return self._save(
                **{
                    CONF_PING_INTERVAL: int(user_input[CONF_PING_INTERVAL]),
                    CONF_SNMP_INTERVAL: int(user_input[CONF_SNMP_INTERVAL]),
                    CONF_OPNSENSE_INTERVAL: int(user_input[CONF_OPNSENSE_INTERVAL]),
                    CONF_DEFAULT_VIEW: user_input[CONF_DEFAULT_VIEW],
                    CONF_FIREWALL_ANALYSIS: bool(user_input[CONF_FIREWALL_ANALYSIS]),
                }
            )

        def _num(rng: tuple[int, int], step: int) -> NumberSelector:
            return NumberSelector(
                NumberSelectorConfig(
                    min=rng[0], max=rng[1], step=step, unit_of_measurement="s", mode=NumberSelectorMode.BOX
                )
            )

        schema = vol.Schema(
            {
                vol.Required(
                    CONF_PING_INTERVAL, default=opts.get(CONF_PING_INTERVAL, DEFAULT_PING_INTERVAL)
                ): _num(PING_INTERVAL_RANGE, 5),
                vol.Required(
                    CONF_SNMP_INTERVAL, default=opts.get(CONF_SNMP_INTERVAL, DEFAULT_SNMP_INTERVAL)
                ): _num(SNMP_INTERVAL_RANGE, 30),
                vol.Required(
                    CONF_OPNSENSE_INTERVAL,
                    default=opts.get(CONF_OPNSENSE_INTERVAL, DEFAULT_OPNSENSE_INTERVAL),
                ): _num(OPNSENSE_INTERVAL_RANGE, 30),
                vol.Required(CONF_DEFAULT_VIEW, default=opts.get(CONF_DEFAULT_VIEW, "electricity")): _select(
                    VIEWS, "default_view"
                ),
                vol.Required(
                    CONF_FIREWALL_ANALYSIS, default=opts.get(CONF_FIREWALL_ANALYSIS, True)
                ): BooleanSelector(),
            }
        )
        return self.async_show_form(step_id="settings", data_schema=schema)

    async def async_step_opnsense(self, user_input: JsonDict | None = None) -> ConfigFlowResult:
        """Change or remove the OPNsense source. Empty secrets keep the stored ones."""
        current: JsonDict = dict(self.config_entry.options.get(CONF_OPNSENSE) or {})
        errors: dict[str, str] = {}
        if user_input is not None:
            if not str(user_input.get(CONF_URL) or "").strip():
                options = dict(self.config_entry.options)
                options.pop(CONF_OPNSENSE, None)
                return self.async_create_entry(data=options)
            conf = {
                CONF_URL: user_input[CONF_URL],
                CONF_API_KEY: user_input.get(CONF_API_KEY) or current.get(CONF_API_KEY),
                CONF_API_SECRET: user_input.get(CONF_API_SECRET) or current.get(CONF_API_SECRET),
                CONF_VERIFY_SSL: user_input.get(CONF_VERIFY_SSL, True),
            }
            errors, self._missing = await async_validate_opnsense(self.hass, conf)
            if not errors:
                return self._save(**{CONF_OPNSENSE: conf})
        return self.async_show_form(
            step_id="opnsense",
            data_schema=_opnsense_schema(current, keep_secrets=True),
            errors=errors,
            description_placeholders={"privileges": _privileges_text(self._missing)},
        )

    async def async_step_snmp_add(self, user_input: JsonDict | None = None) -> ConfigFlowResult:
        """Add an SNMP switch."""
        errors: dict[str, str] = {}
        if user_input is not None:
            conf = _clean_snmp(user_input)
            if not conf[CONF_HOST]:
                errors["base"] = "snmp_missing_host"
            else:
                errors, _name = await async_validate_snmp(self.hass, conf)
            if not errors:
                sources = [*self.config_entry.options.get(CONF_SNMP_SOURCES, []), {**conf, "id": new_id()}]
                return self._save(**{CONF_SNMP_SOURCES: sources})
        return self.async_show_form(
            step_id="snmp_add", data_schema=_snmp_schema(user_input or {}), errors=errors
        )

    async def async_step_snmp_remove(self, user_input: JsonDict | None = None) -> ConfigFlowResult:
        """Remove SNMP switches."""
        sources: list[JsonDict] = self.config_entry.options.get(CONF_SNMP_SOURCES, [])
        if user_input is not None:
            remove = set(user_input.get("sources", []))
            return self._save(**{CONF_SNMP_SOURCES: [s for s in sources if s["id"] not in remove]})
        options = [SelectOptionDict(value=s["id"], label=s[CONF_HOST]) for s in sources]
        return self.async_show_form(
            step_id="snmp_remove",
            data_schema=vol.Schema(
                {
                    vol.Optional("sources", default=[]): SelectSelector(
                        SelectSelectorConfig(options=options, multiple=True, mode=SelectSelectorMode.LIST)
                    )
                }
            ),
        )
