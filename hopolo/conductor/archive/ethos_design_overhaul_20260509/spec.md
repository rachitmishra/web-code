# Track Specification: Ethos Design Overhaul

## Overview
This track involves a comprehensive visual overhaul of the HYPVZN storefront to align with the "Ethos Archetype" design system generated in Stitch. The update will transform the current aesthetic into a "Technical Luxury" style, characterized by a monochromatic palette, brutalist layouts, sharp edges, and high-impact typography.

## Goals
-   Implement the "Ethos Archetype" design system across the core storefront pages.
-   Refactor existing React components to use the new visual language.
-   Maintain existing functionality (real-time cart, checkout) while updating the UI.
-   Ensure a consistent experience across desktop and mobile.

## Functional Requirements
-   **Design System Update:**
    -   Update global CSS variables to match Ethos tokens (Colors: #000000, #FFFFFF, #8A2BE2; Typography: Space Grotesk, Inter; Spacing: 4px unit).
    -   Enforce zero-radius (sharp corners) on all UI elements.
-   **Storefront Refactoring:**
    -   **Homepage:** Implement the minimalist, grid-based layout for both desktop and mobile.
    -   **Product Detail (PDP):** Update the layout to match the technical, archival style from Stitch.
    -   **Cart / Bag:** Refactor the cart drawer/page to align with the new aesthetic.
    -   **Checkout & Confirm:** Update the checkout flow and order confirmation pages/emails.
-   **CSS Implementation:**
    -   Manually convert Tailwind CSS classes from Stitch assets into CSS Modules and project-level utility variables.
    -   Do NOT introduce Tailwind CSS to the project; adhere to the existing CSS Modules architecture.

## Non-Functional Requirements
-   **Performance:** Ensure the new designs do not negatively impact page load times or interaction speed.
-   **Responsiveness:** Perfect alignment with both desktop and mobile designs provided in `stitch_assets/`.
-   **Maintainability:** Use semantic CSS variables for all design tokens.

## Acceptance Criteria
-   The homepage matches the `homepage_desktop.png` and `homepage_mobile.png` designs.
-   The PDP matches the `product_detail_mobile.png` design.
-   The Cart, Checkout, and Confirmation flows match their respective Stitch designs.
-   All components use the updated global design tokens.
-   Tests for refactored components pass with >80% coverage.

## Out of Scope
-   Introduction of new functional features (e.g., product filtering, search).
-   Migration from CSS Modules to Tailwind CSS.
-   Changes to the Admin Panel (unless global design tokens affect it).
