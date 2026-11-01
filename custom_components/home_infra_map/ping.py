"""ICMP and TCP probes.

icmplib is used unprivileged first (`privileged=False`, needs
`net.ipv4.ping_group_range` to include HA's group — the default on HA OS and
the official container). If the kernel refuses, a privileged socket is tried
(works when HA runs as root). If both fail the coordinator reports the
failure and the ping entities become unavailable.
"""

from __future__ import annotations

import asyncio
import contextlib
import ipaddress
import logging
import socket
from typing import Any

from icmplib import ICMPLibError, SocketPermissionError, async_multiping

from .models import JsonDict

_LOGGER = logging.getLogger(__name__)

_PRIVILEGED: bool | None = None  # learnt at first successful call


class PingUnavailableError(Exception):
    """ICMP sockets cannot be opened."""


async def _resolve(host: str) -> str | None:
    try:
        ipaddress.ip_address(host)
    except ValueError:
        pass
    else:
        return host
    try:
        infos = await asyncio.get_running_loop().getaddrinfo(host, None, family=socket.AF_INET)
    except OSError:
        return None
    return str(infos[0][4][0]) if infos else None


async def _multiping(addresses: list[str], privileged: bool) -> list[Any]:
    replies: list[Any] = await async_multiping(
        addresses, count=2, interval=0.2, timeout=2, concurrent_tasks=64, privileged=privileged
    )
    return replies


async def async_ping_hosts(hosts: list[str]) -> dict[str, JsonDict]:
    """Ping hosts (IPs or names) at once; returns host -> {alive, rtt_ms}."""
    global _PRIVILEGED  # noqa: PLW0603 - capability probed once per process
    resolved = dict(zip(hosts, await asyncio.gather(*(_resolve(h) for h in hosts)), strict=True))
    addresses = sorted({ip for ip in resolved.values() if ip})
    results: dict[str, JsonDict] = {}
    by_address: dict[str, Any] = {}
    if addresses:
        modes = [_PRIVILEGED] if _PRIVILEGED is not None else [False, True]
        last_error: Exception | None = None
        for privileged in modes:
            try:
                replies = await _multiping(addresses, privileged)
            except SocketPermissionError as err:
                last_error = err
                continue
            except (ICMPLibError, OSError) as err:
                raise PingUnavailableError(str(err)) from err
            _PRIVILEGED = privileged
            by_address = {r.address: r for r in replies}
            break
        else:
            raise PingUnavailableError(f"no ICMP socket allowed ({last_error}); see README, section 'Ping'")
    for host, ip in resolved.items():
        reply = by_address.get(ip) if ip else None
        if reply is None:
            results[host] = {"alive": False, "rtt_ms": None, "ip": ip}
        else:
            results[host] = {
                "alive": bool(reply.is_alive),
                "rtt_ms": round(float(reply.avg_rtt), 2) if reply.is_alive else None,
                "ip": ip,
            }
    return results


async def async_tcp_check(host: str, port: int, wait_s: float = 3.0) -> bool:
    """Return True if a TCP connection to host:port succeeds."""
    try:
        _reader, writer = await asyncio.wait_for(asyncio.open_connection(host, port), wait_s)
    except OSError, TimeoutError:
        return False
    writer.close()
    with contextlib.suppress(OSError):
        await writer.wait_closed()
    return True
