import { v4 as uuidv4 } from 'uuid';
import { auth } from './firebase';

export const SESSION_COOKIE_NAME = 'hypvzn_cart_id';

export const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';

  // 0. Use UID if authenticated (Highest priority for Firestore compatibility)
  const user = auth.currentUser;
  if (user) {
    console.log(`[Session] Using AUTHENTICATED UID: ${user.uid} (Anonymous: ${user.isAnonymous})`);
    return user.uid;
  }

  // 1. Try to get from cookie (Primary source of truth from server)
  const cookieMatch = document.cookie.match(new RegExp('(^| )' + SESSION_COOKIE_NAME + '=([^;]+)'));
  if (cookieMatch && cookieMatch[2]) {
    let sessionId = cookieMatch[2];
    
    // Safety: If not authenticated, ensure we aren't using a stale UID
    // Firebase UIDs are typically 28 chars. UUIDs are 36 chars.
    if (!user && sessionId.length < 32) {
      console.warn(`[Session] Found stale UID in cookie: ${sessionId}. User is NOT authenticated. Clearing...`);
      sessionId = '';
    } else {
      // Sync localStorage
      if (localStorage.getItem('hypvzn_session_id') !== sessionId) {
        localStorage.setItem('hypvzn_session_id', sessionId);
      }
      return sessionId;
    }
  }

  // 2. Fallback to localStorage
  let sessionId = localStorage.getItem('hypvzn_session_id');
  if (sessionId && !user && sessionId.length < 32) {
    console.warn(`[Session] Found stale UID in localStorage: ${sessionId}. User is NOT authenticated. Clearing...`);
    localStorage.removeItem('hypvzn_session_id');
    sessionId = null;
  }
  
  if (!sessionId) {
    // 3. Generate new ID if none exists
    sessionId = uuidv4();
    console.log(`[Session] Generated NEW UUID for guest: ${sessionId}`);
    localStorage.setItem('hypvzn_session_id', sessionId);
  }

  // Ensure cookie is set for subsequent server requests
  document.cookie = `${SESSION_COOKIE_NAME}=${sessionId}; path=/; max-age=${60 * 60 * 24 * 5}; SameSite=Lax`;

  return sessionId;
};

/**
 * Gets the session ID from a Request object (server-side).
 */
export function getSessionIdFromRequest(request: Request): string {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return '';
  
  const cartId = cookieHeader
    .split(';')
    .find(row => row.trim().startsWith(`${SESSION_COOKIE_NAME}=`))
    ?.split('=')[1]
    ?.trim();
    
  return cartId || '';
}
