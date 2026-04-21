# Specification: Modern Minimalist UI Refactor

## Overview
Refactor the language learning app's user interface to a Modern Minimalist style focusing on "Cognitive Ease". The implementation strictly uses standard CSS and CSS Variables (no utility frameworks like Tailwind), focusing on structural logic and clean design tokens.

## Functional Requirements
- Implement a centralized "Design Token" manifest in `styles/variables.css` overriding existing values.
- Refactor core components: Flashcards, Scenarios, Dashboard, Header, and Social Panel.
- Implement "Zen Mode" logic: Automatically dim or hide non-essential UI elements (like headers or navigation) when the user is engaged in specific learning activities (e.g., Flashcards, Scenarios).

## Non-Functional Requirements
- **Styling constraints**: Use Standard CSS only. No utility CSS frameworks.
- **Cognitive Ease**: Prioritize clean typography, ample negative space (minimum 1.5rem margin around interactive elements), and distinct visual hierarchy.
- **Design Tokens**: 
    - **Colors**: Semantic palette (e.g., `--bg-primary`, `--surface-card`, `--text-main`, `--brand-action`) with low saturation.
    - **Spacing**: Fixed-ratio scale (e.g., 8px increments).
    - **Typography**: `--font-main: 'Inter', sans-serif;`. Use `letter-spacing: -0.02em` for target words.
- **Visual Weighting**: "Target Language" (Kannada) must be `font-weight: 700`. "Native Language" (English) translation must be `font-weight: 400` and `opacity: 0.6`.
- **Component Blueprints**:
    - **Content Container**: Strict `max-width` and `margin: auto` to prevent long line lengths.
    - **Interactive Card**: `border-radius: 1.25rem`, a faint 1px solid border, and soft shadow (`box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.04)`).
    - **Button States**: Transitions for `:hover` and `:active` (`transform: translateY(-1px)`, `transition: all 0.2s ease`).

## Acceptance Criteria
- `styles/variables.css` is completely updated with the new design token manifest.
- Flashcards, Scenarios, Dashboard, Header, and Social Panel utilize the new tokens and adhere to the structural blueprints.
- "Zen Mode" functions correctly during learning activities, diminishing visual noise.
- The UI maintains responsiveness across all specified viewports.
- Typography scale, spacing scale, and color palette are consistent across the entire application.

## Out of Scope
- Adding new learning features or modifying existing logic/data structures beyond what is necessary for the UI refactor.
- Refactoring components outside of the prioritized list unless strictly required.