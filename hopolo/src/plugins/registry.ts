import React from 'react';

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
