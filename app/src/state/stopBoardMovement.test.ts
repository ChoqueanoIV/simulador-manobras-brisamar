import { beforeEach, describe, expect, it } from 'vitest';
import { useSimulationStore } from './simulationStore';
import { brisamarStopBoards } from '../yard/data/brisamarStopBoards';
import { brisamarNodes, brisamarSegments } from '../yard/data/brisamarTopology';
import { createPosition } from '../simulation/domain/position/compositionPosition';

beforeEach(() => useSimulationStore.setState(useSimulationStore.getInitialState(), true));

function setup(board: (typeof brisamarStopBoards)[number], external = false) {
  const segment = brisamarSegments.find(
    (item) => item.id === (external ? `SEG-EXTERNO-${board.id}` : board.segmentId),
  )!;
  const state = useSimulationStore.getState();
  state.initializeCompositions([
    {
      composition: {
        id: 'C1',
        units: [{ id: 'L1', kind: 'locomotive', number: '3820', orientation: 'front-barra' }],
      },
      position: createPosition(segment, board.nodeId),
    },
  ]);
  state.startSimulation();
  return state;
}

describe.each(brisamarStopBoards)('$id — movimento com intervalo do CCO', (board) => {
  it('para no limite sem intervalo, preservando todo o estado', () => {
    const state = setup(board);
    const before = useSimulationStore.getState();
    expect(state.moveComposition('C1', 'head')).toEqual({ ok: false, reason: 'stop-board' });
    expect(useSimulationStore.getState()).toBe(before);
  });

  it('avança além da placa com intervalo e retorna ao pátio pela cauda', () => {
    const state = setup(board);
    state.requestInterval();
    expect(state.moveComposition('C1', 'head')).toEqual({
      ok: true,
      nextPosition: {
        segmentId: `SEG-EXTERNO-${board.id}`,
        headNodeId: `N-EXTERNO-${board.id}`,
        tailNodeId: board.nodeId,
      },
    });
    expect(state.moveComposition('C1', 'tail').ok).toBe(true);
    expect(useSimulationStore.getState().positionedCompositions[0].position.segmentId).toBe(
      board.segmentId,
    );
  });

  it('retirada do intervalo imobiliza material externo, inclusive no retorno', () => {
    const state = setup(board, true);
    state.requestInterval();
    expect(state.returnInterval()).toBe(true);
    const before = useSimulationStore.getState();
    expect(state.moveComposition('C1', 'head')).toEqual({ ok: false, reason: 'stop-board' });
    expect(state.moveComposition('C1', 'tail')).toEqual({ ok: false, reason: 'interval-required' });
    expect(useSimulationStore.getState()).toBe(before);
    state.requestInterval();
    expect(state.moveComposition('C1', 'head').ok).toBe(true);
  });

  it('colisão impede acesso externo ocupado mesmo com intervalo', () => {
    const segment = brisamarSegments.find((item) => item.id === board.segmentId)!;
    const external = brisamarSegments.find((item) => item.id === `SEG-EXTERNO-${board.id}`)!;
    const state = useSimulationStore.getState();
    state.initializeCompositions([
      {
        composition: {
          id: 'C1',
          units: [{ id: 'L1', kind: 'locomotive', number: '3820', orientation: 'rear-barra' }],
        },
        position: createPosition(segment, board.nodeId),
      },
      { composition: { id: 'C2', units: [] }, position: createPosition(external, board.nodeId) },
    ]);
    state.startSimulation();
    state.requestInterval();
    const before = useSimulationStore.getState();
    expect(state.moveComposition('C1', 'head')).toEqual({ ok: false, reason: 'collision' });
    expect(useSimulationStore.getState()).toBe(before);
  });
});

it('mapeamento PARE tem nós reais, segmento interno único e continuidade protegida', () => {
  expect(brisamarStopBoards).toHaveLength(9);
  expect(new Set(brisamarNodes.map((node) => node.id)).size).toBe(brisamarNodes.length);
  expect(new Set(brisamarSegments.map((segment) => segment.id)).size).toBe(brisamarSegments.length);
  for (const board of brisamarStopBoards) {
    expect(brisamarNodes.some((node) => node.id === board.nodeId)).toBe(true);
    const segment = brisamarSegments.find((item) => item.id === board.segmentId)!;
    expect([segment.startNodeId, segment.endNodeId]).toContain(board.nodeId);
    const external = brisamarSegments.find((item) => item.id === `SEG-EXTERNO-${board.id}`)!;
    expect(external.protectedByInterval).toBe(true);
    expect(external.technical).toBe(false);
    expect(brisamarNodes.some((node) => node.id === external.endNodeId)).toBe(true);
  }
});
