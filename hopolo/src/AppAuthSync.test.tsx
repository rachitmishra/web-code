import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, useLoaderData, useLocation } from 'react-router';
import App from '../app/root';
import { auth } from './lib/firebase';
import { signOutUser } from './services/authService';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useLoaderData: vi.fn(),
    useLocation: vi.fn(),
  };
});

vi.mock('./lib/firebase', () => ({
  auth: {
    onAuthStateChanged: vi.fn(),
    currentUser: null,
  },
}));

vi.mock('./services/authService', () => ({
  signOutUser: vi.fn(),
}));

describe('App Auth Sync (Fixed)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call signOutUser if client session exists on mount but server session does not', async () => {
    (useLoaderData as any).mockReturnValue({ serverUser: null });
    (useLocation as any).mockReturnValue({ pathname: '/' });
    
    // Mock currentUser on mount
    (auth as any).currentUser = { uid: 'u1' };

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(signOutUser).toHaveBeenCalled();
    });
  });

  it('should NOT call signOutUser if client session is established AFTER mount (e.g. login flow)', async () => {
    (useLoaderData as any).mockReturnValue({ serverUser: null });
    (useLocation as any).mockReturnValue({ pathname: '/' });
    
    // Initially null on mount
    (auth as any).currentUser = null;

    let authCallback: any;
    (auth.onAuthStateChanged as any).mockImplementation((cb: any) => {
      authCallback = cb;
      return vi.fn();
    });

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Initial check on mount should have run and NOT called signOutUser
    expect(signOutUser).not.toHaveBeenCalled();

    // Now mock login later
    if (authCallback) authCallback({ uid: 'u1' });

    await new Promise(resolve => setTimeout(resolve, 100));
    expect(signOutUser).not.toHaveBeenCalled();
  });
});
