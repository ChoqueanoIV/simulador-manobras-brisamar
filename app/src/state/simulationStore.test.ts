import { describe, expect, it, beforeEach } from 'vitest';
import { useSimulationStore } from './simulationStore';

/**
 * Reseta o store antes de cada teste para garantir isolamento.
 * O Zustand expõe setState internamente; usamos a API de resetar
 * a partir do estado inicial recriando a store.
 */
function resetStore() {
  useSimulationStore.setState({
    mode: 'preparation',
    interval: 'not-granted',
    stationNotes: '',
    yardSections: useSimulationStore
      .getState()
      .yardSections.map((section) => ({ ...section, rollingStock: [] })),
  });
}

describe('simulationStore — startSimulation', () => {
  beforeEach(() => {
    resetStore();
  });

  it('inicia no modo preparation', () => {
    expect(useSimulationStore.getState().mode).toBe('preparation');
  });

  it('transiciona de preparation para simulation', () => {
    useSimulationStore.getState().startSimulation();
    expect(useSimulationStore.getState().mode).toBe('simulation');
  });

  it('não permite chamar startSimulation duas vezes', () => {
    useSimulationStore.getState().startSimulation();
    // segunda chamada não deve causar erro nem mudar estado já em simulation
    useSimulationStore.getState().startSimulation();
    expect(useSimulationStore.getState().mode).toBe('simulation');
  });
});

describe('simulationStore — bloqueios no modo simulation', () => {
  beforeEach(() => {
    resetStore();
    useSimulationStore.getState().startSimulation();
  });

  it('bloqueia addLocomotive após iniciar simulação', () => {
    const sectionId = 'L22_INFERIOR';
    const before = useSimulationStore
      .getState()
      .yardSections.find((s) => s.sectionId === sectionId)?.rollingStock.length;

    useSimulationStore.getState().addLocomotive(sectionId, {
      number: '3820',
      orientation: 'front-barra',
    });

    const after = useSimulationStore
      .getState()
      .yardSections.find((s) => s.sectionId === sectionId)?.rollingStock.length;

    expect(after).toBe(before);
  });

  it('bloqueia addWagonBlock após iniciar simulação', () => {
    const sectionId = 'L22_INFERIOR';
    const before = useSimulationStore
      .getState()
      .yardSections.find((s) => s.sectionId === sectionId)?.rollingStock.length;

    useSimulationStore.getState().addWagonBlock(sectionId, {
      quantity: 10,
      label: 'FVR',
      color: '#999999',
    });

    const after = useSimulationStore
      .getState()
      .yardSections.find((s) => s.sectionId === sectionId)?.rollingStock.length;

    expect(after).toBe(before);
  });

  it('bloqueia resetYardSection após iniciar simulação', () => {
    const sectionId = 'L22_INFERIOR';

    // primeiro popula via reset do store — precisamos de material para confirmar bloqueio
    useSimulationStore.setState({
      mode: 'simulation',
      yardSections: useSimulationStore.getState().yardSections.map((s) =>
        s.sectionId === sectionId
          ? {
              ...s,
              rollingStock: [
                {
                  id: 'test-wb',
                  kind: 'wagon-block',
                  quantity: 5,
                  label: 'FVR',
                  color: '#aaa',
                },
              ],
            }
          : s,
      ),
    });

    useSimulationStore.getState().resetYardSection(sectionId);

    const after = useSimulationStore
      .getState()
      .yardSections.find((s) => s.sectionId === sectionId)?.rollingStock.length;

    expect(after).toBe(1);
  });

  it('bloqueia setStationNotes após iniciar simulação', () => {
    useSimulationStore.getState().setStationNotes('nova anotação');
    expect(useSimulationStore.getState().stationNotes).toBe('');
  });
});
