/**
 * Topologia do Grafo — Pátio Brisamar
 *
 * Fonte de verdade: docs/MAPA_BRISAMAR_V1_CONSOLIDADO.md
 *
 * Cada nó representa um ponto físico de conexão entre dois ou mais segmentos.
 * Cada segmento representa um trecho navegável de trilho entre dois nós.
 *
 * Convenção de IDs de nós:
 *   N-<LINHA>-TERM-<LADO>  — terminal de linha (extremidade morta)
 *   N-AMV<NN>-C            — ponta comum do AMV (entrada única)
 *   N-AMV<NN>-A            — ramo A do AMV
 *   N-AMV<NN>-B            — ramo B do AMV
 *
 * A direção de cada segmento (startNodeId → endNodeId) segue a orientação
 * visual do SVG: da esquerda (Superior) para a direita (Inferior).
 * Segmentos são bidirecionais — a direção no tipo é apenas convenção.
 */

export type TrackNode = {
  id: string;
};

export type TrackSegment = {
  id: string;
  /** Nome canônico da linha, ex.: 'L22', 'L24'. */
  line: string;
  startNodeId: string;
  endNodeId: string;
  /**
   * true = trecho em área protegida (L16, L18, L20).
   * Movimentação requer intervalo concedido.
   */
  protectedByInterval: boolean;
  /**
   * true = trecho técnico (continuação reta além da área de manobra).
   * Existe apenas para modelar a geometria correta dos AMVs 06, 07 e 08.
   * Não é área livre de manobra do praticante.
   */
  technical: boolean;
};

/* ── Nós ──────────────────────────────────────────────────── */

export const brisamarNodes: TrackNode[] = [
  // ── L30 ────────────────────────────────────────────────
  { id: 'N-L30-TERM' },       // terminal esquerdo de L30
  { id: 'N-AMV03-B' },        // ramo B do AMV-03 (acesso a L30)

  // ── L28 ────────────────────────────────────────────────
  { id: 'N-L28-TERM' },       // terminal esquerdo de L28
  { id: 'N-AMV01-B' },        // ramo B do AMV-01 (L22↔L28)

  // ── L26 ────────────────────────────────────────────────
  { id: 'N-L26-TERM' },       // terminal esquerdo de L26
  { id: 'N-AMV01-A' },        // ramo A do AMV-01 (L22↔L26)

  // ── Região de cruzamento L26/L28 ───────────────────────
  // AMV-01 e AMV-02 compartilham a região diagonal L26/L28
  { id: 'N-AMV01-C' },        // ponta comum do AMV-01 (lado L22)
  { id: 'N-AMV02-B' },        // ramo B do AMV-02 (acesso L26/L28)

  // ── L24 ────────────────────────────────────────────────
  { id: 'N-L24-TERM-ESQ' },   // terminal esquerdo de L24
  { id: 'N-AMV02-C' },        // ponta comum do AMV-02
  { id: 'N-AMV02-A' },        // ramo A do AMV-02 (L24 reta)
  { id: 'N-AMV03-C' },        // ponta comum do AMV-03
  { id: 'N-AMV03-A' },        // ramo A do AMV-03 (L24 reta)
  { id: 'N-AMV04-C' },        // ponta comum do AMV-04
  { id: 'N-AMV04-A' },        // ramo A do AMV-04 (L24 reta)
  { id: 'N-AMV04-B' },        // ramo B do AMV-04 (L24↔L22)
  { id: 'N-AMV11-C' },        // ponta comum do AMV-11
  { id: 'N-AMV11-A' },        // ramo A do AMV-11 (L24 reta)
  { id: 'N-AMV11-B' },        // ramo B do AMV-11 (L24↔L22)
  { id: 'N-L24-TERM-DIR' },   // terminal direito de L24

  // ── L22 ────────────────────────────────────────────────
  { id: 'N-L22-TERM-ESQ' },   // terminal esquerdo de L22
  { id: 'N-AMV05-C' },        // ponta comum do AMV-05
  { id: 'N-AMV05-A' },        // ramo A do AMV-05 (L22 reta)
  { id: 'N-AMV05-B' },        // ramo B do AMV-05 (L22↔L24)
  { id: 'N-AMV09-C' },        // ponta comum do AMV-09
  { id: 'N-AMV09-A' },        // ramo A do AMV-09 (L22 reta)
  { id: 'N-AMV09-B' },        // ramo B do AMV-09 (L22↔L20)
  { id: 'N-AMV10-C' },        // ponta comum do AMV-10
  { id: 'N-AMV10-A' },        // ramo A do AMV-10 (L22 reta)
  { id: 'N-AMV10-B' },        // ramo B do AMV-10 (L22↔L24 inf.)
  { id: 'N-AMV12-C' },        // ponta comum do AMV-12
  { id: 'N-AMV12-A' },        // ramo A do AMV-12 (L22 reta)
  { id: 'N-AMV12-B' },        // ramo B do AMV-12 (L22↔L24 sup.)
  { id: 'N-L22-TERM-DIR' },   // terminal direito de L22 (inferior)
  { id: 'N-L22-CURVA-TERM' }, // terminal da alça curva (topo)

  // ── L20 ────────────────────────────────────────────────
  { id: 'N-L20-TERM-ESQ' },   // terminal esquerdo de L20
  { id: 'N-AMV08-B' },        // ramo B do AMV-08 (diagonal → L20)
  { id: 'N-AMV08-TEC' },      // ramo técnico do AMV-08 (L20 reta, fora de manobra)

  // ── L18 ────────────────────────────────────────────────
  { id: 'N-L18-TERM-ESQ' },   // terminal esquerdo de L18
  { id: 'N-AMV07-B' },        // ramo B do AMV-07 (diagonal → L18)
  { id: 'N-AMV07-TEC' },      // ramo técnico do AMV-07 (L18 reta, fora de manobra)

  // ── L16 ────────────────────────────────────────────────
  { id: 'N-L16-TERM-ESQ' },   // terminal esquerdo de L16
  { id: 'N-AMV06-B' },        // ramo B do AMV-06 (diagonal → L16)
  { id: 'N-AMV06-TEC' },      // ramo técnico do AMV-06 (L16 reta, fora de manobra)

  // ── Diagonal de manobra (L16/L18/L20 → L22) ───────────
  // Os AMVs 06, 07 e 08 compartilham a diagonal de manobra.
  // O nó comum de cada um é o ponto onde a diagonal encontra a linha.
  { id: 'N-AMV06-C' },        // ponta comum do AMV-06
  { id: 'N-AMV07-C' },        // ponta comum do AMV-07
  { id: 'N-AMV08-C' },        // ponta comum do AMV-08 (= N-AMV09-B na topologia real)
];

/* ── Segmentos ────────────────────────────────────────────── */

export const brisamarSegments: TrackSegment[] = [

  // ── L30 ────────────────────────────────────────────────
  {
    id: 'SEG-L30',
    line: 'L30',
    startNodeId: 'N-L30-TERM',
    endNodeId: 'N-AMV03-B',
    protectedByInterval: false,
    technical: false,
  },

  // ── L28 ────────────────────────────────────────────────
  {
    id: 'SEG-L28',
    line: 'L28',
    startNodeId: 'N-L28-TERM',
    endNodeId: 'N-AMV01-B',
    protectedByInterval: false,
    technical: false,
  },

  // ── L26 ────────────────────────────────────────────────
  {
    id: 'SEG-L26',
    line: 'L26',
    startNodeId: 'N-L26-TERM',
    endNodeId: 'N-AMV01-A',
    protectedByInterval: false,
    technical: false,
  },

  // ── Diagonal L26/L28 → AMV-01 → AMV-02 ────────────────
  // Trecho que conecta a região L26/L28 ao AMV-02 (ramo B)
  {
    id: 'SEG-L26-L28-ACESSO',
    line: 'L24',
    startNodeId: 'N-AMV01-C',
    endNodeId: 'N-AMV02-B',
    protectedByInterval: false,
    technical: false,
  },

  // ── L24 Superior (esquerda até AMV-02) ─────────────────
  {
    id: 'SEG-L24-SUP',
    line: 'L24',
    startNodeId: 'N-L24-TERM-ESQ',
    endNodeId: 'N-AMV02-C',
    protectedByInterval: false,
    technical: false,
  },

  // ── L24 entre AMV-02 e AMV-03 ──────────────────────────
  {
    id: 'SEG-L24-02-03',
    line: 'L24',
    startNodeId: 'N-AMV02-A',
    endNodeId: 'N-AMV03-C',
    protectedByInterval: false,
    technical: false,
  },

  // ── L24 entre AMV-03 e AMV-04 ──────────────────────────
  {
    id: 'SEG-L24-03-04',
    line: 'L24',
    startNodeId: 'N-AMV03-A',
    endNodeId: 'N-AMV04-C',
    protectedByInterval: false,
    technical: false,
  },

  // ── L24 entre AMV-04 e AMV-11 (travessão) ──────────────
  {
    id: 'SEG-L24-TRAV',
    line: 'L24',
    startNodeId: 'N-AMV04-A',
    endNodeId: 'N-AMV11-C',
    protectedByInterval: false,
    technical: false,
  },

  // ── L24 Inferior (AMV-11 até terminal direito) ─────────
  {
    id: 'SEG-L24-INF',
    line: 'L24',
    startNodeId: 'N-AMV11-A',
    endNodeId: 'N-L24-TERM-DIR',
    protectedByInterval: false,
    technical: false,
  },

  // ── L22 Superior (esquerda até AMV-05) ─────────────────
  {
    id: 'SEG-L22-SUP',
    line: 'L22',
    startNodeId: 'N-L22-TERM-ESQ',
    endNodeId: 'N-AMV05-C',
    protectedByInterval: false,
    technical: false,
  },

  // ── L22 entre AMV-05 e AMV-09 ──────────────────────────
  {
    id: 'SEG-L22-05-09',
    line: 'L22',
    startNodeId: 'N-AMV05-A',
    endNodeId: 'N-AMV09-C',
    protectedByInterval: false,
    technical: false,
  },

  // ── L22 entre AMV-09 e AMV-10 ──────────────────────────
  {
    id: 'SEG-L22-09-10',
    line: 'L22',
    startNodeId: 'N-AMV09-A',
    endNodeId: 'N-AMV10-C',
    protectedByInterval: false,
    technical: false,
  },

  // ── L22 entre AMV-10 e AMV-12 ──────────────────────────
  {
    id: 'SEG-L22-10-12',
    line: 'L22',
    startNodeId: 'N-AMV10-A',
    endNodeId: 'N-AMV12-C',
    protectedByInterval: false,
    technical: false,
  },

  // ── L22 Inferior (AMV-12 ramo A até terminal direito) ──
  {
    id: 'SEG-L22-INF',
    line: 'L22',
    startNodeId: 'N-AMV12-A',
    endNodeId: 'N-L22-TERM-DIR',
    protectedByInterval: false,
    technical: false,
  },

  // ── L22 Alça curva (AMV-12 ramo B até topo) ────────────
  {
    id: 'SEG-L22-CURVA',
    line: 'L22',
    startNodeId: 'N-AMV12-B',
    endNodeId: 'N-L22-CURVA-TERM',
    protectedByInterval: false,
    technical: false,
  },

  // ── Desvio AMV-05 → L24 (travessão, acesso superior) ──
  {
    id: 'SEG-L22-L24-AMV05',
    line: 'L24',
    startNodeId: 'N-AMV05-B',
    endNodeId: 'N-AMV04-B',
    protectedByInterval: false,
    technical: false,
  },

  // ── Desvio AMV-11 → L22 ────────────────────────────────
  {
    id: 'SEG-L24-L22-AMV11',
    line: 'L22',
    startNodeId: 'N-AMV11-B',
    endNodeId: 'N-AMV10-B',
    protectedByInterval: false,
    technical: false,
  },

  // ── Desvio AMV-12 → L24 Superior ───────────────────────
  {
    id: 'SEG-L22-L24-AMV12',
    line: 'L24',
    startNodeId: 'N-AMV12-B',
    endNodeId: 'N-AMV03-B',
    protectedByInterval: false,
    technical: false,
  },

  // ── L20 (área protegida) ───────────────────────────────
  {
    id: 'SEG-L20',
    line: 'L20',
    startNodeId: 'N-L20-TERM-ESQ',
    endNodeId: 'N-AMV08-B',
    protectedByInterval: true,
    technical: false,
  },

  // ── L20 técnico (continuação reta, fora de manobra) ────
  {
    id: 'SEG-L20-TEC',
    line: 'L20',
    startNodeId: 'N-AMV08-C',
    endNodeId: 'N-AMV08-TEC',
    protectedByInterval: true,
    technical: true,
  },

  // ── Diagonal L20 → AMV-09 ──────────────────────────────
  {
    id: 'SEG-DIAG-L20-AMV09',
    line: 'L20',
    startNodeId: 'N-AMV08-B',
    endNodeId: 'N-AMV09-B',
    protectedByInterval: true,
    technical: false,
  },

  // ── L18 (área protegida) ───────────────────────────────
  {
    id: 'SEG-L18',
    line: 'L18',
    startNodeId: 'N-L18-TERM-ESQ',
    endNodeId: 'N-AMV07-B',
    protectedByInterval: true,
    technical: false,
  },

  // ── L18 técnico ────────────────────────────────────────
  {
    id: 'SEG-L18-TEC',
    line: 'L18',
    startNodeId: 'N-AMV07-C',
    endNodeId: 'N-AMV07-TEC',
    protectedByInterval: true,
    technical: true,
  },

  // ── Diagonal L18 → AMV-08 ──────────────────────────────
  {
    id: 'SEG-DIAG-L18-AMV08',
    line: 'L18',
    startNodeId: 'N-AMV07-B',
    endNodeId: 'N-AMV08-C',
    protectedByInterval: true,
    technical: false,
  },

  // ── L16 (área protegida) ───────────────────────────────
  {
    id: 'SEG-L16',
    line: 'L16',
    startNodeId: 'N-L16-TERM-ESQ',
    endNodeId: 'N-AMV06-B',
    protectedByInterval: true,
    technical: false,
  },

  // ── L16 técnico ────────────────────────────────────────
  {
    id: 'SEG-L16-TEC',
    line: 'L16',
    startNodeId: 'N-AMV06-C',
    endNodeId: 'N-AMV06-TEC',
    protectedByInterval: true,
    technical: true,
  },

  // ── Diagonal L16 → AMV-07 ──────────────────────────────
  {
    id: 'SEG-DIAG-L16-AMV07',
    line: 'L16',
    startNodeId: 'N-AMV06-B',
    endNodeId: 'N-AMV07-C',
    protectedByInterval: true,
    technical: false,
  },
];
