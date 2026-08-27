import type {
  IntervalState,
  SwitchDefinition,
  SwitchPosition,
  SwitchState,
} from '../../../types/switch';
import type { TrackSegment } from '../../../yard/data/brisamarTopology';
import { getSegmentsAtNode } from '../../../yard/data/brisamarTopologyGraph';

/* ── Tipos públicos ─────────────────────────────────────── */

export type NavigationBlockReason =
  /** Extremidade de linha — não há próximo segmento. */
  | 'terminal'
  /** Chave contra — o AMV bloqueia a passagem nessa direção. */
  | 'switch-against'
  /** Segmento protegido por intervalo não concedido. */
  | 'interval-required'
  /** Placa PARE — reservado para implementação futura. */
  | 'stop-board';

export type NavigationResult =
  | { ok: true; segment: TrackSegment }
  | { ok: false; reason: NavigationBlockReason };

/* ── isSwitchAgainst ────────────────────────────────────── */

/**
 * Determina se um AMV está **contra** para uma composição que chega
 * por `entryNodeId`.
 *
 * Lógica do grafo:
 * - Se a composição chega pela ponta comum (`nodeCommon`) → nunca está contra.
 *   Ela sairá pelo ramo ativo (nodeA ou nodeB conforme a posição).
 * - Se a composição chega pelo ramo A:
 *   - posição A → não está contra (ramo A está ativo, sai pelo common);
 *   - posição B → **chave contra** (ramo A está desconectado).
 * - Se a composição chega pelo ramo B:
 *   - posição B → não está contra;
 *   - posição A → **chave contra**.
 * - Se `entryNodeId` não pertence a nenhum dos três nós do AMV → false
 *   (este AMV não é relevante para esta travessia).
 *
 * Fonte: docs/MAPA_BRISAMAR_V1_CONSOLIDADO.md — seção 4, "Chave contra"
 */
export function isSwitchAgainst(
  switchDef: SwitchDefinition,
  position: SwitchPosition,
  entryNodeId: string,
): boolean {
  if (entryNodeId === switchDef.nodeCommon) {
    // Chegando pela ponta comum: nunca está contra.
    return false;
  }

  if (entryNodeId === switchDef.nodeA) {
    // Chega pelo ramo A: contra apenas se a posição ativa não for A.
    return position !== 'A';
  }

  if (entryNodeId === switchDef.nodeB) {
    // Chega pelo ramo B: contra apenas se a posição ativa não for B.
    return position !== 'B';
  }

  // entryNodeId não pertence a este AMV.
  return false;
}

/* ── Helpers internos ───────────────────────────────────── */

/**
 * Encontra o AMV cujos nós (common, A ou B) incluem `nodeId`.
 * Retorna o par (definição, estado) se encontrado, ou null.
 */
function findSwitchAtNode(
  nodeId: string,
  switchDefs: Record<string, SwitchDefinition>,
  switchStates: SwitchState[],
): { def: SwitchDefinition; state: SwitchState } | null {
  for (const def of Object.values(switchDefs)) {
    if (
      def.nodeCommon === nodeId ||
      def.nodeA === nodeId ||
      def.nodeB === nodeId
    ) {
      const state = switchStates.find((s) => s.id === def.id);

      if (state) {
        return { def, state };
      }
    }
  }

  return null;
}

/* ── resolveNextSegment ─────────────────────────────────── */

/**
 * Dado o segmento atual e o nó de saída pelo qual a composição está
 * avançando, resolve qual é o próximo segmento (ou o motivo do bloqueio).
 *
 * Modelo do grafo:
 *
 * Um AMV é uma **conexão** entre três nós (nodeCommon, nodeA, nodeB) —
 * não é um segmento. Ao chegar em um dos três nós do AMV, a composição
 * atravessa o AMV e chega ao nó de saída determinado pela posição da chave.
 * Só então busca-se o segmento que parte desse nó de saída.
 *
 * Algoritmo:
 * 1. Verificar se há AMV tocando o `exitNodeId`.
 * 2. Se há AMV:
 *    a. `isSwitchAgainst` → se contra, retornar 'switch-against'.
 *    b. Calcular `throughNodeId` = nó de saída do AMV
 *       (common se veio de ramo; ramo ativo se veio do common).
 *    c. Buscar segmentos em `throughNodeId`, excluindo o segmento atual.
 * 3. Se não há AMV: buscar segmentos em `exitNodeId`, excluindo o atual.
 * 4. Se não restar candidato → 'terminal'.
 * 5. Verificar `protectedByInterval` e `technical` → filtrar.
 * 6. Retornar o segmento válido ou o último motivo de bloqueio.
 *
 * Fonte: docs/MODELO_DOMINIO.md — seções 20, 23 e 24
 */
export function resolveNextSegment(
  currentSegmentId: string,
  exitNodeId: string,
  segments: TrackSegment[],
  switchDefs: Record<string, SwitchDefinition>,
  switchStates: SwitchState[],
  interval: IntervalState,
): NavigationResult {
  const switchAtNode = findSwitchAtNode(exitNodeId, switchDefs, switchStates);

  // ── Atravessando um AMV ────────────────────────────────
  if (switchAtNode !== null) {
    const { def, state } = switchAtNode;

    // Verificar chave contra
    if (isSwitchAgainst(def, state.position, exitNodeId)) {
      return { ok: false, reason: 'switch-against' };
    }

    // Calcular o nó de saída do AMV (throughNodeId)
    let throughNodeId: string;

    if (exitNodeId === def.nodeCommon) {
      // Chegou pelo common → sai pelo ramo ativo
      throughNodeId = state.position === 'A' ? def.nodeA : def.nodeB;
    } else {
      // Chegou por um ramo → sai pelo common
      throughNodeId = def.nodeCommon;
    }

    // Buscar candidatos a partir do nó de saída do AMV
    const candidates = getSegmentsAtNode(throughNodeId, segments).filter(
      (seg) => seg.id !== currentSegmentId,
    );

    if (candidates.length === 0) {
      return { ok: false, reason: 'terminal' };
    }

    for (const candidate of candidates) {
      if (candidate.protectedByInterval && interval !== 'granted') {
        return { ok: false, reason: 'interval-required' };
      }

      if (candidate.technical) {
        continue;
      }

      return { ok: true, segment: candidate };
    }

    return { ok: false, reason: 'terminal' };
  }

  // ── Sem AMV — linha reta ───────────────────────────────
  const candidates = getSegmentsAtNode(exitNodeId, segments).filter(
    (seg) => seg.id !== currentSegmentId,
  );

  if (candidates.length === 0) {
    return { ok: false, reason: 'terminal' };
  }

  for (const candidate of candidates) {
    if (candidate.protectedByInterval && interval !== 'granted') {
      return { ok: false, reason: 'interval-required' };
    }

    if (candidate.technical) {
      continue;
    }

    return { ok: true, segment: candidate };
  }

  return { ok: false, reason: 'terminal' };
}
