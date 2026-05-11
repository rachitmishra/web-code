<<<<<<< HEAD
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import AdminRoute from './AdminRoute';

describe('AdminRoute', () => {
  it('should render children if user is admin', () => {
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useRouteLoaderData: () => ({ serverUser: { role: 'admin' }, role: 'admin' }),
        useLocation: () => ({ pathname: '/admin' }),
      };
=======
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import AdminRoute from './AdminRoute';
import * as profileService from '../../../services/profileService';
import { auth } from '../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

vi.mock('../../../services/profileService');
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({ currentUser: null })),
  onAuthStateChanged: vi.fn(),
}));
vi.mock('../../../lib/firebase', () => ({
  auth: { currentUser: null },
  db: {},
}));

describe('AdminRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children if user is admin', async () => {
    (auth.currentUser as any) = { uid: 'admin123' };
    (onAuthStateChanged as any).mockImplementation((_auth: any, cb: any) => {
      cb({ uid: 'admin123' });
      return vi.fn();
    });
    (profileService.getUserProfile as any).mockResolvedValue({
      uid: 'admin123',
      role: 'admin'
>>>>>>> 336d77c (feat(cart): implement local storage fallback and robust server-side sync)
    });

    const router = createMemoryRouter([
      { path: '/admin', element: <AdminRoute><div>Admin Content</div></AdminRoute> }
    ], { initialEntries: ['/admin'] });

<<<<<<< HEAD
    render(<RouterProvider router={router} />);
    expect(screen.getByText('Admin Content')).toBeInTheDocument();
=======
    await waitFor(() => {
      expect(screen.getByTestId('admin-content')).toBeInTheDocument();
    });
  });

  it('should redirect to home if user is not admin', async () => {
    (auth.currentUser as any) = { uid: 'user123' };
    (onAuthStateChanged as any).mockImplementation((_auth: any, cb: any) => {
      cb({ uid: 'user123' });
      return vi.fn();
    });
    (profileService.getUserProfile as any).mockResolvedValue({
      uid: 'user123',
      role: 'user'
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/" element={<div data-testid="home-page">Home Page</div>} />
          <Route path="/admin" element={
            <AdminRoute>
              <div data-testid="admin-content">Admin Content</div>
            </AdminRoute>
          } />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
    });
>>>>>>> 336d77c (feat(cart): implement local storage fallback and robust server-side sync)
  });
});
