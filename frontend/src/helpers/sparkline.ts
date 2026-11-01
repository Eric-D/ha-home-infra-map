/** History → SVG path (unit-tested). */

export interface Point {
  t: number; // epoch ms
  v: number;
}

/** Parse HA minimal history rows ({s, lu} or {state, last_updated}). */
export function parseHistory(rows: any[] | undefined): Point[] {
  if (!rows) return [];
  const points: Point[] = [];
  for (const row of rows) {
    const raw = row.s ?? row.state;
    const v = Number(raw);
    const lu = row.lu ?? row.lc ?? (row.last_updated ? Date.parse(row.last_updated) / 1000 : undefined);
    if (!Number.isFinite(v) || lu === undefined) continue;
    points.push({ t: Number(lu) * 1000, v });
  }
  return points;
}

/** Step-free polyline path scaled to width × height; returns '' when no data. */
export function sparkPath(points: Point[], start: number, end: number, width = 200, height = 42): { line: string; area: string } {
  if (!points.length || end <= start) return { line: '', area: '' };
  const max = Math.max(...points.map((p) => p.v), 1);
  const x = (t: number) => ((Math.min(Math.max(t, start), end) - start) / (end - start)) * width;
  const y = (v: number) => height - 2 - (Math.max(v, 0) / max) * (height - 4);
  const pts = points.map((p) => `${x(p.t).toFixed(1)} ${y(p.v).toFixed(1)}`);
  const last = points[points.length - 1];
  pts.push(`${width} ${y(last.v).toFixed(1)}`);
  const line = `M${pts.join(' L')}`;
  const area = `${line} L${width} ${height} L${x(points[0].t).toFixed(1)} ${height}Z`;
  return { line, area };
}

export interface Segment {
  from: number;
  to: number;
  on: boolean | null;
}

/** Presence timeline from binary_sensor history. */
export function presenceSegments(rows: any[] | undefined, start: number, end: number): Segment[] {
  if (!rows?.length) return [];
  const segs: Segment[] = [];
  const items = rows
    .map((r) => ({ t: Number(r.lu ?? r.lc ?? Date.parse(r.last_updated) / 1000) * 1000, s: String(r.s ?? r.state) }))
    .filter((r) => Number.isFinite(r.t))
    .sort((a, b) => a.t - b.t);
  items.forEach((item, i) => {
    const from = Math.max(item.t, start);
    const to = i + 1 < items.length ? items[i + 1].t : end;
    if (to <= from) return;
    segs.push({ from, to, on: item.s === 'on' ? true : item.s === 'off' ? false : null });
  });
  return segs;
}
