import {
  getLockReasonLabel,
  getSwitchLockReason,
  getSwitchRouteLabel,
} from '../../simulation/domain/switches/switchRules';
import { useSimulationStore } from '../../state/simulationStore';
import type { SwitchId } from '../../types/switch';

type SwitchViewProps = {
  id: SwitchId;
  x: number;
  y: number;
  labelX: number;
  labelY: number;
};

export function SwitchView({
  id,
  x,
  y,
  labelX,
  labelY,
}: SwitchViewProps) {
  const interval = useSimulationStore((state) => state.interval);
  const switchState = useSimulationStore((state) =>
    state.switches.find((item) => item.id === id),
  );
  const operateSwitch = useSimulationStore((state) => state.operateSwitch);

  if (!switchState) {
    return null;
  }

  const lockReason = getSwitchLockReason(switchState, interval);
  const fixed = lockReason === 'fixed';
  const blocked = lockReason !== null;
  const showLock = blocked && !fixed;
  const routeLabel = getSwitchRouteLabel(id, switchState.position);
  const lockLabel = fixed ? 'Rota fixa' : getLockReasonLabel(lockReason);

  const tooltip = [
    id,
    fixed ? 'Rota fixa' : `Posição ${switchState.position}`,
    routeLabel,
    lockLabel,
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <g
      className={`switch-view position-${switchState.position.toLowerCase()}${
        showLock ? ' is-locked' : ''
      }${fixed ? ' is-fixed' : ''}`}
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
      onClick={(event) => {
        event.stopPropagation();

        if (!blocked) {
          operateSwitch(id);
        }
      }}
      role="button"
      aria-label={`${id}. ${fixed ? 'Rota fixa' : `Posição ${switchState.position}`}. ${routeLabel}${
        lockLabel ? `. ${lockLabel}` : ''
      }`}
    >
      <title>{tooltip}</title>

      <circle className="amv-point" cx={x} cy={y} r="7" />
      <circle className="amv-position-ring" cx={x} cy={y} r="12" />
      <circle className="amv-hit" cx={x} cy={y} r="19" />

      <rect
        className="amv-label-bg"
        x={labelX - 26}
        y={labelY - 15}
        width="52"
        height="20"
        rx="5"
      />
      <text className="amv-label" x={labelX} y={labelY} textAnchor="middle">
        {fixed
          ? `${id.replace('AMV-', '')} · FIXO`
          : `${id.replace('AMV-', '')} · ${switchState.position}`}
      </text>

      {showLock && (
        <g transform={`translate(${labelX + 32} ${labelY - 7})`}>
          <rect className="switch-lock-body" x="-6" y="0" width="12" height="9" rx="2" />
          <path className="switch-lock-shackle" d="M-4 0 V-4 A4 4 0 0 1 4 -4 V0" />
        </g>
      )}
    </g>
  );
}
