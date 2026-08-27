import { describe, expect, it } from 'vitest';
import type { SwitchDefinition, SwitchState } from '../../../types/switch';
import type { TrackSegment } from '../../../yard/data/brisamarTopology';
import { brisamarSegments } from '../../../yard/data/brisamarTopology';
import { brisamarSwitchDefinitions } from '../../../yard/data/brisamarSwitches';
import {
  isSwitchAgainst,
  resolveNextSegment,
} from './navigationEngine';

/* ── Helpers ────────────────────────────────────────────── */

function makeSeg(
  id: string,
  startNodeId: string,
  endNodeId: string,
  opts: Partial<TrackSegment> = {},
): TrackSegment {
  return {
    id,
    line: 'L22',
    startNodeId,
    endNodeId,
    protectedByInterval: false,
    technical: false,
    ...opts,
  };
}

function makeSwitch(
  id: SwitchDefinition['id'],
  position: SwitchState['position'],
): SwitchState {
  return { id, position, occupied: false };
}

/* ── isSwitchAgainst ────────────────────────────────────── */

describe('isSwitchAgainst', () => {
  const amv: SwitchDefinition = {
    id: 'AMV-05',
    positionA: 'L22 ↔ L22',
    positionB: 'L22 ↔ L24',
    intervalRule: 'none',
    nodeCommon: 'N-AMV05-C',
    nodeA: 'N-AMV05-A',
    nodeB: 'N-AMV05-B',
  };

  it('chegando pelo nodeCommon — nunca está contra (posição A)', () => {
    expect(isSwitchAgainst(amv, 'A', 'N-AMV05-C')).toBe(false);
  });

  it('chegando pelo nodeCommon — nunca está contra (posição B)', () => {
    expect(isSwitchAgainst(amv, 'B', 'N-AMV05-C')).toBe(false);
  });

  it('chegando pelo ramo A com posição A — não está contra', () => {
    expect(isSwitchAgainst(amv, 'A', 'N-AMV05-A')).toBe(false);
  });

  it('chegando pelo ramo A com posição B — CHAVE CONTRA', () => {
    expect(isSwitchAgainst(amv, 'B', 'N-AMV05-A')).toBe(true);
  });

  it('chegando pelo ramo B com posição B — não está contra', () => {
    expect(isSwitchAgainst(amv, 'B', 'N-AMV05-B')).toBe(false);
  });

  it('chegando pelo ramo B com posição A — CHAVE CONTRA', () => {
    expect(isSwitchAgainst(amv, 'A', 'N-AMV05-B')).toBe(true);
  });

  it('nó não pertence ao AMV — retorna false', () => {
    expect(isSwitchAgainst(amv, 'A', 'N-OUTRO-NO')).toBe(false);
  });
});

/* ── resolveNextSegment — terminal ─────────────────────── */

describe('resolveNextSegment — terminal', () => {
  it('retorna terminal quando não há segmento vizinho', () => {
    const seg = makeSeg('SEG-A', 'N-ESQUERDA', 'N-TERMINAL');
    const result = resolveNextSegment(
      'SEG-A',
      'N-TERMINAL',
      [seg],
      {},
      [],
      'not-granted',
    );
    expect(result).toEqual({ ok: false, reason: 'terminal' });
  });

  it('retorna terminal no terminal esquerdo de L28', () => {
    const result = resolveNextSegment(
      'SEG-L28',
      'N-L28-TERM',
      brisamarSegments,
      brisamarSwitchDefinitions,
      Object.keys(brisamarSwitchDefinitions).map((id) =>
        makeSwitch(id as SwitchState['id'], 'A'),
      ),
      'not-granted',
    );
    expect(result).toEqual({ ok: false, reason: 'terminal' });
  });
});

/* ── resolveNextSegment — passagem simples ──────────────── */

describe('resolveNextSegment — passagem simples (sem AMV)', () => {
  it('avança para o segmento seguinte em linha reta', () => {
    const seg1 = makeSeg('SEG-1', 'N-A', 'N-B');
    const seg2 = makeSeg('SEG-2', 'N-B', 'N-C');
    const result = resolveNextSegment(
      'SEG-1',
      'N-B',
      [seg1, seg2],
      {},
      [],
      'not-granted',
    );
    expect(result).toEqual({ ok: true, segment: seg2 });
  });
});

/* ── resolveNextSegment — intervalo ─────────────────────── */

describe('resolveNextSegment — intervalo', () => {
  it('bloqueia segmento protegido sem intervalo', () => {
    const seg1 = makeSeg('SEG-1', 'N-A', 'N-B');
    const seg2 = makeSeg('SEG-2', 'N-B', 'N-C', { protectedByInterval: true });
    const result = resolveNextSegment(
      'SEG-1',
      'N-B',
      [seg1, seg2],
      {},
      [],
      'not-granted',
    );
    expect(result).toEqual({ ok: false, reason: 'interval-required' });
  });

  it('permite segmento protegido com intervalo concedido', () => {
    const seg1 = makeSeg('SEG-1', 'N-A', 'N-B');
    const seg2 = makeSeg('SEG-2', 'N-B', 'N-C', { protectedByInterval: true });
    const result = resolveNextSegment(
      'SEG-1',
      'N-B',
      [seg1, seg2],
      {},
      [],
      'granted',
    );
    expect(result).toEqual({ ok: true, segment: seg2 });
  });

  it('bloqueia SEG-L20 (protegido) sem intervalo na topologia real', () => {
    const allStates = Object.keys(brisamarSwitchDefinitions).map((id) =>
      makeSwitch(id as SwitchState['id'], 'A'),
    );
    // AMV-09 em posição B (L22↔L20)
    const statesWithAmv09B = allStates.map((s) =>
      s.id === 'AMV-09' ? { ...s, position: 'B' as const } : s,
    );

    const result = resolveNextSegment(
      'SEG-L22-05-09',
      'N-AMV09-C',
      brisamarSegments,
      brisamarSwitchDefinitions,
      statesWithAmv09B,
      'not-granted',
    );
    // Com AMV-09 em B e sem intervalo: o segmento L20 é protegido
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(['switch-against', 'interval-required']).toContain(result.reason);
    }
  });
});

/* ── resolveNextSegment — chave contra ──────────────────── */

describe('resolveNextSegment — chave contra', () => {
  it('bloqueia composição chegando pelo ramo inativo do AMV', () => {
    // Simula composição em SEG-L22-TRAV chegando pelo ramo B do AMV-05
    // com AMV-05 na posição A (ramo B desconectado → chave contra)
    const seg1 = makeSeg('SEG-1', 'N-A', 'N-AMV05-B');
    const seg2 = makeSeg('SEG-2', 'N-AMV05-C', 'N-B');

    const amvDef: SwitchDefinition = {
      id: 'AMV-05',
      positionA: 'L22 ↔ L22',
      positionB: 'L22 ↔ L24',
      intervalRule: 'none',
      nodeCommon: 'N-AMV05-C',
      nodeA: 'N-AMV05-A',
      nodeB: 'N-AMV05-B',
    };

    const result = resolveNextSegment(
      'SEG-1',
      'N-AMV05-B',
      [seg1, seg2],
      { 'AMV-05': amvDef } as Record<SwitchState['id'], SwitchDefinition>,
      [makeSwitch('AMV-05', 'A')],
      'not-granted',
    );
    expect(result).toEqual({ ok: false, reason: 'switch-against' });
  });

  it('permite composição chegando pela ponta comum do AMV — segue ramo ativo', () => {
    // AMV-05 posição A: common → nodeA
    const segEntrada = makeSeg('SEG-ENTRADA', 'N-X', 'N-AMV05-C');
    const segRamoA = makeSeg('SEG-RAMO-A', 'N-AMV05-A', 'N-Y');
    const segRamoB = makeSeg('SEG-RAMO-B', 'N-AMV05-B', 'N-Z');

    const amvDef: SwitchDefinition = {
      id: 'AMV-05',
      positionA: 'L22 ↔ L22',
      positionB: 'L22 ↔ L24',
      intervalRule: 'none',
      nodeCommon: 'N-AMV05-C',
      nodeA: 'N-AMV05-A',
      nodeB: 'N-AMV05-B',
    };

    const result = resolveNextSegment(
      'SEG-ENTRADA',
      'N-AMV05-C',
      [segEntrada, segRamoA, segRamoB],
      { 'AMV-05': amvDef } as Record<SwitchState['id'], SwitchDefinition>,
      [makeSwitch('AMV-05', 'A')],
      'not-granted',
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.segment.id).toBe('SEG-RAMO-A');
    }
  });

  it('composição chegando pela ponta comum com AMV em B — segue ramo B', () => {
    const segEntrada = makeSeg('SEG-ENTRADA', 'N-X', 'N-AMV05-C');
    const segRamoA = makeSeg('SEG-RAMO-A', 'N-AMV05-A', 'N-Y');
    const segRamoB = makeSeg('SEG-RAMO-B', 'N-AMV05-B', 'N-Z');

    const amvDef: SwitchDefinition = {
      id: 'AMV-05',
      positionA: 'L22 ↔ L22',
      positionB: 'L22 ↔ L24',
      intervalRule: 'none',
      nodeCommon: 'N-AMV05-C',
      nodeA: 'N-AMV05-A',
      nodeB: 'N-AMV05-B',
    };

    const result = resolveNextSegment(
      'SEG-ENTRADA',
      'N-AMV05-C',
      [segEntrada, segRamoA, segRamoB],
      { 'AMV-05': amvDef } as Record<SwitchState['id'], SwitchDefinition>,
      [makeSwitch('AMV-05', 'B')],
      'not-granted',
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.segment.id).toBe('SEG-RAMO-B');
    }
  });
});

/* ── isSwitchAgainst com AMVs reais ─────────────────────── */

describe('isSwitchAgainst com definições reais do Brisamar', () => {
  it('AMV-09 posição A: chegando pelo ramo B (L20) → CONTRA', () => {
    const def = brisamarSwitchDefinitions['AMV-09'];
    expect(isSwitchAgainst(def, 'A', def.nodeB)).toBe(true);
  });

  it('AMV-09 posição B: chegando pelo ramo B (L20) → não contra', () => {
    const def = brisamarSwitchDefinitions['AMV-09'];
    expect(isSwitchAgainst(def, 'B', def.nodeB)).toBe(false);
  });

  it('AMV-09 chegando pelo nodeCommon (L22) → nunca contra', () => {
    const def = brisamarSwitchDefinitions['AMV-09'];
    expect(isSwitchAgainst(def, 'A', def.nodeCommon)).toBe(false);
    expect(isSwitchAgainst(def, 'B', def.nodeCommon)).toBe(false);
  });

  it('AMV-12 posição A: chegando pelo ramo B (curva) → CONTRA', () => {
    const def = brisamarSwitchDefinitions['AMV-12'];
    expect(isSwitchAgainst(def, 'A', def.nodeB)).toBe(true);
  });

  it('AMV-12 posição B: chegando pelo ramo B (curva) → não contra', () => {
    const def = brisamarSwitchDefinitions['AMV-12'];
    expect(isSwitchAgainst(def, 'B', def.nodeB)).toBe(false);
  });
});
