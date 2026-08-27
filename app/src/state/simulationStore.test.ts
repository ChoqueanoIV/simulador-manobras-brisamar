import { beforeEach, describe, expect, it } from 'vitest';

import { initialSwitchStates } from '../yard/data/brisamarSwitches';
import type { PositionedComposition } from '../simulation/domain/collision/collisionRules';
import { useSimulationStore } from './simulationStore';

/**
 * Reseta o store antes de cada teste para garantir isolamento.
 */
function resetStore() {
  useSimulationStore.setState({
    mode: 'preparation',
    interval: 'not-granted',
    stationNotes: '',
    switches: initialSwitchStates.map((switchState) => ({
      ...switchState,
    })),
    positionedCompositions: [],
    yardSections: useSimulationStore
      .getState()
      .yardSections.map((section) => ({
        ...section,
        rollingStock: [],
      })),
  });
}

function positionedComposition(
  compositionId: string,
  segmentId: string,
): PositionedComposition {
  return {
    compositionId,
    position: {
      segmentId,
      headNodeId: 'HEAD',
      tailNodeId: 'TAIL',
    },
  };
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
      .yardSections.find(
        (section) => section.sectionId === sectionId,
      )?.rollingStock.length;

    useSimulationStore.getState().addLocomotive(sectionId, {
      number: '3820',
      orientation: 'front-barra',
    });

    const after = useSimulationStore
      .getState()
      .yardSections.find(
        (section) => section.sectionId === sectionId,
      )?.rollingStock.length;

    expect(after).toBe(before);
  });

  it('bloqueia addWagonBlock após iniciar simulação', () => {
    const sectionId = 'L22_INFERIOR';
    const before = useSimulationStore
      .getState()
      .yardSections.find(
        (section) => section.sectionId === sectionId,
      )?.rollingStock.length;

    useSimulationStore.getState().addWagonBlock(sectionId, {
      quantity: 10,
      label: 'FVR',
      color: '#999999',
    });

    const after = useSimulationStore
      .getState()
      .yardSections.find(
        (section) => section.sectionId === sectionId,
      )?.rollingStock.length;

    expect(after).toBe(before);
  });

  it('bloqueia resetYardSection após iniciar simulação', () => {
    const sectionId = 'L22_INFERIOR';

    useSimulationStore.setState({
      mode: 'simulation',
      yardSections: useSimulationStore
        .getState()
        .yardSections.map((section) =>
          section.sectionId === sectionId
            ? {
                ...section,
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
            : section,
        ),
    });

    useSimulationStore
      .getState()
      .resetYardSection(sectionId);

    const after = useSimulationStore
      .getState()
      .yardSections.find(
        (section) => section.sectionId === sectionId,
      )?.rollingStock.length;

    expect(after).toBe(1);
  });

  it('bloqueia setStationNotes após iniciar simulação', () => {
    useSimulationStore
      .getState()
      .setStationNotes('nova anotação');

    expect(
      useSimulationStore.getState().stationNotes,
    ).toBe('');
  });
});

describe('simulationStore — ocupação derivada dos AMVs', () => {
  beforeEach(() => {
    resetStore();
  });

  it('inicia sem composições posicionadas', () => {
    expect(
      useSimulationStore.getState().positionedCompositions,
    ).toEqual([]);
  });

  it('marca AMV-05 como ocupado ao posicionar composição em segmento adjacente', () => {
    useSimulationStore
      .getState()
      .setPositionedCompositions([
        positionedComposition('COMP-1', 'SEG-L22-SUP'),
      ]);

    const switch05 = useSimulationStore
      .getState()
      .switches.find(
        (switchState) => switchState.id === 'AMV-05',
      );

    expect(switch05?.occupied).toBe(true);
  });

  it('libera AMV-05 quando a composição deixa seus segmentos adjacentes', () => {
    useSimulationStore
      .getState()
      .setPositionedCompositions([
        positionedComposition('COMP-1', 'SEG-L22-SUP'),
      ]);

    expect(
      useSimulationStore
        .getState()
        .switches.find(
          (switchState) => switchState.id === 'AMV-05',
        )?.occupied,
    ).toBe(true);

    useSimulationStore
      .getState()
      .setPositionedCompositions([
        positionedComposition('COMP-1', 'SEG-L30'),
      ]);

    expect(
      useSimulationStore
        .getState()
        .switches.find(
          (switchState) => switchState.id === 'AMV-05',
        )?.occupied,
    ).toBe(false);
  });

  it('impede operar AMV ocupado usando a regra já existente de toggleSwitch', () => {
    useSimulationStore
      .getState()
      .setPositionedCompositions([
        positionedComposition('COMP-1', 'SEG-L22-SUP'),
      ]);

    const before = useSimulationStore
      .getState()
      .switches.find(
        (switchState) => switchState.id === 'AMV-05',
      );

    useSimulationStore.getState().operateSwitch('AMV-05');

    const after = useSimulationStore
      .getState()
      .switches.find(
        (switchState) => switchState.id === 'AMV-05',
      );

    expect(before?.occupied).toBe(true);
    expect(after?.position).toBe(before?.position);
    expect(after?.occupied).toBe(true);
  });
});
