# Specification: Home Page Plugin Architecture

## Overview
Migrate the Home page from a monolithic structure to a flexible, plugin-based architecture. This will allow administrators to reorder, toggle, and configure individual sections of the home screen via the Admin Panel, similar to the existing Product Detail Page (PDP) layout system.

## Functional Requirements
1.  **Home Plugin Registry:** Register the following plugins in `src/plugins/registry.ts`:
    -   `CinematicHero`: Displays the hero banner.
    -   `BestSellers`: Displays the trending products section.
    -   `ProductGridSection`: Displays category tabs and the filtered product grid.
    -   `ReviewSection`: Displays customer reviews.
    -   `PromoBanner`: Displays flash promotions or store messages (new).
2.  **Home Layout Configuration:**
    -   Define `HomeLayout` and `HomePluginConfig` interfaces in `storefrontService.ts`.
    -   Store the layout configuration within the `StorefrontSettings` document in Firestore.
    -   Provide a `DEFAULT_HOME_LAYOUT`.
3.  **Home Context Provider:**
    -   Create a `HomeContext` in `src/pages/Home.tsx` (or a separate component) to provide:
        -   `settings`: Storefront settings.
        -   `products`: Loaded product list.
        -   `categories`: Loaded category list.
        -   `bestSellers`: Loaded best sellers.
        -   `actions`: Object containing functions like `handleAddToCart`, `handleCategoryChange`, `navigate`, etc.
4.  **Plugin Renderer Integration:**
    -   Update `Home.tsx` to use `PluginRenderer`.
    -   Ensure `PluginRenderer` can render these new home plugins using the data from `HomeContext`.
5.  **Refactor Existing Components:**
    -   Extract logic from `Home.tsx` into individual plugin components in `src/plugins/home/`.

## Non-Functional Requirements
-   **Performance:** Maintain LCP and speed by ensuring loader-driven data is available to plugins immediately via context.
-   **Consistency:** Follow the existing patterns in `src/plugins/` for naming and structure.

## Acceptance Criteria
-   `Home.tsx` is simplified and primarily acts as a layout container and context provider.
-   All sections (Hero, Best Sellers, Grid, Reviews) are rendered via the `PluginRenderer`.
-   The order of sections can be changed by modifying the `homeLayout` in `StorefrontSettings`.
-   A new `PromoBanner` plugin is implemented and can be toggled via layout config.
-   Existing unit tests for `Home.tsx` are updated or new tests are created for plugins.

## Out of Scope
-   Actual Admin UI changes to reorder Home plugins (will be a separate track).
-   Changes to PDP plugin logic.
