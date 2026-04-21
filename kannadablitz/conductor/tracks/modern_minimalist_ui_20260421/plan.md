# Implementation Plan: Modern Minimalist UI Refactor

## Phase 1: Design Token Manifest and CSS Architecture [checkpoint: 36d949d]
- [x] Task: Update Global CSS Variables (6e20430)
    - [x] Write tests verifying that critical CSS variables exist in the DOM (e.g., in a central theme test file).
    - [x] Update `src/styles/variables.css` with the new semantic palette, spacing scale, and typography scale.
    - [x] Ensure `index.css` or `App.css` properly imports and applies these globally.
- [x] Task: Update Base and Utilities CSS (c516578)
    - [x] Write/update tests for global typography elements (`H1` to `Small Label`).
    - [x] Update typography styles (`font-main`, `letter-spacing` for target words).
    - [x] Create utility classes or base element styles for standard visual weighting (e.g., `font-weight: 700` for Kannada, `font-weight: 400`, `opacity: 0.6` for English).
- [x] Task: Conductor - User Manual Verification 'Phase 1: Design Token Manifest and CSS Architecture' (Protocol in workflow.md)

## Phase 2: Component Blueprints Implementation [checkpoint: 9d6c34c]
- [x] Task: Content Container & Interactive Card Styles (5e62aa4)
    - [x] Update CSS files for the Content Container (max-width, margin auto).
    - [x] Update/Create CSS for the Interactive Card (`border-radius`, border, `box-shadow`).
    - [x] Update component logic if class names change.
    - [x] Ensure all existing tests pass with structure changes.
- [x] Task: Button State Styles (296a740)
    - [x] Update CSS for standard buttons to include the new `:hover` and `:active` transitions.
    - [x] Update CSS to enforce the Negative Space Rule (minimum 1.5rem margin).
    - [x] Run existing tests and update if needed.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Component Blueprints Implementation' (Protocol in workflow.md)

## Phase 3: Prioritized Components Refactoring
- [x] Task: Refactor Dashboard & Header (c73dfbc)
    - [x] Update Dashboard components to use the new tokens and blueprints.
    - [x] Update Header components to use the new tokens and blueprints.
    - [x] Run/update tests for Dashboard and Header components to verify correct class application.
- [x] Task: Refactor Flashcards & Scenarios (ff150c7)
    - [x] Update Flashcard components (Interactive Card blueprint, visual weighting).
    - [x] Update Scenario components.
    - [x] Run/update tests for these core learning interfaces.
- [x] Task: Refactor Social Panel (6305392)
    - [x] Update Social Panel components with new tokens and spacing.
    - [x] Run/update tests for Social Panel.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Prioritized Components Refactoring' (Protocol in workflow.md)

## Phase 4: 'Zen Mode' Implementation
- [ ] Task: Implement Zen Mode Logic
    - [ ] Write failing test for Zen Mode contextual trigger (e.g., when Flashcard/Scenario mounts, Header/Nav gets dimmed class).
    - [ ] Update global state or context to track "learning mode" active state.
    - [ ] Implement CSS classes for dimming/hiding non-essential UI.
    - [ ] Update Header/Dashboard components to react to the "learning mode" state.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: 'Zen Mode' Implementation' (Protocol in workflow.md)