import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Analytics from './Analytics';
import * as reactRouter from 'react-router';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useLoaderData: vi.fn(),
    useNavigate: () => vi.fn(),
  };
});

describe('Analytics Customer Insights', () => {
  const now = new Date();
  const mockOrders = [
    { id: '1', userId: 'u1', userEmail: 'u1@test.com', total: 100, createdAt: { toDate: () => now }, status: 'paid', items: [] },
    { id: '2', userId: 'u1', userEmail: 'u1@test.com', total: 50, createdAt: { toDate: () => now }, status: 'paid', items: [] },
  ];

  it('should render customer metrics correctly', async () => {
    vi.mocked(reactRouter.useLoaderData).mockReturnValue({ orders: mockOrders });
    
    render(
      <MemoryRouter>
        <Analytics />
      </MemoryRouter>
    );

    expect(screen.getByText('Customer Insights')).toBeDefined();
    expect(screen.getByText('Top Customers')).toBeDefined();
    expect(screen.getByText('u1@test.com')).toBeDefined();
  });
});
