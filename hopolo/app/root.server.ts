import { getSessionIdFromRequest, SESSION_COOKIE_NAME } from "../src/lib/session";
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_SETTINGS } from "../src/services/storefrontService";

export async function loader({ request }: { request: Request }) {
  const { handleRedirects } = await import("../src/lib/redirects.server");
  const { getAuthenticatedUser } = await import("../src/lib/auth.server");
  const { getSecureProfile } = await import("../src/services/profileService.server");
  const { getStorefrontSettings } = await import("../src/services/storefrontService.server");

  await handleRedirects(request);
  
  const user = await getAuthenticatedUser(request);

  const existingSessionId = getSessionIdFromRequest(request);
  
  const [profile, settings] = await Promise.all([
    user ? getSecureProfile(user.uid) : Promise.resolve(null),
    getStorefrontSettings()
  ]);

  // Use UID as sessionId if logged in, otherwise use existing cookie or new UUID
  const sessionId = user ? user.uid : (existingSessionId || uuidv4());
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  
  // Update cookie if it's missing or if it's different from the authenticated UID
  if (!existingSessionId || (user && existingSessionId !== user.uid)) {
    headers.append("Set-Cookie", `${SESSION_COOKIE_NAME}=${sessionId}; Path=/; Max-Age=${60 * 60 * 24 * 5}; SameSite=Lax`);
  }

  return new Response(JSON.stringify({ 
    serverUser: user, 
    role: profile?.role || 'user',
    settings: settings || DEFAULT_SETTINGS
  }), {
    headers
  });
}
