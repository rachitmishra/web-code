# Implementation Plan: Fix Home Screen Links

## Phase 1: Infrastructure & Data Modeling
- [x] Task: Extend Storefront Settings schema to support configurable page content. (ce1a2ba)
    - [ ] Update `StorefrontSettings` interface in `src/services/storefrontService.ts`.
    - [ ] Add `pageContent` field (map of route to content).
    - [ ] Update `DEFAULT_SETTINGS`.
- [ ] Task: Implement server-side redirects for broken links.
    - [ ] Create `app/routes/redirects.ts` to handle legacy or broken paths.
    - [ ] Configure redirects to point to new routes.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Infrastructure & Data Modeling' (Protocol in workflow.md)

## Phase 2: Page Creation & Routing
- [ ] Task: Create missing static pages with basic content.
    - [ ] Create `src/pages/Collections.tsx`.
    - [ ] Create `src/pages/Archive.tsx`.
    - [ ] Create `src/pages/Stockists.tsx`.
    - [ ] Create a generic `src/pages/StaticPage.tsx` for legal/info pages.
- [ ] Task: Register new routes in React Router.
    - [ ] Update `app/routes.ts` to include the new pages.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Page Creation & Routing' (Protocol in workflow.md)

## Phase 3: Link Updates & SPA Navigation
- [ ] Task: Update Header links to use `Link` component.
    - [ ] Modify `src/components/layout/Header/Header.tsx`.
- [ ] Task: Update Product Card links to use `navigate()`.
    - [ ] Modify `src/components/ui/ProductCard/ProductCard.tsx`.
- [ ] Task: Update Footer links to use `Link` component.
    - [ ] Modify `src/components/layout/MainLayout.tsx` (where Footer is currently located).
- [ ] Task: Update CTA buttons to use appropriate navigation methods.
    - [ ] Update `CinematicHero.tsx` and other plugins.
- [ ] Task: Implement smooth scroll for anchor links.
    - [ ] Add a utility for smooth scrolling.
    - [ ] Apply to any on-page section links.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Link Updates & SPA Navigation' (Protocol in workflow.md)

## Phase 4: Admin Panel Integration
- [ ] Task: Create Admin UI for managing page content.
    - [ ] Create `src/pages/Admin/PageManager.tsx`.
    - [ ] Add a new section in Admin sidebar.
- [ ] Task: Implement save functionality for page content.
    - [ ] Add `updatePageContent` in `storefrontService.server.ts`.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Admin Panel Integration' (Protocol in workflow.md)

## Phase 5: Styling & Polish
- [ ] Task: Refine link styles (hover, active, focus).
    - [ ] Update `index.css` or component-specific CSS modules.
    - [ ] Ensure alignment with "Ethos Archetype" (0px radius, 1px borders).
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Styling & Polish' (Protocol in workflow.md)
