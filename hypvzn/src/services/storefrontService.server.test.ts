import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchPDPLayout, updatePDPLayout, getStorefrontSettings, updateStorefrontSettings } from './storefrontService.server';
import { adminDb } from '../lib/firebase-admin.server';

vi.mock('../lib/firebase-admin.server', () => ({
  adminDb: {
    collection: vi.fn().mockReturnThis(),
    doc: vi.fn().mockReturnThis(),
    get: vi.fn(),
    set: vi.fn(),
  },
  FieldValue: {
    serverTimestamp: vi.fn(),
  },
}));

describe('storefrontService.server', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getStorefrontSettings should return data if document exists', async () => {
    const mockSettings = {
      heroTitle: 'Custom Title'
    };

    (adminDb.get as any).mockResolvedValue({
      exists: true,
      data: () => mockSettings,
    });

    const settings = await getStorefrontSettings();

    expect(adminDb.collection).toHaveBeenCalledWith('settings');
    expect(adminDb.doc).toHaveBeenCalledWith('storefront');
    expect(settings.heroTitle).toBe('Custom Title');
  });

  it('getStorefrontSettings should return default if document does not exist', async () => {
    (adminDb.get as any).mockResolvedValue({
      exists: false,
    });

    const settings = await getStorefrontSettings();
    expect(settings.heroTitle).toBe('Architectural Performance Gear');
  });

  it('updateStorefrontSettings should call set with merge', async () => {
    const newSettings = { heroTitle: 'New Title' };
    await updateStorefrontSettings(newSettings);

    expect(adminDb.set).toHaveBeenCalledWith(newSettings, { merge: true });
  });

  it('fetchPDPLayout should return data if document exists', async () => {
    const mockLayout = {
      plugins: [
        { id: '1', type: 'Test', visible: true }
      ]
    };

    (adminDb.get as any).mockResolvedValue({
      exists: true,
      data: () => mockLayout,
    });

    const layout = await fetchPDPLayout();

    expect(adminDb.collection).toHaveBeenCalledWith('settings');
    expect(adminDb.doc).toHaveBeenCalledWith('pdp_layout');
    expect(layout.plugins[0].id).toBe('1');
  });

  it('fetchPDPLayout should return default if document does not exist', async () => {
    (adminDb.get as any).mockResolvedValue({
      exists: false,
    });

    const layout = await fetchPDPLayout();

    expect(layout.plugins).toHaveLength(4); // Default has 4
    expect(layout.plugins[0].type).toBe('ImageGallery');
  });

  it('updatePDPLayout should call set', async () => {
    const newLayout = { plugins: [] };
    await updatePDPLayout(newLayout as any);

    expect(adminDb.set).toHaveBeenCalledWith(newLayout);
  });
});
