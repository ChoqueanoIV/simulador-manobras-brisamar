import type { Composition } from '../../simulation/domain/composition/composition';
import type { CompositionUnit, RollingStock } from '../../rolling-stock/types/rollingStock';
import type { PreparationCoupling, YardSectionId, YardSectionState } from '../types/preparation';
import { hasPreparationCoupling } from './preparationCouplings';
import { validateWagonQuantity } from './preparationRules';

export type CompositionOrigin = {
  compositionId: string;
  sectionId: YardSectionId;
  rollingStockIds: string[];
};

export type PreparedCompositions = {
  compositions: Composition[];
  origins: CompositionOrigin[];
};

function expandItem(item: RollingStock): CompositionUnit[] {
  if (item.kind === 'locomotive') return [{ ...item }];
  if (!validateWagonQuantity(item.quantity).valid) {
    throw new Error(`Quantidade inválida no bloco ${item.id}.`);
  }
  return Array.from({ length: item.quantity }, (_, index) => ({
    id: `wagon:${JSON.stringify([item.id, index + 1])}`,
    kind: 'wagon-unit',
    label: item.label,
    color: item.color,
    sourceBlockId: item.id,
  }));
}

/** Converte engates declarados; não infere posição, frente ou engates novos. */
export function buildPreparedCompositions(
  sections: YardSectionState[],
  couplings: PreparationCoupling[],
): PreparedCompositions {
  const sectionIds = new Set<string>();
  const stockIds = new Set<string>();
  const unitIds = new Set<string>();
  for (const section of sections) {
    if (sectionIds.has(section.sectionId)) throw new Error(`Seção duplicada: ${section.sectionId}`);
    sectionIds.add(section.sectionId);
    for (const item of section.rollingStock) {
      if (stockIds.has(item.id)) throw new Error(`Material duplicado: ${item.id}`);
      stockIds.add(item.id);
    }
  }
  const couplingIds = new Set<string>();
  for (const coupling of couplings) {
    const section = sections.find((item) => item.sectionId === coupling.sectionId);
    const left = section?.rollingStock.findIndex((item) => item.id === coupling.leftRollingStockId);
    const key = JSON.stringify([
      coupling.sectionId,
      coupling.leftRollingStockId,
      coupling.rightRollingStockId,
    ]);
    if (
      !section ||
      left === undefined ||
      left < 0 ||
      section.rollingStock[left + 1]?.id !== coupling.rightRollingStockId ||
      couplingIds.has(key)
    ) {
      throw new Error('Engate inicial inválido ou duplicado.');
    }
    couplingIds.add(key);
  }

  const result: PreparedCompositions = { compositions: [], origins: [] };
  for (const section of sections) {
    let group: Composition | undefined;
    let origin: CompositionOrigin | undefined;
    section.rollingStock.forEach((item, index) => {
      const previous = section.rollingStock[index - 1];
      if (
        !previous ||
        !hasPreparationCoupling(couplings, section.sectionId, previous.id, item.id)
      ) {
        const id = `prepared:${JSON.stringify([section.sectionId, item.id])}`;
        group = { id, units: [] };
        origin = { compositionId: id, sectionId: section.sectionId, rollingStockIds: [] };
        result.compositions.push(group);
        result.origins.push(origin);
      }
      const units = expandItem(item);
      for (const unit of units) {
        if (unitIds.has(unit.id)) throw new Error(`Veículo duplicado: ${unit.id}`);
        unitIds.add(unit.id);
      }
      group!.units.push(...units);
      origin!.rollingStockIds.push(item.id);
    });
  }
  return result;
}
