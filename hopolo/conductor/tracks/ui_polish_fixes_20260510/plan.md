# Implementation Plan: UI Polish & Bug Fixes (Login, Banner, Theme)

## Phase 1: Login Routing & Header State
- [x] Task: Update Login Logic (f25ecc4)
    - [x] Write Tests: Create failing tests for post-login routing behavior based on user role (admin vs standard).
    - [x] Implement: Update the login action/hook to fetch user role from Firestore and redirect to `/admin` if admin, else stay on home.
    - [x] Refactor: Ensure the global Header component correctly subscribes to auth state and displays logged-in UI elements.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Login Routing & Header State' (Protocol in workflow.md)

## Phase 2: Home Banner Fix
- [ ] Task: Resolve Banner Visibility
    - [ ] Write Tests: Create failing tests for the Home page component to verify banner rendering when configuration data is present.
    - [ ] Implement: Update the Home page data loader or component to fetch the `storefront` config from Firestore and pass it to the Banner component.
    - [ ] Refactor: Ensure graceful fallback if config is missing or banner is disabled.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Home Banner Fix' (Protocol in workflow.md)

## Phase 3: Theme Contrast & Consistency
- [ ] Task: Adjust CSS Variables
    - [ ] Implement: Modify the Ethos Archetype CSS variables (e.g., in `base.css` or `index.css`) to improve text contrast ratios.
    - [ ] Implement: Apply a consistent background color variable to the root body/html elements to ensure consistency across the storefront and admin panels.
    - [ ] Note: Visual/CSS changes are verified manually; automated unit tests for specific color hex codes are usually omitted.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Theme Contrast & Consistency' (Protocol in workflow.md)