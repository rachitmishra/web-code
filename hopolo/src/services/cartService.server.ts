import { adminDb, FieldValue } from '../lib/firebase-admin.server';
import { type CartItem, type Cart } from './cartService';
import { type Product } from './productService';

const getCartRef = (sessionId: string) => {
  return adminDb.collection('carts').doc(sessionId);
};

export const getCart = async (sessionId: string): Promise<CartItem[]> => {
  if (!sessionId) return [];
  const doc = await getCartRef(sessionId).get();
  if (doc.exists) {
    return (doc.data() as Cart).items || [];
  }
  return [];
};

/**
 * Ensures a cart exists and returns it. If it doesn't exist, it creates an empty one.
 */
export const getOrCreateCart = async (sessionId: string): Promise<CartItem[]> => {
  if (!sessionId) return [];
  
  const cartRef = getCartRef(sessionId);
  const doc = await cartRef.get();
  
  if (doc.exists) {
    const data = doc.data() as Cart;
    // Check if ownerId is missing or wrong
    if (!data.ownerId || data.ownerId !== sessionId) {
      console.log(`[cartService.server] Fixing ownership for cart: ${sessionId}`);
      await cartRef.set({
        ownerId: sessionId,
        updatedAt: FieldValue.serverTimestamp()
      }, { merge: true });
    }
    return data.items || [];
  }
  
  // Create empty cart with ownership
  console.log(`[cartService.server] Initializing new cart for session: ${sessionId}`);
  try {
    await cartRef.set({
      items: [],
      ownerId: sessionId,
      updatedAt: FieldValue.serverTimestamp()
    });
    console.log(`[cartService.server] Cart ${sessionId} created successfully with ownerId: ${sessionId}`);
  } catch (err) {
    console.error(`[cartService.server] Failed to create cart ${sessionId}:`, err);
  }
  
  return [];
};

export const addToCart = async (sessionId: string, product: Product, quantity: number, options?: { size?: string; color?: string }) => {
  if (!sessionId) throw new Error('Session ID required');
  
  const cartRef = getCartRef(sessionId);
  const cartDoc = await cartRef.get();
  let items: CartItem[] = [];

  if (cartDoc.exists) {
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

  await cartRef.set({ 
    items,
    ownerId: sessionId,
    updatedAt: FieldValue.serverTimestamp()
  }, { merge: true });
};

export const removeFromCart = async (sessionId: string, productId: string, options?: { size?: string; color?: string }) => {
  if (!sessionId) return;
  const cartRef = getCartRef(sessionId);
  const cartDoc = await cartRef.get();

  if (cartDoc.exists) {
    const items = (cartDoc.data() as Cart).items.filter((item) => {
      const isSameProduct = item.product.id === productId;
      const isSameSize = !options?.size || item.selectedSize === options.size;
      const isSameColor = !options?.color || item.selectedColor === options.color;
      return !(isSameProduct && isSameSize && isSameColor);
    });
    await cartRef.set({ 
      items, 
      ownerId: sessionId, 
      updatedAt: FieldValue.serverTimestamp() 
    }, { merge: true });
  }
};

export const updateQuantity = async (sessionId: string, productId: string, quantity: number, options?: { size?: string; color?: string }) => {
  if (!sessionId) return;
  const cartRef = getCartRef(sessionId);
  const cartDoc = await cartRef.get();

  if (cartDoc.exists) {
    const items = (cartDoc.data() as Cart).items.map((item) => {
      const isSameProduct = item.product.id === productId;
      const isSameSize = !options?.size || item.selectedSize === options.size;
      const isSameColor = !options?.color || item.selectedColor === options.color;
      
      if (isSameProduct && isSameSize && isSameColor) {
        return { ...item, quantity };
      }
      return item;
    });
    await cartRef.set({ 
      items, 
      ownerId: sessionId, 
      updatedAt: FieldValue.serverTimestamp() 
    }, { merge: true });
  }
};

export const clearCart = async (sessionId: string) => {
  if (!sessionId) return;
  const cartRef = getCartRef(sessionId);
  await cartRef.set({ items: [] });
};

export const migrateCart = async (guestSessionId: string, userUid: string) => {
  if (!guestSessionId || !userUid || guestSessionId === userUid) return;
  
  const guestCartRef = getCartRef(guestSessionId);
  const userCartRef = getCartRef(userUid);
  
  const [guestDoc, userDoc] = await Promise.all([
    guestCartRef.get(),
    userCartRef.get()
  ]);
  
  if (!guestDoc.exists) return;
  
  const guestItems = (guestDoc.data() as Cart).items || [];
  if (guestItems.length === 0) return;
  
  let userItems: CartItem[] = [];
  if (userDoc.exists) {
    userItems = (userDoc.data() as Cart).items || [];
  }
  
  // Merge guest items into user items
  const mergedItems = [...userItems];
  
  for (const guestItem of guestItems) {
    const existingIndex = mergedItems.findIndex(item => 
      item.product.id === guestItem.product.id && 
      item.selectedSize === guestItem.selectedSize && 
      item.selectedColor === guestItem.selectedColor
    );
    
    if (existingIndex > -1) {
      mergedItems[existingIndex].quantity += guestItem.quantity;
    } else {
      mergedItems.push(guestItem);
    }
  }
  
  // Update user cart and clear guest cart
  await Promise.all([
    userCartRef.set({ 
      items: mergedItems, 
      ownerId: userUid, 
      updatedAt: FieldValue.serverTimestamp() 
    }, { merge: true }),
    guestCartRef.delete()
  ]);
};
