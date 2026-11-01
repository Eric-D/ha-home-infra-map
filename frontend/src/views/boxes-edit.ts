/** Junction boxes edit mode: click a position to add a conduit, click two conduits to join them. */
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { errorCode, errorMessage, save } from '../api.js';
import { deepClone, FeedIndex, newId } from '../helpers/electric.js';
import { translator, type Translate } from '../i18n.js';
import { cardStyles } from '../styles.js';
import type { Box, BoxSide, Conduit, ConduitEnd, Connector, Hass, Module, Payload, PointKind, WireKind } from '../types.js';
import { entityField, ensureHaElements, fire, selectField, textField } from '../ui.js';
import { positionLabel, renderBox, type BoxesCtx } from './boxes.js';

const SIDES: BoxSide[] = ['top', 'bottom', 'left', 'right'];
const ENDS: ConduitEnd[] = ['unknown', 'board', 'box', 'point', 'spare'];
const POINT_KINDS: PointKind[] = ['socket', 'light', 'switch', 'device', 'outlet', 'other'];
const WIRES: WireKind[] = ['all', 'phase', 'neutral', 'earth', 'switched', 'traveler', 'other', 'unknown'];
const CONDUIT_KINDS = ['ICTA', 'IRL', 'Gaine annelée', 'Câble seul', 'Moulure'];
const CABLES = ['3G1.5', '3G2.5', '3G6', '2x1.5', '4G1.5', '5G1.5'];
const CONNECTOR_KINDS = ['Wago 221-412', 'Wago 221-413', 'Wago 221-415', 'Wago 2273', 'Domino', 'Liaison'];

export function blankBox(name: string): Box {
  return {
    id: newId(),
    name,
    location: null,
    area_id: null,
    photo_path: null,
    notes: null,
    alert: null,
    alert_level: 'warning',
    sides: { top: 2, bottom: 2, left: 2, right: 2 },
    circuits: [],
    conduits: [],
    connectors: [],
  };
}

export function blankConduit(side: BoxSide | null, position: number | null): Conduit {
  return {
    id: newId(),
    side,
    position,
    label: null,
    kind: null,
    diameter_mm: null,
    circuits: [],
    cable: null,
    length_m: null,
    route: null,
    end: 'unknown',
    end_box_id: null,
    end_conduit_id: null,
    point: null,
    notes: null,
  };
}

/**
 * Join two conduits with every wire ("liaison complète"). Joining to a conduit
 * already in a full join extends it (a box splitting a cable in three);
 * joining two conduits already joined removes the join.
 */
export function toggleJoin(box: Box, a: string, b: string): void {
  if (a === b) return;
  const full = box.connectors.filter((k) => k.wire === 'all');
  const both = full.find((k) => k.conduits.includes(a) && k.conduits.includes(b));
  if (both) {
    both.conduits = both.conduits.filter((id) => id !== b);
    if (both.conduits.length < 2) box.connectors = box.connectors.filter((k) => k !== both);
    return;
  }
  const withA = full.find((k) => k.conduits.includes(a));
  const withB = full.find((k) => k.conduits.includes(b));
  if (withA && withB) {
    withA.conduits = [...withA.conduits, ...withB.conduits.filter((id) => !withA.conduits.includes(id))];
    box.connectors = box.connectors.filter((k) => k !== withB);
  } else if (withA) withA.conduits.push(b);
  else if (withB) withB.conduits.push(a);
  else box.connectors.push({ id: newId(), kind: 'Liaison', poles: null, wire: 'all', circuit: null, conduits: [a, b], notes: null });
}

export class HomeInfraMapBoxesEditor extends LitElement {
  static override styles = cardStyles;
  static override properties = {
    hass: { attribute: false },
    payload: { attribute: false },
    _boxes: { state: true },
    _boxId: { state: true },
    _conduitId: { state: true },
    _linkFrom: { state: true },
    _dirty: { state: true },
    _busy: { state: true },
    _error: { state: true },
  };

  declare hass: Hass | undefined;
  declare payload: Payload | undefined;
  declare _boxes: Box[];
  declare _boxId: string | null;
  declare _conduitId: string | null;
  declare _linkFrom: string | null;
  declare _dirty: boolean;
  declare _busy: boolean;
  declare _error: string | null;
  private _initialised = false;

  constructor() {
    super();
    this._boxes = [];
    this._boxId = null;
    this._conduitId = null;
    this._linkFrom = null;
    this._dirty = false;
    this._busy = false;
    this._error = null;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    void ensureHaElements().then(() => this.requestUpdate());
  }

  protected override willUpdate(): void {
    if (!this._initialised && this.payload) {
      this._initialised = true;
      this._boxes = deepClone(this.payload.model.boxes ?? []);
      this._boxId = this._boxes[0]?.id ?? null;
    }
  }

  private get _t(): Translate {
    return translator((this.hass?.locale?.language ?? 'fr').startsWith('fr') ? 'fr' : 'en');
  }

  private get _box(): Box | undefined {
    return this._boxes.find((b) => b.id === this._boxId);
  }

  private _touch(): void {
    this._boxes = [...this._boxes];
    this._dirty = true;
  }

  private _addBox(): void {
    const box = blankBox(`${this._t('be.new_box')} ${this._boxes.length + 1}`);
    this._boxes = [...this._boxes, box];
    this._boxId = box.id;
    this._conduitId = null;
    this._dirty = true;
  }

  private _deleteBox(box: Box): void {
    if (!window.confirm(this._t('edit.confirm_delete', { name: box.name }))) return;
    this._boxes = this._boxes.filter((b) => b !== box);
    // links of the other boxes to this one become unknown
    for (const other of this._boxes)
      for (const c of other.conduits)
        if (c.end_box_id === box.id) Object.assign(c, { end: 'unknown', end_box_id: null, end_conduit_id: null });
    this._boxId = this._boxes[0]?.id ?? null;
    this._conduitId = null;
    this._dirty = true;
  }

  private _addConduit(side: BoxSide | null, position: number | null): void {
    const box = this._box;
    if (!box) return;
    const c = blankConduit(side, position);
    box.conduits.push(c);
    this._conduitId = c.id;
    this._linkFrom = null;
    this._touch();
  }

  private _deleteConduit(box: Box, c: Conduit): void {
    box.conduits = box.conduits.filter((x) => x !== c);
    for (const k of box.connectors) k.conduits = k.conduits.filter((id) => id !== c.id);
    box.connectors = box.connectors.filter((k) => k.wire !== 'all' || k.conduits.length > 1);
    for (const other of this._boxes)
      for (const x of other.conduits) if (x.end_conduit_id === c.id) x.end_conduit_id = null;
    this._conduitId = null;
    this._touch();
  }

  private _clickConduit(boxId: string | null, conduitId: string | null | undefined): void {
    const box = this._box;
    if (!box || boxId !== box.id) {
      if (boxId) this._boxId = boxId;
      this._conduitId = conduitId ?? null;
      return;
    }
    if (this._linkFrom && conduitId && conduitId !== this._linkFrom) {
      toggleJoin(box, this._linkFrom, conduitId);
      this._linkFrom = null;
      this._conduitId = conduitId;
      this._touch();
      return;
    }
    this._linkFrom = null;
    this._conduitId = conduitId ?? null;
  }

  private async _save(): Promise<void> {
    if (!this.hass || !this.payload) return;
    this._busy = true;
    this._error = null;
    try {
      await save(this.hass, 'boxes', this._boxes, this.payload.section_revisions.boxes ?? 0);
      this._dirty = false;
      fire(this, 'him-saved', {});
    } catch (err) {
      const code = errorCode(err);
      if (code === 'conflict') fire(this, 'him-conflict');
      else if (code === 'unauthorized') this._error = this._t('edit.refused');
      else this._error = this._t('edit.failed', { error: errorMessage(err) });
    } finally {
      this._busy = false;
    }
  }

  private _cancel(): void {
    if (this._dirty && !window.confirm(this._t('edit.unsaved') + ' — ' + this._t('edit.cancel') + ' ?')) return;
    fire(this, 'him-cancel');
  }

  /** Circuits that can run in a conduit: breakers, RCBOs, devices of every board. */
  private _circuitOptions(): { value: string; label: string }[] {
    const out: { value: string; label: string }[] = [];
    for (const b of this.payload?.model.boards ?? [])
      for (const r of b.rows)
        for (const m of r.modules as Module[])
          if (m.kind === 'breaker' || m.kind === 'rcbo' || m.kind === 'device')
            out.push({ value: m.id, label: `${m.ref || '?'} ${m.circuit_name && m.circuit_name !== '?' ? m.circuit_name : m.label || '?'}` });
    return out;
  }

  private _circuitsField(id: string, label: string, values: string[], onChange: (v: string[]) => void): TemplateResult {
    const options = this._circuitOptions();
    return html`<div class="f">
      <label for=${id}>${label}</label>
      <select
        class="sel"
        id=${id}
        multiple
        size=${Math.min(6, Math.max(3, options.length))}
        @change=${(e: Event) => onChange([...(e.target as HTMLSelectElement).selectedOptions].map((o) => o.value))}
      >
        ${options.map((o) => html`<option value=${o.value} ?selected=${values.includes(o.value)}>${o.label}</option>`)}
      </select>
      <span class="muted small">${this._t('be.multi_hint')}</span>
    </div>`;
  }

  protected override render(): TemplateResult {
    const t = this._t;
    const box = this._box;
    const ctx: BoxesCtx = {
      hass: this.hass,
      t,
      boxes: this._boxes,
      index: new FeedIndex(this.payload?.model.boards ?? []),
      selectedBoxId: this._boxId,
      selectedConduitId: this._conduitId,
      onSelectBox: (id, conduitId) => this._clickConduit(id, conduitId),
      onSelectModule: () => undefined,
      onMoreInfo: () => undefined,
      onFreeSlot: (side, pos) => this._addConduit(side, pos),
      linkFrom: this._linkFrom,
      editing: true,
    };
    const conduit = box?.conduits.find((c) => c.id === this._conduitId);
    return html`
      <div class="toolbar">
        ${this._boxes.length
          ? selectField('be-box', t('be.box'), this._boxId, this._boxes.map((b) => ({ value: b.id, label: b.name })), (v) => {
              this._boxId = v;
              this._conduitId = null;
              this._linkFrom = null;
            })
          : nothing}
        <button class="btn" @click=${this._addBox}>+ ${t('be.add_box')}</button>
        <span style="flex:1"></span>
        ${this._dirty ? html`<span class="badge warn">${t('edit.unsaved')}</span>` : nothing}
        <button class="btn" @click=${this._cancel}>${t('edit.cancel')}</button>
        <button class="btn pri" ?disabled=${this._busy || !this._dirty} @click=${this._save}>${t('edit.save')}</button>
      </div>
      ${this._error ? html`<div class="banner" role="alert">${this._error}</div>` : nothing}
      ${box
        ? html`<div class="ed">
            <div style="display:flex;flex-direction:column;gap:8px;min-width:0">
              ${this._linkFrom
                ? html`<div class="banner info">
                    ${t('be.link_pick', { pos: positionLabel(box.conduits.find((c) => c.id === this._linkFrom)!, t) })}
                    <button class="btn" @click=${() => (this._linkFrom = null)}>${t('edit.cancel')}</button>
                  </div>`
                : html`<div class="muted small">${t('be.help')}</div>`}
              ${renderBox(box, ctx)}
              <div style="display:flex;gap:6px;flex-wrap:wrap">
                <button class="btn" @click=${() => this._addConduit(null, null)}>+ ${t('be.add_unplaced')}</button>
                <button
                  class="btn"
                  @click=${() => {
                    box.connectors.push({ id: newId(), kind: 'Wago 221-413', poles: null, wire: 'unknown', circuit: null, conduits: [], notes: null });
                    this._touch();
                  }}
                >
                  + ${t('be.add_connector')}
                </button>
              </div>
              ${keyed(box.id, this._renderBoxForm(box))} ${keyed(box.id, this._renderConnectors(box))}
            </div>
            <div class="form">${conduit ? keyed(conduit.id, this._renderConduitForm(box, conduit)) : html`<span class="muted">${t('be.pick_conduit')}</span>`}</div>
          </div>`
        : html`<div class="empty">${t('be.none')}</div>`}
    `;
  }

  private _renderBoxForm(box: Box): TemplateResult {
    const t = this._t;
    const num = (v: string) => Math.max(0, Math.min(48, Math.round(Number(v)) || 0));
    return html`<details class="form" ?open=${!box.conduits.length}>
      <summary>${t('be.box_settings')}</summary>
      <div class="grid2">
        ${textField('be-name', t('ee.board_name'), box.name, (v) => {
          box.name = v || box.name;
          this._touch();
        })}
        ${textField('be-loc', t('ee.board_location'), box.location, (v) => {
          box.location = v || null;
          this._touch();
        })}
      </div>
      <div class="grid2">
        ${SIDES.map((side) =>
          textField(
            `be-side-${side}`,
            t('be.side_count', { side: t(`be.side.${side}`) }),
            box.sides[side] ?? 0,
            (v) => {
              box.sides = { ...box.sides, [side]: num(v) };
              this._touch();
            },
            { type: 'number' },
          ),
        )}
      </div>
      ${this._circuitsField('be-circuits', t('be.box_circuits'), box.circuits, (v) => {
        box.circuits = v;
        this._touch();
      })}
      ${textField('be-alert', t('ee.f.alert'), box.alert, (v) => {
        box.alert = v || null;
        this._touch();
      })}
      ${textField('be-notes', t('ee.f.notes'), box.notes, (v) => {
        box.notes = v || null;
        this._touch();
      })}
      <button class="btn danger" @click=${() => this._deleteBox(box)}>${t('be.delete_box')}</button>
    </details>`;
  }

  private _renderConnectors(box: Box): TemplateResult | typeof nothing {
    const t = this._t;
    const wagos = box.connectors.filter((k) => k.wire !== 'all');
    if (!wagos.length) return nothing;
    return html`<div class="form">
      <b>${t('box.connectors')}</b>
      ${wagos.map((k, i) => this._renderConnector(box, k, i))}
    </div>`;
  }

  private _renderConnector(box: Box, k: Connector, i: number): TemplateResult {
    const t = this._t;
    return html`<div class="be-k">
      <div class="grid2">
        ${textField(`be-k${i}-kind`, t('be.k_kind'), k.kind, (v) => {
          k.kind = v;
          this._touch();
        }, { suggestions: CONNECTOR_KINDS })}
        ${selectField(`be-k${i}-wire`, t('be.k_wire'), k.wire, WIRES.filter((w) => w !== 'all').map((w) => ({ value: w, label: t(`box.wire.${w}`) })), (v) => {
          k.wire = v as WireKind;
          this._touch();
        })}
      </div>
      ${selectField(`be-k${i}-circuit`, t('box.circuits'), k.circuit, [{ value: '', label: '?' }, ...this._circuitOptions()], (v) => {
        k.circuit = v || null;
        this._touch();
      })}
      <div class="f">
        <span class="lbl">${t('be.k_members')}</span>
        <div style="display:flex;flex-wrap:wrap;gap:4px 10px">
          ${box.conduits.map(
            (c) => html`<label class="small"
              ><input
                type="checkbox"
                .checked=${k.conduits.includes(c.id)}
                @change=${(e: Event) => {
                  k.conduits = (e.target as HTMLInputElement).checked ? [...k.conduits, c.id] : k.conduits.filter((x) => x !== c.id);
                  this._touch();
                }}
              />
              ${positionLabel(c, t)}${c.label ? ` ${c.label}` : ''}</label
            >`,
          )}
        </div>
      </div>
      <button
        class="btn danger"
        @click=${() => {
          box.connectors = box.connectors.filter((x) => x !== k);
          this._touch();
        }}
      >
        ${t('ee.delete')}
      </button>
    </div>`;
  }

  private _renderConduitForm(box: Box, c: Conduit): TemplateResult {
    const t = this._t;
    const joined = box.connectors
      .filter((k) => k.wire === 'all' && k.conduits.includes(c.id))
      .flatMap((k) => k.conduits.filter((id) => id !== c.id));
    const others = this._boxes.filter((b) => b.id !== box.id);
    const target = others.find((b) => b.id === c.end_box_id);
    const point = c.point ?? { kind: 'socket' as PointKind, label: '', room: null, count: 1, entity_id: null, alert: null };
    const setPoint = (patch: Partial<typeof point>) => {
      c.point = { ...point, ...patch };
      this._touch();
    };
    return html`
      <b>${t('box.conduit')} ${positionLabel(c, t)}</b>
      <div class="grid2">
        ${selectField('be-c-side', t('be.side_label'), c.side ?? '', [{ value: '', label: '?' }, ...SIDES.map((s) => ({ value: s, label: t(`be.side.${s}`) }))], (v) => {
          c.side = (v || null) as BoxSide | null;
          if (!c.side) c.position = null;
          this._touch();
        })}
        ${textField('be-c-pos', t('be.position'), c.position ?? '', (v) => {
          const n = Math.round(Number(v));
          c.position = c.side && v.trim() && n > 0 ? Math.min(48, n) : null;
          this._touch();
        }, { type: 'number', placeholder: '?' })}
      </div>
      ${textField('be-c-label', t('be.label'), c.label, (v) => {
        c.label = v || null;
        this._touch();
      }, { placeholder: t('be.label_ph') })}
      <div class="f">
        <span class="lbl">${t('be.joins')}</span>
        <div>
          ${joined.length
            ? joined.map((id) => {
                const o = box.conduits.find((x) => x.id === id);
                return html`<span class="chip"
                  >${o ? positionLabel(o, t) : '?'}
                  <button
                    class="icon-btn"
                    style="width:20px;height:20px"
                    aria-label=${t('be.unjoin')}
                    @click=${() => {
                      toggleJoin(box, c.id, id);
                      this._touch();
                    }}
                  >
                    ✕
                  </button></span
                >`;
              })
            : html`<span class="muted small">${t('be.no_join')}</span>`}
          <button class="btn" @click=${() => (this._linkFrom = c.id)}>${t('be.join')}</button>
        </div>
      </div>
      ${this._circuitsField('be-c-circuits', t('box.circuits'), c.circuits, (v) => {
        c.circuits = v;
        this._touch();
      })}
      ${selectField('be-c-end', t('box.leads_to'), c.end, ENDS.map((e) => ({ value: e, label: t(`be.end.${e}`) })), (v) => {
        c.end = v as ConduitEnd;
        if (c.end !== 'box') c.end_box_id = c.end_conduit_id = null;
        if (c.end === 'point' && !c.point) c.point = { ...point };
        if (c.end !== 'point') c.point = null;
        this._touch();
      })}
      ${c.end === 'box'
        ? html`<div class="grid2">
            ${selectField('be-c-tbox', t('be.box'), c.end_box_id ?? '', [{ value: '', label: '—' }, ...others.map((b) => ({ value: b.id, label: b.name }))], (v) => {
              c.end_box_id = v || null;
              c.end_conduit_id = null;
              this._touch();
            })}
            ${target
              ? selectField(
                  'be-c-tconduit',
                  t('be.entry'),
                  c.end_conduit_id ?? '',
                  [{ value: '', label: t('box.entry_unknown') }, ...target.conduits.map((x) => ({ value: x.id, label: `${positionLabel(x, t)}${x.label ? ` ${x.label}` : ''}` }))],
                  (v) => {
                    c.end_conduit_id = v || null;
                    this._touch();
                  },
                )
              : nothing}
          </div>`
        : nothing}
      ${c.end === 'point'
        ? html`<div class="grid2">
              ${selectField('be-p-kind', t('be.point_kind'), point.kind, POINT_KINDS.map((k) => ({ value: k, label: t(`box.point.${k}`) })), (v) =>
                setPoint({ kind: v as PointKind }),
              )}
              ${textField('be-p-count', t('be.count'), point.count, (v) => setPoint({ count: Math.max(1, Math.min(50, Math.round(Number(v)) || 1)) }), { type: 'number' })}
              ${textField('be-p-room', t('be.room'), point.room, (v) => setPoint({ room: v || null }))}
              ${textField('be-p-label', t('be.point_label'), point.label, (v) => setPoint({ label: v }))}
            </div>
            ${this.hass ? entityField(this.hass, 'be-p-entity', t('be.entity'), point.entity_id, null, (v) => setPoint({ entity_id: v })) : nothing}
            ${textField('be-p-alert', t('ee.f.alert'), point.alert, (v) => setPoint({ alert: v || null }))}`
        : nothing}
      <details>
        <summary>${t('be.conduit_more')}</summary>
        <div class="grid2">
          ${textField('be-c-kind', t('be.conduit_kind'), c.kind, (v) => {
            c.kind = v || null;
            this._touch();
          }, { suggestions: CONDUIT_KINDS })}
          ${textField('be-c-diam', t('be.diameter'), c.diameter_mm ?? '', (v) => {
            const n = Math.round(Number(v));
            c.diameter_mm = v.trim() && n >= 3 ? Math.min(160, n) : null;
            this._touch();
          }, { type: 'number' })}
          ${textField('be-c-cable', t('box.cable'), c.cable, (v) => {
            c.cable = v || null;
            this._touch();
          }, { suggestions: CABLES })}
          ${textField('be-c-len', t('be.length'), c.length_m ?? '', (v) => {
            const n = Number(v.replace(',', '.'));
            c.length_m = v.trim() && n >= 0 ? Math.min(500, n) : null;
            this._touch();
          }, { type: 'number' })}
        </div>
        ${textField('be-c-route', t('box.route'), c.route, (v) => {
          c.route = v || null;
          this._touch();
        })}
        ${textField('be-c-notes', t('ee.f.notes'), c.notes, (v) => {
          c.notes = v || null;
          this._touch();
        })}
      </details>
      <button class="btn danger" @click=${() => this._deleteConduit(box, c)}>${t('be.delete_conduit')}</button>
    `;
  }
}
