import { createSessionCookie } from '../lib/auth.server';
import { getSecureProfile } from '../services/profileService.server';

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

    console.log(`[Login Action] Params - UID: ${uid}, From: ${from}`);

    if (!idToken || !uid) {
      console.warn("[Login Action] Missing idToken or uid");
      return new Response(JSON.stringify({ success: false, error: "Missing required authentication data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 1. Create secure session cookie
    console.log("[Login Action] Creating session cookie...");
    const { cookie } = await createSessionCookie(idToken);
    console.log("[Login Action] Session cookie created");
    
    // 2. Fetch profile for role-based redirect
    console.log(`[Login Action] Fetching profile for ${uid}...`);
    const profile = await getSecureProfile(uid);
    const role = profile?.role || 'user';
    console.log(`[Login Action] Profile fetched. Role: ${role}`);

    // 3. Determine redirect target
    let target = role === 'admin' ? '/admin' : (from || '/profile');
    
    // Safety check: only redirect to internal paths
    if (target.startsWith('http') || !target.startsWith('/')) {
      target = role === 'admin' ? '/admin' : '/profile';
    }

    console.log(`[Login Action] Success. Redirecting to: ${target}`);

    return new Response(JSON.stringify({ 
      success: true, 
      role, 
      target 
    }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Set-Cookie": cookie,
      },
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
