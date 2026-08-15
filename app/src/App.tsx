import './App.css';
import { IntervalControls } from './components/controls/IntervalControls';
import { YardCanvas } from './yard/components/YardCanvas';

function App() {
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
            <p>Use a roda do mouse para zoom e arraste uma área vazia para navegar.</p>
          </div>

          <IntervalControls />
        </div>

        <YardCanvas />
      </section>
    </main>
  );
}

export default App;
