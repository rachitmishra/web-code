import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ImageGalleryPlugin from './ImageGalleryPlugin';
import React from 'react';

describe('ImageGalleryPlugin', () => {
  it('renders product image', () => {
    const product = {
      image: 'https://example.com/image.jpg',
      name: 'Test Product'
    };
    render(React.createElement(ImageGalleryPlugin, { product }));
    const img = screen.getByAltText('Test Product');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('renders placeholder when no image', () => {
    const product = {
      name: 'No Image Product'
    };
    render(React.createElement(ImageGalleryPlugin, { product }));
    expect(screen.getByText('No Image')).toBeInTheDocument();
  });
});
