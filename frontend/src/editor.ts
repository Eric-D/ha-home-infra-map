/** Visual editor of the card configuration. */
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { fetchPayload } from './api.js';
import { langOf, translator } from './i18n.js';
import { cardStyles } from './styles.js';
import type { Board, CardConfig, Hass } from './types.js';
import { fire } from './ui.js';

export class HomeInfraMapCardEditor extends LitElement {
  static override styles = cardStyles;
  static override properties = {
    hass: { attribute: false },
    _config: { state: true },
    _boards: { state: true },
  };

  declare hass: Hass | undefined;
  declare _config: CardConfig;
  declare _boards: Board[];
  private _loaded = false;

  constructor() {
    super();
    this._config = { type: 'custom:home-infra-map-card' };
    this._boards = [];
  }

  setConfig(config: CardConfig): void {
    this._config = { ...(config && typeof config === 'object' ? config : { type: 'custom:home-infra-map-card' }) };
  }

  protected override updated(): void {
    if (!this._loaded && this.hass) {
      this._loaded = true;
      fetchPayload(this.hass)
        .then((p) => (this._boards = p.model.boards))
        .catch(() => (this._boards = []));
    }
  }

  private _set(key: keyof CardConfig, value: string): void {
    const next: Record<string, unknown> = { ...this._config };
    if (value === '') delete next[key];
    else next[key] = value;
    this._config = next as unknown as CardConfig;
    fire(this, 'config-changed', { config: this._config });
  }

  protected override render(): TemplateResult {
    const t = translator(langOf(this.hass));
    const c = this._config;
    const sel = (id: keyof CardConfig, label: string, value: string | undefined, options: [string, string][]) =>
      html`<div class="f">
        <label for=${`cfg-${id}`}>${label}</label>
        <select class="sel" id=${`cfg-${id}`} @change=${(e: Event) => this._set(id, (e.target as HTMLSelectElement).value)}>
          ${options.map(([v, l]) => html`<option value=${v} ?selected=${(value ?? '') === v}>${l}</option>`)}
        </select>
      </div>`;
    return html`<div class="form" style="border:0;padding:0">
      <div class="f">
        <label for="cfg-title">Titre / Title</label>
        <input class="inp" id="cfg-title" .value=${c.title ?? ''} @change=${(e: Event) => this._set('title', (e.target as HTMLInputElement).value)} />
      </div>
      ${sel('view', 'Vue / View', c.view ?? 'electricity', [
        ['electricity', t('view.electricity')],
        ['network', t('view.network')],
      ])}
      ${this._boards.length > 1
        ? sel('boards_layout', t('cfg.boards_layout'), c.boards_layout ?? (c.board ? 'tabs' : 'stacked'), [
            ['stacked', t('cfg.stacked')],
            ['tabs', t('cfg.tabs')],
          ])
        : nothing}
      ${this._boards.length
        ? sel('board', t('el.board'), c.board, [['', '—'], ...this._boards.map((b): [string, string] => [b.id, b.name])])
        : nothing}
      ${sel('network_view', `${t('view.network')}`, c.network_view ?? 'topology', [
        ['topology', t('nview.topology')],
        ['vlan', t('nview.vlan')],
        ['switch', t('nview.switch')],
      ])}
    </div>`;
  }
}
