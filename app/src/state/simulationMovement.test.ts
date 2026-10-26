import { beforeEach, describe, expect, it } from 'vitest';
import { useSimulationStore, type SimulationComposition } from './simulationStore';
import { initialSwitchStates } from '../yard/data/brisamarSwitches';
import { brisamarSegments } from '../yard/data/brisamarTopology';
import { createPosition } from '../simulation/domain/position/compositionPosition';

function entry(id = 'C1', segmentId = 'SEG-L22-SUP', head?: string): SimulationComposition {
  const segment = brisamarSegments.find((item) => item.id === segmentId)!;
  return {
    composition: {
      id,
      units: [
        {
          id: `loco-${id}`,
          kind: 'locomotive',
          number: '3820',
          orientation: 'front-barra',
        },
      ],
    },
    position: createPosition(segment, head ?? segment.endNodeId),
  };
}

beforeEach(() => useSimulationStore.setState(useSimulationStore.getInitialState(), true));

describe('TASK-013 — registro explícito', () => {
  it('copia composições, unidades e posições, derivando ocupação numa publicação', () => {
    const input = [entry()];
    let publications = 0;
    const unsubscribe = useSimulationStore.subscribe((state) => {
      publications++;
      expect(state.positionedCompositions).toHaveLength(1);
      expect(state.switches.find((item) => item.id === 'AMV-05')?.occupied).toBe(true);
    });
    useSimulationStore.getState().initializeCompositions(input);
    unsubscribe();
    input[0].position.segmentId = 'alterado';
    input[0].composition.units.length = 0;
    input.length = 0;
    const state = useSimulationStore.getState();
    expect(publications).toBe(1);
    expect(state.compositions[0].units).toHaveLength(1);
    expect(state.positionedCompositions[0].position.segmentId).toBe('SEG-L22-SUP');
  });

  it.each(['segmento', 'nó', 'extremidades', 'composição', 'veículo', 'colisão'])(
    'rejeita entrada inválida (%s) sem publicação parcial',
    (kind) => {
      const first = entry();
      const input = [first];
      if (kind === 'segmento') first.position.segmentId = 'inexistente';
      if (kind === 'nó') first.position.headNodeId = 'inexistente';
      if (kind === 'extremidades') first.position.tailNodeId = first.position.headNodeId;
      if (kind === 'composição') input.push(entry());
      if (kind === 'veículo') {
        const second = entry('C2', 'SEG-L30');
        second.composition.units[0].id = first.composition.units[0].id;
        input.push(second);
      }
      if (kind === 'colisão') input.push(entry('C2'));
      const before = useSimulationStore.getState();
      expect(() => before.initializeCompositions(input)).toThrow();
      expect(useSimulationStore.getState()).toBe(before);
    },
  );

  it('não substitui cenário após início, nem inventa posições ou engates', () => {
    const state = useSimulationStore.getState();
    state.addLocomotive('L22_SUPERIOR', { number: '3820', orientation: 'rear-barra' });
    const sections = useSimulationStore.getState().yardSections;
    state.startSimulation();
    state.initializeCompositions([entry()]);
    expect(useSimulationStore.getState().compositions).toHaveLength(1);
    expect(useSimulationStore.getState().compositions[0].units).toEqual(sections.find(
      (section) => section.sectionId === 'L22_SUPERIOR',
    )!.rollingStock);
    expect(useSimulationStore.getState().positionedCompositions).toEqual([]);
    expect(useSimulationStore.getState().yardSections).toBe(sections);
  });

  it('setter legado copia posições e rejeita dados inválidos', () => {
    const input = [{ compositionId: 'C1', position: entry().position }];
    useSimulationStore.getState().setPositionedCompositions(input);
    input[0].position.headNodeId = 'inválido';
    expect(useSimulationStore.getState().positionedCompositions[0].position.headNodeId).toBe(
      'N-AMV05-C',
    );
    const before = useSimulationStore.getState();
    expect(() => before.setPositionedCompositions(input)).toThrow();
    expect(useSimulationStore.getState()).toBe(before);
  });
});

describe('TASK-013 — movimento integrado', () => {
  it('move com topologia real e atualiza ocupação atomicamente sem alterar preparação', () => {
    const state = useSimulationStore.getState();
    state.initializeCompositions([entry()]);
    state.startSimulation();
    const before = useSimulationStore.getState();
    let publications = 0;
    const unsubscribe = useSimulationStore.subscribe((next) => {
      publications++;
      expect(next.positionedCompositions[0].position.segmentId).toBe('SEG-L22-05-09');
      expect(next.switches.find((item) => item.id === 'AMV-09')?.occupied).toBe(true);
    });
    const result = state.moveComposition('C1', 'head');
    unsubscribe();
    expect(result.ok).toBe(true);
    expect(publications).toBe(1);
    expect(before.positionedCompositions[0].position.segmentId).toBe('SEG-L22-SUP');
    expect(useSimulationStore.getState().yardSections).toBe(before.yardSections);
    expect(useSimulationStore.getState().compositions).toBe(before.compositions);
    state.operateSwitch('AMV-09');
    expect(
      useSimulationStore.getState().switches.find((item) => item.id === 'AMV-09')?.position,
    ).toBe('A');
  });

  it('permite comando pela cauda e libera AMV distante', () => {
    const state = useSimulationStore.getState();
    state.initializeCompositions([entry('C1', 'SEG-L22-05-09')]);
    state.startSimulation();
    expect(state.moveComposition('C1', 'tail').ok).toBe(true);
    expect(useSimulationStore.getState().positionedCompositions[0].position.segmentId).toBe(
      'SEG-L22-SUP',
    );
    expect(
      useSimulationStore.getState().switches.find((item) => item.id === 'AMV-09')?.occupied,
    ).toBe(false);
  });

  it.each([
    'preparação',
    'desconhecida',
    'sem-posição',
    'sem-loco',
    'terminal',
    'colisão',
    'contra',
    'intervalo',
  ])('preserva estado completo quando bloqueado: %s', (kind) => {
    const first = entry();
    if (kind === 'sem-loco') first.composition.units = [];
    if (kind === 'terminal') first.position = entry('C1', 'SEG-EXTERNO-PARE-L24-SUP').position;
    if (kind === 'contra') first.position = entry('C1', 'SEG-L22-L24-AMV05', 'N-AMV05-B').position;
    if (kind === 'intervalo')
      first.position = entry('C1', 'SEG-DIAG-L20-AMV09', 'N-AMV09-B').position;
    const state = useSimulationStore.getState();
    state.initializeCompositions(
      kind === 'colisão' ? [first, entry('C2', 'SEG-L22-05-09')] : [first],
    );
    if (kind !== 'preparação') state.startSimulation();
    if (kind === 'terminal') state.requestInterval();
    if (kind === 'sem-posição') state.setPositionedCompositions([]);
    const before = useSimulationStore.getState();
    const expected = {
      preparação: 'not-in-simulation',
      desconhecida: 'composition-not-found',
      'sem-posição': 'position-not-found',
      'sem-loco': 'no-locomotive',
      terminal: 'terminal',
      colisão: 'collision',
      contra: 'switch-against',
      intervalo: 'interval-required',
    }[kind];
    expect(state.moveComposition(kind === 'desconhecida' ? 'ausente' : 'C1', 'head')).toEqual({
      ok: false,
      reason: expected,
    });
    expect(useSimulationStore.getState()).toBe(before);
  });

  it('bloqueia entrega com AMV-09 ocupado e preserva ocupação ao normalizar AMVs livres', () => {
    const state = useSimulationStore.getState();
    state.initializeCompositions([entry('C1', 'SEG-L22-05-09')]);
    state.requestInterval();
    const before = useSimulationStore.getState();
    expect(state.returnInterval()).toBe(false);
    expect(useSimulationStore.getState()).toBe(before);
    state.setPositionedCompositions([{ compositionId: 'C1', position: entry().position }]);
    state.operateSwitch('AMV-09');
    expect(state.returnInterval()).toBe(true);
    expect(
      useSimulationStore.getState().switches.find((item) => item.id === 'AMV-09')?.position,
    ).toBe('A');
    expect(
      useSimulationStore.getState().switches.find((item) => item.id === 'AMV-05')?.occupied,
    ).toBe(true);
    expect(initialSwitchStates.every((item) => !item.occupied)).toBe(true);
  });
});
