import type { RollingStock } from '../../rolling-stock/types/rollingStock';
import { useSimulationStore } from '../../state/simulationStore';
import { hasPreparationCoupling } from '../domain/preparationCouplings';
import type { YardSectionState } from '../types/preparation';

function stockLabel(item: RollingStock): string {
  return item.kind === 'locomotive'
    ? `Locomotiva ${item.number}`
    : `${item.quantity} ${item.label || 'vagões'}`;
}

export function PreparationCouplings({
  section,
  readOnly = false,
}: {
  section: YardSectionState;
  readOnly?: boolean;
}) {
  const couplings = useSimulationStore((state) => state.preparationCouplings);
  const toggle = useSimulationStore((state) => state.toggleInitialCoupling);
  if (section.rollingStock.length < 2) return null;

  return (
    <div className="preparation-couplings">
      {!readOnly && (
        <>
          <h4>Engates iniciais</h4>
          <p>Marque quais materiais vizinhos já estão engatados na passagem de serviço.</p>
        </>
      )}
      <ul>
        {section.rollingStock.slice(0, -1).map((left, index) => {
          const right = section.rollingStock[index + 1];
          const coupled = hasPreparationCoupling(couplings, section.sectionId, left.id, right.id);
          const pairLabel = `${index + 1}. ${stockLabel(left)} ↔ ${index + 2}. ${stockLabel(right)}`;
          return (
            <li key={left.id}>
              <span>{pairLabel}</span>
              {readOnly ? (
                <strong>{coupled ? 'Engatados' : 'Separados'}</strong>
              ) : (
                <button
                  type="button"
                  aria-pressed={coupled}
                  aria-label={`Engate inicial entre ${pairLabel}`}
                  onClick={() => toggle(section.sectionId, left.id, right.id)}
                >
                  {coupled ? 'Engatados — desmarcar' : 'Separados — marcar engate'}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
