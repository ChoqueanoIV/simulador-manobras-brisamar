import type { RollingStock } from '../../rolling-stock/types/rollingStock';

export type SimulationMode = 'preparation' | 'simulation';

export type YardSectionId =
  | 'L30'
  | 'L28'
  | 'L26'
  | 'L24_SUPERIOR'
  | 'L24_TRAVESSAO'
  | 'L24_INFERIOR'
  | 'L22_SUPERIOR'
  | 'L22_TRAVESSAO'
  | 'L22_INFERIOR'
  | 'L22_CURVA'
  | 'L20'
  | 'L18'
  | 'L16';

export type YardSectionState = {
  sectionId: YardSectionId;
  rollingStock: RollingStock[];
};

export type YardSectionDefinition = {
  id: YardSectionId;
  label: string;
  capacityReference?: number;
};
