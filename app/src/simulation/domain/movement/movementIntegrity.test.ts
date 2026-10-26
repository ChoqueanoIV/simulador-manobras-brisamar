import { describe, expect, it } from 'vitest';
import { brisamarSegments } from '../../../yard/data/brisamarTopology';
import {
  brisamarSwitchDefinitions,
  initialSwitchStates,
} from '../../../yard/data/brisamarSwitches';
import { createPosition, isValidPosition } from '../position/compositionPosition';
import { resolveNextSegment } from '../navigation/navigationEngine';
import { stepComposition } from './stepComposition';

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

describe('integridade de movimento com topologia real', () => {
  it.each(['SEG-L16', 'SEG-L18', 'SEG-L20', 'SEG-DIAG-L20-AMV09'])(
    'impede qualquer saída de %s sem intervalo em ambos os sentidos',
    (id) => {
      const segment = brisamarSegments.find((item) => item.id === id)!;
      const position = createPosition(segment, segment.endNodeId);
      for (const direction of ['head', 'tail'] as const) {
        expect(
          stepComposition(
            composition,
            position,
            direction,
            brisamarSegments,
            brisamarSwitchDefinitions,
            initialSwitchStates,
            'not-granted',
          ),
        ).toEqual({
          ok: false,
          reason:
            direction === 'tail' && segment.stopBoardNodeId === segment.startNodeId
              ? 'stop-board'
              : 'interval-required',
        });
      }
    },
  );

  it('permite sair da diagonal protegida com intervalo pela conexão AMV-09 alinhada', () => {
    const segment = brisamarSegments.find((item) => item.id === 'SEG-DIAG-L20-AMV09')!;
    const switches = initialSwitchStates.map((state) =>
      state.id === 'AMV-09' ? { ...state, position: 'B' as const } : state,
    );
    expect(
      stepComposition(
        composition,
        createPosition(segment, 'N-AMV09-B'),
        'head',
        brisamarSegments,
        brisamarSwitchDefinitions,
        switches,
        'granted',
      ),
    ).toEqual({
      ok: true,
      nextPosition: {
        segmentId: 'SEG-L22-05-09',
        headNodeId: 'N-AMV05-A',
        tailNodeId: 'N-AMV09-C',
      },
    });
  });

  it.each(['segmento', 'frente', 'cauda', 'iguais'])('rejeita posição incoerente: %s', (kind) => {
    const segment = brisamarSegments.find((item) => item.id === 'SEG-L22-SUP')!;
    const position = createPosition(segment, segment.endNodeId);
    if (kind === 'segmento') position.segmentId = 'ausente';
    if (kind === 'frente') position.headNodeId = 'ausente';
    if (kind === 'cauda') position.tailNodeId = 'ausente';
    if (kind === 'iguais') position.tailNodeId = position.headNodeId;
    expect(isValidPosition(position, brisamarSegments)).toBe(false);
    expect(
      stepComposition(
        composition,
        position,
        'head',
        brisamarSegments,
        brisamarSwitchDefinitions,
        initialSwitchStates,
        'granted',
      ),
    ).toEqual({ ok: false, reason: 'invalid-position' });
  });

  it('não inventa terminal quando falta estado do AMV', () => {
    expect(
      resolveNextSegment(
        'SEG-L22-SUP',
        'N-AMV05-C',
        brisamarSegments,
        brisamarSwitchDefinitions,
        [],
        'granted',
      ),
    ).toEqual({ ok: false, reason: 'invalid-topology' });
  });

  it('recusa nó se dados externos associarem a ponta a dois AMVs', () => {
    expect(
      resolveNextSegment(
        'SEG-L16-TEC',
        'N-AMV06-C',
        brisamarSegments,
        {
          ...brisamarSwitchDefinitions,
          'AMV-07': {
            ...brisamarSwitchDefinitions['AMV-07'],
            nodeB: 'N-AMV06-C',
          },
        },
        initialSwitchStates,
        'granted',
      ),
    ).toEqual({ ok: false, reason: 'invalid-topology' });
  });

  it('recusa escolha arbitrária se os dados fornecidos duplicarem uma saída de AMV', () => {
    const switches = initialSwitchStates.map((state) =>
      state.id === 'AMV-03' ? { ...state, position: 'B' as const } : state,
    );
    expect(
      resolveNextSegment(
        'SEG-L24-02-03',
        'N-AMV03-C',
        [
          ...brisamarSegments,
          {
            ...brisamarSegments.find((segment) => segment.id === 'SEG-L30')!,
            id: 'SEG-SAIDA-DUPLICADA-TESTE',
          },
        ],
        brisamarSwitchDefinitions,
        switches,
        'granted',
      ),
    ).toEqual({ ok: false, reason: 'invalid-topology' });
  });

  it('recusa segmento ou nó de saída inexistente', () => {
    for (const [segment, node] of [
      ['ausente', 'N-AMV05-C'],
      ['SEG-L22-SUP', 'ausente'],
    ]) {
      expect(
        resolveNextSegment(
          segment,
          node,
          brisamarSegments,
          brisamarSwitchDefinitions,
          initialSwitchStates,
          'granted',
        ),
      ).toEqual({ ok: false, reason: 'invalid-topology' });
    }
  });
});
