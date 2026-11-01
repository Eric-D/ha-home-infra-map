/** Electricity edit mode: edit directly on the drawing, side form, atomic save. */
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { errorCode, errorMessage, save, uploadPhoto } from '../api.js';
import { blankModule, deepClone, FeedIndex, moduleTitle, moveItem, newId } from '../helpers/electric.js';
import { translator, type Translate } from '../i18n.js';
import { cardStyles } from '../styles.js';
import type { Board, CircuitKind, Hass, Module, ModuleKind, ModuleStatus, Payload, Row } from '../types.js';
import { areaField, entityField, ensureHaElements, fire, selectField, textField } from '../ui.js';
import { linksFor, moduleSpan, railStyle, railUsage, renderFreeSlots, renderModule, renderSupply, type Links } from './electricity.js';

const KINDS: ModuleKind[] = ['breaker', 'rcd', 'rcbo', 'device', 'spacer'];
const RATINGS = [2, 6, 10, 16, 20, 25, 32, 40, 50, 63];
const RCD_RATINGS = [25, 40, 63, 80, 100];
const SENSITIVITIES = [10, 30, 100, 300, 500];
const RCD_TYPES = ['AC', 'A', 'F', 'B', '?'];
const CURVES = ['B', 'C', 'D', '?'];
const CABLES = [1.5, 2.5, 4, 6, 10, 16];
const HEAD_RATINGS = [15, 30, 45, 60, 90];
const HEAD_SENSITIVITIES = [300, 500, 650];
const STATUSES: ModuleStatus[] = ['active', 'off', 'spare'];
const CIRCUIT_KINDS: CircuitKind[] = ['lighting', 'sockets', 'dedicated', 'cooking', 'water_heater', 'heating', 'feeder', 'other', 'unknown'];

function boardCode(board: Board): string {
  for (const row of board.rows) for (const m of row.modules) {
    const match = /^([A-Za-z]+\d+)-/.exec(m.ref);
    if (match) return match[1];
  }
  return '';
}

export class HomeInfraMapElectricityEditor extends LitElement {
  static override styles = cardStyles;
  static override properties = {
    hass: { attribute: false },
    payload: { attribute: false },
    boardId: { attribute: false },
    _boards: { state: true },
    _selected: { state: true },
    _dirty: { state: true },
    _busy: { state: true },
    _error: { state: true },
    _dragOver: { state: true },
  };

  declare hass: Hass | undefined;
  declare payload: Payload | undefined;
  declare boardId: string | null;
  declare _boards: Board[];
  declare _selected: string | null;
  declare _dirty: boolean;
  declare _busy: string | null;
  declare _error: string | null;
  declare _dragOver: string | null;

  private _drag: { moduleId: string } | null = null;
  private _initialised = false;

  constructor() {
    super();
    this._boards = [];
    this._selected = null;
    this._dirty = false;
    this._busy = null;
    this._error = null;
    this._dragOver = null;
    this.boardId = null;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    void ensureHaElements().then(() => this.requestUpdate());
  }

  protected override willUpdate(): void {
    if (!this._initialised && this.payload) {
      this._initialised = true;
      this._boards = deepClone(this.payload.model.boards);
      if (!this._boards.length) this._addBoard(false);
      if (!this.boardId || !this._boards.some((b) => b.id === this.boardId)) this.boardId = this._boards[0]?.id ?? null;
    }
  }

  private get _t(): Translate {
    return translator((this.hass?.locale?.language ?? 'fr').startsWith('fr') ? 'fr' : 'en');
  }

  private get _lang(): string {
    return (this.hass?.locale?.language ?? 'fr').startsWith('fr') ? 'fr' : 'en';
  }

  private get _board(): Board | undefined {
    return this._boards.find((b) => b.id === this.boardId);
  }

  private _touch(): void {
    this._boards = [...this._boards];
    this._dirty = true;
  }

  /** Where a module sits: a rail (`row`) or the service entrance (`row` null). */
  private _locate(moduleId: string): { list: Module[]; row: Row | null; index: number } | null {
    for (const board of this._boards) {
      const supply = (board.supply ??= []);
      const s = supply.findIndex((m) => m.id === moduleId);
      if (s >= 0) return { list: supply, row: null, index: s };
      for (const row of board.rows) {
        const index = row.modules.findIndex((m) => m.id === moduleId);
        if (index >= 0) return { list: row.modules, row, index };
      }
    }
    return null;
  }

  private _patch(moduleId: string, patch: Partial<Module>): void {
    const loc = this._locate(moduleId);
    if (!loc) return;
    loc.list[loc.index] = { ...loc.list[loc.index], ...patch };
    this._touch();
  }

  private _addSupply(kind: 'meter' | 'main_breaker'): void {
    const board = this._board!;
    const code = boardCode(board) || `T${this._boards.indexOf(board) + 1}`;
    const module = blankModule(kind, `${code}-${kind === 'meter' ? 'CPT' : 'AGCP'}`);
    const supply = (board.supply ??= []);
    // the meter is upstream of the main breaker
    if (kind === 'meter') supply.unshift(module);
    else supply.push(module);
    this._selected = module.id;
    this._touch();
  }

  private _addBoard(touch = true): void {
    const n = this._boards.length + 1;
    const board: Board = { id: newId(), name: `Tableau ${n}`, location: null, area_id: null, photo_path: null, rows: [] };
    board.rows.push({ id: newId(), label: 'R1', modules: [blankModule('rcd', `T${n}-R1-ID`)] });
    this._boards = [...this._boards, board];
    this.boardId = board.id;
    if (touch) this._touch();
  }

  private _addRow(): void {
    const board = this._board;
    if (!board) return;
    const label = `R${board.rows.length + 1}`;
    const code = boardCode(board) || `T${this._boards.indexOf(board) + 1}`;
    board.rows.push({ id: newId(), label, modules: [blankModule('rcd', `${code}-${label}-ID`)] });
    this._touch();
  }

  private _addSpacer(row: Row): void {
    const board = this._board!;
    const code = boardCode(board) || `T${this._boards.indexOf(board) + 1}`;
    const n = row.modules.filter((m) => m.kind === 'spacer').length + 1;
    const module = blankModule('spacer', `${code}-${row.label}-V${n}`);
    row.modules.push(module);
    this._selected = module.id;
    this._touch();
  }

  private _addModule(row: Row): void {
    const board = this._board!;
    const code = boardCode(board) || `T${this._boards.indexOf(board) + 1}`;
    const n = row.modules.filter((m) => m.kind === 'breaker' || m.kind === 'rcbo').length + 1;
    const module = blankModule('breaker', `${code}-${row.label}-${n}`);
    row.modules.push(module);
    this._selected = module.id;
    this._touch();
  }

  private _delete(moduleId: string): void {
    const loc = this._locate(moduleId);
    if (!loc) return;
    const m = loc.list[loc.index];
    if (!window.confirm(this._t('edit.confirm_delete', { name: m.ref || m.circuit_name || m.label }))) return;
    loc.list.splice(loc.index, 1);
    this._selected = null;
    this._touch();
  }

  private _deleteRow(row: Row): void {
    const board = this._board!;
    if (!window.confirm(this._t('edit.confirm_delete', { name: row.label }))) return;
    board.rows = board.rows.filter((r) => r.id !== row.id);
    this._touch();
  }

  private _deleteBoard(): void {
    const board = this._board!;
    if (!window.confirm(this._t('edit.confirm_delete', { name: board.name }))) return;
    this._boards = this._boards.filter((b) => b.id !== board.id);
    this.boardId = this._boards[0]?.id ?? null;
    this._dirty = true;
  }

  private _move(moduleId: string, delta: number): void {
    const loc = this._locate(moduleId);
    if (!loc?.row) return;
    loc.row.modules = moveItem(loc.row.modules, loc.index, loc.index + delta);
    this._touch();
    void this.updateComplete.then(() =>
      this.renderRoot.querySelector<HTMLElement>(`[data-module-id="${moduleId}"]`)?.focus(),
    );
  }

  /** Drop `moduleId` before `targetId` (or at the end of `row` when targetId is null). */
  moveTo(moduleId: string, row: Row, targetId: string | null): void {
    const from = this._locate(moduleId);
    if (!from?.row || moduleId === targetId) return;
    const [module] = from.list.splice(from.index, 1);
    const index = targetId ? row.modules.findIndex((m) => m.id === targetId) : -1;
    if (index < 0) row.modules.push(module);
    else row.modules.splice(index, 0, module);
    this._touch();
  }

  private async _upload(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    const board = this._board;
    if (!file || !board || !this.hass) return;
    this._busy = this._t('ee.photo_uploading');
    try {
      board.photo_path = await uploadPhoto(this.hass, board.id, file);
      this._touch();
    } catch (err) {
      this._error = this._t('edit.failed', { error: errorMessage(err) });
    } finally {
      this._busy = null;
      input.value = '';
    }
  }

  private async _save(): Promise<void> {
    if (!this.hass || !this.payload) return;
    this._busy = '…';
    this._error = null;
    try {
      await save(this.hass, 'boards', this._boards, this.payload.section_revisions.boards);
      this._dirty = false;
      fire(this, 'him-saved', { boardId: this.boardId });
    } catch (err) {
      const code = errorCode(err);
      if (code === 'conflict') fire(this, 'him-conflict');
      else if (code === 'unauthorized') this._error = this._t('edit.refused');
      else this._error = this._t('edit.failed', { error: errorMessage(err) });
    } finally {
      this._busy = null;
    }
  }

  private _cancel(): void {
    if (this._dirty && !window.confirm(this._t('edit.unsaved') + ' — ' + this._t('edit.cancel') + ' ?')) return;
    fire(this, 'him-cancel');
  }

  protected override render(): TemplateResult {
    const t = this._t;
    const board = this._board;
    const selected = this._selected ? this._locate(this._selected) : null;
    const index = new FeedIndex(this._boards);
    const links = linksFor(index, this._selected);
    const supply = board?.supply ?? [];
    return html`
      <div class="toolbar">
        ${this._boards.length > 1
          ? selectField('ee-board', t('el.board'), this.boardId, this._boards.map((b) => ({ value: b.id, label: b.name })), (v) => {
              this.boardId = v;
              this._selected = null;
            })
          : nothing}
        <span style="flex:1"></span>
        ${this._dirty ? html`<span class="badge warn">${t('edit.unsaved')}</span>` : nothing}
        <button class="btn" @click=${this._cancel}>${t('edit.cancel')}</button>
        <button class="btn pri" ?disabled=${!!this._busy || !this._dirty} @click=${this._save}>${t('edit.save')}</button>
      </div>
      ${this._error ? html`<div class="banner" role="alert">${this._error}</div>` : nothing}
      ${this._busy && this._busy !== '…' ? html`<div class="banner info">${this._busy}</div>` : nothing}
      ${board
        ? html`<div class="ed">
            <div style="display:flex;flex-direction:column;gap:8px;min-width:0">
              <div class="grid2">
                ${textField('ee-bname', t('ee.board_name'), board.name, (v) => {
                  board.name = v;
                  this._touch();
                })}
                ${textField('ee-bloc', t('ee.board_location'), board.location, (v) => {
                  board.location = v || null;
                  this._touch();
                })}
              </div>
              ${textField(
                'ee-bslots',
                t('ee.board_slots'),
                board.modules_per_row ?? '',
                (v) => {
                  const n = Math.round(Number(v));
                  board.modules_per_row = v.trim() && n > 0 ? Math.min(96, n) : null;
                  this._touch();
                },
                { type: 'number' },
              )}
              ${this.hass
                ? areaField(this.hass, 'ee-barea', t('ee.board_area'), board.area_id, false, (v) => {
                    board.area_id = v[0] ?? null;
                    this._touch();
                  })
                : nothing}
              ${this._boards.length > 1
                ? selectField(
                    'ee-bfed',
                    t('ee.board_fed_by'),
                    board.fed_by ?? '',
                    [
                      { value: '', label: '—' },
                      ...[...index.modules.values()]
                        .filter((m) => index.boardOf.get(m.id)?.id !== board.id && m.kind !== 'spacer')
                        .map((m) => ({ value: m.id, label: this._optionLabel(m, index, board) })),
                    ],
                    (v) => {
                      board.fed_by = v || null;
                      this._touch();
                    },
                  )
                : nothing}
              <span class="muted small">${t('ee.select_hint')}</span>
              <div class=${links.up.size || links.down.size ? 'board linking' : 'board'}>
                ${renderSupply(board, {
                  hass: this.hass,
                  t,
                  lang: this._lang,
                  selectedModuleId: this._selected,
                  links,
                  onSelectModule: (id) => (this._selected = id),
                  extra: html`${supply.some((m) => m.kind === 'meter')
                    ? nothing
                    : html`<button class="btn" @click=${() => this._addSupply('meter')}>${t('ee.add_meter')}</button>`}
                  ${supply.some((m) => m.kind === 'main_breaker')
                    ? nothing
                    : html`<button class="btn" @click=${() => this._addSupply('main_breaker')}>${t('ee.add_main_breaker')}</button>`}`,
                })}
                ${board.rows.map((row) => this._renderRail(row, links))}
              </div>
              <div class="btns">
                <button class="btn" @click=${this._addRow}>${t('ee.add_row')}</button>
                <button class="btn" @click=${() => this._addBoard()}>${t('ee.add_board')}</button>
                <label class="btn" style="display:inline-flex;align-items:center">
                  ${t('ee.photo_upload')}
                  <input type="file" accept="image/*" style="display:none" @change=${this._upload} />
                </label>
                ${board.photo_path
                  ? html`<button class="btn" @click=${() => {
                      board.photo_path = null;
                      this._touch();
                    }}>${t('ee.photo_remove')}</button>`
                  : nothing}
                <button class="btn danger" @click=${this._deleteBoard}>${t('ee.delete_board')}</button>
              </div>
            </div>
            ${selected ? this._renderForm(selected.list[selected.index], selected.row, index) : html`<div class="form muted">${t('ee.select_hint')}</div>`}
          </div>`
        : nothing}
    `;
  }

  private _optionLabel(m: Module, index: FeedIndex, board: Board | undefined): string {
    const t = this._t;
    const other = index.boardOf.get(m.id);
    const name = `${m.ref || '—'} · ${t(`el.kind.${m.kind}`)} ${moduleTitle(m)}`;
    const circuit = (m.kind === 'breaker' || m.kind === 'rcbo') && m.circuit_name && m.circuit_name !== '?' ? ` · ${m.circuit_name}` : '';
    return `${name}${circuit}${other && board && other.id !== board.id ? ` (${other.name})` : ''}`;
  }

  private _renderRail(row: Row, links?: Links): TemplateResult {
    const t = this._t;
    return html`<div
      class="rail"
      style=${railStyle(railUsage(this._board ?? null, row).capacity)}
      data-row-id=${row.id}
      @dragover=${(e: DragEvent) => {
        if (this._drag) e.preventDefault();
      }}
      @drop=${(e: DragEvent) => {
        e.preventDefault();
        if (this._drag && !(e.target as HTMLElement).closest('[data-module-id]')) this.moveTo(this._drag.moduleId, row, null);
        this._drag = null;
        this._dragOver = null;
      }}
    >
      <span class="rl">${row.label}</span>
      ${row.modules.map(
        (m) => html`<div
          draggable="true"
          style=${`grid-column:span ${moduleSpan(m)}`}
          class=${this._dragOver === m.id ? 'cell drag-wrap' : 'cell'}
          @dragstart=${(e: DragEvent) => {
            this._drag = { moduleId: m.id };
            e.dataTransfer?.setData('text/plain', m.id);
          }}
          @dragend=${() => {
            this._drag = null;
            this._dragOver = null;
          }}
          @dragover=${(e: DragEvent) => {
            if (!this._drag) return;
            e.preventDefault();
            this._dragOver = m.id;
          }}
          @drop=${(e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (this._drag) this.moveTo(this._drag.moduleId, row, m.id);
            this._drag = null;
            this._dragOver = null;
          }}
        >
          ${renderModule(m, {
            hass: this.hass,
            t,
            lang: this._lang,
            selected: m.id === this._selected || this._dragOver === m.id,
            warned: false,
            link: links?.up.has(m.id) ? 'up' : links?.down.has(m.id) ? 'down' : null,
            feeder: m.fed_by ? links?.index.feeder(m) : null,
            onClick: () => (this._selected = m.id),
          })}
        </div>`,
      )}
      ${(() => {
        const usage = railUsage(this._board ?? null, row);
        return usage.capacity !== null ? renderFreeSlots(usage.capacity - usage.used) : nothing;
      })()}
      <button class="add" aria-label=${t('ee.add_module', { label: row.label })} @click=${() => this._addModule(row)}>+</button>
      <button class="add add-sp" aria-label=${t('ee.add_spacer', { label: row.label })} title=${t('ee.add_spacer', { label: row.label })} @click=${() => this._addSpacer(row)}>▢</button>
    </div>
    ${(() => {
      const usage = railUsage(this._board ?? null, row);
      return html`<div class=${usage.over ? 'rail-meta over' : 'rail-meta'}>
        ${row.label} · ${usage.capacity !== null ? t('el.slots', { used: usage.used, capacity: usage.capacity }) : t('el.slots_unknown', { used: usage.used })}
      </div>`;
    })()}`;
  }

  private _renderForm(m: Module, row: Row | null, feeds: FeedIndex): TemplateResult {
    const t = this._t;
    const hass = this.hass!;
    const p = (patch: Partial<Module>) => this._patch(m.id, patch);
    const num = (v: string) => (v === '' || v === '?' ? null : Number(v));
    const isCircuit = m.kind === 'breaker' || m.kind === 'rcbo';
    const isRcd = m.kind === 'rcd' || m.kind === 'rcbo';
    const board = this._board;
    const auto = feeds.defaultFeeder(m);
    const fedField = html`${selectField(
        'ee-fed',
        t('ee.f.fed_by'),
        m.fed_by ?? '',
        [
          { value: '', label: t('ee.f.fed_auto', { ref: auto ? auto.ref || t(`el.kind.${auto.kind}`) : t('ee.f.fed_none') }) },
          ...feeds.candidates(m).map((c) => ({ value: c.id, label: this._optionLabel(c, feeds, board) })),
        ],
        (v) => p({ fed_by: v || null }),
      )}
      <span class="muted small">${t('ee.fed_hint')}</span>`;
    const statusField =
      m.kind === 'spacer'
        ? nothing
        : selectField('ee-status', t('ee.f.status'), m.status ?? 'active', STATUSES.map((x) => ({ value: x, label: t(`el.status.${x}`) })), (v) =>
            p({ status: v as ModuleStatus }),
          );
    const alertField = html`${textField('ee-alert', t('ee.f.alert'), m.alert, (v) => p({ alert: v.trim() ? v : null }), {
        suggestions: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => t(`ee.alert.s${i}`)),
        hint: html`<span class="muted small">${t('ee.alert_hint')}</span>`,
      })}
      ${m.alert
        ? selectField(
            'ee-alert-level',
            t('ee.f.alert_level'),
            m.alert_level ?? 'warning',
            (['warning', 'info'] as const).map((x) => ({ value: x, label: t(`ee.alert_level.${x}`) })),
            (v) => p({ alert_level: v as 'warning' | 'info' }),
          )
        : nothing}`;
    if (!row) return this._renderSupplyForm(m, fedField, statusField, alertField);
    const index = row.modules.indexOf(m);
    return html`<div class="form" aria-label=${m.ref}>
      <b>${m.ref || '—'}</b>
      ${selectField('ee-kind', t('ee.f.kind'), m.kind, KINDS.map((k) => ({ value: k, label: t(`el.kind.${k}`) })), (v) =>
        p({ kind: v as ModuleKind, width_modules: v === 'rcd' ? Math.max(2, m.width_modules) : m.width_modules }),
      )}
      ${textField('ee-ref', t('ee.f.ref'), m.ref, (v) => p({ ref: v }))}
      ${statusField}
      ${m.kind !== 'spacer' ? alertField : nothing}
      ${m.kind !== 'spacer' ? fedField : nothing}
      ${isCircuit
        ? html`<div class="grid2">
            ${selectField('ee-rating', t('ee.f.rating'), m.rating_a ?? '?', [...RATINGS.map((r) => ({ value: r, label: `${r} A` })), { value: '?', label: '?' }], (v) => p({ rating_a: num(v) }))}
            ${selectField('ee-curve', ' ', m.curve, CURVES.map((c) => ({ value: c, label: c })), (v) => p({ curve: v as Module['curve'] }))}
          </div>`
        : nothing}
      ${m.kind === 'rcd'
        ? selectField('ee-rcdr', t('ee.f.rcd_rating'), m.rating_a ?? '?', [...RCD_RATINGS.map((r) => ({ value: r, label: `${r} A` })), { value: '?', label: '?' }], (v) => p({ rating_a: num(v) }))
        : nothing}
      ${isRcd
        ? html`<div class="grid2">
            ${selectField('ee-sens', t('ee.f.sensitivity'), m.sensitivity_ma ?? '?', [...SENSITIVITIES.map((s) => ({ value: s, label: `${s} mA` })), { value: '?', label: '?' }], (v) => p({ sensitivity_ma: num(v) }))}
            ${selectField('ee-rcdt', t('ee.f.rcd_type'), m.rcd_type, RCD_TYPES.map((x) => ({ value: x, label: x })), (v) => p({ rcd_type: v as Module['rcd_type'] }))}
          </div>`
        : nothing}
      ${isCircuit
        ? html`
            ${textField('ee-circ', t('ee.f.circuit'), m.circuit_name, (v) => p({ circuit_name: v }))}
            ${selectField('ee-ck', t('ee.f.circuit_kind'), m.circuit_kind, CIRCUIT_KINDS.map((k) => ({ value: k, label: t(`ck.kind.${k}`) })), (v) => p({ circuit_kind: v as CircuitKind }))}
            ${areaField(hass, 'ee-areas', t('ee.f.areas'), m.area_ids, true, (v) => p({ area_ids: v }))}
            ${selectField('ee-cable', t('ee.f.cable'), m.cable_mm2 ?? '', [{ value: '', label: '?' }, ...CABLES.map((c) => ({ value: c, label: `${String(c).replace('.', this._lang === 'fr' ? ',' : '.')} mm²` }))], (v) => p({ cable_mm2: v ? Number(v) : null }))}
          `
        : nothing}
      ${m.kind === 'device'
        ? html`${textField('ee-label', t('ee.f.label'), m.label, (v) => p({ label: v }))}
          ${textField('ee-ents', t('ee.f.entities'), m.entity_ids.join(', '), (v) =>
            p({ entity_ids: v.split(',').map((x) => x.trim()).filter((x) => /^[a-z0-9_]+\.[a-z0-9_]+$/.test(x)) }),
          )}`
        : nothing}
      ${isCircuit || m.kind === 'device'
        ? html`${entityField(hass, 'ee-power', t('ee.f.power'), m.power_entity_id, 'power', (v) => p({ power_entity_id: v }))}
          ${entityField(hass, 'ee-energy', t('ee.f.energy'), m.energy_entity_id, 'energy', (v) => p({ energy_entity_id: v }))}
          ${entityField(hass, 'ee-switch', t('ee.f.switch'), m.switch_entity_id, null, (v) => p({ switch_entity_id: v }), ['switch', 'light', 'input_boolean'])}`
        : nothing}
      ${m.kind !== 'spacer' ? textField('ee-model', t('ee.f.model'), m.model, (v) => p({ model: v || null })) : nothing}
      ${textField('ee-width', t('ee.f.width'), m.width_modules, (v) => p({ width_modules: Math.max(1, Math.min(24, Number(v) || 1)) }), { type: 'number' })}
      <div class="f">
        <label for="ee-notes">${t('ee.f.notes')}</label>
        <textarea class="inp" id="ee-notes" rows="3" .value=${m.notes ?? ''} @input=${(e: Event) => p({ notes: (e.target as HTMLTextAreaElement).value || null })}></textarea>
      </div>
      <div class="btns">
        <button class="btn" ?disabled=${index <= 0} @click=${() => this._move(m.id, -1)}>${t('ee.move_left')}</button>
        <button class="btn" ?disabled=${index >= row.modules.length - 1} @click=${() => this._move(m.id, 1)}>${t('ee.move_right')}</button>
        <button class="btn danger" @click=${() => this._delete(m.id)}>${t('ee.delete')}</button>
      </div>
      <div class="btns">
        ${textField('ee-row', t('ee.row_label'), row.label, (v) => {
          row.label = v;
          this._touch();
        })}
        ${textField(
          'ee-rcap',
          t('ee.row_capacity'),
          row.capacity ?? '',
          (v) => {
            const n = Math.round(Number(v));
            row.capacity = v.trim() && n > 0 ? Math.min(96, n) : null;
            this._touch();
          },
          { type: 'number' },
        )}
        <button class="btn danger" @click=${() => this._deleteRow(row)}>${t('ee.delete_row')}</button>
      </div>
    </div>`;
  }

  private _renderSupplyForm(
    m: Module,
    fedField: TemplateResult,
    statusField: TemplateResult | typeof nothing,
    alertField: TemplateResult,
  ): TemplateResult {
    const t = this._t;
    const hass = this.hass!;
    const p = (patch: Partial<Module>) => this._patch(m.id, patch);
    const num = (v: string) => (v === '' || v === '?' ? null : Number(v));
    return html`<div class="form" aria-label=${m.ref}>
      <b>${t(`el.kind.${m.kind}`)}</b>
      ${textField('ee-ref', t('ee.f.ref'), m.ref, (v) => p({ ref: v }))}
      ${textField('ee-model', t('ee.f.model'), m.model, (v) => p({ model: v || null }))}
      ${m.kind === 'meter'
        ? textField(
            'ee-kva',
            t('ee.f.kva'),
            m.subscribed_kva ?? '',
            (v) => {
              const n = Number(v.replace(',', '.'));
              p({ subscribed_kva: v.trim() && n > 0 ? n : null });
            },
            { type: 'number' },
          )
        : html`<div class="grid2">
            ${selectField('ee-hr', t('ee.f.head_rating'), m.rating_a ?? '?', [...HEAD_RATINGS.map((r) => ({ value: r, label: `${r} A` })), { value: '?', label: '?' }], (v) => p({ rating_a: num(v) }))}
            ${selectField('ee-hs', t('ee.f.sensitivity'), m.sensitivity_ma ?? '?', [...HEAD_SENSITIVITIES.map((x) => ({ value: x, label: `${x} mA` })), { value: '?', label: '?' }], (v) => p({ sensitivity_ma: num(v) }))}
          </div>`}
      ${statusField}
      ${alertField}
      ${fedField}
      ${entityField(hass, 'ee-power', t('ee.f.power'), m.power_entity_id, 'power', (v) => p({ power_entity_id: v }))}
      ${entityField(hass, 'ee-energy', t('ee.f.energy'), m.energy_entity_id, 'energy', (v) => p({ energy_entity_id: v }))}
      <div class="f">
        <label for="ee-notes">${t('ee.f.notes')}</label>
        <textarea class="inp" id="ee-notes" rows="3" .value=${m.notes ?? ''} @input=${(e: Event) => p({ notes: (e.target as HTMLTextAreaElement).value || null })}></textarea>
      </div>
      <div class="btns">
        <button class="btn danger" @click=${() => this._delete(m.id)}>${t('ee.delete_supply')}</button>
      </div>
    </div>`;
  }
}
