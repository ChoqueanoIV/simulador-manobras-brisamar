// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSimulationStore } from '../../state/simulationStore';
import { PreparationPanel } from './PreparationPanel';

beforeEach(() => {
  useSimulationStore.setState(useSimulationStore.getInitialState(), true);
  const state = useSimulationStore.getState();
  state.addWagonBlock('L22_SUPERIOR', { quantity: 5, label: 'FVR', color: '#aaa' });
  state.addLocomotive('L22_SUPERIOR', { number: '3820', orientation: 'front-barra' });
  state.addWagonBlock('L22_SUPERIOR', { quantity: 3, label: 'EPI', color: '#bbb' });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('marcação dos engates no painel real', () => {
  it('permite marcar e desmarcar cada ligação sem mudar a outra ou a capacidade', async () => {
    const user = userEvent.setup();
    render(<PreparationPanel selectedSectionId="L22_SUPERIOR" />);
    const buttons = screen.getAllByRole('button', { name: /Engate inicial entre/ });
    expect(buttons).toHaveLength(2);
    expect(buttons.every((button) => button.getAttribute('aria-pressed') === 'false')).toBe(true);
    expect(screen.getByText('9 / 22')).toBeTruthy();
    await user.click(buttons[0]);
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
    await user.click(buttons[1]);
    await user.click(buttons[0]);
    expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByText('9 / 22')).toBeTruthy();
  });

  it('confirmar início preserva as ligações e mostra resumo sem botões de edição', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<PreparationPanel selectedSectionId="L22_SUPERIOR" />);
    await user.click(screen.getAllByRole('button', { name: /Engate inicial entre/ })[0]);
    await user.click(screen.getByRole('button', { name: /Iniciar Simulação/ }));
    expect(useSimulationStore.getState().mode).toBe('simulation');
    expect(useSimulationStore.getState().preparationCouplings).toHaveLength(1);
    expect(screen.queryByRole('button', { name: /Engate inicial entre/ })).toBeNull();
    expect(screen.getByText('Composições iniciais: 2')).toBeTruthy();
    expect(screen.getByText('Engatados')).toBeTruthy();
    expect(screen.getByText('Separados')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Resetar trecho' })).toBeNull();
  });

  it('cancelar início mantém preparação e engates editáveis', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(<PreparationPanel selectedSectionId="L22_SUPERIOR" />);
    await user.click(screen.getByRole('button', { name: /Iniciar Simulação/ }));
    expect(useSimulationStore.getState().mode).toBe('preparation');
    await user.click(screen.getAllByRole('button', { name: /Engate inicial entre/ })[0]);
    expect(useSimulationStore.getState().preparationCouplings).toHaveLength(1);
  });
});
