import { useState } from 'react';
import './App.css';
import { IntervalControls } from './components/controls/IntervalControls';
import { PreparationPanel } from './preparation/components/PreparationPanel';
import type { YardSectionId } from './preparation/types/preparation';
import { useSimulationStore } from './state/simulationStore';
import { YardCanvas } from './yard/components/YardCanvas';

function App() {
  const [selectedSectionId, setSelectedSectionId] =
    useState<YardSectionId | null>(null);

  const mode = useSimulationStore((state) => state.mode);
  const isSimulation = mode === 'simulation';

  const modeLabel = isSimulation ? 'Modo simulação' : 'Modo preparação';
  const workspaceHint = isSimulation
    ? 'Use a roda do mouse para zoom e arraste uma área vazia para navegar.'
    : 'Use a roda do mouse para zoom, arraste uma área vazia para navegar e clique em um trecho para preenchê-lo.';

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <span className="eyebrow">Simulador de Manobras</span>
          <h1>Pátio Brisamar</h1>
        </div>

        <div className={`status-pill${isSimulation ? ' status-pill--simulation' : ''}`}>
          {modeLabel}
        </div>
      </header>

      <section className="notice">
        <strong>Simulador de planejamento de manobras.</strong>
        <span> Não substitui procedimentos operacionais vigentes.</span>
      </section>

      <section className="workspace">
        <div className="workspace-header">
          <div>
            <h2>Mapa do pátio</h2>
            <p>{workspaceHint}</p>
          </div>

          <IntervalControls />
        </div>

        <div className="preparation-layout">
          <YardCanvas
            selectedSectionId={selectedSectionId}
            onSelectSection={setSelectedSectionId}
          />

          <PreparationPanel selectedSectionId={selectedSectionId} />
        </div>
      </section>
    </main>
  );
}

export default App;
