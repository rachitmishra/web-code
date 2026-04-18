import { describe, it, expect } from 'vitest';
import { registerPlugin, getPlugin, getRegistry } from './registry';
import React from 'react';

const MockPlugin: React.FC<any> = ({ data }) => React.createElement('div', null, data);

describe('Plugin Registry', () => {
  it('should register and retrieve a plugin', () => {
    registerPlugin('test-plugin', MockPlugin);
    const Plugin = getPlugin('test-plugin');
    expect(Plugin).toBe(MockPlugin);
  });

  it('should return undefined for non-existent plugin', () => {
    const Plugin = getPlugin('non-existent');
    expect(Plugin).toBeUndefined();
  });

  it('should return the full registry', () => {
    registerPlugin('plugin-a', MockPlugin);
    registerPlugin('plugin-b', MockPlugin);
    const registry = getRegistry();
    expect(registry['plugin-a']).toBe(MockPlugin);
    expect(registry['plugin-b']).toBe(MockPlugin);
  });
});
