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

## Phase 2: Home Plugin Implementation [checkpoint: 21b5098]
- [x] Task: Implement `PromoBannerPlugin` (f7806f2)
    - [x] Create `src/plugins/home/PromoBanner/`
    - [x] Implement component logic using `HomeContext`.
- [x] Task: Implement `CinematicHeroPlugin` (b0fde8b)
    - [x] Extract logic from existing `CinematicHero` component if necessary or wrap it.
    - [x] Create `src/plugins/home/CinematicHero/`
- [x] Task: Implement `BestSellersPlugin` (9a17a4f)
    - [x] Create `src/plugins/home/BestSellers/`
    - [x] Use `bestSellers` and `handleAddToCart` from context.
- [x] Task: Implement `ProductGridSectionPlugin` (06381a0)
    - [x] Create `src/plugins/home/ProductGridSection/`
    - [x] Handle category tabs and product grid filtering logic.
- [x] Task: Implement `ReviewSectionPlugin` (05e3a01)
    - [x] Create `src/plugins/home/ReviewSection/`
    - [x] Use `settings.reviews` from context.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Home Plugin Implementation' (Protocol in workflow.md)

## Phase 3: Registry & Renderer Updates [checkpoint: 1da339c]
- [x] Task: Register new home plugins in `src/plugins/registry.ts` (3098713)
- [x] Task: Update `PluginRenderer` to be context-aware (5add4ed)
    - [x] Ensure it can handle plugins that don't rely solely on direct props.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Registry & Renderer Updates' (Protocol in workflow.md) (1da339c)

## Phase 4: Home Page Refactor
- [x] Task: Refactor `src/pages/Home.tsx` to use the new architecture (5a46c99)
    - [x] Wrap content in `HomeProvider`.
    - [x] Use `PluginRenderer` for the entire page body.
    - [x] Simplify loader and action logic to only provide data.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Home Page Refactor' (Protocol in workflow.md)

## Phase 5: Verification & Cleanup
- [ ] Task: Update existing Home page integration tests
- [ ] Task: Verify mobile responsiveness for all new home plugins
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Verification & Cleanup' (Protocol in workflow.md)
