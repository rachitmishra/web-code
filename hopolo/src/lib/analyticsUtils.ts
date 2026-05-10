export const aggregateRevenuePerDay = (orders: any[]) => {
  const revenueMap: Record<string, number> = {};

  orders.forEach(order => {
    if (order.status === 'refunded' || order.status === 'failed') return;
    
    // date format YYYY-MM-DD
    const date = order.createdAt.toDate().toISOString().split('T')[0];
    if (!revenueMap[date]) {
      revenueMap[date] = 0;
    }
    revenueMap[date] += order.total;
  });

  return Object.entries(revenueMap)
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export const calculateTopProducts = (orders: any[]) => {
  const productMap: Record<string, number> = {};

  orders.forEach(order => {
    if (order.status === 'refunded' || order.status === 'failed') return;

    order.items.forEach((item: any) => {
      const name = item.product.name;
      if (!productMap[name]) {
        productMap[name] = 0;
      }
      productMap[name] += item.quantity;
    });
  });

  return Object.entries(productMap)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
};

export const calculateCategoryShare = (orders: any[]) => {
  const categoryMap: Record<string, number> = {};

  orders.forEach(order => {
    if (order.status === 'refunded' || order.status === 'failed') return;

    order.items.forEach((item: any) => {
      const category = item.product.category;
      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }
      categoryMap[category] += item.quantity;
    });
  });

  return Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

export const calculateGrowth = (current: number, previous: number): number => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
};

export const calculateCustomerMetrics = (orders: any[]) => {
  const customerMap: Record<string, { id: string, email: string, totalSpend: number, orderCount: number }> = {};

  orders.forEach(order => {
    if (order.status === 'refunded' || order.status === 'failed') return;

    const userId = order.userId || 'anonymous';
    const userEmail = order.userEmail || 'N/A';

    if (!customerMap[userId]) {
      customerMap[userId] = { id: userId, email: userEmail, totalSpend: 0, orderCount: 0 };
    }

    customerMap[userId].totalSpend += order.total;
    customerMap[userId].orderCount += 1;
  });

  const customers = Object.values(customerMap);
  const newCustomers = customers.filter(c => c.orderCount === 1).length;
  const returningCustomers = customers.filter(c => c.orderCount > 1).length;

  const topCustomers = [...customers]
    .sort((a, b) => b.totalSpend - a.totalSpend)
    .slice(0, 10);

  return {
    newCustomers,
    returningCustomers,
    topCustomers
  };
};
