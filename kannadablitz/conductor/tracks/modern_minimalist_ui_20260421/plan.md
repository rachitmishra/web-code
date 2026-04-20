# Implementation Plan: Modern Minimalist UI Refactor

## Phase 1: Design Token Manifest and CSS Architecture
- [ ] Task: Update Global CSS Variables
    - [ ] Write tests verifying that critical CSS variables exist in the DOM (e.g., in a central theme test file).
    - [ ] Update `src/styles/variables.css` with the new semantic palette, spacing scale, and typography scale.
    - [ ] Ensure `index.css` or `App.css` properly imports and applies these globally.
- [ ] Task: Update Base and Utilities CSS
    - [ ] Write/update tests for global typography elements (`H1` to `Small Label`).
    - [ ] Update typography styles (`font-main`, `letter-spacing` for target words).
    - [ ] Create utility classes or base element styles for standard visual weighting (e.g., `font-weight: 700` for Kannada, `font-weight: 400`, `opacity: 0.6` for English).
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Design Token Manifest and CSS Architecture' (Protocol in workflow.md)

## Phase 2: Component Blueprints Implementation
- [ ] Task: Content Container & Interactive Card Styles
    - [ ] Update CSS files for the Content Container (max-width, margin auto).
    - [ ] Update/Create CSS for the Interactive Card (`border-radius`, border, `box-shadow`).
    - [ ] Update component logic if class names change.
    - [ ] Ensure all existing tests pass with structure changes.
- [ ] Task: Button State Styles
    - [ ] Update CSS for standard buttons to include the new `:hover` and `:active` transitions.
    - [ ] Update CSS to enforce the Negative Space Rule (minimum 1.5rem margin).
    - [ ] Run existing tests and update if needed.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Component Blueprints Implementation' (Protocol in workflow.md)

## Phase 3: Prioritized Components Refactoring
- [ ] Task: Refactor Dashboard & Header
    - [ ] Update Dashboard components to use the new tokens and blueprints.
    - [ ] Update Header components to use the new tokens and blueprints.
    - [ ] Run/update tests for Dashboard and Header components to verify correct class application.
- [ ] Task: Refactor Flashcards & Scenarios
    - [ ] Update Flashcard components (Interactive Card blueprint, visual weighting).
    - [ ] Update Scenario components.
    - [ ] Run/update tests for these core learning interfaces.
- [ ] Task: Refactor Social Panel
    - [ ] Update Social Panel components with new tokens and spacing.
    - [ ] Run/update tests for Social Panel.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Prioritized Components Refactoring' (Protocol in workflow.md)

## Phase 4: 'Zen Mode' Implementation
- [ ] Task: Implement Zen Mode Logic
    - [ ] Write failing test for Zen Mode contextual trigger (e.g., when Flashcard/Scenario mounts, Header/Nav gets dimmed class).
    - [ ] Update global state or context to track "learning mode" active state.
    - [ ] Implement CSS classes for dimming/hiding non-essential UI.
    - [ ] Update Header/Dashboard components to react to the "learning mode" state.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: 'Zen Mode' Implementation' (Protocol in workflow.md)