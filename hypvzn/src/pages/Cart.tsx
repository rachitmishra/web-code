import React, { useState, useEffect } from "react";
import { Link, useLoaderData, useSubmit, useActionData } from "react-router";
import Button from "../components/ui/Button/Button";
import Card from "../components/ui/Card/Card";
import QuantitySelector from "../components/ui/QuantitySelector/QuantitySelector";
import styles from "./Cart.module.css";
import { type CartItem, subscribeToCart } from "../services/cartService";

export { loader, action } from "./Cart.server";

const Cart: React.FC = () => {
  const { items: initialItems } = useLoaderData() as { items: CartItem[] };
  const actionData = useActionData() as { success: boolean; promo?: any; error?: string };
  const submit = useSubmit();

  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [loadingPromo, setLoadingPromo] = useState(false);

  // Real-time subscription to cart
  useEffect(() => {
    const unsubscribe = subscribeToCart(setItems);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (actionData) {
      setLoadingPromo(false);
      if (actionData.promo) {
        setDiscount(actionData.promo.discount);
        setAppliedCode(actionData.promo.code);
        setPromoError("");
      } else if (actionData.error) {
        setPromoError(actionData.error);
        setDiscount(0);
        setAppliedCode("");
      }
    }
  }, [actionData]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = items.length > 0 ? 5.99 : 0;
  const total = Math.max(0, subtotal + shipping - discount);

  const handleRemove = async (item: CartItem) => {
    // 1. Immediate local feedback
    try {
      const { removeFromCart } = await import('../services/cartService');
      await removeFromCart(item.product.id, { size: item.selectedSize, color: item.selectedColor });
    } catch (err) {
      console.warn("[Cart] Client-side remove failed", err);
    }

    // 2. Server action for persistent state
    submit(
      { 
        intent: "remove", 
        productId: item.product.id, 
        size: item.selectedSize || "", 
        color: item.selectedColor || "" 
      },
      { method: "post" }
    );
  };

  const handleUpdateQuantity = async (item: CartItem, q: number) => {
    // 1. Immediate local feedback
    try {
      const { updateQuantity } = await import('../services/cartService');
      await updateQuantity(item.product.id, q, { size: item.selectedSize, color: item.selectedColor });
    } catch (err) {
      console.warn("[Cart] Client-side update-quantity failed", err);
    }

    // 2. Server action for persistent state
    submit(
      { 
        intent: "update-quantity", 
        productId: item.product.id, 
        quantity: q.toString(),
        size: item.selectedSize || "", 
        color: item.selectedColor || "" 
      },
      { method: "post" }
    );
  };

  const handleApplyPromo = () => {
    setLoadingPromo(true);
    submit(
      { intent: "apply-promo", code: promoCode, subtotal: subtotal.toString() },
      { method: "post" }
    );
  };

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <h1>Shopping Cart</h1>
        <div className={styles.emptyState}>
          <p>Your cart is empty.</p>
          <Link to="/">
            <Button style={{ marginTop: "var(--spacing-4)" }}>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>YOUR BAG</h1>
        <span className={styles.itemCount}>{items.length} ITEMS REGISTERED</span>
      </div>

      <div className={styles.cartGrid}>
        <div className={styles.items}>
          {items.map((item, index) => (
            <div key={`${item.product.id}-${index}`} className={styles.item}>
              <div className={styles.itemImage}>
                {item.product.image ? (
                  <img src={item.product.image} alt={item.product.name} className={styles.grayscale} />
                ) : (
                  <div className={styles.placeholder}>
                    [IMAGE_NOT_FOUND]
                  </div>
                )}
              </div>

              <div className={styles.itemDetails}>
                <div className={styles.itemName}>{item.product.name}</div>
                <div className={styles.itemMeta}>
                  {item.selectedSize && (
                    <span>SIZE: {item.selectedSize}</span>
                  )}
                  {item.selectedColor && (
                    <span>COLOR: {item.selectedColor}</span>
                  )}
                </div>
                <div className={styles.itemPrice}>
                  ${item.product.price.toFixed(2)}
                </div>
              </div>

              <div className={styles.itemActions}>
                <QuantitySelector
                  quantity={item.quantity}
                  onChange={(q) => handleUpdateQuantity(item, q)}
                />
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemove(item)}
                  aria-label="Remove item"
                >
                  REMOVE
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.summary}>
            <h3 className={styles.summaryTitle}>ORDER SUMMARY [SYSTEM_LOG]</h3>
            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span>SUBTOTAL</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>SHIPPING (STANDARD)</span>
                <span>${shipping.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                  <span>DISCOUNT ({appliedCode})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className={styles.totalSection}>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span className={styles.totalLabel}>TOTAL</span>
                <span className={styles.totalValue}>${total.toFixed(2)}</span>
              </div>
            </div>

            <Link to="/checkout" state={{ discount, appliedCode }}>
              <Button 
                variant="primary"
                className={styles.checkoutButton}
              >
                PROCEED TO CHECKOUT
              </Button>
            </Link>

            <div className={styles.technicalNotices}>
              <div className={styles.notice}>
                [ SECURE TECHNICAL CHECKOUT ]
              </div>
              <div className={styles.notice}>
                [ SHIPS IN 48 HOURS ]
              </div>
            </div>
          </div>

          <div className={styles.promoSection}>
            <p className={styles.promoLabel}>PROMO_CODE</p>
            <div className={styles.promoInputGroup}>
              <input
                className={styles.promoInput}
                placeholder="ENTER_CODE"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button
                className={styles.promoBtn}
                onClick={handleApplyPromo}
                disabled={loadingPromo}
              >
                APPLY
              </button>
            </div>
            {promoError && (
              <div className={styles.errorText}>
                {promoError}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
