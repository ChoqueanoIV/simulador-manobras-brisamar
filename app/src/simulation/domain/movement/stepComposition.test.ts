import { describe, expect, it } from 'vitest';

import type { Locomotive, WagonUnit } from '../../../rolling-stock/types/rollingStock';
import type {
  SwitchDefinition,
  SwitchState,
} from '../../../types/switch';
import type { TrackSegment } from '../../../yard/data/brisamarTopology';
import type { Composition } from '../composition/composition';
import { createPosition } from '../position/compositionPosition';
import { stepComposition } from './stepComposition';

const locomotive: Locomotive = {
  id: 'LOCO-3820',
  kind: 'locomotive',
  number: '3820',
  orientation: 'front-barra',
};

const wagon: WagonUnit = {
  id: 'WAGON-1',
  kind: 'wagon-unit',
  label: 'FVR',
  color: '#d78316',
  sourceBlockId: 'BLOCK-1',
};

function compositionWithLocomotive(): Composition {
  return {
    id: 'COMP-1',
    units: [locomotive, wagon],
  };
}

function compositionWithoutLocomotive(): Composition {
  return {
    id: 'COMP-SEM-LOCO',
    units: [wagon],
  };
}

const linearSegments: TrackSegment[] = [
  {
    id: 'SEG-A-B',
    line: 'L22',
    startNodeId: 'NODE-A',
    endNodeId: 'NODE-B',
    protectedByInterval: false,
    technical: false,
  },
  {
    id: 'SEG-B-C',
    line: 'L22',
    startNodeId: 'NODE-B',
    endNodeId: 'NODE-C',
    protectedByInterval: false,
    technical: false,
  },
];

const protectedSegments: TrackSegment[] = [
  {
    id: 'SEG-LIVRE',
    line: 'L22',
    startNodeId: 'NODE-A',
    endNodeId: 'NODE-B',
    protectedByInterval: false,
    technical: false,
  },
  {
    id: 'SEG-PROTEGIDO',
    line: 'L20',
    startNodeId: 'NODE-B',
    endNodeId: 'NODE-C',
    protectedByInterval: true,
    technical: false,
  },
];

const switchDefinition: SwitchDefinition = {
  id: 'AMV-10',
  positionA: 'L22↔L22',
  positionB: 'L22↔L24',
  intervalRule: 'none',
  nodeCommon: 'NODE-COMMON',
  nodeA: 'NODE-A',
  nodeB: 'NODE-B',
};

const switchStatesA: SwitchState[] = [
  {
    id: 'AMV-10',
    position: 'A',
    occupied: false,
  },
];

const switchSegments: TrackSegment[] = [
  {
    id: 'SEG-ENTRY-COMMON',
    line: 'L22',
    startNodeId: 'NODE-ENTRY',
    endNodeId: 'NODE-COMMON',
    protectedByInterval: false,
    technical: false,
  },
  {
    id: 'SEG-A-EXIT',
    line: 'L22',
    startNodeId: 'NODE-A',
    endNodeId: 'NODE-EXIT-A',
    protectedByInterval: false,
    technical: false,
  },
  {
    id: 'SEG-B-EXIT',
    line: 'L24',
    startNodeId: 'NODE-B',
    endNodeId: 'NODE-EXIT-B',
    protectedByInterval: false,
    technical: false,
  },
];

describe('stepComposition', () => {
  it('bloqueia movimento de composição sem locomotiva', () => {
    const position = createPosition(linearSegments[0], 'NODE-B');

    const result = stepComposition(
      compositionWithoutLocomotive(),
      position,
      'head',
      linearSegments,
      {},
      [],
      'not-granted',
    );

    expect(result).toEqual({
      ok: false,
      reason: 'no-locomotive',
    });
  });

  it('avança pela frente para o próximo segmento linear', () => {
    const position = createPosition(linearSegments[0], 'NODE-B');

    const result = stepComposition(
      compositionWithLocomotive(),
      position,
      'head',
      linearSegments,
      {},
      [],
      'not-granted',
    );

    expect(result).toEqual({
      ok: true,
      nextPosition: {
        segmentId: 'SEG-B-C',
        headNodeId: 'NODE-C',
        tailNodeId: 'NODE-B',
      },
    });
  });

  it('avança pela cauda invertendo a direção lógica antes do passo', () => {
    const position = createPosition(linearSegments[1], 'NODE-C');

    const result = stepComposition(
      compositionWithLocomotive(),
      position,
      'tail',
      linearSegments,
      {},
      [],
      'not-granted',
    );

    expect(result).toEqual({
      ok: true,
      nextPosition: {
        segmentId: 'SEG-A-B',
        headNodeId: 'NODE-A',
        tailNodeId: 'NODE-B',
      },
    });
  });

  it('preserva a posição original ao movimentar pela cauda', () => {
    const position = createPosition(linearSegments[1], 'NODE-C');

    stepComposition(
      compositionWithLocomotive(),
      position,
      'tail',
      linearSegments,
      {},
      [],
      'not-granted',
    );

    expect(position).toEqual({
      segmentId: 'SEG-B-C',
      headNodeId: 'NODE-C',
      tailNodeId: 'NODE-B',
    });
  });

  it('retorna terminal quando não existe próximo segmento', () => {
    const position = createPosition(linearSegments[1], 'NODE-C');

    const result = stepComposition(
      compositionWithLocomotive(),
      position,
      'head',
      linearSegments,
      {},
      [],
      'not-granted',
    );

    expect(result).toEqual({
      ok: false,
      reason: 'terminal',
    });
  });

  it('bloqueia entrada em segmento protegido sem intervalo', () => {
    const position = createPosition(protectedSegments[0], 'NODE-B');

    const result = stepComposition(
      compositionWithLocomotive(),
      position,
      'head',
      protectedSegments,
      {},
      [],
      'not-granted',
    );

    expect(result).toEqual({
      ok: false,
      reason: 'interval-required',
    });
  });

  it('permite entrada em segmento protegido com intervalo concedido', () => {
    const position = createPosition(protectedSegments[0], 'NODE-B');

    const result = stepComposition(
      compositionWithLocomotive(),
      position,
      'head',
      protectedSegments,
      {},
      [],
      'granted',
    );

    expect(result).toEqual({
      ok: true,
      nextPosition: {
        segmentId: 'SEG-PROTEGIDO',
        headNodeId: 'NODE-C',
        tailNodeId: 'NODE-B',
      },
    });
  });

  it('atravessa AMV pela conexão ativa e entra no segmento correto', () => {
    const position = createPosition(
      switchSegments[0],
      'NODE-COMMON',
    );

    const result = stepComposition(
      compositionWithLocomotive(),
      position,
      'head',
      switchSegments,
      {
        'AMV-10': switchDefinition,
      },
      switchStatesA,
      'not-granted',
    );

    expect(result).toEqual({
      ok: true,
      nextPosition: {
        segmentId: 'SEG-A-EXIT',
        headNodeId: 'NODE-EXIT-A',
        tailNodeId: 'NODE-A',
      },
    });
  });

  it('preserva bloqueio de chave contra retornado pelo motor de navegação', () => {
    const position = createPosition(
      switchSegments[2],
      'NODE-B',
    );

    const result = stepComposition(
      compositionWithLocomotive(),
      position,
      'head',
      switchSegments,
      {
        'AMV-10': switchDefinition,
      },
      switchStatesA,
      'not-granted',
    );

    expect(result).toEqual({
      ok: false,
      reason: 'switch-against',
    });
  });
});
