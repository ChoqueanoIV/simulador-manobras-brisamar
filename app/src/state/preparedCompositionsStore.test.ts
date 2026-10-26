import { beforeEach, expect, it } from 'vitest';
import { useSimulationStore } from './simulationStore';
import { hasLocomotive } from '../simulation/domain/composition/composition';

beforeEach(() => useSimulationStore.setState(useSimulationStore.getInitialState(), true));

function prepare() {
  const state = useSimulationStore.getState();
  state.addWagonBlock('L22_SUPERIOR', { quantity: 5, label: 'FVR', color: '#aaa' });
  state.addLocomotive('L22_SUPERIOR', { number: '3820', orientation: 'front-barra' });
  state.addWagonBlock('L22_SUPERIOR', { quantity: 3, label: 'EPI', color: '#bbb' });
  return useSimulationStore
    .getState()
    .yardSections.find((item) => item.sectionId === 'L22_SUPERIOR')!.rollingStock;
}

it('início converte grupos marcados atomicamente e preserva cenário visual, notas e posições vazias', () => {
  const items = prepare();
  const state = useSimulationStore.getState();
  state.toggleInitialCoupling('L22_SUPERIOR', items[0].id, items[1].id);
  state.setStationNotes('Passagem de serviço');
  const before = useSimulationStore.getState();
  let updates = 0;
  const unsubscribe = useSimulationStore.subscribe((next) => {
    updates++;
    expect(next.mode).toBe('simulation');
    expect(next.compositions.map((item) => item.units.length)).toEqual([6, 3]);
    expect(next.compositionOrigins).toHaveLength(2);
  });
  state.startSimulation();
  unsubscribe();
  const after = useSimulationStore.getState();
  expect(updates).toBe(1);
  expect(after.yardSections).toBe(before.yardSections);
  expect(after.preparationCouplings).toBe(before.preparationCouplings);
  expect(after.switches).toBe(before.switches);
  expect(after.stationNotes).toBe(before.stationNotes);
  expect(after.positionedCompositions).toEqual([]);
  expect(after.compositions.map(hasLocomotive)).toEqual([true, false]);
  expect(state.moveComposition(after.compositions[0].id, 'head')).toEqual({
    ok: false,
    reason: 'position-not-found',
  });
  state.startSimulation();
  expect(useSimulationStore.getState()).toBe(after);
});

it('rejeita cenário corrompido sem iniciar ou publicar conversão parcial', () => {
  prepare();
  useSimulationStore.setState({
    preparationCouplings: [
      {
        sectionId: 'L22_SUPERIOR',
        leftRollingStockId: 'ausente',
        rightRollingStockId: 'ausente',
      },
    ],
  });
  const before = useSimulationStore.getState();
  expect(() => before.startSimulation()).toThrow(/Engate/);
  expect(useSimulationStore.getState()).toBe(before);
});

it('não mistura cenário preparado com inicialização lógica explícita', () => {
  prepare();
  useSimulationStore.setState({ compositions: [{ id: 'explicita', units: [] }] });
  const before = useSimulationStore.getState();
  expect(() => before.startSimulation()).toThrow(/juntos/);
  expect(useSimulationStore.getState()).toBe(before);
});
