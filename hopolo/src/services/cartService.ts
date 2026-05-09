import { onSnapshot, doc, getDoc, setDoc, type Unsubscribe } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getSessionId } from '../lib/session';
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
  return onSnapshot(getCartRef(), (doc) => {
    if (doc.exists()) {
      const data = doc.data() as Cart;
      callback(data.items || []);
    } else {
      callback([]);
    }
  });
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

  const existingItemIndex = items.findIndex((item) => {
    const isSameProduct = item.product.id === product.id;
    const isSameSize = item.selectedSize === options?.size;
    const isSameColor = item.selectedColor === options?.color;
    return isSameProduct && isSameSize && isSameColor;
  });

  if (existingItemIndex > -1) {
    items[existingItemIndex].quantity += quantity;
  } else {
    items.push({ 
      product, 
      quantity,
      ...(options?.size && { selectedSize: options.size }),
      ...(options?.color && { selectedColor: options.color })
    });
  }

  await setDoc(cartRef, { items }, { merge: true });
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
    await setDoc(cartRef, { items }, { merge: true });
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
    await setDoc(cartRef, { items }, { merge: true });
  }
};

/**
 * Clears the cart (client-side).
 */
export const clearCart = async () => {
  const cartRef = getCartRef();
  await setDoc(cartRef, { items: [] });
};
