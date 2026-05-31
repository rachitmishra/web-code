import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import Header from './components/layout/Header/Header';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useRouteLoaderData: vi.fn(),
    useLocation: () => ({ pathname: '/' }),
    useNavigate: () => vi.fn(),
  };
});

vi.mock('./services/cartService', () => ({
  subscribeToCart: vi.fn(() => vi.fn()),
}));

import { useRouteLoaderData } from 'react-router';

describe('Header with PromoBanner Visibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render banner inside header when settings are correct and bannerVisible is true', () => {
    (useRouteLoaderData as any).mockReturnValue({
      settings: {
        bannerVisible: true,
        bannerText: 'SALE NOW ON',
        bannerColor: '#ff0000',
      },
    });

    const routes = [
      {
        path: '/',
        element: <Header onOpenCart={() => {}} />,
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ['/'],
    });

    render(<RouterProvider router={router} />);

    expect(screen.getByText(/SALE NOW ON/i)).toBeInTheDocument();
  });

  it('should NOT render banner inside header when bannerVisible is false', () => {
    (useRouteLoaderData as any).mockReturnValue({
      settings: {
        bannerVisible: false,
        bannerText: 'SALE NOW ON',
      },
    });

    const routes = [
      {
        path: '/',
        element: <Header onOpenCart={() => {}} />,
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ['/'],
    });

    render(<RouterProvider router={router} />);

    expect(screen.queryByText(/SALE NOW ON/i)).not.toBeInTheDocument();
  });
});
