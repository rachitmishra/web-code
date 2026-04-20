import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PromoBannerPlugin from './PromoBannerPlugin';
import { HomeProvider } from '../../../pages/Home/Context';
import React from 'react';

describe('PromoBannerPlugin', () => {
  const mockSettings = {
    bannerVisible: true,
    bannerText: 'Test Banner',
    bannerColor: '#ff0000',
    bannerLink: '/test-link'
  } as any;

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <HomeProvider
      settings={mockSettings}
      products={[]}
      categories={[]}
      bestSellers={[]}
      actions={{} as any}
    >
      {children}
    </HomeProvider>
  );

  it('should render banner text and color when visible', () => {
    render(<PromoBannerPlugin />, { wrapper });
    
    const banner = screen.getByText('Test Banner');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveStyle({ backgroundColor: '#ff0000' });
  });

  it('should wrap in a link if bannerLink is provided', () => {
    render(<PromoBannerPlugin />, { wrapper });
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test-link');
    expect(screen.getByText('Test Banner')).toBeInTheDocument();
  });

  it('should render banner content without link if bannerLink is not provided', () => {
    const noLinkSettings = { ...mockSettings, bannerLink: '' };
    const noLinkWrapper = ({ children }: { children: React.ReactNode }) => (
      <HomeProvider
        settings={noLinkSettings}
        products={[]}
        categories={[]}
        bestSellers={[]}
        actions={{} as any}
      >
        {children}
      </HomeProvider>
    );

    render(<PromoBannerPlugin />, { wrapper: noLinkWrapper });
    
    expect(screen.getByText('Test Banner')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('should render nothing if bannerVisible is false', () => {
    const hiddenSettings = { ...mockSettings, bannerVisible: false };
    const hiddenWrapper = ({ children }: { children: React.ReactNode }) => (
      <HomeProvider
        settings={hiddenSettings}
        products={[]}
        categories={[]}
        bestSellers={[]}
        actions={{} as any}
      >
        {children}
      </HomeProvider>
    );

    const { container } = render(<PromoBannerPlugin />, { wrapper: hiddenWrapper });
    expect(container).toBeEmptyDOMElement();
  });
});
