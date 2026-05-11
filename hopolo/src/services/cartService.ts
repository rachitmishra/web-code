import { onSnapshot, doc, getDoc, setDoc, type Unsubscribe } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged, type User } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { getSessionId, SESSION_COOKIE_NAME } from '../lib/session';
import type { Product } from './productService';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Cart {
  items: CartItem[];
}

const LOCAL_STORAGE_CART_KEY = 'hypvzn_local_cart';

// Singleton promise to prevent redundant sign-in attempts
let anonymousSignInPromise: Promise<User> | null = null;
let isAnonymousAuthSupported = true;

/**
 * Gets the cart from local storage.
 */
export const getLocalCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error("[Cart] Failed to parse local cart:", err);
    return [];
  }
};

/**
 * Saves the cart to local storage and notifies listeners.
 */
export const saveLocalCart = (items: CartItem[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('hypvzn_cart_updated', { detail: items }));
};

const ensureAnonymousAuth = async (): Promise<User | null> => {
  if (auth.currentUser) return auth.currentUser;
  if (!isAnonymousAuthSupported) return null;
  if (anonymousSignInPromise) return anonymousSignInPromise;

  console.log("[Cart] No user detected, signing in anonymously for guest cart support...");
  anonymousSignInPromise = signInAnonymously(auth)
    .then((result) => {
      anonymousSignInPromise = null;
      isAnonymousAuthSupported = true;
      return result.user;
    })
    .catch((err) => {
      anonymousSignInPromise = null;
      if (err.code === 'auth/admin-restricted-operation' || err.code === 'auth/operation-not-allowed') {
        console.error("[Cart] Anonymous sign-in is disabled in Firebase Console. Local storage will be the primary source for guests.");
        isAnonymousAuthSupported = false;
      } else {
        console.error("[Cart] Anonymous sign-in failed:", err);
      }
      return null;
    });

  return anonymousSignInPromise;
};

const getCartRef = () => {
  const sessionId = getSessionId();
  return doc(db, 'carts', sessionId);
};

/**
 * Merges two sets of cart items, combining quantities for identical items.
 */
const mergeCartItems = (existing: CartItem[], incoming: CartItem[]): CartItem[] => {
  const merged = [...existing];
  incoming.forEach(item => {
    const existingIndex = merged.findIndex(i => 
      i.product.id === item.product.id && 
      i.selectedSize === item.selectedSize && 
      i.selectedColor === item.selectedColor
    );
    if (existingIndex > -1) {
      merged[existingIndex].quantity += item.quantity;
    } else {
      merged.push(item);
    }
  });
  return merged;
};

export const subscribeToCart = (callback: (items: CartItem[]) => void): Unsubscribe => {
  let unsubscribeSnapshot: Unsubscribe | null = null;
  let lastId: string | null = null;
  let isMounted = true;

  // 1. Immediate local load for zero-latency UI
  const localItems = getLocalCart();
  callback(localItems);

  // 2. Listen for local storage updates (within the same tab)
  const handleLocalUpdate = (e: any) => {
    if (isMounted) callback(e.detail || getLocalCart());
  };
  window.addEventListener('hypvzn_cart_updated', handleLocalUpdate);

  const startListening = (sessionId: string) => {
    if (!isMounted || !sessionId || sessionId === lastId) return;
    
    // Safety: If it looks like a UID but we aren't authenticated, don't even try (prevents noise)
    if (!auth.currentUser && sessionId.length < 32) {
      console.warn(`[Cart] Skipping Firestore subscription for unauthenticated session: ${sessionId}`);
      return;
    }

    if (unsubscribeSnapshot) {
      unsubscribeSnapshot();
      unsubscribeSnapshot = null;
    }

    lastId = sessionId;
    console.log(`[Cart] Subscribing to: ${sessionId}`);

    unsubscribeSnapshot = onSnapshot(doc(db, 'carts', sessionId), (docSnapshot) => {
      if (isMounted) {
        if (docSnapshot.exists()) {
          const remoteItems = (docSnapshot.data() as Cart).items || [];
          // Sync local storage with remote
          saveLocalCart(remoteItems);
          callback(remoteItems);
        } else {
          // If no remote cart, but we have local items, push them to Firestore
          const localItems = getLocalCart();
          if (localItems.length > 0) {
            console.log(`[Cart] Remote cart missing for ${sessionId}. Pushing local items...`);
            const cartRef = doc(db, 'carts', sessionId);
            setDoc(cartRef, { 
              items: localItems,
              ownerId: sessionId,
              updatedAt: new Date()
            }, { merge: true }).catch(err => {
              console.warn("[Cart] Failed to push local items to new remote cart:", err);
            });
            callback(localItems);
          } else {
            callback([]);
          }
        }
      }
    }, (error) => {
      if (error.code === 'permission-denied') {
        console.warn(`[Cart] Access denied for ${sessionId}. Falling back to local storage only.`);
      } else {
        console.error("[Cart] Subscription error:", error);
      }
    });
  };

  // Primary driver: Auth state changes
  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (!isMounted) return;
    
    if (!user) {
      ensureAnonymousAuth().then((u) => {
        if (!isMounted) return;
        const finalId = u ? u.uid : getSessionId();
        startListening(finalId);
      });
      return;
    }
    
    const newId = user.uid;
    console.log(`[Cart] Auth event: ${user.isAnonymous ? 'Guest (Anonymous)' : 'User'}. ID: ${newId}`);
    
    // Attempt to sync local items if this is a real user login
    if (!user.isAnonymous) {
      syncLocalCartToRemote();
    }

    // Small delay to let Firestore settle and tokens propagate
    setTimeout(() => {
      if (isMounted) startListening(newId);
    }, 500);
  });

  // Initial check
  if (auth.currentUser) {
    if (!auth.currentUser.isAnonymous) {
      syncLocalCartToRemote();
    }
    setTimeout(() => {
      if (isMounted) startListening(auth.currentUser!.uid);
    }, 100);
  } else {
    ensureAnonymousAuth().then((u) => {
      if (isMounted) startListening(u ? u.uid : getSessionId());
    });
  }

  return () => {
    isMounted = false;
    unsubscribeAuth();
    window.removeEventListener('hypvzn_cart_updated', handleLocalUpdate);
    if (unsubscribeSnapshot) unsubscribeSnapshot();
  };
};

/**
 * Adds a product to the cart (client-side).
 */
export const addToCart = async (product: Product, quantity: number, options?: { size?: string; color?: string }) => {
  // 1. Update Local Storage immediately for zero-latency UI feedback
  const items = getLocalCart();
  const size = options?.size || undefined;
  const color = options?.color || undefined;

  const existingItemIndex = items.findIndex((item) => {
    const isSameProduct = item.product.id === product.id;
    const isSameSize = (item.selectedSize || undefined) === size;
    const isSameColor = (item.selectedColor || undefined) === color;
    return isSameProduct && isSameSize && isSameColor;
  });

  if (existingItemIndex > -1) {
    items[existingItemIndex].quantity += quantity;
  } else {
    items.push({ 
      product, 
      quantity,
      ...(size && { selectedSize: size }),
      ...(color && { selectedColor: color })
    });
  }
  saveLocalCart(items);

  // Note: We don't call setDoc here because the pages (Home, PDP, Cart) call a server action via 'submit'.
  // The server action updates Firestore, and subscribeToCart's onSnapshot syncs it back to local storage.
};

/**
 * Removes a product from the cart (client-side).
 */
export const removeFromCart = async (productId: string, options?: { size?: string; color?: string }) => {
  // 1. Update Local Storage
  const items = getLocalCart().filter((item) => {
    const isSameProduct = item.product.id === productId;
    const isSameSize = !options?.size || item.selectedSize === options.size;
    const isSameColor = !options?.color || item.selectedColor === options.color;
    return !(isSameProduct && isSameSize && isSameColor);
  });
  saveLocalCart(items);
};

/**
 * Updates the quantity of an item in the cart (client-side).
 */
export const updateQuantity = async (productId: string, quantity: number, options?: { size?: string; color?: string }) => {
  // 1. Update Local Storage
  const items = getLocalCart().map((item) => {
    const isSameProduct = item.product.id === productId;
    const isSameSize = !options?.size || item.selectedSize === options.size;
    const isSameColor = !options?.color || item.selectedColor === options.color;
    
    if (isSameProduct && isSameSize && isSameColor) {
      return { ...item, quantity };
    }
    return item;
  });
  saveLocalCart(items);
};

/**
 * Synchronizes the local cart with the remote Firestore cart for the current user.
 */
export const syncLocalCartToRemote = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const localItems = getLocalCart();
  if (localItems.length === 0) {
    console.log("[Cart] No local items to sync.");
    return;
  }

  console.log(`[Cart] Syncing ${localItems.length} local items to user: ${user.uid}`);
  
  try {
    const cartRef = doc(db, 'carts', user.uid);
    const cartDoc = await getDoc(cartRef).catch(err => {
      if (err.code === 'permission-denied') {
        console.warn("[Cart] Permission denied while reading remote cart for sync. This is common during login transitions.");
        return null;
      }
      throw err;
    });
    
    if (!cartDoc) return; // Skip if we can't read the cart
    
    let remoteItems: CartItem[] = [];
    if (cartDoc.exists()) {
      remoteItems = (cartDoc.data() as Cart).items || [];
    }
    
    const mergedItems = mergeCartItems(remoteItems, localItems);
    
    await setDoc(cartRef, {
      items: mergedItems,
      ownerId: user.uid,
      updatedAt: new Date()
    }, { merge: true });
    
    // Clear local cart after successful sync
    saveLocalCart([]);
    console.log("[Cart] Local cart synced and cleared.");
  } catch (err: any) {
    if (err.code === 'permission-denied') {
      console.warn("[Cart] Permission denied while syncing local cart to Firestore. Guest items remain in local storage.");
    } else {
      console.error("[Cart] Failed to sync local cart to Firestore:", err);
    }
  }
};

/**
 * Clears the cart (client-side).
 */
export const clearCart = async () => {
  saveLocalCart([]);
  try {
    const cartRef = getCartRef();
    await setDoc(cartRef, { items: [] });
  } catch (err) {
    console.warn("[Cart] Failed to sync clear-cart to Firestore.", err);
  }
};
