import type { Locomotive } from '../types/rollingStock';

type LocomotiveViewProps = {
  locomotive: Locomotive;
  x: number;
  y: number;
  width?: number;
  scale?: number;
};

export function LocomotiveView({
  locomotive,
  x,
  y,
  width = 42,
  scale = 1,
}: LocomotiveViewProps) {
  const frontBarra = locomotive.orientation === 'front-barra';
  const effectiveWidth = Math.max(width, 38);
  const height = 18;

  /*
   * O corpo gira conforme a orientação, mas o número NÃO é espelhado.
   * Frente barra = nariz voltado para o superior do pátio (esquerda do quadro).
   */
  const bodyTransform = frontBarra
    ? `translate(${effectiveWidth} 0) scale(-1 1)`
    : undefined;

  return (
    <g
      className="locomotive-view"
      transform={`translate(${x} ${y}) scale(${scale})`}
    >
      <title>
        {`Locomotiva ${locomotive.number}\n${
          frontBarra ? 'Frente barra' : 'Ré barra'
        }`}
      </title>

      <g transform={bodyTransform}>
        {/* engates */}
        <line
          className="locomotive-coupler"
          x1="-5"
          y1="0"
          x2="1"
          y2="0"
        />
        <line
          className="locomotive-coupler"
          x1={effectiveWidth - 1}
          y1="0"
          x2={effectiveWidth + 5}
          y2="0"
        />

        {/* corpo visto de cima */}
        <rect
          className="locomotive-body"
          x="6"
          y={-height / 2}
          width={effectiveWidth - 12}
          height={height}
          rx="3"
        />

        {/* cabine */}
        <rect
          className="locomotive-cab"
          x={effectiveWidth - 18}
          y="-7"
          width="10"
          height="14"
          rx="2"
        />

        {/* janela superior */}
        <rect
          className="locomotive-window"
          x={effectiveWidth - 16}
          y="-5"
          width="6"
          height="4"
          rx="1"
        />

        {/* frente / nariz */}
        <path
          className="locomotive-nose"
          d="M6 -9 L0 -5 V5 L6 9 Z"
        />

        {/* farol */}
        <circle
          className="locomotive-headlight"
          cx="2.8"
          cy="0"
          r="1.4"
        />

        {/* truques / rodas simplificadas */}
        <rect
          className="locomotive-bogie"
          x="10"
          y="8"
          width="10"
          height="3"
          rx="1.5"
        />
        <rect
          className="locomotive-bogie"
          x={effectiveWidth - 20}
          y="8"
          width="10"
          height="3"
          rx="1.5"
        />
      </g>

      {/* identificação sempre legível, nunca espelhada */}
      <rect
        className="locomotive-number-plate"
        x={effectiveWidth / 2 - 15}
        y="-24"
        width="30"
        height="11"
        rx="3"
      />
      <text
        className="locomotive-number-text"
        x={effectiveWidth / 2}
        y="-16"
        textAnchor="middle"
      >
        {locomotive.number}
      </text>
    </g>
  );
}
