import { describe, expect, it } from 'vitest';
import { brisamarSegments } from '../../../yard/data/brisamarTopology';
import { brisamarSwitchDefinitions, initialSwitchStates } from '../../../yard/data/brisamarSwitches';
import type { SwitchId, SwitchPosition } from '../../../types/switch';
import { createPosition } from '../position/compositionPosition';
import { stepComposition } from './stepComposition';

const composition = { id: 'C1', units: [{
  id: 'L1', kind: 'locomotive' as const, number: '3820', orientation: 'front-barra' as const,
}] };

function step(segmentId: string, head: string, positions: Partial<Record<SwitchId, SwitchPosition>>) {
  const segment = brisamarSegments.find((item) => item.id === segmentId)!;
  const states = initialSwitchStates.map((state) => ({
    ...state, position: positions[state.id] ?? state.position,
  }));
  return stepComposition(composition, createPosition(segment, head), 'head',
    brisamarSegments, brisamarSwitchDefinitions, states, 'not-granted');
}

describe('AMV-12 — sequência validada vindo da curva', () => {
  it('em B entra na L24 direita e alcança o próximo AMV-11, sem saltar até L30', () => {
    expect(step('SEG-L22-CURVA', 'N-AMV12-C', { 'AMV-12': 'B' })).toEqual({
      ok: true, nextPosition: {
        segmentId: 'SEG-L24-INF', headNodeId: 'N-AMV11-C', tailNodeId: 'N-AMV12-B',
      },
    });
  });

  it('em A entra na L22 em direção ao AMV-10', () => {
    expect(step('SEG-L22-CURVA', 'N-AMV12-C', {})).toEqual({
      ok: true, nextPosition: {
        segmentId: 'SEG-L22-10-12', headNodeId: 'N-AMV10-A', tailNodeId: 'N-AMV12-A',
      },
    });
  });

  it('no próximo AMV-11 em A mantém L24 rumo ao AMV-04', () => {
    expect(step('SEG-L24-INF', 'N-AMV11-C', {})).toEqual({
      ok: true, nextPosition: {
        segmentId: 'SEG-L24-TRAV', headNodeId: 'N-AMV04-A', tailNodeId: 'N-AMV11-A',
      },
    });
  });

  it('no próximo AMV-11 em B segue o desvio para L22/AMV-10', () => {
    expect(step('SEG-L24-INF', 'N-AMV11-C', { 'AMV-11': 'B' })).toEqual({
      ok: true, nextPosition: {
        segmentId: 'SEG-L24-L22-AMV11', headNodeId: 'N-AMV10-B', tailNodeId: 'N-AMV11-B',
      },
    });
    expect(step('SEG-L24-L22-AMV11', 'N-AMV10-B', {}))
      .toEqual({ ok: false, reason: 'switch-against' });
  });

  it.each([
    ['SEG-L24-INF', 'N-AMV12-B', 'B', 'A'],
    ['SEG-L22-10-12', 'N-AMV12-A', 'A', 'B'],
  ] as const)('retorna à curva de %s somente com AMV-12 alinhado', (segment, head, aligned, against) => {
    const result = step(segment, head, { 'AMV-12': aligned });
    expect(result.ok && result.nextPosition.segmentId).toBe('SEG-L22-CURVA');
    expect(step(segment, head, { 'AMV-12': against }))
      .toEqual({ ok: false, reason: 'switch-against' });
  });

  it('L30 deixa de ter a conexão indevida ao AMV-12', () => {
    expect(step('SEG-L24-02-03', 'N-AMV03-C', { 'AMV-03': 'B' })).toEqual({
      ok: true, nextPosition: {
        segmentId: 'SEG-L30', headNodeId: 'N-L30-TERM', tailNodeId: 'N-AMV03-B',
      },
    });
  });
});
