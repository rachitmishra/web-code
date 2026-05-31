import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router';
import Checkout from './Checkout';
import * as cartService from '../services/cartService';
import * as profileService from '../services/profileService';
import * as paymentService from '../services/paymentService';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useLocation: vi.fn(),
    useLoaderData: vi.fn(),
    useSubmit: vi.fn(),
    useActionData: vi.fn(),
    useNavigate: vi.fn(() => vi.fn()),
  };
});

import { useLoaderData, useSubmit, useActionData } from 'react-router';

vi.mock('../services/cartService');
vi.mock('../services/profileService');
vi.mock('../services/paymentService');
vi.mock('../lib/firebase', () => ({
  auth: { currentUser: { uid: 'user123' } },
  db: {},
}));

const mockCartItems = [
  { product: { id: '1', name: 'Product 1', price: 100, image: 'img1.jpg' }, quantity: 2 },
];

const mockProfile = {
  uid: 'user123',
  displayName: 'John Doe',
  addresses: [
    { street: '123 Main St', city: 'City', zip: '12345' },
  ],
};

const mockSubmit = vi.fn();

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useLoaderData: vi.fn(() => ({
      userProfile: mockProfile,
      items: mockCartItems,
      addresses: mockProfile.addresses,
      user: mockProfile
    })),
    useActionData: vi.fn(),
    useSubmit: () => mockSubmit,
    useNavigate: () => vi.fn()
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLoaderData: vi.fn(() => ({
      userProfile: mockProfile,
      items: mockCartItems,
      addresses: mockProfile.addresses,
      user: mockProfile
    })),
    useActionData: vi.fn(),
    useSubmit: () => mockSubmit,
    useNavigate: () => vi.fn()
  };
});


vi.mock('../services/cartService', () => ({
  subscribeToCart: vi.fn(),
  getCartItems: vi.fn()
}));

vi.mock('../services/profileService', () => ({
  getUserProfile: vi.fn()
}));

vi.mock('../services/paymentService', () => ({
  loadRazorpayScript: vi.fn()
}));

vi.mock('../lib/firebase', () => ({
  auth: { currentUser: { uid: 'user123' } },
  db: {},
}));

describe('Checkout Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useLoaderData as any).mockReturnValue({
      items: mockCartItems,
      addresses: mockProfile.addresses,
      user: mockProfile
    });
    (useLocation as any).mockReturnValue({ state: null });
    (useSubmit as any).mockReturnValue(vi.fn());
    (useActionData as any).mockReturnValue(null);
  });

  const renderComponent = () => {
    const router = createMemoryRouter([
      { path: '/checkout', element: <Checkout /> }
    ], { initialEntries: ['/checkout'] });
    return render(<RouterProvider router={router} />);
  };

  it('should render order summary with correct items and totals', async () => {
    renderComponent();

    expect(screen.getByText(/order summary/i)).toBeInTheDocument();
    expect(screen.getByText(/product 1/i)).toBeInTheDocument();
    expect(screen.getByText(/\$205\.99/i)).toBeInTheDocument(); // 200 + 5.99
  });

  it('should apply discount from location state', async () => {
    (useLocation as any).mockReturnValue({ 
      state: { discount: 20, appliedCode: 'SAVE20' } 
    });

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    expect(screen.getByText(/SAVE20/i)).toBeInTheDocument();
    expect(screen.getByText(/-\$20\.00/i)).toBeInTheDocument();
    expect(screen.getByText(/\$185\.99/i)).toBeInTheDocument(); // 200 + 5.99 - 20
  });

  it('should render saved addresses', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/123 Main St/i)).toBeInTheDocument();
    });
  });
});
