import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Theme Design Tokens (File Check)', () => {
  const cssPath = path.resolve(__dirname, 'variables.css');
  const cssContent = fs.readFileSync(cssPath, 'utf-8');

  it('should have the new semantic color variables defined', () => {
    expect(cssContent).toContain('--bg-primary');
    expect(cssContent).toContain('--surface-card');
    expect(cssContent).toContain('--text-main');
    expect(cssContent).toContain('--brand-action');
  });

  it('should have the new typography variables defined', () => {
    expect(cssContent).toContain('--font-main');
    expect(cssContent).toContain('--letter-spacing-tight');
  });

  it('should have the new spacing variables defined', () => {
    expect(cssContent).toContain('--spacing-1');
    expect(cssContent).toContain('--spacing-2');
    expect(cssContent).toContain('--spacing-3');
  });

  it('should have the component blueprints defined', () => {
    expect(cssContent).toContain('--container-max-width');
    expect(cssContent).toContain('--card-radius');
    expect(cssContent).toContain('--card-shadow');
  });
});
