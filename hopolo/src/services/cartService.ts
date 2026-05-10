import { onSnapshot, doc, getDoc, setDoc, type Unsubscribe } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
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

const getCartRef = () => {
  const sessionId = getSessionId();
  return doc(db, 'carts', sessionId);
};

export const subscribeToCart = (callback: (items: CartItem[]) => void): Unsubscribe => {
  let unsubscribeSnapshot: Unsubscribe | null = null;
  let lastId: string | null = null;
  let isMounted = true;

  const startListening = (sessionId: string) => {
    if (!isMounted || !sessionId || sessionId === lastId) return;
    
    if (unsubscribeSnapshot) {
      unsubscribeSnapshot();
      unsubscribeSnapshot = null;
    }

    lastId = sessionId;
    console.log(`[Cart] Subscribing to: ${sessionId}`);

    unsubscribeSnapshot = onSnapshot(doc(db, 'carts', sessionId), (doc) => {
      if (isMounted) {
        if (doc.exists()) {
          callback((doc.data() as Cart).items || []);
        } else {
          callback([]);
        }
      }
    }, (error) => {
      if (error.code === 'permission-denied') {
        console.warn(`[Cart] Access denied for ${sessionId}. This is expected if the document is being initialized or guest access is limited.`);
        callback([]);
      } else {
        console.error("[Cart] Subscription error:", error);
      }
    });
  };

  // Primary driver: Auth state changes
  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (!isMounted) return;
    
    if (!user) {
      console.log("[Cart] No user detected, signing in anonymously for guest cart support...");
      signInAnonymously(auth).catch(err => {
        if (err.code === 'auth/admin-restricted-operation') {
          console.error("[Cart] Anonymous sign-in is disabled in Firebase Console. Please enable it in Authentication > Sign-in method.");
        } else {
          console.error("[Cart] Anonymous sign-in failed:", err);
        }
        
        // Fallback: If anonymous sign-in fails, we must ensure we aren't using a stale UID
        // which would cause "Access denied" errors in Firestore.
        const currentSessionId = getSessionId();
        // Simple check: if it looks like a Firebase UID (28 chars) but we aren't logged in, clear it.
        if (currentSessionId && currentSessionId.length === 28) {
          console.warn("[Cart] Clearing stale UID session ID after auth failure.");
          document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0`;
          localStorage.removeItem('hypvzn_session_id');
        }
      });
      // Don't return here, it will trigger again when anonymous user is ready
      return;
    }
    
    const newId = user.uid;
    console.log(`[Cart] Auth event: ${user.isAnonymous ? 'Guest (Anonymous)' : 'User'}. ID: ${newId}`);
    
    // Small delay to let Firestore settle and tokens propagate
    setTimeout(() => {
      if (isMounted) startListening(newId);
    }, 500);
  });

  // Initial catch for the current state
  const initialId = auth.currentUser ? auth.currentUser.uid : getSessionId();
  if (initialId) {
    setTimeout(() => {
      if (isMounted) startListening(initialId);
    }, 100);
  }

  return () => {
    isMounted = false;
    unsubscribeAuth();
    if (unsubscribeSnapshot) unsubscribeSnapshot();
  };
};

/**
 * Adds a product to the cart (client-side).
 */
export const addToCart = async (product: Product, quantity: number, options?: { size?: string; color?: string }) => {
  const cartRef = getCartRef();
  const cartDoc = await getDoc(cartRef);
  let items: CartItem[] = [];

  if (cartDoc.exists()) {
    items = (cartDoc.data() as Cart).items || [];
  }

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

  const sessionId = getSessionId();
  await setDoc(cartRef, { 
    items,
    ownerId: sessionId,
    updatedAt: new Date()
  }, { merge: true });
};

/**
 * Removes a product from the cart (client-side).
 */
export const removeFromCart = async (productId: string, options?: { size?: string; color?: string }) => {
  const cartRef = getCartRef();
  const cartDoc = await getDoc(cartRef);

  if (cartDoc.exists()) {
    const items = (cartDoc.data() as Cart).items.filter((item) => {
      const isSameProduct = item.product.id === productId;
      const isSameSize = !options?.size || item.selectedSize === options.size;
      const isSameColor = !options?.color || item.selectedColor === options.color;
      return !(isSameProduct && isSameSize && isSameColor);
    });
    const sessionId = getSessionId();
    await setDoc(cartRef, { 
      items,
      ownerId: sessionId,
      updatedAt: new Date()
    }, { merge: true });
  }
};

/**
 * Updates the quantity of an item in the cart (client-side).
 */
export const updateQuantity = async (productId: string, quantity: number, options?: { size?: string; color?: string }) => {
  const cartRef = getCartRef();
  const cartDoc = await getDoc(cartRef);

  if (cartDoc.exists()) {
    const items = (cartDoc.data() as Cart).items.map((item) => {
      const isSameProduct = item.product.id === productId;
      const isSameSize = !options?.size || item.selectedSize === options.size;
      const isSameColor = !options?.color || item.selectedColor === options.color;
      
      if (isSameProduct && isSameSize && isSameColor) {
        return { ...item, quantity };
      }
      return item;
    });
    const sessionId = getSessionId();
    await setDoc(cartRef, { 
      items,
      ownerId: sessionId,
      updatedAt: new Date()
    }, { merge: true });
  }
};

/**
 * Clears the cart (client-side).
 */
export const clearCart = async () => {
  const cartRef = getCartRef();
  await setDoc(cartRef, { items: [] });
};
