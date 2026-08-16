import type {
  YardSectionDefinition,
  YardSectionId,
  YardSectionState,
} from '../types/preparation';

export const yardSectionDefinitions: Record<YardSectionId, YardSectionDefinition> = {
  L30: {
    id: 'L30',
    label: 'Linha 30',
    capacityReference: 30,
  },
  L28: {
    id: 'L28',
    label: 'Linha 28',
    capacityReference: 4,
  },
  L26: {
    id: 'L26',
    label: 'Linha 26',
    capacityReference: 4,
  },

  L24_SUPERIOR: {
    id: 'L24_SUPERIOR',
    label: 'Linha 24 - superior',
    capacityReference: 18,
  },
  L24_TRAVESSAO: {
    id: 'L24_TRAVESSAO',
    label: 'Linha 24 - travessão',
    capacityReference: 12,
  },
  L24_INFERIOR: {
    id: 'L24_INFERIOR',
    label: 'Linha 24 - inferior',
    capacityReference: 55,
  },

  L22_SUPERIOR: {
    id: 'L22_SUPERIOR',
    label: 'Linha 22 - superior',
    capacityReference: 22,
  },
  L22_TRAVESSAO: {
    id: 'L22_TRAVESSAO',
    label: 'Linha 22 - travessão',
    capacityReference: 12,
  },
  L22_INFERIOR: {
    id: 'L22_INFERIOR',
    label: 'Linha 22 - inferior',
    capacityReference: 55,
  },
  L22_CURVA: {
    id: 'L22_CURVA',
    label: 'Linha 22 - alça curva',
    capacityReference: 13,
  },

  L20: {
    id: 'L20',
    label: 'Linha 20',
  },
  L18: {
    id: 'L18',
    label: 'Linha 18',
  },
  L16: {
    id: 'L16',
    label: 'Linha 16',
  },
};

export const initialYardSections: YardSectionState[] = Object.keys(
  yardSectionDefinitions,
).map((sectionId) => ({
  sectionId: sectionId as YardSectionId,
  rollingStock: [],
}));
