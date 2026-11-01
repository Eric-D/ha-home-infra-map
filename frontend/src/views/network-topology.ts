/** Topology: Internet → box → router → switch(es) → devices by port, Wi-Fi clients under their AP. */
import { html, nothing, type TemplateResult } from 'lit';
import { childrenOf, groupByPort, unplaced } from '../helpers/network.js';
import type { Device } from '../types.js';
import { deviceNode, type NetCtx } from './network-common.js';

function withChildren(device: Device, all: Device[], ctx: NetCtx, indent: number, suffix: string): TemplateResult[] {
  const out = [deviceNode(device, ctx, indent, suffix)];
  for (const child of childrenOf(all, device.id)) out.push(...withChildren(child, all, ctx, indent + 1, ''));
  return out;
}

export function renderTopology(ctx: NetCtx): TemplateResult {
  const { t, payload } = ctx;
  const net = payload.model.network;
  const devices = net.devices;
  if (!devices.length && !net.switches.length) return html`<div class="empty">${t('net.no_devices')}</div>`;
  const uplink = net.uplink;
  const routers = devices.filter((d) => d.kind === 'router');
  const switchDevice = (host: string | null) => devices.find((d) => d.kind === 'switch' && host && d.host === host);
  const placedIds = new Set<string>();
  const switchBlocks = net.switches.map((sw) => {
    const swDev = switchDevice(sw.host);
    if (swDev) placedIds.add(swDev.id);
    const groups = groupByPort(devices, sw.id).map((g) => ({
      ...g,
      devices: g.devices.filter((d) => d.kind !== 'router' && d.id !== swDev?.id),
    })).filter((g) => g.devices.length > 0);
    return html`<div class="portgrp">
      ${swDev
        ? deviceNode(swDev, ctx, 3)
        : html`<div class="tn" style="margin-left:calc(var(--him-indent) * 3)"><span class="dot off"></span><span class="name">${sw.name}</span>
            <span class="ip num">${sw.host ?? ''}</span></div>`}
      ${groups.flatMap((g) => {
        g.devices.forEach((d) => placedIds.add(d.id));
        const portLabel = t('net.port', { n: g.port });
        if (g.devices.length === 1) return withChildren(g.devices[0], devices, ctx, 4, portLabel);
        const label = sw.port_labels[String(g.port)];
        return [
          html`<div class="tn port-head" style="margin-left:calc(var(--him-indent) * 4)">
            <span class="name"><b>${portLabel}</b>${label ? html`<span class="muted"> · ${label}</span>` : nothing}</span>
            <span class="ip muted small">${t('net.devices_n', { n: g.devices.length })}</span>
          </div>`,
          ...g.devices.flatMap((d) => withChildren(d, devices, ctx, 5, '')),
        ];
      })}
    </div>`;
  });
  for (const r of routers) placedIds.add(r.id);
  const rest = unplaced(devices, net.switches).filter((d) => !placedIds.has(d.id) && d.kind !== 'router');
  const gw = payload.live.opnsense.gateways;
  return html`<div class="topo">
    <div class="tn">
      <span class=${gw.length ? (gw.some((g) => g.online) ? 'dot' : 'dot bad') : 'dot off'}></span>
      <span class="name"><b>${t('net.internet')}</b> ${uplink.isp}</span>
      <span class="ip num">${uplink.public_ip ?? ''}</span>
    </div>
    ${uplink.box_name || uplink.box_ip
      ? html`<div class="tn" style="margin-left:var(--him-indent)"><span class="dot off"></span><span class="name">${uplink.box_name}</span>
          <span class="ip num">${uplink.box_ip ?? ''}</span></div>`
      : nothing}
    ${routers.flatMap((r) => withChildren(r, devices, ctx, 2, ''))}
    ${switchBlocks}
    ${rest.length
      ? html`<h3>${t('net.unplaced')}</h3>
          ${rest.flatMap((d) => withChildren(d, devices, ctx, 1, ''))}`
      : nothing}
  </div>`;
}
