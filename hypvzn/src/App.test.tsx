import { describe, it, expect, vi, beforeEach } from 'vitest';
<<<<<<< HEAD
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import * as productService from './services/productService';
import * as cartService from './services/cartService';
import * as reviewService from './services/reviewService';
import * as storefrontService from './services/storefrontService';
import * as profileService from './services/profileService';
import { MemoryRouter } from 'react-router-dom';
=======
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
>>>>>>> 336d77c (feat(cart): implement local storage fallback and robust server-side sync)
import { AppRoutes } from './App';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import React from 'react';

// Mock react-router
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useLoaderData: vi.fn(),
    useRouteLoaderData: vi.fn(),
    useActionData: vi.fn(),
    useSubmit: vi.fn(),
    useFetcher: vi.fn(() => ({
      data: null,
      state: 'idle',
      Form: ({ children }: any) => children,
      submit: vi.fn(),
      load: vi.fn(),
    })),
  };
});

import { useLoaderData, useRouteLoaderData } from 'react-router';
import * as reactRouter from 'react-router';

vi.mock('./services/productService.server');
vi.mock('./services/cartService.server', () => ({
  subscribeToCart: vi.fn(() => vi.fn()),
  addToCart: vi.fn(),
  getCartItems: vi.fn().mockResolvedValue([])
}));
vi.mock('./services/reviewService.server');
vi.mock('./services/storefrontService.server');
vi.mock('./services/profileService.server');

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({ currentUser: { uid: 'user123' } })),
  onAuthStateChanged: vi.fn((_auth, cb) => {
    cb({ uid: 'user123' });
    return vi.fn();
  }),
}));

vi.mock('./lib/firebase', () => {
  const auth = {
    currentUser: { uid: 'user123' },
  };
  return { auth, db: {} };
});

const mockProducts: any[] = [
  { id: '1', name: 'Product 1', price: 10, category: 'cat1', title: 'Product 1', description: 'Test' },
];

const mockCategories: any[] = [
  { id: 'all', name: 'All' },
];

const mockSettings = {
  heroTitle: 'HYPVZN Boutique',
  heroSubtitle: 'Discover unique products',
  heroImage: '',
  heroCtaText: 'Shop Now',
  reviews: [],
  homeLayout: {
    plugins: [
      { id: 'hero', type: 'CinematicHero', visible: true },
      { id: 'grid', type: 'ProductGridSection', visible: true },
    ]
  },
  pdpLayout: {
    plugins: [
      { id: 'info', type: 'ProductInfo', visible: true },
    ]
  }
};

describe('App Routing Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    const sharedData = {
      serverUser: { uid: 'user123' },
      role: 'user',
      settings: mockSettings,
      products: mockProducts,
      categories: mockCategories,
      bestSellers: mockProducts,
      product: mockProducts[0],
      reviews: [],
      relatedProducts: [],
      layout: mockSettings.homeLayout,
      profile: { uid: 'user123', displayName: 'Test User' },
      orders: []
    };

    (useLoaderData as any).mockReturnValue(sharedData);
    (reactRouter.useLoaderData as any).mockReturnValue(sharedData);
    (useRouteLoaderData as any).mockReturnValue(sharedData);
    
    (productService.fetchProducts as any).mockResolvedValue(mockProducts);
    (productService.fetchCategories as any).mockResolvedValue(mockCategories);
    (productService.fetchBestSellers as any).mockResolvedValue(mockProducts);
    (productService.fetchProductById as any).mockResolvedValue(mockProducts[0]);
    (storefrontService.getStorefrontSettings as any).mockResolvedValue(mockSettings);
    (auth.currentUser as any) = { uid: 'user123' };
  });

  const renderApp = (path: string) => {
    return render(
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    );
  };

  it('should render home page', async () => {
    renderApp('/');
    await waitFor(() => {
      expect(screen.getByText(/hypvzn boutique/i)).toBeInTheDocument();
    });
  });

  it('should render product detail page', async () => {
    // Override layout for PDP
    (useLoaderData as any).mockReturnValue({
      product: mockProducts[0],
      reviews: [],
      relatedProducts: [],
      layout: mockSettings.pdpLayout,
      settings: mockSettings
    });

    renderApp('/product/1');
    await waitFor(() => {
      expect(screen.getByText(/product 1/i)).toBeInTheDocument();
    });
  });

  it('should render profile page when logged in', async () => {
    renderApp('/profile');
    await waitFor(() => {
      expect(screen.getByText(/your profile/i)).toBeInTheDocument();
    });
  });
});
