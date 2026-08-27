import { describe, expect, it } from 'vitest';

import type { SwitchDefinition } from '../../../types/switch';
import type { TrackSegment } from '../../../yard/data/brisamarTopology';
import type { PositionedComposition } from '../collision/collisionRules';
import type { CompositionPosition } from '../position/compositionPosition';
import {
  isPositionAdjacentToSwitch,
  isSwitchOccupiedByComposition,
} from './switchOccupancy';

const switchDef: SwitchDefinition = {
  id: 'AMV-10',
  positionA: 'L22↔L22',
  positionB: 'L22↔L24',
  intervalRule: 'none',
  nodeCommon: 'NODE-COMMON',
  nodeA: 'NODE-A',
  nodeB: 'NODE-B',
};

const segments: TrackSegment[] = [
  {
    id: 'SEG-COMMON',
    line: 'L22',
    startNodeId: 'NODE-X',
    endNodeId: 'NODE-COMMON',
    protectedByInterval: false,
    technical: false,
  },
  {
    id: 'SEG-A',
    line: 'L22',
    startNodeId: 'NODE-A',
    endNodeId: 'NODE-Y',
    protectedByInterval: false,
    technical: false,
  },
  {
    id: 'SEG-B',
    line: 'L24',
    startNodeId: 'NODE-B',
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

describe('switchOccupancy', () => {
  describe('isPositionAdjacentToSwitch', () => {
    it('retorna true para segmento adjacente ao nodeCommon', () => {
      expect(
        isPositionAdjacentToSwitch(
          makePosition('SEG-COMMON'),
          switchDef,
          segments,
        ),
      ).toBe(true);
    });

    it('retorna true para segmento adjacente ao nodeA', () => {
      expect(
        isPositionAdjacentToSwitch(
          makePosition('SEG-A'),
          switchDef,
          segments,
        ),
      ).toBe(true);
    });

    it('retorna true para segmento adjacente ao nodeB', () => {
      expect(
        isPositionAdjacentToSwitch(
          makePosition('SEG-B'),
          switchDef,
          segments,
        ),
      ).toBe(true);
    });

    it('retorna false para segmento não adjacente ao AMV', () => {
      expect(
        isPositionAdjacentToSwitch(
          makePosition('SEG-FAR'),
          switchDef,
          segments,
        ),
      ).toBe(false);
    });

    it('lança erro quando o segmento da posição não existe na topologia', () => {
      expect(() =>
        isPositionAdjacentToSwitch(
          makePosition('SEG-INEXISTENTE'),
          switchDef,
          segments,
        ),
      ).toThrowError(
        'Segmento "SEG-INEXISTENTE" não encontrado na topologia.',
      );
    });
  });

  describe('isSwitchOccupiedByComposition', () => {
    it('retorna false quando não há composições posicionadas', () => {
      expect(
        isSwitchOccupiedByComposition(
          switchDef,
          segments,
          [],
        ),
      ).toBe(false);
    });

    it('retorna false quando todas as composições estão longe do AMV', () => {
      const positionedCompositions: PositionedComposition[] = [
        makePositionedComposition('COMP-1', 'SEG-FAR'),
      ];

      expect(
        isSwitchOccupiedByComposition(
          switchDef,
          segments,
          positionedCompositions,
        ),
      ).toBe(false);
    });

    it('retorna true quando uma composição está em segmento adjacente ao AMV', () => {
      const positionedCompositions: PositionedComposition[] = [
        makePositionedComposition('COMP-1', 'SEG-A'),
      ];

      expect(
        isSwitchOccupiedByComposition(
          switchDef,
          segments,
          positionedCompositions,
        ),
      ).toBe(true);
    });

    it('retorna true entre múltiplas composições quando apenas uma está adjacente ao AMV', () => {
      const positionedCompositions: PositionedComposition[] = [
        makePositionedComposition('COMP-1', 'SEG-FAR'),
        makePositionedComposition('COMP-2', 'SEG-B'),
        makePositionedComposition('COMP-3', 'SEG-FAR'),
      ];

      expect(
        isSwitchOccupiedByComposition(
          switchDef,
          segments,
          positionedCompositions,
        ),
      ).toBe(true);
    });

    it('considera ocupado em qualquer uma das três pontas do AMV', () => {
      const cases = ['SEG-COMMON', 'SEG-A', 'SEG-B'];

      for (const segmentId of cases) {
        expect(
          isSwitchOccupiedByComposition(
            switchDef,
            segments,
            [
              makePositionedComposition(
                `COMP-${segmentId}`,
                segmentId,
              ),
            ],
          ),
        ).toBe(true);
      }
    });
  });
});
