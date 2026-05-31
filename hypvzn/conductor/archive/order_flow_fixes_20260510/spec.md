# Specification: End-to-End Order Flow & Cart Fixes

## 1. Overview
This track addresses reported failures when adding items to the cart from the Home screen and Product Detail Page (PDP). Furthermore, it broadens the scope to conduct a comprehensive review and implementation fix of the entire end-to-end checkout flow to ensure a seamless purchasing experience.

## 2. Functional Requirements
*   **Add to Cart (Home & PDP):**
    *   Debug and fix the "Add to Cart" action on both the Home screen and PDP so items are successfully registered in the user's cart (Firestore).
    *   **Home Screen Variants:** When adding a product with multiple variants from the Home screen, implement a "Quick View" modal to allow the user to select their desired variant before adding.
    *   **UI Feedback:** Upon successfully adding an item to the cart, the Mini-Cart drawer must automatically open.
*   **Checkout & Shipping:**
    *   Verify the cart correctly calculates totals and transitions to the Checkout phase.
    *   Ensure shipping address selection and entry work correctly and persist to the order details.
*   **Payment & Post-Order:**
    *   Verify Razorpay integration successfully processes payments and handles webhooks/callbacks to update order status.
    *   Ensure the post-order Success screen renders correctly with the confirmed order details.
    *   Verify that order confirmation emails are successfully dispatched to the user.

## 3. Non-Functional Requirements
*   **Data Integrity:** Ensure the cart synchronization with Firestore remains real-time and consistent across tabs/devices.
*   **User Experience:** Maintain the "Technical Brutalism" design language, ensuring any new UI components (like the Quick View modal) adhere to the Ethos Archetype guidelines.

## 4. Acceptance Criteria
*   [ ] Clicking "Add to Cart" on a simple product from the Home screen adds it to the cart and opens the Mini-Cart.
*   [ ] Clicking "Add to Cart" on a variant product from the Home screen opens a Quick View modal for selection.
*   [ ] "Add to Cart" on the PDP successfully adds the selected variant and opens the Mini-Cart.
*   [ ] Users can proceed from the Cart to Checkout without errors.
*   [ ] Shipping addresses can be selected/entered during checkout.
*   [ ] Payments process successfully via Razorpay (test mode).
*   [ ] The user is redirected to a valid Success screen upon payment completion.
*   [ ] An order confirmation email is received (or properly logged in the email service).

## 5. Out of Scope
*   Adding new payment gateways other than Razorpay.
*   Implementing complex shipping rule calculators (sticking to the existing Shadowfax integration scope).