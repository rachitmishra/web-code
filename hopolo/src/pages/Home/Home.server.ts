import { fetchProducts, fetchCategories, fetchBestSellers } from '../../services/productService.server';
import { getStorefrontSettings } from '../../services/storefrontService.server';
import { addToCart } from '../../services/cartService.server';
import { DEFAULT_SETTINGS } from '../../services/storefrontService';
import { getSessionIdFromRequest, SESSION_COOKIE_NAME } from '../../lib/session';

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
  
  if (!sessionId) {
    console.warn("[Home Action] Session ID missing from request cookies. Attempting fallback.");
    sessionId = "temp-" + Math.random().toString(36).substring(7);
  }
  
  console.log(`[Home Action] Intent: ${intent}, SessionID: ${sessionId}`);

  if (intent === "add-to-cart") {
    const productJson = formData.get("product") as string;
    const quantity = parseInt(formData.get("quantity") as string || "1", 10);
    const size = formData.get("size") as string || "";
    const color = formData.get("color") as string || "";

    if (!productJson) {
      console.warn("[Home Action] Product data missing");
      return { success: false, error: "Product data missing" };
    }
    try {
      const product = JSON.parse(productJson);
      if (!product || !product.id) {
        throw new Error("Invalid product data");
      }
      console.log(`[Home Action] Adding product to cart: ${product.name} (Qty: ${quantity}, Size: ${size}, Color: ${color})`);
      await addToCart(sessionId, product, quantity, { size, color });
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
