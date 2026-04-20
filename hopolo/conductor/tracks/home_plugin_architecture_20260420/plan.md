# Implementation Plan: Home Page Plugin Architecture

## Phase 1: Foundation & Types [checkpoint: 414e9cf]
- [x] Task: Define Home Layout interfaces and types in `src/services/storefrontService.ts` (1308cd4)
    - [x] Add `HomePluginConfig` and `HomeLayout` interfaces.
    - [x] Update `StorefrontSettings` to include `homeLayout`.
    - [x] Provide `DEFAULT_HOME_LAYOUT`.
- [x] Task: Create `HomeContext` for data sharing between Home plugins (5fe4003)
    - [x] Define `HomeContextState` interface.
    - [x] Create `HomeContext.tsx` in `src/pages/Home/Context.tsx`.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Foundation & Types' (Protocol in workflow.md)

## Phase 2: Home Plugin Implementation
- [ ] Task: Implement `PromoBannerPlugin`
    - [ ] Create `src/plugins/home/PromoBanner/`
    - [ ] Implement component logic using `HomeContext`.
- [ ] Task: Implement `CinematicHeroPlugin`
    - [ ] Extract logic from existing `CinematicHero` component if necessary or wrap it.
    - [ ] Create `src/plugins/home/CinematicHero/`
- [ ] Task: Implement `BestSellersPlugin`
    - [ ] Create `src/plugins/home/BestSellers/`
    - [ ] Use `bestSellers` and `handleAddToCart` from context.
- [ ] Task: Implement `ProductGridSectionPlugin`
    - [ ] Create `src/plugins/home/ProductGridSection/`
    - [ ] Handle category tabs and product grid filtering logic.
- [ ] Task: Implement `ReviewSectionPlugin`
    - [ ] Create `src/plugins/home/ReviewSection/`
    - [ ] Use `settings.reviews` from context.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Home Plugin Implementation' (Protocol in workflow.md)

## Phase 3: Registry & Renderer Updates
- [ ] Task: Register new home plugins in `src/plugins/registry.ts`
- [ ] Task: Update `PluginRenderer` to be context-aware
    - [ ] Ensure it can handle plugins that don't rely solely on direct props.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Registry & Renderer Updates' (Protocol in workflow.md)

## Phase 4: Home Page Refactor
- [ ] Task: Refactor `src/pages/Home.tsx` to use the new architecture
    - [ ] Wrap content in `HomeProvider`.
    - [ ] Use `PluginRenderer` for the entire page body.
    - [ ] Simplify loader and action logic to only provide data.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Home Page Refactor' (Protocol in workflow.md)

## Phase 5: Verification & Cleanup
- [ ] Task: Update existing Home page integration tests
- [ ] Task: Verify mobile responsiveness for all new home plugins
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Verification & Cleanup' (Protocol in workflow.md)
