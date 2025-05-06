import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CategoriesProvider, useCategories } from '..';
import { Category } from '../../../components/categories/interface-category';
import { AsteriskIcon } from '../../../components/ui/icons/AsteriskIcon';

// Mock para useFetchAll
import { useFetchAll } from '../../../hooks/useFetchAll';
vi.mock('../../../hooks/useFetchAll');

// Convertir a tipo explícito de mock
const mockUseFetchAll = useFetchAll as unknown as ReturnType<typeof vi.fn>;

const mockCategories: Category[] = [
  { id: 1, name: 'Groceries', type: 'expense', color: 'green', icon: AsteriskIcon },
  { id: 2, name: 'Entertainment', type: 'expense', color: 'blue', icon: AsteriskIcon },
];

// Test component que usa el hook useCategories
const TestComponent = () => {
  const { categories, loading, error } = useCategories();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {categories.length === 0 ? (
        <div>No categories available</div>
      ) : (
        categories.map((category) => <div key={category.id}>{category.name}</div>)
      )}
    </div>
  );
};

describe('CategoriesContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe mostrar "Loading..." cuando está cargando', () => {
    mockUseFetchAll.mockReturnValue({
      data: { data: [] },
      loading: true,
      error: null,
    });

    render(
      <CategoriesProvider>
        <TestComponent />
      </CategoriesProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('debe mostrar las categorías cuando se cargan correctamente', async () => {
    mockUseFetchAll.mockReturnValue({
      data: { data: mockCategories },
      loading: false,
      error: null,
    });

    render(
      <CategoriesProvider>
        <TestComponent />
      </CategoriesProvider>
    );

    await waitFor(() => expect(screen.getByText('Groceries')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Entertainment')).toBeInTheDocument());
  });

  it('debe mostrar mensaje de error cuando ocurre un error', async () => {
    mockUseFetchAll.mockReturnValue({
      data: { data: [] },
      loading: false,
      error: new Error('Something went wrong'),
    });

    render(
      <CategoriesProvider>
        <TestComponent />
      </CategoriesProvider>
    );

    expect(screen.getByText('Error: Something went wrong')).toBeInTheDocument();
  });

  it('debe mostrar mensaje cuando no hay categorías disponibles', async () => {
    mockUseFetchAll.mockReturnValue({
      data: { data: [] },
      loading: false,
      error: null,
    });

    render(
      <CategoriesProvider>
        <TestComponent />
      </CategoriesProvider>
    );

    expect(screen.getByText('No categories available')).toBeInTheDocument();
  });
});