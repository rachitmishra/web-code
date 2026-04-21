# Track Specification: KannadaBlitz Web Redesign

**Overview**
A complete visual and structural overhaul of the KannadaBlitz web application based on the "KannadaBlitz Web Redesign" Stitch project (ID: 10016306279397943728). This track involves implementing a new Design System and a comprehensive set of redesigned screens for both desktop and mobile.

**Functional Requirements**
- Implement the new **Design System** (tokens, typography, colors, and base components).
- Redesign the **Dashboard** (Desktop & Mobile).
- Redesign the **Learning Path** (Desktop & Mobile).
- Redesign the **Leaderboard** (Desktop & Mobile).
- Redesign **Profile & Settings** (Desktop & Mobile).
- Ensure full responsiveness across all new screens.
- Maintain existing game logic and Firestore synchronization while updating the UI layer.

**Non-Functional Requirements**
- **Vanilla CSS/Variables:** Utilize the project's existing CSS variable system, extending it with new tokens from the Stitch Design System.
- **Component Integrity:** Build a new library of reusable components to ensure consistency across the overhauled screens.
- **Performance:** Ensure animations (glassmorphism, spring-animated dialogs) are performant on mobile devices.

**Acceptance Criteria**
- All screens (Dashboard, Learning Path, Leaderboard, Profile & Settings) match the provided Stitch designs.
- The Design System is fully implemented as the source of truth for styles.
- The application remains fully functional (gameplay, social features, sync).
- Mobile and Desktop views are parity-complete with the designs.

**Out of Scope**
- New backend features or Firestore schema changes (unless strictly required for UI state).
- Changes to the "Word Bank" or "Flashcards" logic (UI updates only).
