# Implementation Plan: Plugin-Based PDP

## Phase 1: Foundation & Infrastructure [checkpoint: 0547f96]
- [x] Task: Define Plugin Interface and Registry (722ad31)
    - [ ] Create `src/plugins/registry.ts` to manage plugin registrations.
    - [ ] Define standard Types/Interfaces for Plugin components and configurations.
- [x] Task: Create Plugin Directory Structure (ff482fe)
    - [ ] Create `src/plugins/pdp/` for PDP-specific plugins.
    - [ ] Create initial empty folders for ImageGallery, ProductInfo, Reviews, etc.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Foundation & Infrastructure' (Protocol in workflow.md) (0547f96)

## Phase 2: Refactor PDP Sections to Plugins
- [x] Task: Convert Image Gallery to Plugin (c1c7984)
    - [ ] Write tests for `ImageGalleryPlugin`.
    - [ ] Implement component in `src/plugins/pdp/ImageGallery/`.
- [x] Task: Convert Product Info to Plugin (ea71086)
    - [ ] Write tests for `ProductInfoPlugin`.
    - [ ] Implement component in `src/plugins/pdp/ProductInfo/`.
- [x] Task: Convert Reviews to Plugin (d1393c0)
    - [ ] Write tests for `ReviewsPlugin`.
    - [ ] Implement component in `src/plugins/pdp/Reviews/`.
- [x] Task: Convert Related Products to Plugin (b6500f7)
    - [ ] Write tests for `RelatedProductsPlugin`.
    - [ ] Implement component in `src/plugins/pdp/RelatedProducts/`.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Refactor PDP Sections to Plugins' (Protocol in workflow.md)

## Phase 3: Configuration Persistence (Firestore)
- [ ] Task: Define Layout Schema
    - [ ] Update or create `src/services/storefrontService.ts` to include PDP layout configuration types.
- [ ] Task: Implement Layout Persistence Service
    - [ ] Create `fetchPDPLayout` and `updatePDPLayout` in `src/services/storefrontService.server.ts`.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Configuration Persistence (Firestore)' (Protocol in workflow.md)

## Phase 4: Dynamic PDP Rendering
- [ ] Task: Update PDP Route to Load Configuration
    - [ ] Modify PDP loader to fetch the layout config from Firestore.
- [ ] Task: Implement Dynamic Plugin Renderer
    - [ ] Create a `PluginRenderer` component that takes a layout config and renders components from the registry.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Dynamic PDP Rendering' (Protocol in workflow.md)

## Phase 5: Admin Layout Manager
- [ ] Task: Build Plugin Configuration UI
    - [ ] Create `src/pages/Admin/PDPManager.tsx`.
    - [ ] Implement a list of active plugins with visibility toggles and "edit settings" modals.
- [ ] Task: Implement Drag & Drop Reordering
    - [ ] Integrate a DND library (e.g., `dnd-kit` or simple array moves) to reorder the layout.
- [ ] Task: Implement Save functionality
    - [ ] Hook up the "Save Changes" button to the persistence service.
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Admin Layout Manager' (Protocol in workflow.md)

## Phase 6: Final Verification & Polish
- [ ] Task: End-to-End Testing
    - [ ] Verify that reordering in Admin correctly updates the live PDP.
- [ ] Task: Documentation
    - [ ] Add a `PLUGINS.md` to `src/plugins/` explaining how to add new plugins.
- [ ] Task: Conductor - User Manual Verification 'Phase 6: Final Verification & Polish' (Protocol in workflow.md)
