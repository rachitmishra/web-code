import { DAY_MS } from "./date";

/**
 * Leitner-style spaced repetition. Each word sits in a box 0–5; correct
 * answers promote it, mistakes demote it. The box sets the next review date.
 */
export interface SrsCard {
  box: number;
  correct: number;
  wrong: number;
  /** consecutive correct answers */
  streak: number;
  firstSeen: number;
  lastSeen: number;
  due: number;
}

export const BOX_INTERVALS = [0, 1, 3, 7, 16, 35].map((d) => d * DAY_MS);
// box 0 reviews again in the same session/day; ~10 minutes
const RELEARN_MS = 10 * 60 * 1000;

export type Mastery = "new" | "learning" | "familiar" | "mastered";

export function newCard(now: number): SrsCard {
  return { box: 0, correct: 0, wrong: 0, streak: 0, firstSeen: now, lastSeen: now, due: now };
}

export function review(card: SrsCard | undefined, correct: boolean, now: number): SrsCard {
  const c = card ?? newCard(now);
  if (correct) {
    const box = Math.min(BOX_INTERVALS.length - 1, c.box + 1);
    return { ...c, box, correct: c.correct + 1, streak: c.streak + 1, lastSeen: now, due: now + BOX_INTERVALS[box] };
  }
  const box = Math.max(0, c.box - 2);
  return { ...c, box, wrong: c.wrong + 1, streak: 0, lastSeen: now, due: now + RELEARN_MS };
}

export function mastery(card: SrsCard | undefined): Mastery {
  if (!card || card.correct === 0) return card && card.wrong > 0 ? "learning" : "new";
  if (card.box >= 4) return "mastered";
  if (card.box >= 2) return "familiar";
  return "learning";
}

export function isDue(card: SrsCard, now: number): boolean {
  return card.due <= now;
}

/** Higher = more urgent. Overdue, error-prone, low-box cards come first. */
export function urgency(card: SrsCard, now: number): number {
  const overdueDays = Math.max(0, (now - card.due) / DAY_MS);
  const errorRate = card.wrong / Math.max(1, card.correct + card.wrong);
  return overdueDays + errorRate * 5 + (5 - card.box);
}
