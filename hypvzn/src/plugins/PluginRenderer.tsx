import React from 'react';
import { getPlugin } from './registry';

export interface PluginConfig {
  id: string;
  type: string;
  visible: boolean;
  settings?: Record<string, any>;
}

export interface LayoutConfig {
  plugins: PluginConfig[];
}

interface PluginRendererProps {
  layout: LayoutConfig;
  pluginProps?: Record<string, any>;
}

/**
 * PluginRenderer dynamically renders a list of plugins based on a layout configuration.
 * It is designed to be context-aware, meaning plugins can either receive data via direct props
 * or consume it from a React Context (like HomeContext).
 */
const PluginRenderer: React.FC<PluginRendererProps> = ({ layout, pluginProps = {} }) => {
  if (!layout || !layout.plugins) return null;

  return (
    <>
      {layout.plugins
        .filter((config) => config.visible)
        .map((config) => {
          const PluginComponent = getPlugin(config.type);
          if (!PluginComponent) {
            console.warn(`Plugin type "${config.type}" not found in registry.`);
            return null;
          }

          return (
            <PluginComponent 
              key={config.id} 
              {...pluginProps} 
              config={config.settings} 
            />
          );
        })}
    </>
  );
};

export default PluginRenderer;
