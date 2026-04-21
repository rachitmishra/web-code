# Implementation Plan: Calm & Focused UI/UX Refinement

## Phase 1: "Warm Paper" Foundation & The Spring (Token Migration)
- [ ] Task: Update the Global CSS Manifest
    - [ ] Update `src/styles/variables.css` with the "Warm Paper" palette (`#fafaf9` base, `#1c1917` main text, warmer gray/taupe accents).
    - [ ] Define the global "Responsive Spring" timing variable: `--spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);` and update default transitions to use it.
    - [ ] Update existing tests to reflect the new color expectations.
    - [ ] Verify `styles/variables.css` in the browser to ensure the contrast is pleasant and text is highly legible.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: "Warm Paper" Foundation & The Spring (Token Migration)' (Protocol in workflow.md)

## Phase 2: A Unified Modal System (Structural Consistency)
- [ ] Task: Create Universal Overlays and Animations
    - [ ] Add `.glass-overlay` to `src/styles/utilities.css` utilizing `backdrop-filter: blur(8px)` and a subtle dark tint.
    - [ ] Add `.modal-container` to `src/styles/utilities.css` referencing `.card` blueprints but ensuring maximum width and safe-area margins.
    - [ ] Create `@keyframes modalSlideUp` and attach it to a `.animate-modal` utility class utilizing the new `--spring` timing.
    - [ ] Update existing tests verifying utility class structures.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: A Unified Modal System (Structural Consistency)' (Protocol in workflow.md)

## Phase 3: Component Migration (Refining the UX)
- [ ] Task: Refactor Disjointed Modals
    - [ ] Update `src/components/BadgeShareModal.tsx` and its CSS (if any) to use `.glass-overlay` and `.modal-container` `.animate-modal`.
    - [ ] Update `src/components/SettingsModal.tsx` to use the universal classes and ensure padding/headers match.
    - [ ] Update `src/components/ClickableSentence.tsx`'s "habit nudge modal" (the word detail popup) to use the universal classes.
    - [ ] Update `src/screens/Dashboard.tsx`'s "habit nudge" modal to use the universal classes.
    - [ ] Run/update all associated component tests to verify structure changes.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Component Migration (Refining the UX)' (Protocol in workflow.md)

## Phase 4: Micro-Interactions Polish
- [ ] Task: Refine Interactions
    - [ ] Audit `src/styles/components/buttons.css` to ensure button transitions use the `--spring` timing.
    - [ ] Audit `src/styles/components/social.css` (e.g., the `.community-content.collapsed` transition) to ensure smooth unfolding.
    - [ ] Ensure `FeedbackToast` slides up with the exact same `--spring` timing as the modals.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Micro-Interactions Polish' (Protocol in workflow.md)