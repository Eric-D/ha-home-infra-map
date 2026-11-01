/** Pure helpers for electrical boards (unit-tested). */
import type { Board, Check, CircuitKind, Hass, Module, Row } from '../types.js';

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
  if (module.status === 'spare') return false;
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

export interface BoardStats {
  rcds: number;
  breakers: number;
  devices: number;
  unidentified: number;
  spare: number;
  off: number;
}

export function boardStats(board: Board, hass?: Hass): BoardStats {
  const stats: BoardStats = { rcds: 0, breakers: 0, devices: 0, unidentified: 0, spare: 0, off: 0 };
  for (const row of board.rows) {
    for (const m of row.modules) {
      if (m.kind === 'rcd') stats.rcds += 1;
      if (m.kind === 'breaker' || m.kind === 'rcbo') stats.breakers += 1;
      if (m.kind === 'device') stats.devices += 1;
      if (isUnidentified(m)) stats.unidentified += 1;
      if (m.status === 'spare') stats.spare += 1;
      else if (isOff(m, hass)) stats.off += 1;
    }
  }
  return stats;
}

/** Switched off / tripped: written in the model, or its linked switch entity is off. */
export function isOff(module: Module, hass?: Hass): boolean {
  if (module.status === 'off') return true;
  const id = module.switch_entity_id;
  return !!(id && hass?.states[id]?.state === 'off');
}

/**
 * Who feeds whom, across every board (mirror of models.ModuleIndex).
 *
 * A module is fed by its explicit `fed_by`, else (on a rail) by the last RCD to
 * its left, else by the last element of its board's service entrance, else by
 * the module feeding the board.
 */
export class FeedIndex {
  readonly modules = new Map<string, Module>();
  readonly boardOf = new Map<string, Board>();
  private readonly defaults = new Map<string, string | null>();

  constructor(boards: Board[]) {
    for (const board of boards) {
      let head: string | null = board.fed_by ?? null;
      for (const m of board.supply ?? []) {
        this.add(m, board, head);
        head = m.id;
      }
      for (const row of board.rows) {
        let rcd: string | null = null;
        for (const m of row.modules) {
          if (m.kind === 'rcd' || m.kind === 'meter' || m.kind === 'main_breaker') {
            this.add(m, board, head);
            if (m.kind === 'rcd') rcd = m.id;
          } else this.add(m, board, rcd ?? head);
        }
      }
    }
  }

  private add(m: Module, board: Board, fallback: string | null): void {
    this.modules.set(m.id, m);
    this.boardOf.set(m.id, board);
    this.defaults.set(m.id, fallback);
  }

  /** Module the automatic rule would pick (ignoring `fed_by`). */
  defaultFeeder(module: Module): Module | null {
    const id = this.defaults.get(module.id);
    return id ? this.modules.get(id) ?? null : null;
  }

  feeder(module: Module): Module | null {
    const id = (module.fed_by && this.modules.has(module.fed_by) ? module.fed_by : null) ?? this.defaults.get(module.id);
    return id ? this.modules.get(id) ?? null : null;
  }

  /** Upstream modules, nearest first. */
  chain(module: Module): Module[] {
    const out: Module[] = [];
    const seen = new Set([module.id]);
    let current = this.feeder(module);
    while (current && !seen.has(current.id)) {
      out.push(current);
      seen.add(current.id);
      current = this.feeder(current);
    }
    return out;
  }

  /** Residual-current device protecting a module (an RCBO protects itself; a main breaker with a sensitivity counts). */
  protector(module: Module): Module | null {
    if (module.kind === 'rcbo') return module;
    for (const up of this.chain(module)) {
      if (up.kind === 'rcd' || up.kind === 'rcbo') return up;
      if (up.kind === 'main_breaker' && up.sensitivity_ma) return up;
    }
    return null;
  }

  /** Modules directly fed by `id`. */
  fed(id: string): Module[] {
    return [...this.modules.values()].filter((m) => this.feeder(m)?.id === id);
  }

  /** Every module downstream of `id` (direct or not). */
  downstream(id: string): Set<string> {
    const out = new Set<string>();
    const todo = [id];
    while (todo.length) {
      for (const m of this.fed(todo.pop()!)) {
        if (out.has(m.id) || m.id === id) continue;
        out.add(m.id);
        todo.push(m.id);
      }
    }
    return out;
  }

  /** Candidates for the "fed by" field of `module`: anything that does not sit downstream of it. */
  candidates(module: Module): Module[] {
    const below = this.downstream(module.id);
    return [...this.modules.values()].filter(
      (m) => m.id !== module.id && !below.has(m.id) && m.kind !== 'spacer',
    );
  }
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
    case 'meter':
      return module.subscribed_kva ? `${String(module.subscribed_kva).replace('.', ',')} kVA` : 'kVA ?';
    case 'main_breaker':
      return module.rating_a ? `${module.rating_a} A` : '? A';
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
    width_modules: kind === 'meter' ? 4 : kind === 'rcd' || kind === 'main_breaker' ? 2 : 1,
    model: kind === 'meter' ? 'Linky' : null,
    notes: null,
    status: 'active',
    fed_by: null,
    subscribed_kva: null,
    rating_a: kind === 'rcd' ? 40 : kind === 'breaker' || kind === 'rcbo' ? 16 : kind === 'main_breaker' ? 60 : null,
    curve: 'C',
    sensitivity_ma: kind === 'rcd' || kind === 'rcbo' ? 30 : kind === 'main_breaker' ? 500 : null,
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

/** Circuit kinds with an NF C 15-100 reminder (i18n key `norm.<kind>`). */
export const NORM_KINDS: CircuitKind[] = ['lighting', 'sockets', 'dedicated', 'cooking', 'water_heater', 'heating', 'feeder'];

/** Usual circuit kind for a breaker rating, to help identify a "?" circuit (a guess, never applied silently). */
export function guessKindFromRating(rating: number | null | undefined): CircuitKind | null {
  if (!rating) return null;
  if (rating <= 10) return 'lighting';
  if (rating === 16) return 'sockets';
  if (rating === 20) return 'dedicated';
  if (rating === 32) return 'cooking';
  if (rating >= 40) return 'feeder';
  return null;
}

/** Highest number of points on a circuit (mirror of nfc15100.max_points). */
export function maxPoints(module: Module): number | null {
  if (module.circuit_kind === 'lighting') return 8;
  if (module.circuit_kind === 'sockets') return module.rating_a === 16 ? 8 : module.rating_a === 20 ? 12 : null;
  return null;
}
