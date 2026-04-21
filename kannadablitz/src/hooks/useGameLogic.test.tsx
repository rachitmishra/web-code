import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import useGameLogic from './useGameLogic';

// Mock context and dependencies
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ effectiveUid: 'test-uid' }),
}));

vi.mock('../context/ToastContext', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

vi.mock('../firebase', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
  onSnapshot: vi.fn(() => vi.fn()),
}));

describe('useGameLogic - Zen Mode', () => {
  it('should enable Zen Mode in flashcards and scenarios views', () => {
    const { result } = renderHook(() => useGameLogic());

    // Default view is dashboard
    expect(result.current.state.view).toBe('dashboard');
    expect(result.current.state.isZenMode).toBe(false);

    // Switch to flashcards
    act(() => {
      result.current.actions.setView('flashcards');
    });
    expect(result.current.state.isZenMode).toBe(true);

    // Switch to scenarios
    act(() => {
      result.current.actions.setView('scenarios');
    });
    expect(result.current.state.isZenMode).toBe(true);

    // Switch back to dashboard
    act(() => {
      result.current.actions.setView('dashboard');
    });
    expect(result.current.state.isZenMode).toBe(false);
  });
});
