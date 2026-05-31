import React, { useState, useEffect } from 'react';
import { useNavigate, useLoaderData, useSubmit, useActionData } from 'react-router';
import Button from '../components/ui/Button/Button';
import styles from './ProductDetail.module.css';
import { type Product } from '../services/productService';
import { type Review } from '../services/reviewService';
import { type PDPLayout } from '../services/storefrontService';
import { auth } from '../lib/firebase';
import { useSEO } from '../hooks/useSEO';
import { getSessionId } from '../lib/session';
import PluginRenderer from '../plugins/PluginRenderer';

// Re-export server-side functions from the server-only module
export { loader, action } from './ProductDetail.server';

const ProductDetail: React.FC = () => {
  const { product, reviews, relatedProducts, layout, user: serverUser } = useLoaderData() as {
    product: Product;
    reviews: Review[];
    relatedProducts: Product[];
    layout: PDPLayout;
    user: any;
  };
  const actionData = useActionData() as { success?: boolean; cartUpdated?: boolean; error?: string };
  const submit = useSubmit();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

  // Review Form State
  const [submittingReview, setSubmittingReview] = useState(false);

  useSEO({
    title: product ? product.name : 'Product Details',
    description: product?.description,
    image: product?.image,
    ogType: 'product'
  });

  useEffect(() => {
    if (actionData?.success) {
      setSubmittingReview(false);
      
      if (actionData.cartUpdated) {
        setAdding(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }
    }
  }, [actionData]);

  const handleAddToCart = async (pOrEvent?: Product | React.MouseEvent, q: number = quantity) => {
    // If it's a click event from ProductInfoPlugin, use the main product
    const p = (pOrEvent && 'id' in pOrEvent) ? pOrEvent : product!;
    
    if (!p) return;
    
    if (p.sizes && p.sizes.length > 0 && !selectedSize) {
      alert('Please select a size.');
      return;
    }
    if (p.colors && p.colors.length > 0 && !selectedColor) {
      alert('Please select a color.');
      return;
    }

    setAdding(true);

    // 1. Client-side update for immediate feedback & LocalStorage fallback
    try {
      const { addToCart } = await import('../services/cartService');
      await addToCart(p, q, { size: selectedSize, color: selectedColor });
    } catch (err) {
      console.warn("[ProductDetail] Client-side add-to-cart failed, relying on server action", err);
    }

    // 2. Server action for persistent state
    submit(
      { 
        intent: "add-to-cart", 
        product: JSON.stringify(p), 
        quantity: q.toString(),
        size: selectedSize || "",
        color: selectedColor || "",
        sessionId: getSessionId()
      },
      { method: "post" }
    );
  };

  const handleAddReview = async (rating: number, comment: string) => {
    if (!auth.currentUser || auth.currentUser.isAnonymous) return;
    
    setSubmittingReview(true);
    submit(
      { 
        intent: "add-review", 
        rating: rating.toString(), 
        comment: comment,
        userName: auth.currentUser.displayName || ''
      },
      { method: "post" }
    );
  };

  const handleSignIn = () => navigate('/login');

  const pluginProps = {
    product,
    reviews,
    relatedProducts,
    user: (auth.currentUser && !auth.currentUser.isAnonymous) ? auth.currentUser : serverUser,
    quantity,
    setQuantity,
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    onAddToCart: handleAddToCart,
    onAddReview: handleAddReview,
    onProductClick: (id: string) => navigate(`/product/${id}`),
    onSignIn: handleSignIn,
    adding,
    success: showSuccess,
    submitting: submittingReview
  };

  return (
    <div className={styles.container}>
      {actionData?.error && (
        <div 
          style={{ 
            backgroundColor: 'rgba(255, 0, 0, 0.1)', 
            color: 'var(--color-danger)', 
            padding: '1rem', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '1rem',
            textAlign: 'center',
            border: '1px solid var(--color-danger)'
          }}
        >
          {actionData.error}
        </div>
      )}

      <Button variant="outline" onClick={() => navigate(-1)} style={{ width: 'fit-content' }}>
        &larr; Back
      </Button>

      <div className={styles.productInfo}>
        <PluginRenderer 
          layout={layout} 
          pluginProps={pluginProps} 
        />
      </div>
    </div>
  );
};

export default ProductDetail;
