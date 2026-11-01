/** Small UI helpers: HA selectors with plain-HTML fallbacks, events. */
import { html, nothing, type TemplateResult } from 'lit';
import type { Hass } from './types.js';

export function fire(node: EventTarget, type: string, detail?: unknown): void {
  node.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
}

export function moreInfo(node: EventTarget, entityId: string): void {
  fire(node, 'hass-more-info', { entityId });
}

export function toast(node: EventTarget, message: string): void {
  fire(node, 'hass-notification', { message });
}

let loading: Promise<void> | null = null;

/** HA lazy-loads ha-selector & co; force their definition through a card editor. */
export function ensureHaElements(): Promise<void> {
  if (customElements.get('ha-selector')) return Promise.resolve();
  if (loading) return loading;
  loading = (async () => {
    try {
      const helpers = await (window as any).loadCardHelpers?.();
      if (!helpers) return;
      const card = await helpers.createCardElement({ type: 'entities', entities: [] });
      await (card?.constructor as any)?.getConfigElement?.();
      const tile = customElements.get('hui-tile-card') as any;
      await tile?.getConfigElement?.();
    } catch {
      /* the plain-HTML fallbacks are used */
    }
  })();
  return loading;
}

export function hasHaSelector(): boolean {
  return !!customElements.get('ha-selector');
}

/** Entity selector filtered on a sensor device_class, fallback: input + datalist. */
export function entityField(
  hass: Hass,
  id: string,
  label: string,
  value: string | null,
  deviceClass: string | null,
  onChange: (value: string | null) => void,
  domains?: string[],
): TemplateResult {
  if (hasHaSelector()) {
    const filter = deviceClass ? { domain: 'sensor', device_class: deviceClass } : domains ? { domain: domains } : undefined;
    return html`<div class="f">
      <ha-selector
        .hass=${hass}
        .selector=${{ entity: filter ? { filter } : {} }}
        .value=${value ?? ''}
        .label=${label}
        @value-changed=${(e: CustomEvent) => onChange((e.detail?.value as string) || null)}
      ></ha-selector>
    </div>`;
  }
  const options = Object.keys(hass.states)
    .filter((eid) => !deviceClass || hass.states[eid]?.attributes?.device_class === deviceClass)
    .filter((eid) => !domains || domains.includes(eid.split('.')[0]))
    .sort();
  return html`<div class="f">
    <label for=${id}>${label}</label>
    <input
      class="inp"
      id=${id}
      list=${`${id}-list`}
      .value=${value ?? ''}
      @change=${(e: Event) => onChange((e.target as HTMLInputElement).value.trim() || null)}
    />
    <datalist id=${`${id}-list`}>${options.map((o) => html`<option value=${o}></option>`)}</datalist>
  </div>`;
}

export function areaNames(hass: Hass | undefined, ids: (string | null | undefined)[]): string[] {
  return ids.filter((i): i is string => !!i).map((i) => hass?.areas?.[i]?.name ?? i);
}

/** Area selector (single or multiple), fallback: <select>. */
export function areaField(
  hass: Hass,
  id: string,
  label: string,
  value: string[] | string | null,
  multiple: boolean,
  onChange: (value: string[]) => void,
): TemplateResult {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  if (hasHaSelector()) {
    return html`<div class="f">
      <ha-selector
        .hass=${hass}
        .selector=${{ area: { multiple } }}
        .value=${multiple ? values : values[0] ?? ''}
        .label=${label}
        @value-changed=${(e: CustomEvent) => {
          const v = e.detail?.value;
          onChange(Array.isArray(v) ? v : v ? [v] : []);
        }}
      ></ha-selector>
    </div>`;
  }
  const areas = Object.values(hass.areas ?? {}).sort((a, b) => a.name.localeCompare(b.name));
  return html`<div class="f">
    <label for=${id}>${label}</label>
    <select
      class="sel"
      id=${id}
      ?multiple=${multiple}
      @change=${(e: Event) => {
        const sel = e.target as HTMLSelectElement;
        onChange(Array.from(sel.selectedOptions).map((o) => o.value).filter(Boolean));
      }}
    >
      ${multiple ? nothing : html`<option value="" ?selected=${!values.length}>—</option>`}
      ${areas.map((a) => html`<option value=${a.area_id} ?selected=${values.includes(a.area_id)}>${a.name}</option>`)}
    </select>
  </div>`;
}

export function textField(
  id: string,
  label: string,
  value: string | number | null | undefined,
  onChange: (value: string) => void,
  opts: { type?: string; placeholder?: string; hint?: TemplateResult | string; onBlur?: () => void } = {},
): TemplateResult {
  return html`<div class="f">
    <label for=${id}>${label}</label>
    <input
      class="inp"
      id=${id}
      type=${opts.type ?? 'text'}
      placeholder=${opts.placeholder ?? ''}
      .value=${value === null || value === undefined ? '' : String(value)}
      @input=${(e: Event) => onChange((e.target as HTMLInputElement).value)}
      @blur=${() => opts.onBlur?.()}
    />
    ${opts.hint ?? nothing}
  </div>`;
}

export function selectField<T extends string | number>(
  id: string,
  label: string,
  value: T | null | undefined,
  options: { value: T | ''; label: string }[],
  onChange: (value: string) => void,
): TemplateResult {
  return html`<div class="f">
    <label for=${id}>${label}</label>
    <select class="sel" id=${id} @change=${(e: Event) => onChange((e.target as HTMLSelectElement).value)}>
      ${options.map(
        (o) => html`<option value=${String(o.value)} ?selected=${String(o.value) === String(value ?? '')}>${o.label}</option>`,
      )}
    </select>
  </div>`;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand?.('copy') ?? false;
    area.remove();
    return ok;
  }
}

export function fmtTime(iso: string | null, lang: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' });
}

export function fmtDateTime(iso: string | null, lang: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(lang, { dateStyle: 'short', timeStyle: 'short' });
}
