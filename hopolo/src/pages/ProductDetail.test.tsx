import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ProductDetail from './ProductDetail';
import * as cartService from '../services/cartService';
import * as reviewService from '../services/reviewService';
import { auth } from '../lib/firebase';
import { useSEO } from '../hooks/useSEO';
import { useLoaderData, useSubmit, useActionData } from 'react-router';
import { DEFAULT_PDP_LAYOUT } from '../services/storefrontService';

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

vi.mock('../services/cartService');
vi.mock('../services/reviewService');
vi.mock('../hooks/useSEO');
vi.mock('../lib/firebase', () => ({
  auth: { currentUser: { uid: 'u1', displayName: 'Alice' } },
  db: {},
}));

const mockProduct = {
  id: '1',
  name: 'Cool Product',
  price: 49.99,
  category: 'Test',
  rating: 4.5,
  description: 'A great product',
  image: 'img.jpg'
};

describe('ProductDetail Page', () => {
  const submit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useLoaderData as any).mockReturnValue({
      product: mockProduct,
      reviews: [],
      relatedProducts: [],
      layout: DEFAULT_PDP_LAYOUT
    });
    (useSubmit as any).mockReturnValue(submit);
    (useActionData as any).mockReturnValue(null);
    (auth.currentUser as any) = { uid: 'u1', displayName: 'Alice' };
  });

  it('should render product details correctly', async () => {
    render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /cool product/i })).toBeInTheDocument();
    expect(screen.getByText(/\$49.99/i)).toBeInTheDocument();
    expect(screen.getByText(/4.5/i)).toBeInTheDocument();
  });

  it('should call submit when add to cart button is clicked', async () => {
    render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>
    );

    const addButton = screen.getByRole('button', { name: /add to cart/i });
    
    // Increment quantity to 2
    fireEvent.click(screen.getByLabelText(/increase quantity/i));
    
    fireEvent.click(addButton);

    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({ 
        intent: 'add-to-cart',
        quantity: '2'
      }),
      expect.anything()
    );
  });

  it('should render rich product details like delivery and art info', async () => {
    const richProduct = {
      ...mockProduct,
      deliveryTime: '3-5 days',
      priceDisclaimer: 'Taxes included',
      artDetails: { Artist: 'Jane Doe', Technique: 'Oil on Canvas' }
    };
    (useLoaderData as any).mockReturnValue({
      product: richProduct,
      reviews: [],
      relatedProducts: [],
      layout: DEFAULT_PDP_LAYOUT
    });

    render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>
    );

    expect(screen.getByText(/3-5 days/i)).toBeInTheDocument();
    expect(screen.getByText(/Taxes included/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Oil on Canvas/i)).toBeInTheDocument();
  });

  it('should display reviews on load', async () => {
    const mockReviews = [
      { id: 'r1', rating: 3, comment: 'Amazing!', userName: 'Alice' },
      { id: 'r2', rating: 2, comment: 'Ok.', userName: 'Bob' },
    ];
    (useLoaderData as any).mockReturnValue({
      product: mockProduct,
      reviews: mockReviews,
      relatedProducts: [],
      layout: DEFAULT_PDP_LAYOUT
    });

    render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>
    );

    expect(screen.getByText(/Alice/i)).toBeInTheDocument();
    expect(screen.getByText(/Amazing!/i)).toBeInTheDocument();
    expect(screen.getByText(/Bob/i)).toBeInTheDocument();
    expect(screen.getByText(/Ok./i)).toBeInTheDocument();
  });

  it('should call useSEO with product details', async () => {
    render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>
    );

    expect(useSEO).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Cool Product',
      description: 'A great product',
      image: 'img.jpg'
    }));
  });

  it('should render variant selectors and allow selection', async () => {
    const productWithVariants = {
      ...mockProduct,
      sizes: ['S', 'M'],
      colors: ['Red', 'Blue'],
    };
    (useLoaderData as any).mockReturnValue({
      product: productWithVariants,
      reviews: [],
      relatedProducts: [],
      layout: DEFAULT_PDP_LAYOUT
    });

    render(
      <MemoryRouter>
        <ProductDetail />
      </MemoryRouter>
    );

    expect(screen.getByText('Size')).toBeInTheDocument();
    
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('M')).toBeInTheDocument();
    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();

    // Select Size
    fireEvent.click(screen.getByText('M'));
    // Select Color
    fireEvent.click(screen.getByText('Blue'));

    // Click Add to Cart
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({ 
        intent: 'add-to-cart',
        size: 'M',
        color: 'Blue'
      }),
      expect.anything()
    );
  });
});
