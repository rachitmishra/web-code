import { adminDb } from '../lib/firebase-admin.server';
import { 
  type StorefrontSettings, 
  DEFAULT_SETTINGS,
  type PDPLayout,
  DEFAULT_PDP_LAYOUT
} from './storefrontService';

const SETTINGS_DOC_ID = 'storefront';
const LAYOUT_DOC_ID = 'pdp_layout';
const SETTINGS_COLLECTION = 'settings';

export const getStorefrontSettings = async (): Promise<StorefrontSettings> => {
  try {
    const docRef = adminDb.collection(SETTINGS_COLLECTION).doc(SETTINGS_DOC_ID);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      return { ...DEFAULT_SETTINGS, ...docSnap.data() } as StorefrontSettings;
    }
  } catch (error) {
    console.error('[Storefront Service] Failed to fetch settings:', error);
  }
  return DEFAULT_SETTINGS;
};

export const updateStorefrontSettings = async (settings: Partial<StorefrontSettings>): Promise<void> => {
  const docRef = adminDb.collection(SETTINGS_COLLECTION).doc(SETTINGS_DOC_ID);
  await docRef.set(settings, { merge: true });
};

export const fetchPDPLayout = async (): Promise<PDPLayout> => {
  const docRef = adminDb.collection(SETTINGS_COLLECTION).doc(LAYOUT_DOC_ID);
  const docSnap = await docRef.get();

  if (docSnap.exists) {
    return { ...DEFAULT_PDP_LAYOUT, ...docSnap.data() } as PDPLayout;
  }
  return DEFAULT_PDP_LAYOUT;
};

export const updatePDPLayout = async (layout: PDPLayout): Promise<void> => {
  const docRef = adminDb.collection(SETTINGS_COLLECTION).doc(LAYOUT_DOC_ID);
  await docRef.set(layout);
};

