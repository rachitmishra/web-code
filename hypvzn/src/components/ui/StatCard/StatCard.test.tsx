import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatCard from './StatCard';

describe('StatCard', () => {
  it('should render label and value correctly', () => {
    render(<StatCard label="Total Sales" value="$1,200" />);
    expect(screen.getByText('Total Sales')).toBeDefined();
    expect(screen.getByText('$1,200')).toBeDefined();
  });

  it('should render positive growth correctly', () => {
    render(<StatCard label="Orders" value="45" growth={12.5} />);
    expect(screen.getByText('12.5%')).toBeDefined();
    expect(screen.getByText('vs last period')).toBeDefined();
  });

  it('should render negative growth correctly', () => {
    render(<StatCard label="AOV" value="$85" growth={-5.2} />);
    expect(screen.getByText('5.2%')).toBeDefined();
  });
});
