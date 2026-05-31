import { describe, it, expect } from 'vitest';
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

describe('Analytics Comparative Logic', () => {
  const mockOrders = [
    { id: '1', total: 100, createdAt: { toDate: () => new Date('2026-05-10T10:00:00') }, status: 'paid', items: [] },
    { id: '2', total: 50, createdAt: { toDate: () => new Date('2026-05-03T10:00:00') }, status: 'paid', items: [] },
  ];

  it('should render growth values correctly', async () => {
    vi.mocked(reactRouter.useLoaderData).mockReturnValue({ orders: mockOrders });
    
    render(
      <MemoryRouter>
        <Analytics />
      </MemoryRouter>
    );

    // Default is 7d
    // Current period (May 4 - May 10): Order 1 ($100)
    // Previous period (Apr 27 - May 3): Order 2 ($50)
    // Growth: 100%
    
    expect(screen.getAllByText('100.0%').length).toBeGreaterThan(0);
    expect(screen.getAllByText('$100.00').length).toBeGreaterThan(0);
  });
});
