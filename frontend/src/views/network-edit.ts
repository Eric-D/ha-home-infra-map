/** Network edit mode: add/edit devices with live detection, OPNsense import, VLANs, uplink. */
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import {
  errorCode,
  errorMessage,
  opnsenseApply,
  opnsensePreview,
  previewEntities,
  probe,
  save,
} from '../api.js';
import { deepClone, newId } from '../helpers/electric.js';
import { ipSortKey } from '../helpers/network.js';
import { translator, type Translate } from '../i18n.js';
import { cardStyles } from '../styles.js';
import type { Device, DeviceKind, EntityRef, Hass, Network, OpnsenseProposals, Payload, ProbeResult, Vlan } from '../types.js';
import { areaField, areaNames, ensureHaElements, fire, selectField, textField } from '../ui.js';

const KINDS: DeviceKind[] = ['router', 'switch', 'ap', 'server', 'nas', 'camera', 'iot', 'computer', 'phone', 'printer', 'other'];

export function blankDevice(): Device {
  return {
    id: newId(),
    name: '',
    host: '',
    mac: null,
    vlan_id: null,
    switch_id: null,
    port: null,
    port_source: 'auto',
    last_seen_port_at: null,
    area_id: null,
    parent_device_id: null,
    kind: 'other',
    model: null,
    notes: null,
    monitor: { ping: true, latency: true, tcp_port: null, offline_alert_minutes: null },
  };
}

/** Apply a probe result to a device form (manual port is never overwritten). */
export function applyProbe(device: Device, res: ProbeResult): Device {
  const next = { ...device };
  if (res.vlan?.vlan_id) next.vlan_id = res.vlan.vlan_id;
  if (res.mac?.value) next.mac = res.mac.value;
  if (res.port && next.port_source !== 'manual') {
    next.switch_id = res.port.switch_id;
    next.port = res.port.port;
    if (!next.parent_device_id && res.port.via_device_id && res.port.via_device_id !== next.id) {
      next.parent_device_id = res.port.via_device_id;
    }
  }
  return next;
}

type Mode = 'list' | 'device' | 'import';

export class HomeInfraMapNetworkEditor extends LitElement {
  static override styles = cardStyles;
  static override properties = {
    hass: { attribute: false },
    payload: { attribute: false },
    _net: { state: true },
    _mode: { state: true },
    _form: { state: true },
    _isNew: { state: true },
    _probe: { state: true },
    _probing: { state: true },
    _preview: { state: true },
    _proposals: { state: true },
    _selVlans: { state: true },
    _selDevices: { state: true },
    _busy: { state: true },
    _error: { state: true },
    _dirty: { state: true },
  };

  declare hass: Hass | undefined;
  declare payload: Payload | undefined;
  declare _net: Network | null;
  declare _mode: Mode;
  declare _form: Device | null;
  declare _isNew: boolean;
  declare _probe: ProbeResult | null;
  declare _probing: boolean;
  declare _preview: EntityRef[];
  declare _proposals: OpnsenseProposals | null;
  declare _selVlans: Set<string>;
  declare _selDevices: Set<string>;
  declare _busy: boolean;
  declare _error: string | null;
  declare _dirty: boolean;

  private _previewTimer: number | undefined;
  private _lastRevision = -1;

  constructor() {
    super();
    this._net = null;
    this._mode = 'list';
    this._form = null;
    this._isNew = false;
    this._probe = null;
    this._probing = false;
    this._preview = [];
    this._proposals = null;
    this._selVlans = new Set();
    this._selDevices = new Set();
    this._busy = false;
    this._error = null;
    this._dirty = false;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    void ensureHaElements().then(() => this.requestUpdate());
  }

  override disconnectedCallback(): void {
    window.clearTimeout(this._previewTimer);
    super.disconnectedCallback();
  }

  protected override willUpdate(): void {
    // Refresh the draft from the server when nothing local is pending.
    if (this.payload && this.payload.section_revisions.network !== this._lastRevision && !this._dirty) {
      this._lastRevision = this.payload.section_revisions.network;
      this._net = deepClone(this.payload.model.network);
    }
  }

  private get _lang(): string {
    return (this.hass?.locale?.language ?? 'fr').startsWith('fr') ? 'fr' : 'en';
  }

  private get _t(): Translate {
    return translator(this._lang);
  }

  /** Open the form on an existing device (used by the card from the device sheet). */
  editDevice(id: string): void {
    const device = this._net?.devices.find((d) => d.id === id);
    if (!device) return;
    this._form = deepClone(device);
    this._isNew = false;
    this._probe = null;
    this._mode = 'device';
    this._schedulePreview();
  }

  private _newDevice(): void {
    this._form = blankDevice();
    this._isNew = true;
    this._probe = null;
    this._preview = [];
    this._mode = 'device';
  }

  private _patchForm(patch: Partial<Device>): void {
    if (!this._form) return;
    this._form = { ...this._form, ...patch, monitor: { ...this._form.monitor, ...(patch.monitor ?? {}) } };
    this._schedulePreview();
  }

  private _schedulePreview(): void {
    window.clearTimeout(this._previewTimer);
    this._previewTimer = window.setTimeout(() => {
      const form = this._form;
      if (!form || !this.hass) return;
      previewEntities(this.hass, { ...form, name: form.name || '?' })
        .then((r) => (this._preview = r))
        .catch(() => (this._preview = []));
    }, 300);
  }

  private async _runProbe(): Promise<void> {
    const form = this._form;
    if (!form?.host.trim() || !this.hass) return;
    this._probing = true;
    try {
      const res = await probe(this.hass, form.host.trim());
      this._probe = res;
      this._form = applyProbe(this._form!, res);
      this._schedulePreview();
    } catch (err) {
      this._error = errorCode(err) === 'unauthorized' ? this._t('edit.refused') : this._t('edit.failed', { error: errorMessage(err) });
    } finally {
      this._probing = false;
    }
  }

  private async _persist(network: Network): Promise<boolean> {
    if (!this.hass || !this.payload) return false;
    this._busy = true;
    this._error = null;
    try {
      await save(this.hass, 'network', network, this.payload.section_revisions.network);
      this._dirty = false;
      this._lastRevision = -1;
      fire(this, 'him-saved');
      return true;
    } catch (err) {
      const code = errorCode(err);
      if (code === 'conflict') fire(this, 'him-conflict');
      else if (code === 'unauthorized') this._error = this._t('edit.refused');
      else this._error = this._t('edit.failed', { error: errorMessage(err) });
      return false;
    } finally {
      this._busy = false;
    }
  }

  private async _saveDevice(): Promise<void> {
    const form = this._form;
    const net = this._net;
    if (!form || !net) return;
    if (!form.name.trim()) {
      this._error = this._t('ne.required');
      return;
    }
    const devices = this._isNew ? [...net.devices, form] : net.devices.map((d) => (d.id === form.id ? form : d));
    const next = { ...net, devices };
    if (await this._persist(next)) {
      this._net = next;
      this._mode = 'list';
      this._form = null;
    }
  }

  private async _deleteDevice(device: Device): Promise<void> {
    if (!this._net || !window.confirm(this._t('edit.confirm_delete', { name: device.name }))) return;
    const next = { ...this._net, devices: this._net.devices.filter((d) => d.id !== device.id) };
    if (await this._persist(next)) this._net = next;
  }

  private async _openImport(): Promise<void> {
    if (!this.hass) return;
    this._mode = 'import';
    this._proposals = null;
    this._error = null;
    try {
      const res = await opnsensePreview(this.hass);
      this._proposals = res;
      this._selVlans = new Set(res.vlans.map((v) => v.interface));
      this._selDevices = new Set(res.devices.filter((d) => !d.exists).map((d) => d.key));
    } catch (err) {
      this._error = errorCode(err) === 'unauthorized' ? this._t('edit.refused') : this._t('edit.failed', { error: errorMessage(err) });
    }
  }

  private async _applyImport(): Promise<void> {
    if (!this.hass || !this.payload) return;
    this._busy = true;
    try {
      await opnsenseApply(this.hass, [...this._selVlans], [...this._selDevices], this.payload.section_revisions.network);
      this._dirty = false;
      this._lastRevision = -1;
      this._mode = 'list';
      fire(this, 'him-saved');
    } catch (err) {
      if (errorCode(err) === 'conflict') fire(this, 'him-conflict');
      else this._error = this._t('edit.failed', { error: errorMessage(err) });
    } finally {
      this._busy = false;
    }
  }

  private _toggle(set: Set<string>, key: string): Set<string> {
    const next = new Set(set);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
  }

  protected override render(): TemplateResult {
    const t = this._t;
    if (!this._net) return html``;
    return html`
      ${this._error ? html`<div class="banner" role="alert">${this._error}</div>` : nothing}
      ${this._mode === 'device' && this._form ? this._renderDeviceForm(this._form) : nothing}
      ${this._mode === 'import' ? this._renderImport() : nothing}
      ${this._mode === 'list'
        ? html`<div class="toolbar">
              <button class="btn pri" @click=${this._newDevice}>${t('ne.add')}</button>
              ${this.payload?.settings.sources.opnsense
                ? html`<button class="btn" @click=${this._openImport}>${t('ne.import_opnsense')}</button>`
                : nothing}
            </div>
            ${this._renderTable()} ${this._renderVlans()} ${this._renderUplink()}`
        : nothing}
    `;
  }

  private _sensorsSummary(d: Device): string {
    const t = this._t;
    const parts: string[] = [];
    if (d.monitor.ping) parts.push(t('ne.s.short.ping'));
    if (d.monitor.latency) parts.push(t('ne.s.short.latency'));
    if (d.monitor.tcp_port) parts.push(t('ne.s.short.tcp', { p: d.monitor.tcp_port }));
    if (d.monitor.offline_alert_minutes) parts.push(t('ne.s.short.alert'));
    return parts.join(', ') || '—';
  }

  private _renderTable(): TemplateResult {
    const t = this._t;
    const net = this._net!;
    const vlanName = (id: string | null) => net.vlans.find((v) => v.id === id)?.name ?? '—';
    const devices = net.devices.slice().sort((a, b) => ipSortKey(a.host).localeCompare(ipSortKey(b.host)));
    return html`<h3>${t('ne.devices')}</h3>
      <div class="scroll">
        <table class="tbl">
          <thead>
            <tr><th>${t('ne.col.name')}</th><th>${t('ne.col.ip')}</th><th>${t('ne.col.vlan')}</th><th>${t('ne.col.port')}</th><th>${t('ne.col.sensors')}</th><th></th></tr>
          </thead>
          <tbody>
            ${devices.map(
              (d) => html`<tr data-device-id=${d.id}>
                <td>${d.name}</td>
                <td class="num">${d.host}</td>
                <td>${vlanName(d.vlan_id)}</td>
                <td>${d.port ?? '—'}</td>
                <td>${this._sensorsSummary(d)}</td>
                <td style="white-space:nowrap">
                  <button class="btn" @click=${() => this.editDevice(d.id)}>${t('ne.edit')}</button>
                  <button class="btn danger" aria-label=${`${t('ne.delete')} ${d.name}`} @click=${() => this._deleteDevice(d)}>✕</button>
                </td>
              </tr>`,
            )}
          </tbody>
        </table>
      </div>`;
  }

  private _renderDeviceForm(form: Device): TemplateResult {
    const t = this._t;
    const net = this._net!;
    const hass = this.hass!;
    const pr = this._probe;
    const pingHint = this._probing
      ? html`<span class="hint muted">${t('ne.probing')}</span>`
      : pr?.ping
        ? pr.ping.alive
          ? html`<span class="hint ok">${t('ne.answers', { ms: pr.ping.rtt_ms ?? '?' })}</span>`
          : html`<span class="hint bad">${pr.ping.error ?? t('ne.no_answer')}</span>`
        : nothing;
    const vlanOpts = [{ value: '', label: '—' }, ...net.vlans.map((v) => ({ value: v.id, label: `${v.name}${v.subnet ? ` · ${v.subnet}` : ''}` }))];
    const portHint = pr?.port
      ? html`<span class="hint muted">${pr.port.via ? t('ne.port_via', { port: pr.port.port, via: pr.port.via }) : pr.port.port} · ${t('ne.port_detected')}</span>`
      : undefined;
    const interval = this.payload?.settings.ping_interval_s ?? 60;
    return html`<div class="toolbar">
        <b style="flex:1">${this._isNew ? t('ne.add_title') : t('ne.edit_title', { name: form.name })}</b>
        <button class="btn" @click=${() => {
          this._mode = 'list';
          this._form = null;
        }}>${t('edit.cancel')}</button>
        <button class="btn pri" ?disabled=${this._busy} @click=${this._saveDevice}>${this._isNew ? t('ne.create') : t('edit.save')}</button>
      </div>
      <div class="ed wide">
        <div class="form">
          ${textField('ne-name', t('ne.f.name'), form.name, (v) => this._patchForm({ name: v }))}
          <div class="f">
            <label for="ne-host">${t('ne.f.host')}</label>
            <div style="display:flex;gap:6px">
              <input class="inp num" id="ne-host" .value=${form.host}
                @input=${(e: Event) => this._patchForm({ host: (e.target as HTMLInputElement).value })}
                @change=${this._runProbe} />
              <button class="btn" ?disabled=${this._probing || !form.host} @click=${this._runProbe}>${t('ne.probe')}</button>
            </div>
            ${pingHint}
          </div>
          ${selectField('ne-vlan', t('ne.f.vlan'), form.vlan_id ?? '', vlanOpts, (v) => this._patchForm({ vlan_id: v || null }))}
          ${pr?.vlan ? html`<span class="hint muted">${pr.vlan.name} · ${pr.vlan.subnet} · ${t('ne.vlan_detected')}</span>` : nothing}
          ${textField('ne-mac', t('ne.f.mac'), form.mac, (v) => this._patchForm({ mac: v.trim() || null }), {
            hint: pr?.mac ? html`<span class="hint muted">${t('ne.mac_detected', { source: pr.mac.source })}</span>` : undefined,
          })}
          <div class="grid2">
            ${selectField('ne-switch', t('ne.f.switch'), form.switch_id ?? '', [{ value: '', label: '—' }, ...net.switches.map((s) => ({ value: s.id, label: s.name }))], (v) => this._patchForm({ switch_id: v || null }))}
            ${textField('ne-port', t('ne.f.port'), form.port, (v) => this._patchForm({ port: v === '' ? null : Number(v) }), { type: 'number', hint: portHint })}
          </div>
          <label class="tog"><input type="checkbox" class="inp" .checked=${form.port_source === 'manual'}
            @change=${(e: Event) => this._patchForm({ port_source: (e.target as HTMLInputElement).checked ? 'manual' : 'auto' })} />${t('ne.f.port_source')}</label>
          ${areaField(hass, 'ne-area', t('ne.f.area'), form.area_id, false, (v) => this._patchForm({ area_id: v[0] ?? null }))}
          <div class="grid2">
            ${selectField('ne-kind', t('ne.f.kind'), form.kind, KINDS.map((k) => ({ value: k, label: t(`kind.${k}`) })), (v) => this._patchForm({ kind: v as DeviceKind }))}
            ${selectField('ne-parent', t('ne.f.parent'), form.parent_device_id ?? '', [{ value: '', label: '—' }, ...net.devices.filter((d) => d.id !== form.id).map((d) => ({ value: d.id, label: d.name }))], (v) => this._patchForm({ parent_device_id: v || null }))}
          </div>
          ${textField('ne-model', t('ne.f.model'), form.model, (v) => this._patchForm({ model: v || null }))}
          ${textField('ne-notes', t('ne.f.notes'), form.notes, (v) => this._patchForm({ notes: v || null }))}
        </div>
        <div class="form">
          <b>${t('ne.sensors')}</b>
          ${this._toggleRow('ping', t('ne.s.ping'), form.monitor.ping, (v) => this._patchForm({ monitor: { ...form.monitor, ping: v } }))}
          ${this._entityPreview('online')}
          ${this._toggleRow('latency', t('ne.s.latency'), form.monitor.latency, (v) => this._patchForm({ monitor: { ...form.monitor, latency: v } }))}
          ${this._entityPreview('latency')}
          ${this._toggleRow('tcp', t('ne.s.tcp'), !!form.monitor.tcp_port, (v) => this._patchForm({ monitor: { ...form.monitor, tcp_port: v ? 80 : null } }))}
          ${form.monitor.tcp_port !== null
            ? html`${textField('ne-tcp', t('ne.s.tcp'), form.monitor.tcp_port, (v) => this._patchForm({ monitor: { ...form.monitor, tcp_port: Number(v) || null } }), { type: 'number' })}
                ${this._entityPreview('tcp')}`
            : nothing}
          ${this._toggleRow('alert', t('ne.s.alert'), !!form.monitor.offline_alert_minutes, (v) => this._patchForm({ monitor: { ...form.monitor, offline_alert_minutes: v ? 5 : null } }))}
          ${form.monitor.offline_alert_minutes !== null
            ? textField('ne-alert', t('ne.s.alert'), form.monitor.offline_alert_minutes, (v) => this._patchForm({ monitor: { ...form.monitor, offline_alert_minutes: Number(v) || null } }), { type: 'number' })
            : nothing}
          ${this._preview.filter((p) => !['online', 'latency', 'tcp'].includes(p.key)).map((p) => html`<div class="ent">${p.entity_id}</div>`)}
          <p class="muted small" style="margin:0">${t('ne.interval', { s: interval, name: form.name || '…' })}</p>
          ${form.area_id ? html`<span class="muted small">${areaNames(hass, [form.area_id]).join('')}</span>` : nothing}
        </div>
      </div>`;
  }

  private _toggleRow(id: string, label: string, value: boolean, onChange: (v: boolean) => void): TemplateResult {
    return html`<label class="tog" for=${`ne-s-${id}`}>
      <input type="checkbox" class="inp" id=${`ne-s-${id}`} .checked=${value} @change=${(e: Event) => onChange((e.target as HTMLInputElement).checked)} />
      ${label}
    </label>`;
  }

  private _entityPreview(key: string): TemplateResult | typeof nothing {
    const p = this._preview.find((x) => x.key === key);
    return p ? html`<div class="ent" data-preview=${key}>${p.entity_id}</div>` : nothing;
  }

  private _renderImport(): TemplateResult {
    const t = this._t;
    const pr = this._proposals;
    return html`<div class="toolbar">
        <b style="flex:1">${t('ne.import_title')}</b>
        <button class="btn" @click=${() => (this._mode = 'list')}>${t('edit.cancel')}</button>
        <button class="btn pri" ?disabled=${!pr || this._busy || (!this._selVlans.size && !this._selDevices.size)} @click=${this._applyImport}>
          ${t('ne.import_apply')}
        </button>
      </div>
      <p class="muted small" style="margin:0">${t('ne.import_hint')}</p>
      ${!pr
        ? html`<div class="muted">${t('ne.loading')}</div>`
        : !pr.vlans.length && !pr.devices.length
          ? html`<div class="empty">${t('ne.import_none')}</div>`
          : html`<h3>${t('ne.vlans')}</h3>
              <div class="scroll"><table class="tbl">
                <tbody>
                  ${pr.vlans.map(
                    (v) => html`<tr>
                      <td><input type="checkbox" aria-label=${v.name} .checked=${this._selVlans.has(v.interface)} @change=${() => (this._selVlans = this._toggle(this._selVlans, v.interface))} /></td>
                      <td>${v.name}</td><td class="num">${v.subnet}</td><td>${v.tag ?? '—'}</td>
                      <td>${v.existing_id ? html`<span class="badge">${t('ne.exists')}</span>` : nothing}</td>
                    </tr>`,
                  )}
                </tbody>
              </table></div>
              <h3>${t('ne.devices')}</h3>
              <div class="scroll"><table class="tbl">
                <tbody>
                  ${pr.devices.map(
                    (d) => html`<tr>
                      <td><input type="checkbox" aria-label=${d.name} ?disabled=${d.exists} .checked=${this._selDevices.has(d.key)} @change=${() => (this._selDevices = this._toggle(this._selDevices, d.key))} /></td>
                      <td>${d.name}</td><td class="num">${d.host}</td><td class="num">${d.mac ?? ''}</td>
                      <td>${d.exists ? html`<span class="badge">${t('ne.exists')}</span>` : nothing}</td>
                    </tr>`,
                  )}
                </tbody>
              </table></div>`}`;
  }

  private _vlanPatch(v: Vlan, patch: Partial<Vlan>): void {
    Object.assign(v, patch);
    this._net = { ...this._net! };
    this._dirty = true;
  }

  private _renderVlans(): TemplateResult {
    const t = this._t;
    const net = this._net!;
    return html`<h3>${t('ne.vlans')}</h3>
      <div class="scroll">
        <table class="tbl">
          <thead><tr><th>${t('ne.v.color')}</th><th>${t('ne.v.name')}</th><th>${t('ne.v.tag')}</th><th>${t('ne.v.subnet')}</th><th>${t('ne.v.role')}</th><th></th></tr></thead>
          <tbody>
            ${net.vlans.map(
              (v) => html`<tr>
                <td style="width:44px"><input class="inp" type="color" aria-label=${`${t('ne.v.color')} ${v.name}`} .value=${v.color} @input=${(e: Event) => this._vlanPatch(v, { color: (e.target as HTMLInputElement).value })} /></td>
                <td><input class="inp" aria-label=${t('ne.v.name')} .value=${v.name} @input=${(e: Event) => this._vlanPatch(v, { name: (e.target as HTMLInputElement).value })} /></td>
                <td style="width:70px"><input class="inp" type="number" aria-label=${t('ne.v.tag')} .value=${v.tag === null ? '' : String(v.tag)} @input=${(e: Event) => { const x = (e.target as HTMLInputElement).value; this._vlanPatch(v, { tag: x ? Number(x) : null }); }} /></td>
                <td><input class="inp num" aria-label=${t('ne.v.subnet')} .value=${v.subnet ?? ''} @input=${(e: Event) => this._vlanPatch(v, { subnet: (e.target as HTMLInputElement).value || null })} /></td>
                <td><input class="inp" aria-label=${t('ne.v.role')} .value=${v.role} @input=${(e: Event) => this._vlanPatch(v, { role: (e.target as HTMLInputElement).value })} /></td>
                <td><button class="btn danger" aria-label=${`${t('ne.delete')} ${v.name}`} @click=${() => {
                  if (!window.confirm(t('edit.confirm_delete', { name: v.name }))) return;
                  this._net = { ...net, vlans: net.vlans.filter((x) => x.id !== v.id) };
                  this._dirty = true;
                }}>✕</button></td>
              </tr>`,
            )}
          </tbody>
        </table>
      </div>
      <div class="btns">
        <button class="btn" @click=${() => {
          this._net = { ...net, vlans: [...net.vlans, { id: newId(), name: 'VLAN', tag: null, subnet: null, color: '#607d8b', role: '', access_summary: '', interface: null }] };
          this._dirty = true;
        }}>${t('ne.vlan_add')}</button>
        <button class="btn pri" ?disabled=${!this._dirty || this._busy} @click=${() => this._persist(this._net!)}>${t('ne.save_network')}</button>
      </div>`;
  }

  private _renderUplink(): TemplateResult {
    const t = this._t;
    const up = this._net!.uplink;
    const set = (patch: Partial<typeof up>) => {
      this._net = { ...this._net!, uplink: { ...up, ...patch } };
      this._dirty = true;
    };
    return html`<h3>${t('ne.uplink')}</h3>
      <div class="grid2">
        ${textField('ne-isp', t('ne.u.isp'), up.isp, (v) => set({ isp: v }))}
        ${textField('ne-box', t('ne.u.box_name'), up.box_name, (v) => set({ box_name: v }))}
        ${textField('ne-boxip', t('ne.u.box_ip'), up.box_ip, (v) => set({ box_ip: v || null }))}
        ${textField('ne-pub', t('ne.u.public_ip'), up.public_ip, (v) => set({ public_ip: v || null }))}
      </div>
      <div class="btns"><button class="btn pri" ?disabled=${!this._dirty || this._busy} @click=${() => this._persist(this._net!)}>${t('ne.save_network')}</button></div>`;
  }
}
