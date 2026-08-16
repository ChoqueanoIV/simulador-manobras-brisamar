import type { WagonBlock } from '../types/rollingStock';

type WagonBlockViewProps = {
  wagonBlock: WagonBlock;
  x: number;
  y: number;
  width: number;
};

export function WagonBlockView({
  wagonBlock,
  x,
  y,
  width,
}: WagonBlockViewProps) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <title>
        {`Quantidade: ${wagonBlock.quantity}\nIdentificação: ${
          wagonBlock.label || 'Sem identificação'
        }`}
      </title>

      <rect
        className="rolling-stock-wagons"
        x={0}
        y={-12}
        width={width}
        height={24}
        rx={4}
        style={{ fill: wagonBlock.color }}
      />

      <text
        className="rolling-stock-wagon-label"
        x={width / 2}
        y={4}
        textAnchor="middle"
      >
        {wagonBlock.quantity}
        {wagonBlock.label ? ` ${wagonBlock.label}` : ''}
      </text>
    </g>
  );
}
