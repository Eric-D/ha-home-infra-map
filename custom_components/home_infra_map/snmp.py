"""Read-only SNMP client for switches (pysnmp >= 7, asyncio).

Only GET / GETBULK walks are issued; the module never imports or calls any
SET primitive. pysnmp is imported, and its engine created, in the executor:
both read MIB files from disk, which Home Assistant reports as blocking I/O
in the event loop.
"""

from __future__ import annotations

import asyncio
import importlib
import logging
from collections.abc import Iterable
from dataclasses import dataclass
from typing import Any, Final

from .const import (
    CONF_AUTH_KEY,
    CONF_AUTH_PROTOCOL,
    CONF_COMMUNITY,
    CONF_HOST,
    CONF_PORT,
    CONF_PRIV_KEY,
    CONF_PRIV_PROTOCOL,
    CONF_SNMP_VERSION,
    CONF_USERNAME,
)
from .models import JsonDict

_LOGGER = logging.getLogger(__name__)

OID_SYS_NAME: Final = "1.3.6.1.2.1.1.5.0"
OID_SYS_UPTIME: Final = "1.3.6.1.2.1.1.3.0"
OID_BASE_PORT_IFINDEX: Final = "1.3.6.1.2.1.17.1.4.1.2"
OID_Q_FDB_PORT: Final = "1.3.6.1.2.1.17.7.1.2.2.1.2"
OID_FDB_PORT: Final = "1.3.6.1.2.1.17.4.3.1.2"
OID_IF_NAME: Final = "1.3.6.1.2.1.31.1.1.1.1"
OID_IF_DESCR: Final = "1.3.6.1.2.1.2.2.1.2"
OID_IF_ALIAS: Final = "1.3.6.1.2.1.31.1.1.1.18"
OID_IF_OPER: Final = "1.3.6.1.2.1.2.2.1.8"
OID_IF_HIGH_SPEED: Final = "1.3.6.1.2.1.31.1.1.1.15"
OID_PVID: Final = "1.3.6.1.2.1.17.7.1.4.5.1.1"
OID_VLAN_EGRESS: Final = "1.3.6.1.2.1.17.7.1.4.3.1.2"
OID_VLAN_UNTAGGED: Final = "1.3.6.1.2.1.17.7.1.4.3.1.4"
OID_LLDP_REM_SYSNAME: Final = "1.0.8802.1.1.2.1.4.1.1.9"
OID_LLDP_REM_PORTID: Final = "1.0.8802.1.1.2.1.4.1.1.7"
OID_POE_PORT_DETECTION: Final = "1.3.6.1.2.1.105.1.1.1.6"
OID_POE_MAIN_POWER: Final = "1.3.6.1.2.1.105.1.3.1.1.4"

_AUTH_PROTOCOLS: Final = {
    "none": "usmNoAuthProtocol",
    "md5": "usmHMACMD5AuthProtocol",
    "sha": "usmHMACSHAAuthProtocol",
    "sha224": "usmHMAC128SHA224AuthProtocol",
    "sha256": "usmHMAC192SHA256AuthProtocol",
    "sha384": "usmHMAC256SHA384AuthProtocol",
    "sha512": "usmHMAC384SHA512AuthProtocol",
}
_PRIV_PROTOCOLS: Final = {
    "none": "usmNoPrivProtocol",
    "des": "usmDESPrivProtocol",
    "3des": "usm3DESEDEPrivProtocol",
    "aes": "usmAesCfb128Protocol",
    "aes192": "usmAesCfb192Protocol",
    "aes256": "usmAesCfb256Protocol",
}

type Oid = tuple[int, ...]
type VarBinds = list[tuple[Oid, Any]]


class SnmpError(Exception):
    """SNMP failure (timeout, auth, ...)."""


def _oid(text: str) -> Oid:
    return tuple(int(x) for x in text.split("."))


def _suffix(oid: Oid, base: str) -> Oid:
    return oid[len(_oid(base)) :]


def _to_python(value: Any) -> Any:
    """Convert a pysnmp value to int / bytes / str."""
    if isinstance(value, (int, str, bytes)):
        return value
    cls = type(value).__name__
    if cls in ("Integer", "Integer32", "Gauge32", "Counter32", "Counter64", "Unsigned32", "TimeTicks"):
        return int(value)
    if hasattr(value, "asOctets"):
        return bytes(value.asOctets())
    return str(value)


def _text(value: Any) -> str:
    if isinstance(value, bytes):
        return value.decode("utf-8", errors="replace").strip("\x00 ").strip()
    return str(value).strip()


def _bitmap_ports(value: Any) -> set[int]:
    data = value if isinstance(value, bytes) else bytes(str(value), "latin-1")
    ports: set[int] = set()
    for byte_index, byte in enumerate(data):
        for bit in range(8):
            if byte & (0x80 >> bit):
                ports.add(byte_index * 8 + bit + 1)
    return ports


def mac_from_index(index: Iterable[int]) -> str:
    """Return a MAC from the 6 decimal octets of an FDB index."""
    return ":".join(f"{b:02x}" for b in index)


@dataclass
class SnmpWalks:
    """Raw walk results needed to build a switch snapshot."""

    sys_name: str
    base_port_ifindex: VarBinds
    fdb: VarBinds
    fdb_is_q_bridge: bool
    if_name: VarBinds
    if_alias: VarBinds
    if_oper: VarBinds
    if_speed: VarBinds
    pvid: VarBinds
    vlan_egress: VarBinds
    vlan_untagged: VarBinds
    lldp_sysname: VarBinds
    lldp_portid: VarBinds
    poe: VarBinds


def build_snapshot(walks: SnmpWalks) -> JsonDict:
    """Turn raw walks into a per-port structure (pure, unit-tested).

    Port numbers are *bridge* port numbers (dot1dBasePort), which match the
    front-panel numbering on mainstream switches; ifIndex is only used to
    join interface tables (some firmwares use 1000000+n, it is not universal).
    """
    port_ifindex: dict[int, int] = {}
    for oid, val in walks.base_port_ifindex:
        port_ifindex[_suffix(oid, OID_BASE_PORT_IFINDEX)[0]] = int(_to_python(val))
    ifindex_port = {v: k for k, v in port_ifindex.items()}

    def by_ifindex(binds: VarBinds, base: str) -> dict[int, Any]:
        return {_suffix(o, base)[0]: _to_python(v) for o, v in binds}

    names = by_ifindex(walks.if_name, OID_IF_NAME)
    aliases = by_ifindex(walks.if_alias, OID_IF_ALIAS)
    opers = by_ifindex(walks.if_oper, OID_IF_OPER)
    speeds = by_ifindex(walks.if_speed, OID_IF_HIGH_SPEED)
    pvids = {_suffix(o, OID_PVID)[0]: int(_to_python(v)) for o, v in walks.pvid}

    egress = {_suffix(o, OID_VLAN_EGRESS)[0]: _bitmap_ports(_to_python(v)) for o, v in walks.vlan_egress}
    untagged = {
        _suffix(o, OID_VLAN_UNTAGGED)[0]: _bitmap_ports(_to_python(v)) for o, v in walks.vlan_untagged
    }

    macs: dict[int, list[str]] = {}
    mac_ports: dict[str, list[int]] = {}
    for oid, val in walks.fdb:
        suffix = _suffix(oid, OID_Q_FDB_PORT if walks.fdb_is_q_bridge else OID_FDB_PORT)
        mac = mac_from_index(suffix[-6:])
        port = int(_to_python(val))
        if port == 0:  # the switch itself
            continue
        macs.setdefault(port, [])
        if mac not in macs[port]:
            macs[port].append(mac)
        mac_ports.setdefault(mac, [])
        if port not in mac_ports[mac]:
            mac_ports[mac].append(port)

    def local_port(num: int) -> int:
        # lldpRemLocalPortNum is usually the bridge port, sometimes the ifIndex
        if num in port_ifindex:
            return num
        return ifindex_port.get(num, num)

    lldp: dict[int, JsonDict] = {}
    for oid, val in walks.lldp_sysname:
        idx = _suffix(oid, OID_LLDP_REM_SYSNAME)
        if len(idx) >= 2:
            lldp.setdefault(local_port(idx[1]), {})["sys_name"] = _text(_to_python(val))
    for oid, val in walks.lldp_portid:
        idx = _suffix(oid, OID_LLDP_REM_PORTID)
        if len(idx) >= 2:
            raw = _to_python(val)
            text = _text(raw)
            if isinstance(raw, bytes) and len(raw) == 6 and not text.isprintable():
                text = mac_from_index(raw)
            lldp.setdefault(local_port(idx[1]), {})["port_id"] = text

    poe: dict[int, bool] = {}
    for oid, val in walks.poe:
        idx = _suffix(oid, OID_POE_PORT_DETECTION)
        if len(idx) >= 2:
            poe[idx[-1]] = int(_to_python(val)) == 3  # deliveringPower

    ports: dict[str, JsonDict] = {}
    all_ports = sorted(set(port_ifindex) | set(macs))
    for port in all_ports:
        ifindex = port_ifindex.get(port)
        tagged = sorted(
            v for v, members in egress.items() if port in members and port not in untagged.get(v, set())
        )
        untag = sorted(v for v, members in untagged.items() if port in members)
        oper = opers.get(ifindex) if ifindex is not None else None
        ports[str(port)] = {
            "port": port,
            "if_index": ifindex,
            "name": _text(names.get(ifindex, "")) if ifindex is not None else "",
            "alias": _text(aliases.get(ifindex, "")) if ifindex is not None else "",
            "up": None if oper is None else int(oper) == 1,
            "speed_mbps": int(speeds[ifindex]) if ifindex in speeds and int(speeds[ifindex]) > 0 else None,
            "pvid": pvids.get(port),
            "tagged_vlans": tagged,
            "untagged_vlans": untag,
            "lldp": lldp.get(port),
            "poe": poe.get(port),
            "macs": macs.get(port, []),
        }
    return {"sys_name": walks.sys_name, "ports": ports, "mac_ports": mac_ports}


class _Pysnmp:
    """Lazily imported pysnmp module + engine (created in the executor)."""

    def __init__(self) -> None:
        self.mod = importlib.import_module("pysnmp.hlapi.v3arch.asyncio")
        self.engine = self.mod.SnmpEngine()


_PYSNMP: _Pysnmp | None = None
_PYSNMP_LOCK = asyncio.Lock()


async def _get_pysnmp(executor: Any) -> _Pysnmp:
    global _PYSNMP  # noqa: PLW0603 - module-level cache of a heavy, blocking import
    async with _PYSNMP_LOCK:
        if _PYSNMP is None:
            _PYSNMP = await executor(_Pysnmp)
        return _PYSNMP


class SnmpClient:
    """GET/WALK-only SNMP client for one switch."""

    def __init__(self, source: JsonDict, executor: Any) -> None:
        """`executor` is hass.async_add_executor_job (injected for tests)."""
        self._source = source
        self._executor = executor
        self.host: str = source[CONF_HOST]

    async def _context(self) -> tuple[Any, Any, Any, Any]:
        snmp = await _get_pysnmp(self._executor)
        mod = snmp.mod
        src = self._source
        if src.get(CONF_SNMP_VERSION, "v2c") == "v3":
            auth_proto = src.get(CONF_AUTH_PROTOCOL) or "none"
            priv_proto = src.get(CONF_PRIV_PROTOCOL) or "none"
            auth = mod.UsmUserData(
                src.get(CONF_USERNAME, ""),
                authKey=src.get(CONF_AUTH_KEY) or None if auth_proto != "none" else None,
                privKey=src.get(CONF_PRIV_KEY) or None if priv_proto != "none" else None,
                authProtocol=getattr(mod, _AUTH_PROTOCOLS[auth_proto]),
                privProtocol=getattr(mod, _PRIV_PROTOCOLS[priv_proto]),
            )
        else:
            auth = mod.CommunityData(src.get(CONF_COMMUNITY, "public"), mpModel=1)
        try:
            target = await mod.UdpTransportTarget.create(
                (self.host, int(src.get(CONF_PORT, 161))), timeout=3, retries=1
            )
        except Exception as err:
            raise SnmpError(f"cannot resolve {self.host}") from err
        return snmp, auth, target, mod.ContextData()

    async def get(self, oid: str) -> Any:
        """GET one OID."""
        snmp, auth, target, ctx = await self._context()
        mod = snmp.mod
        err_ind, err_stat, _idx, binds = await mod.get_cmd(
            snmp.engine, auth, target, ctx, mod.ObjectType(mod.ObjectIdentity(oid))
        )
        if err_ind:
            raise SnmpError(str(err_ind))
        if err_stat:
            raise SnmpError(err_stat.prettyPrint())
        return _to_python(binds[0][1])

    async def walk(self, oid: str) -> VarBinds:
        """Walk a subtree with GETBULK; missing subtree -> empty list."""
        snmp, auth, target, ctx = await self._context()
        mod = snmp.mod
        result: VarBinds = []
        async for err_ind, err_stat, _idx, binds in mod.bulk_walk_cmd(
            snmp.engine,
            auth,
            target,
            ctx,
            0,
            25,
            mod.ObjectType(mod.ObjectIdentity(oid)),
            lexicographicMode=False,
        ):
            if err_ind:
                raise SnmpError(str(err_ind))
            if err_stat:
                break
            for name, value in binds:
                if type(value).__name__ in ("NoSuchObject", "NoSuchInstance", "EndOfMibView"):
                    continue
                result.append((tuple(name), value))
        return result

    async def get_sys_name(self) -> str:
        """Return sysName (connection test)."""
        return _text(await self.get(OID_SYS_NAME))

    async def snapshot(self) -> JsonDict:
        """Read everything needed for ports, MAC table and LLDP."""
        sys_name = await self.get_sys_name()
        fdb = await self.walk(OID_Q_FDB_PORT)
        q_bridge = bool(fdb)
        if not fdb:
            fdb = await self.walk(OID_FDB_PORT)
        walks = SnmpWalks(
            sys_name=sys_name,
            base_port_ifindex=await self.walk(OID_BASE_PORT_IFINDEX),
            fdb=fdb,
            fdb_is_q_bridge=q_bridge,
            if_name=await self.walk(OID_IF_NAME),
            if_alias=await self.walk(OID_IF_ALIAS),
            if_oper=await self.walk(OID_IF_OPER),
            if_speed=await self.walk(OID_IF_HIGH_SPEED),
            pvid=await self.walk(OID_PVID),
            vlan_egress=await self.walk(OID_VLAN_EGRESS),
            vlan_untagged=await self.walk(OID_VLAN_UNTAGGED),
            lldp_sysname=await self.walk(OID_LLDP_REM_SYSNAME),
            lldp_portid=await self.walk(OID_LLDP_REM_PORTID),
            poe=await self.walk(OID_POE_PORT_DETECTION),
        )
        if not walks.if_name:
            walks.if_name = [
                (_oid(OID_IF_NAME) + o[len(_oid(OID_IF_DESCR)) :], v)
                for o, v in await self.walk(OID_IF_DESCR)
            ]
        return build_snapshot(walks)


def locate_mac(
    snapshot: JsonDict,
    mac: str,
    router_macs: Iterable[str] = (),
    threshold: int = 8,
) -> JsonDict | None:
    """Find the access port of a MAC.

    A MAC is seen on every port on its path: prefer a port that is not an
    uplink (router MAC seen there, or more than `threshold` MACs). When only
    crowded ports remain, return the least crowded with `via_uplink=True`.
    """
    ports = snapshot.get("mac_ports", {}).get(mac.lower())
    if not ports:
        return None
    router = {m.lower() for m in router_macs}
    candidates = []
    for port in ports:
        info = snapshot["ports"].get(str(port), {})
        port_macs = info.get("macs", [])
        is_uplink = bool(router & set(port_macs)) and mac.lower() not in router
        crowded = len(port_macs) > threshold
        candidates.append((is_uplink, crowded, len(port_macs), port, info))
    candidates.sort(key=lambda c: (c[0], c[1], c[2], c[3]))
    is_uplink, crowded, _count, port, info = candidates[0]
    lldp = info.get("lldp") or {}
    return {
        "port": port,
        "shared": crowded or len(info.get("macs", [])) > 1,
        "via_uplink": is_uplink,
        "via": lldp.get("sys_name"),
    }
