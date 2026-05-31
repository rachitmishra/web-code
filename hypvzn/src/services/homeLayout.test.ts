import { describe, it, expect } from 'vitest';
import { DEFAULT_HOME_LAYOUT, DEFAULT_SETTINGS } from './storefrontService';

describe('Home Layout Foundation', () => {
  it('should have a DEFAULT_HOME_LAYOUT defined', () => {
    expect(DEFAULT_HOME_LAYOUT).toBeDefined();
    expect(DEFAULT_HOME_LAYOUT.plugins).toBeInstanceOf(Array);
    expect(DEFAULT_HOME_LAYOUT.plugins.length).toBeGreaterThan(0);
  });

  it('should have PromoBanner as the first plugin in DEFAULT_HOME_LAYOUT', () => {
    expect(DEFAULT_HOME_LAYOUT.plugins[0].type).toBe('PromoBanner');
  });

  it('should include all required initial plugins in DEFAULT_HOME_LAYOUT', () => {
    const pluginTypes = DEFAULT_HOME_LAYOUT.plugins.map(p => p.type);
    expect(pluginTypes).toContain('CinematicHero');
    expect(pluginTypes).toContain('BestSellers');
    expect(pluginTypes).toContain('ProductGridSection');
    expect(pluginTypes).toContain('ReviewSection');
    expect(pluginTypes).toContain('PromoBanner');
  });

  it('DEFAULT_SETTINGS should include a homeLayout property', () => {
    expect(DEFAULT_SETTINGS.homeLayout).toBeDefined();
    expect(DEFAULT_SETTINGS.homeLayout?.plugins).toEqual(DEFAULT_HOME_LAYOUT.plugins);
  });
});
