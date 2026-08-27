import type { CompositionUnit } from '../../../rolling-stock/types/rollingStock';

/**
 * Representa um conjunto físico de material rodante engatado.
 *
 * A ordem de `units` define a sequência física da composição,
 * do extremo A (índice 0) ao extremo B (último índice).
 *
 * Regras:
 * - pode conter apenas locomotivas;
 * - pode conter apenas vagões (não poderá se mover);
 * - pode conter locomotivas e vagões em qualquer ordem;
 * - locomotiva no meio é permitida.
 */
export type Composition = {
  id: string;
  units: CompositionUnit[];
};

/**
 * Determina qual extremidade de A receberá B no engate.
 *
 * - 'a-tail': B é engatado ao final de A  → [...A, ...B]
 * - 'a-head': B é engatado ao início de A → [...B, ...A]
 */
export type CouplingSide = 'a-tail' | 'a-head';

let compositionSequence = 0;

function nextCompositionId(): string {
  compositionSequence += 1;
  return `comp-${compositionSequence}`;
}

/**
 * Cria uma nova composição a partir de uma lista de unidades.
 */
export function createComposition(units: CompositionUnit[]): Composition {
  return {
    id: nextCompositionId(),
    units,
  };
}

/**
 * Engata duas composições, produzindo uma terceira composição.
 *
 * Imutável: as composições originais não são alteradas.
 *
 * @param a - Composição de referência
 * @param b - Composição a ser acoplada
 * @param side - Lado de A onde B será engatado
 */
export function couple(
  a: Composition,
  b: Composition,
  side: CouplingSide,
): Composition {
  const units =
    side === 'a-tail'
      ? [...a.units, ...b.units]
      : [...b.units, ...a.units];

  return {
    id: nextCompositionId(),
    units,
  };
}

/**
 * Corta uma composição em duas no índice indicado.
 *
 * `index` representa quantas unidades ficam na primeira parte.
 * Deve ser >= 1 e < composition.units.length.
 *
 * Imutável: a composição original não é alterada.
 *
 * @example
 * // [WU1, WU2, WU3, WU4, WU5] com index=3
 * // → [[WU1, WU2, WU3], [WU4, WU5]]
 *
 * @throws {RangeError} se index for inválido
 */
export function splitAt(
  composition: Composition,
  index: number,
): [Composition, Composition] {
  if (index < 1 || index >= composition.units.length) {
    throw new RangeError(
      `splitAt: index ${index} inválido para composição com ${composition.units.length} unidades.`,
    );
  }

  return [
    { id: nextCompositionId(), units: composition.units.slice(0, index) },
    { id: nextCompositionId(), units: composition.units.slice(index) },
  ];
}

/**
 * Indica se a composição possui pelo menos uma locomotiva.
 *
 * Composições sem locomotiva não podem ser movimentadas.
 */
export function hasLocomotive(composition: Composition): boolean {
  return composition.units.some((unit) => unit.kind === 'locomotive');
}
