import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CinematicHeroPlugin from './CinematicHeroPlugin';
import { HomeProvider } from '../../../pages/Home/Context';
import React from 'react';

describe('CinematicHeroPlugin', () => {
  const mockSettings = {
    heroTitle: 'Hero Title',
    heroSubtitle: 'Hero Subtitle',
    heroImage: 'hero.jpg',
    heroCtaText: 'Shop Now'
  } as any;

  const mockActions = {
    scrollToProducts: vi.fn()
  } as any;

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <HomeProvider
      settings={mockSettings}
      products={[]}
      categories={[]}
      bestSellers={[]}
      actions={mockActions}
    >
      {children}
    </HomeProvider>
  );

  it('should render hero content from context', () => {
    render(<CinematicHeroPlugin />, { wrapper });
    
    expect(screen.getByText('Hero Title')).toBeInTheDocument();
    expect(screen.getByText('Hero Subtitle')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /shop now/i })).toBeInTheDocument();
  });

  it('should call scrollToProducts when CTA is clicked', () => {
    render(<CinematicHeroPlugin />, { wrapper });
    
    fireEvent.click(screen.getByRole('button', { name: /shop now/i }));
    expect(mockActions.scrollToProducts).toHaveBeenCalled();
  });
});
