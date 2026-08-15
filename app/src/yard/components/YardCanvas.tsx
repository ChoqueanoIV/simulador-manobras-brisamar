import { useMemo, useRef, useState, type PointerEvent, type WheelEvent } from 'react';
import { useSimulationStore } from '../../state/simulationStore';
import type { SwitchId, SwitchPosition } from '../../types/switch';
import { SwitchView } from './SwitchView';

type Point = { x: number; y: number };
type ViewState = { scale: number; x: number; y: number };

const MIN_SCALE = 0.65;
const MAX_SCALE = 3;

const amvs: Array<{
  id: SwitchId;
  x: number;
  y: number;
  lx: number;
  ly: number;
}> = [
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
  { id: 'M01', x: 205, y: 285 },
  { id: 'M02', x: 248, y: 345 },
  { id: 'M03', x: 375, y: 350 },
  { id: 'M04', x: 475, y: 407 },
  { id: 'M05', x: 585, y: 407 },
  { id: 'M06', x: 750, y: 407 },
  { id: 'M07', x: 920, y: 407 },
  { id: 'M08', x: 670, y: 466 },
  { id: 'M09', x: 615, y: 523 },
  { id: 'M10', x: 540, y: 581 },
  { id: 'M11', x: 1450, y: 407 },
];

const stopBoards = [
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

const switchRoutePaths: Record<SwitchId, Record<SwitchPosition, string>> = {
  'AMV-01': {
    A: 'M286 334 L265 315 H235',
    B: 'M286 334 L265 315 L240 292',
  },
  'AMV-02': {
    A: 'M300 375 H360',
    B: 'M360 375 H330 L305 352',
  },
  'AMV-03': {
    A: 'M395 376 H455',
    B: 'M455 376 H425 L399 352',
  },
  'AMV-04': {
    A: 'M468 376 H528',
    B: 'M468 376 H498 L522 400',
  },
  'AMV-05': {
    A: 'M530 438 H590',
    B: 'M590 438 H560 L536 414',
  },
  'AMV-06': {
    A: 'M592 583 L560 610 H525',
    B: 'M592 583 L560 610 H525',
  },
  'AMV-07': {
    A: 'M660 525 L628 552 H593',
    B: 'M660 525 L628 552 L596 579',
  },
  'AMV-08': {
    A: 'M730 469 L697 495 H662',
    B: 'M730 469 L697 495 L665 522',
  },
  'AMV-09': {
    A: 'M740 438 H800',
    B: 'M800 438 H770 L745 458',
  },
  'AMV-10': {
    A: 'M790 438 H850',
    B: 'M790 438 H820 L845 418',
  },
  'AMV-11': {
    A: 'M868 375 H928',
    B: 'M928 375 H898 L873 395',
  },

  // O AMV-12 é especial:
  // a alça de curva é sempre parte da rota ativa.
  // A outra ponta alterna entre L22 e L24 superior.
  //
  // A = alça de curva + L22
  // B = alça de curva + L24 superior
  'AMV-12': {
    A: 'M1540 352 C1533 383 1522 412 1510 436 M1510 436 H1470',
    B: 'M1540 352 C1533 383 1522 412 1510 436 M1510 436 L1486 410',
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function YardCanvas() {
  const shellRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<Point | null>(null);
  const originStart = useRef<Point | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [view, setView] = useState<ViewState>({ scale: 0.88, x: 10, y: 8 });

  const switches = useSimulationStore((state) => state.switches);

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
        <button type="button" onClick={zoomOut} aria-label="Diminuir zoom">−</button>
        <button type="button" onClick={resetView} aria-label="Restaurar visualização">↺</button>
      </div>

      <svg className="yard-svg" viewBox="0 0 1640 700" role="img" aria-label="Pátio Brisamar">
        <g transform={transform}>
          <text x="25" y="100" className="line-label">L30</text>
          <text x="25" y="260" className="line-label">L28</text>
          <text x="25" y="320" className="line-label">L26</text>
          <text x="25" y="380" className="line-label">L24</text>
          <text x="25" y="443" className="line-label">L22</text>
          <text x="25" y="500" className="line-label">L20</text>
          <text x="25" y="557" className="line-label">L18</text>
          <text x="25" y="615" className="line-label">L16</text>

          <path className="track" d="M120 95 L425 376" />
          <path className="track" d="M82 255 H200 L330 375" />
          <path className="track" d="M82 315 H265" />
          <path className="track" d="M82 375 H1455 L1510 436" />
          <path className="track" d="M82 438 H1510" />
          <path className="track" d="M82 495 H697" />
          <path className="track" d="M82 552 H628" />
          <path className="track" d="M82 610 H560" />
          <path className="track" d="M498 376 L560 438" />
          <path className="track" d="M560 610 L628 552 L697 495 L770 438" />
          <path className="track" d="M820 438 L898 375" />
          <path className="track" d="M1510 436 C1545 360 1582 238 1575 105" />

          <path className="track technical" d="M560 610 H620" />
          <path className="track technical" d="M628 552 H688" />
          <path className="track technical" d="M697 495 H757" />

          <g className="active-switch-routes">
            {switches.map((switchState) => (
              <path
                key={switchState.id}
                className={`active-switch-route ${
                  switchState.id === 'AMV-12'
                    ? 'amv12-route'
                    : `position-${switchState.position.toLowerCase()}`
                }`}
                d={switchRoutePaths[switchState.id][switchState.position]}
              />
            ))}
          </g>

          <text x="105" y="652" className="region-label">SUPERIOR DO PÁTIO</text>
          <text x="590" y="335" className="region-label">TRAVESSÃO</text>
          <text x="1050" y="480" className="region-label">INFERIOR DO PÁTIO</text>

          {markers.map((marker) => (
            <g key={marker.id} transform={`translate(${marker.x} ${marker.y})`}>
              <path className="marker-symbol" d="M0 -8 L7 0 L0 8 L-7 0 Z" />
            </g>
          ))}

          {stopBoards.map((board, index) => (
            <g
              key={`stop-${index}`}
              transform={`translate(${board.x} ${board.y}) rotate(${board.angle})`}
            >
              <rect className="stop-board-diamond" x="-8" y="-8" width="16" height="16" rx="1" />
            </g>
          ))}

          {amvs.map((amv) => (
            <SwitchView
              key={amv.id}
              id={amv.id}
              x={amv.x}
              y={amv.y}
              labelX={amv.lx}
              labelY={amv.ly}
            />
          ))}

          <text x="880" y="675" className="canvas-caption">
            AMV-12: alça sempre ativa + seleção exclusiva L22 ou L24 superior.
          </text>
        </g>
      </svg>
    </div>
  );
}
