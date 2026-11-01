/** Pure helpers for the network views (unit-tested). */
import type { Device, EntityRef, Hass, Live, Payload, Switch } from '../types.js';

export type Presence = 'online' | 'offline' | 'unknown';

export function entityOf(entities: Record<string, EntityRef[]>, ownerId: string, key: string): string | null {
  return entities[ownerId]?.find((e) => e.key === key)?.entity_id ?? null;
}

/** Presence: the HA entity first (live states), then the coordinator data. */
export function presenceOf(device: Device, payload: Payload, hass: Hass | undefined): Presence {
  const eid = entityOf(payload.entities, device.id, 'online');
  const state = eid && hass ? hass.states[eid] : undefined;
  if (state) {
    if (state.state === 'on') return 'online';
    if (state.state === 'off') return 'offline';
    return 'unknown';
  }
  const ping = payload.live.ping[device.id];
  if (!ping || ping.alive === null || ping.alive === undefined) return 'unknown';
  return ping.alive ? 'online' : 'offline';
}

export function latencyOf(device: Device, payload: Payload, hass: Hass | undefined): number | null {
  const eid = entityOf(payload.entities, device.id, 'latency');
  const state = eid && hass ? hass.states[eid] : undefined;
  if (state) {
    const v = Number(state.state);
    if (Number.isFinite(v)) return v;
  }
  return payload.live.ping[device.id]?.rtt_ms ?? null;
}

export interface PortGroup {
  port: number | null;
  devices: Device[];
}

/** Devices of a switch grouped by port; Wi-Fi clients (parent_device_id) are excluded from groups. */
export function groupByPort(devices: Device[], switchId: string): PortGroup[] {
  const groups = new Map<number, Device[]>();
  for (const d of devices) {
    if (d.switch_id !== switchId || d.port === null || d.parent_device_id) continue;
    if (!groups.has(d.port)) groups.set(d.port, []);
    groups.get(d.port)!.push(d);
  }
  return [...groups.entries()].sort((a, b) => a[0] - b[0]).map(([port, devs]) => ({ port, devices: sortDevices(devs) }));
}

const KIND_ORDER: Record<string, number> = { router: 0, switch: 1, ap: 2, server: 3, nas: 4 };

export function sortDevices(devices: Device[]): Device[] {
  return devices.slice().sort((a, b) => (KIND_ORDER[a.kind] ?? 9) - (KIND_ORDER[b.kind] ?? 9) || a.name.localeCompare(b.name));
}

export function childrenOf(devices: Device[], parentId: string): Device[] {
  return sortDevices(devices.filter((d) => d.parent_device_id === parentId));
}

/** Devices not placed under a switch port nor under a parent. */
export function unplaced(devices: Device[], switches: Switch[]): Device[] {
  const ids = new Set(switches.map((s) => s.id));
  return sortDevices(
    devices.filter((d) => !d.parent_device_id && !(d.switch_id && ids.has(d.switch_id) && d.port !== null)),
  );
}

export function ipSortKey(host: string): string {
  const parts = host.split('.');
  if (parts.length === 4 && parts.every((p) => /^\d+$/.test(p))) return parts.map((p) => p.padStart(3, '0')).join('.');
  return host;
}

export function counts(payload: Payload, hass: Hass | undefined): { online: number; offline: number } {
  let online = 0;
  let offline = 0;
  for (const d of payload.model.network.devices) {
    if (!d.monitor.ping) continue;
    const p = presenceOf(d, payload, hass);
    if (p === 'online') online += 1;
    if (p === 'offline') offline += 1;
  }
  return { online, offline };
}

export function switchLive(live: Live, switchId: string) {
  return live.switches[switchId];
}

/** Devices whose MAC is seen on a port, plus those assigned to it in the model. */
export function devicesOnPort(devices: Device[], sw: Switch, port: number, macs: string[] = []): Device[] {
  const set = new Set(macs.map((m) => m.toLowerCase()));
  return sortDevices(
    devices.filter((d) => (d.switch_id === sw.id && d.port === port) || (d.mac && set.has(d.mac.toLowerCase()))),
  );
}
