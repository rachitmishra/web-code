# Design Spec: Multi-Mode Feature (Animals, Birds, Colors, Piano)

## Goal
Transform the Animaze application from an animal-only learning tool into a multi-mode educational experience where users can switch between Animals, Birds, Colors, and Piano modes.

## 1. Core State & Logic (`useGameLogic.ts`)

### `GameMode` Type
```typescript
type GameMode = "animals" | "birds" | "colors" | "piano";
```

### State Updates
- Add `gameMode` state (default: "animals").
- Update `handleKeyDown` to branch logic based on `gameMode`.
- **Piano Mode Logic**:
  - Map keys `A, S, D, F, G, H, J, K, L` to a musical scale (C4 to D5).
  - Trigger audio oscillators or pre-recorded samples.
- **Color Mode Logic**:
  - Map alphabet to common colors (e.g., A = Azure, B = Blue, C = Crimson).
  - Display the color as a large geometric shape.
- **Bird Mode Logic**:
  - Mirror existing animal logic with a new `BIRD_MAP`.

## 2. Components

### `ModeSelector` (Mechanical Slider)
- A new component in the HUD.
- **Visuals**: A horizontal track with a sliding "knob". Uses `:active` and `:hover` states to feel mechanical.
- **Interaction**: Clicking a mode label slides the knob to that position.

### `MainDisplay`
- Refactor `AnimalDisplay` into a generic `StageDisplay`.
- **Modes**:
  - `animal`/`bird`: Shows name, emoji, and AI-generated image.
  - `color`: Shows a large color swatch and the name.
  - `piano`: Shows a visual keyboard where keys highlight on press.

## 3. Data Structures

### `data/birds.ts`
- Similar structure to `animals.ts`.
- Standard set of birds (e.g., Albatross, Blue Jay, Cardinal, Duck, Eagle...).

### `data/colors.ts`
- Mapping letters to color objects: `{ name: string, hex: string }`.

### `data/piano.ts`
- Mapping keys to frequencies or note names.

## 4. UI/UX Refinement
- **KeyWaveAnimation**: Should persist across all modes to provide visual feedback for every key tap.
- **Error Handling**: Show "No [Mode Item] found for [Key]" in the `ErrorToast`.

## 5. Testing Plan
- **Unit Tests**: Verify key-to-note mapping in Piano mode.
- **Integration Tests**: Ensure mode switching updates the `MainDisplay` correctly.
- **Manual Verification**: Test the "mechanical" feel of the slider on different screen sizes.
