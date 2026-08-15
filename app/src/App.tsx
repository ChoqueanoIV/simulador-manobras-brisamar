import './App.css';
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
          <div className="legend">
            <span><i className="legend-dot amv" /> AMV</span>
            <span><i className="legend-dot marker" /> Marco</span>
            <span><i className="legend-stop">P</i> Placa PARE</span>
          </div>
        </div>

        <YardCanvas />
      </section>
    </main>
  );
}

export default App;
