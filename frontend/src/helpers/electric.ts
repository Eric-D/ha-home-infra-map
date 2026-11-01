/** Pure helpers for electrical boards (unit-tested). */
import type { Board, Check, Hass, Module, Row } from '../types.js';

/** RCD protecting a module: the last RCD to its left on the same row (an RCBO protects itself). */
export function upstreamRcd(row: Row, moduleId: string): Module | null {
  let current: Module | null = null;
  for (const module of row.modules) {
    if (module.id === moduleId) return module.kind === 'rcbo' ? module : current;
    if (module.kind === 'rcd') current = module;
  }
  return null;
}

export function isUnidentified(module: Module): boolean {
  if (module.kind !== 'breaker' && module.kind !== 'rcbo') return false;
  const name = (module.circuit_name ?? '').trim();
  return name === '' || name === '?';
}

/** Live power in W of an entity, or null when unavailable / not numeric. */
export function powerOf(hass: Hass | undefined, entityId: string | null | undefined): number | null {
  if (!hass || !entityId) return null;
  const state = hass.states[entityId];
  if (!state || state.state === 'unavailable' || state.state === 'unknown' || state.state === '') return null;
  const value = Number(state.state);
  if (!Number.isFinite(value)) return null;
  const unit = state.attributes?.unit_of_measurement;
  if (unit === 'kW') return value * 1000;
  if (unit === 'mW') return value / 1000;
  return value;
}

/** Sum of the distinct linked power sensors; unavailable ones are ignored. */
export function sumPower(hass: Hass | undefined, entityIds: (string | null | undefined)[]): number | null {
  const seen = new Set<string>();
  let total = 0;
  let counted = 0;
  for (const id of entityIds) {
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const value = powerOf(hass, id);
    if (value === null) continue;
    total += value;
    counted += 1;
  }
  return counted ? total : null;
}

export function boardPowerEntities(board: Board): string[] {
  return board.rows.flatMap((r) => r.modules.map((m) => m.power_entity_id).filter((e): e is string => !!e));
}

export function boardStats(board: Board): { rcds: number; breakers: number; devices: number; unidentified: number } {
  let rcds = 0;
  let breakers = 0;
  let devices = 0;
  let unidentified = 0;
  for (const row of board.rows) {
    for (const m of row.modules) {
      if (m.kind === 'rcd') rcds += 1;
      if (m.kind === 'breaker' || m.kind === 'rcbo') breakers += 1;
      if (m.kind === 'device') devices += 1;
      if (isUnidentified(m)) unidentified += 1;
    }
  }
  return { rcds, breakers, devices, unidentified };
}

export function checksFor(checks: Check[], moduleId: string): Check[] {
  return checks.filter((c) => c.module_id === moduleId);
}

/** "C10", "40A", device label… shown in bold on the module. */
export function moduleTitle(module: Module): string {
  switch (module.kind) {
    case 'rcd':
      return module.rating_a ? `${module.rating_a}A` : 'ID';
    case 'breaker':
    case 'rcbo':
      return module.rating_a ? `${module.curve !== '?' ? module.curve : ''}${module.rating_a}` : '?';
    case 'device': {
      // Short title like the mockup ("Pro 4PM"). A known model
      // loses its brand prefix; a free label keeps its first word only
      // (the full text is shown below the title).
      const model = module.model && !module.model.trim().startsWith('?') ? module.model.trim() : '';
      if (model) return model.replace(/^shelly\s+/i, '') || model;
      const label = (module.label || '?').replace(/\s*\(.*$/, '').trim();
      return label.split(/\s+/)[0] || '?';
    }
    default:
      return '';
  }
}

export function formatWatts(value: number | null, lang: string): string {
  if (value === null) return '—';
  return `${new Intl.NumberFormat(lang, { maximumFractionDigits: 0 }).format(Math.round(value))} W`;
}

/** Short form for a single DIN slot: "42 W", "1,1 kW". */
export function formatWattsCompact(value: number | null, lang: string): string {
  if (value === null) return '—';
  if (Math.abs(value) < 1000) return formatWatts(value, lang);
  return `${new Intl.NumberFormat(lang, { maximumFractionDigits: 1 }).format(value / 1000)} kW`;
}

export function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function newId(): string {
  const bytes = new Uint8Array(16);
  (globalThis.crypto ?? { getRandomValues: (b: Uint8Array) => b.map(() => Math.floor(Math.random() * 256)) }).getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function blankModule(kind: Module['kind'], ref: string): Module {
  return {
    id: newId(),
    kind,
    ref,
    width_modules: kind === 'rcd' ? 2 : 1,
    model: null,
    notes: null,
    rating_a: kind === 'rcd' ? 40 : kind === 'breaker' || kind === 'rcbo' ? 16 : null,
    curve: 'C',
    sensitivity_ma: kind === 'rcd' || kind === 'rcbo' ? 30 : null,
    rcd_type: kind === 'rcd' || kind === 'rcbo' ? 'A' : '?',
    cable_mm2: null,
    circuit_name: '?',
    circuit_kind: 'unknown',
    area_ids: [],
    power_entity_id: null,
    energy_entity_id: null,
    switch_entity_id: null,
    label: kind === 'device' ? '?' : '',
    entity_ids: [],
  };
}

/** Move an item inside an array (returns a new array). */
export function moveItem<T>(items: T[], from: number, to: number): T[] {
  const copy = items.slice();
  if (from < 0 || from >= copy.length) return copy;
  const [item] = copy.splice(from, 1);
  const target = Math.max(0, Math.min(to, copy.length));
  copy.splice(target, 0, item);
  return copy;
}

/** DIN slots of a rail: the row's own value, else the board's (null = unknown). */
export function rowCapacity(board: Board, row: Row): number | null {
  return row.capacity || board.modules_per_row || null;
}

/** DIN slots taken by the modules of a row, holes included. */
export function rowUsed(row: Row): number {
  return row.modules.reduce((sum, m) => sum + Math.max(1, m.width_modules || 1), 0);
}
