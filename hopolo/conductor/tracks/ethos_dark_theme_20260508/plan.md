# Implementation Plan: Ethos Archetype (Full Dark Overhaul)

## Objective
Overhaul the Hopolo application to match the "Ethos Archetype" design system from Stitch, characterized by a dark, Brutalist aesthetic ("Technical Luxury").

## Scope & Impact
- **Global CSS (`src/index.css`)**: Update color variables to the dark palette (`#131313` background, `#FFFFFF` text) and typography (Space Grotesk & Inter).
- **Core UI Components (`src/components/ui/`)**: Update Button, Input, ProductCard, and layout components to use strict grids, no shadows, and tonal layering.
- **Pages (`src/pages/`)**: Adjust Home, Product Detail, Cart, and Checkout pages to align with the new structural and spacing guidelines (e.g., negative space, full-width borders).

## Proposed Solution
1. **Design Tokens Update**: Redefine CSS Custom Properties in `index.css` to match the `design_system.json` (Dark Mode, 0px border radius, Space Grotesk + Inter).
2. **Component Refactor**: Remove existing shadows and soft corners from components. Implement 1px solid borders for structure (`#313030` or similar inverse-on-surface colors).
3. **Typography Switch**: Change font families across the app to use `Space Grotesk` for headlines and `Inter` for body/labels.
4. **Page Layout Adjustments**: Ensure alignment with the "gallery-like" spacing specified in the Ethos archetype.

## Alternatives Considered
- **Togglable Theme**: Maintaining the light theme and adding dark mode as a toggle. Rejected by the user in favor of a complete dark overhaul to solidify the brand identity.
- **Specific Sub-brand Focus**: Selectively applying designs to certain pages. Rejected in favor of consistency across the entire funnel.

## Implementation Steps
1. Update `src/index.css` with new color variables, fonts, and spacing.
2. Update `src/components/ui/Button` and `src/components/ui/Input` to use the new brutalist styles (no background fill by default, sharp corners, explicit focus states).
3. Refactor `ProductCard` to rely on tonal layering instead of shadows.
4. Update `Home.tsx`, `ProductDetail.tsx`, `Cart.tsx`, and `Checkout.tsx` to utilize the new spacing and component styles.

## Verification & Testing
- Visual regression testing against the Stitch `stitch_assets` (e.g., `homepage_desktop.png`, `product_detail_mobile.png`).
- Ensure color contrast ratios meet accessibility standards for the new dark theme.
- Test interactive states (hover, focus) without shadows.

## Migration & Rollback
- Revert the `index.css` and component changes via Git if the design needs to be rolled back.
