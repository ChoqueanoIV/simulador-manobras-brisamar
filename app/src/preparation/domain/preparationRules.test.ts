import { describe, expect, it } from 'vitest';
import type { YardSectionState } from '../types/preparation';
import {
  appendLocomotive,
  appendWagonBlock,
  getSectionOccupiedUnits,
  getSectionWagonQuantity,
  isCapacityExceeded,
  resetSection,
  validateLocomotiveNumber,
  validateWagonQuantity,
} from './preparationRules';

const emptySection: YardSectionState = {
  sectionId: 'L22_INFERIOR',
  rollingStock: [],
};

describe('preparation rules', () => {
  it('rejeita quantidade zero de vagões', () => {
    expect(validateWagonQuantity(0).valid).toBe(false);
  });

  it('rejeita quantidade negativa de vagões', () => {
    expect(validateWagonQuantity(-1).valid).toBe(false);
  });

  it('aceita um vagão', () => {
    expect(validateWagonQuantity(1).valid).toBe(true);
  });

  it('rejeita locomotiva sem número', () => {
    expect(validateLocomotiveNumber('   ').valid).toBe(false);
  });

  it('preserva a ordem dos materiais cadastrados', () => {
    const withWagons = appendWagonBlock(emptySection, {
      id: 'wb-1',
      kind: 'wagon-block',
      quantity: 5,
      label: 'FVR',
      color: '#999999',
    });

    const withLocomotive = appendLocomotive(withWagons, {
      id: 'loco-1',
      kind: 'locomotive',
      number: '3820',
      orientation: 'front-barra',
    });

    const finalState = appendWagonBlock(withLocomotive, {
      id: 'wb-2',
      kind: 'wagon-block',
      quantity: 3,
      label: 'EPI',
      color: '#777777',
    });

    expect(finalState.rollingStock.map((item) => item.kind)).toEqual([
      'wagon-block',
      'locomotive',
      'wagon-block',
    ]);
  });

  it('não une blocos iguais automaticamente', () => {
    const first = appendWagonBlock(emptySection, {
      id: 'wb-1',
      kind: 'wagon-block',
      quantity: 5,
      label: 'FVR',
      color: '#999999',
    });

    const second = appendWagonBlock(first, {
      id: 'wb-2',
      kind: 'wagon-block',
      quantity: 5,
      label: 'FVR',
      color: '#999999',
    });

    expect(second.rollingStock).toHaveLength(2);
  });

  it('reseta todo o conteúdo do trecho', () => {
    const populated = appendWagonBlock(emptySection, {
      id: 'wb-1',
      kind: 'wagon-block',
      quantity: 10,
      label: 'FVR',
      color: '#999999',
    });

    expect(resetSection(populated).rollingStock).toEqual([]);
  });

  it('soma apenas vagões quando solicitado', () => {
    const withWagons = appendWagonBlock(emptySection, {
      id: 'wb-1',
      kind: 'wagon-block',
      quantity: 50,
      label: 'FVR',
      color: '#999999',
    });

    const withLocomotive = appendLocomotive(withWagons, {
      id: 'loco-1',
      kind: 'locomotive',
      number: '3820',
      orientation: 'front-barra',
    });

    expect(getSectionWagonQuantity(withLocomotive)).toBe(50);
  });

  it('conta locomotiva como uma unidade de ocupação', () => {
    const withLocomotive = appendLocomotive(emptySection, {
      id: 'loco-1',
      kind: 'locomotive',
      number: '3820',
      orientation: 'front-barra',
    });

    expect(getSectionOccupiedUnits(withLocomotive)).toBe(1);
  });

  it('soma vagões e locomotivas na ocupação do trecho', () => {
    const withWagons = appendWagonBlock(emptySection, {
      id: 'wb-1',
      kind: 'wagon-block',
      quantity: 54,
      label: 'FVR',
      color: '#999999',
    });

    const withLocomotive = appendLocomotive(withWagons, {
      id: 'loco-1',
      kind: 'locomotive',
      number: '3820',
      orientation: 'front-barra',
    });

    expect(getSectionOccupiedUnits(withLocomotive)).toBe(55);
    expect(isCapacityExceeded(withLocomotive, 55)).toBe(false);
  });

  it('alerta capacidade excedida considerando locomotivas', () => {
    const withWagons = appendWagonBlock(emptySection, {
      id: 'wb-1',
      kind: 'wagon-block',
      quantity: 55,
      label: 'FVR',
      color: '#999999',
    });

    const withLocomotive = appendLocomotive(withWagons, {
      id: 'loco-1',
      kind: 'locomotive',
      number: '3820',
      orientation: 'front-barra',
    });

    expect(getSectionOccupiedUnits(withLocomotive)).toBe(56);
    expect(isCapacityExceeded(withLocomotive, 55)).toBe(true);
  });
});
