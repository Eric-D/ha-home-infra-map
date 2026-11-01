/** Junction boxes: conduit links, circuit paths, labels (pure helpers). */
import type { Box, BoxSide, Conduit } from '../types.js';

export const SIDES: BoxSide[] = ['top', 'left', 'right', 'bottom'];
/** Distinct colours for the circuits of a box (order of appearance). */
export const CIRCUIT_COLORS = ['#03a9f4', '#ab47bc', '#43a047', '#ef6c00', '#e91e63', '#00897b', '#795548', '#5c6bc0'];
export const WIRE_COLORS: Record<string, string> = {
  all: '#78716c',
  phase: '#a0522d',
  neutral: '#2563eb',
  earth: '#16a34a',
  switched: '#7c3aed',
  traveler: '#db2777',
  other: '#6b7280',
  unknown: '#9ca3af',
};

type Key = string; // `${boxId}/${conduitId}` ('' conduit = the box, entry unknown)
const key = (box: string, conduit: string | null): Key => `${box}/${conduit ?? ''}`;

/** Conduit-to-conduit links between boxes, both ways (written on one side only). */
export function boxLinks(boxes: Box[]): Map<Key, [string, string | null]> {
  const links = new Map<Key, [string, string | null]>();
  for (const box of boxes) {
    for (const c of box.conduits) {
      if (c.end === 'box' && c.end_box_id) {
        links.set(key(box.id, c.id), [c.end_box_id, c.end_conduit_id]);
        const back = key(c.end_box_id, c.end_conduit_id);
        if (!links.has(back) && c.end_conduit_id) links.set(back, [box.id, c.id]);
      }
    }
  }
  return links;
}

/** Where a conduit leads, with links written on the other box resolved. */
export function conduitTarget(
  box: Box,
  conduit: Conduit,
  boxes: Box[],
  links = boxLinks(boxes),
): { box: Box; conduit: Conduit | null } | null {
  const link = links.get(key(box.id, conduit.id));
  if (!link) return null;
  const other = boxes.find((b) => b.id === link[0]);
  if (!other) return null;
  return { box: other, conduit: other.conduits.find((c) => c.id === link[1]) ?? null };
}

/**
 * Circuits of every conduit: the written ones, else those carried through a
 * connector (earth excepted: shared by every circuit) or a link to another box.
 */
export function effectiveCircuits(boxes: Box[]): Map<string, string[]> {
  const parent = new Map<string, string>();
  const find = (x: string): string => {
    if (!parent.has(x)) parent.set(x, x);
    let r = x;
    while (parent.get(r) !== r) r = parent.get(r)!;
    parent.set(x, r);
    return r;
  };
  const union = (a: string, b: string) => parent.set(find(a), find(b));
  const written = new Map<string, string[]>();
  for (const box of boxes) {
    for (const c of box.conduits) {
      written.set(c.id, c.circuits);
      find(c.id);
      if (c.end === 'box' && c.end_conduit_id) union(c.id, c.end_conduit_id);
    }
    for (const k of box.connectors) {
      if (k.wire === 'earth') continue;
      for (const other of k.conduits.slice(1)) union(k.conduits[0], other);
    }
  }
  const groups = new Map<string, string[]>();
  for (const [id, circuits] of written) {
    const bucket = groups.get(find(id)) ?? [];
    for (const c of circuits) if (!bucket.includes(c)) bucket.push(c);
    groups.set(find(id), bucket);
  }
  return new Map([...written].map(([id, circuits]) => [id, circuits.length ? circuits : groups.get(find(id)) ?? []]));
}

/** Circuits of a box: listed on the box, in its conduits, on its connectors. */
export function boxCircuits(box: Box): string[] {
  const out: string[] = [];
  const add = (id: string | null) => {
    if (id && !out.includes(id)) out.push(id);
  };
  box.circuits.forEach(add);
  box.conduits.forEach((c) => c.circuits.forEach(add));
  box.connectors.forEach((k) => add(k.circuit));
  return out;
}

export function boxesOfCircuit(boxes: Box[], moduleId: string): Box[] {
  const effective = effectiveCircuits(boxes);
  return boxes.filter((b) => boxCircuits(b).includes(moduleId) || b.conduits.some((c) => effective.get(c.id)?.includes(moduleId)));
}

/** Highest position drawn on each side. */
export function sideSlots(box: Box, side: BoxSide): number {
  const used = Math.max(0, ...box.conduits.filter((c) => c.side === side).map((c) => c.position ?? 0));
  return Math.max(box.sides[side] ?? 0, used);
}

export interface TreeNode {
  box: Box;
  /** conduits of this box carrying the circuit to an end point */
  points: Conduit[];
  /** conduits carrying the circuit to an unknown destination */
  unknown: Conduit[];
  children: TreeNode[];
}

export interface CircuitTree {
  /** boxes reached from the board */
  roots: TreeNode[];
  /** boxes on the circuit whose place in the path is unknown */
  loose: TreeNode[];
}

/** Path of a circuit through the boxes, from the board to the points. */
export function circuitTree(boxes: Box[], moduleId: string): CircuitTree {
  const links = boxLinks(boxes);
  const byId = new Map(boxes.map((b) => [b.id, b]));
  const effective = effectiveCircuits(boxes);
  const carries = (_box: Box, c: Conduit): boolean => (effective.get(c.id) ?? []).includes(moduleId);
  const seen = new Set<string>();
  const visit = (box: Box): TreeNode => {
    seen.add(box.id);
    const node: TreeNode = { box, points: [], unknown: [], children: [] };
    const nextBoxes: Box[] = [];
    for (const c of box.conduits) {
      if (!carries(box, c)) continue;
      if (c.end === 'point') node.points.push(c);
      else if (c.end === 'unknown' && !links.has(key(box.id, c.id))) node.unknown.push(c);
      const t = links.get(key(box.id, c.id));
      const other = t ? byId.get(t[0]) : undefined;
      if (other && !seen.has(other.id) && !nextBoxes.includes(other)) nextBoxes.push(other);
    }
    // links to this box written without a conduit on our side
    for (const other of boxes) {
      for (const c of other.conduits) {
        if (c.end === 'box' && c.end_box_id === box.id && !c.end_conduit_id && carries(other, c)) {
          if (!seen.has(other.id) && !nextBoxes.includes(other)) nextBoxes.push(other);
        }
      }
    }
    for (const other of nextBoxes) if (!seen.has(other.id)) node.children.push(visit(other));
    return node;
  };
  const roots = boxes
    .filter((b) => b.conduits.some((c) => c.end === 'board' && carries(b, c)))
    .map((b) => (seen.has(b.id) ? null : visit(b)))
    .filter((n): n is TreeNode => n !== null);
  const loose = boxesOfCircuit(boxes, moduleId)
    .filter((b) => !seen.has(b.id))
    .map((b) => visit(b));
  return { roots, loose };
}

/** Points by kind reached by a circuit (as the backend counts them). */
export function circuitPoints(boxes: Box[], moduleId: string): Record<string, number> {
  const effective = effectiveCircuits(boxes);
  const out: Record<string, number> = {};
  for (const b of boxes)
    for (const c of b.conduits)
      if (c.end === 'point' && c.point && effective.get(c.id)?.includes(moduleId))
        out[c.point.kind] = (out[c.point.kind] ?? 0) + c.point.count;
  return out;
}
