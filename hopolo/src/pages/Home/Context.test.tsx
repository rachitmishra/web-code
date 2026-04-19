import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useHomeContext, HomeProvider } from './Context';
import React from 'react';

describe('HomeContext', () => {
  it('should throw error if used outside of HomeProvider', () => {
    // Suppress console.error for this test as it's expected
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => renderHook(() => useHomeContext())).toThrow('useHomeContext must be used within a HomeProvider');
    
    consoleSpy.mockRestore();
  });

  it('should provide context values when used within HomeProvider', () => {
    const mockSettings = { heroTitle: 'Test Title' } as any;
    const mockProducts = [{ id: '1', name: 'Product 1' }] as any;
    const mockCategories = [{ id: 'all', name: 'All' }] as any;
    const mockBestSellers = [] as any;
    const mockActions = { handleAddToCart: vi.fn() } as any;

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <HomeProvider
        settings={mockSettings}
        products={mockProducts}
        categories={mockCategories}
        bestSellers={mockBestSellers}
        actions={mockActions}
      >
        {children}
      </HomeProvider>
    );

    const { result } = renderHook(() => useHomeContext(), { wrapper });

    expect(result.current.settings).toEqual(mockSettings);
    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.categories).toEqual(mockCategories);
    expect(result.current.bestSellers).toEqual(mockBestSellers);
    expect(result.current.actions).toEqual(mockActions);
  });
});
