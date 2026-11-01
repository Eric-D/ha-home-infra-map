import { describe, expect, it } from 'vitest';
import { boardStats, moduleTitle, moveItem, rowCapacity, rowUsed, sumPower, upstreamRcd } from '../src/helpers/electric.js';
import { gridOptions } from '../src/helpers/grid.js';
import { childrenOf, counts, groupByPort, unplaced } from '../src/helpers/network.js';
import { parseHistory, presenceSegments, sparkPath } from '../src/helpers/sparkline.js';
import { KEYS } from '../src/i18n.js';
import { applyProbe, blankDevice } from '../src/views/network-edit.js';
import type { Row } from '../src/types.js';
import { mockHass, payload } from './fixture.js';

const board = payload.model.boards[0];

describe('electric helpers', () => {
  it('counts the example board like the brief', () => {
    // demo data: docs/examples/tableau-largeurs.yaml (brief counts + a terminal block)
    // demo data: tests/fixtures/electricite.yaml (fictional), main board
    expect(board.rows).toHaveLength(3);
    expect(boardStats(board)).toMatchObject({ rcds: 3, breakers: 17, devices: 4 });
  });

  it('measures rails in DIN slots, holes included', () => {
    expect(board.modules_per_row).toBe(13);
    expect(board.rows.map((r) => rowUsed(r))).toEqual([12, 10, 12]);
    expect(rowCapacity(board, board.rows[0])).toBe(13);
    expect(rowCapacity(board, { ...board.rows[0], capacity: 12 })).toBe(12);
    expect(rowCapacity({ ...board, modules_per_row: null }, board.rows[0])).toBeNull();
  });

  it('finds the upstream RCD: last RCD to the left on the same row', () => {
    const r1 = board.rows[0];
    const washer = r1.modules.find((m) => m.ref === 'T1-R1-7')!;
    expect(upstreamRcd(r1, washer.id)?.ref).toBe('T1-R1-ID');
    const row: Row = {
      id: 'r',
      label: 'R',
      modules: [
        { ...washer, id: 'b0', kind: 'breaker' },
        { ...r1.modules[0], id: 'rcd1', kind: 'rcd' },
        { ...washer, id: 'b1' },
        { ...washer, id: 'rcbo', kind: 'rcbo' },
      ],
    };
    expect(upstreamRcd(row, 'b0')).toBeNull();
    expect(upstreamRcd(row, 'b1')?.id).toBe('rcd1');
    expect(upstreamRcd(row, 'rcbo')?.id).toBe('rcbo');
  });

  it('sums power, ignoring unavailable sensors and converting kW', () => {
    const hass = mockHass({
      states: {
        'sensor.a': { state: '100', attributes: { unit_of_measurement: 'W' } },
        'sensor.b': { state: 'unavailable', attributes: {} },
        'sensor.c': { state: '0.5', attributes: { unit_of_measurement: 'kW' } },
        'sensor.d': { state: 'abc', attributes: {} },
      },
    });
    expect(sumPower(hass, ['sensor.a', 'sensor.b', 'sensor.c', 'sensor.d', 'sensor.a', null])).toBe(600);
    expect(sumPower(hass, ['sensor.b'])).toBeNull();
  });

  it('formats module titles', () => {
    const m = board.rows[0].modules;
    expect(moduleTitle(m[0])).toBe('40A');
    expect(moduleTitle(m[1])).toBe('C10');
    const device = { ...m[1], kind: 'device' as const, model: 'Shelly Pro 4PM', label: 'Shelly Pro 4PM (écran)' };
    expect(moduleTitle(device)).toBe('Pro 4PM');
    expect(moduleTitle({ ...device, model: '? (à confirmer)', label: 'Shelly (module de mesure, 2 voies)' })).toBe('Shelly');
    expect(moduleTitle({ ...device, model: null, label: 'Shelly 10/100 LAN Switch' })).toBe('Shelly');
    expect(moduleTitle({ ...device, model: null, label: 'Prise DIN 2P+T 16A' })).toBe('Prise');
  });

  it('moves items', () => {
    expect(moveItem([1, 2, 3], 0, 2)).toEqual([2, 3, 1]);
    expect(moveItem([1, 2, 3], 2, -5)).toEqual([3, 1, 2]);
  });
});

describe('network helpers', () => {
  const net = payload.model.network;
  const sw = net.switches[0];

  it('groups devices by switch port and keeps Wi-Fi clients under their AP', () => {
    const groups = groupByPort(net.devices, sw.id);
    const port8 = groups.find((g) => g.port === 8)!;
    expect(port8.devices.map((d) => d.name)).toEqual(["Point d'accès salon"]);
    expect(childrenOf(net.devices, port8.devices[0].id)).toHaveLength(5);
    const port9 = groups.find((g) => g.port === 9)!;
    expect(port9.devices.map((d) => d.name)).toEqual(["Point d'accès étage"]);
    const ap = port9.devices[0];
    expect(childrenOf(net.devices, ap.id).map((d) => d.host)).toEqual(['192.168.30.40']);
    expect(groups.map((g) => g.port)).toEqual([...groups.map((g) => g.port)].sort((a, b) => a! - b!));
  });

  it('lists unplaced devices', () => {
    const hosts = unplaced(net.devices, net.switches).map((d) => d.host);
    expect(hosts).toContain('192.168.30.12');
    expect(hosts).not.toContain('192.168.30.40');
  });

  it('counts online / offline devices from entity states', () => {
    expect(counts(payload, mockHass())).toEqual({ online: 16, offline: 2 });
  });

  it('applies a probe without overriding a manual port', () => {
    const device = { ...blankDevice(), port_source: 'manual' as const, port: 5 };
    const res = {
      host: '192.168.30.40',
      ping: { alive: true, rtt_ms: 4 },
      vlan: { vlan_id: 'v1', name: 'Objets', subnet: '192.168.30.0/24', source: 'model' },
      mac: { value: 'aa:bb:cc:dd:ee:ff', source: 'arp' },
      port: { port: 9, shared: true, via_uplink: false, via: 'AP', switch_id: 's', switch_name: 'S', via_device_id: 'ap' },
    };
    expect(applyProbe(device, res)).toMatchObject({ vlan_id: 'v1', mac: 'aa:bb:cc:dd:ee:ff', port: 5 });
    expect(applyProbe(blankDevice(), res)).toMatchObject({ port: 9, switch_id: 's', parent_device_id: 'ap' });
  });
});

describe('sparkline', () => {
  it('parses minimal history and builds a path', () => {
    const pts = parseHistory([{ s: '10', lu: 1000 }, { s: 'unavailable', lu: 1500 }, { s: '20', lu: 2000 }]);
    expect(pts).toEqual([
      { t: 1_000_000, v: 10 },
      { t: 2_000_000, v: 20 },
    ]);
    const { line, area } = sparkPath(pts, 1_000_000, 3_000_000);
    expect(line.startsWith('M0.0 ')).toBe(true);
    expect(area.endsWith('Z')).toBe(true);
    expect(sparkPath([], 0, 1).line).toBe('');
  });

  it('builds presence segments', () => {
    const segs = presenceSegments([{ s: 'on', lu: 0 }, { s: 'off', lu: 10 }], 0, 20_000);
    expect(segs).toEqual([
      { from: 0, to: 10_000, on: true },
      { from: 10_000, to: 20_000, on: false },
    ]);
  });
});

describe('card contract', () => {
  it('announces rows: auto, never a number', () => {
    expect(gridOptions().rows).toBe('auto');
  });

  it('has the same translation keys in French and English', () => {
    expect([...KEYS.en].sort()).toEqual([...KEYS.fr].sort());
  });
});
