import type {
  SwitchDefinition,
  SwitchState,
} from '../../../types/switch';
import type { TrackSegment } from '../../../yard/data/brisamarTopology';
import type { PositionedComposition } from '../collision/collisionRules';
import { isSwitchOccupiedByComposition } from './switchOccupancy';

/**
 * Deriva os estados dos AMVs a partir das posições atuais das composições.
 *
 * Esta função NÃO altera posição A/B e NÃO muta o array recebido.
 * Ela apenas recalcula `occupied`.
 *
 * Regra:
 * composição em qualquer segmento adjacente ao AMV => occupied = true.
 */
export function applySwitchOccupancyToStates(
  switchDefs: Record<string, SwitchDefinition>,
  switchStates: SwitchState[],
  segments: TrackSegment[],
  positionedCompositions: PositionedComposition[],
): SwitchState[] {
  return switchStates.map((switchState) => {
    const switchDef = switchDefs[switchState.id];

    if (!switchDef) {
      return switchState;
    }

    return {
      ...switchState,
      occupied: isSwitchOccupiedByComposition(
        switchDef,
        segments,
        positionedCompositions,
      ),
    };
  });
}
