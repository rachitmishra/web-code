import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Home from './Home';
import * as productService from '../../services/productService';
import * as productServiceServer from '../../services/productService.server';
import * as storefrontService from '../../services/storefrontService';
import * as storefrontServiceServer from '../../services/storefrontService.server';
import { useSEO } from '../../hooks/useSEO';
import { useLoaderData, useSubmit, useActionData, useNavigate } from 'react-router';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useLoaderData: vi.fn(),
    useSubmit: vi.fn(),
    useActionData: vi.fn(),
    useNavigate: vi.fn(() => vi.fn()),
  };
});

vi.mock('../../services/productService');
vi.mock('../../services/productService.server');
vi.mock('../../services/storefrontService');
vi.mock('../../services/storefrontService.server');
vi.mock('../../hooks/useSEO');

const mockProducts: productService.Product[] = [
  { id: '1', name: 'Product 1', price: 10, category: 'cat1', title: 'Product 1' },
  { id: '2', name: 'Product 2', price: 20, category: 'cat2', title: 'Product 2' },
];

const mockCategories: productService.Category[] = [
  { id: 'all', name: 'All' },
  { id: 'cat1', name: 'Electronics' },
  { id: 'cat2', name: 'Clothing' },
];

const mockBestSellers: productService.Product[] = [
  { id: 'bs1', name: 'Best Seller Product', price: 50, category: 'cat1', title: 'Best Seller Product' },
];

const mockSettings: storefrontService.StorefrontSettings = {
  bannerText: 'Dynamic Banner',
  bannerColor: '#0000ff',
  bannerLink: '/dynamic',
  bannerVisible: true,
  isMaintenanceMode: false,
  heroTitle: 'Dynamic Hero Title',
  heroSubtitle: 'Dynamic Subtitle',
  heroImage: 'https://example.com/dynamic.jpg',
  heroCtaText: 'Explore Now',
  reviews: [
    { name: 'Alice', emoji: '🌟', text: 'Dynamic Review!' },
  ],
  homeLayout: {
    plugins: [
      { id: '1', type: 'PromoBanner', visible: true },
      { id: '2', type: 'CinematicHero', visible: true },
      { id: '3', type: 'BestSellers', visible: true },
      { id: '4', type: 'ProductGridSection', visible: true },
      { id: '5', type: 'ReviewSection', visible: true },
    ]
  }
};

describe('Home Page', () => {
  const submit = vi.fn();
  const navigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useLoaderData as any).mockReturnValue({
      products: mockProducts,
      categories: mockCategories,
      bestSellers: mockBestSellers,
      settings: mockSettings
    });
    (useSubmit as any).mockReturnValue(submit);
    (useActionData as any).mockReturnValue(null);
    (useNavigate as any).mockReturnValue(navigate);
    (productServiceServer.fetchProducts as any).mockResolvedValue(mockProducts);
    (productServiceServer.fetchCategories as any).mockResolvedValue(mockCategories);
    (productServiceServer.fetchBestSellers as any).mockResolvedValue(mockBestSellers);
    (storefrontServiceServer.getStorefrontSettings as any).mockResolvedValue(mockSettings);
  });

  it('should render products and categories on load', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/product 1/i)).toBeInTheDocument();
      expect(screen.getByText(/product 2/i)).toBeInTheDocument();
      expect(screen.getByText(/electronics/i)).toBeInTheDocument();
    });
  });

  it('should render the dynamic cinematic hero', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/dynamic hero title/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /explore now/i })).toBeInTheDocument();
    });
  });

  it('should render the dynamic reviews section', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/loved by customers/i)).toBeInTheDocument();
      expect(screen.getByText(/alice/i)).toBeInTheDocument();
      expect(screen.getByText(/dynamic review!/i)).toBeInTheDocument();
    });
  });

  it('should filter products when a category tab is clicked', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    await waitFor(() => screen.getByText(/electronics/i));
    
    fireEvent.click(screen.getByText(/electronics/i));
    
    await waitFor(() => {
      expect(screen.getByText(/product 1/i)).toBeInTheDocument();
      expect(screen.queryByText(/product 2/i)).not.toBeInTheDocument();
    });
  });

  it('should call useSEO hook', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(useSEO).toHaveBeenCalled();
  });

  it('should call handleAddToCart when Add to Cart button is clicked', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText(/product 1/i));

    const addToCartButtons = screen.getAllByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButtons[0]);

    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        intent: 'add-to-cart',
      }),
      expect.anything()
    );
  });
});
