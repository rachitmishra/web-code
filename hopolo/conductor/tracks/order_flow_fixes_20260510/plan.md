# Implementation Plan: End-to-End Order Flow & Cart Fixes

## Phase 1: Add to Cart & Quick View Modal
- [x] Task: Fix Home & PDP Add to Cart (c65161f)
    - [x] Write Tests: Create failing tests for the "Add to Cart" actions on both Home and PDP components.
    - [x] Implement: Fix the server action/client fetcher logic to ensure items are successfully added to the Firestore cart.
    - [x] Refactor: Ensure the Mini-Cart automatically opens when an item is successfully added.
- [x] Task: Implement Quick View Modal (c65161f)
    - [x] Write Tests: Create tests for a new Quick View modal component that handles variant selection.
    - [x] Implement: Build the Quick View modal, adhering to the Ethos Archetype design system.
    - [x] Refactor: Integrate the modal into the Home screen product grid, triggering it when "Add to Cart" is clicked for multi-variant products.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Add to Cart & Quick View Modal' (Protocol in workflow.md)

## Phase 2: Checkout & Payment Flow
- [ ] Task: Verify Checkout & Shipping
    - [ ] Write Tests: Create tests ensuring the Cart component correctly passes data and navigates to the Checkout flow.
    - [ ] Implement: Verify and fix any issues in the Checkout component regarding shipping address selection and form data persistence.
- [ ] Task: Verify Razorpay Integration
    - [ ] Write Tests: Add tests for the payment service and Razorpay callback handling logic.
    - [ ] Implement: Ensure the frontend correctly initializes the Razorpay script and handles success/error callbacks, updating the backend order status appropriately.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Checkout & Payment Flow' (Protocol in workflow.md)

## Phase 3: Post-Order & Notifications
- [ ] Task: Fix Success Screen & Emails
    - [ ] Write Tests: Test the Success screen rendering logic and the email dispatch service.
    - [ ] Implement: Verify the Success screen loads correctly with the finalized order details.
    - [ ] Implement: Ensure the backend triggers the email confirmation service upon successful payment verification.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Post-Order & Notifications' (Protocol in workflow.md)