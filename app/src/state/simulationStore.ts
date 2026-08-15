import { create } from 'zustand';
import {
  canReturnInterval,
  normalizeSwitchesOnIntervalReturn,
  toggleSwitch,
} from '../simulation/domain/switches/switchRules';
import type { IntervalState, SwitchId, SwitchState } from '../types/switch';
import { initialSwitchStates } from '../yard/data/brisamarSwitches';

type SimulationStore = {
  interval: IntervalState;
  switches: SwitchState[];
  requestInterval: () => void;
  returnInterval: () => boolean;
  operateSwitch: (switchId: SwitchId) => void;
};

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  interval: 'not-granted',
  switches: initialSwitchStates,

  requestInterval: () => {
    set({ interval: 'granted' });
  },

  returnInterval: () => {
    const current = get();

    if (!canReturnInterval(current.switches)) {
      return false;
    }

    set({
      interval: 'not-granted',
      switches: normalizeSwitchesOnIntervalReturn(current.switches),
    });

    return true;
  },

  operateSwitch: (switchId) => {
    const current = get();

    set({
      switches: current.switches.map((switchState) =>
        switchState.id === switchId
          ? toggleSwitch(switchState, current.interval)
          : switchState,
      ),
    });
  },
}));
