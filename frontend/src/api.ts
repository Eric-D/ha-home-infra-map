/** Websocket / HTTP calls of the card. */
import type {
  Device,
  EntityRef,
  FirewallReport,
  Hass,
  OpnsenseProposals,
  Payload,
  ProbeResult,
  Section,
} from './types.js';

export const DOMAIN = 'home_infra_map';

export type ModelEvent = ({ kind: 'model' } & Payload) | { kind: 'live'; live: Payload['live'] };

export interface WsError {
  code?: string;
  message?: string;
}

export function errorCode(err: unknown): string {
  return (err as WsError)?.code ?? 'unknown_error';
}

export function errorMessage(err: unknown): string {
  const e = err as WsError;
  return e?.message ?? e?.code ?? String(err);
}

export const fetchPayload = (hass: Hass) => hass.callWS<Payload>({ type: `${DOMAIN}/get` });

export function subscribe(hass: Hass, cb: (event: ModelEvent) => void) {
  return hass.connection.subscribeMessage<ModelEvent>(cb, { type: `${DOMAIN}/subscribe` });
}

export const save = (hass: Hass, section: Section, data: unknown, expectedRevision: number | undefined) =>
  hass.callWS<{ revision: number; section_revisions: Record<Section, number> }>({
    type: `${DOMAIN}/save`,
    section,
    data,
    expected_revision: expectedRevision,
  });

export const probe = (hass: Hass, host: string) => hass.callWS<ProbeResult>({ type: `${DOMAIN}/probe`, host });

export const previewEntities = (hass: Hass, device: Partial<Device>) =>
  hass.callWS<EntityRef[]>({ type: `${DOMAIN}/preview_entities`, device });

export const opnsensePreview = (hass: Hass) =>
  hass.callWS<OpnsenseProposals>({ type: `${DOMAIN}/import_opnsense` });

export const opnsenseApply = (hass: Hass, vlans: string[], devices: string[], expectedRevision?: number) =>
  hass.callWS<{ applied: boolean }>({
    type: `${DOMAIN}/import_opnsense`,
    apply: true,
    vlans,
    devices,
    expected_revision: expectedRevision,
  });

export const firewall = (hass: Hass, deviceId: string) =>
  hass.callWS<FirewallReport>({ type: `${DOMAIN}/firewall`, device_id: deviceId });

export const exportYaml = (hass: Hass) => hass.callWS<{ yaml: string }>({ type: `${DOMAIN}/export` });

export const importYaml = (hass: Hass, content: string) =>
  hass.callWS<Record<string, number>>({ type: `${DOMAIN}/import_yaml`, content });

export const generateDashboard = (hass: Hass) =>
  hass.callWS<{ yaml: string }>({ type: `${DOMAIN}/generate_dashboard` });

/** 24 h history (minimal rows) of some entities. */
export async function history24h(hass: Hass, entityIds: string[]): Promise<Record<string, any[]>> {
  if (!entityIds.length) return {};
  const end = new Date();
  const start = new Date(end.getTime() - 24 * 3600 * 1000);
  return hass.callWS<Record<string, any[]>>({
    type: 'history/history_during_period',
    start_time: start.toISOString(),
    end_time: end.toISOString(),
    entity_ids: entityIds,
    minimal_response: true,
    no_attributes: true,
    significant_changes_only: false,
  });
}

export function photoPath(boardId: string): string {
  return `/api/${DOMAIN}/photo/${encodeURIComponent(boardId)}`;
}

/** Photos are behind authentication: <img> needs a signed URL. */
export async function signedPhotoUrl(hass: Hass, boardId: string, version: string): Promise<string> {
  const res = await hass.callWS<{ path: string }>({ type: 'auth/sign_path', path: photoPath(boardId), expires: 3600 });
  const sep = res.path.includes('?') ? '&' : '?';
  return `${res.path}${sep}v=${encodeURIComponent(version)}`;
}

export async function uploadPhoto(hass: Hass, boardId: string, file: File): Promise<string> {
  if (!hass.fetchWithAuth) throw new Error('upload not supported by this frontend');
  const body = new FormData();
  body.append('file', file);
  const res = await hass.fetchWithAuth(photoPath(boardId), { method: 'POST', body });
  const data = (await res.json().catch(() => ({}))) as { photo_path?: string; message?: string };
  if (!res.ok || !data.photo_path) throw new Error(data.message ?? `HTTP ${res.status}`);
  return data.photo_path;
}
