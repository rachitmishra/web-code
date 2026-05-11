import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from './pages/Home/Home';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import * as cartService from './services/cartService';

// Mock the cart service
vi.mock('./services/cartService', () => ({
  subscribeToCart: vi.fn((cb) => {
    cb([]);
    return vi.fn();
  }),
  addToCart: vi.fn(),
}));

// Mock useLoaderData and useActionData from react-router
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useLoaderData: () => ({
      products: [
        { id: 'p1', name: 'Cool Shirt', price: 25, category: 'Apparel', image: '/img1.png' }
      ],
      categories: [{ id: 'all', name: 'All' }],
      bestSellers: [],
      settings: {}
    }),
    useActionData: () => null,
    useSubmit: () => vi.fn(),
  };
});

describe('Add to Cart Reproduction', () => {
  it('should trigger add to cart when button is clicked', async () => {
    render(
      <Home />
    );

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButton);

    // We expect the button to show "Adding..." or similar state if implemented
    // Or we check if submit was called
  });
});
