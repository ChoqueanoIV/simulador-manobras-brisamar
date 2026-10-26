import { beforeEach, describe, expect, it } from 'vitest';
import { useSimulationStore } from './simulationStore';
import { brisamarNodes, brisamarSegments } from '../yard/data/brisamarTopology';
import { brisamarSwitchDefinitions, initialSwitchStates } from '../yard/data/brisamarSwitches';
import type { SwitchId, SwitchPosition } from '../types/switch';
import { createPosition } from '../simulation/domain/position/compositionPosition';
import { stepComposition } from '../simulation/domain/movement/stepComposition';

const composition = {
  id: 'C1',
  units: [
    {
      id: 'L1',
      kind: 'locomotive' as const,
      number: '3820',
      orientation: 'front-barra' as const,
    },
  ],
};

beforeEach(() => useSimulationStore.setState(useSimulationStore.getInitialState(), true));

function setup(positions: Partial<Record<SwitchId, SwitchPosition>>) {
  const state = useSimulationStore.getState();
  state.requestInterval();
  for (const [id, position] of Object.entries(positions)) {
    if (position === 'B') state.operateSwitch(id as SwitchId);
  }
  state.initializeCompositions([
    {
      composition,
      position: createPosition(
        brisamarSegments.find((segment) => segment.id === 'SEG-L22-05-09')!,
        'N-AMV09-C',
      ),
    },
  ]);
  state.startSimulation();
  return state;
}

const routes = [
  {
    line: 'L20',
    positions: { 'AMV-09': 'B', 'AMV-08': 'A', 'AMV-07': 'B' },
    segments: ['SEG-DIAG-L20-AMV09', 'SEG-L20'],
  },
  {
    line: 'L18',
    positions: { 'AMV-09': 'B', 'AMV-08': 'B', 'AMV-07': 'A' },
    segments: ['SEG-DIAG-L20-AMV09', 'SEG-DIAG-L18-AMV08', 'SEG-L18'],
  },
  {
    line: 'L16',
    positions: { 'AMV-09': 'B', 'AMV-08': 'B', 'AMV-07': 'B' },
    segments: ['SEG-DIAG-L20-AMV09', 'SEG-DIAG-L18-AMV08', 'SEG-DIAG-L16-AMV07', 'SEG-L16'],
  },
] satisfies Array<{
  line: string;
  positions: Partial<Record<SwitchId, SwitchPosition>>;
  segments: string[];
}>;

describe.each(routes)('diagonal validada — destino $line', ({ positions, segments }) => {
  it('atravessa cada AMV na ordem e retorna pelo caminho alinhado', () => {
    const state = setup(positions);
    for (const segment of segments) {
      const result = state.moveComposition('C1', 'head');
      expect(result.ok && result.nextPosition.segmentId).toBe(segment);
    }
    const back = [...segments.slice(0, -1).reverse(), 'SEG-L22-05-09'];
    back.forEach((segment, index) => {
      const result = state.moveComposition('C1', index === 0 ? 'tail' : 'head');
      expect(result.ok && result.nextPosition.segmentId).toBe(segment);
    });
  });

  it('ao entregar intervalo mantém o material imóvel até nova concessão', () => {
    const state = setup(positions);
    for (const segment of segments) {
      const result = state.moveComposition('C1', 'head');
      expect(result.ok && result.nextPosition.segmentId).toBe(segment);
    }
    expect(state.returnInterval()).toBe(true);
    const before = useSimulationStore.getState();
    expect(state.moveComposition('C1', 'tail')).toEqual({ ok: false, reason: 'interval-required' });
    expect(useSimulationStore.getState()).toBe(before);
    state.requestInterval();
    expect(state.moveComposition('C1', 'tail').ok).toBe(true);
  });
});

describe('intervalo autoriza; cada AMV determina o caminho', () => {
  it('conceder intervalo não altera AMVs e AMV-09 em A mantém a rota L22', () => {
    const before = useSimulationStore.getState().switches;
    const state = setup({});
    expect(useSimulationStore.getState().switches.map((item) => item.position)).toEqual(
      before.map((item) => item.position),
    );
    const result = state.moveComposition('C1', 'head');
    expect(result.ok && result.nextPosition.segmentId).toBe('SEG-L22-09-10');
  });

  it('sem intervalo não entra na diagonal mesmo com AMV-09 alinhado para ela', () => {
    const segment = brisamarSegments.find((item) => item.id === 'SEG-L22-05-09')!;
    const states = initialSwitchStates.map((state) =>
      state.id === 'AMV-09' ? { ...state, position: 'B' as const } : state,
    );
    expect(
      stepComposition(
        composition,
        createPosition(segment, 'N-AMV09-C'),
        'head',
        brisamarSegments,
        brisamarSwitchDefinitions,
        states,
        'not-granted',
      ),
    ).toEqual({ ok: false, reason: 'interval-required' });
  });

  it.each([
    ['SEG-L20', 'N-AMV08-B', 'AMV-08', 'B'],
    ['SEG-L18', 'N-AMV07-B', 'AMV-07', 'B'],
    ['SEG-DIAG-L18-AMV08', 'N-AMV08-D', 'AMV-08', 'A'],
    ['SEG-DIAG-L16-AMV07', 'N-AMV07-D', 'AMV-07', 'A'],
    ['SEG-DIAG-L20-AMV09', 'N-AMV09-B', 'AMV-09', 'A'],
  ] as const)('retorno por %s para diante de chave contra', (segmentId, head, id, position) => {
    const segment = brisamarSegments.find((item) => item.id === segmentId)!;
    const states = initialSwitchStates.map((state) =>
      state.id === id ? { ...state, position } : state,
    );
    expect(
      stepComposition(
        composition,
        createPosition(segment, head),
        'head',
        brisamarSegments,
        brisamarSwitchDefinitions,
        states,
        'granted',
      ),
    ).toEqual({ ok: false, reason: 'switch-against' });
  });

  it('colisão bloqueia destino e ocupação bloqueia manipulação do AMV-08', () => {
    const state = useSimulationStore.getState();
    state.requestInterval();
    state.initializeCompositions([
      {
        composition,
        position: createPosition(
          brisamarSegments.find((item) => item.id === 'SEG-DIAG-L20-AMV09')!,
          'N-AMV08-C',
        ),
      },
      {
        composition: { id: 'C2', units: [] },
        position: createPosition(
          brisamarSegments.find((item) => item.id === 'SEG-L20')!,
          'N-AMV08-B',
        ),
      },
    ]);
    state.startSimulation();
    const before = useSimulationStore.getState();
    expect(state.moveComposition('C1', 'head')).toEqual({ ok: false, reason: 'collision' });
    expect(useSimulationStore.getState()).toBe(before);
    state.operateSwitch('AMV-08');
    expect(
      useSimulationStore.getState().switches.find((item) => item.id === 'AMV-08')?.position,
    ).toBe('A');
  });

  it('cada ponta pertence a um único AMV e todos os nós são cadastrados', () => {
    const owners = new Set<string>();
    const nodes = new Set(brisamarNodes.map((node) => node.id));
    for (const def of Object.values(brisamarSwitchDefinitions)) {
      for (const node of [def.nodeCommon, def.nodeA, def.nodeB]) {
        expect(owners.has(node)).toBe(false);
        expect(nodes.has(node)).toBe(true);
        owners.add(node);
      }
    }
    for (const segment of brisamarSegments) {
      expect(nodes.has(segment.startNodeId)).toBe(true);
      expect(nodes.has(segment.endNodeId)).toBe(true);
    }
  });
});
