import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AccountSelector } from '..';
import { MemoryRouter } from 'react-router-dom';

// Importar y tipar el mock manualmente
import useFetchAllAccounts from '../../../../hooks/useFetchAllAccounts';

// Mocks
vi.mock('../../../../hooks/useFetchAllAccounts');
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => vi.fn(),
}));

// Convertir a tipo explícito de mock
const mockUseFetchAllAccounts = useFetchAllAccounts as unknown as ReturnType<typeof vi.fn>;

const mockAccounts = [
  { id: 1, name: 'Cuenta Principal' },
  { id: 2, name: 'Cuenta Ahorros' },
];

describe('AccountSelector', () => {
  const mockOnAccountChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe mostrar "Choose an account" cuando no hay cuenta seleccionada', () => {
    mockUseFetchAllAccounts.mockReturnValue({
      accounts: mockAccounts,
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <AccountSelector 
          selectedAccountId={null} 
          onAccountChange={mockOnAccountChange} 
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Choose an account')).toBeInTheDocument();
  });

  it('debe mostrar el nombre de la cuenta cuando hay una seleccionada', () => {
    mockUseFetchAllAccounts.mockReturnValue({
      accounts: mockAccounts,
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <AccountSelector 
          selectedAccountId={1} 
          onAccountChange={mockOnAccountChange} 
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Cuenta Principal')).toBeInTheDocument();
  });

  it('debe abrir el dropdown al hacer click', async () => {
    mockUseFetchAllAccounts.mockReturnValue({
      accounts: mockAccounts,
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <AccountSelector 
          selectedAccountId={null} 
          onAccountChange={mockOnAccountChange} 
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText('Cuenta Principal')).toBeInTheDocument();
      expect(screen.getByText('Cuenta Ahorros')).toBeInTheDocument();
    });
  });

  it('debe cerrar el dropdown al hacer click fuera (mousedown en document)', async () => {
    mockUseFetchAllAccounts.mockReturnValue({
      accounts: mockAccounts,
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <AccountSelector 
          selectedAccountId={null} 
          onAccountChange={mockOnAccountChange} 
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Choose an account'));
    expect(screen.getByText('Cuenta Principal')).toBeInTheDocument();

    fireEvent.mouseDown(document);

    await waitFor(() => {
      expect(screen.queryByText('Cuenta Principal')).not.toBeInTheDocument();
    });
  });

  it('debe llamar onAccountChange al seleccionar una cuenta', async () => {
    mockUseFetchAllAccounts.mockReturnValue({
      accounts: mockAccounts,
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <AccountSelector 
          selectedAccountId={null} 
          onAccountChange={mockOnAccountChange} 
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Cuenta Ahorros'));

    expect(mockOnAccountChange).toHaveBeenCalledWith(2);
  });

  it('debe mostrar mensaje de loading', () => {
    mockUseFetchAllAccounts.mockReturnValue({
      accounts: [],
      loading: true,
      error: null,
    });

    render(
      <MemoryRouter>
        <AccountSelector 
          selectedAccountId={null} 
          onAccountChange={mockOnAccountChange} 
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Loading accounts...')).toBeInTheDocument();
  });

  it('debe mostrar mensaje de error', () => {
    mockUseFetchAllAccounts.mockReturnValue({
      accounts: [],
      loading: false,
      error: 'Error de conexión',
    });

    render(
      <MemoryRouter>
        <AccountSelector 
          selectedAccountId={null} 
          onAccountChange={mockOnAccountChange} 
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Error loading accounts.')).toBeInTheDocument();
  });

  it('debe mostrar opción para crear cuenta cuando no hay cuentas', () => {
    mockUseFetchAllAccounts.mockReturnValue({
      accounts: [],
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <AccountSelector 
          selectedAccountId={null} 
          onAccountChange={mockOnAccountChange} 
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('No accounts found.')).toBeInTheDocument();
    expect(screen.getByText('Create a new account')).toBeInTheDocument();
  });
});
