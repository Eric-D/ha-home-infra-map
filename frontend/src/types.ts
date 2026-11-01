/** Shapes of the websocket payloads (see custom_components/home_infra_map/websocket.py). */

export type ModuleKind = 'rcd' | 'breaker' | 'rcbo' | 'device' | 'spacer' | 'meter' | 'main_breaker';
/** active = in service; off = switched off / tripped; spare = installed for future works, not wired. */
export type ModuleStatus = 'active' | 'off' | 'spare';
export type RcdType = 'AC' | 'A' | 'F' | 'B' | '?';
export type Curve = 'B' | 'C' | 'D' | '?';
export type CircuitKind =
  | 'lighting'
  | 'sockets'
  | 'dedicated'
  | 'cooking'
  | 'water_heater'
  | 'heating'
  | 'feeder'
  | 'other'
  | 'unknown';
export type DeviceKind =
  | 'router'
  | 'switch'
  | 'ap'
  | 'server'
  | 'nas'
  | 'camera'
  | 'iot'
  | 'computer'
  | 'phone'
  | 'printer'
  | 'other';

export interface Module {
  id: string;
  kind: ModuleKind;
  ref: string;
  width_modules: number;
  model: string | null;
  notes: string | null;
  status?: ModuleStatus;
  /** Module feeding this one; null = automatic (RCD on the left, else the service entrance). */
  fed_by?: string | null;
  /** Meter: subscribed power (kVA). */
  subscribed_kva?: number | null;
  rating_a: number | null;
  curve: Curve;
  sensitivity_ma: number | null;
  rcd_type: RcdType;
  cable_mm2: number | null;
  circuit_name: string;
  circuit_kind: CircuitKind;
  area_ids: string[];
  power_entity_id: string | null;
  energy_entity_id: string | null;
  switch_entity_id: string | null;
  label: string;
  entity_ids: string[];
}

export interface Row {
  id: string;
  label: string;
  /** DIN slots of this rail when it differs from the board's. */
  capacity?: number | null;
  modules: Module[];
}

export interface Board {
  id: string;
  name: string;
  location: string | null;
  area_id: string | null;
  photo_path: string | null;
  /** DIN slots per rail (13, 18, 24…); null = not documented. */
  modules_per_row?: number | null;
  /** Service entrance, upstream first: utility meter, main breaker. */
  supply?: Module[];
  /** Module of another board feeding this one (sub-board). */
  fed_by?: string | null;
  rows: Row[];
}

export interface Vlan {
  id: string;
  name: string;
  tag: number | null;
  subnet: string | null;
  color: string;
  role: string;
  access_summary: string;
  interface: string | null;
}

export interface Uplink {
  isp: string;
  box_name: string;
  box_ip: string | null;
  public_ip: string | null;
}

export interface Switch {
  id: string;
  name: string;
  host: string | null;
  model: string | null;
  ports_count: number;
  sfp_ports: number[];
  snmp_source_id: string | null;
  port_labels: Record<string, string>;
}

export interface Monitor {
  ping: boolean;
  latency: boolean;
  tcp_port: number | null;
  offline_alert_minutes: number | null;
}

export interface Device {
  id: string;
  name: string;
  host: string;
  mac: string | null;
  vlan_id: string | null;
  switch_id: string | null;
  port: number | null;
  port_source: 'auto' | 'manual';
  last_seen_port_at: string | null;
  area_id: string | null;
  parent_device_id: string | null;
  kind: DeviceKind;
  model: string | null;
  notes: string | null;
  monitor: Monitor;
}

export interface Network {
  vlans: Vlan[];
  uplink: Uplink;
  switches: Switch[];
  devices: Device[];
}

export interface Model {
  house_name: string;
  boards: Board[];
  network: Network;
}

export interface EntityRef {
  key: string;
  entity_id: string;
  port?: number;
  used?: boolean;
  row_id?: string;
  label?: string;
}

export interface PingResult {
  alive: boolean | null;
  rtt_ms: number | null;
  tcp?: boolean | null;
}

export interface SwitchPort {
  port: number;
  if_index: number | null;
  name: string;
  alias: string;
  up: boolean | null;
  speed_mbps: number | null;
  pvid: number | null;
  tagged_vlans: number[];
  untagged_vlans: number[];
  lldp: { sys_name?: string; port_id?: string } | null;
  poe: boolean | null;
  macs: string[];
}

export interface Gateway {
  name: string;
  status: string;
  delay: string | null;
  loss: string | null;
  online: boolean;
}

export interface Live {
  ping: Record<string, PingResult>;
  ping_available: boolean;
  switches: Record<string, { available: boolean; sys_name: string | null; ports: Record<string, SwitchPort> }>;
  opnsense: { configured: boolean; available: boolean; gateways: Gateway[] };
}

export interface Check {
  code: string;
  severity: 'warning' | 'info';
  board_id: string;
  module_id: string | null;
  ref: string;
  params: Record<string, unknown>;
}

export interface Settings {
  default_view: 'electricity' | 'network';
  ping_interval_s: number;
  snmp_interval_s: number;
  opnsense_interval_s: number;
  firewall_analysis: boolean;
  sources: { opnsense: boolean; snmp: { id: string; host: string }[] };
}

export type Section = 'boards' | 'network' | 'house_name';

export interface Payload {
  version: string;
  revision: number;
  section_revisions: Record<Section, number>;
  model: Model;
  settings: Settings;
  entities: Record<string, EntityRef[]>;
  live: Live;
  checks: Check[];
}

export interface Destination {
  kind: 'any' | 'router' | 'network' | 'alias' | 'address' | 'private' | 'unknown';
  value: string;
  label: string;
  not: boolean;
}

export interface FirewallLine {
  uuid: string | null;
  sequence: string | null;
  action: 'pass' | 'block' | 'reject';
  description: string;
  floating: boolean;
  destination: Destination;
  ports: string;
  protocol: string;
  specific: boolean;
  probable: boolean;
  reasons: string[];
}

export interface InboundEntry {
  interface: string;
  label: string;
  verdict: 'allowed' | 'blocked' | 'partial' | 'same_network';
  rule: { uuid: string | null; description: string } | null;
  ports: string;
  probable: boolean;
  reasons: string[];
  nat?: NatEntry[];
}

export interface NatEntry {
  uuid: string | null;
  description: string;
  interface: string;
  protocol: string;
  external_port: string;
  target_port: string;
}

export interface BlockEntry {
  time: string | null;
  destination: string;
  port: string;
  protocol: string;
  rule_uuid: string | null;
  rule: string | null;
  dns_name: string | null;
}

export interface FirewallReport {
  available: boolean;
  reason?: string;
  ip?: string;
  outbound?: {
    interface: string | null;
    interface_label: string | null;
    rules: FirewallLine[];
    redundant: { uuid: string | null; description: string }[];
    unreachable_count: number;
    default_deny: boolean;
  };
  inbound?: InboundEntry[];
  nat?: NatEntry[];
  blocks?: BlockEntry[];
  blocks_24h?: number;
  rule_hits?: Record<string, number>;
  fetched_at?: string | null;
}

export interface ProbeResult {
  host: string;
  ping: { alive: boolean | null; rtt_ms: number | null; ip?: string | null; error?: string } | null;
  vlan: { vlan_id: string | null; name: string; subnet: string; source: string } | null;
  mac: { value: string; source: string } | null;
  port: {
    port: number;
    shared: boolean;
    via_uplink: boolean;
    via: string | null;
    switch_id: string;
    switch_name: string;
    via_device_id: string | null;
  } | null;
}

export interface OpnsenseProposals {
  vlans: { interface: string; name: string; tag: number | null; subnet: string; existing_id: string | null }[];
  devices: { key: string; name: string; host: string; mac: string | null; exists: boolean }[];
}

export interface HassEntity {
  entity_id?: string;
  state: string;
  attributes: Record<string, any>;
}

/** The subset of the frontend `hass` object the card uses. */
export interface Hass {
  states: Record<string, HassEntity>;
  user?: { is_admin: boolean; name?: string };
  locale?: { language: string };
  language?: string;
  areas?: Record<string, { area_id: string; name: string }>;
  themes?: { darkMode?: boolean };
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  connection: {
    subscribeMessage<T>(cb: (msg: T) => void, msg: Record<string, unknown>): Promise<() => Promise<void> | void>;
  };
  fetchWithAuth?(path: string, init?: RequestInit): Promise<Response>;
  hassUrl?(path?: string): string;
}

export type CardView = 'electricity' | 'network';
export type NetworkView = 'topology' | 'vlan' | 'switch';

export interface CardConfig {
  type: string;
  view?: CardView;
  board?: string;
  network_view?: NetworkView;
  title?: string;
}
