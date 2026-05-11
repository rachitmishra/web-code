import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import Header from './components/layout/Header/Header';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

vi.mock('./lib/firebase', () => ({
  auth: {
    currentUser: null,
  },
}));

vi.mock('firebase/auth', async () => {
  const actual = await vi.importActual('firebase/auth');
  return {
    ...actual,
    onAuthStateChanged: vi.fn(),
  };
});

vi.mock('./services/cartService', () => ({
  subscribeToCart: vi.fn(() => vi.fn()),
}));

vi.mock('./services/authService', () => ({
  signOutUser: vi.fn(),
}));

describe('Header Auth Update', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update header when auth state changes to logged in', async () => {
    let authCallback: any;
    (onAuthStateChanged as any).mockImplementation((_auth: any, cb: any) => {
      authCallback = cb;
      return vi.fn();
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

    // Initially should show "Sign In"
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();

    // Mock login
    const mockUser = { uid: 'u1', email: 'test@example.com' };
    authCallback(mockUser);

    // Should now show "Account" and "Sign Out"
    await waitFor(() => {
      expect(screen.getByText(/account/i)).toBeInTheDocument();
      expect(screen.getByText(/sign out/i)).toBeInTheDocument();
      expect(screen.queryByText(/sign in/i)).not.toBeInTheDocument();
    });
  });
});
