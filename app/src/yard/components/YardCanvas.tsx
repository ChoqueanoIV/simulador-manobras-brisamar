import { useMemo, useRef, useState, type PointerEvent, type WheelEvent } from 'react';

type Point = { x: number; y: number };
type ViewState = { scale: number; x: number; y: number };

const MIN_SCALE = 0.65;
const MAX_SCALE = 3;

/**
 * V7
 *
 * Ajustes finos apÃ³s validaÃ§Ã£o visual da V6:
 * - marco L26/L28 recuado e centralizado no vÃ£o;
 * - marco L24/L26 avanÃ§ado em direÃ§Ã£o ao AMV-01, mantendo-se no vÃ£o;
 * - marco L24/L30 centralizado entre a diagonal da L30 e a L24;
 * - linha 30 com maior inclinaÃ§Ã£o/altitude visual.
 */

const amvs = [
  { id: 'AMV-01', x: 265, y: 315, lx: 265, ly: 287 },
  { id: 'AMV-02', x: 330, y: 375, lx: 330, ly: 347 },
  { id: 'AMV-03', x: 425, y: 376, lx: 425, ly: 348 },
  { id: 'AMV-04', x: 498, y: 376, lx: 498, ly: 348 },
  { id: 'AMV-05', x: 560, y: 438, lx: 560, ly: 410 },

  { id: 'AMV-06', x: 560, y: 610, lx: 560, ly: 582 },
  { id: 'AMV-07', x: 628, y: 552, lx: 628, ly: 524 },
  { id: 'AMV-08', x: 697, y: 495, lx: 697, ly: 467 },

  { id: 'AMV-09', x: 770, y: 438, lx: 770, ly: 410 },
  { id: 'AMV-10', x: 820, y: 438, lx: 820, ly: 410 },

  { id: 'AMV-11', x: 898, y: 375, lx: 898, ly: 347 },
  { id: 'AMV-12', x: 1510, y: 436, lx: 1510, ly: 408 },
];

const markers = [
  // Superior esquerda
  // Recuado (mais para trÃ¡s / esquerda) e exatamente no meio entre L28 e L26.
  { id: 'M01', x: 205, y: 285 }, // L28 / L26

  // AvanÃ§ado em direÃ§Ã£o ao AMV-01, sem se aproximar verticalmente de nenhuma linha.
  { id: 'M02', x: 248, y: 345 }, // L26 / L24

  // Mais centralizado entre a diagonal da L30 e a L24.
  { id: 'M03', x: 375, y: 350 }, // L24 / L30

  // TravessÃ£o / meio do pÃ¡tio
  { id: 'M04', x: 475, y: 407 },
  { id: 'M05', x: 585, y: 407 },
  { id: 'M06', x: 750, y: 407 },
  { id: 'M07', x: 920, y: 407 },

  // TravessÃ£o 22 â†’ 24 inferior / regiÃ£o abaixo da L22
  { id: 'M08', x: 670, y: 466 },

  // Linhas protegidas
  { id: 'M09', x: 615, y: 523 },
  { id: 'M10', x: 540, y: 581 },

  // Inferior direita
  { id: 'M11', x: 1450, y: 407 },
];

const stopBoards = [
  // L30 elevada visualmente para aumentar o Ã¢ngulo da diagonal.
  { x: 120, y: 95, angle: -8 },

  { x: 82, y: 255, angle: 45 },
  { x: 82, y: 315, angle: 45 },
  { x: 82, y: 375, angle: 45 },
  { x: 82, y: 438, angle: 45 },
  { x: 82, y: 495, angle: 45 },
  { x: 82, y: 552, angle: 45 },
  { x: 82, y: 610, angle: 45 },

  { x: 1575, y: 105, angle: 45 },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function YardCanvas() {
  const shellRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<Point | null>(null);
  const originStart = useRef<Point | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [view, setView] = useState<ViewState>({ scale: 0.88, x: 10, y: 8 });

  const transform = useMemo(
    () => `translate(${view.x} ${view.y}) scale(${view.scale})`,
    [view],
  );

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault();

    const rect = shellRef.current?.getBoundingClientRect();
    if (!rect) return;

    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;

    const zoomFactor = event.deltaY < 0 ? 1.12 : 0.89;
    const nextScale = clamp(view.scale * zoomFactor, MIN_SCALE, MAX_SCALE);

    const worldX = (pointerX - view.x) / view.scale;
    const worldY = (pointerY - view.y) / view.scale;

    setView({
      scale: nextScale,
      x: pointerX - worldX * nextScale,
      y: pointerY - worldY * nextScale,
    });
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;

    dragStart.current = { x: event.clientX, y: event.clientY };
    originStart.current = { x: view.x, y: view.y };

    setIsPanning(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!isPanning || !dragStart.current || !originStart.current) return;

    setView((current) => ({
      ...current,
      x: originStart.current!.x + (event.clientX - dragStart.current!.x),
      y: originStart.current!.y + (event.clientY - dragStart.current!.y),
    }));
  }

  function stopPan(event: PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setIsPanning(false);
    dragStart.current = null;
    originStart.current = null;
  }

  function zoomIn() {
    setView((current) => ({
      ...current,
      scale: clamp(current.scale * 1.15, MIN_SCALE, MAX_SCALE),
    }));
  }

  function zoomOut() {
    setView((current) => ({
      ...current,
      scale: clamp(current.scale * 0.87, MIN_SCALE, MAX_SCALE),
    }));
  }

  function resetView() {
    setView({ scale: 0.88, x: 10, y: 8 });
  }

  return (
    <div
      ref={shellRef}
      className={`yard-shell${isPanning ? ' is-panning' : ''}`}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopPan}
      onPointerCancel={stopPan}
    >
      <div className="yard-toolbar">
        <button type="button" onClick={zoomIn} aria-label="Aumentar zoom">+</button>
        <button type="button" onClick={zoomOut} aria-label="Diminuir zoom">âˆ’</button>
        <button type="button" onClick={resetView} aria-label="Restaurar visualizaÃ§Ã£o">â†º</button>
      </div>

      <svg
        className="yard-svg"
        viewBox="0 0 1640 700"
        role="img"
        aria-label="RepresentaÃ§Ã£o refinada do PÃ¡tio Brisamar"
      >
        <g transform={transform}>
          {/* Nomes das linhas */}
          <text x="25" y="100" className="line-label">L30</text>
          <text x="25" y="260" className="line-label">L28</text>
          <text x="25" y="320" className="line-label">L26</text>
          <text x="25" y="380" className="line-label">L24</text>
          <text x="25" y="443" className="line-label">L22</text>
          <text x="25" y="500" className="line-label">L20</text>
          <text x="25" y="557" className="line-label">L18</text>
          <text x="25" y="615" className="line-label">L16</text>

          {/* L30 com inclinaÃ§Ã£o um pouco maior */}
          <path className="track" d="M120 95 L425 376" />

          <path className="track" d="M82 255 H200 L330 375" />
          <path className="track" d="M82 315 H265" />

          <path className="track" d="M82 375 H1455 L1510 436" />
          <path className="track" d="M82 438 H1510" />

          <path className="track" d="M82 495 H697" />
          <path className="track" d="M82 552 H628" />
          <path className="track" d="M82 610 H560" />

          {/* L24 â†’ L22 */}
          <path className="track" d="M498 376 L560 438" />

          {/* Diagonal 16 â†’ 18 â†’ 20 â†’ 22 */}
          <path className="track" d="M560 610 L628 552 L697 495 L770 438" />

          {/* ConexÃ£o 22 â†’ 24 inferior */}
          <path className="track" d="M820 438 L898 375" />

          {/* SaÃ­da direita */}
          <path className="track" d="M1510 436 C1545 360 1582 238 1575 105" />

          {/* Continuidade tÃ©cnica */}
          <path className="track technical" d="M560 610 H620" />
          <path className="track technical" d="M628 552 H688" />
          <path className="track technical" d="M697 495 H757" />

          {/* ReferÃªncias */}
          <text x="105" y="652" className="region-label">SUPERIOR DO PÃTIO</text>
          <text x="590" y="335" className="region-label">TRAVESSÃƒO</text>
          <text x="1050" y="480" className="region-label">INFERIOR DO PÃTIO</text>

          {/* Marcos */}
          {markers.map((marker) => (
            <g key={marker.id} transform={`translate(${marker.x} ${marker.y})`}>
              <path className="marker-symbol" d="M0 -8 L7 0 L0 8 L-7 0 Z" />
            </g>
          ))}

          {/* Placas PARE */}
          {stopBoards.map((board, index) => (
            <g
              key={`stop-${index}`}
              transform={`translate(${board.x} ${board.y}) rotate(${board.angle})`}
            >
              <rect className="stop-board-diamond" x="-8" y="-8" width="16" height="16" rx="1" />
            </g>
          ))}

          {/* AMVs */}
          {amvs.map((amv) => (
            <g key={amv.id}>
              <circle className="amv-point" cx={amv.x} cy={amv.y} r="7" />

              <circle className="amv-hit" cx={amv.x} cy={amv.y} r="17">
                <title>{amv.id}</title>
              </circle>

              <rect
                className="amv-label-bg"
                x={amv.lx - 23}
                y={amv.ly - 14}
                width="46"
                height="18"
                rx="4"
              />

              <text
                className="amv-label"
                x={amv.lx}
                y={amv.ly}
                textAnchor="middle"
              >
                {amv.id.replace('AMV-', '')}
              </text>
            </g>
          ))}

          <text x="1010" y="675" className="canvas-caption">
            Geometria v7 â€” ajustes finos de marcos superiores e inclinaÃ§Ã£o da L30.
          </text>
        </g>
      </svg>
    </div>
  );
}

