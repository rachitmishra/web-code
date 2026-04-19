import React from 'react';
import { getPlugin } from './registry';
import { type PDPLayout } from '../services/storefrontService';

interface PluginRendererProps {
  layout: PDPLayout;
  pluginProps: Record<string, any>;
}

const PluginRenderer: React.FC<PluginRendererProps> = ({ layout, pluginProps }) => {
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
