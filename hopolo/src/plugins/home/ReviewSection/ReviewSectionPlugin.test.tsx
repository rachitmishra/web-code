import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReviewSectionPlugin from './ReviewSectionPlugin';
import { HomeProvider } from '../../../pages/Home/Context';
import React from 'react';

describe('ReviewSectionPlugin', () => {
  const mockSettings = {
    reviews: [
      { name: 'Alice', emoji: '🌟', text: 'Great!' },
      { name: 'Bob', emoji: '👍', text: 'Nice.' }
    ]
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

  it('should render reviews from context', () => {
    render(<ReviewSectionPlugin />, { wrapper });
    
    expect(screen.getByText('Loved by Customers')).toBeInTheDocument();
    expect(screen.getByText(/Alice/i)).toBeInTheDocument();
    expect(screen.getByText(/Great!/i)).toBeInTheDocument();
    expect(screen.getByText(/Bob/i)).toBeInTheDocument();
    expect(screen.getByText(/Nice./i)).toBeInTheDocument();
  });

  it('should render nothing if no reviews are provided', () => {
    const emptyWrapper = ({ children }: { children: React.ReactNode }) => (
      <HomeProvider
        settings={{ reviews: [] } as any}
        products={[]}
        categories={[]}
        bestSellers={[]}
        actions={{} as any}
      >
        {children}
      </HomeProvider>
    );

    const { container } = render(<ReviewSectionPlugin />, { wrapper: emptyWrapper });
    expect(container).toBeEmptyDOMElement();
  });
});
