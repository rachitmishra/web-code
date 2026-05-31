import React, { useState, useEffect } from "react";
import { useLoaderData, useSubmit, useActionData, useNavigate, useLocation } from "react-router";
import Card from "../components/ui/Card/Card";
import Button from "../components/ui/Button/Button";
import Input from "../components/ui/Input/Input";
import styles from "./Checkout.module.css";
import { type CartItem } from "../services/cartService";
import { type Address } from "../services/profileService";
import { loadRazorpayScript } from "../services/paymentService";

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Re-export loader and action from server-only module
export { loader, action } from './Checkout.server';

const Checkout: React.FC = () => {
  const { items, addresses, user } = useLoaderData() as { items: CartItem[], addresses: Address[], user: any };
  const actionData = useActionData() as { success: boolean, orderId?: string, error?: string };
  const submit = useSubmit();
  const navigate = useNavigate();
  const location = useLocation();

  const { discount = 0, appliedCode = "" } = (location.state as { discount?: number, appliedCode?: string }) || {};

  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(addresses.length > 0 ? 0 : -1);
  const [newAddress, setNewAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [isAddingNew, setIsAddingNew] = useState(addresses.length === 0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (actionData?.success && actionData.orderId) {
      navigate(`/checkout/success/${actionData.orderId}`);
    }
  }, [actionData, navigate]);

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const shipping = 5.99;
  const total = Math.max(0, subtotal + shipping - discount);

  const handlePayment = async () => {
    const finalAddress = isAddingNew ? newAddress : addresses[selectedAddressIndex];
    if (!finalAddress.street || !finalAddress.city || !finalAddress.zip) {
      alert("Please provide a complete shipping address.");
      return;
    }

    setLoading(true);
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    const options = {
      key: (import.meta.env?.VITE_RAZORPAY_KEY_ID || (typeof process !== 'undefined' ? process.env.VITE_RAZORPAY_KEY_ID : undefined)) || "rzp_test_placeholder",
      amount: Math.round(total * 100),
      currency: "USD",
      name: "HYPVZN",
      description: "Order Payment",
      handler: function (response: any) {
        console.log("Payment Success:", response);
        submit(
          { 
            intent: "create-order", 
            orderData: JSON.stringify({
              userId: user?.uid || 'anonymous',
              userEmail: user?.email || '',
              items,
              total,
              paymentId: response.razorpay_payment_id,
              status: "paid",
              address: finalAddress
            })
          },
          { method: "post" }
        );
      },
      prefill: {
        name: user?.displayName || "",
        email: user?.email || "",
        contact: user?.phoneNumber || "",
      },
      theme: {
        color: "#5D3FD3",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setLoading(false);
  };

  if (items.length === 0 && !actionData?.success) {
    return (
      <div className={styles.container}>
        <Card style={{ textAlign: 'center', padding: 'var(--spacing-12)' }}>
          <h2>Your bag is empty</h2>
          <p>Please add some items to your bag before checking out.</p>
          <Button onClick={() => navigate("/")} style={{ marginTop: '2rem' }}>
            Go Shopping
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Checkout</h1>
      
      <div className={styles.grid}>
        <div className={styles.main}>
          <section className={styles.section}>
            <h3>Shipping Address</h3>
            
            {addresses.length > 0 && !isAddingNew && (
              <div className={styles.addressList}>
                {addresses.map((addr, idx) => (
                  <div 
                    key={idx} 
                    className={`${styles.addressCard} ${selectedAddressIndex === idx ? styles.selected : ''}`}
                    onClick={() => setSelectedAddressIndex(idx)}
                  >
                    <p>{addr.street}</p>
                    <p>{addr.city}, {addr.state} {addr.zip}</p>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddingNew(true)}
                  style={{ marginTop: '1rem' }}
                >
                  Add New Address
                </Button>
              </div>
            )}

            {(isAddingNew || addresses.length === 0) && (
              <div className={styles.newAddressForm}>
                <Input
                  label="Street Address"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  required
                />
                <div className={styles.formRow}>
                  <Input
                    label="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    required
                  />
                  <Input
                    label="State"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    required
                  />
                  <Input
                    label="Zip Code"
                    value={newAddress.zip}
                    onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                    required
                  />
                </div>
                {addresses.length > 0 && (
                  <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                    Use Saved Address
                  </Button>
                )}
              </div>
            )}
          </section>

          <section className={styles.section}>
            <h3>Review Items</h3>
            <div className={styles.itemList}>
              {items.map((item, idx) => (
                <div key={idx} className={styles.item}>
                  <img src={item.product.image} alt={item.product.name} className={styles.itemImage} />
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{item.product.name}</p>
                    <p className={styles.itemMeta}>
                      {item.selectedSize && `Size: ${item.selectedSize}`}
                      {item.selectedColor && ` | Color: ${item.selectedColor}`}
                    </p>
                    <p className={styles.itemPrice}>Qty: {item.quantity} x ${item.product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className={styles.sidebar}>
          <Card className={styles.summaryCard}>
            <h3>Order Summary</h3>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className={styles.summaryRow} style={{ color: 'var(--color-secondary)' }}>
                <span>Discount ({appliedCode})</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            
            <hr />
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <Button 
              className={styles.payButton} 
              onClick={handlePayment}
              loading={loading}
              disabled={items.length === 0}
            >
              Pay Now
            </Button>

            <p className={styles.secureNote}>
              🔒 Secure payment powered by Razorpay
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
