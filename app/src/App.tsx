import { useState } from 'react';
import './App.css';
import { IntervalControls } from './components/controls/IntervalControls';
import { PreparationPanel } from './preparation/components/PreparationPanel';
import type { YardSectionId } from './preparation/types/preparation';
import { YardCanvas } from './yard/components/YardCanvas';

function App() {
  const [selectedSectionId, setSelectedSectionId] =
    useState<YardSectionId | null>(null);

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <span className="eyebrow">Simulador de Manobras</span>
          <h1>Pátio Brisamar</h1>
        </div>

        <div className="status-pill">Modo preparação</div>
      </header>

      <section className="notice">
        <strong>Simulador de planejamento de manobras.</strong>
        <span> Não substitui procedimentos operacionais vigentes.</span>
      </section>

      <section className="workspace">
        <div className="workspace-header">
          <div>
            <h2>Mapa do pátio</h2>
            <p>
              Use a roda do mouse para zoom, arraste uma área vazia para navegar
              e clique em um trecho para preenchê-lo.
            </p>
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
