# Implementation Plan: Advanced Analytics & Reporting

This plan outlines the steps to enhance the admin analytics dashboard with comparative metrics, customer insights, and reporting capabilities.

## Phase 1: Core Analytics Enhancements (Logic) [checkpoint: aeb615c]
- [x] Task 1.1: Enhance `analyticsUtils.ts` with `calculateGrowth` function (cff86f0)
- [x] Task 1.2: Implement `calculateCustomerMetrics` in `analyticsUtils.ts` (New vs Returning, Top Customers) (67b9ac8)
- [x] Task 1.3: Update `aggregateRevenuePerDay` to handle arbitrary date ranges and empty days (2c55ff2)
- [x] Task 1.4: Add unit tests for new utility functions (2c55ff2)

## Phase 2: UI Components & Comparative Metrics [checkpoint: 5238381]
- [x] Task 2.1: Create `StatCard` component with growth/decline indicators (9bc1eba)
- [x] Task 2.2: Implement previous period calculation logic in `Analytics.tsx` (eaaf3c5)
- [x] Task 2.3: Update `Analytics.tsx` to display comparative stats (Revenue, Orders, AOV) (eaaf3c5)
- [x] Task 2.4: Verify responsiveness of new metric cards on mobile (eaaf3c5)

## Phase 3: Customer Insights & Advanced Filtering
- [x] Task 3.1: Add "Customers" section to the Analytics dashboard (dfe21b6)
- [x] Task 3.2: Implement "Top 10 Customers" data table (dfe21b6)
- [ ] Task 3.3: Implement Custom Date Range picker in the UI
- [x] Task 3.4: Add "New vs Returning" breakdown chart or indicator (dfe21b6)

## Phase 4: Reporting & Export
- [ ] Task 4.1: Create CSV export utility (`src/lib/csvUtils.ts`)
- [ ] Task 4.2: Add "Export Orders CSV" button to the dashboard
- [ ] Task 4.3: Add "Export Product Performance CSV" button
- [ ] Task 4.4: Final QA and polish of the entire Analytics suite

## Checkpoints
- [ ] **Phase 1 Checkpoint:** Core logic verified with tests. [checkpoint: ]
- [ ] **Phase 2 Checkpoint:** Comparative metrics visible and accurate in UI. [checkpoint: ]
- [ ] **Phase 3 Checkpoint:** Customer insights and custom filtering functional. [checkpoint: ]
- [ ] **Phase 4 Checkpoint:** Export capabilities verified and track complete. [checkpoint: ]
