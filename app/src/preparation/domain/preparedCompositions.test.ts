import { describe, expect, it } from 'vitest';
import type { PreparationCoupling, YardSectionState } from '../types/preparation';
import { buildPreparedCompositions } from './preparedCompositions';
import { hasLocomotive } from '../../simulation/domain/composition/composition';

function section(): YardSectionState {
  return {
    sectionId: 'L22_SUPERIOR',
    rollingStock: [
      { id: 'B1', kind: 'wagon-block', quantity: 5, label: 'FVR', color: '#aaa' },
      { id: 'L1', kind: 'locomotive', number: '3820', orientation: 'rear-barra' },
      { id: 'B2', kind: 'wagon-block', quantity: 3, label: 'FVR', color: '#bbb' },
    ],
  };
}

function coupling(left = 'B1', right = 'L1'): PreparationCoupling {
  return { sectionId: 'L22_SUPERIOR', leftRollingStockId: left, rightRollingStockId: right };
}

describe('conversão da preparação em composições', () => {
  it('sem marcas cria três grupos separados e expande somente os vagões de cada bloco', () => {
    const result = buildPreparedCompositions([section()], []);
    expect(result.compositions.map((item) => item.units.length)).toEqual([5, 1, 3]);
    expect(result.compositions.map(hasLocomotive)).toEqual([false, true, false]);
    expect(result.origins.map((item) => item.rollingStockIds)).toEqual([['B1'], ['L1'], ['B2']]);
    const units = result.compositions.flatMap((item) => item.units);
    expect(new Set(units.map((item) => item.id)).size).toBe(9);
    expect(units[0]).toMatchObject({
      kind: 'wagon-unit',
      sourceBlockId: 'B1',
      label: 'FVR',
      color: '#aaa',
    });
    expect(units[5]).toMatchObject({ id: 'L1', orientation: 'rear-barra' });
    expect(units[6]).toMatchObject({
      kind: 'wagon-unit',
      sourceBlockId: 'B2',
      label: 'FVR',
      color: '#bbb',
    });
  });

  it('duas marcas formam uma composição com locomotiva no meio sem fundir os blocos', () => {
    const input = section();
    const before = structuredClone(input);
    const result = buildPreparedCompositions([input], [coupling(), coupling('L1', 'B2')]);
    expect(result.compositions).toHaveLength(1);
    expect(result.compositions[0].units).toHaveLength(9);
    expect(result.origins[0].rollingStockIds).toEqual(['B1', 'L1', 'B2']);
    expect(input).toEqual(before);
    result.compositions[0].units[5].id = 'alterado';
    expect(input).toEqual(before);
  });

  it('uma marca liga somente os itens escolhidos', () => {
    const result = buildPreparedCompositions([section()], [coupling('L1', 'B2')]);
    expect(result.compositions.map((item) => item.units.length)).toEqual([5, 4]);
    expect(result.origins.map((item) => item.rollingStockIds)).toEqual([['B1'], ['L1', 'B2']]);
  });

  it('é determinística e não deixa composições de seções diferentes se unirem', () => {
    const input = section();
    const other: YardSectionState = {
      sectionId: 'L24_SUPERIOR',
      rollingStock: [{ id: 'L2', kind: 'locomotive', number: '3812', orientation: 'front-barra' }],
    };
    const first = buildPreparedCompositions([input, other], [coupling()]);
    expect(first).toEqual(buildPreparedCompositions([input, other], [coupling()]));
    expect(first.compositions).toHaveLength(3);
    expect(first.origins.at(-1)?.sectionId).toBe('L24_SUPERIOR');
  });

  it('pátio vazio não produz composição', () => {
    expect(buildPreparedCompositions([{ sectionId: 'L16', rollingStock: [] }], [])).toEqual({
      compositions: [],
      origins: [],
    });
  });

  it.each([0, -1, 1.5, NaN, Infinity])(
    'rejeita quantidade %s antes de devolver resultado',
    (quantity) => {
      const input = section();
      if (input.rollingStock[0].kind === 'wagon-block') input.rollingStock[0].quantity = quantity;
      expect(() => buildPreparedCompositions([input], [])).toThrow(/Quantidade/);
    },
  );

  it.each([
    [coupling('B1', 'B2')],
    [coupling('L1', 'B1')],
    [coupling('ausente', 'L1')],
    [coupling(), coupling()],
    [{ ...coupling(), sectionId: 'L16' as const }],
  ])('rejeita marcas inconsistentes: %j', (...marks) => {
    expect(() => buildPreparedCompositions([section()], marks)).toThrow(/Engate/);
  });

  it('rejeita seção duplicada e material com identidade repetida', () => {
    expect(() => buildPreparedCompositions([section(), section()], [])).toThrow(/Seção/);
    const input = section();
    input.rollingStock[2].id = 'B1';
    expect(() => buildPreparedCompositions([input], [])).toThrow(/Material/);
  });

  it('detecta colisão entre ID de locomotiva e ID gerado de vagão', () => {
    const input = section();
    input.rollingStock[1].id = 'wagon:["B1",1]';
    expect(() => buildPreparedCompositions([input], [])).toThrow(/Veículo/);
  });
});
