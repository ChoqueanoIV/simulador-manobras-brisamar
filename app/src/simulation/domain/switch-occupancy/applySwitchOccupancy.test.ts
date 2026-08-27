import { describe, expect, it } from 'vitest';

import type {
  SwitchDefinition,
  SwitchState,
} from '../../../types/switch';
import type { TrackSegment } from '../../../yard/data/brisamarTopology';
import type { PositionedComposition } from '../collision/collisionRules';
import type { CompositionPosition } from '../position/compositionPosition';
import { applySwitchOccupancyToStates } from './applySwitchOccupancy';

const switchDefs: Record<string, SwitchDefinition> = {
  'AMV-10': {
    id: 'AMV-10',
    positionA: 'L22↔L22',
    positionB: 'L22↔L24',
    intervalRule: 'none',
    nodeCommon: 'NODE-COMMON-10',
    nodeA: 'NODE-A-10',
    nodeB: 'NODE-B-10',
  },
  'AMV-11': {
    id: 'AMV-11',
    positionA: 'L24↔L24',
    positionB: 'L24↔L22',
    intervalRule: 'none',
    nodeCommon: 'NODE-COMMON-11',
    nodeA: 'NODE-A-11',
    nodeB: 'NODE-B-11',
  },
};

const segments: TrackSegment[] = [
  {
    id: 'SEG-10-COMMON',
    line: 'L22',
    startNodeId: 'NODE-X',
    endNodeId: 'NODE-COMMON-10',
    protectedByInterval: false,
    technical: false,
  },
  {
    id: 'SEG-10-A',
    line: 'L22',
    startNodeId: 'NODE-A-10',
    endNodeId: 'NODE-Y',
    protectedByInterval: false,
    technical: false,
  },
  {
    id: 'SEG-11-B',
    line: 'L22',
    startNodeId: 'NODE-B-11',
    endNodeId: 'NODE-Z',
    protectedByInterval: false,
    technical: false,
  },
  {
    id: 'SEG-FAR',
    line: 'L30',
    startNodeId: 'NODE-FAR-1',
    endNodeId: 'NODE-FAR-2',
    protectedByInterval: false,
    technical: false,
  },
];

const initialStates: SwitchState[] = [
  {
    id: 'AMV-10',
    position: 'A',
    occupied: false,
  },
  {
    id: 'AMV-11',
    position: 'B',
    occupied: true,
  },
];

function makePosition(segmentId: string): CompositionPosition {
  return {
    segmentId,
    headNodeId: 'HEAD',
    tailNodeId: 'TAIL',
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

describe('applySwitchOccupancyToStates', () => {
  it('marca como ocupado o AMV que possui composição em segmento adjacente', () => {
    const result = applySwitchOccupancyToStates(
      switchDefs,
      initialStates,
      segments,
      [
        makePositionedComposition(
          'COMP-1',
          'SEG-10-COMMON',
        ),
      ],
    );

    expect(result.find((item) => item.id === 'AMV-10')).toEqual({
      id: 'AMV-10',
      position: 'A',
      occupied: true,
    });
  });

  it('marca como livre o AMV sem composição adjacente', () => {
    const result = applySwitchOccupancyToStates(
      switchDefs,
      initialStates,
      segments,
      [],
    );

    expect(result.find((item) => item.id === 'AMV-11')).toEqual({
      id: 'AMV-11',
      position: 'B',
      occupied: false,
    });
  });

  it('preserva a posição A/B ao recalcular ocupação', () => {
    const result = applySwitchOccupancyToStates(
      switchDefs,
      initialStates,
      segments,
      [
        makePositionedComposition('COMP-1', 'SEG-10-A'),
        makePositionedComposition('COMP-2', 'SEG-11-B'),
      ],
    );

    expect(
      result.map(({ id, position }) => ({ id, position })),
    ).toEqual([
      {
        id: 'AMV-10',
        position: 'A',
      },
      {
        id: 'AMV-11',
        position: 'B',
      },
    ]);
  });

  it('deriva ocupação de múltiplos AMVs de forma independente', () => {
    const result = applySwitchOccupancyToStates(
      switchDefs,
      initialStates,
      segments,
      [
        makePositionedComposition('COMP-1', 'SEG-10-A'),
        makePositionedComposition('COMP-2', 'SEG-11-B'),
      ],
    );

    expect(result).toEqual([
      {
        id: 'AMV-10',
        position: 'A',
        occupied: true,
      },
      {
        id: 'AMV-11',
        position: 'B',
        occupied: true,
      },
    ]);
  });

  it('não considera composição distante como ocupação de AMV', () => {
    const result = applySwitchOccupancyToStates(
      switchDefs,
      initialStates,
      segments,
      [
        makePositionedComposition(
          'COMP-1',
          'SEG-FAR',
        ),
      ],
    );

    expect(result).toEqual([
      {
        id: 'AMV-10',
        position: 'A',
        occupied: false,
      },
      {
        id: 'AMV-11',
        position: 'B',
        occupied: false,
      },
    ]);
  });

  it('não muta o array nem os objetos de estado recebidos', () => {
    const statesSnapshot = initialStates.map((item) => ({
      ...item,
    }));

    const result = applySwitchOccupancyToStates(
      switchDefs,
      initialStates,
      segments,
      [
        makePositionedComposition(
          'COMP-1',
          'SEG-10-COMMON',
        ),
      ],
    );

    expect(initialStates).toEqual(statesSnapshot);
    expect(result).not.toBe(initialStates);
    expect(result[0]).not.toBe(initialStates[0]);
  });

  it('preserva sem alteração um SwitchState válido sem definição correspondente', () => {
    const partialSwitchDefs: Record<string, SwitchDefinition> = {
      'AMV-10': switchDefs['AMV-10'],
    };

    const stateWithoutDefinition: SwitchState = {
      id: 'AMV-11',
      position: 'B',
      occupied: true,
    };

    const result = applySwitchOccupancyToStates(
      partialSwitchDefs,
      [initialStates[0], stateWithoutDefinition],
      segments,
      [],
    );

    expect(result[1]).toBe(stateWithoutDefinition);
    expect(result[1]).toEqual(stateWithoutDefinition);
  });
});
