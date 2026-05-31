import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface CustomerReview {
  name: string;
  emoji: string;
  text: string;
}

export interface StorefrontSettings {
  bannerText: string;
  bannerColor: string;
  bannerLink: string;
  bannerVisible: boolean;
  isMaintenanceMode: boolean;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroCtaText: string;
  reviews: CustomerReview[];
  homeLayout?: HomeLayout;
  pageContent?: Record<string, { title: string, content: string }>;
}

export const DEFAULT_SETTINGS: StorefrontSettings = {
  bannerText: "FW24_SYSTEM_READY",
  bannerColor: "#8A2BE2",
  bannerLink: "",
  bannerVisible: false,
  isMaintenanceMode: false,
  heroTitle: "Architectural Performance Gear",
  heroSubtitle: "ENGINEERED FOR PRECISION",
  heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuB50EBRSPpl-CftZG-FtF8YsG2xHbpyV7Z76PoZ5TUKls3voy1a0PcS7MB0lPQk_SR246tjuSyTSWwQA_keXlM-RZRNp950efuqX2HEkGevYnt7sTr3Yo7Q3DqCbl2I_EVXx5yYu8segE0N656Dxw3FQMMXEAZp2WbBPQrd2-Da2csOleVJ-hDNUnEjzzm59oHLqgP_WhpuE9I8WYnkT0zSRMsNI07paYknXh7BSEs-rbkbcFybbfQTMUclUrOPKzIAlqQyKNQw0w",
  heroCtaText: "ENTER ARCHIVE",
  reviews: [
    {
      name: "SARAH L.",
      emoji: "SYSTEM_OK",
      text: "AMAZING QUALITY AND FAST DELIVERY. HIGHLY RECOMMENDED.",
    },
    {
      name: "MARCUS T.",
      emoji: "SYSTEM_OK",
      text: "MINIMALIST DESIGN THAT FITS PERFECTLY IN MY HOME.",
    },
    {
      name: "ELENA G.",
      emoji: "SYSTEM_OK",
      text: "THE EMOJI-BASED REVIEW SYSTEM IS SO FUN AND EASY.",
    },
  ],
  homeLayout: {
    plugins: [
      { id: 'home-promo', type: 'PromoBanner', visible: false },
      { id: 'home-hero', type: 'CinematicHero', visible: true },
      { id: 'home-featured-collection', type: 'FeaturedCollection', visible: true },
      { id: 'home-curated-essentials', type: 'CuratedEssentials', visible: true },
      { id: 'home-best-sellers', type: 'BestSellers', visible: true },
      { id: 'home-newsletter', type: 'Newsletter', visible: true },
    ]
  },
  pageContent: {
    '/about': {
      title: 'About Us',
      content: 'HYPVZN is a technical apparel laboratory focused on high-performance urban gear. We believe in brutalist efficiency and minimalist aesthetics.'
    },
    '/shipping': {
      title: 'Shipping Policy',
      content: 'Global logistics handled via encrypted channels. Orders typically processed within 24 hours. Tracking ID provided upon dispatch.'
    },
    '/contact': {
      title: 'Contact Us',
      content: 'FOR TECHNICAL SUPPORT OR INQUIRIES: support@hypvzn.systems. RESPONSE_TIME: < 12H.'
    },
    '/archive': {
      title: 'Archive',
      content: 'Archival pieces from past seasons. Technical garments engineered for durability.'
    },
    '/stockists': {
      title: 'Stockists',
      content: 'Global distribution partners and boutique locations.'
    },
    '/legal/privacy': {
      title: 'Privacy Policy',
      content: 'Information regarding data collection and processing protocols.'
    },
    '/legal/terms': {
      title: 'Terms of Use',
      content: 'Terms and conditions for accessing the HYPVZN system.'
    }
  }
};

const SETTINGS_DOC_ID = 'storefront';
const SETTINGS_COLLECTION = 'settings';

export const getStorefrontSettings = async (): Promise<StorefrontSettings> => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { ...DEFAULT_SETTINGS, ...docSnap.data() } as StorefrontSettings;
    } else {
      return DEFAULT_SETTINGS;
    }
  } catch (error) {
    console.error("Error fetching storefront settings:", error);
    return DEFAULT_SETTINGS;
  }
};

export const updateStorefrontSettings = async (settings: Partial<StorefrontSettings>): Promise<void> => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    await setDoc(docRef, settings, { merge: true });
  } catch (error) {
    console.error("Error updating storefront settings:", error);
    throw error;
  }
};

export const subscribeToStorefrontSettings = (
  callback: (settings: StorefrontSettings) => void
): (() => void) => {
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);

  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ ...DEFAULT_SETTINGS, ...docSnap.data() } as StorefrontSettings);
    } else {
      callback(DEFAULT_SETTINGS);
    }
  }, (error) => {
    console.error("Error subscribing to storefront settings:", error);
  });
};


export interface PDPPluginConfig {
  id: string;
  type: string;
  visible: boolean;
  settings?: Record<string, any>;
}

export interface PDPLayout {
  plugins: PDPPluginConfig[];
}

export interface HomePluginConfig {
  id: string;
  type: string;
  visible: boolean;
  settings?: Record<string, any>;
}

export interface HomeLayout {
  plugins: HomePluginConfig[];
}

export const DEFAULT_HOME_LAYOUT: HomeLayout = DEFAULT_SETTINGS.homeLayout!;

export const DEFAULT_PDP_LAYOUT: PDPLayout = {
  plugins: [
    { id: 'pdp-gallery', type: 'ImageGallery', visible: true },
    { id: 'pdp-info', type: 'ProductInfo', visible: true },
    { id: 'pdp-reviews', type: 'Reviews', visible: true },
    { id: 'pdp-related', type: 'RelatedProducts', visible: true, settings: { limit: 4 } },
  ],
};