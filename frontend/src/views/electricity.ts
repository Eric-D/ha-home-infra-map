/** Electricity view "A": the board drawn rail by rail (pure render functions). */
import { html, nothing, svg, type TemplateResult } from 'lit';
import {
  boardPowerEntities,
  boardStats,
  checksFor,
  formatWatts,
  formatWattsCompact,
  isUnidentified,
  moduleTitle,
  powerOf,
  rowCapacity,
  rowUsed,
  sumPower,
  upstreamRcd,
} from '../helpers/electric.js';
import { sparkPath, type Point } from '../helpers/sparkline.js';
import type { Translate } from '../i18n.js';
import type { Board, Check, Hass, Module, Payload, Row } from '../types.js';
import { areaNames } from '../ui.js';

/** DIN slots taken by a module (each slot is one grid column of the rail). */
export function moduleSpan(module: Module): number {
  return Math.max(1, module.width_modules || 1);
}

/** Rail grid: known width -> slots shrink to fit the card; unknown -> nominal size. */
export function railStyle(capacity: number | null): string {
  return capacity !== null
    ? 'grid-auto-columns:minmax(var(--him-slot-min),1fr)'
    : 'grid-auto-columns:minmax(var(--him-slot-min),var(--him-slot))';
}

export function moduleClasses(module: Module, selected: boolean): string {
  const cls = ['m'];
  if (module.kind === 'rcd') cls.push('d');
  if (module.kind === 'rcbo') cls.push('d');
  if (module.kind === 'device') cls.push('s');
  if (module.kind === 'spacer') cls.push('sp');
  if (isUnidentified(module)) cls.push('u');
  if (selected) cls.push('sel');
  return cls.join(' ');
}

export function moduleSubtitle(module: Module, t: Translate): string {
  switch (module.kind) {
    case 'rcd':
      return `${module.sensitivity_ma ? t('el.sensitivity', { ma: module.sensitivity_ma }) : '? mA'} · ${
        module.rcd_type && module.rcd_type !== '?' ? t('el.type', { t: module.rcd_type }) : t('el.unknown_type')
      }`;
    case 'breaker':
    case 'rcbo':
      return module.circuit_name || '?';
    case 'device':
      return moduleTitle(module) === module.label ? module.notes?.split('\n')[0] ?? '' : module.label;
    default:
      return '';
  }
}

export interface ModuleRenderOpts {
  hass: Hass | undefined;
  t: Translate;
  lang: string;
  selected: boolean;
  warned: boolean;
  onClick: () => void;
  extra?: Record<string, unknown>;
}

export function renderModule(module: Module, o: ModuleRenderOpts): TemplateResult {
  const watts = powerOf(o.hass, module.power_entity_id);
  const hasSensor = !!module.power_entity_id;
  const title = moduleTitle(module);
  const sub = moduleSubtitle(module, o.t);
  const label = o.t('el.module_aria', {
    kind: o.t(`el.kind.${module.kind}`),
    ref: module.ref,
    title,
    name: sub,
  });
  return html`<button
    class=${moduleClasses(module, o.selected)}
    style=${`grid-column:span ${moduleSpan(module)}`}
    data-module-id=${module.id}
    data-kind=${module.kind}
    aria-label=${label}
    aria-pressed=${o.selected ? 'true' : 'false'}
    title=${`${module.ref} · ${sub}`}
    @click=${o.onClick}
  >
    ${hasSensor ? html`<span class=${`led${watts !== null && watts > 0 ? ' on' : ''}`}></span>` : nothing}
    <b>${title}</b><small>${sub}</small>
    ${hasSensor
      ? html`<span class="w" title=${formatWatts(watts, o.lang)}>${formatWattsCompact(watts, o.lang)}</span>`
      : nothing}
    ${o.warned ? html`<span class="wmark" aria-hidden="true"></span>` : nothing}
  </button>`;
}

export interface ElectricityCtx {
  hass: Hass | undefined;
  payload: Payload;
  t: Translate;
  lang: string;
  board: Board | null;
  selectedModuleId: string | null;
  showWarnings: boolean;
  history: Point[] | null;
  historyRange: [number, number];
  hasPhoto: boolean;
  onSelectBoard: (id: string) => void;
  onSelectModule: (id: string | null) => void;
  onToggleWarnings: () => void;
  onOpenPhoto: () => void;
  onMoreInfo: (entityId: string) => void;
}

function warningText(check: Check, t: Translate): string {
  return t(`check.${check.code}`, check.params);
}

export function renderSpark(points: Point[] | null, range: [number, number], t: Translate): TemplateResult {
  if (points === null) return html`<span class="muted small">…</span>`;
  const { line, area } = sparkPath(points, range[0], range[1]);
  if (!line) return html`<span class="muted small">${t('el.d.no_history')}</span>`;
  return html`<svg class="spark" viewBox="0 0 200 42" preserveAspectRatio="none" role="img" aria-label=${t('el.d.history')}>
    ${svg`<path d=${area} fill="var(--him-accent)" opacity=".15"></path>
    <path d=${line} fill="none" stroke="var(--him-accent)" stroke-width="1.6" vector-effect="non-scaling-stroke"></path>`}
  </svg>`;
}

function rcdText(rcd: Module, t: Translate): string {
  const parts = [rcd.rating_a ? `${rcd.rating_a} A` : '? A', rcd.sensitivity_ma ? `${rcd.sensitivity_ma} mA` : '? mA'];
  parts.push(rcd.rcd_type && rcd.rcd_type !== '?' ? t('el.type', { t: rcd.rcd_type }) : t('el.unknown_type'));
  return `${rcd.ref} · ${parts.join(' ')}`;
}

export function renderModuleDetail(
  module: Module,
  row: Row,
  ctx: Pick<ElectricityCtx, 'hass' | 't' | 'lang' | 'payload' | 'history' | 'historyRange' | 'onMoreInfo' | 'onSelectModule'>,
): TemplateResult {
  const { t } = ctx;
  const kind = t(`el.kind.${module.kind}`);
  let desc = kind;
  if (module.kind === 'breaker' || module.kind === 'rcbo') {
    desc += ` ${moduleTitle(module)}`;
    if (module.cable_mm2) desc += `, ${t('el.d.cable', { s: String(module.cable_mm2).replace('.', ctx.lang === 'fr' ? ',' : '.') })}`;
  } else if (module.kind === 'rcd') {
    desc = `${kind} ${rcdText(module, t).split(' · ')[1]}`;
  }
  const rcd = module.kind === 'breaker' ? upstreamRcd(row, module.id) : null;
  const warnings = checksFor(ctx.payload.checks, module.id);
  const watts = powerOf(ctx.hass, module.power_entity_id);
  const isCircuit = module.kind === 'breaker' || module.kind === 'rcbo';
  return html`<dl class="detail" aria-live="polite">
    <dt>${t('el.d.ref')}</dt>
    <dd>
      <b>${module.ref || '—'}</b> · ${desc}
      <button class="icon-btn" style="float:right;width:24px;height:24px" aria-label=${t('el.d.close')} @click=${() => ctx.onSelectModule(null)}>✕</button>
    </dd>
    ${module.model ? html`<dt>${t('el.d.model')}</dt><dd>${module.model}</dd>` : nothing}
    ${isCircuit
      ? html`<dt>${t('el.d.circuit')}</dt>
          <dd>
            ${module.circuit_name || '?'}
            ${module.circuit_kind !== 'unknown' ? html`<span class="muted"> · ${t(`ck.kind.${module.circuit_kind}`)}</span>` : nothing}
          </dd>`
      : nothing}
    ${module.area_ids.length ? html`<dt>${t('el.d.areas')}</dt><dd>${areaNames(ctx.hass, module.area_ids).join(' · ')}</dd>` : nothing}
    ${module.kind === 'breaker'
      ? html`<dt>${t('el.d.protected_by')}</dt><dd>${rcd ? rcdText(rcd, t) : html`<span class="muted">${t('el.d.no_rcd')}</span>`}</dd>`
      : nothing}
    ${module.power_entity_id
      ? html`<dt>${t('el.d.measure')}</dt>
          <dd>
            <span class="num">${formatWatts(watts, ctx.lang)}</span> ·
            <button class="ent" @click=${() => ctx.onMoreInfo(module.power_entity_id!)}>${module.power_entity_id}</button>
          </dd>
          <dt>${t('el.d.history')}</dt>
          <dd>${renderSpark(ctx.history, ctx.historyRange, t)}</dd>`
      : nothing}
    ${module.energy_entity_id
      ? html`<dt>${t('el.d.energy')}</dt>
          <dd><button class="ent" @click=${() => ctx.onMoreInfo(module.energy_entity_id!)}>${module.energy_entity_id}</button></dd>`
      : nothing}
    ${module.entity_ids.length
      ? html`<dt>${t('el.d.entities')}</dt>
          <dd>${module.entity_ids.map((e) => html`<button class="ent" @click=${() => ctx.onMoreInfo(e)}>${e}</button> `)}</dd>`
      : nothing}
    ${module.notes ? html`<dt>${t('el.d.notes')}</dt><dd style="white-space:pre-line">${module.notes}</dd>` : nothing}
    ${warnings.length
      ? html`<dt>${t('el.d.warnings')}</dt>
          <dd><ul class="warnlist">${warnings.map((w) => html`<li class=${w.severity}>${warningText(w, t)}</li>`)}</ul></dd>`
      : nothing}
  </dl>`;
}

/** Free DIN slots drawn after the last module when the rail capacity is known. */
export function renderFreeSlots(free: number): TemplateResult[] {
  return Array.from({ length: Math.max(0, free) }, () => html`<div class="m free" aria-hidden="true"></div>`);
}

/** "11 / 13" usage of a rail, null when its capacity is unknown. */
export function railUsage(board: Board | null, row: Row): { used: number; capacity: number | null; over: boolean } {
  const capacity = board ? rowCapacity(board, row) : null;
  const used = rowUsed(row);
  return { used, capacity, over: capacity !== null && used > capacity };
}

export function renderRail(
  row: Row,
  ctx: Pick<ElectricityCtx, 'hass' | 't' | 'lang' | 'payload' | 'selectedModuleId' | 'onSelectModule'> & {
    board?: Board | null;
  },
): TemplateResult {
  const warned = new Set(ctx.payload.checks.filter((c) => c.severity === 'warning').map((c) => c.module_id));
  const usage = railUsage(ctx.board ?? null, row);
  const label = ctx.t('el.row', { label: row.label });
  const usageText = usage.capacity !== null ? ctx.t('el.slots', { used: usage.used, capacity: usage.capacity }) : '';
  return html`<div
    class=${usage.over ? 'rail over' : 'rail'}
    style=${railStyle(usage.capacity)}
    role="group"
    aria-label=${usageText ? `${label} · ${usageText}` : label}
    title=${usageText}
    data-row-id=${row.id}
  >
    <span class="rl">${row.label}</span>
    ${row.modules.map((m) =>
      renderModule(m, {
        hass: ctx.hass,
        t: ctx.t,
        lang: ctx.lang,
        selected: m.id === ctx.selectedModuleId,
        warned: warned.has(m.id),
        onClick: () => ctx.onSelectModule(m.id === ctx.selectedModuleId ? null : m.id),
      }),
    )}
    ${usage.capacity !== null ? renderFreeSlots(usage.capacity - usage.used) : nothing}
  </div>`;
}

export function renderElectricity(ctx: ElectricityCtx): TemplateResult {
  const { t, payload, board } = ctx;
  const boards = payload.model.boards;
  if (!board) return html`<div class="empty">${t('el.no_board')}</div>`;
  const stats = boardStats(board);
  const total = sumPower(ctx.hass, boardPowerEntities(board));
  const boardChecks = payload.checks.filter((c) => c.board_id === board.id && c.severity === 'warning');
  let selected: { module: Module; row: Row } | null = null;
  for (const row of board.rows) {
    const m = row.modules.find((x) => x.id === ctx.selectedModuleId);
    if (m) selected = { module: m, row };
  }
  return html`
    ${boards.length > 1
      ? html`<div class="seg" role="tablist" aria-label=${t('el.board')}>
          ${boards.map(
            (b) => html`<button role="tab" aria-selected=${b.id === board.id ? 'true' : 'false'} @click=${() => ctx.onSelectBoard(b.id)}>
              ${b.name}
            </button>`,
          )}
        </div>`
      : nothing}
    <div class="chips">
      <span class="chip"><span class="dot"></span>${t('el.rcd_count', { n: stats.rcds })}</span>
      ${stats.unidentified
        ? html`<span class="chip"><span class="dot warn"></span>${t('el.to_identify', { n: stats.unidentified })}</span>`
        : html`<span class="chip"><span class="dot"></span>${t('el.all_identified')}</span>`}
      ${total !== null ? html`<span class="chip num">${t('el.now', { w: formatWatts(total, ctx.lang) })}</span>` : nothing}
      ${boardChecks.length
        ? html`<button class="chip warn" aria-expanded=${ctx.showWarnings ? 'true' : 'false'} @click=${ctx.onToggleWarnings}>
            <span class="dot warn"></span>${t('el.warnings', { n: boardChecks.length })}
          </button>`
        : nothing}
      ${ctx.hasPhoto
        ? html`<button class="chip" @click=${ctx.onOpenPhoto}><ha-icon icon="mdi:image" style="--mdc-icon-size:16px"></ha-icon>${t('el.photo')}</button>`
        : nothing}
    </div>
    ${ctx.showWarnings && boardChecks.length
      ? html`<div class="form">
          <ul class="warnlist">
            ${boardChecks.map(
              (c) => html`<li class="warning">
                <button class="ent" @click=${() => ctx.onSelectModule(c.module_id)}>${c.ref}</button> · ${warningText(c, t)}
              </li>`,
            )}
          </ul>
          <span class="muted small">${t('check.disclaimer')}</span>
        </div>`
      : nothing}
    <div class="board">${board.rows.map((row) => renderRail(row, { ...ctx, board }))}</div>
    ${selected ? renderModuleDetail(selected.module, selected.row, ctx) : nothing}
  `;
}
