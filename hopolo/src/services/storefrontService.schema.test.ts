import { describe, it, expect } from 'vitest';
import { DEFAULT_SETTINGS, type StorefrontSettings } from './storefrontService';

describe('Storefront Settings Schema', () => {
  it('should support pageContent field', () => {
    const settings: StorefrontSettings = {
      ...DEFAULT_SETTINGS,
      pageContent: {
        '/archive': {
          title: 'Archive',
          content: 'Archival pieces from past seasons.'
        }
      }
    };
    
    expect(settings.pageContent).toBeDefined();
    expect(settings.pageContent?.['/archive'].title).toBe('Archive');
  });

  it('should have default pageContent initialized', () => {
    expect(DEFAULT_SETTINGS.pageContent).toBeDefined();
    expect(typeof DEFAULT_SETTINGS.pageContent).toBe('object');
  });
});
