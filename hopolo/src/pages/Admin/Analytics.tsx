import React, { useState, useMemo } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { type Order } from "../../services/orderService";
import {
  aggregateRevenuePerDay,
  calculateTopProducts,
  calculateCategoryShare,
  calculateGrowth,
  calculateCustomerMetrics,
} from "../../lib/analyticsUtils";
import Card from "../../components/ui/Card/Card";
import Button from "../../components/ui/Button/Button";
import StatCard from "../../components/ui/StatCard/StatCard";
import RevenueAreaChart from "../../components/ui/Charts/RevenueAreaChart";
import TopProductsBarChart from "../../components/ui/Charts/TopProductsBarChart";
import CategoryDonutChart from "../../components/ui/Charts/CategoryDonutChart";
import styles from "./Analytics.module.css";

export { loader } from './Analytics.server';

type TimeRange = "today" | "7d" | "30d" | "custom";

const Analytics: React.FC = () => {
  const { orders } = useLoaderData() as { orders: Order[] };
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [customStart, setCustomStart] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [customEnd, setCustomEnd] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const navigate = useNavigate();

  // Helper to filter by range
  const filterOrders = (start: Date, end: Date) => {
    return orders.filter((o) => {
      const orderDate = o.createdAt?.toDate ? o.createdAt.toDate() : new Date();
      return orderDate >= start && orderDate <= end && o.status !== "refunded" && o.status !== "failed";
    });
  };

  // Get current and previous period orders
  const { currentOrders, previousOrders, dateRange } = useMemo(() => {
    const now = new Date();
    const currentStart = new Date();
    const prevStart = new Date();
    const prevEnd = new Date();

    if (timeRange === "today") {
      currentStart.setHours(0, 0, 0, 0);
      prevStart.setDate(now.getDate() - 1);
      prevStart.setHours(0, 0, 0, 0);
      prevEnd.setDate(now.getDate() - 1);
      prevEnd.setHours(23, 59, 59, 999);
    } else if (timeRange === "7d") {
      currentStart.setDate(now.getDate() - 7);
      prevStart.setDate(now.getDate() - 14);
      prevEnd.setDate(now.getDate() - 7);
    } else if (timeRange === "30d") {
      currentStart.setDate(now.getDate() - 30);
      prevStart.setDate(now.getDate() - 60);
      prevEnd.setDate(now.getDate() - 30);
    } else if (timeRange === "custom") {
      const s = new Date(customStart);
      const e = new Date(customEnd);
      e.setHours(23, 59, 59, 999);
      currentStart.setTime(s.getTime());
      now.setTime(e.getTime());
      
      const diff = e.getTime() - s.getTime();
      prevEnd.setTime(s.getTime() - 1);
      prevStart.setTime(prevEnd.getTime() - diff);
    }

    return {
      currentOrders: filterOrders(currentStart, now),
      previousOrders: filterOrders(prevStart, prevEnd),
      dateRange: { start: currentStart, end: now }
    };
  }, [orders, timeRange, customStart, customEnd]);

  // Calculations
  const revenueData = useMemo(() => {
    return aggregateRevenuePerDay(
      currentOrders, 
      dateRange.start.toISOString().split('T')[0], 
      dateRange.end.toISOString().split('T')[0]
    );
  }, [currentOrders, dateRange]);

  const topProducts = useMemo(() => calculateTopProducts(currentOrders), [currentOrders]);
  const categoryShare = useMemo(() => calculateCategoryShare(currentOrders), [currentOrders]);
  const customerMetrics = useMemo(() => calculateCustomerMetrics(currentOrders), [currentOrders]);

  const currentStats = useMemo(() => {
    const revenue = currentOrders.reduce((sum, o) => sum + o.total, 0);
    const ordersCount = currentOrders.length;
    const aov = ordersCount > 0 ? revenue / ordersCount : 0;
    return { revenue, ordersCount, aov };
  }, [currentOrders]);

  const previousStats = useMemo(() => {
    const revenue = previousOrders.reduce((sum, o) => sum + o.total, 0);
    const ordersCount = previousOrders.length;
    const aov = ordersCount > 0 ? revenue / ordersCount : 0;
    return { revenue, ordersCount, aov };
  }, [previousOrders]);

  const growth = {
    revenue: calculateGrowth(currentStats.revenue, previousStats.revenue),
    orders: calculateGrowth(currentStats.ordersCount, previousStats.ordersCount),
    aov: calculateGrowth(currentStats.aov, previousStats.aov)
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Analytics</h1>
        <div className={styles.controls}>
          {(["today", "7d", "30d", "custom"] as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "primary" : "outline"}
              onClick={() => setTimeRange(range)}
              style={{ padding: "4px 12px", fontSize: "0.75rem" }}
            >
              {range === "today" ? "Today" : range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "Custom"}
            </Button>
          ))}
        </div>
      </div>

      {timeRange === 'custom' && (
        <Card className={styles.customRangeCard}>
          <div className={styles.customRangeInputs}>
            <div className={styles.field}>
              <label className={styles.label}>Start Date</label>
              <input 
                type="date" 
                value={customStart} 
                onChange={(e) => setCustomStart(e.target.value)}
                className={styles.dateInput}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>End Date</label>
              <input 
                type="date" 
                value={customEnd} 
                onChange={(e) => setCustomEnd(e.target.value)}
                className={styles.dateInput}
              />
            </div>
          </div>
        </Card>
      )}

      <div className={styles.summaryGrid}>
        <StatCard 
          label="Revenue" 
          value={`$${currentStats.revenue.toFixed(2)}`} 
          growth={growth.revenue}
        />
        <StatCard 
          label="Total Orders" 
          value={currentStats.ordersCount} 
          growth={growth.orders}
        />
        <StatCard 
          label="Avg Order Value" 
          value={`$${currentStats.aov.toFixed(2)}`} 
          growth={growth.aov}
        />
      </div>

      <div className={styles.chartsGrid}>
        <Card className={styles.fullWidth}>
          <h3>Revenue Over Time</h3>
          <div className={styles.chartContainer}>
            <RevenueAreaChart data={revenueData} />
          </div>
        </Card>

        <Card>
          <h3>Top Selling Products</h3>
          <div className={styles.chartContainer}>
            <TopProductsBarChart data={topProducts} />
          </div>
        </Card>

        <Card>
          <h3>Category Distribution</h3>
          <div className={styles.chartContainer}>
            <CategoryDonutChart data={categoryShare} />
          </div>
        </Card>

        <Card className={styles.fullWidth}>
          <h3>Customer Insights</h3>
          <div className={styles.customerGrid}>
            <div className={styles.customerMetric}>
              <div className={styles.statLabel}>New Customers</div>
              <div className={styles.statValue}>{customerMetrics.newCustomers}</div>
            </div>
            <div className={styles.customerMetric}>
              <div className={styles.statLabel}>Returning Customers</div>
              <div className={styles.statValue}>{customerMetrics.returningCustomers}</div>
            </div>
          </div>
        </Card>

        <Card className={styles.fullWidth}>
          <h3>Top Customers</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Email</th>
                  <th className={styles.th}>Total Spend</th>
                  <th className={styles.th}>Order Count</th>
                </tr>
              </thead>
              <tbody>
                {customerMetrics.topCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className={styles.td}>{customer.email}</td>
                    <td className={styles.td}>${customer.totalSpend.toFixed(2)}</td>
                    <td className={styles.td}>{customer.orderCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;

