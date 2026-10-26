import { create } from 'zustand';
import {
  canReturnInterval,
  normalizeSwitchesOnIntervalReturn,
  toggleSwitch,
} from '../simulation/domain/switches/switchRules';
import { applySwitchOccupancyToStates } from '../simulation/domain/switch-occupancy/applySwitchOccupancy';
import type { PositionedComposition } from '../simulation/domain/collision/collisionRules';
import type { Composition } from '../simulation/domain/composition/composition';
import { isValidPosition } from '../simulation/domain/position/compositionPosition';
import {
  stepComposition,
  type MovementDirection,
  type StepCompositionResult,
} from '../simulation/domain/movement/stepComposition';
import type { IntervalState, SwitchId, SwitchState } from '../types/switch';
import { brisamarSwitchDefinitions, initialSwitchStates } from '../yard/data/brisamarSwitches';
import { brisamarSegments } from '../yard/data/brisamarTopology';
import type { LocomotiveOrientation, RollingStock } from '../rolling-stock/types/rollingStock';
import type {
  PreparationCoupling,
  SimulationMode,
  YardSectionId,
  YardSectionState,
} from '../preparation/types/preparation';
import { togglePreparationCoupling } from '../preparation/domain/preparationCouplings';
import { buildPreparedCompositions, type CompositionOrigin } from '../preparation/domain/preparedCompositions';
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

export type SimulationComposition = {
  composition: Composition;
  position: PositionedComposition['position'];
};

export type StoreMovementResult =
  | StepCompositionResult
  | {
      ok: false;
      reason: 'not-in-simulation' | 'composition-not-found' | 'position-not-found';
    };

type SimulationStore = {
  mode: SimulationMode;
  interval: IntervalState;
  switches: SwitchState[];
  yardSections: YardSectionState[];
  stationNotes: string;
  compositions: Composition[];
  compositionOrigins: CompositionOrigin[];
  preparationCouplings: PreparationCoupling[];
  toggleInitialCoupling: (
    sectionId: YardSectionId,
    leftRollingStockId: string,
    rightRollingStockId: string,
  ) => void;
  /** Infraestrutura para posições explícitas; não converte nem engata a preparação. */
  initializeCompositions: (entries: SimulationComposition[]) => void;
  moveComposition: (id: string, direction: MovementDirection) => StoreMovementResult;

  /**
   * Posições lógicas das composições no grafo.
   *
   * Fonte única de posições e da ocupação derivada dos AMVs.
   */
  positionedCompositions: PositionedComposition[];

  requestInterval: () => void;
  returnInterval: () => boolean;
  operateSwitch: (switchId: SwitchId) => void;
  setStationNotes: (notes: string) => void;
  addLocomotive: (sectionId: YardSectionId, input: AddLocomotiveInput) => void;
  addWagonBlock: (sectionId: YardSectionId, input: AddWagonBlockInput) => void;
  resetYardSection: (sectionId: YardSectionId) => void;
  startSimulation: () => void;

  /**
   * Atualiza as posições lógicas e recalcula `SwitchState.occupied`
   * imediatamente.
   */
  setPositionedCompositions: (positionedCompositions: PositionedComposition[]) => void;
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
  return sections.map((section) => (section.sectionId === sectionId ? updater(section) : section));
}

function copyPositions(entries: PositionedComposition[]): PositionedComposition[] {
  const ids = new Set<string>();
  return entries.map((entry) => {
    if (ids.has(entry.compositionId) || !isValidPosition(entry.position, brisamarSegments)) {
      throw new Error(`Posição inválida ou composição duplicada: ${entry.compositionId}`);
    }
    ids.add(entry.compositionId);
    return { compositionId: entry.compositionId, position: { ...entry.position } };
  });
}

function positionState(switches: SwitchState[], positions: PositionedComposition[]) {
  return {
    positionedCompositions: positions,
    switches: applySwitchOccupancyToStates(
      brisamarSwitchDefinitions,
      switches,
      brisamarSegments,
      positions,
    ),
  };
}

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  mode: 'preparation',
  interval: 'not-granted',
  switches: initialSwitchStates,
  yardSections: initialYardSections,
  stationNotes: '',
  compositions: [],
  compositionOrigins: [],
  preparationCouplings: [],
  positionedCompositions: [],

  toggleInitialCoupling: (sectionId, leftRollingStockId, rightRollingStockId) => {
    const current = get();
    if (current.mode !== 'preparation') return;
    const section = current.yardSections.find((item) => item.sectionId === sectionId);
    if (!section) throw new Error(`Seção inexistente: ${sectionId}`);
    set({ preparationCouplings: togglePreparationCoupling(
      section, current.preparationCouplings, leftRollingStockId, rightRollingStockId,
    ) });
  },

  initializeCompositions: (entries) => {
    const current = get();
    if (current.mode !== 'preparation') return;
    const positions = copyPositions(
      entries.map(({ composition, position }) => ({
        compositionId: composition.id,
        position,
      })),
    );
    const vehicleIds = new Set<string>();
    const occupiedSegments = new Set<string>();
    const compositions = entries.map(({ composition, position }) => {
      if (occupiedSegments.has(position.segmentId)) {
        throw new Error(`Segmento já ocupado: ${position.segmentId}`);
      }
      occupiedSegments.add(position.segmentId);
      return {
        ...composition,
        units: composition.units.map((unit) => {
          if (vehicleIds.has(unit.id)) throw new Error(`Veículo duplicado: ${unit.id}`);
          vehicleIds.add(unit.id);
          return { ...unit };
        }),
      };
    });
    set({ compositions, compositionOrigins: [], ...positionState(current.switches, positions) });
  },

  moveComposition: (id, direction) => {
    const current = get();
    if (current.mode !== 'simulation') return { ok: false, reason: 'not-in-simulation' };
    const composition = current.compositions.find((item) => item.id === id);
    if (!composition) return { ok: false, reason: 'composition-not-found' };
    const entry = current.positionedCompositions.find((item) => item.compositionId === id);
    if (!entry) return { ok: false, reason: 'position-not-found' };
    const result = stepComposition(
      composition,
      entry.position,
      direction,
      brisamarSegments,
      brisamarSwitchDefinitions,
      current.switches,
      current.interval,
      current.positionedCompositions,
    );
    if (!result.ok) return result;
    const positions = current.positionedCompositions.map((item) =>
      item.compositionId === id ? { ...item, position: { ...result.nextPosition } } : item,
    );
    set(positionState(current.switches, positions));
    return result;
  },

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
        switchState.id === switchId ? toggleSwitch(switchState, current.interval) : switchState,
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
      yardSections: updateSection(current.yardSections, sectionId, (section) =>
        appendLocomotive(section, locomotive),
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
      yardSections: updateSection(current.yardSections, sectionId, (section) =>
        appendWagonBlock(section, wagonBlock),
      ),
    });
  },

  resetYardSection: (sectionId) => {
    const current = get();

    if (current.mode !== 'preparation') {
      return;
    }

    set({
      yardSections: updateSection(current.yardSections, sectionId, resetSection),
      preparationCouplings: current.preparationCouplings.filter((item) => item.sectionId !== sectionId),
    });
  },

  startSimulation: () => {
    const current = get();
    if (current.mode !== 'preparation') {
      return;
    }
    if (current.yardSections.some((section) => section.rollingStock.length > 0)) {
      if (current.compositions.length > 0 || current.positionedCompositions.length > 0) {
        throw new Error('Cenário preparado e composições explícitas não podem ser inicializados juntos.');
      }
      const prepared = buildPreparedCompositions(current.yardSections, current.preparationCouplings);
      set({ mode: 'simulation', compositions: prepared.compositions, compositionOrigins: prepared.origins });
      return;
    }
    set({ mode: 'simulation' });
  },

  setPositionedCompositions: (positionedCompositions) => {
    const current = get();

    set(positionState(current.switches, copyPositions(positionedCompositions)));
  },
}));
