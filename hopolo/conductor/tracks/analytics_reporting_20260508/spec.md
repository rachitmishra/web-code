# Specification: Advanced Analytics & Reporting

## Overview
This track aims to transform the basic admin analytics page into a comprehensive business intelligence tool. Boutique owners need to understand not just *how much* they are selling, but *who* is buying, how their performance compares to previous periods, and have the ability to export this data for external bookkeeping or deeper analysis.

## Goals
-   **Comparative Metrics:** Show growth/decline percentages for Revenue, Total Orders, and Average Order Value (AOV) compared to the previous period (e.g., current 7 days vs. previous 7 days).
-   **Customer Analytics:**
    -   Identify "New" vs. "Returning" customers.
    -   Calculate Customer Lifetime Value (CLV) averages.
    -   List top 10 customers by total spend.
-   **Advanced Reporting:**
    -   Implement a custom date range picker.
    -   Provide a "Download CSV" feature for order data and product performance.
-   **Enhanced Visualizations:**
    -   Improve existing charts with better tooltips and interactivity.
    -   Add a "Sales by Region" (if address data allows) or "Sales by Hour" chart to identify peak shopping times.

## Technical Changes
### 1. Analytics Utilities (`src/lib/analyticsUtils.ts`)
-   Implement `calculateGrowth(current, previous)` helper.
-   Implement `calculateCustomerMetrics(orders)` to identify returning users and spend per user.
-   Enhance `aggregateRevenuePerDay` to support more granular time buckets if needed.

### 2. Analytics Page UI (`src/pages/Admin/Analytics.tsx`)
-   Add "Metric Cards" with growth indicators (up/down arrows and percentages).
-   Add a new "Customers" tab or section with a data table for top customers.
-   Integrate a date range picker component (using standard HTML5 inputs or a lightweight library if necessary).
-   Add an "Export" button that generates and triggers a CSV download.

### 3. CSV Export Logic
-   Create a utility function to convert JSON order data to CSV format.
-   Ensure sensitive customer data is handled according to privacy guidelines (e.g., masking or excluding internal IDs).

## Acceptance Criteria
- [ ] Analytics dashboard shows % change for Revenue, Orders, and AOV.
- [ ] "New vs Returning" metric is visible and accurate based on phone number/email history.
- [ ] Top 10 customers list is displayed with their total lifetime spend.
- [ ] Admin can select a custom date range and charts update accordingly.
- [ ] "Export CSV" generates a valid, readable CSV file of all filtered orders.
- [ ] Dashboard remains fully responsive on mobile devices.
