"""ICMP / TCP probes."""

from __future__ import annotations

from types import SimpleNamespace
from typing import Any
from unittest.mock import patch

import pytest
from icmplib import ICMPLibError, SocketPermissionError

from custom_components.home_infra_map import ping


@pytest.fixture(autouse=True)
def _reset() -> None:
    ping._PRIVILEGED = None


def _reply(address: str, alive: bool, rtt: float = 4.2) -> Any:
    return SimpleNamespace(address=address, is_alive=alive, avg_rtt=rtt)


async def test_unprivileged_then_privileged_fallback() -> None:
    calls: list[bool] = []

    async def fake(addresses: list[str], **kw: Any) -> list[Any]:
        calls.append(kw["privileged"])
        if not kw["privileged"]:
            raise SocketPermissionError(False)
        return [_reply("10.0.0.1", True), _reply("10.0.0.2", False)]

    real_resolve = ping._resolve

    async def resolve(host: str) -> str | None:
        return None if host == "unresolvable.invalid" else await real_resolve(host)

    with patch.object(ping, "async_multiping", side_effect=fake), patch.object(ping, "_resolve", resolve):
        res = await ping.async_ping_hosts(["10.0.0.1", "10.0.0.2", "unresolvable.invalid"])
    assert calls == [False, True]
    assert res["10.0.0.1"] == {"alive": True, "rtt_ms": 4.2, "ip": "10.0.0.1"}
    assert res["10.0.0.2"]["alive"] is False and res["10.0.0.2"]["rtt_ms"] is None
    assert res["unresolvable.invalid"]["alive"] is False
    assert ping._PRIVILEGED is True


async def test_no_icmp_at_all() -> None:
    async def fake(addresses: list[str], **kw: Any) -> list[Any]:
        raise SocketPermissionError(kw["privileged"])

    with patch.object(ping, "async_multiping", side_effect=fake), pytest.raises(ping.PingUnavailableError):
        await ping.async_ping_hosts(["10.0.0.1"])


async def test_icmp_error() -> None:
    with (
        patch.object(ping, "async_multiping", side_effect=ICMPLibError("boom")),
        pytest.raises(ping.PingUnavailableError),
    ):
        await ping.async_ping_hosts(["10.0.0.1"])


async def test_tcp_check() -> None:
    class Writer:
        closed = False

        def close(self) -> None:
            self.closed = True

        async def wait_closed(self) -> None:
            raise OSError("reset")

    writer = Writer()

    async def ok(host: str, port: int) -> Any:
        return None, writer

    async def refused(host: str, port: int) -> Any:
        raise ConnectionRefusedError

    with patch("asyncio.open_connection", ok):
        assert await ping.async_tcp_check("10.0.0.1", 80)
    assert writer.closed
    with patch("asyncio.open_connection", refused):
        assert not await ping.async_tcp_check("10.0.0.1", 81)


async def test_resolve_names() -> None:
    assert await ping._resolve("localhost") == "127.0.0.1"
