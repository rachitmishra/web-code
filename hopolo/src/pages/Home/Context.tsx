import React, { createContext, useContext, type ReactNode } from 'react';
import { type Product, type Category } from '../../services/productService';
import { type StorefrontSettings } from '../../services/storefrontService';

export interface HomeContextState {
  settings: StorefrontSettings;
  products: Product[];
  categories: Category[];
  bestSellers: Product[];
  actions: {
    handleAddToCart: (product: Product) => void;
    handleCategoryChange: (id: string) => void;
    navigate: (path: string) => void;
    scrollToProducts: () => void;
  };
  state: {
    activeCategoryId: string;
    isGridChanging: boolean;
    addingProductId: string | null;
    successProductId: string | null;
  };
}

const HomeContext = createContext<HomeContextState | undefined>(undefined);

export const useHomeContext = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHomeContext must be used within a HomeProvider');
  }
  return context;
};

interface HomeProviderProps {
  children: ReactNode;
  settings: StorefrontSettings;
  products: Product[];
  categories: Category[];
  bestSellers: Product[];
  actions: HomeContextState['actions'];
  state?: HomeContextState['state'];
}

export const HomeProvider: React.FC<HomeProviderProps> = ({
  children,
  settings,
  products,
  categories,
  bestSellers,
  actions,
  state = { 
    activeCategoryId: 'all', 
    isGridChanging: false,
    addingProductId: null,
    successProductId: null
  }
}) => {
  const value: HomeContextState = {
    settings,
    products,
    categories,
    bestSellers,
    actions,
    state
  };

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
};
