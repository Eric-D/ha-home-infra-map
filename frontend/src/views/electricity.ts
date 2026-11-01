/** Electricity view "A": the board drawn rail by rail (pure render functions). */
import { html, nothing, svg, type TemplateResult } from 'lit';
import {
  boardPowerEntities,
  boardStats,
  checksFor,
  FeedIndex,
  formatWatts,
  formatWattsCompact,
  isOff,
  isUnidentified,
  moduleTitle,
  powerOf,
  rowCapacity,
  rowUsed,
  sumPower,
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

/** Feed relation of a module with the selected one. */
export type LinkRole = 'up' | 'down' | null;

export interface ModuleState {
  off?: boolean;
  link?: LinkRole;
}

export function moduleClasses(module: Module, selected: boolean, state: ModuleState = {}): string {
  const cls = ['m'];
  if (module.kind === 'rcd') cls.push('d');
  if (module.kind === 'rcbo') cls.push('d');
  if (module.kind === 'device') cls.push('s');
  if (module.kind === 'spacer') cls.push('sp');
  if (isUnidentified(module)) cls.push('u');
  if (module.status === 'spare') cls.push('spare');
  else if (state.off) cls.push('off');
  if (module.fed_by) cls.push('fx');
  if (state.link) cls.push(state.link);
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
  link?: LinkRole;
  /** Module explicitly feeding this one (shown in the tooltip). */
  feeder?: Module | null;
  extra?: Record<string, unknown>;
}

export function renderModule(module: Module, o: ModuleRenderOpts): TemplateResult {
  const watts = powerOf(o.hass, module.power_entity_id);
  const hasSensor = !!module.power_entity_id;
  const title = moduleTitle(module);
  const sub = moduleSubtitle(module, o.t);
  const off = module.status !== 'spare' && isOff(module, o.hass);
  const tag = module.status === 'spare' ? o.t('el.tag.spare') : off ? o.t('el.tag.off') : '';
  const fx = module.fed_by && o.feeder ? o.t('el.fx', { ref: o.feeder.ref || moduleTitle(o.feeder) }) : '';
  const label = [
    o.t('el.module_aria', { kind: o.t(`el.kind.${module.kind}`), ref: module.ref, title, name: sub }),
    tag,
    fx,
  ]
    .filter(Boolean)
    .join(' · ');
  return html`<button
    class=${moduleClasses(module, o.selected, { off, link: o.link ?? null })}
    style=${`grid-column:span ${moduleSpan(module)}`}
    data-module-id=${module.id}
    data-kind=${module.kind}
    aria-label=${label}
    aria-pressed=${o.selected ? 'true' : 'false'}
    title=${[module.ref, sub, tag, fx].filter(Boolean).join(' · ')}
    @click=${o.onClick}
  >
    ${fx ? html`<span class="fxmark" aria-hidden="true">↱</span>` : nothing}
    ${hasSensor ? html`<span class=${`led${watts !== null && watts > 0 ? ' on' : ''}`}></span>` : nothing}
    <b>${title}</b><small>${sub}</small>
    ${tag ? html`<span class=${module.status === 'spare' ? 'tag spare' : 'tag off'}>${tag}</span>` : nothing}
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

/** Up/downstream sets of the selected module, to draw its feed links. */
export interface Links {
  index: FeedIndex;
  up: Set<string>;
  down: Set<string>;
}

export function linksFor(index: FeedIndex, selectedId: string | null): Links {
  const selected = selectedId ? index.modules.get(selectedId) : undefined;
  if (!selected) return { index, up: new Set(), down: new Set() };
  return {
    index,
    up: new Set(index.chain(selected).map((m) => m.id)),
    down: index.downstream(selected.id),
  };
}

function linkRole(links: Links | undefined, id: string): LinkRole {
  if (!links) return null;
  if (links.up.has(id)) return 'up';
  if (links.down.has(id)) return 'down';
  return null;
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
  if (rcd.kind === 'main_breaker')
    return t('el.d.head_only', { ref: rcd.ref || t('el.kind.main_breaker'), ma: rcd.sensitivity_ma ?? '?' });
  const parts = [rcd.rating_a ? `${rcd.rating_a} A` : '? A', rcd.sensitivity_ma ? `${rcd.sensitivity_ma} mA` : '? mA'];
  parts.push(rcd.rcd_type && rcd.rcd_type !== '?' ? t('el.type', { t: rcd.rcd_type }) : t('el.unknown_type'));
  return `${rcd.ref} · ${parts.join(' ')}`;
}

function refOf(m: Module, t: Translate, index: FeedIndex, board: Board | null): string {
  const name = m.ref || `${t(`el.kind.${m.kind}`)} ${moduleTitle(m)}`;
  const other = index.boardOf.get(m.id);
  return other && board && other.id !== board.id ? `${name} (${other.name})` : name;
}

export function renderModuleDetail(
  module: Module,
  _row: Row | null,
  ctx: Pick<ElectricityCtx, 'hass' | 't' | 'lang' | 'payload' | 'history' | 'historyRange' | 'onMoreInfo' | 'onSelectModule'> & {
    index?: FeedIndex;
    board?: Board | null;
  },
): TemplateResult {
  const { t } = ctx;
  const kind = t(`el.kind.${module.kind}`);
  let desc = kind;
  if (module.kind === 'breaker' || module.kind === 'rcbo') {
    desc += ` ${moduleTitle(module)}`;
    if (module.cable_mm2) desc += `, ${t('el.d.cable', { s: String(module.cable_mm2).replace('.', ctx.lang === 'fr' ? ',' : '.') })}`;
  } else if (module.kind === 'rcd') {
    desc = `${kind} ${rcdText(module, t).split(' · ')[1]}`;
  } else if (module.kind === 'main_breaker') {
    desc = `${kind} ${moduleTitle(module)}${module.sensitivity_ma ? ` · ${module.sensitivity_ma} mA` : ''}`;
  }
  const index = ctx.index ?? new FeedIndex(ctx.payload.model.boards);
  const board = ctx.board ?? index.boardOf.get(module.id) ?? null;
  const feeder = index.feeder(module);
  const chain = index.chain(module);
  const fed = index.fed(module.id).filter((m) => m.kind !== 'spacer');
  const rcd = module.kind === 'breaker' || module.kind === 'device' ? index.protector(module) : null;
  const status = module.status === 'spare' ? 'spare' : isOff(module, ctx.hass) ? 'off' : null;
  const sameBoard = (m: Module) => index.boardOf.get(m.id)?.id === board?.id;
  const refButton = (m: Module) =>
    sameBoard(m)
      ? html`<button class="ent" @click=${() => ctx.onSelectModule(m.id)}>${refOf(m, t, index, board)}</button>`
      : html`<span>${refOf(m, t, index, board)}</span>`;
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
    ${status ? html`<dt>${t('el.d.status')}</dt><dd><span class=${`tag inline ${status}`}>${t(`el.status.${status}`)}</span></dd>` : nothing}
    ${module.kind === 'meter' && module.subscribed_kva
      ? html`<dt>${t('el.d.kva')}</dt><dd>${String(module.subscribed_kva).replace('.', ctx.lang === 'fr' ? ',' : '.')} kVA</dd>`
      : nothing}
    ${feeder
      ? html`<dt>${t('el.d.fed_by')}</dt>
          <dd>
            ${chain.map((m, i) => html`${i ? html`<span class="muted"> ← </span>` : nothing}${refButton(m)}`)}
            ${module.fed_by ? html`<span class="muted"> · ${t('el.d.fed_manual')}</span>` : nothing}
          </dd>`
      : nothing}
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
    ${fed.length
      ? html`<dt>${t('el.d.feeds')}</dt>
          <dd>${fed.map((m, i) => html`${i ? ', ' : nothing}${refButton(m)}`)}</dd>`
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
    links?: Links;
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
        link: linkRole(ctx.links, m.id),
        feeder: m.fed_by ? ctx.links?.index.feeder(m) : null,
        onClick: () => ctx.onSelectModule(m.id === ctx.selectedModuleId ? null : m.id),
      }),
    )}
    ${usage.capacity !== null ? renderFreeSlots(usage.capacity - usage.used) : nothing}
  </div>`;
}

/** Load of the main breaker in % (230 V single phase), null when unknown. */
export function headLoad(watts: number | null, ratingA: number | null | undefined): number | null {
  if (watts === null || !ratingA) return null;
  return Math.round((watts / (230 * ratingA)) * 100);
}

export interface SupplyCtx {
  hass: Hass | undefined;
  t: Translate;
  lang: string;
  selectedModuleId: string | null;
  links?: Links;
  onSelectModule: (id: string | null) => void;
  /** Editor: extra buttons after the band. */
  extra?: TemplateResult | typeof nothing;
}

/** Service entrance drawn above the rails: meter -> main breaker -> departures. */
export function renderSupply(board: Board, ctx: SupplyCtx): TemplateResult | typeof nothing {
  const supply = board.supply ?? [];
  if (!supply.length && !ctx.extra) return nothing;
  const { t } = ctx;
  const metered = supply.map((m) => powerOf(ctx.hass, m.power_entity_id)).find((w) => w !== null) ?? null;
  const total = metered ?? sumPower(ctx.hass, boardPowerEntities(board));
  const departures = ctx.links ? ctx.links.index.fed(supply[supply.length - 1]?.id ?? '').length : 0;
  return html`<div class="supply" role="group" aria-label=${t('el.supply')}>
    <span class="rl">${t('el.supply')}</span>
    ${supply.map((m, i) => {
      const watts = powerOf(ctx.hass, m.power_entity_id);
      const load = m.kind === 'main_breaker' ? headLoad(total, m.rating_a) : null;
      const selected = m.id === ctx.selectedModuleId;
      const sub =
        m.kind === 'main_breaker'
          ? [m.sensitivity_ma ? `${m.sensitivity_ma} mA` : '', m.model && m.model !== t(`el.kind.${m.kind}`) ? m.model : '']
              .filter(Boolean)
              .join(' · ')
          : m.model ?? '';
      const cls = [
        'sup',
        m.kind,
        selected ? 'sel' : '',
        linkRole(ctx.links, m.id) ?? '',
        m.status === 'spare' ? 'spare' : isOff(m, ctx.hass) ? 'off' : '',
      ]
        .filter(Boolean)
        .join(' ');
      return html`${i ? html`<span class="arrow" aria-hidden="true">→</span>` : nothing}
        <button
          class=${cls}
          data-module-id=${m.id}
          aria-pressed=${selected ? 'true' : 'false'}
          aria-label=${`${t(`el.kind.${m.kind}`)} ${moduleTitle(m)} ${sub}`}
          @click=${() => ctx.onSelectModule(selected ? null : m.id)}
        >
          <ha-icon icon=${m.kind === 'meter' ? 'mdi:meter-electric-outline' : 'mdi:electric-switch'}></ha-icon>
          <span class="txt">
            <small>${t(`el.kind.${m.kind}`)}</small>
            <b>${moduleTitle(m)}</b>
            ${sub ? html`<small>${sub}</small>` : nothing}
          </span>
          ${watts !== null ? html`<span class="w">${formatWattsCompact(watts, ctx.lang)}</span>` : nothing}
          ${load !== null
            ? html`<span class="load" title=${t('el.load', { p: load, a: m.rating_a ?? '?' })}>
                <span class="bar"><span style=${`width:${Math.min(100, Math.max(0, load))}%`} class=${load >= 80 ? 'hot' : ''}></span></span>
                <span class="num">${load} %</span>
              </span>`
            : nothing}
        </button>`;
    })}
    ${supply.length && departures ? html`<span class="arrow" aria-hidden="true">→</span><span class="muted small">${t('el.feeds_n', { n: departures })}</span>` : nothing}
    ${ctx.extra ?? nothing}
  </div>`;
}

export function renderElectricity(ctx: ElectricityCtx): TemplateResult {
  const { t, payload, board } = ctx;
  const boards = payload.model.boards;
  if (!board) return html`<div class="empty">${t('el.no_board')}</div>`;
  const stats = boardStats(board, ctx.hass);
  const total = sumPower(ctx.hass, boardPowerEntities(board));
  const boardChecks = payload.checks.filter((c) => c.board_id === board.id && c.severity === 'warning');
  const index = new FeedIndex(boards);
  let selected: { module: Module; row: Row | null } | null = null;
  const head = (board.supply ?? []).find((x) => x.id === ctx.selectedModuleId);
  if (head) selected = { module: head, row: null };
  for (const row of board.rows) {
    const m = row.modules.find((x) => x.id === ctx.selectedModuleId);
    if (m) selected = { module: m, row };
  }
  const links = linksFor(index, selected ? selected.module.id : null);
  const boardFeeder = board.fed_by ? index.modules.get(board.fed_by) ?? null : null;
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
      ${stats.off ? html`<span class="chip"><span class="dot bad"></span>${t('el.off_count', { n: stats.off })}</span>` : nothing}
      ${stats.spare ? html`<span class="chip"><span class="dot off"></span>${t('el.spare_count', { n: stats.spare })}</span>` : nothing}
      ${boardFeeder
        ? html`<span class="chip">${t('el.board_fed_by', { ref: refOf(boardFeeder, t, index, board) })}</span>`
        : nothing}
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
    <div class=${links.up.size || links.down.size ? 'board linking' : 'board'}>
      ${renderSupply(board, { ...ctx, links })}
      ${board.rows.map((row) => renderRail(row, { ...ctx, board, links }))}
    </div>
    ${selected ? renderModuleDetail(selected.module, selected.row, { ...ctx, index, board }) : nothing}
  `;
}
