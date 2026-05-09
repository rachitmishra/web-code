import React, { useState, useMemo } from "react";
import { useNavigate, useLoaderData, useSubmit, useActionData } from "react-router";
import { type Product, type Category } from '../../services/productService';
import { fetchProducts, fetchCategories, fetchBestSellers } from '../../services/productService.server';
import { type StorefrontSettings, DEFAULT_SETTINGS, DEFAULT_HOME_LAYOUT } from '../../services/storefrontService';
import { getStorefrontSettings } from '../../services/storefrontService.server';
import { addToCart } from '../../services/cartService.server';
import { getSessionIdFromRequest, SESSION_COOKIE_NAME } from '../../lib/session';
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
  console.log("[Home Action] Received request");
  let sessionId = getSessionIdFromRequest(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  
  // Robust session handling: if missing, try to get from somewhere else or generate
  if (!sessionId) {
    console.warn("[Home Action] Session ID missing from request cookies. Attempting fallback.");
    // In a real app, we might check a header or similar. 
    // For now, let's generate a temporary one so it doesn't throw, 
    // but ideally the root loader should have ensured it exists.
    sessionId = "temp-" + Math.random().toString(36).substring(7);
  }
  
  console.log(`[Home Action] Intent: ${intent}, SessionID: ${sessionId}`);

  if (intent === "add-to-cart") {
    const productJson = formData.get("product") as string;
    if (!productJson) {
      console.warn("[Home Action] Product data missing");
      return { success: false, error: "Product data missing" };
    }
    try {
      const product = JSON.parse(productJson);
      if (!product || !product.id) {
        throw new Error("Invalid product data");
      }
      console.log(`[Home Action] Adding product to cart: ${product.name}`);
      await addToCart(sessionId, product, 1);
      console.log("[Home Action] Product added successfully");
      
      const headers = new Headers();
      if (sessionId.startsWith("temp-")) {
        headers.append("Set-Cookie", `${SESSION_COOKIE_NAME}=${sessionId}; Path=/; Max-Age=${60 * 60 * 24 * 5}; SameSite=Lax`);
      }
      
      return new Response(JSON.stringify({ success: true }), {
        headers: {
          ...Object.fromEntries(headers.entries()),
          "Content-Type": "application/json"
        }
      });
    } catch (err: any) {
      console.error("[Home Action] Add to Cart Error:", err.message);
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
    ? settings.heroTitle || 'HYPVZN Boutique' 
    : `${activeCategoryId.charAt(0).toUpperCase() + activeCategoryId.slice(1)} | ${settings.heroTitle || 'HYPVZN Boutique'}`;

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
