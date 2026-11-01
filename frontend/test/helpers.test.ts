import { describe, expect, it } from 'vitest';
import { boardStats, FeedIndex, guessKindFromRating, isOff, maxPoints, moduleTitle, moveItem, rowCapacity, rowUsed, sumPower, upstreamRcd } from '../src/helpers/electric.js';
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
    expect(boardStats(board)).toMatchObject({ rcds: 3, breakers: 18, devices: 4, spare: 1, off: 1 });
  });

  it('measures rails in DIN slots, holes included', () => {
    expect(board.modules_per_row).toBe(13);
    expect(board.rows.map((r) => rowUsed(r))).toEqual([12, 10, 13]);
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

  it('resolves feeds like the backend: RCD on the left, manual links, service entrance, sub-board', () => {
    const boards = payload.model.boards;
    const index = new FeedIndex(boards);
    const all = [...index.modules.values()];
    const byRef = (ref: string) => all.find((m) => m.ref === ref)!;
    const [meter, head] = board.supply!;
    expect([meter.kind, head.kind, head.rating_a]).toEqual(['meter', 'main_breaker', 45]);
    expect(index.feeder(byRef('T1-R1-2'))?.ref).toBe('T1-R1-ID');
    expect(index.feeder(byRef('T1-R1-ID'))).toBe(head);
    // the garage feeder is wired straight from the main breaker, not through the R3 RCD
    const feeder = byRef('T1-R3-4');
    expect(feeder.fed_by).toBe(head.id);
    expect(index.defaultFeeder(feeder)?.ref).toBe('T1-R3-ID');
    expect(index.protector(feeder)).toBe(head);
    expect(index.chain(byRef('T2-R1-1')).map((m) => m.ref)).toEqual(['T1-R3-4', 'T1-AGCP', 'T1-CPT']);
    expect(index.downstream(feeder.id).has(byRef('T2-R1-2').id)).toBe(true);
    // a module cannot be fed by something downstream of it (loop)
    expect(index.candidates(head).map((m) => m.id)).toEqual([meter.id]);
    expect(index.candidates(feeder).some((m) => m.ref === 'T2-R1-1')).toBe(false);
  });

  it('guesses a kind from the rating and knows the points limits', () => {
    expect([10, 16, 20, 32, 40, 25, null].map((r) => guessKindFromRating(r))).toEqual([
      'lighting',
      'sockets',
      'dedicated',
      'cooking',
      'feeder',
      null,
      null,
    ]);
    const m = board.rows[0].modules[1];
    expect(maxPoints({ ...m, circuit_kind: 'lighting' })).toBe(8);
    expect(maxPoints({ ...m, circuit_kind: 'sockets', rating_a: 20 })).toBe(12);
    expect(maxPoints({ ...m, circuit_kind: 'cooking' })).toBeNull();
  });

  it('knows off and spare modules', () => {
    const spare = board.rows[0].modules.find((m) => m.ref === 'T1-R1-8')!;
    expect(spare.status).toBe('spare');
    const m = { ...board.rows[0].modules[1], status: 'active' as const, switch_entity_id: 'switch.x' };
    expect(isOff(m, mockHass({ states: { 'switch.x': { state: 'off', attributes: {} } } }))).toBe(true);
    expect(isOff(m, mockHass({ states: { 'switch.x': { state: 'on', attributes: {} } } }))).toBe(false);
    expect(isOff({ ...m, status: 'off' })).toBe(true);
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
