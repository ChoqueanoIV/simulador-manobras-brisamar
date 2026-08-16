import type { YardSectionId } from '../../preparation/types/preparation';

export type YardPoint = {
  x: number;
  y: number;
};

export type YardSectionGeometry = {
  id: YardSectionId;
  path: string;
  parkingStart: YardPoint;
  parkingEnd: YardPoint;
  parkingPolyline?: YardPoint[];
};

export const yardSectionGeometry: YardSectionGeometry[] = [
  {
    id: 'L30',
    path: 'M120 95 L425 376',
    parkingStart: { x: 155, y: 128 },
    parkingEnd: { x: 355, y: 310 },
  },

  /*
   * L28 e L26 possuem a mesma capacidade física de referência: 4 veículos.
   *
   * Para evitar que quatro vagões tenham comprimentos visuais diferentes
   * entre as duas linhas, as duas zonas usam o mesmo comprimento visual útil.
   *
   * O material continua terminando antes da região do marco/AMV,
   * preservando o espaço de gabarito e circulação.
   */
  {
    id: 'L28',
    path: 'M82 255 H200',
    parkingStart: { x: 92, y: 255 },
    parkingEnd: { x: 185, y: 255 },
  },
  {
    id: 'L26',
    path: 'M82 315 H265',
    parkingStart: { x: 92, y: 315 },
    parkingEnd: { x: 185, y: 315 },
  },

  {
    id: 'L24_SUPERIOR',
    path: 'M82 375 H498',
    parkingStart: { x: 92, y: 375 },
    parkingEnd: { x: 445, y: 375 },
  },
  {
    id: 'L24_TRAVESSAO',
    path: 'M498 375 H898',
    parkingStart: { x: 585, y: 375 },
    parkingEnd: { x: 750, y: 375 },
  },
  {
    id: 'L24_INFERIOR',
    path: 'M898 375 H1455',
    parkingStart: { x: 940, y: 375 },
    parkingEnd: { x: 1425, y: 375 },
  },

  {
    id: 'L22_SUPERIOR',
    path: 'M82 438 H560',
    parkingStart: { x: 95, y: 438 },
    parkingEnd: { x: 520, y: 438 },
  },
  {
    id: 'L22_TRAVESSAO',
    path: 'M560 438 H820',
    parkingStart: { x: 585, y: 438 },
    parkingEnd: { x: 750, y: 438 },
  },
  {
    id: 'L22_INFERIOR',
    path: 'M820 438 H1510',
    parkingStart: { x: 940, y: 438 },
    parkingEnd: { x: 1425, y: 438 },
  },

  {
    id: 'L22_CURVA',
    path: 'M1510 436 C1545 360 1582 238 1575 105',
    parkingStart: { x: 1531, y: 363 },
    parkingEnd: { x: 1574, y: 132 },
    parkingPolyline: [
      { x: 1531, y: 363 },
      { x: 1542, y: 334 },
      { x: 1552, y: 302 },
      { x: 1561, y: 267 },
      { x: 1568, y: 230 },
      { x: 1573, y: 191 },
      { x: 1575, y: 153 },
      { x: 1574, y: 132 },
    ],
  },

  {
    id: 'L20',
    path: 'M82 495 H697',
    parkingStart: { x: 95, y: 495 },
    parkingEnd: { x: 650, y: 495 },
  },
  {
    id: 'L18',
    path: 'M82 552 H628',
    parkingStart: { x: 95, y: 552 },
    parkingEnd: { x: 580, y: 552 },
  },
  {
    id: 'L16',
    path: 'M82 610 H560',
    parkingStart: { x: 95, y: 610 },
    parkingEnd: { x: 515, y: 610 },
  },
];
