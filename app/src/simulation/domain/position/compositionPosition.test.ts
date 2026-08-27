import { describe, expect, it } from 'vitest';

import { brisamarSegments } from '../../../yard/data/brisamarTopology';
import type { TrackSegment } from '../../../yard/data/brisamarTopology';
import {
  advanceToSegment,
  createPosition,
  flipDirection,
} from './compositionPosition';

const segment: TrackSegment = {
  id: 'SEG-TEST',
  line: 'L22',
  startNodeId: 'NODE-A',
  endNodeId: 'NODE-B',
  protectedByInterval: false,
  technical: false,
};

describe('compositionPosition', () => {
  describe('createPosition', () => {
    it('cria posição com a frente no startNodeId', () => {
      expect(createPosition(segment, 'NODE-A')).toEqual({
        segmentId: 'SEG-TEST',
        headNodeId: 'NODE-A',
        tailNodeId: 'NODE-B',
      });
    });

    it('cria posição com a frente no endNodeId', () => {
      expect(createPosition(segment, 'NODE-B')).toEqual({
        segmentId: 'SEG-TEST',
        headNodeId: 'NODE-B',
        tailNodeId: 'NODE-A',
      });
    });

    it('rejeita headNodeId que não pertence ao segmento', () => {
      expect(() => createPosition(segment, 'NODE-X')).toThrow(Error);
    });
  });

  describe('flipDirection', () => {
    it('inverte frente e cauda sem modificar a posição original', () => {
      const original = createPosition(segment, 'NODE-A');
      const flipped = flipDirection(original);

      expect(flipped).toEqual({
        segmentId: 'SEG-TEST',
        headNodeId: 'NODE-B',
        tailNodeId: 'NODE-A',
      });

      expect(original).toEqual({
        segmentId: 'SEG-TEST',
        headNodeId: 'NODE-A',
        tailNodeId: 'NODE-B',
      });

      expect(flipped).not.toBe(original);
    });
  });

  describe('advanceToSegment', () => {
    it('entra pelo startNodeId e aponta a frente para o endNodeId', () => {
      expect(advanceToSegment(segment, 'NODE-A')).toEqual({
        segmentId: 'SEG-TEST',
        headNodeId: 'NODE-B',
        tailNodeId: 'NODE-A',
      });
    });

    it('entra pelo endNodeId e aponta a frente para o startNodeId', () => {
      expect(advanceToSegment(segment, 'NODE-B')).toEqual({
        segmentId: 'SEG-TEST',
        headNodeId: 'NODE-A',
        tailNodeId: 'NODE-B',
      });
    });

    it('rejeita entryNodeId que não pertence ao segmento', () => {
      expect(() => advanceToSegment(segment, 'NODE-X')).toThrow(Error);
    });
  });

  it('mantém posição consistente em uma sequência createPosition → advanceToSegment', () => {
    const firstSegment: TrackSegment = {
      ...segment,
      id: 'SEG-FIRST',
      startNodeId: 'NODE-A',
      endNodeId: 'NODE-B',
    };

    const nextSegment: TrackSegment = {
      ...segment,
      id: 'SEG-NEXT',
      startNodeId: 'NODE-B',
      endNodeId: 'NODE-C',
    };

    const initialPosition = createPosition(firstSegment, 'NODE-B');
    const nextPosition = advanceToSegment(nextSegment, initialPosition.headNodeId);

    expect(nextPosition).toEqual({
      segmentId: 'SEG-NEXT',
      headNodeId: 'NODE-C',
      tailNodeId: 'NODE-B',
    });
  });

  describe('segmentos reais do Pátio Brisamar', () => {
    it('cria posição válida no SEG-L22-SUP', () => {
      const realSegment = brisamarSegments.find(
        (item) => item.id === 'SEG-L22-SUP',
      );

      expect(realSegment).toBeDefined();

      if (!realSegment) {
        throw new Error('SEG-L22-SUP não encontrado na topologia.');
      }

      expect(createPosition(realSegment, 'N-AMV05-C')).toEqual({
        segmentId: 'SEG-L22-SUP',
        headNodeId: 'N-AMV05-C',
        tailNodeId: 'N-L22-TERM-ESQ',
      });
    });

    it('avança corretamente pelo SEG-L22-05-09', () => {
      const realSegment = brisamarSegments.find(
        (item) => item.id === 'SEG-L22-05-09',
      );

      expect(realSegment).toBeDefined();

      if (!realSegment) {
        throw new Error('SEG-L22-05-09 não encontrado na topologia.');
      }

      expect(advanceToSegment(realSegment, 'N-AMV05-A')).toEqual({
        segmentId: 'SEG-L22-05-09',
        headNodeId: 'N-AMV09-C',
        tailNodeId: 'N-AMV05-A',
      });
    });
  });
});
