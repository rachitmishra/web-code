# Specification: Calm & Focused UI/UX Refinement

## Overview
Perform a systemic UI/UX audit and refinement to elevate the application to a "Renowned Firm" standard. The primary goal is to establish a "Calm and Focused" learning environment through a unified design token system, consistent component blueprints, and highly refined micro-interactions.

## Functional Requirements
- **Color Paradigm Shift:** Transition from the cool "Slate" palette to a warmer, softer "Warm Paper" (`#fafaf9`) background with deep charcoal text (`#1c1917`) to reduce eye strain and visual tension.
- **Modal System Standardization:** 
    - Implement a global "Frosted Glass" overlay for all modals (Settings, Badges, Nudges, Social Nudges, etc.).
    - Standardize all modal containers to strictly follow the central `.card` blueprint.
    - Implement a unified "Slide Up & Fade In" entrance animation across all overlays.
- **Micro-Interactions & Animation Refinement:** Replace linear transitions with a "Responsive Spring" (smooth `cubic-bezier`) timing function to ensure the app feels highly responsive without harsh abruptness.

## Non-Functional Requirements
- **Cognitive Ease:** Ensure all interactive elements feel deeply embedded in the "Warm Paper" theme, avoiding stark contrast unless highlighting the primary task.
- **Consistency:** Ensure no component strays from the centralized CSS variables (`var(--card-radius)`, `var(--spacing-3)`, etc.).

## Acceptance Criteria
- `variables.css` is completely overhauled with the "Warm Paper" color tokens.
- A new `.glass-overlay` utility class is created and applied universally to all modals/dialogs.
- A new global animation (`.animate-slide-up-spring`) is created and applied to all modal containers.
- All instances of `SettingsModal`, `BadgeShareModal`, `ClickableSentence`'s modal, and the `Dashboard`'s Habit Nudge use the exact same structural CSS classes for overlays and containers.
- Transitions across buttons and inputs utilize the new spring-like `cubic-bezier` timing.

## Out of Scope
- Adding new learning logic or features (e.g., Audio, SRS). This track is strictly UI/UX polish.