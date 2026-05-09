# Implementation Plan: Fix Home Screen Links

## Phase 1: Infrastructure & Data Modeling
- [x] Task: Extend Storefront Settings schema to support configurable page content. (ce1a2ba)
    - [x] Update `StorefrontSettings` interface in `src/services/storefrontService.ts`.
    - [x] Add `pageContent` field (map of route to content).
    - [x] Update `DEFAULT_SETTINGS`.
- [x] Task: Implement server-side redirects for broken links. (aa8a1bf)
    - [x] Create `src/lib/redirects.server.ts` to handle legacy or broken paths.
    - [x] Configure redirects to point to new routes.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Infrastructure & Data Modeling' (Protocol in workflow.md) (3954c65)

## Phase 2: Page Creation & Routing
- [x] Task: Create missing static pages with basic content. (c7a0f9f)
    - [x] Create generic `src/pages/StaticPage.tsx` for legal/info pages.
- [x] Task: Register new routes in React Router. (c7a0f9f)
    - [x] Update `app/routes.ts` to include the new pages.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Page Creation & Routing' (Protocol in workflow.md) (3954c65)

## Phase 3: Link Updates & SPA Navigation
- [x] Task: Update Header links to use `Link` component. (aa8a1bf)
    - [x] Modify `src/components/layout/Header/Header.tsx`.
- [x] Task: Update Product Card links to use `navigate()`. (aa8a1bf)
    - [x] Modify `src/components/ui/ProductCard/ProductCard.tsx`.
- [x] Task: Update Footer links to use `Link` component. (aa8a1bf)
    - [x] Modify `src/components/layout/MainLayout.tsx` (where Footer is currently located).
- [x] Task: Update CTA buttons to use appropriate navigation methods. (aa8a1bf)
    - [x] Update `CinematicHero.tsx` and other plugins.
- [x] Task: Implement smooth scroll for anchor links. (aa8a1bf)
    - [x] Add a utility for smooth scrolling in `src/lib/scroll.ts`.
    - [x] Apply to any on-page section links.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Link Updates & SPA Navigation' (Protocol in workflow.md) (3954c65)

## Phase 4: Admin Panel Integration
- [x] Task: Create Admin UI for managing page content. (aab1b44)
    - [x] Create `src/pages/Admin/PageManager.tsx`.
    - [x] Add a new section in Admin sidebar.
- [x] Task: Implement save functionality for page content. (aab1b44)
    - [x] Add `updatePageContent` in `storefrontService.server.ts`.
- [x] Task: Conductor - User Manual Verification 'Phase 4: Admin Panel Integration' (Protocol in workflow.md) (aab1b44)

## Phase 5: Styling & Polish
- [x] Task: Refine link styles (hover, active, focus). (75cde03)
    - [x] Update `index.css` or component-specific CSS modules.
    - [x] Ensure alignment with "Ethos Archetype" (0px radius, 1px borders).
- [x] Task: Conductor - User Manual Verification 'Phase 5: Styling & Polish' (Protocol in workflow.md) (75cde03)
