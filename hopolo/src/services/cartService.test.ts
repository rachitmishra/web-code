import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addToCart, subscribeToCart, clearCart } from './cartService';
import { setDoc, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Mock firebase/firestore
vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    getFirestore: vi.fn(),
    doc: vi.fn(() => ({ id: 'mock-doc-id' })), // Mock doc to return something
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
}));

// Mock lib/session
vi.mock('../lib/session', () => ({
  getSessionId: () => 'test-session-id',
}));

describe('cartService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('addToCart should call setDoc with the new product', async () => {
    const mockProduct = { id: 'p1', name: 'Product 1', price: 10, category: 'test' };
    
    // Mock getDoc to return empty cart initially
    (getDoc as any).mockResolvedValue({
      exists: () => false,
    });

    await addToCart(mockProduct as any, 2);

    expect(doc).toHaveBeenCalled();
    expect(setDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      items: [{ product: mockProduct, quantity: 2 }],
      ownerId: 'test-session-id'
    }), { merge: true });
  });

  it('addToCart should support product variants (size/color)', async () => {
    const mockProduct = { id: 'p1', name: 'Product 1', price: 10, category: 'test' };
    
    (getDoc as any).mockResolvedValue({ exists: () => false });

    await addToCart(mockProduct as any, 1, 'M', 'Blue');

    expect(setDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      items: [{ 
        product: mockProduct, 
        quantity: 1, 
        selectedSize: 'M', 
        selectedColor: 'Blue' 
      }],
      ownerId: 'test-session-id'
    }), { merge: true });
  });

  it('subscribeToCart should call onSnapshot and trigger callback', () => {
    const callback = vi.fn();
    const mockUnsubscribe = vi.fn();
    (onSnapshot as any).mockReturnValue(mockUnsubscribe);

    const unsubscribe = subscribeToCart(callback);
    
    // Trigger onAuthStateChanged callback
    const authCb = (onAuthStateChanged as any).mock.calls[0][1];
    authCb({ uid: 'test-user-id' });

    // Run timers for the 500ms delay
    vi.runAllTimers();

    expect(onSnapshot).toHaveBeenCalled();
    expect(typeof unsubscribe).toBe('function');
    
    // Simulate snapshot update
    const mockItems = [{ product: { id: 'p1' }, quantity: 1 }];
    const snapshotCallback = (onSnapshot as any).mock.calls[0][1];
    
    // Properly mock the document snapshot
    snapshotCallback({
      exists: () => true,
      data: () => ({ items: mockItems })
    });

    expect(callback).toHaveBeenCalledWith(mockItems);
  });

  it('clearCart should call setDoc with empty items', async () => {
    await clearCart();
    expect(setDoc).toHaveBeenCalledWith(expect.anything(), { items: [] });
  });

});
