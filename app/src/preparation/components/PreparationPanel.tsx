import { useMemo, useState } from 'react';
import {
  getSectionOccupiedUnits,
  isCapacityExceeded,
  validateLocomotiveNumber,
  validateWagonQuantity,
} from '../domain/preparationRules';
import { yardSectionDefinitions } from '../data/yardSections';
import type { YardSectionId } from '../types/preparation';
import { useSimulationStore } from '../../state/simulationStore';
import type { LocomotiveOrientation } from '../../rolling-stock/types/rollingStock';

type PreparationPanelProps = {
  selectedSectionId: YardSectionId | null;
};

export function PreparationPanel({
  selectedSectionId,
}: PreparationPanelProps) {
  const mode = useSimulationStore((state) => state.mode);
  const yardSections = useSimulationStore((state) => state.yardSections);
  const addLocomotive = useSimulationStore((state) => state.addLocomotive);
  const addWagonBlock = useSimulationStore((state) => state.addWagonBlock);
  const resetYardSection = useSimulationStore((state) => state.resetYardSection);

  const [locomotiveNumber, setLocomotiveNumber] = useState('');
  const [orientation, setOrientation] =
    useState<LocomotiveOrientation>('front-barra');
  const [wagonQuantity, setWagonQuantity] = useState('1');
  const [wagonLabel, setWagonLabel] = useState('');
  const [wagonColor, setWagonColor] = useState('#d9a441');
  const [message, setMessage] = useState('');

  const section = useMemo(
    () =>
      selectedSectionId
        ? yardSections.find((item) => item.sectionId === selectedSectionId)
        : undefined,
    [selectedSectionId, yardSections],
  );

  if (mode !== 'preparation') {
    return (
      <aside className="preparation-panel">
        <h3>Simulação iniciada</h3>
        <p>O preenchimento direto do pátio está encerrado.</p>
      </aside>
    );
  }

  if (!selectedSectionId || !section) {
    return (
      <aside className="preparation-panel">
        <h3>Modo preparação</h3>
        <p>Clique em um trecho válido do pátio para começar o preenchimento.</p>
      </aside>
    );
  }

  const activeSectionId = selectedSectionId;
  const activeSection = section;
  const definition = yardSectionDefinitions[activeSectionId];
  const occupiedUnits = getSectionOccupiedUnits(activeSection);
  const exceeded = isCapacityExceeded(
    activeSection,
    definition.capacityReference,
  );

  function handleAddLocomotive() {
    const validation = validateLocomotiveNumber(locomotiveNumber);

    if (!validation.valid) {
      setMessage(validation.message);
      return;
    }

    addLocomotive(activeSectionId, {
      number: locomotiveNumber,
      orientation,
    });

    setLocomotiveNumber('');
    setMessage('Locomotiva adicionada.');
  }

  function handleAddWagons() {
    const quantity = Number(wagonQuantity);
    const validation = validateWagonQuantity(quantity);

    if (!validation.valid) {
      setMessage(validation.message);
      return;
    }

    addWagonBlock(activeSectionId, {
      quantity,
      label: wagonLabel,
      color: wagonColor,
    });

    setWagonQuantity('1');
    setWagonLabel('');
    setMessage('Bloco de vagões adicionado.');
  }

  function handleReset() {
    if (!activeSection.rollingStock.length) {
      return;
    }

    const confirmed = window.confirm(
      `Deseja limpar todo o conteúdo de ${definition.label}?`,
    );

    if (!confirmed) {
      return;
    }

    resetYardSection(activeSectionId);
    setMessage('Trecho limpo.');
  }

  return (
    <aside className="preparation-panel">
      <div className="preparation-panel-heading">
        <div>
          <span className="preparation-kicker">Trecho selecionado</span>
          <h3>{definition.label}</h3>
        </div>

        {definition.capacityReference ? (
          <div className={`capacity-badge${exceeded ? ' is-warning' : ''}`}>
            {occupiedUnits}
            {' / '}
            {definition.capacityReference}
            {exceeded ? ' ⚠' : ''}
          </div>
        ) : null}
      </div>

      <div className="preparation-form">
        <h4>Adicionar locomotiva</h4>

        <label>
          Número
          <input
            value={locomotiveNumber}
            onChange={(event) => setLocomotiveNumber(event.target.value)}
            placeholder="Ex.: 3820"
          />
        </label>

        <label>
          Orientação
          <select
            value={orientation}
            onChange={(event) =>
              setOrientation(event.target.value as LocomotiveOrientation)
            }
          >
            <option value="front-barra">Frente barra</option>
            <option value="rear-barra">Ré barra</option>
          </select>
        </label>

        <button type="button" onClick={handleAddLocomotive}>
          Adicionar locomotiva
        </button>
      </div>

      <div className="preparation-form">
        <h4>Adicionar vagão/vagões</h4>

        <label>
          Quantidade
          <input
            type="number"
            min="1"
            step="1"
            value={wagonQuantity}
            onChange={(event) => setWagonQuantity(event.target.value)}
          />
        </label>

        <label>
          Identificação
          <input
            value={wagonLabel}
            onChange={(event) => setWagonLabel(event.target.value)}
            placeholder="Ex.: FVR, EPI, Bobina"
          />
        </label>

        <label>
          Cor
          <input
            type="color"
            value={wagonColor}
            onChange={(event) => setWagonColor(event.target.value)}
          />
        </label>

        <button type="button" onClick={handleAddWagons}>
          Adicionar vagões
        </button>
      </div>

      {message ? <p className="preparation-message">{message}</p> : null}

      <div className="preparation-stock-summary">
        <h4>Conteúdo do trecho</h4>

        {activeSection.rollingStock.length ? (
          <ol>
            {activeSection.rollingStock.map((item) => (
              <li key={item.id}>
                {item.kind === 'locomotive'
                  ? `Locomotiva ${item.number}`
                  : `${item.quantity} ${item.label || 'vagões'}`}
              </li>
            ))}
          </ol>
        ) : (
          <p>Trecho vazio.</p>
        )}
      </div>

      {activeSection.rollingStock.length ? (
        <button
          className="preparation-reset-button"
          type="button"
          onClick={handleReset}
        >
          Resetar trecho
        </button>
      ) : null}
    </aside>
  );
}
