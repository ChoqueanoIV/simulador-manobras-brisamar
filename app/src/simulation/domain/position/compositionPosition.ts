import type { TrackSegment } from '../../../yard/data/brisamarTopology';

export type CompositionPosition = {
  segmentId: string;
  headNodeId: string;
  tailNodeId: string;
};

/** Valida ambas as extremidades, sem inferir orientação operacional. */
export function isValidPosition(position: CompositionPosition, segments: TrackSegment[]): boolean {
  const matches = segments.filter((segment) => segment.id === position.segmentId);
  if (matches.length !== 1) return false;
  const segment = matches[0];
  return (
    segment.startNodeId !== segment.endNodeId &&
    ((position.headNodeId === segment.startNodeId && position.tailNodeId === segment.endNodeId) ||
      (position.headNodeId === segment.endNodeId && position.tailNodeId === segment.startNodeId))
  );
}

function getOppositeNode(segment: TrackSegment, nodeId: string): string {
  if (nodeId === segment.startNodeId) {
    return segment.endNodeId;
  }

  if (nodeId === segment.endNodeId) {
    return segment.startNodeId;
  }

  throw new Error(`Node "${nodeId}" is not an endpoint of segment "${segment.id}".`);
}

export function createPosition(segment: TrackSegment, headNodeId: string): CompositionPosition {
  return {
    segmentId: segment.id,
    headNodeId,
    tailNodeId: getOppositeNode(segment, headNodeId),
  };
}

export function flipDirection(position: CompositionPosition): CompositionPosition {
  return {
    segmentId: position.segmentId,
    headNodeId: position.tailNodeId,
    tailNodeId: position.headNodeId,
  };
}

export function advanceToSegment(
  nextSegment: TrackSegment,
  entryNodeId: string,
): CompositionPosition {
  return {
    segmentId: nextSegment.id,
    headNodeId: getOppositeNode(nextSegment, entryNodeId),
    tailNodeId: entryNodeId,
  };
}
