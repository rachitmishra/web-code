import React from 'react';
import ImageGalleryPlugin from './pdp/ImageGallery/ImageGalleryPlugin';
import ProductInfoPlugin from './pdp/ProductInfo/ProductInfoPlugin';
import ReviewsPlugin from './pdp/Reviews/ReviewsPlugin';
import RelatedProductsPlugin from './pdp/RelatedProducts/RelatedProductsPlugin';

export type PluginComponent<P = any> = React.FC<P>;

export interface PluginMetadata {
  id: string;
  name: string;
  description?: string;
  defaultConfig?: Record<string, any>;
}

export interface RegisteredPlugin {
  component: PluginComponent;
  metadata?: PluginMetadata;
}

const registry: Record<string, RegisteredPlugin> = {};

// Register initial PDP plugins
registerPlugin('ImageGallery', ImageGalleryPlugin, {
  id: 'ImageGallery',
  name: 'Image Gallery',
  description: 'Displays product images in a gallery.'
});

registerPlugin('ProductInfo', ProductInfoPlugin, {
  id: 'ProductInfo',
  name: 'Product Info',
  description: 'Displays product name, price, description, and variant selectors.'
});

registerPlugin('Reviews', ReviewsPlugin, {
  id: 'Reviews',
  name: 'Customer Reviews',
  description: 'Displays customer reviews and a form to add new ones.'
});

registerPlugin('RelatedProducts', RelatedProductsPlugin, {
  id: 'RelatedProducts',
  name: 'Related Products',
  description: 'Displays a grid of related products.'
});

/**
 * Registers a plugin in the global registry.
 */
export const registerPlugin = (
  id: string,
  component: PluginComponent,
  metadata?: PluginMetadata
) => {
  registry[id] = { component, metadata };
};

/**
 * Retrieves a plugin component by its ID.
 */
export const getPlugin = (id: string): PluginComponent | undefined => {
  return registry[id]?.component;
};

/**
 * Retrieves the full plugin registry.
 */
export const getRegistry = (): Record<string, PluginComponent> => {
  const result: Record<string, PluginComponent> = {};
  for (const id in registry) {
    result[id] = registry[id].component;
  }
  return result;
};

/**
 * Retrieves all registered plugin IDs.
 */
export const getRegisteredPluginIds = (): string[] => {
  return Object.keys(registry);
};
