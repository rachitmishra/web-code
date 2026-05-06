import React, { useState, useMemo } from "react";
import { useNavigate, useLoaderData, useSubmit, useActionData } from "react-router-dom";
import { type Product, type Category } from '../../services/productService';
import { fetchProducts, fetchCategories, fetchBestSellers } from '../../services/productService.server';
import { type StorefrontSettings, DEFAULT_SETTINGS, DEFAULT_HOME_LAYOUT } from '../../services/storefrontService';
import { getStorefrontSettings } from '../../services/storefrontService.server';
import { addToCart } from '../../services/cartService.server';
import { getSessionIdFromRequest } from '../../lib/session';
import { useSEO } from '../../hooks/useSEO';
import { HomeProvider } from './Context';
import PluginRenderer from '../../plugins/PluginRenderer';
import styles from './Home.module.css';

export async function loader() {
  try {
    const [fProducts, fCategories, fBestSellers, fSettings] = await Promise.all([
      fetchProducts(),
      fetchCategories(),
      fetchBestSellers(),
      getStorefrontSettings()
    ]);

    const fetchedCats = fCategories || [];
    const categories = fetchedCats.find((c) => c.id === "all") 
      ? fetchedCats 
      : [{ id: "all", name: "All" }, ...fetchedCats];

    return {
      products: fProducts || [],
      categories,
      bestSellers: fBestSellers || [],
      settings: fSettings || DEFAULT_SETTINGS
    };
  } catch (error) {
    console.error("[Home Loader] Error loading data:", error);
    return {
      products: [],
      categories: [{ id: "all", name: "All" }],
      bestSellers: [],
      settings: DEFAULT_SETTINGS
    };
  }
}

export async function action({ request }: { request: Request }) {
  const sessionId = getSessionIdFromRequest(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "add-to-cart") {
    const productJson = formData.get("product") as string;
    if (!productJson) {
      return { success: false, error: "Product data missing" };
    }
    try {
      const product = JSON.parse(productJson);
      if (!product || !product.id) {
        throw new Error("Invalid product data");
      }
      await addToCart(sessionId, product, 1);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
  return null;
}

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
  
  const navigate = useNavigate();
  const submit = useSubmit();

  const seoTitle = activeCategoryId === 'all' 
    ? settings.heroTitle || 'Hopolo Boutique' 
    : `${activeCategoryId.charAt(0).toUpperCase() + activeCategoryId.slice(1)} | ${settings.heroTitle || 'Hopolo Boutique'}`;

  useSEO({
    title: seoTitle,
    description: settings.heroSubtitle || 'Discover unique products curated just for you. Minimalist design, playful details.',
    ogType: 'website'
  });

  const handleCategoryChange = (id: string) => {
    if (id === activeCategoryId) return;
    
    setIsGridChanging(true);
    setTimeout(() => {
      setActiveCategoryId(id);
      setIsGridChanging(false);
    }, 300);
  };

  const handleAddToCart = (product: Product) => {
    submit(
      { intent: "add-to-cart", product: JSON.stringify(product) },
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
        handleAddToCart,
        handleCategoryChange,
        navigate,
        scrollToProducts
      }}
      state={{
        activeCategoryId,
        isGridChanging
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
      </div>
    </HomeProvider>
  );
};

export default Home;
