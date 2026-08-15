import { create } from 'zustand';
import {
  canReturnInterval,
  normalizeSwitchesOnIntervalReturn,
  toggleSwitch,
} from '../simulation/domain/switches/switchRules';
import type { IntervalState, SwitchId, SwitchState } from '../types/switch';
import { initialSwitchStates } from '../yard/data/brisamarSwitches';
import type {
  LocomotiveOrientation,
  RollingStock,
} from '../rolling-stock/types/rollingStock';
import type {
  SimulationMode,
  YardSectionId,
  YardSectionState,
} from '../preparation/types/preparation';
import { initialYardSections } from '../preparation/data/yardSections';
import {
  appendLocomotive,
  appendWagonBlock,
  resetSection,
} from '../preparation/domain/preparationRules';

type AddLocomotiveInput = {
  number: string;
  orientation: LocomotiveOrientation;
};

type AddWagonBlockInput = {
  quantity: number;
  label: string;
  color: string;
};

type SimulationStore = {
  mode: SimulationMode;
  interval: IntervalState;
  switches: SwitchState[];
  yardSections: YardSectionState[];
  stationNotes: string;

  requestInterval: () => void;
  returnInterval: () => boolean;
  operateSwitch: (switchId: SwitchId) => void;

  setStationNotes: (notes: string) => void;
  addLocomotive: (
    sectionId: YardSectionId,
    input: AddLocomotiveInput,
  ) => void;
  addWagonBlock: (
    sectionId: YardSectionId,
    input: AddWagonBlockInput,
  ) => void;
  resetYardSection: (sectionId: YardSectionId) => void;
  startSimulation: () => void;
};

let rollingStockSequence = 0;

function nextRollingStockId(prefix: string) {
  rollingStockSequence += 1;
  return `${prefix}-${rollingStockSequence}`;
}

function updateSection(
  sections: YardSectionState[],
  sectionId: YardSectionId,
  updater: (section: YardSectionState) => YardSectionState,
) {
  return sections.map((section) =>
    section.sectionId === sectionId ? updater(section) : section,
  );
}

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  mode: 'preparation',
  interval: 'not-granted',
  switches: initialSwitchStates,
  yardSections: initialYardSections,
  stationNotes: '',

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

  setStationNotes: (notes) => {
    if (get().mode !== 'preparation') {
      return;
    }

    set({ stationNotes: notes });
  },

  addLocomotive: (sectionId, input) => {
    const current = get();

    if (current.mode !== 'preparation') {
      return;
    }

    const locomotive: RollingStock = {
      id: nextRollingStockId('loco'),
      kind: 'locomotive',
      number: input.number.trim(),
      orientation: input.orientation,
    };

    set({
      yardSections: updateSection(
        current.yardSections,
        sectionId,
        (section) => appendLocomotive(section, locomotive),
      ),
    });
  },

  addWagonBlock: (sectionId, input) => {
    const current = get();

    if (current.mode !== 'preparation') {
      return;
    }

    const wagonBlock: RollingStock = {
      id: nextRollingStockId('wagons'),
      kind: 'wagon-block',
      quantity: input.quantity,
      label: input.label.trim(),
      color: input.color,
    };

    set({
      yardSections: updateSection(
        current.yardSections,
        sectionId,
        (section) => appendWagonBlock(section, wagonBlock),
      ),
    });
  },

  resetYardSection: (sectionId) => {
    const current = get();

    if (current.mode !== 'preparation') {
      return;
    }

    set({
      yardSections: updateSection(
        current.yardSections,
        sectionId,
        resetSection,
      ),
    });
  },

  startSimulation: () => {
    if (get().mode !== 'preparation') {
      return;
    }

    set({ mode: 'simulation' });
  },
}));
