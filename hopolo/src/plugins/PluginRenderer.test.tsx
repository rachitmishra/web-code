import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PluginRenderer from './PluginRenderer';
import { registerPlugin } from './registry';
import React from 'react';

const MockPluginA: React.FC<any> = () => React.createElement('div', null, 'Plugin A');
const MockPluginB: React.FC<any> = () => React.createElement('div', null, 'Plugin B');

describe('PluginRenderer', () => {
  it('renders visible plugins in order', () => {
    registerPlugin('A', MockPluginA);
    registerPlugin('B', MockPluginB);

    const layout = {
      plugins: [
        { id: '1', type: 'B', visible: true },
        { id: '2', type: 'A', visible: true },
        { id: '3', type: 'A', visible: false },
      ]
    };

    render(React.createElement(PluginRenderer, { layout, pluginProps: {} }));

    const plugins = screen.getAllByText(/Plugin/);
    expect(plugins).toHaveLength(2);
    expect(plugins[0]).toHaveTextContent('Plugin B');
    expect(plugins[1]).toHaveTextContent('Plugin A');
  });

  it('passes props to plugins', () => {
    const MockWithProps: React.FC<any> = ({ val }) => React.createElement('div', null, val);
    registerPlugin('PropPlugin', MockWithProps);

    const layout = {
      plugins: [
        { id: '1', type: 'PropPlugin', visible: true }
      ]
    };

    render(React.createElement(PluginRenderer, { layout, pluginProps: { val: 'Hello' } }));
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('works without pluginProps', () => {
    const MockNoProps: React.FC = () => React.createElement('div', null, 'No Props');
    registerPlugin('NoPropPlugin', MockNoProps);

    const layout = {
      plugins: [
        { id: '1', type: 'NoPropPlugin', visible: true }
      ]
    };

    render(React.createElement(PluginRenderer, { layout }));
    expect(screen.getByText('No Props')).toBeInTheDocument();
  });

  it('warns when plugin type is not found', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const layout = {
      plugins: [
        { id: '1', type: 'UnknownPlugin', visible: true }
      ]
    };

    render(React.createElement(PluginRenderer, { layout }));
    expect(consoleSpy).toHaveBeenCalledWith('Plugin type "UnknownPlugin" not found in registry.');
    consoleSpy.mockRestore();
  });
});
