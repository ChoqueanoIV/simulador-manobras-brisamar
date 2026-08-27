import type { SwitchDefinition, SwitchPosition } from '../../types/switch';
import type { TrackSegment } from './brisamarTopology';

/**
 * Retorna todos os segmentos que contêm o nó indicado
 * como startNodeId ou endNodeId.
 */
export function getSegmentsAtNode(
  nodeId: string,
  segments: TrackSegment[],
): TrackSegment[] {
  return segments.filter(
    (seg) => seg.startNodeId === nodeId || seg.endNodeId === nodeId,
  );
}

/**
 * Dado um segmento e o nó de entrada, retorna o nó de saída.
 *
 * Retorna null se o nodeId não pertence ao segmento.
 */
export function getExitNode(
  segment: TrackSegment,
  entryNodeId: string,
): string | null {
  if (segment.startNodeId === entryNodeId) {
    return segment.endNodeId;
  }

  if (segment.endNodeId === entryNodeId) {
    return segment.startNodeId;
  }

  return null;
}

/**
 * Retorna o par [nodeCommon, nodeRamo] conectado pelo AMV
 * na posição atual.
 *
 * - nodeCommon = ponta única (lado de chegada independente da posição)
 * - nodeRamo   = nodeA ou nodeB conforme a posição
 */
export function getActiveSwitchConnection(
  switchDef: SwitchDefinition,
  position: SwitchPosition,
): [string, string] {
  const nodeRamo = position === 'A' ? switchDef.nodeA : switchDef.nodeB;
  return [switchDef.nodeCommon, nodeRamo];
}
