/** Dev harness: mounts the real card with a mock `hass` built from fixture.json.

URL params: view=electricity|network, network_view=topology|vlan|switch,
device=<id|ip>, tab=info|firewall|history, module=<ref>, port=<n>, edit=1,
theme=dark, width=390, admin=0, lang=en, shot=1 (hide the toolbar). */
import '../src/card.ts';
import fixture from './fixture.json';
import type { Hass, Payload } from '../src/types.ts';

const params = new URLSearchParams(location.search);
const theme = params.get('theme') ?? 'light';
document.documentElement.dataset.theme = theme;
if (params.get('shot')) document.body.classList.add('shot');
const root = document.getElementById('root')!;
root.style.maxWidth = `${params.get('width') ?? '1100'}px`;

// Minimal stand-ins for HA elements that the card uses.
if (!customElements.get('ha-card')) {
  customElements.define(
    'ha-card',
    class extends HTMLElement {
      constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `<style>:host{display:block;background:var(--card-background-color);border-radius:12px;
          box-shadow:0 2px 2px rgba(0,0,0,.14),0 1px 5px rgba(0,0,0,.12);color:var(--primary-text-color)}</style><slot></slot>`;
      }
    },
  );
}

const payload = structuredClone(fixture.get) as unknown as Payload;
const states = structuredClone(fixture.states) as Record<string, { state: string; attributes: Record<string, unknown> }>;
const subscribers = new Set<(msg: unknown) => void>();

function history(entityIds: string[]): Record<string, unknown[]> {
  const end = Date.now() / 1000;
  const out: Record<string, unknown[]> = {};
  for (const id of entityIds) {
    const rows: unknown[] = [];
    const base = Number(states[id]?.state) || 0;
    if (id.startsWith('binary_sensor.')) {
      const on = states[id]?.state !== 'off';
      rows.push({ s: 'on', lu: end - 86400 });
      if (!on) rows.push({ s: 'off', lu: end - 3 * 3600 });
      else rows.push({ s: 'off', lu: end - 9 * 3600 }, { s: 'on', lu: end - 8.8 * 3600 });
    } else {
      for (let i = 0; i <= 96; i++) {
        const t = end - 86400 + i * 900;
        let v = id.includes('latence') || id.includes('latency') ? 2 + Math.abs(Math.sin(i / 5)) * 3 : 0;
        if (!v) v = i > 52 && i < 60 ? Math.max(base, 900) * (0.6 + 0.4 * Math.sin(i)) : i > 60 && i < 64 ? 200 : 2;
        rows.push({ s: String(Math.round(v * 10) / 10), lu: t });
      }
    }
    out[id] = rows;
  }
  return out;
}

function slug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

const DASHBOARD = `title: Maison
views:
  - title: Électricité
    path: electricite
    type: sections
    sections:
      - cards:
          - type: custom:home-infra-map-card
            view: electricity
  - title: Réseau
    path: reseau
    type: sections
    sections:
      - cards:
          - type: custom:home-infra-map-card
            view: network
            network_view: topology
`;

const hass: Hass & Record<string, unknown> = {
  states: states as Hass['states'],
  user: { is_admin: params.get('admin') !== '0', name: 'Démo' },
  locale: { language: params.get('lang') ?? 'fr' },
  language: params.get('lang') ?? 'fr',
  areas: {
    buanderie: { area_id: 'buanderie', name: 'Buanderie' },
    cuisine: { area_id: 'cuisine', name: 'Cuisine' },
    cellier: { area_id: 'cellier', name: 'Cellier' },
    garage: { area_id: 'garage', name: 'Garage' },
  },
  themes: { darkMode: theme === 'dark' },
  async callWS<T>(msg: Record<string, unknown>): Promise<T> {
    await new Promise((r) => setTimeout(r, 30));
    const type = String(msg.type);
    const devices = payload.model.network.devices;
    switch (type) {
      case 'home_infra_map/get':
        return structuredClone(payload) as T;
      case 'home_infra_map/firewall': {
        const r = (fixture.firewall as Record<string, unknown>)[String(msg.device_id)];
        return (r ?? { ...Object.values(fixture.firewall)[0], blocks: [], blocks_24h: 0, rule_hits: {} }) as T;
      }
      case 'history/history_during_period':
        return history(msg.entity_ids as string[]) as T;
      case 'auth/sign_path':
        return { path: '/dev/photo.svg' } as T;
      case 'home_infra_map/export':
        return { yaml: '# Home Infra Map export\nhouse_name: Maison\nboards: […]\nnetwork: […]\n' } as T;
      case 'home_infra_map/generate_dashboard':
        return { yaml: DASHBOARD } as T;
      case 'home_infra_map/probe': {
        const host = String(msg.host);
        const d = devices.find((x) => x.host === host);
        const vlan = payload.model.network.vlans.find((v) => v.id === d?.vlan_id) ?? payload.model.network.vlans[1];
        const ap = devices.find((x) => x.kind === 'ap' && x.port === d?.port);
        return {
          host,
          ping: { alive: true, rtt_ms: 4, ip: host },
          vlan: { vlan_id: vlan.id, name: vlan.name, subnet: vlan.subnet, source: 'model' },
          mac: d?.mac ? { value: d.mac, source: 'arp' } : null,
          port: d?.port
            ? { port: d.port, shared: true, via_uplink: false, via: ap?.name ?? null, switch_id: payload.model.network.switches[0].id, switch_name: payload.model.network.switches[0].name, via_device_id: ap && ap.id !== d.id ? ap.id : null }
            : null,
        } as T;
      }
      case 'home_infra_map/preview_entities': {
        const dev = msg.device as { name: string; monitor: { ping: boolean; latency: boolean; tcp_port: number | null } };
        const s = slug(`home_infra_map_${dev.name}`);
        const out = [];
        if (dev.monitor.ping) out.push({ key: 'online', entity_id: `binary_sensor.${s}_en_ligne` });
        if (dev.monitor.latency) out.push({ key: 'latency', entity_id: `sensor.${s}_latence` });
        if (dev.monitor.tcp_port) out.push({ key: 'tcp', entity_id: `binary_sensor.${s}_port_${dev.monitor.tcp_port}`, port: dev.monitor.tcp_port });
        out.push({ key: 'switch_port', entity_id: `sensor.${s}_port_switch` }, { key: 'blocks', entity_id: `sensor.${s}_blocages` });
        return out as T;
      }
      case 'home_infra_map/import_opnsense':
        if (msg.apply) return { applied: true } as T;
        return {
          vlans: payload.model.network.vlans.map((v) => ({ interface: v.name.toLowerCase(), name: v.name, tag: v.tag, subnet: v.subnet, existing_id: v.id })),
          devices: [
            ...devices.slice(0, 4).map((d) => ({ key: d.mac ?? d.host, name: d.name, host: d.host, mac: d.mac, exists: true })),
            { key: '02:00:00:00:00:99', name: 'Nouvelle prise connectée', host: '192.168.30.60', mac: '02:00:00:00:00:99', exists: false },
          ],
        } as T;
      case 'home_infra_map/save': {
        const section = msg.section as 'boards' | 'network';
        (payload.model as any)[section] = msg.data;
        payload.section_revisions[section] += 1;
        payload.revision += 1;
        for (const cb of subscribers) cb({ kind: 'model', ...structuredClone(payload) });
        return { revision: payload.revision, section_revisions: payload.section_revisions } as T;
      }
      case 'home_infra_map/import_yaml':
        return { boards: 1, modules: 38, vlans: 9, devices: 33 } as T;
      default:
        throw { code: 'unknown_command', message: type };
    }
  },
  connection: {
    async subscribeMessage<T>(cb: (msg: T) => void) {
      subscribers.add(cb as (msg: unknown) => void);
      return () => void subscribers.delete(cb as (msg: unknown) => void);
    },
  },
  async fetchWithAuth() {
    return new Response(JSON.stringify({ photo_path: 'board.jpg?v=1' }), { status: 200 });
  },
};

window.addEventListener('hass-more-info', (e) => console.info('more-info', (e as CustomEvent).detail));
window.addEventListener('hass-notification', (e) => console.info('toast', (e as CustomEvent).detail));

const card = document.createElement('home-infra-map-card') as HTMLElement & Record<string, any>;
card.setConfig({
  type: 'custom:home-infra-map-card',
  view: (params.get('view') as 'electricity' | 'network') ?? 'electricity',
  network_view: (params.get('network_view') as 'topology' | 'vlan' | 'switch') ?? 'topology',
  ...(params.get('layout') ? { boards_layout: params.get('layout') as 'stacked' | 'tabs' } : {}),
});
card.hass = hass;
root.appendChild(card);

// Toolbar
const bar = document.getElementById('bar')!;
const link = (label: string, patch: Record<string, string | null>) => {
  const p = new URLSearchParams(location.search);
  for (const [k, v] of Object.entries(patch)) {
    if (v === null) p.delete(k);
    else p.set(k, v);
  }
  const a = document.createElement('a');
  a.href = `?${p}`;
  a.textContent = label;
  bar.appendChild(a);
};
link('Électricité', { view: 'electricity', device: null, edit: null });
link('Topologie', { view: 'network', network_view: 'topology', device: null, edit: null });
link('VLAN', { view: 'network', network_view: 'vlan', device: null, edit: null });
link('Switch', { view: 'network', network_view: 'switch', device: null, edit: null, port: '22' });
link('Pare-feu 192.168.30.40', { view: 'network', device: '192.168.30.40', tab: 'firewall', edit: null });
link('Édition élec', { view: 'electricity', edit: '1', device: null });
link('Édition réseau', { view: 'network', edit: '1', device: null });
link(theme === 'dark' ? 'Clair' : 'Sombre', { theme: theme === 'dark' ? null : 'dark' });
link('Mobile 390', { width: '390' });

// Scripted states for screenshots.
async function applyParams(): Promise<void> {
  for (let i = 0; i < 50 && !card._payload; i++) await new Promise((r) => setTimeout(r, 50));
  const devParam = params.get('device');
  if (devParam) {
    const d = payload.model.network.devices.find((x) => x.id === devParam || x.host === devParam);
    if (d) {
      card._sheetTab = params.get('tab') ?? 'info';
      card._deviceId = d.id;
    }
  }
  const moduleRef = params.get('module');
  if (moduleRef) {
    const m = payload.model.boards.flatMap((b) => b.rows.flatMap((r) => r.modules)).find((x) => x.ref === moduleRef);
    if (m) card._selectModule(m.id);
  }
  const boxName = params.get('box');
  if (boxName) {
    const box = (payload.model.boxes ?? []).find((b: { name: string }) => b.name === boxName);
    const conduit = box?.conduits.find((c: { label: string | null; side: string | null; position: number | null }) =>
      params.get('conduit') === `${c.side}${c.position}` || params.get('conduit') === c.label);
    if (box) {
      card._boxId = box.id;
      card._conduitId = conduit?.id ?? null;
    }
  }
  if (params.get('port')) card._port = Number(params.get('port'));
  if (params.get('edit')) card._edit = true;
  if (params.get('edit_boxes')) card._editBoxes = true;
  await card.updateComplete;
  const editBox = params.get('edit_box');
  if (editBox) {
    await new Promise((r) => setTimeout(r, 100));
    const editor = card.shadowRoot?.querySelector('home-infra-map-boxes-editor') as any;
    const box = (payload.model.boxes ?? []).find((b: { name: string }) => b.name === editBox);
    if (editor && box) {
      editor._boxId = box.id;
      editor._conduitId = box.conduits.find((c: any) => `${c.side}${c.position}` === params.get('edit_conduit'))?.id ?? null;
    }
  }
  const editRef = params.get('edit_module');
  if (editRef) {
    await new Promise((r) => setTimeout(r, 100));
    const editor = card.shadowRoot?.querySelector('home-infra-map-electricity-editor') as any;
    const m = payload.model.boards.flatMap((b) => b.rows.flatMap((r) => r.modules)).find((x) => x.ref === editRef);
    if (editor && m) editor._selected = m.id;
  }
  const add = params.get('add_device');
  if (add) {
    await new Promise((r) => setTimeout(r, 100));
    const editor = card.shadowRoot?.querySelector('home-infra-map-network-editor') as any;
    if (editor) {
      editor._newDevice();
      editor._patchForm({ name: 'Station météo', host: add, kind: 'iot' });
      await editor._runProbe();
    }
  }
  document.body.dataset.ready = '1';
}
(window as any).__payload = payload;
void applyParams();
