"""Read-only OPNsense API client.

Safety: every request goes through `_request`, which only accepts endpoints
from an explicit allow-list and refuses anything that looks like a write
(set/add/del/apply/reconfigure/restart...). The integration never opens or
changes the firewall.
"""

from __future__ import annotations

import asyncio
import base64
import logging
import re
from typing import Any, Final
from urllib.parse import quote

import aiohttp

_LOGGER = logging.getLogger(__name__)

TIMEOUT: Final = aiohttp.ClientTimeout(total=20)

# path -> allowed HTTP method. Paths ending with "/" accept one URL-quoted
# argument (alias name).
ALLOWED_ENDPOINTS: Final[dict[str, str]] = {
    "/api/diagnostics/interface/get_arp": "GET",
    "/api/interfaces/overview/interfaces_info": "GET",
    "/api/interfaces/vlan_settings/search_item": "GET",
    "/api/kea/dhcpv4/search_reservation": "GET",
    "/api/kea/dhcpv4/search_subnet": "GET",
    "/api/kea/leases4/search": "GET",
    "/api/firewall/filter/search_rule": "POST",
    "/api/firewall/d_nat/search_rule": "POST",
    "/api/firewall/alias/search_item": "GET",
    "/api/firewall/alias_util/list/": "GET",
    "/api/diagnostics/log/core/filter": "POST",
    "/api/diagnostics/log/core/resolver": "POST",
    "/api/routes/gateway/status": "GET",
}

_FORBIDDEN = re.compile(
    r"/(set|add|del|delete|apply|reconfigure|restart|start|stop|toggle|flush|kill|"
    r"upload|import|savepoint|revert|reboot|halt|update|upgrade|cancel|reset)[a-z_]*(/|$)",
    re.IGNORECASE,
)

SEARCH_BODY: Final = {"current": 1, "rowCount": -1, "searchPhrase": ""}

# Privileges to grant, by endpoint, for a clear error message on 403.
PRIVILEGES: Final[dict[str, str]] = {
    "/api/diagnostics/interface/get_arp": "Diagnostics: ARP Table",
    "/api/interfaces/overview/interfaces_info": "Interfaces: Overview",
    "/api/interfaces/vlan_settings/search_item": "Interfaces: VLAN",
    "/api/kea/dhcpv4/search_reservation": "Services: Kea DHCPv4",
    "/api/kea/leases4/search": "Services: Kea DHCPv4",
    "/api/firewall/filter/search_rule": "Firewall: Rules",
    "/api/firewall/d_nat/search_rule": "Firewall: NAT: Port Forward",
    "/api/firewall/alias/search_item": "Firewall: Alias",
    "/api/firewall/alias_util/list/": "Firewall: Alias",
    "/api/diagnostics/log/core/filter": "Diagnostics: Logs: Firewall",
    "/api/diagnostics/log/core/resolver": "Diagnostics: Logs (resolver)",
    "/api/routes/gateway/status": "System: Gateways",
}


class OPNsenseError(Exception):
    """Base error."""


class OPNsenseConnectionError(OPNsenseError):
    """Router unreachable or invalid answer."""


class OPNsenseAuthError(OPNsenseError):
    """401: wrong key/secret."""


class OPNsensePermissionError(OPNsenseError):
    """403: the API user lacks a privilege."""

    def __init__(self, path: str) -> None:
        """Remember which privilege is missing."""
        self.path = path
        self.privilege = PRIVILEGES.get(_base(path), path)
        super().__init__(f"missing privilege for {path}: {self.privilege}")


class ForbiddenEndpointError(OPNsenseError):
    """A non read-only endpoint was requested (programming error)."""


def _base(path: str) -> str:
    if path.startswith("/api/firewall/alias_util/list/"):
        return "/api/firewall/alias_util/list/"
    return path


def check_endpoint(path: str, method: str) -> None:
    """Raise unless (path, method) is an allowed read-only call."""
    if _FORBIDDEN.search(path.split("?", maxsplit=1)[0]):
        raise ForbiddenEndpointError(f"refusing non read-only endpoint {path}")
    base = _base(path)
    allowed = ALLOWED_ENDPOINTS.get(base)
    if allowed is None or allowed != method:
        raise ForbiddenEndpointError(f"endpoint not allow-listed: {method} {path}")
    if base.endswith("/") and "/" in path[len(base) :]:
        raise ForbiddenEndpointError(f"invalid argument in {path}")


def normalize_url(url: str) -> str:
    """Accept 'http://ip:port', 'https://host', or a bare host."""
    url = url.strip().rstrip("/")
    if not re.match(r"^https?://", url, re.IGNORECASE):
        url = f"https://{url}"
    return url.removesuffix("/api")


class OPNsenseClient:
    """Thin read-only client around the OPNsense REST API."""

    def __init__(
        self,
        session: aiohttp.ClientSession,
        url: str,
        api_key: str,
        api_secret: str,
        verify_ssl: bool = True,
    ) -> None:
        """Initialise the client. Credentials are never logged."""
        self._session = session
        self._url = normalize_url(url)
        token = base64.b64encode(f"{api_key}:{api_secret}".encode()).decode()
        self._headers = {"Authorization": f"Basic {token}", "Accept": "application/json"}
        self._ssl: bool = verify_ssl

    @property
    def url(self) -> str:
        """Return the base URL."""
        return self._url

    async def _request(
        self,
        method: str,
        path: str,
        *,
        json_body: dict[str, Any] | None = None,
        form: dict[str, Any] | None = None,
    ) -> Any:
        check_endpoint(path, method)
        url = f"{self._url}{path}"
        try:
            async with self._session.request(
                method,
                url,
                headers=self._headers,
                json=json_body,
                data=form,
                ssl=self._ssl,
                timeout=TIMEOUT,
            ) as resp:
                if resp.status == 401:
                    raise OPNsenseAuthError("invalid API key or secret")
                if resp.status == 403:
                    raise OPNsensePermissionError(path)
                if resp.status >= 400:
                    raise OPNsenseConnectionError(f"HTTP {resp.status} on {path}")
                return await resp.json(content_type=None)
        except (TimeoutError, aiohttp.ClientError, ValueError) as err:
            raise OPNsenseConnectionError(f"{type(err).__name__} on {path}") from err

    async def _search(self, path: str, method: str = "GET") -> list[dict[str, Any]]:
        if method == "POST":
            data = await self._request("POST", path, json_body=SEARCH_BODY)
        else:
            data = await self._request("GET", path)
        if isinstance(data, dict):
            rows = data.get("rows") or data.get("items") or []
            return [r for r in rows if isinstance(r, dict)]
        if isinstance(data, list):
            return [r for r in data if isinstance(r, dict)]
        return []

    # --- endpoints -------------------------------------------------------

    async def get_arp(self) -> list[dict[str, Any]]:
        """Return the ARP table."""
        data = await self._request("GET", "/api/diagnostics/interface/get_arp")
        if isinstance(data, dict):
            data = data.get("rows", [])
        return [r for r in data if isinstance(r, dict)] if isinstance(data, list) else []

    async def get_interfaces(self) -> list[dict[str, Any]]:
        """Return interfaces with their IPv4 addresses."""
        return await self._search("/api/interfaces/overview/interfaces_info")

    async def get_vlans(self) -> list[dict[str, Any]]:
        """Return VLAN definitions."""
        return await self._search("/api/interfaces/vlan_settings/search_item")

    async def get_reservations(self) -> list[dict[str, Any]]:
        """Return Kea DHCPv4 reservations."""
        return await self._search("/api/kea/dhcpv4/search_reservation")

    async def get_leases(self) -> list[dict[str, Any]]:
        """Return Kea DHCPv4 leases."""
        return await self._search("/api/kea/leases4/search")

    async def get_rules(self) -> list[dict[str, Any]]:
        """Return filter rules."""
        return await self._search("/api/firewall/filter/search_rule", "POST")

    async def get_nat_rules(self) -> list[dict[str, Any]]:
        """Return port-forward (destination NAT) rules."""
        return await self._search("/api/firewall/d_nat/search_rule", "POST")

    async def get_aliases(self) -> list[dict[str, Any]]:
        """Return alias definitions."""
        return await self._search("/api/firewall/alias/search_item")

    async def resolve_alias(self, name: str) -> list[str]:
        """Return the resolved content of an alias (IPs, networks)."""
        data = await self._request("GET", f"/api/firewall/alias_util/list/{quote(name, safe='')}")
        rows = data.get("rows", []) if isinstance(data, dict) else []
        result = []
        for row in rows:
            if isinstance(row, dict) and row.get("ip"):
                result.append(str(row["ip"]))
            elif isinstance(row, str):
                result.append(row)
        return result

    async def get_firewall_log(self, search: str = "", rows: int = 500) -> list[dict[str, Any]]:
        """Return firewall log lines (newest first)."""
        data = await self._request(
            "POST",
            "/api/diagnostics/log/core/filter",
            form={"current": 1, "rowCount": min(rows, 5000), "searchPhrase": search},
        )
        return [r for r in data.get("rows", []) if isinstance(r, dict)] if isinstance(data, dict) else []

    async def get_resolver_log(self, search: str = "", rows: int = 500) -> list[dict[str, Any]]:
        """Return DNS resolver log lines."""
        data = await self._request(
            "POST",
            "/api/diagnostics/log/core/resolver",
            form={"current": 1, "rowCount": min(rows, 5000), "searchPhrase": search},
        )
        return [r for r in data.get("rows", []) if isinstance(r, dict)] if isinstance(data, dict) else []

    async def get_gateways(self) -> list[dict[str, Any]]:
        """Return gateway status (WAN, VPN)."""
        return await self._search("/api/routes/gateway/status")

    async def test_connection(self) -> None:
        """Validate credentials by reading the ARP table (config flow)."""
        await self.get_arp()

    async def check_privileges(self) -> list[str]:
        """Return the privileges that are missing (for the config flow)."""
        missing: list[str] = []
        probes = [
            self.get_interfaces(),
            self.get_reservations(),
            self.get_rules(),
            self.get_aliases(),
            self.get_firewall_log(rows=1),
            self.get_gateways(),
        ]
        results = await asyncio.gather(*probes, return_exceptions=True)
        for res in results:
            if isinstance(res, OPNsensePermissionError) and res.privilege not in missing:
                missing.append(res.privilege)
        return missing
