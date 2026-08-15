import { brisamarSwitchDefinitions } from '../../../yard/data/brisamarSwitches';
import type {
  IntervalState,
  SwitchId,
  SwitchPosition,
  SwitchState,
} from '../../../types/switch';

export type SwitchLockReason =
  | 'occupied'
  | 'interval-required'
  | 'restricted-position'
  | 'fixed'
  | null;

export function getSwitchLockReason(
  switchState: SwitchState,
  intervalState: IntervalState,
): SwitchLockReason {
  if (switchState.occupied) {
    return 'occupied';
  }

  if (switchState.id === 'AMV-06') {
    return 'fixed';
  }

  const definition = brisamarSwitchDefinitions[switchState.id];

  if (definition.intervalRule === 'full-lock' && intervalState === 'not-granted') {
    return 'interval-required';
  }

  if (
    definition.intervalRule === 'restricted-position' &&
    intervalState === 'not-granted'
  ) {
    return 'restricted-position';
  }

  return null;
}

export function canOperateSwitch(
  switchState: SwitchState,
  intervalState: IntervalState,
): boolean {
  return getSwitchLockReason(switchState, intervalState) === null;
}

export function toggleSwitch(
  switchState: SwitchState,
  intervalState: IntervalState,
): SwitchState {
  if (!canOperateSwitch(switchState, intervalState)) {
    return switchState;
  }

  const nextPosition: SwitchPosition = switchState.position === 'A' ? 'B' : 'A';

  return {
    ...switchState,
    position: nextPosition,
  };
}

export function normalizeSwitchesOnIntervalReturn(
  switches: SwitchState[],
): SwitchState[] {
  return switches.map((switchState) =>
    switchState.id === 'AMV-09'
      ? { ...switchState, position: 'A' }
      : switchState,
  );
}

export function canReturnInterval(switches: SwitchState[]): boolean {
  const switch09 = switches.find((switchState) => switchState.id === 'AMV-09');
  return switch09 ? !switch09.occupied : true;
}

export function getSwitchRouteLabel(
  switchId: SwitchId,
  position: SwitchPosition,
): string {
  const definition = brisamarSwitchDefinitions[switchId];
  return position === 'A' ? definition.positionA : definition.positionB;
}

export function getLockReasonLabel(reason: SwitchLockReason): string | null {
  switch (reason) {
    case 'occupied':
      return 'Bloqueado: AMV ocupado';
    case 'interval-required':
      return 'Bloqueado: intervalo não concedido';
    case 'restricted-position':
      return 'Acesso à L20 requer intervalo';
    case 'fixed':
      return 'AMV fixo nesta simulação';
    default:
      return null;
  }
}
