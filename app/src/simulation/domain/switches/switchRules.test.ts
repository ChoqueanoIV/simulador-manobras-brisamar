import { describe, expect, it } from 'vitest';
import type { SwitchState } from '../../../types/switch';
import {
  canOperateSwitch,
  canReturnInterval,
  getSwitchRouteLabel,
  normalizeSwitchesOnIntervalReturn,
  toggleSwitch,
} from './switchRules';

function makeSwitch(
  id: SwitchState['id'],
  position: SwitchState['position'] = 'A',
  occupied = false,
): SwitchState {
  return { id, position, occupied };
}

describe('switch rules', () => {
  it('mantém AMV-06 fixo', () => {
    expect(canOperateSwitch(makeSwitch('AMV-06'), 'granted')).toBe(false);
  });

  it('bloqueia AMV-07 sem intervalo', () => {
    expect(canOperateSwitch(makeSwitch('AMV-07'), 'not-granted')).toBe(false);
  });

  it('libera AMV-07 com intervalo', () => {
    expect(canOperateSwitch(makeSwitch('AMV-07'), 'granted')).toBe(true);
  });

  it('bloqueia AMV-08 sem intervalo', () => {
    expect(canOperateSwitch(makeSwitch('AMV-08'), 'not-granted')).toBe(false);
  });

  it('libera AMV-08 com intervalo', () => {
    expect(canOperateSwitch(makeSwitch('AMV-08'), 'granted')).toBe(true);
  });

  it('AMV-08 escolhe L20 ou L18', () => {
    expect(getSwitchRouteLabel('AMV-08', 'A')).toBe('AMV-09 ↔ L20');
    expect(getSwitchRouteLabel('AMV-08', 'B')).toBe('AMV-09 ↔ L18');
  });

  it('AMV-07 escolhe L18 ou L16', () => {
    expect(getSwitchRouteLabel('AMV-07', 'A')).toBe('AMV-08 ↔ L18');
    expect(getSwitchRouteLabel('AMV-07', 'B')).toBe('AMV-08 ↔ L16');
  });

  it('AMV-12 opera somente L22 reta ou L22-L24 superior', () => {
    expect(getSwitchRouteLabel('AMV-12', 'A')).toBe('L22 reta');
    expect(getSwitchRouteLabel('AMV-12', 'B')).toBe('L22 ↔ L24 superior');
  });

  it('bloqueia AMV ocupado mesmo com intervalo', () => {
    expect(canOperateSwitch(makeSwitch('AMV-07', 'A', true), 'granted')).toBe(false);
  });

  it('bloqueia mudança do AMV-09 sem intervalo', () => {
    const current = makeSwitch('AMV-09', 'A');
    expect(toggleSwitch(current, 'not-granted')).toEqual(current);
  });

  it('permite mudança do AMV-09 com intervalo', () => {
    expect(toggleSwitch(makeSwitch('AMV-09', 'A'), 'granted').position).toBe('B');
  });

  it('retorna AMV-09 para A ao entregar intervalo', () => {
    const switches = [makeSwitch('AMV-09', 'B'), makeSwitch('AMV-10', 'B')];
    const normalized = normalizeSwitchesOnIntervalReturn(switches);

    expect(normalized.find((item) => item.id === 'AMV-09')?.position).toBe('A');
    expect(normalized.find((item) => item.id === 'AMV-10')?.position).toBe('B');
  });

  it('bloqueia entrega de intervalo se AMV-09 estiver ocupado', () => {
    expect(canReturnInterval([makeSwitch('AMV-09', 'A', true)])).toBe(false);
  });

  it('permite operar AMV comum sem intervalo', () => {
    expect(canOperateSwitch(makeSwitch('AMV-10'), 'not-granted')).toBe(true);
  });
});
