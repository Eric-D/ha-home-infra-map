import { render } from 'lit';
import { describe, expect, it } from 'vitest';
import { boxLinks, circuitPoints, circuitTree, conduitTarget, sideSlots } from '../src/helpers/boxes.js';
import { FeedIndex } from '../src/helpers/electric.js';
import { translator } from '../src/i18n.js';
import { renderBox, renderCircuitPath, type BoxesCtx } from '../src/views/boxes.js';
import { blankBox, blankConduit, toggleJoin } from '../src/views/boxes-edit.js';
import { mount, payload } from './fixture.js';

const t = translator('fr');
const boxes = payload.model.boxes!;
const refs = new Map(payload.model.boards.flatMap((b) => b.rows.flatMap((r) => r.modules)).map((m) => [m.ref, m.id]));
const [hall, room1, room2] = boxes;
const ctx: BoxesCtx = {
  hass: undefined,
  t,
  boxes,
  index: new FeedIndex(payload.model.boards),
  selectedBoxId: hall.id,
  selectedConduitId: null,
  onSelectBox: () => undefined,
  onSelectModule: () => undefined,
  onMoreInfo: () => undefined,
};

describe('junction boxes', () => {
  it('follows a circuit from the board through the boxes', () => {
    const tree = circuitTree(boxes, refs.get('T1-R1-5')!);
    expect(tree.roots.map((n) => n.box.name)).toEqual([hall.name]);
    expect(tree.roots[0].children.map((n) => n.box.name)).toEqual([room1.name, room2.name]);
    expect(tree.roots[0].children[0].points).toHaveLength(3);
    expect(tree.loose).toHaveLength(0);
    expect(circuitPoints(boxes, refs.get('T1-R1-5')!)).toEqual({ socket: 6 });
  });

  it('resolves links written on the other box', () => {
    const links = boxLinks(boxes);
    const entry = room1.conduits[0];
    expect(conduitTarget(room1, entry, boxes, links)?.box.id).toBe(hall.id);
    expect(sideSlots(hall, 'top')).toBe(3);
  });

  it('draws the conduits by side, the unknown ones apart, and the Wagos', () => {
    const el = mount();
    render(renderBox(hall, ctx), el);
    expect(el.querySelectorAll('g.bx-sg')).toHaveLength(9); // 3 top + 2 per other side
    expect(el.querySelectorAll('g.bx-sg.free')).toHaveLength(0);
    expect(el.querySelector('svg')!.textContent).toContain('G1');
    expect(el.querySelector('.bx-unplaced')!.textContent).toContain('gaine grise');
    // full joins drawn as lines (G1-B1-D1 star, B2-D2), the other Wagos listed
    expect(el.querySelectorAll('.bx-join')).toHaveLength(4);
    expect(el.querySelectorAll('.bx-k')).toHaveLength(2);
    expect(el.textContent).toContain('gaines non précisées');
    render(renderBox(room2, ctx), el);
    expect(el.querySelector('svg')!.textContent).toContain('B?');
    expect(el.textContent).toContain('Connexions non décrites');
  });

  it('draws an extension box as pairs and carries the circuit through them', () => {
    const attic = boxes[3];
    const el = mount();
    render(renderBox(attic, { ...ctx, selectedBoxId: attic.id, selectedConduitId: attic.conduits[1].id }), el);
    expect(el.querySelectorAll('.bx-join')).toHaveLength(4);
    expect(el.querySelectorAll('.bx-k')).toHaveLength(0);
    // D1 has no circuit written: carried from G1 by the link
    expect(el.querySelector('dl.bx-detail')!.textContent).toContain('T1-R1-1');
    expect(el.querySelector('dl.bx-detail')!.textContent).toContain('déduit de la liaison');
    expect(circuitPoints(boxes, refs.get('T1-R1-1')!)).toEqual({ light: 1 });
  });

  it('shows the path in the breaker detail', () => {
    const el = mount();
    render(renderCircuitPath(refs.get('T1-R1-5')!, ctx), el);
    expect(el.textContent).toContain('Desserte');
    expect(el.textContent).toContain('Chambre 1 · lit gauche');
  });
});

describe('box editing', () => {
  it('joins conduits two by two, extends a join, and removes it', () => {
    const box = blankBox('B');
    const [a, b, c] = [blankConduit('left', 1), blankConduit('right', 1), blankConduit('bottom', 1)];
    box.conduits.push(a, b, c);
    toggleJoin(box, a.id, b.id);
    expect(box.connectors).toHaveLength(1);
    expect(box.connectors[0]).toMatchObject({ wire: 'all', conduits: [a.id, b.id] });
    toggleJoin(box, c.id, a.id); // a cable split in three
    expect(box.connectors[0].conduits.sort()).toEqual([a.id, b.id, c.id].sort());
    toggleJoin(box, a.id, c.id);
    toggleJoin(box, a.id, b.id);
    expect(box.connectors).toHaveLength(0);
  });

  it('carries the circuit through a join made in the editor', () => {
    const box = blankBox('B');
    const from = { ...blankConduit('left', 1), end: 'board' as const, circuits: ['m1'] };
    const to = { ...blankConduit('right', 1), end: 'point' as const, point: { kind: 'socket' as const, label: '', room: 'Salon', count: 2, entity_id: null, alert: null } };
    box.conduits.push(from, to);
    toggleJoin(box, from.id, to.id);
    expect(circuitPoints([box], 'm1')).toEqual({ socket: 2 });
  });
});
