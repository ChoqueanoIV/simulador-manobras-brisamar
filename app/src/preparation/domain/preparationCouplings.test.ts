import { describe, expect, it } from 'vitest';
import type { YardSectionState } from '../types/preparation';
import { hasPreparationCoupling, togglePreparationCoupling } from './preparationCouplings';

const section: YardSectionState = {
  sectionId: 'L22_SUPERIOR',
  rollingStock: [
    { id: 'B1', kind: 'wagon-block', quantity: 5, label: 'FVR', color: '#aaa' },
    { id: 'L1', kind: 'locomotive', number: '3820', orientation: 'front-barra' },
    { id: 'B2', kind: 'wagon-block', quantity: 5, label: 'FVR', color: '#aaa' },
  ],
};

describe('engates iniciais declarados', () => {
  it('marca duas ligações independentemente, preservando origem e ordem dos materiais', () => {
    const before = structuredClone(section);
    const first = togglePreparationCoupling(section, [], 'B1', 'L1');
    const second = togglePreparationCoupling(section, first, 'L1', 'B2');
    expect(first).toHaveLength(1);
    expect(second).toHaveLength(2);
    expect(hasPreparationCoupling(second, section.sectionId, 'B1', 'L1')).toBe(true);
    expect(section).toEqual(before);
    expect(section.rollingStock[0].id).not.toBe(section.rollingStock[2].id);
    expect(togglePreparationCoupling(section, second, 'B1', 'L1')).toEqual([second[1]]);
    expect(second).toHaveLength(2);
  });

  it.each([
    ['B1', 'B2'],
    ['L1', 'B1'],
    ['B1', 'B1'],
    ['ausente', 'L1'],
    ['B2', 'externo'],
  ])('rejeita pares sem adjacência ordenada: %s / %s', (left, right) => {
    expect(() => togglePreparationCoupling(section, [], left, right)).toThrow(/consecutivos/);
  });

  it('distingue seções mesmo quando recebe IDs iguais', () => {
    const first = togglePreparationCoupling(section, [], 'B1', 'L1');
    expect(hasPreparationCoupling(first, 'L24_SUPERIOR', 'B1', 'L1')).toBe(false);
    const other = { ...section, sectionId: 'L24_SUPERIOR' as const };
    const second = togglePreparationCoupling(other, first, 'B1', 'L1');
    expect(togglePreparationCoupling(section, second, 'B1', 'L1')).toEqual([second[1]]);
  });
});
