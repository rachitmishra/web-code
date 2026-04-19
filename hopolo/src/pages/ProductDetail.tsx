import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLoaderData, useSubmit, useActionData } from 'react-router-dom';
import Button from '../components/ui/Button/Button';
import QuantitySelector from '../components/ui/QuantitySelector/QuantitySelector';
import ProductCard from '../components/ui/ProductCard/ProductCard';
import styles from './ProductDetail.module.css';
import { type Product } from '../services/productService';
import { fetchProductById, fetchProducts } from '../services/productService.server';
import { type Review } from '../services/reviewService';
import { fetchReviews, addReview } from '../services/reviewService.server';
import { fetchPDPLayout } from '../services/storefrontService.server';
import { type PDPLayout } from '../services/storefrontService';
import { addToCart } from '../services/cartService.server';
import { auth } from '../lib/firebase';
import { getAuthenticatedUser } from '../lib/auth.server';
import { getSessionIdFromRequest } from '../lib/session';
import { useSEO } from '../hooks/useSEO';
import PluginRenderer from '../plugins/PluginRenderer';

export async function loader({ params }: { params: any }) {
  const { id } = params;
  if (!id) throw new Response("Product ID required", { status: 400 });

  try {
    const [product, reviews, allProducts, layout] = await Promise.all([
      fetchProductById(id),
      fetchReviews(id),
      fetchProducts(),
      fetchPDPLayout()
    ]);

    if (!product) throw new Response("Product not found", { status: 404 });

    const relatedProducts = allProducts
      .filter(p => p.category === product.category && p.id !== id)
      .slice(0, 4);

    return { product, reviews, relatedProducts, layout };
  } catch (error) {
    console.error("[ProductDetail Loader] Error:", error);
    throw error;
  }
}

export async function action({ request, params }: { request: Request, params: any }) {
  const { id: productId } = params;
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "add-review") {
    const user = await getAuthenticatedUser(request);
    if (!user) throw new Response("Unauthorized", { status: 401 });
    
    const rating = parseInt(formData.get("rating") as string, 10);
    const comment = formData.get("comment") as string;
    const userName = formData.get("userName") as string;

    await addReview({
      productId,
      userId: user.uid,
      userName: userName || 'Friend',
      rating,
      comment
    });
    return { success: true };
  }

  if (intent === "add-to-cart") {
    const sessionId = getSessionIdFromRequest(request);
    const quantity = parseInt(formData.get("quantity") as string, 10);
    const size = formData.get("size") as string;
    const color = formData.get("color") as string;
    const productJson = formData.get("product") as string;
    
    try {
      const product = JSON.parse(productJson);
      await addToCart(sessionId, product, quantity, { size, color });
      return { success: true, cartUpdated: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  return null;
}

const ProductDetail: React.FC = () => {
  const { product, reviews, relatedProducts, layout } = useLoaderData() as {
    product: Product;
    reviews: Review[];
    relatedProducts: Product[];
    layout: PDPLayout;
  };
  const actionData = useActionData() as { success?: boolean; cartUpdated?: boolean; error?: string };
  const submit = useSubmit();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
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
      setAdding(false);
    }
  }, [actionData]);

  const handleAddToCart = (p: Product = product!, q: number = quantity) => {
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
    submit(
      { 
        intent: "add-to-cart", 
        product: JSON.stringify(p), 
        quantity: q.toString(),
        size: selectedSize || "",
        color: selectedColor || ""
      },
      { method: "post" }
    );
  };

  const handleAddReview = async (rating: number, comment: string) => {
    if (!auth.currentUser) return;
    
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
    user: auth.currentUser,
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
