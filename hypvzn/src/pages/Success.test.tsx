import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useLoaderData } from 'react-router';
import Success from './Success';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useLoaderData: vi.fn(),
    useNavigate: () => vi.fn(),
  };
});

const mockOrder = {
  id: 'order_123',
  total: 150,
  status: 'paid',
  items: [
    { product: { name: 'Product A', price: 50 }, quantity: 2 },
    { product: { name: 'Product B', price: 50 }, quantity: 1 },
  ],
  address: {
    street: '123 Test St',
    city: 'Demo City',
    zip: '12345'
  },
  createdAt: { toDate: () => new Date() }
};

describe('Success Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the success message', () => {
    (useLoaderData as any).mockReturnValue({ order: mockOrder });
    
    render(
      <MemoryRouter>
        <Success />
      </MemoryRouter>
    );

    expect(screen.getByText(/transaction successful/i)).toBeInTheDocument();
    expect(screen.getByText(/order_123/i)).toBeInTheDocument();
  });

  it('should display order details from loader data', async () => {
    (useLoaderData as any).mockReturnValue({ order: mockOrder });

    render(
      <MemoryRouter>
        <Success />
      </MemoryRouter>
    );

    expect(screen.getByText(/\$150.00/i)).toBeInTheDocument();
    expect(screen.getByText(/Product A x 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Product B x 1/i)).toBeInTheDocument();
    expect(screen.getByText(/123 Test St/i)).toBeInTheDocument();
  });
});
