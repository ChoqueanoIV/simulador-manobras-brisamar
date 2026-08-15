import type { SwitchDefinition, SwitchId, SwitchState } from '../../types/switch';

export const brisamarSwitchDefinitions: Record<SwitchId, SwitchDefinition> = {
  'AMV-01': {
    id: 'AMV-01',
    positionA: 'L22 ↔ L26',
    positionB: 'L22 ↔ L28',
    intervalRule: 'none',
  },
  'AMV-02': {
    id: 'AMV-02',
    positionA: 'L24 ↔ L24',
    positionB: 'L24 ↔ acesso L26/L28',
    intervalRule: 'none',
  },
  'AMV-03': {
    id: 'AMV-03',
    positionA: 'L24 ↔ L24',
    positionB: 'L24 ↔ L30',
    intervalRule: 'none',
  },
  'AMV-04': {
    id: 'AMV-04',
    positionA: 'L24 ↔ L24',
    positionB: 'L24 ↔ L22',
    intervalRule: 'none',
  },
  'AMV-05': {
    id: 'AMV-05',
    positionA: 'L22 ↔ L22',
    positionB: 'L22 ↔ L24',
    intervalRule: 'none',
  },
  'AMV-06': {
    id: 'AMV-06',
    positionA: 'AMV-07 ↔ L16',
    positionB: 'AMV-07 ↔ L16',
    intervalRule: 'full-lock',
  },
  'AMV-07': {
    id: 'AMV-07',
    positionA: 'AMV-08 ↔ L18',
    positionB: 'AMV-08 ↔ L16',
    intervalRule: 'full-lock',
  },
  'AMV-08': {
    id: 'AMV-08',
    positionA: 'AMV-09 ↔ L20',
    positionB: 'AMV-09 ↔ L18',
    intervalRule: 'full-lock',
  },
  'AMV-09': {
    id: 'AMV-09',
    positionA: 'L22 ↔ L22',
    positionB: 'L22 ↔ L20',
    intervalRule: 'restricted-position',
    allowedWithoutInterval: 'A',
  },
  'AMV-10': {
    id: 'AMV-10',
    positionA: 'L22 ↔ L22',
    positionB: 'L22 ↔ L24',
    intervalRule: 'none',
  },
  'AMV-11': {
    id: 'AMV-11',
    positionA: 'L24 ↔ L24',
    positionB: 'L24 ↔ L22',
    intervalRule: 'none',
  },

  // A alça de curva é um ramo fixo do desenho e NÃO muda com o clique.
  // A operação do AMV-12 atua apenas entre a continuidade da L22
  // e o desvio L22 ↔ L24 superior.
  'AMV-12': {
    id: 'AMV-12',
    positionA: 'L22 reta',
    positionB: 'L22 ↔ L24 superior',
    intervalRule: 'none',
  },
};

export const initialSwitchStates: SwitchState[] = Object.keys(
  brisamarSwitchDefinitions,
).map((id) => ({
  id: id as SwitchId,
  position: 'A',
  occupied: false,
}));
