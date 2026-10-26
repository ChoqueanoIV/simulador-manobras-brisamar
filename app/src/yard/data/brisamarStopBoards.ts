/**
 * Nove limites do SVG validados pelo responsável em 2026-10-26.
 * A via continua além de todos eles; acesso exige o intervalo do CCO.
 * Sem distância, capacidade ou conexões externas adicionais inferidas.
 */
export type StopBoardDefinition = {
  id: string;
  line: string;
  segmentId: string;
  nodeId: string;
};

export const brisamarStopBoards: StopBoardDefinition[] = [
  { id: 'PARE-L30', line: 'L30', segmentId: 'SEG-L30', nodeId: 'N-L30-TERM' },
  { id: 'PARE-L28', line: 'L28', segmentId: 'SEG-L28', nodeId: 'N-L28-TERM' },
  { id: 'PARE-L26', line: 'L26', segmentId: 'SEG-L26', nodeId: 'N-L26-TERM' },
  { id: 'PARE-L24-SUP', line: 'L24', segmentId: 'SEG-L24-SUP', nodeId: 'N-L24-TERM-ESQ' },
  { id: 'PARE-L22-SUP', line: 'L22', segmentId: 'SEG-L22-SUP', nodeId: 'N-L22-TERM-ESQ' },
  { id: 'PARE-L20', line: 'L20', segmentId: 'SEG-L20', nodeId: 'N-L20-TERM-ESQ' },
  { id: 'PARE-L18', line: 'L18', segmentId: 'SEG-L18', nodeId: 'N-L18-TERM-ESQ' },
  { id: 'PARE-L16', line: 'L16', segmentId: 'SEG-L16', nodeId: 'N-L16-TERM-ESQ' },
  { id: 'PARE-L22-CURVA', line: 'L22', segmentId: 'SEG-L22-CURVA', nodeId: 'N-L22-CURVA-TERM' },
];
