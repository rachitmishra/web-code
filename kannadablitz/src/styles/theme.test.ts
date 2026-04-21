import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Theme Design Tokens (File Check)', () => {
  const varsPath = path.resolve(__dirname, 'variables.css');
  const varsContent = fs.readFileSync(varsPath, 'utf-8');

  it('should have the new semantic color variables defined', () => {
    expect(varsContent).toContain('--bg-primary');
    expect(varsContent).toContain('--surface-card');
    expect(varsContent).toContain('--text-main');
    expect(varsContent).toContain('--brand-action');
  });

  it('should have the new typography variables defined', () => {
    expect(varsContent).toContain('--font-main');
    expect(varsContent).toContain('--letter-spacing-tight');
  });

  it('should have the new spacing variables defined', () => {
    expect(varsContent).toContain('--spacing-1');
    expect(varsContent).toContain('--spacing-2');
    expect(varsContent).toContain('--spacing-3');
  });

  it('should have the component blueprints defined', () => {
    expect(varsContent).toContain('--container-max-width');
    expect(varsContent).toContain('--card-radius');
    expect(varsContent).toContain('--card-shadow');
  });
});

describe('Base and Utilities CSS (File Check)', () => {
  const basePath = path.resolve(__dirname, 'base.css');
  const utilitiesPath = path.resolve(__dirname, 'utilities.css');
  
  const baseContent = fs.readFileSync(basePath, 'utf-8');
  const utilitiesContent = fs.readFileSync(utilitiesPath, 'utf-8');

  it('should have the updated typography scale in base.css', () => {
    // We'll check for H1 to Small Label (though they might not be there yet)
    expect(baseContent).toContain('h1');
    expect(baseContent).toContain('h2');
    expect(baseContent).toContain('.text-small');
  });

  it('should have visual weighting utilities', () => {
    expect(utilitiesContent).toContain('.kannada-text');
    expect(utilitiesContent).toContain('.english-text');
  });
});
