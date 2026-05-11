import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RelatedProductsPlugin from './RelatedProductsPlugin';
import React from 'react';
import { MemoryRouter } from 'react-router';

describe('RelatedProductsPlugin', () => {
  const mockProducts = [
    { id: '1', name: 'Product 1', price: 10, image: '' },
    { id: '2', name: 'Product 2', price: 20, image: '' }
  ];

  it('renders related products', () => {
    render(
      React.createElement(MemoryRouter, null, 
        React.createElement(RelatedProductsPlugin, { 
          relatedProducts: mockProducts,
          onProductClick: vi.fn(),
          onAddToCart: vi.fn()
        })
      )
    );

    expect(screen.getByText('Related Products')).toBeInTheDocument();
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });
});
