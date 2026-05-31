import { redirect } from 'react-router';

const REDIRECT_MAP: Record<string, string> = {
  '/collections': '/',
  '/privacy': '/legal/privacy',
  '/terms': '/legal/terms',
  '/shipping-info': '/shipping',
};

/**
 * Handles server-side redirects for legacy or broken paths.
 */
export async function handleRedirects(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (REDIRECT_MAP[path]) {
    console.log(`[Redirect] ${path} -> ${REDIRECT_MAP[path]}`);
    throw redirect(REDIRECT_MAP[path]);
  }
}
