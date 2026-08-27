import type { SwitchDefinition, SwitchId, SwitchState } from '../../types/switch';

export const brisamarSwitchDefinitions: Record<SwitchId, SwitchDefinition> = {
  /**
   * AMV-01: conecta L22 à diagonal que dá acesso a L26 (posição A) ou L28 (posição B).
   * Ponta comum = lado L22.
   */
  'AMV-01': {
    id: 'AMV-01',
    positionA: 'L22 ↔ L26',
    positionB: 'L22 ↔ L28',
    intervalRule: 'none',
    nodeCommon: 'N-AMV01-C',
    nodeA: 'N-AMV01-A',
    nodeB: 'N-AMV01-B',
  },

  /**
   * AMV-02: mantém L24 reta (posição A) ou desvia para a região L26/L28 (posição B).
   * Ponta comum = lado esquerdo de L24.
   */
  'AMV-02': {
    id: 'AMV-02',
    positionA: 'L24 ↔ L24',
    positionB: 'L24 ↔ acesso L26/L28',
    intervalRule: 'none',
    nodeCommon: 'N-AMV02-C',
    nodeA: 'N-AMV02-A',
    nodeB: 'N-AMV02-B',
  },

  /**
   * AMV-03: mantém L24 reta (posição A) ou desvia para L30 (posição B).
   */
  'AMV-03': {
    id: 'AMV-03',
    positionA: 'L24 ↔ L24',
    positionB: 'L24 ↔ L30',
    intervalRule: 'none',
    nodeCommon: 'N-AMV03-C',
    nodeA: 'N-AMV03-A',
    nodeB: 'N-AMV03-B',
  },

  /**
   * AMV-04: mantém L24 reta (posição A) ou desvia para L22 via travessão (posição B).
   */
  'AMV-04': {
    id: 'AMV-04',
    positionA: 'L24 ↔ L24',
    positionB: 'L24 ↔ L22',
    intervalRule: 'none',
    nodeCommon: 'N-AMV04-C',
    nodeA: 'N-AMV04-A',
    nodeB: 'N-AMV04-B',
  },

  /**
   * AMV-05: mantém L22 reta (posição A) ou desvia para L24 via travessão (posição B).
   */
  'AMV-05': {
    id: 'AMV-05',
    positionA: 'L22 ↔ L22',
    positionB: 'L22 ↔ L24',
    intervalRule: 'none',
    nodeCommon: 'N-AMV05-C',
    nodeA: 'N-AMV05-A',
    nodeB: 'N-AMV05-B',
  },

  /**
   * AMV-06: pertence à diagonal de manobra (L16/L18/L20 ↔ L22).
   * Ponta comum = lado diagonal (interno).
   * Posição A: rota direta para L16.
   * Posição B: rota para o ramal da diagonal (ramo técnico).
   * Requer intervalo para manipulação.
   */
  'AMV-06': {
    id: 'AMV-06',
    positionA: 'AMV-07 ↔ L16',
    positionB: 'AMV-07 ↔ L16',
    intervalRule: 'full-lock',
    nodeCommon: 'N-AMV06-C',
    nodeA: 'N-AMV06-B',
    nodeB: 'N-AMV06-TEC',
  },

  /**
   * AMV-07: conecta L18 ao ramal diagonal.
   * Posição A: L18 reta (interno).
   * Posição B: desvio para L16 via AMV-06.
   * Requer intervalo.
   */
  'AMV-07': {
    id: 'AMV-07',
    positionA: 'AMV-08 ↔ L18',
    positionB: 'AMV-08 ↔ L16',
    intervalRule: 'full-lock',
    nodeCommon: 'N-AMV07-C',
    nodeA: 'N-AMV07-B',
    nodeB: 'N-AMV06-C',
  },

  /**
   * AMV-08: conecta L20 ao ramal diagonal.
   * Posição A: L20 reta (interno).
   * Posição B: desvio para L18 via AMV-07.
   * Requer intervalo.
   */
  'AMV-08': {
    id: 'AMV-08',
    positionA: 'AMV-09 ↔ L20',
    positionB: 'AMV-09 ↔ L18',
    intervalRule: 'full-lock',
    nodeCommon: 'N-AMV08-C',
    nodeA: 'N-AMV08-B',
    nodeB: 'N-AMV07-C',
  },

  /**
   * AMV-09: conecta L22 ao ramal L20.
   * Posição A: L22 reta (sem intervalo, circulação L22↔L22 permitida).
   * Posição B: desvio para L20 (requer intervalo).
   */
  'AMV-09': {
    id: 'AMV-09',
    positionA: 'L22 ↔ L22',
    positionB: 'L22 ↔ L20',
    intervalRule: 'restricted-position',
    allowedWithoutInterval: 'A',
    nodeCommon: 'N-AMV09-C',
    nodeA: 'N-AMV09-A',
    nodeB: 'N-AMV09-B',
  },

  /**
   * AMV-10: mantém L22 reta (posição A) ou desvia para L24 inferior (posição B).
   */
  'AMV-10': {
    id: 'AMV-10',
    positionA: 'L22 ↔ L22',
    positionB: 'L22 ↔ L24',
    intervalRule: 'none',
    nodeCommon: 'N-AMV10-C',
    nodeA: 'N-AMV10-A',
    nodeB: 'N-AMV10-B',
  },

  /**
   * AMV-11: mantém L24 reta (posição A) ou desvia para L22 (posição B).
   */
  'AMV-11': {
    id: 'AMV-11',
    positionA: 'L24 ↔ L24',
    positionB: 'L24 ↔ L22',
    intervalRule: 'none',
    nodeCommon: 'N-AMV11-C',
    nodeA: 'N-AMV11-A',
    nodeB: 'N-AMV11-B',
  },

  /**
   * AMV-12: mantém L22 reta (posição A) ou desvia para a alça curva / L24 superior (posição B).
   * A alça de curva é um ramo fixo do desenho — o AMV opera apenas entre
   * a continuidade da L22 e o desvio para L24 superior.
   */
  'AMV-12': {
    id: 'AMV-12',
    positionA: 'L22 reta',
    positionB: 'L22 ↔ L24 superior',
    intervalRule: 'none',
    nodeCommon: 'N-AMV12-C',
    nodeA: 'N-AMV12-A',
    nodeB: 'N-AMV12-B',
  },
};

export const initialSwitchStates: SwitchState[] = Object.keys(
  brisamarSwitchDefinitions,
).map((id) => ({
  id: id as SwitchId,
  position: 'A',
  occupied: false,
}));
