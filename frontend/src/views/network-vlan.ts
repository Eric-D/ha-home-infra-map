/** VLAN view: one coloured card per VLAN with its devices. */
import { html, nothing, type TemplateResult } from 'lit';
import { ipSortKey } from '../helpers/network.js';
import type { Device } from '../types.js';
import { presenceDot, type NetCtx } from './network-common.js';

function rows(devices: Device[], ctx: NetCtx): TemplateResult[] {
  return devices
    .slice()
    .sort((a, b) => ipSortKey(a.host).localeCompare(ipSortKey(b.host)))
    .map(
      (d) => html`<button class="row" data-device-id=${d.id} @click=${() => ctx.onOpenDevice(d.id)}>
        ${presenceDot(d, ctx)}<span>${d.name}</span><span class="muted num" style="margin-left:auto">${d.host}</span>
      </button>`,
    );
}

export function renderVlans(ctx: NetCtx): TemplateResult {
  const { t, payload } = ctx;
  const net = payload.model.network;
  const orphans = net.devices.filter((d) => !d.vlan_id);
  if (!net.vlans.length && !net.devices.length) return html`<div class="empty">${t('net.no_devices')}</div>`;
  return html`<div class="vgrid">
    ${net.vlans.map((v) => {
      const devs = net.devices.filter((d) => d.vlan_id === v.id);
      return html`<section class="vc" style=${`--vc:${v.color}`} aria-label=${v.name} data-vlan-id=${v.id}>
        <b>${v.name} · ${v.tag ? t('net.vlan_tag', { tag: v.tag }) : t('net.untagged')}</b>
        <span class="num">${v.subnet ?? ''}</span>
        ${v.role ? html`<span class="muted small">${v.role}</span>` : nothing}
        ${v.access_summary ? html`<span class="muted small">${v.access_summary}</span>` : nothing}
        <span class="muted small">${t('net.devices_n', { n: devs.length })}</span>
        ${rows(devs, ctx)}
      </section>`;
    })}
    ${orphans.length
      ? html`<section class="vc"><b>${t('net.no_vlan')}</b>${rows(orphans, ctx)}</section>`
      : nothing}
  </div>`;
}
