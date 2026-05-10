import { describe, it, expect, vi, beforeEach } from 'vitest';
import { subscribeToCart } from './cartService';
import { onSnapshot } from 'firebase/firestore';

// Mock firebase/firestore
vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    getFirestore: vi.fn(),
    doc: vi.fn((_db, _coll, id) => ({ id })),
    onSnapshot: vi.fn(),
  };
});

// Mock lib/firebase
vi.mock('../lib/firebase', () => ({
  db: {},
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn((cb) => {
      // Simulate no user initially
      cb(null);
      return vi.fn();
    }),
  },
}));

// Mock lib/session
vi.mock('../lib/session', () => ({
  getSessionId: () => 'test-guest-session-id',
}));

describe('cartService permissions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should handle permission-denied error in subscribeToCart', async () => {
    const callback = vi.fn();
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Mock onSnapshot to trigger error callback
    (onSnapshot as any).mockImplementation((_ref, _next, errorCb) => {
      if (errorCb) errorCb({ code: 'permission-denied' });
      return vi.fn();
    });

    subscribeToCart(callback);
    
    // Fast-forward time to trigger setTimeouts
    vi.runAllTimers();

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Access denied for test-guest-session-id')
    );
    expect(callback).toHaveBeenCalledWith([]);

    consoleWarnSpy.mockRestore();
  });
});
