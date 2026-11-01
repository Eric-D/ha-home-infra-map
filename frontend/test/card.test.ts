import { describe, expect, it } from 'vitest';
import '../src/card.js';
import { mockHass, payload } from './fixture.js';

describe('card element', () => {
  it('is registered once, with the card picker entry', () => {
    expect(customElements.get('home-infra-map-card')).toBeDefined();
    expect(customElements.get('home-infra-map-card-editor')).toBeDefined();
    expect(window.customCards?.filter((c) => c.type === 'home-infra-map-card')).toHaveLength(1);
  });

  it('accepts partial configs and only rejects non-objects', () => {
    const card = document.createElement('home-infra-map-card') as any;
    expect(() => card.setConfig({ type: 'custom:home-infra-map-card' })).not.toThrow();
    expect(() => card.setConfig({ type: 'custom:home-infra-map-card', view: 'network', network_view: 'vlan' })).not.toThrow();
    expect(() => card.setConfig(null)).toThrow();
    expect(card.getGridOptions().rows).toBe('auto');
    const ctor = customElements.get('home-infra-map-card') as any;
    expect(ctor.getStubConfig()).toEqual({ type: 'custom:home-infra-map-card', view: 'electricity' });
  });

  it('loads the payload and renders a ha-card', async () => {
    const card = document.createElement('home-infra-map-card') as any;
    card.setConfig({ type: 'custom:home-infra-map-card', view: 'network' });
    card.hass = mockHass({
      callWS: (async (msg: { type: string }) => {
        if (msg.type === 'home_infra_map/get') return payload;
        return {};
      }) as never,
    });
    document.body.appendChild(card);
    for (let i = 0; i < 20 && !card._payload; i++) await new Promise((r) => setTimeout(r, 10));
    await card.updateComplete;
    expect(card.shadowRoot.querySelector('ha-card')).not.toBeNull();
    expect(card.shadowRoot.textContent).toContain('16 équipement(s) en ligne');
    // non-admin: no pencil
    card.hass = { ...card.hass, user: { is_admin: false } };
    await card.updateComplete;
    expect(card.shadowRoot.querySelector('[aria-label="Modifier"]')).toBeNull();
    card.remove();
  });

  it('shows a clear message when the integration is missing', async () => {
    const card = document.createElement('home-infra-map-card') as any;
    card.setConfig({ type: 'custom:home-infra-map-card' });
    card.hass = mockHass({
      callWS: (async () => {
        throw { code: 'not_configured', message: 'x' };
      }) as never,
    });
    document.body.appendChild(card);
    await new Promise((r) => setTimeout(r, 20));
    await card.updateComplete;
    expect(card.shadowRoot.textContent).toContain("n'est pas configurée");
    card.remove();
  });
});

describe('card editor', () => {
  it('emits config-changed with the chosen view', async () => {
    const editor = document.createElement('home-infra-map-card-editor') as any;
    editor.setConfig({ type: 'custom:home-infra-map-card' });
    document.body.appendChild(editor);
    await editor.updateComplete;
    let config: any;
    editor.addEventListener('config-changed', (e: CustomEvent) => (config = e.detail.config));
    const select = editor.shadowRoot.querySelector('#cfg-view') as HTMLSelectElement;
    select.value = 'network';
    select.dispatchEvent(new Event('change'));
    expect(config).toEqual({ type: 'custom:home-infra-map-card', view: 'network' });
    editor.remove();
  });
});
