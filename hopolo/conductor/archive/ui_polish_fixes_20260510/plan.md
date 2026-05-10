# Implementation Plan: UI Polish & Bug Fixes (Login, Banner, Theme)

## Phase 1: Login Routing & Header State [checkpoint: 367f790]
- [x] Task: Update Login Logic (f25ecc4)
    - [x] Write Tests: Create failing tests for post-login routing behavior based on user role (admin vs standard).
    - [x] Implement: Update the login action/hook to fetch user role from Firestore and redirect to `/admin` if admin, else stay on home.
    - [x] Refactor: Ensure the global Header component correctly subscribes to auth state and displays logged-in UI elements.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Login Routing & Header State' (Protocol in workflow.md) (367f790)

## Phase 2: Home Banner Fix [checkpoint: 035c2c0]
- [x] Task: Resolve Banner Visibility (035c2c0)
    - [x] Write Tests: Create failing tests for the Home page component to verify banner rendering when configuration data is present.
    - [x] Implement: Update the Home page data loader or component to fetch the `storefront` config from Firestore and pass it to the Banner component.
    - [x] Refactor: Ensure graceful fallback if config is missing or banner is disabled.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Home Banner Fix' (Protocol in workflow.md) (035c2c0)

## Phase 3: Theme Contrast & Consistency [checkpoint: 035c2c0]
- [x] Task: Adjust CSS Variables (035c2c0)
    - [x] Implement: Modify the Ethos Archetype CSS variables (e.g., in `base.css` or `index.css`) to improve text contrast ratios.
    - [x] Implement: Apply a consistent background color variable to the root body/html elements to ensure consistency across the storefront and admin panels.
    - [x] Note: Visual/CSS changes are verified manually; automated unit tests for specific color hex codes are usually omitted.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Theme Contrast & Consistency' (Protocol in workflow.md) (035c2c0)