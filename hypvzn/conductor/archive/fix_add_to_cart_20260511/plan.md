# Implementation Plan: Fix Add to Cart Behavior

## Phase 1: Diagnose and Fix Firestore Permissions
- [x] Task: Investigate current Firestore security rules and cart document initialization logic to identify the cause of the `Access denied` error.
- [x] Task: Write failing test demonstrating the `Access denied` error for an authenticated user attempting to add an item to the cart.
- [x] Task: Implement the fix (e.g., update `firestore.rules` or the cart initialization function) to allow authenticated users to write to their cart.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Diagnose and Fix Firestore Permissions' (Protocol in workflow.md)

## Phase 2: Guest Cart Support
- [x] Task: Write failing tests for guest users adding items to a cart (verifying anonymous authentication or local storage behavior).
- [x] Task: Implement guest cart functionality, ensuring unauthenticated users can successfully add items and view their cart.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Guest Cart Support' (Protocol in workflow.md)

## Phase 3: Enhance Visual Feedback (UX)
- [x] Task: Write/update tests for the `AddToCart` button to ensure it displays loading and success states.
- [x] Task: Implement temporary state changes (spinner, "Added!") on the `AddToCart` button component.
- [x] Task: Write/update tests verifying that adding an item triggers the cart drawer to open and a success toast to appear.
- [x] Task: Implement logic to automatically open the Cart Drawer and display a success toast upon successful addition to the cart.
- [x] Task: Verify and update tests to ensure the Cart Icon counter accurately reflects the updated cart state immediately.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Enhance Visual Feedback (UX)' (Protocol in workflow.md)