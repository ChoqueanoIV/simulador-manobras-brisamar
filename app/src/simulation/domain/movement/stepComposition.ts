import type {
  IntervalState,
  SwitchDefinition,
  SwitchState,
} from '../../../types/switch';
import type { TrackSegment } from '../../../yard/data/brisamarTopology';
import { getActiveSwitchConnection } from '../../../yard/data/brisamarTopologyGraph';
import type { Composition } from '../composition/composition';
import { hasLocomotive } from '../composition/composition';
import type { NavigationBlockReason } from '../navigation/navigationEngine';
import { resolveNextSegment } from '../navigation/navigationEngine';
import type { CompositionPosition } from '../position/compositionPosition';
import {
  advanceToSegment,
  flipDirection,
} from '../position/compositionPosition';

export type MovementDirection = 'head' | 'tail';

export type MovementBlockReason =
  | NavigationBlockReason
  | 'no-locomotive';

export type StepCompositionResult =
  | {
      ok: true;
      nextPosition: CompositionPosition;
    }
  | {
      ok: false;
      reason: MovementBlockReason;
    };

function findSwitchAtNode(
  nodeId: string,
  switchDefs: Record<string, SwitchDefinition>,
  switchStates: SwitchState[],
): { def: SwitchDefinition; state: SwitchState } | null {
  for (const def of Object.values(switchDefs)) {
    const belongsToSwitch =
      nodeId === def.nodeCommon ||
      nodeId === def.nodeA ||
      nodeId === def.nodeB;

    if (!belongsToSwitch) {
      continue;
    }

    const state = switchStates.find((item) => item.id === def.id);

    if (state) {
      return { def, state };
    }
  }

  return null;
}

/**
 * Descobre por qual nó a composição entra no segmento retornado pelo
 * navigationEngine.
 *
 * O navigationEngine atravessa logicamente o AMV antes de escolher o próximo
 * segmento, mas seu contrato público retorna apenas o segmento selecionado.
 * Aqui apenas recuperamos esse nó de entrada a partir da mesma conexão ativa
 * já descrita por SwitchDefinition + SwitchState.
 */
function resolveEntryNodeId(
  nextSegment: TrackSegment,
  exitNodeId: string,
  switchDefs: Record<string, SwitchDefinition>,
  switchStates: SwitchState[],
): string {
  if (
    nextSegment.startNodeId === exitNodeId ||
    nextSegment.endNodeId === exitNodeId
  ) {
    return exitNodeId;
  }

  const switchAtNode = findSwitchAtNode(
    exitNodeId,
    switchDefs,
    switchStates,
  );

  if (!switchAtNode) {
    throw new Error(
      `Não foi possível determinar o nó de entrada de "${nextSegment.id}" a partir de "${exitNodeId}".`,
    );
  }

  const { def, state } = switchAtNode;
  const [nodeCommon, activeBranchNode] = getActiveSwitchConnection(
    def,
    state.position,
  );

  let throughNodeId: string;

  if (exitNodeId === nodeCommon) {
    throughNodeId = activeBranchNode;
  } else if (exitNodeId === activeBranchNode) {
    throughNodeId = nodeCommon;
  } else {
    throw new Error(
      `O nó "${exitNodeId}" não pertence à conexão ativa de "${def.id}".`,
    );
  }

  if (
    nextSegment.startNodeId !== throughNodeId &&
    nextSegment.endNodeId !== throughNodeId
  ) {
    throw new Error(
      `O segmento "${nextSegment.id}" não contém o nó de entrada "${throughNodeId}".`,
    );
  }

  return throughNodeId;
}

/**
 * Executa um único passo lógico de uma composição entre segmentos do grafo.
 *
 * Esta função não altera UI, SVG, store, ocupação ou colisão.
 *
 * Fluxo:
 * 1. composição precisa possuir locomotiva;
 * 2. se o movimento for pela cauda, a direção lógica é invertida;
 * 3. navigationEngine resolve o próximo segmento ou bloqueio;
 * 4. a posição é avançada para o novo segmento.
 */
export function stepComposition(
  composition: Composition,
  position: CompositionPosition,
  direction: MovementDirection,
  segments: TrackSegment[],
  switchDefs: Record<string, SwitchDefinition>,
  switchStates: SwitchState[],
  interval: IntervalState,
): StepCompositionResult {
  if (!hasLocomotive(composition)) {
    return {
      ok: false,
      reason: 'no-locomotive',
    };
  }

  const movementPosition =
    direction === 'head'
      ? position
      : flipDirection(position);

  const navigation = resolveNextSegment(
    movementPosition.segmentId,
    movementPosition.headNodeId,
    segments,
    switchDefs,
    switchStates,
    interval,
  );

  if (!navigation.ok) {
    return navigation;
  }

  const entryNodeId = resolveEntryNodeId(
    navigation.segment,
    movementPosition.headNodeId,
    switchDefs,
    switchStates,
  );

  return {
    ok: true,
    nextPosition: advanceToSegment(
      navigation.segment,
      entryNodeId,
    ),
  };
}
