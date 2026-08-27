import { describe, expect, it } from 'vitest';
import type { Locomotive, WagonUnit } from '../../../rolling-stock/types/rollingStock';
import {
  couple,
  createComposition,
  hasLocomotive,
  splitAt,
} from './composition';

/* ── Helpers ────────────────────────────────────────────── */

function makeLocomotive(id: string): Locomotive {
  return { id, kind: 'locomotive', number: id, orientation: 'front-barra' };
}

function makeWagonUnit(id: string, sourceBlockId = 'block-1'): WagonUnit {
  return { id, kind: 'wagon-unit', label: 'FVR', color: '#aaa', sourceBlockId };
}

/* ── Testes: createComposition ──────────────────────────── */

describe('createComposition', () => {
  it('cria composição com apenas uma locomotiva', () => {
    const loco = makeLocomotive('loco-1');
    const comp = createComposition([loco]);
    expect(comp.units).toHaveLength(1);
    expect(comp.units[0].id).toBe('loco-1');
  });

  it('cria composição com apenas vagões', () => {
    const wagons = [makeWagonUnit('wu-1'), makeWagonUnit('wu-2')];
    const comp = createComposition(wagons);
    expect(comp.units).toHaveLength(2);
  });

  it('cria composição vazia', () => {
    const comp = createComposition([]);
    expect(comp.units).toHaveLength(0);
  });

  it('preserva a ordem das unidades', () => {
    const wu1 = makeWagonUnit('wu-1');
    const loco = makeLocomotive('loco-1');
    const wu2 = makeWagonUnit('wu-2');
    const comp = createComposition([wu1, loco, wu2]);
    expect(comp.units.map((u) => u.id)).toEqual(['wu-1', 'loco-1', 'wu-2']);
  });
});

/* ── Testes: hasLocomotive ──────────────────────────────── */

describe('hasLocomotive', () => {
  it('retorna true quando há locomotiva', () => {
    const comp = createComposition([makeLocomotive('loco-1')]);
    expect(hasLocomotive(comp)).toBe(true);
  });

  it('retorna false quando não há locomotiva', () => {
    const comp = createComposition([makeWagonUnit('wu-1')]);
    expect(hasLocomotive(comp)).toBe(false);
  });

  it('retorna false para composição vazia', () => {
    const comp = createComposition([]);
    expect(hasLocomotive(comp)).toBe(false);
  });

  it('detecta locomotiva no meio da composição', () => {
    const comp = createComposition([
      makeWagonUnit('wu-1'),
      makeLocomotive('loco-1'),
      makeWagonUnit('wu-2'),
    ]);
    expect(hasLocomotive(comp)).toBe(true);
  });
});

/* ── Testes: couple ─────────────────────────────────────── */

describe('couple', () => {
  it('a-tail: une B ao final de A', () => {
    const a = createComposition([makeWagonUnit('wu-1'), makeWagonUnit('wu-2')]);
    const b = createComposition([makeWagonUnit('wu-3')]);
    const result = couple(a, b, 'a-tail');
    expect(result.units.map((u) => u.id)).toEqual(['wu-1', 'wu-2', 'wu-3']);
  });

  it('a-head: une B ao início de A', () => {
    const a = createComposition([makeWagonUnit('wu-1'), makeWagonUnit('wu-2')]);
    const b = createComposition([makeWagonUnit('wu-3')]);
    const result = couple(a, b, 'a-head');
    expect(result.units.map((u) => u.id)).toEqual(['wu-3', 'wu-1', 'wu-2']);
  });

  it('não altera as composições originais (imutável)', () => {
    const a = createComposition([makeWagonUnit('wu-1')]);
    const b = createComposition([makeWagonUnit('wu-2')]);
    couple(a, b, 'a-tail');
    expect(a.units).toHaveLength(1);
    expect(b.units).toHaveLength(1);
  });

  it('resultado tem ID próprio diferente de A e B', () => {
    const a = createComposition([makeWagonUnit('wu-1')]);
    const b = createComposition([makeWagonUnit('wu-2')]);
    const result = couple(a, b, 'a-tail');
    expect(result.id).not.toBe(a.id);
    expect(result.id).not.toBe(b.id);
  });

  it('preserva locomotiva no meio após engate', () => {
    const a = createComposition([
      makeWagonUnit('wu-1'),
      makeLocomotive('loco-1'),
    ]);
    const b = createComposition([makeWagonUnit('wu-2')]);
    const result = couple(a, b, 'a-tail');
    expect(result.units.map((u) => u.id)).toEqual(['wu-1', 'loco-1', 'wu-2']);
  });
});

/* ── Testes: splitAt ────────────────────────────────────── */

describe('splitAt', () => {
  it('divide corretamente no índice 3', () => {
    const comp = createComposition([
      makeWagonUnit('wu-1'),
      makeWagonUnit('wu-2'),
      makeWagonUnit('wu-3'),
      makeWagonUnit('wu-4'),
      makeWagonUnit('wu-5'),
    ]);
    const [left, right] = splitAt(comp, 3);
    expect(left.units.map((u) => u.id)).toEqual(['wu-1', 'wu-2', 'wu-3']);
    expect(right.units.map((u) => u.id)).toEqual(['wu-4', 'wu-5']);
  });

  it('divide no índice 1 — parte A com um único elemento', () => {
    const comp = createComposition([
      makeWagonUnit('wu-1'),
      makeWagonUnit('wu-2'),
      makeWagonUnit('wu-3'),
    ]);
    const [left, right] = splitAt(comp, 1);
    expect(left.units).toHaveLength(1);
    expect(right.units).toHaveLength(2);
  });

  it('divide dentro de um WagonBlock visual — unidades individuais', () => {
    // Simula 5 vagões do mesmo bloco (sourceBlockId = 'block-fvr')
    const units = Array.from({ length: 5 }, (_, i) =>
      makeWagonUnit(`wu-${i + 1}`, 'block-fvr'),
    );
    const comp = createComposition(units);
    const [left, right] = splitAt(comp, 3);

    expect(left.units).toHaveLength(3);
    expect(right.units).toHaveLength(2);
    // As unidades individuais são preservadas com seus IDs originais
    expect(left.units[0].id).toBe('wu-1');
    expect(right.units[0].id).toBe('wu-4');
  });

  it('não altera a composição original (imutável)', () => {
    const comp = createComposition([
      makeWagonUnit('wu-1'),
      makeWagonUnit('wu-2'),
    ]);
    splitAt(comp, 1);
    expect(comp.units).toHaveLength(2);
  });

  it('resultado tem IDs próprios', () => {
    const comp = createComposition([
      makeWagonUnit('wu-1'),
      makeWagonUnit('wu-2'),
    ]);
    const [left, right] = splitAt(comp, 1);
    expect(left.id).not.toBe(comp.id);
    expect(right.id).not.toBe(comp.id);
    expect(left.id).not.toBe(right.id);
  });

  it('lança RangeError para index 0', () => {
    const comp = createComposition([
      makeWagonUnit('wu-1'),
      makeWagonUnit('wu-2'),
    ]);
    expect(() => splitAt(comp, 0)).toThrow(RangeError);
  });

  it('lança RangeError para index igual ao tamanho', () => {
    const comp = createComposition([
      makeWagonUnit('wu-1'),
      makeWagonUnit('wu-2'),
    ]);
    expect(() => splitAt(comp, 2)).toThrow(RangeError);
  });

  it('lança RangeError para index maior que o tamanho', () => {
    const comp = createComposition([
      makeWagonUnit('wu-1'),
      makeWagonUnit('wu-2'),
    ]);
    expect(() => splitAt(comp, 5)).toThrow(RangeError);
  });
});
