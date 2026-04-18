import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ReviewsPlugin from './ReviewsPlugin';
import React from 'react';

describe('ReviewsPlugin', () => {
  const mockReviews = [
    { id: '1', userName: 'User A', rating: 3, comment: 'Great!' },
    { id: '2', userName: 'User B', rating: 2, comment: 'Ok' }
  ];

  it('renders reviews', () => {
    render(React.createElement(ReviewsPlugin, { 
      reviews: mockReviews,
      onAddReview: vi.fn()
    }));

    expect(screen.getByText('User A 😊')).toBeInTheDocument();
    expect(screen.getByText('Great!')).toBeInTheDocument();
    expect(screen.getByText('User B 😐')).toBeInTheDocument();
    expect(screen.getByText('Ok')).toBeInTheDocument();
  });

  it('shows sign in message when no user', () => {
    render(React.createElement(ReviewsPlugin, { 
      reviews: [],
      onAddReview: vi.fn(),
      onSignIn: vi.fn()
    }));

    expect(screen.getByText(/Please/i)).toBeInTheDocument();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });
});
