# Specification: Fix Add to Cart Behavior

## Overview
Currently, the "Add to Cart" functionality on the Home screen and Product Detail Page (PDP) is unresponsive. When a logged-in user attempts to add an item to their cart, a Firestore "Access denied" error is thrown (`Access denied for <UID>`). This track will resolve the Firestore permission issue for authenticated users and ensure a smooth, feedback-rich experience when adding items to the cart. Additionally, it will establish or verify support for guest carts.

## Functional Requirements
- **Resolve Firestore Permissions:** Fix the Firestore security rules or the document initialization logic that is causing the `Access denied` error for authenticated users when writing to their cart document.
- **Guest Cart Support:** Ensure unauthenticated users can successfully add items to a cart (utilizing anonymous authentication or local storage) which can later be merged or associated with an account upon login.
- **Visual Feedback (UX):** Upon successfully adding an item to the cart, the UI must:
  - Automatically slide out/open the cart drawer.
  - Display a success toast/notification.
  - Instantly update the cart icon counter in the header.
  - Show a temporary state change on the "Add to Cart" button (e.g., showing a spinner while loading, then "Added!").

## Non-Functional Requirements
- **Performance:** Cart updates should feel instantaneous, leveraging Firestore's optimistic local updates where applicable.
- **Reliability:** Graceful error handling should be in place if the cart addition fails (e.g., network issues), showing an appropriate error message to the user rather than failing silently.

## Acceptance Criteria
- [ ] A logged-in user can add a product to their cart from the Home screen without encountering an "Access denied" error.
- [ ] A logged-in user can add a product to their cart from the PDP without encountering an "Access denied" error.
- [ ] A guest (unauthenticated) user can add a product to their cart successfully.
- [ ] Adding an item successfully opens the cart drawer.
- [ ] Adding an item successfully triggers a success toast.
- [ ] Adding an item successfully updates the cart counter in the header.
- [ ] The "Add to Cart" button provides immediate visual feedback (e.g., loading state, success state) upon click.

## Out of Scope
- Major redesign of the Cart Drawer UI.
- Changes to the checkout flow itself.