import type { SwitchDefinition } from '../../../types/switch';
import type { TrackSegment } from '../../../yard/data/brisamarTopology';
import type { PositionedComposition } from '../collision/collisionRules';
import type { CompositionPosition } from '../position/compositionPosition';

function segmentTouchesSwitch(
  segment: TrackSegment,
  switchDef: SwitchDefinition,
): boolean {
  const switchNodeIds = new Set([
    switchDef.nodeCommon,
    switchDef.nodeA,
    switchDef.nodeB,
  ]);

  return (
    switchNodeIds.has(segment.startNodeId) ||
    switchNodeIds.has(segment.endNodeId)
  );
}

/**
 * Determina se uma posição lógica está em um segmento adjacente ao AMV.
 *
 * Regra consolidada para a TASK-012:
 * composição em segmento adjacente ao AMV = AMV ocupado.
 *
 * O AMV continua sendo uma conexão entre nós, nunca um segmento.
 */
export function isPositionAdjacentToSwitch(
  position: CompositionPosition,
  switchDef: SwitchDefinition,
  segments: TrackSegment[],
): boolean {
  const segment = segments.find(
    (item) => item.id === position.segmentId,
  );

  if (!segment) {
    throw new Error(
      `Segmento "${position.segmentId}" não encontrado na topologia.`,
    );
  }

  return segmentTouchesSwitch(segment, switchDef);
}

/**
 * Um AMV é considerado ocupado quando pelo menos uma composição está
 * posicionada em qualquer segmento adjacente a um de seus três nós.
 */
export function isSwitchOccupiedByComposition(
  switchDef: SwitchDefinition,
  segments: TrackSegment[],
  positionedCompositions: PositionedComposition[],
): boolean {
  return positionedCompositions.some(({ position }) =>
    isPositionAdjacentToSwitch(
      position,
      switchDef,
      segments,
    ),
  );
}
