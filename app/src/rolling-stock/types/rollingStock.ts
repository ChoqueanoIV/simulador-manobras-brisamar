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
