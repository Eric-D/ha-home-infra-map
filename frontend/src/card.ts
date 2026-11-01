/** custom:home-infra-map-card — lifecycle, data loading and the registration block. */
import { html, LitElement, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import {
  errorCode,
  errorMessage,
  exportYaml,
  fetchPayload,
  generateDashboard,
  history24h,
  importYaml,
  signedPhotoUrl,
  subscribe,
  type ModelEvent,
} from './api.js';
import { HomeInfraMapCardEditor } from './editor.js';
import { counts } from './helpers/network.js';
import { cardSize, gridOptions, type GridOptions } from './helpers/grid.js';
import { parseHistory, type Point } from './helpers/sparkline.js';
import { langOf, translator, type Translate } from './i18n.js';
import { log } from './log.js';
import { defineOnce, scheduleRepairs } from './register.js';
import { cardStyles } from './styles.js';
import type { Board, CardConfig, CardView, Hass, NetworkView, Payload } from './types.js';
import { copyText, moreInfo, toast } from './ui.js';
import { CARD_VERSION } from './version.js';
import { HomeInfraMapDeviceSheet } from './views/device-sheet.js';
import { HomeInfraMapElectricityEditor } from './views/electricity-edit.js';
import { renderElectricity } from './views/electricity.js';
import type { NetCtx } from './views/network-common.js';
import { HomeInfraMapNetworkEditor } from './views/network-edit.js';
import { renderSwitch } from './views/network-switch.js';
import { renderTopology } from './views/network-topology.js';
import { renderVlans } from './views/network-vlan.js';

export const CARD_TAG = 'home-infra-map-card';
const EDITOR_TAG = 'home-infra-map-card-editor';

let instances = 0;

interface DialogState {
  kind: 'export' | 'import' | 'dashboard' | 'photo';
  text: string;
  busy?: boolean;
  url?: string;
}


/** home-infra-map-export-2026-11-01.yaml */
export function yamlFilename(kind: 'export' | 'dashboard', now: Date = new Date()): string {
  const day = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return `home-infra-map-${kind}-${day}.yaml`;
}

/** Save text as a file, client side (no server round trip, nothing public). */
export function downloadText(filename: string, text: string): void {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/yaml;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export class HomeInfraMapCard extends LitElement {
  static override styles = cardStyles;
  static override properties = {
    hass: { attribute: false },
    _config: { state: true },
    _payload: { state: true },
    _error: { state: true },
    _view: { state: true },
    _networkView: { state: true },
    _boardId: { state: true },
    _moduleId: { state: true },
    _history: { state: true },
    _showWarnings: { state: true },
    _deviceId: { state: true },
    _sheetTab: { state: true },
    _switchId: { state: true },
    _port: { state: true },
    _edit: { state: true },
    _editKey: { state: true },
    _dialog: { state: true },
  };

  declare hass: Hass | undefined;
  declare _config: CardConfig | undefined;
  declare _payload: Payload | undefined;
  declare _error: string | undefined;
  declare _view: CardView;
  declare _networkView: NetworkView;
  declare _boardId: string | null;
  declare _moduleId: string | null;
  declare _history: Point[] | null;
  declare _showWarnings: boolean;
  declare _deviceId: string | null;
  declare _sheetTab: 'info' | 'firewall' | 'history';
  declare _switchId: string | null;
  declare _port: number | null;
  declare _edit: boolean;
  declare _editKey: number;
  declare _dialog: DialogState | null;

  private readonly _instance = ++instances;
  private _unsub: (() => void) | null = null;
  private _subscribing = false;
  private _retryTimer: number | undefined;
  private _retries = 0;
  private _firstRender = true;
  private _viewFromConfig = false;
  private _historyFor: string | null = null;

  static getConfigElement(): HTMLElement {
    return document.createElement(EDITOR_TAG);
  }

  static getStubConfig(): CardConfig {
    return { type: `custom:${CARD_TAG}`, view: 'electricity' };
  }

  constructor() {
    super();
    this._view = 'electricity';
    this._networkView = 'topology';
    this._boardId = null;
    this._moduleId = null;
    this._history = null;
    this._showWarnings = false;
    this._deviceId = null;
    this._sheetTab = 'info';
    this._switchId = null;
    this._port = null;
    this._edit = false;
    this._editKey = 0;
    this._dialog = null;
  }

  /** Tolerant: only a non-object config is an error (transient editor states must not break the card). */
  setConfig(config: CardConfig): void {
    if (!config || typeof config !== 'object') {
      log('error', 'card', '#%d setConfig rejected: %o', this._instance, config);
      throw new Error('Invalid configuration');
    }
    this._config = config;
    this._viewFromConfig = !!config.view;
    if (config.view === 'electricity' || config.view === 'network') this._view = config.view;
    if (config.network_view && ['topology', 'vlan', 'switch'].includes(config.network_view)) this._networkView = config.network_view;
    if (config.board) this._boardId = config.board;
    log('info', 'card', '#%d setConfig accepted at t=%dms', this._instance, Math.round(performance.now()));
  }

  getCardSize(): number {
    return cardSize();
  }

  getGridOptions(): GridOptions {
    return gridOptions();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._retries = 0;
    if (this.hass && !this._unsub) void this._load();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearTimeout(this._retryTimer);
    this._retryTimer = undefined;
    this._unsub?.();
    this._unsub = null;
  }

  protected override willUpdate(changed: PropertyValues): void {
    if (changed.has('hass') && this.hass && !this._unsub && !this._subscribing && this.isConnected && this._retryTimer === undefined) {
      void this._load();
    }
  }

  private get _lang(): string {
    return langOf(this.hass);
  }

  private get _t(): Translate {
    return translator(this._lang);
  }

  private async _load(): Promise<void> {
    if (!this.hass || this._subscribing) return;
    this._subscribing = true;
    try {
      const payload = await fetchPayload(this.hass);
      this._applyPayload(payload);
      this._error = undefined;
      const unsub = await subscribe(this.hass, (ev) => this._onEvent(ev));
      if (!this.isConnected) {
        void unsub();
        return;
      }
      this._unsub = () => void unsub();
    } catch (err) {
      const code = errorCode(err);
      this._error = code === 'not_configured' ? this._t('card.not_configured') : this._t('card.error', { error: errorMessage(err) });
      log('warn', 'card', '#%d load failed (%s)', this._instance, code);
      if (code !== 'not_configured' && this._retries < 10) {
        this._retries += 1;
        this._retryTimer = window.setTimeout(() => {
          this._retryTimer = undefined;
          void this._load();
        }, Math.min(2000 * this._retries, 15000));
      }
    } finally {
      this._subscribing = false;
    }
  }

  private _applyPayload(payload: Payload): void {
    this._payload = payload;
    if (!this._viewFromConfig && payload.settings.default_view) this._view = payload.settings.default_view;
    this._viewFromConfig = true;
    if (!this._boardId || !payload.model.boards.some((b) => b.id === this._boardId)) {
      this._boardId = payload.model.boards[0]?.id ?? null;
    }
  }

  private _onEvent(ev: ModelEvent): void {
    if (ev.kind === 'model') {
      const { kind: _kind, ...payload } = ev;
      this._applyPayload(payload as Payload);
    } else if (ev.kind === 'live' && this._payload) {
      this._payload = { ...this._payload, live: ev.live };
    }
  }

  protected override updated(): void {
    if (this.getAttribute('lang') !== this._lang) this.setAttribute('lang', this._lang);
    if (this._firstRender && this._payload) {
      this._firstRender = false;
      log('info', 'card', '#%d first render with data at t=%dms (v%s)', this._instance, Math.round(performance.now()), CARD_VERSION);
    }
    this.dispatchEvent(new CustomEvent('home-infra-map-card-update', { bubbles: true, composed: true }));
  }

  private get _board(): Board | null {
    return this._payload?.model.boards.find((b) => b.id === this._boardId) ?? null;
  }

  private _selectModule(id: string | null): void {
    this._moduleId = id;
    this._history = null;
    const module = id ? this._board?.rows.flatMap((r) => r.modules).find((m) => m.id === id) : undefined;
    const entity = module?.power_entity_id;
    if (!entity || !this.hass) return;
    this._historyFor = entity;
    history24h(this.hass, [entity])
      .then((h) => {
        if (this._historyFor === entity) this._history = parseHistory(h[entity]);
      })
      .catch(() => (this._history = []));
  }

  private async _openPhoto(): Promise<void> {
    const board = this._board;
    if (!board?.photo_path || !this.hass) return;
    this._dialog = { kind: 'photo', text: board.name, busy: true };
    try {
      const url = await signedPhotoUrl(this.hass, board.id, board.photo_path.split('?v=')[1] ?? '');
      this._dialog = { kind: 'photo', text: board.name, url };
    } catch (err) {
      this._dialog = null;
      toast(this, this._t('card.error', { error: errorMessage(err) }));
    }
  }

  private async _tool(kind: 'export' | 'import' | 'dashboard'): Promise<void> {
    if (!this.hass) return;
    if (kind === 'import') {
      this._dialog = { kind, text: '' };
      return;
    }
    this._dialog = { kind, text: '', busy: true };
    try {
      const res = kind === 'export' ? await exportYaml(this.hass) : await generateDashboard(this.hass);
      this._dialog = { kind, text: res.yaml };
    } catch (err) {
      this._dialog = { kind, text: this._t('card.error', { error: errorMessage(err) }) };
    }
  }

  private async _readImportFile(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file || !this._dialog) return;
    if (file.size > 2 * 1024 * 1024) {
      toast(this, this._t('tools.file_too_large'));
      return;
    }
    this._dialog = { ...this._dialog, text: await file.text() };
  }

  private async _runImport(): Promise<void> {
    if (!this.hass || !this._dialog) return;
    this._dialog = { ...this._dialog, busy: true };
    try {
      const res = await importYaml(this.hass, this._dialog.text);
      toast(this, this._t('tools.import_done', res));
      this._dialog = null;
      this._editKey += 1;
    } catch (err) {
      const msg = errorCode(err) === 'unauthorized' ? this._t('edit.refused') : this._t('card.error', { error: errorMessage(err) });
      this._dialog = { ...this._dialog!, busy: false };
      toast(this, msg);
    }
  }

  private async _onConflict(): Promise<void> {
    toast(this, this._t('edit.conflict'));
    if (this.hass) {
      try {
        this._applyPayload(await fetchPayload(this.hass));
      } catch {
        /* the subscription will catch up */
      }
    }
    this._editKey += 1;
  }

  protected override render(): TemplateResult {
    const t = this._t;
    if (!this._payload) {
      return html`<ha-card>
        <div class="head"><span class="title">${this._config?.title ?? t('card.name')}</span></div>
        <div class="body">
          ${this._error
            ? html`<div class="banner" role="alert">${this._error}</div>
                <div class="btns"><button class="btn" @click=${() => { this._retries = 0; void this._load(); }}>${t('card.retry')}</button></div>`
            : html`<div class="muted" role="status">${t('card.loading')}</div>`}
        </div>
      </ha-card>`;
    }
    const admin = !!this.hass?.user?.is_admin;
    return html`<ha-card>
      ${this._renderHeader(admin)}
      <div class="body">
        ${this._edit && admin ? this._renderEdit() : this._view === 'electricity' ? this._renderElectricity() : this._renderNetwork()}
      </div>
      ${this._deviceId
        ? html`<home-infra-map-device-sheet
            .hass=${this.hass}
            .payload=${this._payload}
            .deviceId=${this._deviceId}
            .tab=${this._sheetTab}
            @close=${() => (this._deviceId = null)}
          ></home-infra-map-device-sheet>`
        : nothing}
      ${this._dialog ? this._renderDialog() : nothing}
    </ha-card>`;
  }

  private _renderHeader(admin: boolean): TemplateResult {
    const t = this._t;
    const board = this._board;
    let title = this._config?.title;
    if (!title) {
      title = this._view === 'electricity' && board ? [board.name, board.location].filter(Boolean).join(' · ') : t('view.network');
    }
    if (this._edit) title = t('edit.title', { name: this._view === 'electricity' ? board?.name ?? t('view.electricity') : t('view.network') });
    return html`<div class="head">
      <span class="title">${title}</span>
      <div class="head-actions">
        ${this._edit
          ? html`<button class="btn" @click=${() => this._tool('export')}>${t('tools.export')}</button>
              <button class="btn" @click=${() => this._tool('import')}>${t('tools.import')}</button>
              <button class="btn" @click=${() => this._tool('dashboard')}>${t('tools.dashboard')}</button>`
          : nothing}
        <div class="seg" role="tablist" aria-label=${t('card.name')}>
          ${(['electricity', 'network'] as CardView[]).map(
            (v) => html`<button role="tab" aria-selected=${this._view === v ? 'true' : 'false'} @click=${() => {
              this._view = v;
              this._moduleId = null;
            }}>${t(`view.${v}`)}</button>`,
          )}
        </div>
        ${admin
          ? html`<button
              class="icon-btn"
              aria-label=${this._edit ? t('edit.close') : t('edit.open')}
              aria-pressed=${this._edit ? 'true' : 'false'}
              title=${this._edit ? t('edit.close') : t('edit.open')}
              @click=${() => {
                this._edit = !this._edit;
                this._editKey += 1;
              }}
            >
              ${customElements.get('ha-icon')
                ? html`<ha-icon icon=${this._edit ? 'mdi:close' : 'mdi:pencil'}></ha-icon>`
                : this._edit ? '✕' : '✎'}
            </button>`
          : nothing}
      </div>
    </div>`;
  }

  private _renderElectricity(): TemplateResult {
    return renderElectricity({
      hass: this.hass,
      payload: this._payload!,
      t: this._t,
      lang: this._lang,
      board: this._board,
      selectedModuleId: this._moduleId,
      showWarnings: this._showWarnings,
      history: this._history,
      historyRange: [Date.now() - 24 * 3600 * 1000, Date.now()],
      hasPhoto: !!this._board?.photo_path,
      onSelectBoard: (id) => {
        this._boardId = id;
        this._moduleId = null;
      },
      onSelectModule: (id) => this._selectModule(id),
      onToggleWarnings: () => (this._showWarnings = !this._showWarnings),
      onOpenPhoto: () => void this._openPhoto(),
      onMoreInfo: (eid) => moreInfo(this, eid),
    });
  }

  private _renderNetwork(): TemplateResult {
    const t = this._t;
    const payload = this._payload!;
    const ctx: NetCtx = {
      hass: this.hass,
      payload,
      t,
      lang: this._lang,
      onOpenDevice: (id) => {
        this._deviceId = id;
        this._sheetTab = 'info';
      },
    };
    const c = counts(payload, this.hass);
    return html`
      <div class="toolbar">
        <div class="seg" role="tablist" aria-label=${t('view.network')}>
          ${(['topology', 'vlan', 'switch'] as NetworkView[]).map(
            (v) => html`<button role="tab" aria-selected=${this._networkView === v ? 'true' : 'false'} @click=${() => (this._networkView = v)}>
              ${t(`nview.${v}`)}
            </button>`,
          )}
        </div>
      </div>
      <div class="chips">
        <span class="chip"><span class="dot"></span>${t('net.online', { n: c.online })}</span>
        ${c.offline ? html`<span class="chip"><span class="dot bad"></span>${t('net.offline', { n: c.offline })}</span>` : nothing}
        ${payload.live.opnsense.gateways.map(
          (g) => html`<span class="chip"><span class=${g.online ? 'dot' : 'dot bad'}></span>${t('net.gateway', { name: g.name, delay: g.delay ?? '' })}</span>`,
        )}
      </div>
      ${!payload.live.ping_available ? html`<div class="banner info">${t('net.ping_unavailable')}</div>` : nothing}
      ${this._networkView === 'topology' ? renderTopology(ctx) : nothing}
      ${this._networkView === 'vlan' ? renderVlans(ctx) : nothing}
      ${this._networkView === 'switch'
        ? renderSwitch({
            ...ctx,
            switchId: this._switchId,
            selectedPort: this._port,
            onSelectSwitch: (id) => {
              this._switchId = id;
              this._port = null;
            },
            onSelectPort: (p) => (this._port = p),
          })
        : nothing}
    `;
  }

  private _renderEdit(): unknown {
    const onSaved = () => toast(this, this._t('edit.saved'));
    return keyed(
      `${this._view}-${this._editKey}`,
      this._view === 'electricity'
        ? html`<home-infra-map-electricity-editor
            .hass=${this.hass}
            .payload=${this._payload}
            .boardId=${this._boardId}
            @him-saved=${(e: CustomEvent) => {
              onSaved();
              if (e.detail?.boardId) this._boardId = e.detail.boardId;
              this._edit = false;
            }}
            @him-cancel=${() => (this._edit = false)}
            @him-conflict=${this._onConflict}
          ></home-infra-map-electricity-editor>`
        : html`<home-infra-map-network-editor
            .hass=${this.hass}
            .payload=${this._payload}
            @him-saved=${onSaved}
            @him-conflict=${this._onConflict}
          ></home-infra-map-network-editor>`,
    );
  }

  private _renderDialog(): TemplateResult {
    const t = this._t;
    const d = this._dialog!;
    const close = () => (this._dialog = null);
    const title =
      d.kind === 'export' ? t('tools.export') : d.kind === 'import' ? t('tools.import') : d.kind === 'dashboard' ? t('tools.dashboard') : d.text;
    return html`<div
      class="overlay"
      @click=${(e: Event) => e.target === e.currentTarget && close()}
      @keydown=${(e: KeyboardEvent) => e.key === 'Escape' && close()}
    >
      <div class="sheet" role="dialog" aria-modal="true" aria-label=${title}>
        <div class="head">
          <span class="title">${title}</span>
          <button class="icon-btn" aria-label=${t('tools.close')} @click=${close}>✕</button>
        </div>
        ${d.kind === 'photo'
          ? d.url
            ? html`<img class="photo-full" src=${d.url} alt=${t('el.photo')} />`
            : html`<div class="body muted">${t('card.loading')}</div>`
          : html`<div class="body">
              ${d.kind === 'import'
                ? html`<p class="muted small" style="margin:0">${t('tools.import_hint')}</p>
                    <label class="btn" style="display:inline-flex;align-items:center;width:max-content">
                      ${t('tools.choose_file')}
                      <input type="file" accept=".yaml,.yml,text/yaml,application/x-yaml,text/plain" style="display:none"
                        @change=${(e: Event) => this._readImportFile(e)} />
                    </label>
                    <textarea class="inp" rows="14" aria-label=${t('tools.import')} .value=${d.text}
                      @input=${(e: Event) => (this._dialog = { ...d, text: (e.target as HTMLTextAreaElement).value })}></textarea>
                    <div class="btns">
                      <button class="btn pri" ?disabled=${d.busy || !d.text.trim()} @click=${this._runImport}>${t('tools.import_run')}</button>
                    </div>`
                : d.busy
                  ? html`<div class="muted">${t('card.loading')}</div>`
                  : html`${d.kind === 'dashboard' ? html`<p class="muted small" style="margin:0">${t('tools.dashboard_hint')}</p>` : nothing}
                      <pre class="yaml">${d.text}</pre>
                      <div class="btns">
                        <button class="btn pri" @click=${async () => toast(this, (await copyText(d.text)) ? t('tools.copied') : t('card.error', { error: 'clipboard' }))}>
                          ${t('tools.copy')}
                        </button>
                        <button class="btn" @click=${() => downloadText(yamlFilename(d.kind === 'dashboard' ? 'dashboard' : 'export'), d.text)}>
                          ${t('tools.download')}
                        </button>
                      </div>`}
            </div>`}
      </div>
    </div>`;
  }
}

// ---------------------------------------------------------------------------
// Registration block — keep it here and keep it guarded (see register.ts).
// ---------------------------------------------------------------------------
defineOnce('home-infra-map-device-sheet', HomeInfraMapDeviceSheet);
defineOnce('home-infra-map-electricity-editor', HomeInfraMapElectricityEditor);
defineOnce('home-infra-map-network-editor', HomeInfraMapNetworkEditor);
defineOnce(EDITOR_TAG, HomeInfraMapCardEditor);
defineOnce(CARD_TAG, HomeInfraMapCard);
log('info', 'card', 'v%s registered at t=%dms', CARD_VERSION, Math.round(performance.now()));
scheduleRepairs(CARD_TAG);

declare global {
  interface Window {
    customCards?: { type: string; name: string; description?: string; preview?: boolean; documentationURL?: string }[];
  }
}

window.customCards = window.customCards ?? [];
if (!window.customCards.some((c) => c.type === CARD_TAG)) {
  window.customCards.push({
    type: CARD_TAG,
    name: 'Home Infra Map',
    description: translator(langOf(undefined))('card.description'),
    preview: false,
    documentationURL: 'https://github.com/Eric-D/ha-home-infra-map',
  });
}
