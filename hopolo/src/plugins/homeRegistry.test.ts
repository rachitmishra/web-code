import { describe, it, expect } from 'vitest';
import { getPlugin } from './registry';

describe('Home Plugin Registration', () => {
  it('should have CinematicHero plugin registered', () => {
    expect(getPlugin('CinematicHero')).toBeDefined();
  });

  it('should have BestSellers plugin registered', () => {
    expect(getPlugin('BestSellers')).toBeDefined();
  });

  it('should have ProductGridSection plugin registered', () => {
    expect(getPlugin('ProductGridSection')).toBeDefined();
  });

  it('should have ReviewSection plugin registered', () => {
    expect(getPlugin('ReviewSection')).toBeDefined();
  });

  it('should have PromoBanner plugin registered', () => {
    expect(getPlugin('PromoBanner')).toBeDefined();
  });
});
