import { beforeEach, describe, expect, it } from 'vitest';
import { useSimulationStore } from './simulationStore';
import type { YardSectionId } from '../preparation/types/preparation';

beforeEach(() => useSimulationStore.setState(useSimulationStore.getInitialState(), true));

function prepare(sectionId: YardSectionId) {
  const state = useSimulationStore.getState();
  state.addWagonBlock(sectionId, { quantity: 5, label: 'FVR', color: '#aaa' });
  state.addLocomotive(sectionId, { number: '3820', orientation: 'rear-barra' });
  state.addWagonBlock(sectionId, { quantity: 5, label: 'FVR', color: '#aaa' });
  return useSimulationStore.getState().yardSections.find((item) => item.sectionId === sectionId)!
    .rollingStock;
}

describe('preparação — engates no store', () => {
  it('começa separado e acrescentar material não cria engate', () => {
    const items = prepare('L22_SUPERIOR');
    const state = useSimulationStore.getState();
    expect(state.preparationCouplings).toEqual([]);
    state.toggleInitialCoupling('L22_SUPERIOR', items[0].id, items[1].id);
    const coupled = useSimulationStore.getState();
    state.addLocomotive('L22_SUPERIOR', { number: '3812', orientation: 'front-barra' });
    expect(useSimulationStore.getState().preparationCouplings).toBe(coupled.preparationCouplings);
    expect(coupled.yardSections).toBe(state.yardSections);
    expect(useSimulationStore.getState().positionedCompositions).toEqual([]);
    expect(useSimulationStore.getState().compositions).toEqual([]);
  });

  it('reset remove apenas os engates da seção limpa numa única atualização', () => {
    const a = prepare('L22_SUPERIOR');
    const b = prepare('L24_SUPERIOR');
    const state = useSimulationStore.getState();
    state.toggleInitialCoupling('L22_SUPERIOR', a[0].id, a[1].id);
    state.toggleInitialCoupling('L24_SUPERIOR', b[0].id, b[1].id);
    let updates = 0;
    const unsubscribe = useSimulationStore.subscribe((next) => {
      updates++;
      expect(
        next.yardSections.find((item) => item.sectionId === 'L22_SUPERIOR')?.rollingStock,
      ).toEqual([]);
      expect(next.preparationCouplings.map((item) => item.sectionId)).toEqual(['L24_SUPERIOR']);
    });
    state.resetYardSection('L22_SUPERIOR');
    unsubscribe();
    expect(updates).toBe(1);
  });

  it('início preserva ligações e impede marcação, desmarcação e reset posteriores', () => {
    const items = prepare('L22_SUPERIOR');
    const state = useSimulationStore.getState();
    state.toggleInitialCoupling('L22_SUPERIOR', items[0].id, items[1].id);
    state.startSimulation();
    const before = useSimulationStore.getState();
    state.toggleInitialCoupling('L22_SUPERIOR', items[0].id, items[1].id);
    state.toggleInitialCoupling('L22_SUPERIOR', items[1].id, items[2].id);
    state.resetYardSection('L22_SUPERIOR');
    expect(useSimulationStore.getState()).toBe(before);
    expect(before.preparationCouplings).toHaveLength(1);
  });

  it('rejeita pares de seções diferentes sem modificar o estado', () => {
    const a = prepare('L22_SUPERIOR');
    const b = prepare('L24_SUPERIOR');
    const before = useSimulationStore.getState();
    expect(() => before.toggleInitialCoupling('L22_SUPERIOR', a[0].id, b[1].id)).toThrow();
    expect(useSimulationStore.getState()).toBe(before);
  });
});
