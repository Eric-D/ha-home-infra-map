"""Connection tests used by the config and options flows."""

from __future__ import annotations

import logging

from homeassistant.core import HomeAssistant

from .const import (
    CONF_API_KEY,
    CONF_API_SECRET,
    CONF_AUTH_KEY,
    CONF_AUTH_PROTOCOL,
    CONF_COMMUNITY,
    CONF_HOST,
    CONF_PRIV_KEY,
    CONF_PRIV_PROTOCOL,
    CONF_SNMP_VERSION,
    CONF_URL,
    CONF_USERNAME,
)
from .coordinator import build_opnsense_client
from .models import JsonDict
from .opnsense import OPNsenseAuthError, OPNsenseConnectionError, OPNsensePermissionError, normalize_url
from .snmp import SnmpClient

_LOGGER = logging.getLogger(__name__)


async def async_validate_opnsense(hass: HomeAssistant, conf: JsonDict) -> tuple[dict[str, str], list[str]]:
    """Return (errors, missing optional privileges)."""
    if not conf.get(CONF_API_KEY) or not conf.get(CONF_API_SECRET):
        return {"base": "missing_credentials"}, []
    conf[CONF_URL] = normalize_url(conf[CONF_URL])
    client = build_opnsense_client(hass, conf)
    try:
        await client.test_connection()
    except OPNsenseAuthError:
        return {"base": "invalid_auth"}, []
    except OPNsensePermissionError as err:
        return {"base": "missing_privileges"}, [err.privilege]
    except OPNsenseConnectionError as err:
        _LOGGER.debug("OPNsense test failed: %s", err)
        return {"base": "cannot_connect"}, []
    return {}, await client.check_privileges()


async def async_validate_snmp(hass: HomeAssistant, conf: JsonDict) -> tuple[dict[str, str], str | None]:
    """Return (errors, sysName)."""
    if conf.get(CONF_SNMP_VERSION) == "v3":
        if not conf.get(CONF_USERNAME):
            return {"base": "snmp_missing_user"}, None
        if conf.get(CONF_AUTH_PROTOCOL, "none") != "none" and len(conf.get(CONF_AUTH_KEY) or "") < 8:
            return {"base": "snmp_short_key"}, None
        if conf.get(CONF_PRIV_PROTOCOL, "none") != "none" and len(conf.get(CONF_PRIV_KEY) or "") < 8:
            return {"base": "snmp_short_key"}, None
    elif not conf.get(CONF_COMMUNITY):
        return {"base": "snmp_missing_community"}, None
    client = SnmpClient(conf, hass.async_add_executor_job)
    try:
        name = await client.get_sys_name()
    except Exception as err:  # pysnmp raises many internal error types
        _LOGGER.debug("SNMP test on %s failed: %r", conf.get(CONF_HOST), err)
        return {"base": "snmp_failed"}, None
    return {}, name
