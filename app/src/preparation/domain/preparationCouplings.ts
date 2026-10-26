import type { PreparationCoupling, YardSectionState } from '../types/preparation';

export function hasPreparationCoupling(
  couplings: PreparationCoupling[],
  sectionId: YardSectionState['sectionId'],
  leftRollingStockId: string,
  rightRollingStockId: string,
): boolean {
  return couplings.some(
    (coupling) =>
      coupling.sectionId === sectionId &&
      coupling.leftRollingStockId === leftRollingStockId &&
      coupling.rightRollingStockId === rightRollingStockId,
  );
}

/** Marca o estado inicial declarado pelo praticante; não executa uma manobra. */
export function togglePreparationCoupling(
  section: YardSectionState,
  couplings: PreparationCoupling[],
  leftRollingStockId: string,
  rightRollingStockId: string,
): PreparationCoupling[] {
  const leftIndex = section.rollingStock.findIndex((item) => item.id === leftRollingStockId);
  if (leftIndex < 0 || section.rollingStock[leftIndex + 1]?.id !== rightRollingStockId) {
    throw new Error('O engate inicial exige dois materiais consecutivos da mesma seção.');
  }

  if (
    hasPreparationCoupling(couplings, section.sectionId, leftRollingStockId, rightRollingStockId)
  ) {
    return couplings.filter(
      (coupling) =>
        !(
          coupling.sectionId === section.sectionId &&
          coupling.leftRollingStockId === leftRollingStockId &&
          coupling.rightRollingStockId === rightRollingStockId
        ),
    );
  }
  return [...couplings, { sectionId: section.sectionId, leftRollingStockId, rightRollingStockId }];
}
