import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { addToCart, subscribeToCart, getLocalCart, clearCart, syncLocalCartToRemote } from './cartService';
import { setDoc, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Mock firebase/firestore
vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    getFirestore: vi.fn(),
    doc: vi.fn(() => ({ id: 'mock-doc-id' })),
    setDoc: vi.fn(),
    getDoc: vi.fn(),
    onSnapshot: vi.fn(),
  };
});

// Mock lib/firebase
vi.mock('../lib/firebase', () => ({
  db: {},
  auth: { currentUser: null },
}));

// Mock firebase/auth
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((_auth, cb) => {
    cb(null);
    return vi.fn();
  }),
  signInAnonymously: vi.fn(() => Promise.resolve({ user: { uid: 'guest-uid' } })),
  signOut: vi.fn(),
}));

// Mock lib/session
vi.mock('../lib/session', () => ({
  getSessionId: () => 'test-session-id-long-enough-to-be-uuid',
}));

describe('cartService with LocalStorage Fallback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('addToCart should update localStorage immediately', async () => {
    const mockProduct = { id: 'p1', name: 'Product 1', price: 10, category: 'test' } as any;
    
    await addToCart(mockProduct, 2);

    const localCart = getLocalCart();
    expect(localCart).toHaveLength(1);
    expect(localCart[0].product.id).toBe('p1');
    expect(localCart[0].quantity).toBe(2);
    
    // Remote sync (setDoc) is NOT called anymore from client-side addToCart
    expect(setDoc).not.toHaveBeenCalled();
  });

  it('addToCart should merge items in localStorage', async () => {
    const mockProduct = { id: 'p1', name: 'Product 1', price: 10, category: 'test' } as any;
    
    await addToCart(mockProduct, 1);
    await addToCart(mockProduct, 2);

    const localCart = getLocalCart();
    expect(localCart).toHaveLength(1);
    expect(localCart[0].quantity).toBe(3);
  });

  it('subscribeToCart should call callback with local items immediately', () => {
    const mockProduct = { id: 'p1', name: 'Product 1', price: 10, category: 'test' } as any;
    localStorage.setItem('hypvzn_local_cart', JSON.stringify([{ product: mockProduct, quantity: 5 }]));
    
    const callback = vi.fn();
    subscribeToCart(callback);

    expect(callback).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ quantity: 5 })
    ]));
  });

  it('syncLocalCartToRemote should merge local items into remote Firestore', async () => {
    const mockProduct = { id: 'p1', name: 'Product 1', price: 10, category: 'test' } as any;
    localStorage.setItem('hypvzn_local_cart', JSON.stringify([{ product: mockProduct, quantity: 3 }]));
    
    // Mock authenticated user
    const { auth } = await import('../lib/firebase');
    (auth as any).currentUser = { uid: 'user-123' };

    // Mock remote cart (empty)
    (getDoc as any).mockResolvedValue({
      exists: () => false
    });

    await syncLocalCartToRemote();

    expect(setDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      items: expect.arrayContaining([
        expect.objectContaining({ quantity: 3 })
      ]),
      ownerId: 'user-123'
    }), { merge: true });

    // Local cart should be cleared after sync
    expect(getLocalCart()).toHaveLength(0);
  });

  it('clearCart should clear localStorage', async () => {
    localStorage.setItem('hypvzn_local_cart', JSON.stringify([{ id: 'any' }]));
    
    await clearCart();

    expect(getLocalCart()).toHaveLength(0);
    expect(setDoc).toHaveBeenCalledWith(expect.anything(), { items: [] });
  });
});
