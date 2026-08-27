import type { CompositionPosition } from '../position/compositionPosition';

export type PositionedComposition = {
  compositionId: string;
  position: CompositionPosition;
};

/**
 * Regra de colisão da TASK-011:
 *
 * duas composições podem existir na mesma linha física,
 * porém não podem ocupar o mesmo segmento do grafo ao mesmo tempo.
 *
 * Esta função ignora a própria composição em movimento e verifica
 * apenas outras composições já posicionadas no segmento de destino.
 */
export function isSegmentOccupiedByOtherComposition(
  targetSegmentId: string,
  movingCompositionId: string,
  positionedCompositions: PositionedComposition[],
): boolean {
  return positionedCompositions.some(
    ({ compositionId, position }) =>
      compositionId !== movingCompositionId &&
      position.segmentId === targetSegmentId,
  );
}
