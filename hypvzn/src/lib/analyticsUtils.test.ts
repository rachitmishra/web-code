import { describe, it, expect } from 'vitest';
import { aggregateRevenuePerDay, calculateTopProducts, calculateCategoryShare, calculateGrowth, calculateCustomerMetrics } from './analyticsUtils';

const mockOrders = [
  {
    id: '1',
    createdAt: { toDate: () => new Date('2023-01-01T10:00:00') },
    total: 100,
    items: [
      { product: { id: 'p1', name: 'Product 1', category: 'Cat A' }, quantity: 2 },
      { product: { id: 'p2', name: 'Product 2', category: 'Cat B' }, quantity: 1 }
    ],
    status: 'paid'
  },
  {
    id: '2',
    createdAt: { toDate: () => new Date('2023-01-01T14:00:00') },
    total: 50,
    items: [
      { product: { id: 'p1', name: 'Product 1', category: 'Cat A' }, quantity: 1 }
    ],
    status: 'paid'
  },
  {
    id: '3',
    createdAt: { toDate: () => new Date('2023-01-02T10:00:00') },
    total: 200,
    items: [
      { product: { id: 'p3', name: 'Product 3', category: 'Cat B' }, quantity: 4 }
    ],
    status: 'paid'
  },
  {
    id: '4',
    createdAt: { toDate: () => new Date('2023-01-02T12:00:00') },
    total: 100,
    items: [],
    status: 'refunded' // Should be ignored
  },
  {
    id: '5',
    createdAt: { toDate: () => new Date('2023-01-02T13:00:00') },
    total: 50,
    items: [],
    status: 'failed' // Should be ignored
  }
];

describe('Analytics Utilities', () => {
  it('aggregateRevenuePerDay should group revenue by date and include empty days', () => {
    const result = aggregateRevenuePerDay(mockOrders, '2023-01-01', '2023-01-03');
    // 2023-01-01: 100 + 50 = 150
    // 2023-01-02: 200
    // 2023-01-03: 0 (empty day)
    expect(result).toEqual([
      { date: '2023-01-01', revenue: 150 },
      { date: '2023-01-02', revenue: 200 },
      { date: '2023-01-03', revenue: 0 }
    ]);
  });

  it('aggregateRevenuePerDay should work without date range', () => {
    const result = aggregateRevenuePerDay(mockOrders);
    expect(result).toEqual([
      { date: '2023-01-01', revenue: 150 },
      { date: '2023-01-02', revenue: 200 }
    ]);
  });

  it('calculateTopProducts should rank products by quantity sold', () => {
    const result = calculateTopProducts(mockOrders);
    // Product 1: 2 + 1 = 3
    // Product 2: 1
    // Product 3: 4
    // Refunded items ignored? Usually yes.
    // Order 4 was refunded, but has no items in mock. 
    // Let's assume calculateTopProducts only counts 'paid'/'shipped'/'delivered' orders.
    
    expect(result).toEqual([
      { name: 'Product 3', quantity: 4 },
      { name: 'Product 1', quantity: 3 },
      { name: 'Product 2', quantity: 1 }
    ]);
  });

  it('calculateCategoryShare should calculate percentage share', () => {
    const result = calculateCategoryShare(mockOrders);
    // Cat A: Product 1 (3 items)
    // Cat B: Product 2 (1 item) + Product 3 (4 items) = 5 items
    // Total items: 8
    
    // Cat A: 3/8 = 37.5%
    // Cat B: 5/8 = 62.5%
    
    // Expecting result to be roughly correct or specific format
    // Let's assume it returns array of { name, value } for charts
    const catA = result.find(c => c.name === 'Cat A');
    const catB = result.find(c => c.name === 'Cat B');
    
    expect(catA?.value).toBe(3);
    expect(catB?.value).toBe(5);
  });

  describe('calculateGrowth', () => {
    it('should return percentage increase or decrease', () => {
      expect(calculateGrowth(150, 100)).toBe(50);
      expect(calculateGrowth(75, 100)).toBe(-25);
    });

    it('should handle zero previous period values', () => {
      expect(calculateGrowth(100, 0)).toBe(100);
      expect(calculateGrowth(0, 0)).toBe(0);
    });

    it('should handle equal values', () => {
      expect(calculateGrowth(100, 100)).toBe(0);
    });
  });

  describe('calculateCustomerMetrics', () => {
    const orders = [
      { id: '1', userId: 'u1', userEmail: 'u1@test.com', total: 100, status: 'paid' },
      { id: '2', userId: 'u2', userEmail: 'u2@test.com', total: 50, status: 'paid' },
      { id: '3', userId: 'u1', userEmail: 'u1@test.com', total: 200, status: 'paid' },
      { id: '4', userId: 'u3', userEmail: 'u3@test.com', total: 150, status: 'refunded' }, // ignored
      { id: '5', userId: 'u2', userEmail: 'u2@test.com', total: 100, status: 'paid' },
    ];

    it('should calculate new and returning customers correctly', () => {
      // Valid orders: 1, 2, 3, 5
      // u1: 2 (Returning)
      // u2: 2 (Returning)
      // Add a new user
      const moreOrders = [
        ...orders,
        { id: '6', userId: 'u4', userEmail: 'u4@test.com', total: 80, status: 'paid' },
      ];
      
      const metrics = calculateCustomerMetrics(moreOrders);
      // Valid orders: 1, 2, 3, 5, 6
      // u1: 2 (Returning)
      // u2: 2 (Returning)
      // u4: 1 (New)
      
      expect(metrics.newCustomers).toBe(1);
      expect(metrics.returningCustomers).toBe(2);
    });

    it('should calculate top customers by total spend', () => {
      const moreOrders = [
        ...orders,
        { id: '6', userId: 'u4', userEmail: 'u4@test.com', total: 80, status: 'paid' },
      ];
      const metrics = calculateCustomerMetrics(moreOrders);
      
      // u1: 100 + 200 = 300
      // u2: 50 + 100 = 150
      // u4: 80
      
      expect(metrics.topCustomers[0]).toEqual({ id: 'u1', email: 'u1@test.com', totalSpend: 300, orderCount: 2 });
      expect(metrics.topCustomers[1]).toEqual({ id: 'u2', email: 'u2@test.com', totalSpend: 150, orderCount: 2 });
      expect(metrics.topCustomers[2]).toEqual({ id: 'u4', email: 'u4@test.com', totalSpend: 80, orderCount: 1 });
    });

    it('should handle anonymous users or missing emails', () => {
      const anonOrders = [
        { id: '1', total: 100, status: 'paid' }, // No userId, no email
      ];
      const metrics = calculateCustomerMetrics(anonOrders);
      expect(metrics.topCustomers[0]).toEqual({ id: 'anonymous', email: 'N/A', totalSpend: 100, orderCount: 1 });
    });
  });
});
