import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BestSellersPlugin from './BestSellersPlugin';
import { HomeProvider } from '../../../pages/Home/Context';
import { MemoryRouter } from 'react-router';
import React from 'react';

describe('BestSellersPlugin', () => {
  const mockBestSellers = [
    { id: 'bs1', name: 'Best Seller 1', title: 'Best Seller 1', price: 10, category: 'cat1' },
    { id: 'bs2', name: 'Best Seller 2', title: 'Best Seller 2', price: 20, category: 'cat2' }
  ] as any;

  const mockActions = {
    handleAddToCart: vi.fn(),
    navigate: vi.fn()
  } as any;

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
      <HomeProvider
        settings={{} as any}
        products={[]}
        categories={[]}
        bestSellers={mockBestSellers}
        actions={mockActions}
      >
        {children}
      </HomeProvider>
    </MemoryRouter>
  );

  it('should render best sellers from context', () => {
    render(<BestSellersPlugin />, { wrapper });
    
    expect(screen.getByText('Top Performers')).toBeInTheDocument();
    expect(screen.getByText(/Best Seller 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Best Seller 2/i)).toBeInTheDocument();
  });

  it('should call handleAddToCart when add to cart is clicked', () => {
    render(<BestSellersPlugin />, { wrapper });
    
    const addButtons = screen.getAllByRole('button', { name: /add to cart/i });
    fireEvent.click(addButtons[0]);
    
    expect(mockActions.handleAddToCart).toHaveBeenCalledWith(mockBestSellers[0]);
  });

  it('should render nothing if no best sellers are provided', () => {
    const emptyWrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter>
        <HomeProvider
          settings={{} as any}
          products={[]}
          categories={[]}
          bestSellers={[]}
          actions={mockActions}
        >
          {children}
        </HomeProvider>
      </MemoryRouter>
    );

    const { container } = render(<BestSellersPlugin />, { wrapper: emptyWrapper });
    expect(container).toBeEmptyDOMElement();
  });
});
