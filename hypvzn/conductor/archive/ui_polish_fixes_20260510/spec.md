# Specification: UI Polish & Bug Fixes (Login, Banner, Theme)

## 1. Overview
This track addresses three critical user experience and interface issues:
1.  **Login Routing:** Improving the post-login experience by routing admin users to the Admin Panel and updating the header state for regular users on the homescreen.
2.  **Home Banner Fix:** Resolving a bug where the promotional banner configured in the Admin Panel fails to display on the storefront home page.
3.  **Theme Contrast & Consistency:** Fixing poor text visibility and standardizing background colors across all app pages (including the Admin Panel) by adjusting existing Ethos Archetype CSS variables.

## 2. Functional Requirements
*   **Login Routing & Header:**
    *   Upon successful login, check the user's Firestore document for a `role` field.
    *   If `role` indicates admin privileges, redirect the user immediately to `/admin`.
    *   If not an admin, keep the user on the home screen and ensure the global header updates to reflect the authenticated state (e.g., showing profile/logout options).
*   **Home Banner Visibility:**
    *   Fetch the storefront configuration document from Firestore on the home page.
    *   Correctly parse and render the banner component if active in the configuration.
*   **Theme Adjustments:**
    *   Review and adjust existing CSS variables in the Ethos Archetype design system to ensure accessible contrast ratios between text and backgrounds.
    *   Apply a consistent background color variable to the root layout, ensuring both the main storefront and admin panel share the same base appearance.

## 3. Non-Functional Requirements
*   **Performance:** Theme changes should be purely CSS-based without adding JavaScript overhead. Banner fetching should use appropriate caching or snapshot listeners if real-time updates are desired, minimizing read operations.
*   **Design Consistency:** Maintain the "Technical Brutalism" Ethos Archetype while improving accessibility.

## 4. Acceptance Criteria
*   [ ] Admin users logging in from the home page are redirected to `/admin`.
*   [ ] Non-admin users logging in stay on the home page, and the header reflects their logged-in status.
*   [ ] Activating the promo banner in the Admin Panel makes it immediately visible on the home page.
*   [ ] Text is clearly legible against backgrounds on all pages, passing basic contrast checks.
*   [ ] The background color is uniform across the storefront and admin panel.

## 5. Out of Scope
*   Adding new theme modes (e.g., a completely new light mode if one doesn't exist).
*   Creating a new role management UI (relying on existing role assignment).