import { describe, expect, it } from 'vitest';

import type { CompositionPosition } from '../position/compositionPosition';
import {
  isSegmentOccupiedByOtherComposition,
  type PositionedComposition,
} from './collisionRules';

function makePosition(
  segmentId: string,
  headNodeId = 'NODE-B',
  tailNodeId = 'NODE-A',
): CompositionPosition {
  return {
    segmentId,
    headNodeId,
    tailNodeId,
  };
}

function makePositionedComposition(
  compositionId: string,
  segmentId: string,
): PositionedComposition {
  return {
    compositionId,
    position: makePosition(segmentId),
  };
}

describe('collisionRules', () => {
  it('retorna false quando não há composições posicionadas', () => {
    expect(
      isSegmentOccupiedByOtherComposition(
        'SEG-L22',
        'COMP-1',
        [],
      ),
    ).toBe(false);
  });

  it('retorna false quando nenhuma outra composição ocupa o segmento de destino', () => {
    const positionedCompositions: PositionedComposition[] = [
      makePositionedComposition('COMP-2', 'SEG-L24'),
      makePositionedComposition('COMP-3', 'SEG-L20'),
    ];

    expect(
      isSegmentOccupiedByOtherComposition(
        'SEG-L22',
        'COMP-1',
        positionedCompositions,
      ),
    ).toBe(false);
  });

  it('retorna true quando outra composição ocupa o segmento de destino', () => {
    const positionedCompositions: PositionedComposition[] = [
      makePositionedComposition('COMP-2', 'SEG-L22'),
    ];

    expect(
      isSegmentOccupiedByOtherComposition(
        'SEG-L22',
        'COMP-1',
        positionedCompositions,
      ),
    ).toBe(true);
  });

  it('ignora a própria composição ao verificar ocupação', () => {
    const positionedCompositions: PositionedComposition[] = [
      makePositionedComposition('COMP-1', 'SEG-L22'),
    ];

    expect(
      isSegmentOccupiedByOtherComposition(
        'SEG-L22',
        'COMP-1',
        positionedCompositions,
      ),
    ).toBe(false);
  });

  it('detecta outra composição no mesmo segmento mesmo com a composição atual também presente', () => {
    const positionedCompositions: PositionedComposition[] = [
      makePositionedComposition('COMP-1', 'SEG-L22'),
      makePositionedComposition('COMP-2', 'SEG-L22'),
    ];

    expect(
      isSegmentOccupiedByOtherComposition(
        'SEG-L22',
        'COMP-1',
        positionedCompositions,
      ),
    ).toBe(true);
  });

  it('permite composições em segmentos diferentes da mesma linha lógica', () => {
    const positionedCompositions: PositionedComposition[] = [
      makePositionedComposition('COMP-2', 'SEG-L22-SUP'),
      makePositionedComposition('COMP-3', 'SEG-L22-05-09'),
    ];

    expect(
      isSegmentOccupiedByOtherComposition(
        'SEG-L22-INF',
        'COMP-1',
        positionedCompositions,
      ),
    ).toBe(false);
  });

  it('detecta ocupação entre múltiplas composições mesmo quando apenas uma está no segmento alvo', () => {
    const positionedCompositions: PositionedComposition[] = [
      makePositionedComposition('COMP-2', 'SEG-L24'),
      makePositionedComposition('COMP-3', 'SEG-L22'),
      makePositionedComposition('COMP-4', 'SEG-L30'),
    ];

    expect(
      isSegmentOccupiedByOtherComposition(
        'SEG-L22',
        'COMP-1',
        positionedCompositions,
      ),
    ).toBe(true);
  });
});
