/** Custom element registration, robust to Home Assistant's scoped registry polyfill.

HA installs @webcomponents/scoped-custom-element-registry, which REPLACES
window.customElements. A definition made before the polyfill lands in the
native registry, invisible to HA ("Custom element doesn't exist"). The card is
loaded as a Lovelace resource (after the polyfill) but the fallback
add_extra_js_url path may run earlier: we then re-register every tag in the
current registry with a fresh subclass (a class cannot be defined twice). */
import { log } from './log.js';

const registered: [string, CustomElementConstructor][] = [];
const attempts = new Map<string, number>();
const MAX_REREGISTRATIONS = 3;

/** Guarded define: on Android WebView the module can be re-evaluated after sleep. */
export function defineOnce(tag: string, cls: CustomElementConstructor): void {
  registered.push([tag, cls]);
  if (!customElements.get(tag)) customElements.define(tag, cls);
}

export function ensureRegisteredInCurrentRegistry(): number {
  let count = 0;
  for (const [tag, cls] of registered) {
    if (customElements.get(tag)) continue;
    const n = attempts.get(tag) ?? 0;
    if (n >= MAX_REREGISTRATIONS) continue;
    attempts.set(tag, n + 1);
    try {
      customElements.define(tag, class extends (cls as any) {} as CustomElementConstructor);
      count += 1;
      log('warn', 'register', 're-registered %s at t=%dms: the element registry was replaced', tag, Math.round(performance.now()));
    } catch (err) {
      log('error', 'register', 'cannot re-register %s: %o', tag, err);
    }
  }
  return count;
}

/** Rebuild error cards left behind by HA when the view was built before our definition. */
export function repairOrphanErrorCards(tag: string): number {
  let repaired = 0;
  const walk = (node: Element): void => {
    if (node.localName === 'hui-error-card') {
      const holder = node as unknown as { _config?: { message?: string; error?: string }; config?: { message?: string; error?: string } };
      const cfg = holder._config ?? holder.config;
      const message = `${cfg?.message ?? ''} ${cfg?.error ?? ''}`;
      if (message.includes(tag)) {
        node.dispatchEvent(new CustomEvent('ll-rebuild', { bubbles: true, composed: true }));
        repaired += 1;
      }
      return;
    }
    for (const child of [...(node.shadowRoot?.children ?? []), ...node.children]) walk(child as Element);
  };
  if (document.body) walk(document.body);
  return repaired;
}

export function scheduleRepairs(tag: string): void {
  for (const delay of [0, 50, 150, 400, 1000, 2000, 4000]) {
    window.setTimeout(() => {
      try {
        ensureRegisteredInCurrentRegistry();
        const n = repairOrphanErrorCards(tag);
        if (n) log('warn', 'register', '%d error card(s) rebuilt after %dms', n, delay);
      } catch (err) {
        log('error', 'register', 'repair failed: %o', err);
      }
    }, delay);
  }
}
