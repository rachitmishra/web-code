# Implementation Plan: Advanced Analytics & Reporting

## Phase 1: External Analytics Integration
- [ ] Task: Set up External Tracking
    - [ ] Write Tests: Create failing tests for an analytics utility module ensuring tracking functions are called correctly.
    - [ ] Implement: Integrate the external analytics script (e.g., GA4) into the application entry point (`root.tsx` or similar).
    - [ ] Implement: Create a utility module (`analyticsUtils.ts`) to handle event tracking (page views, add to cart, checkout).
    - [ ] Refactor: Hook up key components (Home, PDP, Cart, Checkout) to use the tracking utility.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: External Analytics Integration' (Protocol in workflow.md)

## Phase 2: Enhanced Admin Dashboard
- [ ] Task: Update Analytics UI & Data Fetching
    - [ ] Write Tests: Create failing tests for the enhanced Analytics dashboard component and new data fetching logic.
    - [ ] Implement: Update server-side logic (`Analytics.server.ts` or similar) to fetch and aggregate product performance metrics from Firestore.
    - [ ] Implement: Update the `Analytics.tsx` component to display the new product metrics alongside existing data.
    - [ ] Note: Behavioral data fetched from the external integration may require specific API setups depending on the provider; for this phase, we focus on internal product data aggregation to supplement the external view.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Enhanced Admin Dashboard' (Protocol in workflow.md)

## Phase 3: Reporting Features (Export & Scheduled)
- [ ] Task: Implement Data Export
    - [ ] Write Tests: Create failing tests for CSV generation logic.
    - [ ] Implement: Add a "Download CSV" button to the Analytics dashboard that triggers a server action to generate and return a CSV file of current metrics.
- [ ] Task: Implement Scheduled Email Reports
    - [ ] Write Tests: Create failing tests for the report generation and email sending logic.
    - [ ] Implement: Create a backend scheduled task (e.g., Firebase Scheduled Function) that aggregates weekly/daily metrics.
    - [ ] Implement: Integrate with the existing email service to send the aggregated report to admin emails.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Reporting Features' (Protocol in workflow.md)