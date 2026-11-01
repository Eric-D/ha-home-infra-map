/** Device sheet: Infos / Pare-feu / Historique tabs. */
import { html, LitElement, nothing, svg, type PropertyValues, type TemplateResult } from 'lit';
import { firewall, history24h, errorMessage } from '../api.js';
import { entityOf, latencyOf, presenceOf } from '../helpers/network.js';
import { parseHistory, presenceSegments, sparkPath, type Point, type Segment } from '../helpers/sparkline.js';
import { translator, type Translate } from '../i18n.js';
import { cardStyles } from '../styles.js';
import type { Destination, Device, FirewallReport, Hass, Payload } from '../types.js';
import { areaNames, fmtDateTime, fmtTime, moreInfo } from '../ui.js';
import { dotClass } from './network-common.js';

export function destinationText(dest: Destination, t: Translate): string {
  let text: string;
  switch (dest.kind) {
    case 'any':
      text = t('fw.dest.any');
      break;
    case 'router':
      text = t('fw.dest.router', { ip: dest.value });
      break;
    case 'private':
      text = t('fw.dest.private');
      break;
    case 'network':
      text = t('fw.dest.network', { name: dest.label || dest.value });
      break;
    case 'address':
      text = dest.label ? `${dest.label} (${dest.value})` : dest.value;
      break;
    case 'alias':
      text = dest.value;
      break;
    default:
      text = dest.value || dest.label;
  }
  return dest.not ? t('fw.not', { x: text }) : text;
}

function reasonsText(reasons: string[], t: Translate): string {
  return reasons.map((r) => t(`fw.reason.${r}`)).join(', ');
}

/** "Pare-feu" tab content (pure, unit-tested on the demo weather station). */
export function renderFirewall(report: FirewallReport | null, t: Translate, lang: string, error?: string): TemplateResult {
  if (error) return html`<div class="banner">${t('card.error', { error })}</div>`;
  if (!report) return html`<div class="muted">${t('fw.loading')}</div>`;
  if (!report.available) {
    const key = report.reason === 'unavailable' ? 'fw.unavailable' : report.reason === 'not_an_ip' ? 'fw.not_an_ip' : 'fw.not_configured';
    return html`<div class="empty">${t(key)}</div>`;
  }
  const out = report.outbound!;
  const hits = report.rule_hits ?? {};
  return html`
    <h3>${t('fw.what_can')}</h3>
    <div class="scroll">
      <table class="tbl fw-out">
        <thead>
          <tr><th aria-label=${t('fw.col.rule')}></th><th>${t('fw.col.rule')}</th><th>${t('fw.col.to')}</th><th>${t('fw.col.today')}</th></tr>
        </thead>
        <tbody>
          ${out.rules.map((r) => {
            const pass = r.action === 'pass';
            const n = r.uuid ? hits[r.uuid] : undefined;
            const to = destinationText(r.destination, t) + (r.ports ? `:${r.ports}` : '');
            return html`<tr class=${r.specific ? 'hl' : ''} data-uuid=${r.uuid ?? ''} data-action=${r.action}>
              <td><span class=${`act ${pass ? 'pass' : 'block'}`} role="img" aria-label=${pass ? t('fw.pass') : t('fw.block')}>${pass ? '✓' : '✕'}</span></td>
              <td>
                ${r.specific
                  ? html`<b class="desc">${r.description}</b> <span class="ent">· ${t('fw.own_rule')}</span>`
                  : html`<span class="desc">${r.description}</span>`}
                ${r.floating ? html` <span class="badge">${t('fw.floating')}</span>` : nothing}
                ${r.probable ? html` <span class="badge warn" title=${reasonsText(r.reasons, t)}>${t('fw.probable')}</span>` : nothing}
                ${r.probable ? html`<div class="muted small">${reasonsText(r.reasons, t)}</div>` : nothing}
              </td>
              <td class="num">${to}${r.protocol !== 'any' ? html` <span class="muted">${r.protocol}</span>` : nothing}</td>
              <td class="num">
                ${n ? (pass ? String(n) : html`<span style="color:var(--him-warn)">${t('fw.blocked_n', { n })}</span>`) : '—'}
              </td>
            </tr>`;
          })}
        </tbody>
      </table>
    </div>
    ${out.default_deny ? html`<div class="muted small">${t('fw.default_deny')}</div>` : nothing}
    ${out.unreachable_count ? html`<div class="muted small">${t('fw.unreachable', { n: out.unreachable_count })}</div>` : nothing}
    ${out.redundant.length
      ? html`<div class="muted small">${t('fw.redundant', { list: out.redundant.map((r) => `« ${r.description} »`).join(', ') })}</div>`
      : nothing}
    <h3>${t('fw.who')}</h3>
    <div class="chips fw-in">
      ${(report.inbound ?? []).map((e) => {
        const cls = e.verdict === 'allowed' ? 'dot' : e.verdict === 'blocked' ? 'dot bad' : e.verdict === 'partial' ? 'dot warn' : 'dot off';
        const title = [e.rule?.description, e.ports, e.probable ? reasonsText(e.reasons, t) : ''].filter(Boolean).join(' · ');
        return html`<span class="chip" title=${title} data-verdict=${e.verdict}>
          <span class=${cls}></span>${e.label}
          ${e.verdict === 'partial' ? html`<span class="muted small">${t('fw.partial')}${e.ports ? ` ${e.ports}` : ''}</span>` : nothing}
          ${e.verdict === 'same_network' ? html`<span class="muted small">${t('fw.same_network')}</span>` : nothing}
          ${e.probable ? html`<span class="badge warn">${t('fw.probable')}</span>` : nothing}
        </span>`;
      })}
    </div>
    ${(report.nat ?? []).map(
      (n) => html`<div class="muted small">${t('fw.nat', { ext: n.external_port || '?', target: n.target_port || n.external_port || '?' })}${n.description ? ` · ${n.description}` : ''}</div>`,
    )}
    <h3>${t('fw.recent')}</h3>
    ${(report.blocks ?? []).length
      ? html`<div class="scroll">
          <table class="tbl fw-blocks">
            <thead><tr><th>${t('fw.col.time')}</th><th>${t('fw.col.dest')}</th><th>${t('fw.col.name')}</th><th>${t('fw.col.by')}</th></tr></thead>
            <tbody>
              ${(report.blocks ?? []).map(
                (b) => html`<tr>
                  <td class="num">${fmtTime(b.time, lang)}</td>
                  <td class="num">${b.destination}${b.port ? `:${b.port}` : ''}</td>
                  <td>${b.dns_name ?? '—'}</td>
                  <td>${b.rule ?? html`<span class="muted">${t('fw.default_rule')}</span>`}</td>
                </tr>`,
              )}
            </tbody>
          </table>
        </div>`
      : html`<div class="muted small">${t('fw.no_blocks')}</div>`}
    <p class="muted small">${t('fw.readonly')}</p>
  `;
}

type Tab = 'info' | 'firewall' | 'history';

export class HomeInfraMapDeviceSheet extends LitElement {
  static override styles = cardStyles;
  static override properties = {
    hass: { attribute: false },
    payload: { attribute: false },
    deviceId: { attribute: false },
    tab: { attribute: false },
    _report: { state: true },
    _fwError: { state: true },
    _history: { state: true },
  };

  declare hass: Hass | undefined;
  declare payload: Payload | undefined;
  declare deviceId: string | null;
  declare tab: Tab;
  declare _report: FirewallReport | null;
  declare _fwError: string | undefined;
  declare _history: Record<string, any[]> | null;

  private _loadedFw: string | null = null;
  private _loadedHist: string | null = null;
  private _keyHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this._close();
  };

  constructor() {
    super();
    this.tab = 'info';
    this.deviceId = null;
    this._report = null;
    this._history = null;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('keydown', this._keyHandler);
  }

  override disconnectedCallback(): void {
    window.removeEventListener('keydown', this._keyHandler);
    super.disconnectedCallback();
  }

  private get _device(): Device | undefined {
    return this.payload?.model.network.devices.find((d) => d.id === this.deviceId);
  }

  private get _t(): Translate {
    return translator(this._lang);
  }

  private get _lang(): string {
    const raw = this.hass?.locale?.language ?? 'fr';
    return raw.startsWith('fr') ? 'fr' : 'en';
  }

  protected override updated(changed: PropertyValues): void {
    if (changed.has('deviceId')) {
      this._report = null;
      this._history = null;
      this._loadedFw = null;
      this._loadedHist = null;
      this.renderRoot.querySelector<HTMLElement>('.sheet [role="tab"][aria-selected="true"]')?.focus();
    }
    if (this.tab === 'firewall' && this.hass && this.deviceId && this._loadedFw !== this.deviceId) {
      this._loadedFw = this.deviceId;
      this._fwError = undefined;
      firewall(this.hass, this.deviceId)
        .then((r) => (this._report = r))
        .catch((err) => (this._fwError = errorMessage(err)));
    }
    if (this.tab === 'history' && this.hass && this.payload && this.deviceId && this._loadedHist !== this.deviceId) {
      this._loadedHist = this.deviceId;
      const ids = ['online', 'latency']
        .map((k) => entityOf(this.payload!.entities, this.deviceId!, k))
        .filter((x): x is string => !!x);
      history24h(this.hass, ids)
        .then((h) => (this._history = h))
        .catch(() => (this._history = {}));
    }
  }

  private _close(): void {
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  private _setTab(tab: Tab): void {
    this.tab = tab;
  }

  private _onTabKey(e: KeyboardEvent): void {
    const tabs: Tab[] = ['info', 'firewall', 'history'];
    const i = tabs.indexOf(this.tab);
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      this.tab = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      void this.updateComplete.then(() =>
        this.renderRoot.querySelector<HTMLElement>('.sheet [role="tab"][aria-selected="true"]')?.focus(),
      );
    }
  }

  protected override render(): TemplateResult {
    const device = this._device;
    const t = this._t;
    if (!device || !this.payload) return html``;
    const payload = this.payload;
    const presence = device.monitor.ping ? presenceOf(device, payload, this.hass) : 'unknown';
    const ms = latencyOf(device, payload, this.hass);
    const vlan = payload.model.network.vlans.find((v) => v.id === device.vlan_id);
    const blocksEid = entityOf(payload.entities, device.id, 'blocks');
    const blocks = blocksEid ? Number(this.hass?.states[blocksEid]?.state) : NaN;
    const tabs: [Tab, string][] = [
      ['info', t('ds.tab.info')],
      ['firewall', t('ds.tab.firewall')],
      ['history', t('ds.tab.history')],
    ];
    return html`<div class="overlay" @click=${(e: Event) => e.target === e.currentTarget && this._close()}>
      <div class="sheet" role="dialog" aria-modal="true" aria-label=${device.name}>
        <div class="head">
          <span class="title">${device.name}</span>
          <div class="head-actions">
            <div class="seg" role="tablist" @keydown=${this._onTabKey}>
              ${tabs.map(
                ([id, label]) => html`<button
                  role="tab"
                  aria-selected=${this.tab === id ? 'true' : 'false'}
                  tabindex=${this.tab === id ? '0' : '-1'}
                  @click=${() => this._setTab(id)}
                >
                  ${label}
                </button>`,
              )}
            </div>
            <button class="icon-btn" aria-label=${t('ds.close')} @click=${this._close}>✕</button>
          </div>
        </div>
        <div class="body">
          <div class="chips">
            ${device.monitor.ping
              ? html`<span class="chip"><span class=${dotClass(presence)}></span>${presence === 'online'
                  ? ms !== null
                    ? t('ds.online_ms', { ms: Math.round(ms * 10) / 10 })
                    : t('ds.online')
                  : presence === 'offline'
                    ? t('ds.offline')
                    : t('ds.unknown')}</span>`
              : nothing}
            <span class="chip num">${[device.host, vlan?.name, device.port !== null ? t('net.port', { n: device.port }) : ''].filter(Boolean).join(' · ')}</span>
            ${Number.isFinite(blocks) && blocks > 0
              ? html`<span class="chip"><span class="dot warn"></span>${t('ds.blocks_today', { n: blocks })}</span>`
              : nothing}
          </div>
          ${this.tab === 'info' ? this._renderInfo(device) : nothing}
          ${this.tab === 'firewall' ? renderFirewall(this._report, t, this._lang, this._fwError) : nothing}
          ${this.tab === 'history' ? this._renderHistory(device) : nothing}
        </div>
      </div>
    </div>`;
  }

  private _renderInfo(device: Device): TemplateResult {
    const t = this._t;
    const payload = this.payload!;
    const net = payload.model.network;
    const vlan = net.vlans.find((v) => v.id === device.vlan_id);
    const sw = net.switches.find((s) => s.id === device.switch_id);
    const parent = net.devices.find((d) => d.id === device.parent_device_id);
    const ents = payload.entities[device.id] ?? [];
    return html`<dl class="detail">
      <dt>${t('ds.ip')}</dt><dd class="num">${device.host || '—'}</dd>
      <dt>${t('ds.mac')}</dt><dd class="num">${device.mac ?? '—'}</dd>
      <dt>${t('ds.vlan')}</dt><dd>${vlan ? `${vlan.name}${vlan.subnet ? ` · ${vlan.subnet}` : ''}` : '—'}</dd>
      <dt>${t('ds.port')}</dt>
      <dd>
        ${device.port !== null
          ? html`${t('ds.port_value', { port: device.port, switch: sw?.name ?? '?' })}
              <span class="muted small">
                · ${device.port_source === 'manual' ? t('ds.port_manual') : t('ds.port_auto')}
                ${device.last_seen_port_at ? ` · ${t('ds.last_seen', { date: fmtDateTime(device.last_seen_port_at, this._lang) })}` : ''}
              </span>`
          : '—'}
      </dd>
      <dt>${t('ds.area')}</dt><dd>${areaNames(this.hass, [device.area_id]).join('') || '—'}</dd>
      <dt>${t('ds.kind')}</dt><dd>${t(`kind.${device.kind}`)}${device.model ? ` · ${device.model}` : ''}</dd>
      ${parent ? html`<dt>${t('ds.parent')}</dt><dd>${parent.name}</dd>` : nothing}
      <dt>${t('ds.sensors')}</dt>
      <dd>
        ${ents.length
          ? ents.map((e) => html`<button class="ent" @click=${() => moreInfo(this, e.entity_id)}>${e.entity_id}</button><br />`)
          : t('ds.no_sensor')}
      </dd>
      ${device.notes ? html`<dt>${t('ds.notes')}</dt><dd style="white-space:pre-line">${device.notes}</dd>` : nothing}
    </dl>`;
  }

  private _renderHistory(device: Device): TemplateResult {
    const t = this._t;
    const payload = this.payload!;
    const onlineId = entityOf(payload.entities, device.id, 'online');
    const latencyId = entityOf(payload.entities, device.id, 'latency');
    if (!onlineId && !latencyId) return html`<div class="empty">${t('hist.none')}</div>`;
    if (this._history === null) return html`<div class="muted">${t('card.loading')}</div>`;
    const end = Date.now();
    const start = end - 24 * 3600 * 1000;
    const segs: Segment[] = onlineId ? presenceSegments(this._history[onlineId], start, end) : [];
    const pts: Point[] = latencyId ? parseHistory(this._history[latencyId]) : [];
    const { line, area } = sparkPath(pts, start, end, 200, 60);
    return html`
      ${onlineId
        ? html`<h3>${t('hist.presence')}</h3>
            <div class="timeline" role="img" aria-label=${t('hist.presence')}>
              ${segs.map(
                (s) => html`<span class=${s.on === true ? 'on' : s.on === false ? 'off' : 'na'} style=${`flex:${s.to - s.from}`}></span>`,
              )}
            </div>`
        : nothing}
      ${latencyId
        ? html`<h3>${t('hist.latency')}</h3>
            ${line
              ? html`<svg class="spark" style="height:60px" viewBox="0 0 200 60" preserveAspectRatio="none" role="img" aria-label=${t('hist.latency')}>
                  ${svg`<path d=${area} fill="var(--him-accent)" opacity=".15"></path><path d=${line} fill="none" stroke="var(--him-accent)" stroke-width="1.6" vector-effect="non-scaling-stroke"></path>`}
                </svg>
                <span class="muted small num">max ${Math.max(...pts.map((p) => p.v)).toFixed(1)} ms</span>`
              : html`<span class="muted small">${t('el.d.no_history')}</span>`}`
        : nothing}
    `;
  }
}
