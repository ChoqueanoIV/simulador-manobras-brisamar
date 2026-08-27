export type LocomotiveOrientation = 'front-barra' | 'rear-barra';

export type Locomotive = {
  id: string;
  kind: 'locomotive';
  number: string;
  orientation: LocomotiveOrientation;
};

export type WagonBlock = {
  id: string;
  kind: 'wagon-block';
  quantity: number;
  label: string;
  color: string;
};

export type RollingStock = Locomotive | WagonBlock;

/**
 * Representação lógica de um vagão individual.
 *
 * Mesmo que o usuário cadastre "10 FVR", internamente o domínio representa
 * dez WagonUnits, o que permite corte em qualquer posição.
 *
 * O WagonBlock visual é reconstruído agrupando unidades consecutivas
 * com o mesmo sourceBlockId.
 */
export type WagonUnit = {
  id: string;
  kind: 'wagon-unit';
  label: string;
  color: string;
  /** ID do WagonBlock de origem, usado para reconstrução visual. */
  sourceBlockId: string;
};

/**
 * Tipo de unidade em uma composição: locomotiva ou vagão individual.
 */
export type CompositionUnit = Locomotive | WagonUnit;
