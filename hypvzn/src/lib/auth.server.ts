import { adminAuth } from './firebase-admin.server';

const SESSION_COOKIE_NAME = 'hypvzn_session';
const FIVE_DAYS_IN_MS = 60 * 60 * 24 * 5 * 1000;

/**
 * Creates a secure Firebase Session Cookie from an ID Token.
 */
export async function createSessionCookie(idToken: string) {
  const isDev = typeof process !== 'undefined' && process.env.NODE_ENV !== 'production';
  
  // Support Mock Mode in development
  if (idToken === 'mock-id-token-123' && isDev) {
    console.warn("[AuthServer] Creating MOCK session cookie for development.");
    const mockSessionCookie = 'mock-session-cookie-123';
    return {
      cookie: `${SESSION_COOKIE_NAME}=${mockSessionCookie}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${FIVE_DAYS_IN_MS / 1000}`,
      expires: FIVE_DAYS_IN_MS
    };
  }

  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: FIVE_DAYS_IN_MS,
  });
  
  const isProd = typeof process !== 'undefined' && process.env.NODE_ENV === 'production';
  const cookieOptions = [
    `${SESSION_COOKIE_NAME}=${sessionCookie}`,
    "Path=/",
    "HttpOnly",
    isProd ? "Secure" : "",
    "SameSite=Lax",
    `Max-Age=${FIVE_DAYS_IN_MS / 1000}`
  ].filter(Boolean).join("; ");

  return {
    cookie: cookieOptions,
    expires: FIVE_DAYS_IN_MS
  };
}

/**
 * Clears the session cookie.
 */
export function getSignOutCookie() {
  const isProd = typeof process !== 'undefined' && process.env.NODE_ENV === 'production';
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly;${isProd ? ' Secure;' : ''} SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

/**
 * Gets the authenticated user from the request using the Firebase Session Cookie.
 */
export async function getAuthenticatedUser(request: Request) {
  const cookieHeader = request.headers.get('Cookie');
  console.log(`[getAuthenticatedUser] Cookie Header: ${cookieHeader ? 'Present' : 'Missing'}`);
  
  if (!cookieHeader) return null;

  const sessionCookie = cookieHeader
    .split(';')
    .find(row => row.trim().startsWith(`${SESSION_COOKIE_NAME}=`))
    ?.split('=')[1]
    ?.trim();

  if (!sessionCookie) {
    console.log("[getAuthenticatedUser] No session cookie found");
    return null;
  }

  const isDev = typeof process !== 'undefined' && process.env.NODE_ENV !== 'production';
  if (sessionCookie === 'mock-session-cookie-123' && isDev) {
    console.log("[getAuthenticatedUser] Success for MOCK user");
    return {
      uid: 'mock-user-123',
      email: 'mock@example.com',
      phoneNumber: '+919999999999'
    };
  }

  try {
    // Verify the session cookie. checkRevoked: true is more secure but adds a network request.
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    console.log(`[getAuthenticatedUser] Success for UID: ${decodedClaims.uid}`);
    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
      phoneNumber: decodedClaims.phone_number
    };
  } catch (error: any) {
    console.error("[getAuthenticatedUser] Verification failed:", error.message);
    return null;
  }
}

/**
 * Middleware-like function to require a specific role.
 */
export async function requireRole(request: Request, allowedRoles: string[]) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    console.log("[requireRole] No authenticated user");
    throw new Response("Unauthorized", { status: 401 });
  }

  const { adminDb } = await import('./firebase-admin.server');
  const profileDoc = await adminDb.collection('profiles').doc(user.uid).get();
  
  if (!profileDoc.exists) {
    console.warn(`[requireRole] Profile not found for UID: ${user.uid}`);
    throw new Response("Profile not found", { status: 404 });
  }

  const role = profileDoc.data()?.role || 'user';
  console.log(`[requireRole] User: ${user.uid}, Role: ${role}, Allowed: ${allowedRoles.join(',')}`);
  
  if (!allowedRoles.includes(role)) {
    console.warn(`[requireRole] Access denied. User role: ${role}`);
    throw new Response("Forbidden", { status: 403 });
  }

  return { user, role };
}
