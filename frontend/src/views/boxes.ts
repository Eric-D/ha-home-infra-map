/** Junction boxes: the box drawn with its conduits by side and position. */
import { html, nothing, svg, type TemplateResult } from 'lit';
import type { FeedIndex } from '../helpers/electric.js';
import {
  CIRCUIT_COLORS,
  WIRE_COLORS,
  SIDES,
  boxCircuits,
  effectiveCircuits,
  circuitTree,
  conduitTarget,
  sideSlots,
  type TreeNode,
} from '../helpers/boxes.js';
import type { Translate } from '../i18n.js';
import type { Box, BoxPoint, BoxSide, Conduit, Hass } from '../types.js';

export interface BoxesCtx {
  hass: Hass | undefined;
  t: Translate;
  boxes: Box[];
  index: FeedIndex;
  selectedBoxId: string | null;
  selectedConduitId: string | null;
  onSelectBox: (id: string | null, conduitId?: string | null) => void;
  onSelectModule: (id: string | null) => void;
  onMoreInfo: (entityId: string) => void;
  /** edit mode: click on a free position */
  onFreeSlot?: (side: BoxSide, position: number) => void;
  /** edit mode: conduit waiting for the second end of a link */
  linkFrom?: string | null;
  editing?: boolean;
}

const POINT_ICONS: Record<string, [string, string]> = {
  socket: ['mdi:power-socket-fr', '◉'],
  light: ['mdi:lightbulb-outline', '☀'],
  switch: ['mdi:light-switch', '◧'],
  device: ['mdi:washing-machine', '■'],
  outlet: ['mdi:power-plug-outline', '◌'],
  other: ['mdi:circle-small', '•'],
};

function icon(name: string, fallback: string): TemplateResult {
  return customElements.get('ha-icon')
    ? html`<ha-icon class="bx-ic" icon=${name}></ha-icon>`
    : html`<span class="bx-ic" aria-hidden="true">${fallback}</span>`;
}

export function pointIcon(kind: string): TemplateResult {
  const [name, fallback] = POINT_ICONS[kind] ?? POINT_ICONS.other;
  return icon(name, fallback);
}

/** "G1", "B?", "?" (French letters H/B/G/D, English T/B/L/R). */
export function positionLabel(c: Conduit, t: Translate): string {
  if (!c.side) return '?';
  return `${t(`box.side_letter.${c.side}`)}${c.position ?? '?'}`;
}

export function pointText(p: BoxPoint, t: Translate): string {
  const what = [p.room, p.label].filter(Boolean).join(' · ') || t(`box.point.${p.kind}`);
  return p.count > 1 ? `${what} ×${p.count}` : what;
}

function circuitRef(id: string, index: FeedIndex, t: Translate): string {
  const m = index.modules.get(id);
  if (!m) return '?';
  const name = m.circuit_name && m.circuit_name !== '?' ? m.circuit_name : m.label || t('el.unidentified');
  return `${m.ref || '?'} ${name}`;
}

/** Short text of where a conduit leads. */
export function conduitDestination(box: Box, c: Conduit, ctx: BoxesCtx): string {
  const { t } = ctx;
  switch (c.end) {
    case 'board': {
      const ref = c.circuits.map((id) => ctx.index.modules.get(id)?.ref).filter(Boolean).join(', ');
      return ref ? `${t('box.from_board')} · ${ref}` : t('box.from_board');
    }
    case 'point':
      return c.point ? pointText(c.point, t) : t('box.point.other');
    case 'spare':
      return t('box.spare');
    default: {
      const target = conduitTarget(box, c, ctx.boxes);
      if (target) return target.conduit ? `${target.box.name} · ${positionLabel(target.conduit, t)}` : target.box.name;
      return c.label ? `${c.label} · ?` : t('box.unknown_dest');
    }
  }
}

type Eff = Map<string, string[]>;

function circuitsOf(c: Conduit, eff: Eff): string[] {
  return eff.get(c.id) ?? c.circuits;
}

function colorsOf(box: Box, eff: Eff): Map<string, string> {
  const ids = boxCircuits(box);
  for (const c of box.conduits) for (const id of circuitsOf(c, eff)) if (!ids.includes(id)) ids.push(id);
  return new Map(ids.map((id, i) => [id, CIRCUIT_COLORS[i % CIRCUIT_COLORS.length]]));
}

/** Conduit drawn outside the box (position unknown). */
function renderDot(box: Box, c: Conduit, colors: Map<string, string>, eff: Eff, ctx: BoxesCtx): TemplateResult {
  const { t } = ctx;
  const circuits = circuitsOf(c, eff);
  const color = circuits.length ? colors.get(circuits[0]) : undefined;
  const sel = ctx.selectedConduitId === c.id;
  const cls = ['bx-dot', c.end === 'spare' ? 'spare' : '', !circuits.length && c.end !== 'spare' ? 'unk' : '', sel ? 'sel' : '', c.point?.alert ? 'al' : '']
    .filter(Boolean)
    .join(' ');
  const dest = conduitDestination(box, c, ctx);
  return html`<button
    class="bx-g"
    title=${`${positionLabel(c, t)} · ${dest}`}
    aria-pressed=${sel ? 'true' : 'false'}
    @click=${() => ctx.onSelectBox(box.id, sel ? null : c.id)}
  >
    <span class=${cls} style=${color ? `border-color:${color}` : ''}>${positionLabel(c, t)}</span>
    <span class="bx-lbl">${c.end === 'point' && c.point ? pointIcon(c.point.kind) : nothing}${dest}${c.point?.alert ? html` <span class="amark-chip">!</span>` : nothing}</span>
  </button>`;
}

// --- SVG drawing ---------------------------------------------------------
const SLOT_W = 92; // top / bottom spacing
const SLOT_H = 52; // left / right spacing
const LABEL_W = 132; // room for the labels left and right
const LABEL_H = 54; // room for the labels above and below
const R = 15; // conduit radius
const INWARD: Record<BoxSide, [number, number]> = { top: [0, 1], bottom: [0, -1], left: [1, 0], right: [-1, 0] };
const POINT_CHARS: Record<string, string> = { socket: '◉ ', light: '✱ ', switch: '◧ ', device: '■ ', outlet: '◌ ', other: '' };

/** Split a label in at most `lines` lines of about `width` characters. */
export function wrap(text: string, width: number, lines = 2): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const out: string[] = [];
  let cur = '';
  for (const w of words) {
    if (cur && (cur + ' ' + w).length > width) {
      out.push(cur);
      cur = w;
    } else cur = cur ? `${cur} ${w}` : w;
  }
  if (cur) out.push(cur);
  if (out.length > lines) {
    const kept = out.slice(0, lines);
    kept[lines - 1] = `${kept[lines - 1].slice(0, width - 1)}…`;
    return kept;
  }
  return out;
}

interface Slot {
  side: BoxSide;
  pos: number | null;
  conduit: Conduit | null;
  x: number;
  y: number;
}

/** Positions of the conduits around the box (numbered first, then side-only ones). */
export function layoutBox(box: Box): { slots: Slot[]; width: number; height: number; x0: number; y0: number; w: number; h: number } {
  const per: Record<BoxSide, { pos: number | null; conduit: Conduit | null }[]> = { top: [], bottom: [], left: [], right: [] };
  for (const side of SIDES) {
    for (let pos = 1; pos <= sideSlots(box, side); pos += 1)
      per[side].push({ pos, conduit: box.conduits.find((c) => c.side === side && c.position === pos) ?? null });
    for (const c of box.conduits.filter((x) => x.side === side && x.position === null)) per[side].push({ pos: null, conduit: c });
  }
  const w = Math.max(230, Math.max(per.top.length, per.bottom.length) * SLOT_W);
  const h = Math.max(140, Math.max(per.left.length, per.right.length) * SLOT_H + 16);
  const x0 = LABEL_W;
  const y0 = LABEL_H;
  const slots: Slot[] = [];
  for (const side of SIDES) {
    const list = per[side];
    list.forEach((s, i) => {
      const f = (i + 0.5) / list.length;
      const x = side === 'left' ? x0 : side === 'right' ? x0 + w : x0 + f * w;
      const y = side === 'top' ? y0 : side === 'bottom' ? y0 + h : y0 + f * h;
      slots.push({ side, pos: s.pos, conduit: s.conduit, x, y });
    });
  }
  return { slots, width: w + 2 * LABEL_W, height: h + 2 * LABEL_H, x0, y0, w, h };
}

function renderLabel(slot: Slot, text: string, cls: string): TemplateResult {
  const vertical = slot.side === 'top' || slot.side === 'bottom';
  const lines = wrap(text, vertical ? 15 : 19, 2);
  const lh = 13;
  let x = slot.x;
  let y = slot.y;
  let anchor = 'middle';
  if (slot.side === 'top') y = slot.y - R - 6 - (lines.length - 1) * lh;
  if (slot.side === 'bottom') y = slot.y + R + 15;
  if (slot.side === 'left') {
    x = slot.x - R - 6;
    anchor = 'end';
    y = slot.y + 4 - ((lines.length - 1) * lh) / 2;
  }
  if (slot.side === 'right') {
    x = slot.x + R + 6;
    anchor = 'start';
    y = slot.y + 4 - ((lines.length - 1) * lh) / 2;
  }
  return svg`<text class=${cls} x=${x} y=${y} text-anchor=${anchor}>${lines.map((l, i) => svg`<tspan x=${x} dy=${i ? lh : 0}>${l}</tspan>`)}</text>`;
}

function renderJoins(box: Box, slots: Slot[], colors: Map<string, string>, eff: Eff): TemplateResult[] {
  const at = new Map(slots.filter((s) => s.conduit).map((s) => [s.conduit!.id, s]));
  const out: TemplateResult[] = [];
  for (const k of box.connectors) {
    if (k.wire !== 'all') continue;
    const members = k.conduits.map((id) => at.get(id)).filter((s): s is Slot => !!s);
    if (members.length < 2) continue;
    const first = box.conduits.find((c) => c.id === members[0].conduit!.id)!;
    const circuit = k.circuit ?? circuitsOf(first, eff)[0];
    const color = (circuit && colors.get(circuit)) || '#9aa1a9';
    const inner = (s: Slot, d: number): [number, number] => [s.x + INWARD[s.side][0] * d, s.y + INWARD[s.side][1] * d];
    if (members.length === 2) {
      const [a, b] = members;
      const [ax, ay] = inner(a, R);
      const [bx, by] = inner(b, R);
      const [c1x, c1y] = inner(a, 70);
      const [c2x, c2y] = inner(b, 70);
      out.push(svg`<path class="bx-join" d=${`M${ax},${ay} C${c1x},${c1y} ${c2x},${c2y} ${bx},${by}`} stroke=${color}></path>`);
    } else {
      const pts = members.map((s) => inner(s, 60));
      const cx = pts.reduce((n, p) => n + p[0], 0) / pts.length;
      const cy = pts.reduce((n, p) => n + p[1], 0) / pts.length;
      for (const s of members) {
        const [ax, ay] = inner(s, R);
        const [c1x, c1y] = inner(s, 55);
        out.push(svg`<path class="bx-join" d=${`M${ax},${ay} Q${c1x},${c1y} ${cx},${cy}`} stroke=${color}></path>`);
      }
      out.push(svg`<circle class="bx-node-dot" cx=${cx} cy=${cy} r="7" fill=${color}></circle>`);
    }
  }
  return out;
}

function renderSvg(box: Box, colors: Map<string, string>, eff: Eff, ctx: BoxesCtx): TemplateResult {
  const { t } = ctx;
  const L = layoutBox(box);
  const hasJoins = box.connectors.some((k) => k.wire === 'all' && k.conduits.length > 1);
  const empty = !box.connectors.length;
  return html`<svg
    class="bx-svg"
    viewBox=${`0 0 ${L.width} ${L.height}`}
    style=${`max-width:${Math.round(L.width * 1.25)}px`}
    role="group"
    aria-label=${box.name}
  >
    <rect class="bx-rect" x=${L.x0} y=${L.y0} width=${L.w} height=${L.h} rx="12"></rect>
    ${empty || !hasJoins
      ? svg`<text class="bx-center" x=${L.x0 + L.w / 2} y=${L.y0 + L.h / 2 + 4} text-anchor="middle">${t(empty ? 'box.no_connectors' : 'box.see_connectors')}</text>`
      : nothing}
    ${renderJoins(box, L.slots, colors, eff)}
    ${L.slots.map((s) => {
      const letter = `${t(`box.side_letter.${s.side}`)}${s.pos ?? '?'}`;
      const c = s.conduit;
      if (!c) {
        const add = ctx.onFreeSlot && s.pos !== null ? () => ctx.onFreeSlot!(s.side, s.pos!) : null;
        return svg`<g class=${add ? 'bx-sg free add' : 'bx-sg free'} role=${add ? 'button' : nothing} tabindex=${add ? '0' : nothing}
            @click=${() => add?.()} @keydown=${(e: KeyboardEvent) => (e.key === 'Enter' || e.key === ' ') && add?.()}>
          ${add ? svg`<title>${t('be.add_here', { pos: letter })}</title>` : nothing}
          <circle cx=${s.x} cy=${s.y} r=${R}></circle><text class="bx-dt" x=${s.x} y=${s.y + 4} text-anchor="middle">${add ? '+' : letter}</text>${renderLabel(s, add ? letter : t('box.free'), 'bx-st muted')}</g>`;
      }
      const circuits = circuitsOf(c, eff);
      const color = circuits.length ? colors.get(circuits[0]) : undefined;
      const sel = ctx.selectedConduitId === c.id;
      const dest = conduitDestination(box, c, ctx);
      const label = `${c.end === 'point' && c.point ? POINT_CHARS[c.point.kind] ?? '' : ''}${dest}`;
      const cls = ['bx-sg', c.end === 'spare' ? 'spare' : '', !circuits.length && c.end !== 'spare' ? 'unk' : '', sel ? 'sel' : '', ctx.linkFrom === c.id ? 'linkfrom' : '']
        .filter(Boolean)
        .join(' ');
      return svg`<g class=${cls} role="button" tabindex="0" aria-pressed=${sel ? 'true' : 'false'}
          @click=${() => ctx.onSelectBox(box.id, sel ? null : c.id)}
          @keydown=${(e: KeyboardEvent) => (e.key === 'Enter' || e.key === ' ') && ctx.onSelectBox(box.id, sel ? null : c.id)}>
        <title>${letter} · ${dest}</title>
        ${sel ? svg`<circle class="bx-halo" cx=${s.x} cy=${s.y} r=${R + 6}></circle>` : nothing}
        <circle cx=${s.x} cy=${s.y} r=${R} style=${color ? `stroke:${color}` : ''}></circle>
        <text class="bx-dt" x=${s.x} y=${s.y + 4} text-anchor="middle">${letter}</text>
        ${circuits.length > 1 ? svg`<text class="bx-more" x=${s.x + R} y=${s.y - R + 4}>+${circuits.length - 1}</text>` : nothing}
        ${c.point?.alert ? svg`<circle class="bx-al" cx=${s.x + R - 2} cy=${s.y - R + 2} r="6"></circle><text class="bx-al-t" x=${s.x + R - 2} y=${s.y - R + 5.5} text-anchor="middle">!</text>` : nothing}
        ${renderLabel(s, label, 'bx-st')}
      </g>`;
    })}
  </svg>`;
}

/** Connectors other than the full joins drawn as lines (Wagos of a lighting circuit…). */
function renderConnectors(box: Box, colors: Map<string, string>, ctx: BoxesCtx): TemplateResult | typeof nothing {
  const { t } = ctx;
  const byId = new Map(box.conduits.map((c) => [c.id, c]));
  const drawn = (k: (typeof box.connectors)[number]) => k.wire === 'all' && k.conduits.filter((id) => byId.get(id)?.side).length > 1;
  const listed = box.connectors.filter((k) => !drawn(k));
  const inConduits = new Set(box.conduits.flatMap((c) => c.circuits));
  const passing = box.circuits.filter((id) => !inConduits.has(id));
  if (!listed.length && !passing.length) return nothing;
  return html`<div class="bx-in">
    ${listed.length ? html`<div class="bx-in-t">${t('box.connectors')}</div>` : nothing}
    ${listed.map(
      (k) => html`<div class="bx-k">
        <span class="bx-sw" style=${`background:${WIRE_COLORS[k.wire] ?? WIRE_COLORS.unknown}`}></span>
        <b>${k.kind}${k.poles ? ` · ${k.poles}` : ''}</b>
        <span>${t(`box.wire.${k.wire}`)}</span>
        <span class="muted"
          >${k.conduits.length ? k.conduits.map((id) => (byId.get(id) ? positionLabel(byId.get(id)!, t) : '?')).join(' · ') : t('box.members_unknown')}</span
        >
        ${k.circuit ? html`<span class="c" style=${`background:${colors.get(k.circuit) ?? '#999'}`}></span>` : nothing}
      </div>`,
    )}
    ${passing.length
      ? html`<div class="muted small bx-pass">${t('box.also_inside')} ${passing.map((id) => circuitRef(id, ctx.index, t)).join(', ')}</div>`
      : nothing}
  </div>`;
}

function renderConduitDetail(box: Box, c: Conduit, eff: Eff, ctx: BoxesCtx): TemplateResult {
  const { t } = ctx;
  const target = conduitTarget(box, c, ctx.boxes);
  const wagos = box.connectors.filter((k) => k.conduits.includes(c.id));
  const row = (label: string, value: unknown) =>
    value === null || value === undefined || value === '' ? nothing : html`<dt>${label}</dt><dd>${value}</dd>`;
  return html`<dl class="detail bx-detail" aria-live="polite">
    <dt>${t('box.conduit')}</dt>
    <dd>
      <b>${positionLabel(c, t)}</b>${c.label ? ` · ${c.label}` : ''}
      ${[c.kind, c.diameter_mm ? `Ø${c.diameter_mm}` : null].filter(Boolean).join(' ') ? html` · ${[c.kind, c.diameter_mm ? `Ø${c.diameter_mm}` : null].filter(Boolean).join(' ')}` : nothing}
      ${!c.side ? html` <span class="tag inline">${t('box.pos_unknown')}</span>` : nothing}
    </dd>
    <dt>${t('box.circuits')}</dt>
    <dd>
      ${circuitsOf(c, eff).length
        ? circuitsOf(c, eff).map(
            (id, i) => html`${i ? ', ' : ''}<button class="ent" @click=${() => ctx.onSelectModule(id)}>${circuitRef(id, ctx.index, t)}</button>`,
          )
        : html`<span class="muted">${t('box.circuit_unknown')}</span>`}
      ${!c.circuits.length && circuitsOf(c, eff).length ? html`<span class="muted small"> · ${t('box.carried')}</span>` : nothing}
    </dd>
    ${row(t('box.cable'), [c.cable, c.length_m !== null ? `${c.length_m} m` : null].filter(Boolean).join(' · '))}
    ${row(t('box.route'), c.route)}
    <dt>${t('box.leads_to')}</dt>
    <dd>
      ${target
        ? html`<button class="ent" @click=${() => ctx.onSelectBox(target.box.id, target.conduit?.id ?? null)}>
            ${target.box.name}${target.conduit ? ` · ${positionLabel(target.conduit, t)}` : ` · ${t('box.entry_unknown')}`}
          </button>`
        : c.end === 'point' && c.point
          ? html`${pointIcon(c.point.kind)} ${pointText(c.point, t)}
              ${c.point.entity_id
                ? html` · <button class="ent" @click=${() => ctx.onMoreInfo(c.point!.entity_id!)}>${c.point.entity_id}</button>`
                : nothing}`
          : conduitDestination(box, c, ctx)}
    </dd>
    ${c.point?.alert ? html`<dt>${t('el.d.alert')}</dt><dd class="alert-text"><span class="amark-chip">!</span> ${c.point.alert}</dd>` : nothing}
    ${wagos.length
      ? html`<dt>${t('box.connectors')}</dt>
          <dd>
            ${wagos
              .map((k) =>
                k.wire === 'all'
                  ? `${t('box.joined_to')} ${k.conduits.filter((id) => id !== c.id).map((id) => { const o = box.conduits.find((x) => x.id === id); return o ? positionLabel(o, t) : '?'; }).join(', ')}`
                  : `${k.kind} (${t(`box.wire.${k.wire}`)})`,
              )
              .join(' · ')}
          </dd>`
      : nothing}
    ${row(t('el.d.notes'), c.notes)}
  </dl>`;
}

/** One box drawn: sides with their conduits, inside, unplaced conduits. */

export function renderBox(box: Box, ctx: BoxesCtx): TemplateResult {
  const { t } = ctx;
  const eff = effectiveCircuits(ctx.boxes);
  const colors = colorsOf(box, eff);
  const unplaced = box.conduits.filter((c) => !c.side);
  const selected = box.conduits.find((c) => c.id === ctx.selectedConduitId);
  return html`<div class="bx">
    <div class="bx-head">
      <div>
        <b>${box.name}</b>${box.location ? html` <span class="muted">· ${box.location}</span>` : nothing}
        ${box.alert ? html`<div class="alert-text"><span class="amark-chip">!</span> ${box.alert}</div>` : nothing}
      </div>
      ${ctx.editing ? nothing : html`<button class="icon-btn" aria-label=${t('el.d.close')} @click=${() => ctx.onSelectBox(null)}>✕</button>`}
    </div>
    <div class="chips">
      ${[...colors].map(
        ([id, color]) => html`<button class="chip" @click=${() => ctx.onSelectModule(id)}>
          <span class="c" style=${`background:${color}`}></span>${circuitRef(id, ctx.index, t)}
        </button>`,
      )}
    </div>
    ${renderSvg(box, colors, eff, ctx)}
    ${unplaced.length
      ? html`<div class="bx-unplaced">
          <span class="muted small">${t('box.unplaced')}</span>
          ${unplaced.map((c) => renderDot(box, c, colors, eff, ctx))}
        </div>`
      : nothing}
    ${ctx.editing ? nothing : renderConnectors(box, colors, ctx)}
    ${box.notes ? html`<div class="muted small">${box.notes}</div>` : nothing}
    ${selected && !ctx.editing ? renderConduitDetail(box, selected, eff, ctx) : nothing}
  </div>`;
}

function unknownCount(box: Box, eff: Eff): number {
  return box.conduits.filter((c) => !c.side || (!circuitsOf(c, eff).length && c.end !== 'spare') || (c.end === 'unknown' && !c.end_box_id && !c.label)).length;
}

/** Section below the boards: one tile per box, the selected one drawn. */
export function renderBoxes(ctx: BoxesCtx): TemplateResult | typeof nothing {
  const { t, boxes } = ctx;
  if (!boxes.length) return nothing;
  const selected = boxes.find((b) => b.id === ctx.selectedBoxId);
  const eff = effectiveCircuits(boxes);
  return html`<section class="board-section bx-section" aria-label=${t('box.title')}>
    <h3 class="board-title">${t('box.title')}</h3>
    <div class="bx-tiles">
      ${boxes.map((b) => {
        const unknown = unknownCount(b, eff);
        const colors = colorsOf(b, eff);
        return html`<button class=${b.id === ctx.selectedBoxId ? 'bx-tile sel' : 'bx-tile'} @click=${() => ctx.onSelectBox(b.id === ctx.selectedBoxId ? null : b.id)}>
          <span class="bx-tile-n">${b.name}${b.alert || b.conduits.some((c) => c.point?.alert) ? html` <span class="amark-chip">!</span>` : nothing}</span>
          <span class="muted small">${b.location ?? ''}</span>
          <span class="bx-tile-c">${[...colors.values()].map((c) => html`<span class="c" style=${`background:${c}`}></span>`)}
            <span class="small">${t('box.n_conduits', { n: b.conduits.length })}</span>
            ${unknown ? html`<span class="small warn-t">· ${t('box.to_complete', { n: unknown })}</span>` : nothing}</span
          >
        </button>`;
      })}
    </div>
    ${selected ? renderBox(selected, ctx) : nothing}
  </section>`;
}

function renderNode(node: TreeNode, ctx: BoxesCtx): TemplateResult {
  const { t } = ctx;
  return html`<li>
    <button class="ent bx-node" @click=${() => ctx.onSelectBox(node.box.id)}>▣ ${node.box.name}</button>
    ${node.box.location ? html`<span class="muted small"> · ${node.box.location}</span>` : nothing}
    ${node.points.length || node.unknown.length || node.children.length
      ? html`<ul>
          ${node.points.map(
            (c) => html`<li>
              <button class="ent" @click=${() => ctx.onSelectBox(node.box.id, c.id)}>${pointIcon(c.point!.kind)} ${pointText(c.point!, t)}</button>
              ${c.point!.alert ? html`<span class="amark-chip">!</span>` : nothing}
            </li>`,
          )}
          ${node.children.map((n) => renderNode(n, ctx))}
          ${node.unknown.map(
            (c) => html`<li class="muted"><button class="ent" @click=${() => ctx.onSelectBox(node.box.id, c.id)}>${positionLabel(c, t)}</button> → ?</li>`,
          )}
        </ul>`
      : nothing}
  </li>`;
}

/** Path of a circuit through the boxes, for the module detail. */
export function renderCircuitPath(moduleId: string, ctx: BoxesCtx): TemplateResult | typeof nothing {
  const tree = circuitTree(ctx.boxes, moduleId);
  if (!tree.roots.length && !tree.loose.length) return nothing;
  return html`<dt>${ctx.t('box.path')}</dt>
    <dd>
      <ul class="bx-tree">
        ${tree.roots.map((n) => renderNode(n, ctx))}
      </ul>
      ${tree.loose.length
        ? html`<div class="muted small">${ctx.t('box.loose')}</div>
            <ul class="bx-tree">
              ${tree.loose.map((n) => renderNode(n, ctx))}
            </ul>`
        : nothing}
    </dd>`;
}
