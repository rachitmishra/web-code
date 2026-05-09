import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import MainLayout from './MainLayout';
import * as storefrontService from '../../services/storefrontService';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useRouteLoaderData: vi.fn(() => ({
      settings: { isMaintenanceMode: false },
      role: 'user'
    })),
    useLocation: () => ({ pathname: '/' }),
    useNavigate: () => vi.fn(),
    useFetcher: () => ({
      submit: vi.fn(),
      data: null,
      state: 'idle',
    }),
  };
});

vi.mock('../../lib/firebase', () => ({
  auth: { currentUser: null, onAuthStateChanged: vi.fn(() => vi.fn()) },
  db: {}
}));

describe('MainLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    const router = createMemoryRouter([
      { path: '/', element: <MainLayout><div data-testid="child-content">Child Content</div></MainLayout> }
    ]);
    return render(<RouterProvider router={router} />);
  };

  it('should render children content', () => {
    renderComponent();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('should render structural landmarks', () => {
    renderComponent();
    expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // Footer
    expect(screen.getByRole('main')).toBeInTheDocument(); // Main content
  });
});
