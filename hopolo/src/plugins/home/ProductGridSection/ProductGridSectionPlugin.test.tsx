import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductGridSectionPlugin from './ProductGridSectionPlugin';
import { HomeProvider } from '../../../pages/Home/Context';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

describe('ProductGridSectionPlugin', () => {
  const mockProducts = [
    { id: '1', name: 'Product 1', title: 'Product 1', price: 10, category: 'cat1' },
    { id: '2', name: 'Product 2', title: 'Product 2', price: 20, category: 'cat2' }
  ] as any;

  const mockCategories = [
    { id: 'all', name: 'All' },
    { id: 'cat1', name: 'Category 1' }
  ] as any;

  const mockActions = {
    handleAddToCart: vi.fn(),
    handleCategoryChange: vi.fn(),
    navigate: vi.fn()
  } as any;

  const mockState = {
    activeCategoryId: 'all',
    isGridChanging: false
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
      <HomeProvider
        settings={{} as any}
        products={mockProducts}
        categories={mockCategories}
        bestSellers={[]}
        actions={mockActions}
        state={mockState}
      >
        {children}
      </HomeProvider>
    </MemoryRouter>
  );

  it('should render categories and products', () => {
    render(<ProductGridSectionPlugin />, { wrapper });
    
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText(/Product 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Product 2/i)).toBeInTheDocument();
  });

  it('should call handleCategoryChange when a category is clicked', () => {
    render(<ProductGridSectionPlugin />, { wrapper });
    
    fireEvent.click(screen.getByText('Category 1'));
    expect(mockActions.handleCategoryChange).toHaveBeenCalledWith('cat1');
  });

  it('should filter products based on activeCategoryId', () => {
    const filteredState = { ...mockState, activeCategoryId: 'cat1' };
    const filteredWrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter>
        <HomeProvider
          settings={{} as any}
          products={mockProducts}
          categories={mockCategories}
          bestSellers={[]}
          actions={mockActions}
          state={filteredState}
        >
          {children}
        </HomeProvider>
      </MemoryRouter>
    );

    render(<ProductGridSectionPlugin />, { wrapper: filteredWrapper });
    
    expect(screen.getByText(/Product 1/i)).toBeInTheDocument();
    expect(screen.queryByText(/Product 2/i)).not.toBeInTheDocument();
  });
});
