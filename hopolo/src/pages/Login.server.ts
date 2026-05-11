import { createSessionCookie } from '../lib/auth.server';
import { getSecureProfile } from '../services/profileService.server';
import { migrateCart } from '../services/cartService.server';
import { getSessionIdFromRequest, SESSION_COOKIE_NAME } from '../lib/session';

/**
 * Server action to handle login and set secure session cookie.
 */
export async function action({ request }: { request: Request }) {
  console.log("[Login Action] Received request");

  try {
    const formData = await request.formData();
    const idToken = formData.get("idToken") as string;
    const uid = formData.get("uid") as string;
    const from = formData.get("from") as string;
    const localCartItemsJson = formData.get("localCartItems") as string;

    console.log(`[Login Action] Params - UID: ${uid}, From: ${from}`);

    if (!idToken || !uid) {
      console.warn("[Login Action] Missing idToken or uid");
      return new Response(JSON.stringify({ success: false, error: "Missing required authentication data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 1. Perform Cart Migration (Remote Guest Cart -> User Cart)
    const guestSessionId = getSessionIdFromRequest(request);
    if (guestSessionId && guestSessionId !== uid) {
      console.log(`[Login Action] Migrating remote cart from ${guestSessionId} to ${uid}`);
      await migrateCart(guestSessionId, uid).catch(err => {
        console.error("[Login Action] Remote cart migration failed:", err);
      });
    }

    // 2. Perform Local Cart Sync (Client LocalStorage -> User Cart)
    if (localCartItemsJson && localCartItemsJson !== "[]") {
      try {
        const localItems = JSON.parse(localCartItemsJson);
        if (localItems.length > 0) {
          console.log(`[Login Action] Syncing ${localItems.length} items from localStorage to ${uid}`);
          const { addToCart: serverAddToCart } = await import('../services/cartService.server');
          // Add each local item to the user's cart on the server
          for (const item of localItems) {
            await serverAddToCart(uid, item.product, item.quantity, { 
              size: item.selectedSize, 
              color: item.selectedColor 
            });
          }
        }
      } catch (err) {
        console.error("[Login Action] Local cart sync failed:", err);
      }
    }

    // 3. Fetch/Initialize profile for role-based redirect
    console.log(`[Login Action] Fetching/Initializing profile for ${uid}...`);
    const profile = await getSecureProfile(uid);
    const role = profile?.role || 'user';
    console.log(`[Login Action] Profile ready. Role: ${role}`);

    // 3. Ensure User Cart is initialized
    console.log(`[Login Action] Initializing user cart for ${uid}...`);
    const { getOrCreateCart } = await import('../services/cartService.server');
    await getOrCreateCart(uid);

    // 4. Create secure session cookie
    console.log("[Login Action] Creating session cookie...");
    const { cookie } = await createSessionCookie(idToken);

    // 5. Determine redirect target
    let target = role === 'admin' ? '/admin' : (from || '/profile');
    
    // Safety check: only redirect to internal paths
    if (target.startsWith('http') || !target.startsWith('/')) {
      target = role === 'admin' ? '/admin' : '/profile';
    }

    console.log(`[Login Action] Success. Redirecting to: ${target}`);

    const cartCookie = `${SESSION_COOKIE_NAME}=${uid}; Path=/; Max-Age=${60 * 60 * 24 * 5}; SameSite=Lax`;

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Set-Cookie", cookie);
    headers.append("Set-Cookie", cartCookie);

    return new Response(JSON.stringify({ 
      success: true, 
      role, 
      target 
    }), {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error("[Login Action] Critical Error:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || "Internal server error",
      stack: error.stack
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
