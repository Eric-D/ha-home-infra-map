import { render } from 'lit';
import { describe, expect, it } from 'vitest';
import { yamlFilename } from '../src/card.js';
import { translator } from '../src/i18n.js';
import { renderFirewall } from '../src/views/device-sheet.js';
import { isUnidentified } from '../src/helpers/electric.js';
import { renderElectricity } from '../src/views/electricity.js';
import { renderSwitch } from '../src/views/network-switch.js';
import { renderTopology } from '../src/views/network-topology.js';
import { firewallReport, mockHass, mount, payload } from './fixture.js';

const t = translator('fr');
const noop = () => undefined;

describe('electricity view', () => {
  const board = payload.model.boards[0];
  const ctx = {
    hass: mockHass(),
    payload,
    t,
    lang: 'fr',
    board,
    selectedModuleId: null as string | null,
    showWarnings: false,
    history: [],
    historyRange: [0, 1] as [number, number],
    hasPhoto: false,
    onSelectBoard: noop,
    onSelectModule: noop,
    onToggleWarnings: noop,
    onOpenPhoto: noop,
    onMoreInfo: noop,
  };

  it('draws every module on its rail with the mockup classes', () => {
    const el = mount();
    render(renderElectricity(ctx), el);
    expect(el.querySelectorAll('.rail')).toHaveLength(3);
    const modules = board.rows.flatMap((r) => r.modules);
    expect(el.querySelectorAll('.m:not(.free)')).toHaveLength(modules.length);
    expect(el.querySelectorAll('.m.d')).toHaveLength(3);
    expect(el.querySelectorAll('.m.s')).toHaveLength(4);
    expect(el.querySelectorAll('.m.sp')).toHaveLength(2);
    const dashed = el.querySelectorAll('.m.u');
    expect(dashed.length).toBe(modules.filter((m) => isUnidentified(m)).length);
    expect(dashed.length).toBe(3);
    expect(el.querySelector('.rail')!.querySelectorAll('.m')[0].getAttribute('data-kind')).toBe('rcd');
  });

  it('shows live power, LED and widths proportional to DIN modules', () => {
    const el = mount();
    render(renderElectricity(ctx), el);
    const washer = [...el.querySelectorAll<HTMLElement>('.m')].find((m) => m.title.startsWith('T1-R1-7 '))!;
    const w = washer.querySelector<HTMLElement>('.w')!;
    expect(w.textContent!.replace(/\s/g, '')).toBe('1,1kW');
    expect(w.title.replace(/\s/g, '')).toBe('1120W');
    expect(washer.querySelector('.led.on')).not.toBeNull();
    const rcd = el.querySelector<HTMLElement>('.m.d')!;
    expect(washer.style.gridColumn).toBe('span 1');
    expect(rcd.style.gridColumn).toBe('span 2');
    expect(el.textContent).toContain('3 différentiel(s)');
  });

  it('opens the detail panel with the upstream RCD', () => {
    const washer = board.rows[0].modules.find((m) => m.ref === 'T1-R1-7')!;
    const el = mount();
    render(renderElectricity({ ...ctx, selectedModuleId: washer.id }), el);
    const detail = el.querySelector('dl.detail')!;
    expect(detail.textContent).toContain('T1-R1-ID · 40 A 30 mA type AC');
    expect(detail.textContent).toContain('sensor.lave_linge_puissance');
  });

  it('draws the service entrance, off and spare breakers', () => {
    const el = mount();
    render(renderElectricity(ctx), el);
    const sups = [...el.querySelectorAll<HTMLElement>('.supply .sup')];
    expect(sups.map((s) => s.classList.contains('meter') || s.classList.contains('main_breaker'))).toEqual([true, true]);
    expect(sups[0].textContent).toContain('9 kVA');
    expect(sups[1].textContent).toContain('45 A');
    expect(sups[1].textContent).toContain('500 mA');
    expect(el.querySelector('.supply')!.textContent).toContain('4 départ(s)');
    const off = [...el.querySelectorAll<HTMLElement>('.m.off')];
    expect(off.map((m) => m.dataset.moduleId)).toEqual([board.rows[0].modules.find((m) => m.ref === 'T1-R1-3')!.id]);
    expect(off[0].querySelector('.tag')!.textContent).toBe('Coupé');
    expect(el.querySelector('.m.spare .tag')!.textContent).toBe('Réserve');
    const fx = el.querySelector<HTMLElement>('.m.fx')!;
    expect(fx.title).toContain('alimenté par T1-AGCP');
    expect(el.textContent).toContain('1 coupé(s)');
    expect(el.textContent).toContain('1 en réserve');
  });

  it("shows the owner's alerts on the module, in a chip and in the detail", () => {
    const flagged = board.rows[0].modules.find((m) => m.ref === 'T1-R1-2')!;
    const el = mount();
    render(renderElectricity(ctx), el);
    const m = el.querySelector<HTMLElement>(`[data-module-id="${flagged.id}"]`)!;
    expect(m.classList.contains('al')).toBe(true);
    expect(m.querySelector('.amark')).not.toBeNull();
    expect(m.title).toContain('Alerte : Prise sur un circuit éclairage (chambre 2)');
    expect(el.textContent).toContain('1 alerte(s)');
    expect(el.textContent).toContain('2 point(s) à vérifier');
    render(renderElectricity({ ...ctx, showWarnings: true }), el);
    const items = [...el.querySelectorAll('.warnlist li')];
    expect(items[0].classList.contains('manual')).toBe(true);
    expect(items[0].textContent).toContain('Prise sur un circuit éclairage');
    render(renderElectricity({ ...ctx, selectedModuleId: flagged.id }), el);
    const detail = el.querySelector('dl.detail')!;
    expect(detail.querySelector('.alert-text')!.textContent).toBe('Prise sur un circuit éclairage (chambre 2)');
    expect(detail.querySelectorAll('.warnlist li')).toHaveLength(0);
  });

  it('recalls the NF C 15-100 rule of the circuit kind, or of the kind its rating suggests', () => {
    const sockets = board.rows[0].modules.find((m) => m.ref === 'T1-R1-5')!;
    const el = mount();
    render(renderElectricity({ ...ctx, selectedModuleId: sockets.id }), el);
    let detail = el.querySelector('dl.detail')!.textContent!;
    expect(detail).toContain('Rappel NF C 15-100');
    expect(detail).toContain('8 prises au plus');
    expect(detail).toContain('10 (8 au plus)');
    expect(detail).toContain('10 points sur ce circuit (8 au plus)');
    const unknown = board.rows[0].modules.find((m) => m.ref === 'T1-R1-6')!;
    render(renderElectricity({ ...ctx, selectedModuleId: unknown.id }), el);
    detail = el.querySelector('dl.detail')!.textContent!;
    expect(detail).toContain("Calibre typique d'un circuit prises");
  });

  it('highlights the feed links of the selected module', () => {
    const feeder = board.rows[2].modules.find((m) => m.ref === 'T1-R3-4')!;
    const el = mount();
    render(renderElectricity({ ...ctx, selectedModuleId: feeder.id }), el);
    expect(el.querySelector('.board')!.classList.contains('linking')).toBe(true);
    expect([...el.querySelectorAll('.up')].map((m) => m.getAttribute('data-module-id'))).toEqual(board.supply!.map((m) => m.id));
    // the RCD on its left is not upstream
    expect(el.querySelector(`[data-module-id="${board.rows[2].modules[0].id}"]`)!.classList.contains('up')).toBe(false);
    const detail = el.querySelector('dl.detail')!.textContent!.replace(/\s+/g, ' ');
    expect(detail).toContain('T1-AGCP ← T1-CPT · lien manuel');
    expect(detail).toContain('Tableau garage');

    const head = board.supply![1];
    render(renderElectricity({ ...ctx, selectedModuleId: head.id }), el);
    const text = el.querySelector('dl.detail')!.textContent!;
    expect(text).toContain('T1-R1-ID');
    expect(text).toContain('T1-R3-4');
    expect(el.querySelectorAll('.down').length).toBeGreaterThan(20);
  });

  it('draws free slots up to the rail width, and flags an overfull rail', () => {
    const el = mount();
    render(renderElectricity(ctx), el);
    let rails = [...el.querySelectorAll<HTMLElement>('.rail')];
    // 13-slot rails using 12 / 10 / 13 slots
    expect(rails.map((r) => r.querySelectorAll('.m.free').length)).toEqual([1, 3, 0]);
    expect(rails[0].title).toBe('12 / 13 modules');
    expect(rails.some((r) => r.classList.contains('over'))).toBe(false);
    // a 2-slot hole is twice as wide as a 1-slot breaker (plus the gap)
    const hole = rails[0].querySelector<HTMLElement>('.m.sp')!;
    const breaker = rails[0].querySelectorAll<HTMLElement>('.m')[1];
    expect(hole.style.gridColumn).toBe('span 2');
    expect(breaker.style.gridColumn).toBe('span 1');
    // known rail width: slots shrink to fit the card
    expect(rails[0].getAttribute('style')).toContain('1fr');

    const narrow = structuredClone(board);
    narrow.rows[2].capacity = 10;
    render(renderElectricity({ ...ctx, board: narrow }), el);
    rails = [...el.querySelectorAll<HTMLElement>('.rail')];
    expect(rails[2].classList.contains('over')).toBe(true);
    expect(rails[2].title).toBe('13 / 10 modules');

    // unknown rail width: nothing invented
    render(renderElectricity({ ...ctx, board: { ...board, modules_per_row: null } }), el);
    expect(el.querySelectorAll('.m.free')).toHaveLength(0);
  });
});

describe('yaml files', () => {
  it('names downloads by kind and day', () => {
    expect(yamlFilename('export', new Date(2026, 10, 1))).toBe('home-infra-map-export-2026-11-01.yaml');
    expect(yamlFilename('dashboard', new Date(2026, 0, 9))).toBe('home-infra-map-dashboard-2026-01-09.yaml');
  });
});

describe('switch front panel', () => {
  it('draws copper and SFP ports with link / PoE LEDs', () => {
    const el = mount();
    render(
      renderSwitch({
        hass: mockHass(),
        payload,
        t,
        lang: 'fr',
        onOpenDevice: noop,
        switchId: null,
        selectedPort: 9,
        onSelectSwitch: noop,
        onSelectPort: noop,
      }),
      el,
    );
    expect(el.querySelectorAll('.p')).toHaveLength(28);
    expect(el.querySelectorAll('.sw-sfp .p.sfp')).toHaveLength(4);
    const p9 = el.querySelector('[data-port="9"]')!;
    expect(p9.className).toContain('up');
    expect(p9.className).toContain('poe');
    expect(p9.className).toContain('sel');
    expect(el.querySelector('[data-port="5"]')!.className).not.toContain('up');
    expect(el.querySelector('dl.detail')!.textContent).toContain('AP-Etage');
  });
});

describe('topology', () => {
  it('nests the weather station under its access point', () => {
    const el = mount();
    render(renderTopology({ hass: mockHass(), payload, t, lang: 'fr', onOpenDevice: noop }), el);
    const nodes = [...el.querySelectorAll<HTMLElement>('[data-device-id]')];
    const ap = nodes.findIndex((n) => n.textContent!.includes("Point d'accès étage"));
    const printer = nodes.findIndex((n) => n.textContent!.includes('192.168.30.40'));
    expect(printer).toBe(ap + 1);
    expect(parseFloat(nodes[printer].style.marginLeft.replace(/[^0-9*]/g, '').split('*')[1] ?? '0')).not.toBeNaN();
    expect(el.textContent).toContain('Internet');
  });
});

describe('firewall tab', () => {
  it('lists the rules of the weather station in the mockup order, own rule highlighted', () => {
    const el = mount();
    render(renderFirewall(firewallReport, t, 'fr'), el);
    const rows = [...el.querySelectorAll('table.fw-out tbody tr')];
    expect(rows.map((r) => r.querySelector('.desc')!.textContent!.trim())).toEqual([
      'Objets → routeur : DNS',
      'Objets → routeur : NTP',
      'Objets → domotique (192.168.50.10), tous ports',
      'Objets : INTERDIT vers les réseaux internes',
      'Station météo → service météo uniquement',
      "Objets : tout le reste d'Internet est BLOQUÉ",
    ]);
    expect(rows.map((r) => r.getAttribute('data-action'))).toEqual(['pass', 'pass', 'pass', 'block', 'pass', 'block']);
    expect(rows[4].className).toBe('hl');
    expect(rows[4].textContent).toContain("règle propre à l'appareil");
    expect(rows[0].textContent).toContain('routeur (192.168.30.1):53');
    expect(rows[3].textContent).toContain('réseaux internes');
    const who = Object.fromEntries(
      [...el.querySelectorAll('.fw-in .chip')].map((c) => [c.textContent!.trim().split(/\s/)[0], c.getAttribute('data-verdict')]),
    );
    expect(who).toMatchObject({ Admin: 'allowed', Famille: 'allowed', VPN: 'allowed', Invités: 'blocked', WAN: 'blocked' });
    expect(el.querySelectorAll('table.fw-blocks tbody tr')).toHaveLength(3);
    expect(el.textContent).toContain('firmware.example.net');
  });

  it('explains when OPNsense is not available', () => {
    const el = mount();
    render(renderFirewall({ available: false, reason: 'unavailable' }, t, 'fr'), el);
    expect(el.textContent).toContain('injoignable');
  });
});
