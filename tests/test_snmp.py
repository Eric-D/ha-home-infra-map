"""SNMP snapshot parsing and client (pysnmp mocked)."""

from __future__ import annotations

from types import SimpleNamespace
from typing import Any

import pytest

from custom_components.home_infra_map import snmp
from custom_components.home_infra_map.snmp import (
    OID_BASE_PORT_IFINDEX,
    OID_IF_HIGH_SPEED,
    OID_IF_NAME,
    OID_IF_OPER,
    OID_LLDP_REM_PORTID,
    OID_LLDP_REM_SYSNAME,
    OID_POE_PORT_DETECTION,
    OID_PVID,
    OID_Q_FDB_PORT,
    OID_VLAN_EGRESS,
    OID_VLAN_UNTAGGED,
    SnmpClient,
    SnmpError,
    SnmpWalks,
    build_snapshot,
    locate_mac,
)

ROUTER = (2, 0, 0x5E, 0x10, 0x00, 0x01)
STATION = (2, 0, 0x5E, 0x30, 0x00, 0x40)
CAMERA = (2, 0, 0x5E, 0x30, 0x00, 0x10)


def o(base: str, *idx: int) -> tuple[int, ...]:
    return tuple(int(x) for x in base.split(".")) + idx


def walks() -> SnmpWalks:
    ports = [3, 22, 25]
    return SnmpWalks(
        sys_name="SW-DEMO",
        base_port_ifindex=[(o(OID_BASE_PORT_IFINDEX, p), 1000000 + p) for p in ports],
        fdb=[
            (o(OID_Q_FDB_PORT, 2, *STATION), 22),
            (o(OID_Q_FDB_PORT, 10, *STATION), 25),
            (o(OID_Q_FDB_PORT, 1, *ROUTER), 25),
            (o(OID_Q_FDB_PORT, 2, *CAMERA), 3),
            (o(OID_Q_FDB_PORT, 1, 2, 0, 0, 0, 0, 1), 0),
        ],
        fdb_is_q_bridge=True,
        if_name=[(o(OID_IF_NAME, 1000000 + p), f"GigabitEthernet 1/{p}".encode()) for p in ports],
        if_alias=[],
        if_oper=[(o(OID_IF_OPER, 1000003), 1), (o(OID_IF_OPER, 1000022), 1), (o(OID_IF_OPER, 1000025), 2)],
        if_speed=[(o(OID_IF_HIGH_SPEED, 1000022), 1000), (o(OID_IF_HIGH_SPEED, 1000025), 0)],
        pvid=[(o(OID_PVID, 22), 20)],
        vlan_egress=[(o(OID_VLAN_EGRESS, 2), bytes([0, 0, 0b00000100, 0b10000000]))],
        vlan_untagged=[(o(OID_VLAN_UNTAGGED, 20), bytes([0, 0, 0b00000100, 0]))],
        lldp_sysname=[(o(OID_LLDP_REM_SYSNAME, 0, 1000022, 1), b"AP-Etage")],
        lldp_portid=[(o(OID_LLDP_REM_PORTID, 0, 22, 1), bytes([0xAA, 0xBB, 0xCC, 0x01, 0x02, 0x03]))],
        poe=[(o(OID_POE_PORT_DETECTION, 1, 22), 3), (o(OID_POE_PORT_DETECTION, 1, 3), 2)],
    )


def test_build_snapshot() -> None:
    snap = build_snapshot(walks())
    p22 = snap["ports"]["22"]
    assert p22["name"] == "GigabitEthernet 1/22" and p22["up"] is True and p22["speed_mbps"] == 1000
    assert p22["pvid"] == 20 and p22["poe"] is True
    assert p22["tagged_vlans"] == [2] and p22["untagged_vlans"] == [20]
    assert p22["lldp"] == {"sys_name": "AP-Etage", "port_id": "aa:bb:cc:01:02:03"}
    assert snap["ports"]["25"]["up"] is False and snap["ports"]["25"]["speed_mbps"] is None
    assert snap["mac_ports"]["02:00:5e:30:00:40"] == [22, 25]
    assert snap["ports"]["3"]["poe"] is False


def test_locate_mac_prefers_access_port() -> None:
    snap = build_snapshot(walks())
    found = locate_mac(snap, "02:00:5e:30:00:40", ["02:00:5e:10:00:01"])
    assert found == {"port": 22, "shared": False, "via_uplink": False, "via": "AP-Etage"}
    assert locate_mac(snap, "02:00:00:00:00:99") is None
    router = locate_mac(snap, "02:00:5e:10:00:01", ["02:00:5e:10:00:01"])
    assert router is not None and router["port"] == 25


def test_locate_mac_crowded_port() -> None:
    snap = {
        "ports": {"5": {"macs": [f"m{i}" for i in range(12)]}, "6": {"macs": ["x", "y"]}},
        "mac_ports": {"x": [5, 6]},
    }
    assert locate_mac(snap, "x", threshold=8)["port"] == 6  # type: ignore[index]


class _Val:
    def __init__(self, v: Any) -> None:
        self.v = v

    def prettyPrint(self) -> str:
        return "err"


class FakeMod:
    """Minimal stand-in for pysnmp.hlapi.v3arch.asyncio."""

    def __init__(self, table: dict[str, list[tuple[tuple[int, ...], Any]]], fail: bool = False) -> None:
        self.table = table
        self.fail = fail
        self.auth: Any = None
        for name in (
            "usmNoAuthProtocol",
            "usmHMACMD5AuthProtocol",
            "usmHMACSHAAuthProtocol",
            "usmNoPrivProtocol",
            "usmDESPrivProtocol",
            "usmAesCfb128Protocol",
        ):
            setattr(self, name, name)

    def UsmUserData(self, user: str, **kw: Any) -> Any:
        self.auth = ("usm", user, kw)
        return self.auth

    def CommunityData(self, community: str, mpModel: int) -> Any:  # noqa: N803
        self.auth = ("community", community, mpModel)
        return self.auth

    class UdpTransportTarget:
        @staticmethod
        async def create(addr: tuple[str, int], timeout: int, retries: int) -> Any:
            if addr[0] == "bad.host":
                raise OSError("dns")
            return addr

    def ContextData(self) -> Any:
        return "ctx"

    def ObjectType(self, oid: Any) -> Any:
        return oid

    def ObjectIdentity(self, oid: str) -> Any:
        return oid

    async def get_cmd(self, engine: Any, auth: Any, target: Any, ctx: Any, oid: str) -> Any:
        if self.fail:
            return ("timeout", None, None, [])
        return (None, None, None, [(oid, b"SW-DEMO")])

    async def bulk_walk_cmd(
        self, engine: Any, auth: Any, target: Any, ctx: Any, nr: int, mr: int, oid: str, **kw: Any
    ) -> Any:
        if oid == "1.9.9":
            yield (None, _Val(1), None, [])
            return
        for name, value in self.table.get(oid, []):
            yield (None, None, None, [(name, value)])


@pytest.fixture
def fake_pysnmp(monkeypatch: pytest.MonkeyPatch) -> FakeMod:
    w = walks()
    table = {
        snmp.OID_BASE_PORT_IFINDEX: w.base_port_ifindex,
        snmp.OID_Q_FDB_PORT: w.fdb,
        snmp.OID_IF_DESCR: [(o(snmp.OID_IF_DESCR, 1000022), b"Gi 1/22")],
        snmp.OID_IF_OPER: w.if_oper,
        snmp.OID_LLDP_REM_SYSNAME: w.lldp_sysname,
    }
    mod = FakeMod(table)
    monkeypatch.setattr(snmp, "_PYSNMP", SimpleNamespace(mod=mod, engine="engine"))
    return mod


async def _executor(func: Any, *args: Any) -> Any:
    return func(*args)


async def test_client_v3_snapshot(fake_pysnmp: FakeMod) -> None:
    client = SnmpClient(
        {
            "host": "sw",
            "version": "v3",
            "username": "Ha",
            "auth_protocol": "md5",
            "auth_key": "12345678",
            "priv_protocol": "des",
            "priv_key": "abcdefgh",
        },
        _executor,
    )
    snap = await client.snapshot()
    assert snap["sys_name"] == "SW-DEMO"
    assert snap["ports"]["22"]["name"] == "Gi 1/22"  # ifName missing -> ifDescr
    assert fake_pysnmp.auth[0] == "usm" and fake_pysnmp.auth[2]["authProtocol"] == "usmHMACMD5AuthProtocol"
    assert await client.walk("1.9.9") == []


async def test_client_v2c_and_errors(fake_pysnmp: FakeMod) -> None:
    client = SnmpClient({"host": "sw", "version": "v2c", "community": "public"}, _executor)
    assert await client.get_sys_name() == "SW-DEMO"
    assert fake_pysnmp.auth == ("community", "public", 1)
    fake_pysnmp.fail = True
    with pytest.raises(SnmpError):
        await client.get_sys_name()
    with pytest.raises(SnmpError):
        await SnmpClient({"host": "bad.host"}, _executor).get_sys_name()


async def test_pysnmp_loaded_once_in_executor(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(snmp, "_PYSNMP", None)
    calls: list[Any] = []

    async def executor(func: Any) -> Any:
        calls.append(func)
        return "loaded"

    assert await snmp._get_pysnmp(executor) == "loaded"
    monkeypatch.setattr(snmp, "_PYSNMP", "loaded")
    assert await snmp._get_pysnmp(executor) == "loaded"
    assert calls == [snmp._Pysnmp]


def test_real_pysnmp_import() -> None:
    loaded = snmp._Pysnmp()
    assert hasattr(loaded.mod, "bulk_walk_cmd") and loaded.engine is not None
    assert not hasattr(snmp.SnmpClient, "set")
