import raw from '../dev/fixture.json';
import type { FirewallReport, Hass, Payload } from '../src/types.js';

export const payload = raw.get as unknown as Payload;
export const states = raw.states as unknown as Hass['states'];
export const firewallReport = Object.values(raw.firewall)[0] as unknown as FirewallReport;

export function mockHass(overrides: Partial<Hass> = {}): Hass {
  return {
    states,
    user: { is_admin: true },
    locale: { language: 'fr' },
    callWS: async () => ({}) as never,
    connection: { subscribeMessage: async () => () => undefined },
    ...overrides,
  } as Hass;
}

export function mount(): HTMLElement {
  const el = document.createElement('div');
  document.body.appendChild(el);
  return el;
}
