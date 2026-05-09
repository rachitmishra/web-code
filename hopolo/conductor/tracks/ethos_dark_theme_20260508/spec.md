# Ethos Archetype (Full Dark Overhaul)

## 1. Context & Goals
The goal is to apply the "Ethos Archetype" design system from Stitch to the entire Hopolo application, replacing the current light theme with a brutalist, dark-mode aesthetic.

## 2. Requirements
- The application background must be `#131313`.
- Primary text must be `#FFFFFF`.
- Headlines must use `Space Grotesk`.
- Body text and labels must use `Inter`.
- All borders and corners must be 0px (sharp edges).
- Shadows are strictly prohibited. Depth must be achieved via tonal layering.

## 3. Technical Constraints
- The implementation must cleanly overwrite existing CSS custom properties in `index.css`.
- Changes must not break existing functional workflows (e.g., Cart logic, Checkout flows).
