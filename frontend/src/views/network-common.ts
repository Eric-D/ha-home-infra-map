/** Shared bits of the network views. */
import { html, nothing, type TemplateResult } from 'lit';
import { latencyOf, presenceOf, type Presence } from '../helpers/network.js';
import type { Translate } from '../i18n.js';
import type { Device, Hass, Payload } from '../types.js';

export interface NetCtx {
  hass: Hass | undefined;
  payload: Payload;
  t: Translate;
  lang: string;
  onOpenDevice: (id: string) => void;
}

export function dotClass(p: Presence): string {
  return p === 'online' ? 'dot' : p === 'offline' ? 'dot bad' : 'dot off';
}

export function presenceDot(device: Device, ctx: NetCtx): TemplateResult {
  if (!device.monitor.ping) return html`<span class="dot off" aria-hidden="true"></span>`;
  const p = presenceOf(device, ctx.payload, ctx.hass);
  return html`<span class=${dotClass(p)} role="img" aria-label=${p === 'online' ? ctx.t('ds.online') : p === 'offline' ? ctx.t('ds.offline') : ctx.t('ds.unknown')}></span>`;
}

export function deviceStatusText(device: Device, ctx: NetCtx): string {
  const parts = [device.host];
  if (device.monitor.ping) {
    const p = presenceOf(device, ctx.payload, ctx.hass);
    if (p === 'offline') parts.push(ctx.t('net.offline_short'));
    else if (p === 'online') {
      const ms = latencyOf(device, ctx.payload, ctx.hass);
      if (ms !== null) parts.push(`${Math.round(ms * 10) / 10} ms`);
    }
  }
  return parts.filter(Boolean).join(' · ');
}

export function deviceNode(device: Device, ctx: NetCtx, indent: number, suffix = ''): TemplateResult {
  return html`<button
    class="tn"
    style=${`margin-left:calc(var(--him-indent) * ${indent})`}
    data-device-id=${device.id}
    @click=${() => ctx.onOpenDevice(device.id)}
  >
    ${presenceDot(device, ctx)}
    <span class="name">${device.name}${suffix ? html`<span class="muted"> · ${suffix}</span>` : nothing}</span>
    <span class="ip num">${deviceStatusText(device, ctx)}</span>
  </button>`;
}
