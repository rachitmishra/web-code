import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductInfoPlugin from './ProductInfoPlugin';
import React from 'react';

describe('ProductInfoPlugin', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 99.99,
    description: 'Test Description',
    sizes: ['S', 'M', 'L'],
    colors: ['Red', 'Blue']
  };

  it('renders product details', () => {
    render(React.createElement(ProductInfoPlugin, { 
      product: mockProduct,
      quantity: 1,
      setQuantity: vi.fn(),
      onAddToCart: vi.fn()
    }));

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('calls onAddToCart when button is clicked', () => {
    const onAddToCart = vi.fn();
    render(React.createElement(ProductInfoPlugin, { 
      product: mockProduct,
      quantity: 1,
      setQuantity: vi.fn(),
      onAddToCart
    }));

    const btn = screen.getByText('Add to Cart');
    fireEvent.click(btn);
    expect(onAddToCart).toHaveBeenCalled();
  });
});
