# Multi-Mode (Animals, Birds, Colors, Piano) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Animaze into a multi-mode educational app with Animals, Birds, Colors, and Piano modes, featuring a mechanical mode selector.

**Architecture:** 
- Centralized `gameMode` state in `useGameLogic`.
- Mode-specific data maps for Birds and Colors.
- Refactored `StageDisplay` to handle all visual modes.
- Web Audio API for Piano mode.

**Tech Stack:** React, TypeScript, CSS (Vanilla), Web Audio API.

---

### Task 1: Data Structures (Birds and Colors)

**Files:**
- Create: `src/data/birds.ts`
- Create: `src/data/colors.ts`
- Modify: `src/types/index.ts`

- [ ] **Step 1: Update Types**

```typescript
// src/types/index.ts
export type GameMode = "animals" | "birds" | "colors" | "piano";

export interface ColorItem {
  name: string;
  hex: string;
  sound: string;
}

export interface Bird extends Animal {} // Reusing Animal structure for Birds
```

- [ ] **Step 2: Create Birds Data**

```typescript
// src/data/birds.ts
import type { Animal } from "../types";

export const BIRD_MAP: Record<string, Array<Animal>> = {
  a: [{ name: "Albatross", emoji: "🪽", sound: "Squawk! I can fly for a long time." }],
  b: [{ name: "Blue Jay", emoji: "🐦", sound: "Jay! Jay! Look at my blue feathers." }],
  // ... (Full A-Z set to be implemented by subagent)
};
```

- [ ] **Step 3: Create Colors Data**

```typescript
// src/data/colors.ts
import type { ColorItem } from "../types";

export const COLOR_MAP: Record<string, ColorItem> = {
  a: { name: "Azure", hex: "#F0FFFF", sound: "Azure is a light blue color." },
  b: { name: "Blue", hex: "#0000FF", sound: "Blue like the sky!" },
  // ... (Full A-Z set to be implemented by subagent)
};
```

- [ ] **Step 4: Commit**

```bash
git add src/types/index.ts src/data/birds.ts src/data/colors.ts
git commit -m "feat: add birds and colors data structures"
```

---

### Task 2: State Logic Refactor (`useGameLogic`)

**Files:**
- Modify: `src/hooks/useGameLogic.ts`

- [ ] **Step 1: Add `gameMode` state**

```typescript
const [gameMode, setGameMode] = useState<GameMode>("animals");
```

- [ ] **Step 2: Update `handleKeyDown` to branch by mode**

```typescript
// Logic for Colors
if (gameMode === "colors") {
  const color = COLOR_MAP[char];
  if (color) {
    setCurrentItems([color]); // Items state needs to be more generic
    speak(color.sound);
  }
}
```

- [ ] **Step 3: Implement Piano Logic**

```typescript
if (gameMode === "piano") {
  playNote(key);
}
```

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useGameLogic.ts
git commit -m "feat: implement multi-mode state logic"
```

---

### Task 3: ModeSelector Component

**Files:**
- Create: `src/components/ModeSelector.tsx`
- Create: `src/styles/ModeSelector.css`

- [ ] **Step 1: Create the mechanical slider component**

- [ ] **Step 2: Style with "mechanical" feel (gradients, shadows, transitions)**

- [ ] **Step 3: Commit**

```bash
git add src/components/ModeSelector.tsx src/styles/ModeSelector.css
git commit -m "feat: add mechanical ModeSelector component"
```

---

### Task 4: Piano Audio Utility

**Files:**
- Create: `src/utils/pianoUtils.ts`

- [ ] **Step 1: Implement Web Audio API oscillator for piano notes**

- [ ] **Step 2: Map keys to frequencies**

- [ ] **Step 3: Commit**

```bash
git add src/utils/pianoUtils.ts
git commit -m "feat: add piano audio utility"
```

---


**Files:**
- Create: `src/components/StageDisplay.tsx` (Refactored from `AnimalDisplay`)
- Modify: `src/App.tsx`

- [ ] **Step 1: Create StageDisplay to handle all visual modes**

- [ ] **Step 2: Integrate ModeSelector in App.tsx**
- [ ] **Step 2: Integrate ModeSelector in App.tsx**

- [ ] **Step 3: Commit**

```bash
git add src/components/StageDisplay.tsx src/App.tsx
git commit -m "feat: refactor display and integrate mode selector"
```
