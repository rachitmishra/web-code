import React, { useState, useEffect } from "react";
import { useNavigate, useLoaderData, useSubmit, useActionData } from "react-router";
import { type Product, type Category } from '../../services/productService';
import { type StorefrontSettings, DEFAULT_HOME_LAYOUT } from '../../services/storefrontService';
import { useSEO } from '../../hooks/useSEO';
import { HomeProvider } from './Context';
import PluginRenderer from '../../plugins/PluginRenderer';
import QuickViewModal from '../../components/ui/QuickView/QuickViewModal';
import { getSessionId } from '../../lib/session';
import styles from './Home.module.css';

// Re-export server-side functions from the server-only module
// React Router v7 will automatically remove these exports from the client bundle
export { loader, action } from './Home.server';

const Home: React.FC = () => {
  const { products, categories, bestSellers, settings } = useLoaderData() as {
    products: Product[];
    categories: Category[];
    bestSellers: Product[];
    settings: StorefrontSettings;
  };

  const actionData = useActionData() as { success?: boolean; error?: string };
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [isGridChanging, setIsGridChanging] = useState(false);
  
  // Cart Feedback State
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const [successProductId, setSuccessProductId] = useState<string | null>(null);
  
  // Quick View State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  const navigate = useNavigate();
  const submit = useSubmit();

  const seoTitle = activeCategoryId === 'all' 
    ? settings.heroTitle || 'HYPVZN Boutique' 
    : `${activeCategoryId.charAt(0).toUpperCase() + activeCategoryId.slice(1)} | ${settings.heroTitle || 'HYPVZN Boutique'}`;

  useSEO({
    title: seoTitle,
    description: settings.heroSubtitle || 'Discover unique products curated just for you. Minimalist design, playful details.',
    ogType: 'website'
  });

  useEffect(() => {
    if (actionData?.success) {
      if (addingProductId) {
        const id = addingProductId;
        setAddingProductId(null);
        setSuccessProductId(id);
        setTimeout(() => setSuccessProductId(null), 2000);
      }
    } else if (actionData?.error) {
      setAddingProductId(null);
    }
  }, [actionData, addingProductId]);

  const handleCategoryChange = (id: string) => {
    if (id === activeCategoryId) return;
    
    setIsGridChanging(true);
    setTimeout(() => {
      setActiveCategoryId(id);
      setIsGridChanging(false);
    }, 300);
  };

  const handleAddToCart = async (product: Product, quantity: number = 1, size?: string, color?: string) => {
    // If product has variants and they are not selected, open Quick View
    const hasVariants = (product.sizes && product.sizes.length > 0) || (product.colors && product.colors.length > 0);
    
    if (hasVariants && !size && !color) {
      setSelectedProduct(product);
      setIsQuickViewOpen(true);
      return;
    }

    setAddingProductId(product.id);

    // 1. Client-side update for immediate feedback & LocalStorage fallback
    try {
      const { addToCart } = await import('../../services/cartService');
      await addToCart(product, quantity, { size, color });
    } catch (err) {
      console.warn("[Home] Client-side add-to-cart failed, relying on server action", err);
    }

    // 2. Server action for persistent state (standard Remix/React Router flow)
    submit(
      { 
        intent: "add-to-cart", 
        product: JSON.stringify(product),
        quantity: quantity.toString(),
        size: size || "",
        color: color || "",
        sessionId: getSessionId()
      },
      { method: "post" }
    );
  };

  const scrollToProducts = () => {
    document.getElementById('product-grid-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const layout = settings.homeLayout || DEFAULT_HOME_LAYOUT;

  return (
    <HomeProvider
      settings={settings}
      products={products}
      categories={categories}
      bestSellers={bestSellers}
      actions={{
        handleAddToCart: (p, q, s, c) => handleAddToCart(p, q, s, c),
        handleCategoryChange,
        navigate,
        scrollToProducts
      }}
      state={{
        activeCategoryId,
        isGridChanging,
        addingProductId,
        successProductId
      }}
    >
      <div className={styles.container}>
        {actionData?.error && (
          <div 
            style={{ 
              backgroundColor: 'rgba(255, 0, 0, 0.1)', 
              color: 'var(--color-danger)', 
              padding: '1rem', 
              borderRadius: 'var(--radius-md)', 
              marginBottom: '2rem',
              textAlign: 'center',
              border: '1px solid var(--color-danger)',
              zIndex: 10
            }}
          >
            {actionData.error}
          </div>
        )}
        <PluginRenderer layout={layout} />

        {selectedProduct && (
          <QuickViewModal
            product={selectedProduct}
            isOpen={isQuickViewOpen}
            onClose={() => setIsQuickViewOpen(false)}
            onAddToCart={handleAddToCart}
          />
        )}
      </div>
    </HomeProvider>
  );
};

export default Home;
