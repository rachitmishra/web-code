import { describe, it, expect, vi } from 'vitest';
import { DEFAULT_SETTINGS } from './storefrontService';

describe('storefrontService', () => {
  it('should have DEFAULT_SETTINGS defined', () => {
    expect(DEFAULT_SETTINGS).toBeDefined();
    expect(DEFAULT_SETTINGS.heroTitle).toBe('HYPVZN Boutique');
  });

  it('DEFAULT_SETTINGS should include initial reviews', () => {
    expect(DEFAULT_SETTINGS.reviews).toHaveLength(3);
    expect(DEFAULT_SETTINGS.reviews[0].name).toBe('Sarah L.');
  });
});
