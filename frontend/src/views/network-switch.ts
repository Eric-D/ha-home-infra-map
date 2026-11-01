/** Switch view: drawn front panel (copper + SFP), link and PoE LEDs, port detail. */
import { html, nothing, type TemplateResult } from 'lit';
import { devicesOnPort } from '../helpers/network.js';
import type { Switch, SwitchPort } from '../types.js';
import type { NetCtx } from './network-common.js';

export interface SwitchCtx extends NetCtx {
  switchId: string | null;
  selectedPort: number | null;
  onSelectSwitch: (id: string) => void;
  onSelectPort: (port: number | null) => void;
}

function speedText(mbps: number | null): string {
  if (!mbps) return '';
  return mbps >= 1000 ? `${mbps / 1000} Gbit/s` : `${mbps} Mbit/s`;
}

export function portClasses(info: SwitchPort | undefined, sfp: boolean, selected: boolean): string {
  const cls = ['p'];
  if (sfp) cls.push('sfp');
  if (info?.up) cls.push('up');
  if (info?.poe) cls.push('poe');
  if (selected) cls.push('sel');
  return cls.join(' ');
}

function portButton(sw: Switch, n: number, ports: Record<string, SwitchPort>, ctx: SwitchCtx): TemplateResult {
  const info = ports[String(n)];
  const sfp = sw.sfp_ports.includes(n);
  const label = sw.port_labels[String(n)] || info?.alias || '';
  const state = info?.up ? ctx.t('net.link_up') : info?.up === false ? ctx.t('net.link_down') : '';
  return html`<button
    class=${portClasses(info, sfp, ctx.selectedPort === n)}
    data-port=${n}
    aria-label=${[ctx.t('net.port_detail', { n }), label, state, info?.poe ? ctx.t('net.poe') : ''].filter(Boolean).join(', ')}
    aria-pressed=${ctx.selectedPort === n ? 'true' : 'false'}
    title=${label}
    @click=${() => ctx.onSelectPort(ctx.selectedPort === n ? null : n)}
  >
    ${n}
  </button>`;
}

export function renderSwitch(ctx: SwitchCtx): TemplateResult {
  const { t, payload } = ctx;
  const switches = payload.model.network.switches;
  if (!switches.length) return html`<div class="empty">${t('net.no_switch')}</div>`;
  const sw = switches.find((s) => s.id === ctx.switchId) ?? switches[0];
  const live = payload.live.switches[sw.id];
  const ports = live?.ports ?? {};
  const all = Array.from({ length: sw.ports_count }, (_, i) => i + 1);
  const copper = all.filter((n) => !sw.sfp_ports.includes(n));
  const sfp = all.filter((n) => sw.sfp_ports.includes(n));
  const sel = ctx.selectedPort;
  const info = sel !== null ? ports[String(sel)] : undefined;
  const devs = sel !== null ? devicesOnPort(payload.model.network.devices, sw, sel, info?.macs ?? []) : [];
  const vlanName = (tag: number | null) => payload.model.network.vlans.find((v) => v.tag === tag)?.name;
  return html`
    ${switches.length > 1
      ? html`<div class="seg" role="tablist">
          ${switches.map(
            (s) => html`<button role="tab" aria-selected=${s.id === sw.id ? 'true' : 'false'} @click=${() => ctx.onSelectSwitch(s.id)}>${s.name}</button>`,
          )}
        </div>`
      : nothing}
    <div class="muted small">${sw.name}${sw.host ? ` · ${sw.host}` : ''}${live?.sys_name ? ` · ${live.sys_name}` : ''}</div>
    ${live && !live.available ? html`<div class="banner info">${t('net.switch_unavailable')}</div>` : nothing}
    <div class="sw" role="group" aria-label=${sw.name}>
      <div class="sw-copper">${copper.map((n) => portButton(sw, n, ports, ctx))}</div>
      ${sfp.length ? html`<div class="sw-sfp">${sfp.map((n) => portButton(sw, n, ports, ctx))}</div>` : nothing}
    </div>
    ${sel !== null
      ? html`<dl class="detail" aria-live="polite">
          <dt>${t('net.port_detail', { n: sel })}</dt>
          <dd>
            ${[
              sw.port_labels[String(sel)] || info?.alias || info?.name || '',
              info?.up === true ? speedText(info.speed_mbps) || t('net.link_up') : info?.up === false ? t('net.link_down') : '',
              info?.poe ? t('net.poe') : '',
            ]
              .filter(Boolean)
              .join(' · ') || '—'}
          </dd>
          ${info
            ? html`<dt>VLAN</dt>
                <dd>
                  ${t('net.vlans_line', {
                    pvid: info.pvid !== null ? `${info.pvid}${vlanName(info.pvid) ? ` (${vlanName(info.pvid)})` : ''}` : '—',
                    tagged: info.tagged_vlans.length ? info.tagged_vlans.join(', ') : '—',
                  })}
                </dd>`
            : nothing}
          ${info?.lldp?.sys_name ? html`<dt>${t('net.lldp')}</dt><dd>${info.lldp.sys_name}${info.lldp.port_id ? ` (${info.lldp.port_id})` : ''}</dd>` : nothing}
          <dt>${t('net.seen')}</dt>
          <dd>
            ${devs.length
              ? devs.map((d) => html`<button class="ent" @click=${() => ctx.onOpenDevice(d.id)}>${d.name}</button><br />`)
              : '—'}
            ${info?.macs?.length ? html`<span class="muted small">${t('net.macs', { n: info.macs.length })}</span>` : nothing}
          </dd>
        </dl>`
      : nothing}
  `;
}
