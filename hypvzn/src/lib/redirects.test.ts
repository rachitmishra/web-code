import { describe, it, expect } from 'vitest';
import { handleRedirects } from './redirects.server';

describe('Server-Side Redirects', () => {
  it('should redirect /collections to /', async () => {
    const request = new Request('http://localhost/collections');
    try {
      await handleRedirects(request);
      expect.fail('Should have thrown a redirect response');
    } catch (response: any) {
      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(302);
      expect(response.headers.get('Location')).toBe('/');
    }
  });

  it('should redirect /privacy to /legal/privacy', async () => {
    const request = new Request('http://localhost/privacy');
    try {
      await handleRedirects(request);
      expect.fail('Should have thrown a redirect response');
    } catch (response: any) {
      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(302);
      expect(response.headers.get('Location')).toBe('/legal/privacy');
    }
  });

  it('should not redirect valid paths', async () => {
    const request = new Request('http://localhost/about');
    await handleRedirects(request); // Should not throw
  });
});
