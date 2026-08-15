import { useSimulationStore } from '../../state/simulationStore';

export function IntervalControls() {
  const interval = useSimulationStore((state) => state.interval);
  const requestInterval = useSimulationStore((state) => state.requestInterval);
  const returnInterval = useSimulationStore((state) => state.returnInterval);

  const granted = interval === 'granted';

  function handleReturn() {
    const returned = returnInterval();

    if (!returned) {
      window.alert('Não é possível entregar o intervalo com o AMV-09 ocupado.');
    }
  }

  return (
    <div className={`interval-panel${granted ? ' is-granted' : ''}`}>
      <div>
        <span className="interval-label">Intervalo da estação</span>
        <strong>{granted ? 'Concedido' : 'Não concedido'}</strong>
      </div>

      {granted ? (
        <button type="button" onClick={handleReturn}>
          Entregar intervalo
        </button>
      ) : (
        <button type="button" onClick={requestInterval}>
          Solicitar intervalo
        </button>
      )}
    </div>
  );
}
