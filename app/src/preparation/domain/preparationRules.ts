import type {
  Locomotive,
  LocomotiveOrientation,
  WagonBlock,
} from '../../rolling-stock/types/rollingStock';
import type { YardSectionState } from '../types/preparation';

export type ValidationResult =
  | { valid: true }
  | { valid: false; message: string };

export function validateLocomotiveNumber(number: string): ValidationResult {
  if (!number.trim()) {
    return { valid: false, message: 'Informe o número da locomotiva.' };
  }

  return { valid: true };
}

export function validateLocomotiveOrientation(
  orientation: LocomotiveOrientation,
): ValidationResult {
  if (orientation !== 'front-barra' && orientation !== 'rear-barra') {
    return { valid: false, message: 'Orientação inválida.' };
  }

  return { valid: true };
}

export function validateWagonQuantity(quantity: number): ValidationResult {
  if (!Number.isInteger(quantity) || quantity < 1) {
    return {
      valid: false,
      message: 'A quantidade de vagões deve ser um inteiro positivo.',
    };
  }

  return { valid: true };
}

export function appendLocomotive(
  section: YardSectionState,
  locomotive: Locomotive,
): YardSectionState {
  return {
    ...section,
    rollingStock: [...section.rollingStock, locomotive],
  };
}

export function appendWagonBlock(
  section: YardSectionState,
  wagonBlock: WagonBlock,
): YardSectionState {
  return {
    ...section,
    rollingStock: [...section.rollingStock, wagonBlock],
  };
}

export function resetSection(section: YardSectionState): YardSectionState {
  return {
    ...section,
    rollingStock: [],
  };
}

/**
 * Unidade de ocupação usada na referência visual de capacidade.
 *
 * - cada vagão = 1 unidade;
 * - cada locomotiva = 1 unidade.
 *
 * A capacidade continua sendo uma referência operacional aproximada, pois
 * veículos ferroviários reais podem possuir comprimentos diferentes.
 */
export function getSectionOccupiedUnits(section: YardSectionState): number {
  return section.rollingStock.reduce((total, item) => {
    if (item.kind === 'locomotive') {
      return total + 1;
    }

    return total + item.quantity;
  }, 0);
}

/**
 * Mantido para usos que precisem especificamente da quantidade de vagões.
 */
export function getSectionWagonQuantity(section: YardSectionState): number {
  return section.rollingStock.reduce((total, item) => {
    return item.kind === 'wagon-block' ? total + item.quantity : total;
  }, 0);
}

export function isCapacityExceeded(
  section: YardSectionState,
  capacityReference?: number,
): boolean {
  if (!capacityReference) {
    return false;
  }

  return getSectionOccupiedUnits(section) > capacityReference;
}
