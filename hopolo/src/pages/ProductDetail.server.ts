import { fetchProductById, fetchProducts } from '../services/productService.server';
import { fetchReviews, addReview } from '../services/reviewService.server';
import { fetchPDPLayout } from '../services/storefrontService.server';
import { addToCart } from '../services/cartService.server';
import { getAuthenticatedUser } from '../lib/auth.server';
import { getSessionIdFromRequest } from '../lib/session';

export async function loader({ params, request }: { params: any, request: Request }) {
  const { id } = params;
  if (!id) throw new Response("Product ID required", { status: 400 });

  try {
    const [product, reviews, allProducts, layout, user] = await Promise.all([
      fetchProductById(id),
      fetchReviews(id),
      fetchProducts(),
      fetchPDPLayout(),
      getAuthenticatedUser(request)
    ]);

    if (!product) throw new Response("Product not found", { status: 404 });

    const relatedProducts = allProducts
      .filter(p => p.category === product.category && p.id !== id)
      .slice(0, 4);

    return { product, reviews, relatedProducts, layout, user };
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
    let sessionId = getSessionIdFromRequest(request);
    
    if (!sessionId) {
      sessionId = "temp-" + Math.random().toString(36).substring(7);
    }

    const quantity = parseInt(formData.get("quantity") as string, 10);
    const size = formData.get("size") as string;
    const color = formData.get("color") as string;
    const productJson = formData.get("product") as string;
    
    try {
      const product = JSON.parse(productJson);
      await addToCart(sessionId, product, quantity, { size, color });
      
      const headers = new Headers();
      if (sessionId.startsWith("temp-")) {
        const { SESSION_COOKIE_NAME } = await import('../lib/session');
        headers.append("Set-Cookie", `${SESSION_COOKIE_NAME}=${sessionId}; Path=/; Max-Age=${60 * 60 * 24 * 5}; SameSite=Lax`);
      }

      return new Response(JSON.stringify({ success: true, cartUpdated: true }), {
        headers: {
          ...Object.fromEntries(headers.entries()),
          "Content-Type": "application/json"
        }
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ success: false, error: err.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  return null;
}
