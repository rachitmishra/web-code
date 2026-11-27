import type { Curriculum, Level, RewardEvent, SessionResult, Sublevel } from "./types";
import { review, mastery, type SrsCard, isDue, urgency } from "./srs";
import { dayKey, daysBetween } from "./date";

export const STATE_VERSION = 3;
export const LIFE_REGEN_MS = 20 * 60 * 1000;

export interface SublevelRecord { stars: 1 | 2 | 3; best: number; completedAt: number; attempts: number }

export interface PackProgress {
  xp: number;
  coins: number;
  sublevels: Record<string, SublevelRecord>;
  levels: Record<number, number>; // completedAt
  stamps: string[];
  postcards: Record<string, number>;
  achievements: Record<string, number>;
  words: Record<string, SrsCard>;
  letters: Record<string, { seen: number; correct: number; traced: number }>;
  saved: string[];
  stats: {
    answers: number;
    correct: number;
    vocabAnswers: number;
    vocabCorrect: number;
    reviewAnswers: number; // answers on words already seen before (retention)
    reviewCorrect: number;
    sentenceAnswers: number;
    sentenceCorrect: number;
    comprehensionAnswers: number;
    comprehensionCorrect: number;
    perfectSublevels: number;
    fastMatchBest30: number;
    fastMatchBest60: number;
    fastMatchBestCombo: number;
    fastMatchPairs: number;
  };
  dailyWord: { day: string; revealed: boolean; vocabId?: string };
}

export interface AppState {
  version: number;
  activePack: string;
  learner: { name: string; onboarded: boolean; goalXp: number; reason: string; syncTag?: string };
  settings: { livesEnabled: boolean; maxLives: number; showRoman: boolean; showPhonetics: boolean; showWordMeaning?: boolean; sound: boolean; reducedMotion: boolean; debug?: boolean; theme?: "studio" | "glass" | "canvas"; newsPhonetics?: boolean; newsMeaning?: boolean };
  lives: { count: number; regenFrom: number | null };
  streak: { count: number; best: number; lastDay: string | null; freezes: number };
  days: Record<string, { xp: number; minutes: number; exercises: number }>;
  packs: Record<string, PackProgress>;
}

export function emptyPackProgress(): PackProgress {
  return {
    xp: 0, coins: 0, sublevels: {}, levels: {}, stamps: [], postcards: {}, achievements: {}, words: {}, letters: {}, saved: [],
    stats: {
      answers: 0, correct: 0, vocabAnswers: 0, vocabCorrect: 0, reviewAnswers: 0, reviewCorrect: 0,
      sentenceAnswers: 0, sentenceCorrect: 0, comprehensionAnswers: 0, comprehensionCorrect: 0,
      perfectSublevels: 0, fastMatchBest30: 0, fastMatchBest60: 0, fastMatchBestCombo: 0, fastMatchPairs: 0,
    },
    dailyWord: { day: "", revealed: false },
  };
}

export function initialState(packId: string): AppState {
  return {
    version: STATE_VERSION,
    activePack: packId,
    learner: { name: "", onboarded: false, goalXp: 50, reason: "" },
    settings: { livesEnabled: true, maxLives: 5, showRoman: true, showPhonetics: true, showWordMeaning: true, sound: true, reducedMotion: false, debug: false, theme: "glass", newsPhonetics: true, newsMeaning: true },
    lives: { count: 5, regenFrom: null },
    streak: { count: 0, best: 0, lastDay: null, freezes: 1 },
    days: {},
    packs: { [packId]: emptyPackProgress() },
  };
}

export function packOf(s: AppState, id = s.activePack): PackProgress {
  return s.packs[id] ?? emptyPackProgress();
}

function withPack(s: AppState, fn: (p: PackProgress) => PackProgress): AppState {
  return { ...s, packs: { ...s.packs, [s.activePack]: fn(packOf(s)) } };
}

function addDay(s: AppState, now: number, patch: Partial<{ xp: number; minutes: number; exercises: number }>): AppState {
  const k = dayKey(now);
  const d = s.days[k] ?? { xp: 0, minutes: 0, exercises: 0 };
  return {
    ...s,
    days: { ...s.days, [k]: { xp: d.xp + (patch.xp ?? 0), minutes: d.minutes + (patch.minutes ?? 0), exercises: d.exercises + (patch.exercises ?? 0) } },
  };
}

/** Streak advances on the first XP of a calendar day. One freeze bridges one missed day. */
function touchStreak(s: AppState, now: number, events: RewardEvent[]): AppState {
  const today = dayKey(now);
  const { lastDay, count, best, freezes } = s.streak;
  if (lastDay === today) return s;
  let next = 1;
  let f = freezes;
  if (lastDay) {
    const gap = daysBetween(lastDay, today);
    if (gap === 1) next = count + 1;
    else if (gap === 2 && freezes > 0) { next = count + 1; f -= 1; }
  }
  if (next > 1 && [3, 7, 14, 30, 50, 100].includes(next)) events.push({ type: "streak", days: next });
  // earn a freeze each completed week
  if (next % 7 === 0) f = Math.min(2, f + 1);
  return { ...s, streak: { count: next, best: Math.max(best, next), lastDay: today, freezes: f } };
}

/** Streak as displayed: a lapsed streak shows 0 until the learner returns. */
export function liveStreak(s: AppState, now = Date.now()): number {
  if (!s.streak.lastDay) return 0;
  const gap = daysBetween(s.streak.lastDay, dayKey(now));
  if (gap <= 1) return s.streak.count;
  if (gap === 2 && s.streak.freezes > 0) return s.streak.count;
  return 0;
}

export function regenLives(s: AppState, now: number): AppState {
  const { count, regenFrom } = s.lives;
  const max = s.settings.maxLives;
  if (count >= max || regenFrom === null) return count >= max && regenFrom !== null ? { ...s, lives: { count, regenFrom: null } } : s;
  const gained = Math.floor((now - regenFrom) / LIFE_REGEN_MS);
  if (gained <= 0) return s;
  const c = Math.min(max, count + gained);
  return { ...s, lives: { count: c, regenFrom: c >= max ? null : regenFrom + gained * LIFE_REGEN_MS } };
}

export function nextLifeIn(s: AppState, now = Date.now()): number | null {
  if (s.lives.regenFrom === null || s.lives.count >= s.settings.maxLives) return null;
  return Math.max(0, s.lives.regenFrom + LIFE_REGEN_MS - now);
}

export interface AnswerInput {
  correct: boolean;
  skill: "letters" | "vocab" | "sentences" | "comprehension";
  vocabIds?: string[];
  letterId?: string;
  traced?: boolean;
  /** practice-mode answers never cost lives */
  practice?: boolean;
  teaching?: boolean;
  xp?: number;
}

export function applyAnswer(s0: AppState, a: AnswerInput, now: number): { state: AppState; events: RewardEvent[] } {
  const events: RewardEvent[] = [];
  let s = regenLives(s0, now);
  const xp = a.correct ? a.xp ?? (a.teaching ? 2 : 10) : 0;
  const loseLife = !a.correct && !a.teaching && !a.practice && s.settings.livesEnabled;
  if (loseLife) {
    const count = Math.max(0, s.lives.count - 1);
    s = { ...s, lives: { count, regenFrom: s.lives.regenFrom ?? now } };
  }
  s = withPack(s, (p) => {
    const words = { ...p.words };
    let reviewA = 0, reviewC = 0;
    for (const id of a.vocabIds ?? []) {
      const prev = words[id];
      if (prev && prev.correct + prev.wrong > 0 && !a.teaching) { reviewA++; if (a.correct) reviewC++; }
      // Teaching cards register a word as seen without promoting it.
      words[id] = a.teaching ? prev ?? { box: 0, correct: 0, wrong: 0, streak: 0, firstSeen: now, lastSeen: now, due: now } : review(prev, a.correct, now);
    }
    const letters = { ...p.letters };
    if (a.letterId) {
      const l = letters[a.letterId] ?? { seen: 0, correct: 0, traced: 0 };
      letters[a.letterId] = { seen: l.seen + 1, correct: l.correct + (a.correct && !a.teaching ? 1 : 0), traced: l.traced + (a.traced && a.correct ? 1 : 0) };
    }
    const st = { ...p.stats };
    if (!a.teaching) {
      st.answers++; if (a.correct) st.correct++;
      if (a.skill === "vocab") { st.vocabAnswers++; if (a.correct) st.vocabCorrect++; }
      if (a.skill === "sentences") { st.sentenceAnswers++; if (a.correct) st.sentenceCorrect++; }
      if (a.skill === "comprehension") { st.comprehensionAnswers++; if (a.correct) st.comprehensionCorrect++; }
      st.reviewAnswers += reviewA; st.reviewCorrect += reviewC;
    }
    return { ...p, xp: p.xp + xp, words, letters, stats: st };
  });
  if (xp > 0) {
    const before = s.days[dayKey(now)]?.xp ?? 0;
    s = touchStreak(s, now, events);
    s = addDay(s, now, { xp, exercises: 1 });
    if (before < s.learner.goalXp && before + xp >= s.learner.goalXp) events.push({ type: "goal_met", xp: s.learner.goalXp });
  } else {
    s = addDay(s, now, { exercises: 1 });
  }
  return { state: s, events };
}

export function starsFor(total: number, mistakes: number): 1 | 2 | 3 {
  if (mistakes === 0) return 3;
  return mistakes <= Math.max(1, Math.round(total * 0.2)) ? 2 : 1;
}

/** Completing a sublevel awards a stamp; completing a level awards its postcard. */
export function applySessionComplete(
  s0: AppState,
  cur: Curriculum,
  r: SessionResult,
  now: number,
): { state: AppState; events: RewardEvent[] } {
  const events: RewardEvent[] = [];
  let s = s0;
  if (r.kind === "sublevel" && r.sublevelId) {
    const sub = findSublevel(cur, r.sublevelId);
    if (!sub) return { state: s, events };
    const level = cur.levels.find((l) => l.number === sub.levelNumber)!;
    const stars = starsFor(r.total, r.mistakes);
    const accuracy = r.total ? (r.total - r.mistakes) / r.total : 1;
    const p0 = packOf(s);
    const prevRec = p0.sublevels[sub.id];
    const first = !prevRec;
    const wasUnlocked = (n: number) => isLevelUnlocked(cur, p0, n);
    let xp = first ? sub.xp : 5;
    let coins = first ? sub.coins : 1;
    if (stars === 3 && (!prevRec || prevRec.stars < 3)) { xp += 15; coins += 5; }
    s = withPack(s, (p) => {
      const rec: SublevelRecord = {
        stars: (Math.max(prevRec?.stars ?? 0, stars) as 1 | 2 | 3),
        best: Math.max(prevRec?.best ?? 0, accuracy),
        completedAt: prevRec?.completedAt ?? now,
        attempts: (prevRec?.attempts ?? 0) + 1,
      };
      const stamps = p.stamps.includes(sub.stampId) ? p.stamps : [...p.stamps, sub.stampId];
      const stats = { ...p.stats, perfectSublevels: p.stats.perfectSublevels + (stars === 3 && (!prevRec || prevRec.stars < 3) ? 1 : 0) };
      return { ...p, sublevels: { ...p.sublevels, [sub.id]: rec }, stamps, stats, xp: p.xp + xp, coins: p.coins + coins };
    });
    if (first) events.push({ type: "stamp", stampId: sub.stampId, sublevelId: sub.id, stars });

    const p1 = packOf(s);
    if (!p1.levels[level.number] && level.sublevels.filter((x) => x.required).every((x) => p1.sublevels[x.id])) {
      s = withPack(s, (p) => ({
        ...p,
        levels: { ...p.levels, [level.number]: now },
        postcards: { ...p.postcards, [level.postcardId]: now },
        xp: p.xp + level.xp,
        coins: p.coins + level.coins,
      }));
      xp += level.xp;
      events.push({ type: "postcard", postcardId: level.postcardId, levelNumber: level.number });
      const next = level.number + 1;
      if (cur.levels.some((l) => l.number === next) && !wasUnlocked(next)) events.push({ type: "level_unlocked", levelNumber: next });
      if (level.number === cur.levels[cur.levels.length - 1].number) events.push({ type: "certificate" });
    }
    const before = s.days[dayKey(now)]?.xp ?? 0;
    s = touchStreak(s, now, events);
    s = addDay(s, now, { xp, minutes: Math.round(r.durationMs / 60000) });
    if (before < s.learner.goalXp && before + xp >= s.learner.goalXp) events.push({ type: "goal_met", xp: s.learner.goalXp });
  } else {
    const bonus = r.total >= 5 ? 15 : 5;
    s = withPack(s, (p) => ({ ...p, xp: p.xp + bonus, coins: p.coins + 3 }));
    s = touchStreak(s, now, events);
    s = addDay(s, now, { xp: bonus, minutes: Math.round(r.durationMs / 60000) });
  }
  const ach = evaluateAchievements(s, cur, now);
  s = ach.state;
  events.push(...ach.events);
  return { state: s, events };
}

export function applyFastMatch(
  s0: AppState,
  cur: Curriculum,
  r: { seconds: 30 | 60; score: number; pairs: number; attempts: number; bestCombo: number; durationMs: number },
  now: number,
): { state: AppState; events: RewardEvent[]; newBest: boolean } {
  const events: RewardEvent[] = [];
  const p0 = packOf(s0);
  const bestKey = r.seconds === 30 ? "fastMatchBest30" : "fastMatchBest60";
  const newBest = r.score > p0.stats[bestKey];
  const xp = Math.min(60, Math.max(5, Math.round(r.score / 10)));
  let s = withPack(s0, (p) => ({
    ...p,
    xp: p.xp + xp,
    coins: p.coins + Math.round(r.pairs / 3),
    stats: {
      ...p.stats,
      [bestKey]: Math.max(p.stats[bestKey], r.score),
      fastMatchBestCombo: Math.max(p.stats.fastMatchBestCombo, r.bestCombo),
      fastMatchPairs: p.stats.fastMatchPairs + r.pairs,
      answers: p.stats.answers + r.attempts,
      correct: p.stats.correct + r.pairs,
    },
  }));
  s = touchStreak(s, now, events);
  s = addDay(s, now, { xp, minutes: Math.round(r.durationMs / 60000), exercises: r.attempts });
  const ach = evaluateAchievements(s, cur, now);
  return { state: ach.state, events: [...events, ...ach.events], newBest };
}

// ───────────────────────────── selectors ─────────────────────────────

export function findSublevel(cur: Curriculum, id: string): Sublevel | undefined {
  for (const l of cur.levels) for (const s of l.sublevels) if (s.id === id) return s;
  return undefined;
}

export function isLevelUnlocked(cur: Curriculum, p: PackProgress, n: number): boolean {
  const idx = cur.levels.findIndex((l) => l.number === n);
  if (idx <= 0) return idx === 0;
  const prev = cur.levels[idx - 1];
  return !!p.levels[prev.number] || prev.sublevels.filter((x) => x.required).every((x) => p.sublevels[x.id]);
}

export type NodeState = "done" | "current" | "open" | "locked";

export function sublevelState(cur: Curriculum, p: PackProgress, level: Level, sub: Sublevel): NodeState {
  if (p.sublevels[sub.id]) return "done";
  if (!isLevelUnlocked(cur, p, level.number)) return "locked";
  if (sub.kind === "bonus") {
    // bonus opens once the milestone is cleared
    const milestone = level.sublevels.find((x) => x.kind === "milestone");
    return milestone && p.sublevels[milestone.id] ? "open" : "locked";
  }
  const req = level.sublevels.filter((x) => x.required);
  const i = req.indexOf(sub);
  if (i === 0 || p.sublevels[req[i - 1].id]) return "current";
  return "locked";
}

export function levelProgress(p: PackProgress, level: Level): number {
  const req = level.sublevels.filter((x) => x.required);
  return req.filter((x) => p.sublevels[x.id]).length / req.length;
}

export function nextSublevel(cur: Curriculum, p: PackProgress): Sublevel | null {
  for (const l of cur.levels) {
    if (!isLevelUnlocked(cur, p, l.number)) return null;
    for (const s of l.sublevels) if (s.required && !p.sublevels[s.id]) return s;
  }
  return null;
}

export function dueWords(p: PackProgress, now = Date.now()): string[] {
  return Object.entries(p.words)
    .filter(([, c]) => c.correct + c.wrong > 0 && isDue(c, now))
    .sort((a, b) => urgency(b[1], now) - urgency(a[1], now))
    .map(([id]) => id);
}

export function weakWords(p: PackProgress): string[] {
  return Object.entries(p.words)
    .filter(([, c]) => c.wrong > 0 && c.box <= 2)
    .sort((a, b) => b[1].wrong - a[1].wrong)
    .map(([id]) => id);
}

export function wordCounts(p: PackProgress): Record<"new" | "learning" | "familiar" | "mastered", number> & { learned: number } {
  const out = { new: 0, learning: 0, familiar: 0, mastered: 0, learned: 0 };
  for (const c of Object.values(p.words)) {
    const m = mastery(c);
    out[m]++;
    if (c.correct > 0) out.learned++;
  }
  return out;
}

export function lettersMastered(p: PackProgress): number {
  return Object.values(p.letters).filter((l) => l.correct >= 2 || l.traced >= 1).length;
}

// ─────────────────────────── achievements ───────────────────────────

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  test: (p: PackProgress, s: AppState, cur: Curriculum) => boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "first_stamp", title: "First Stamp", description: "Complete your first sublevel", icon: "stamp", test: (p) => p.stamps.length >= 1 },
  { id: "first_postcard", title: "Postmarked", description: "Complete a full level", icon: "postcard", test: (p) => Object.keys(p.postcards).length >= 1 },
  { id: "five_postcards", title: "Seasoned Traveller", description: "Collect 5 postcards", icon: "map", test: (p) => Object.keys(p.postcards).length >= 5 },
  { id: "passport_full", title: "Passport Complete", description: "Collect every postcard", icon: "crown", test: (p, _s, c) => Object.keys(p.postcards).length >= c.levels.length },
  { id: "words_25", title: "Word Collector", description: "Learn 25 words", icon: "book", test: (p) => wordCounts(p).learned >= 25 },
  { id: "words_100", title: "Lexicon Builder", description: "Learn 100 words", icon: "books", test: (p) => wordCounts(p).learned >= 100 },
  { id: "words_300", title: "Living Dictionary", description: "Learn 300 words", icon: "scroll", test: (p) => wordCounts(p).learned >= 300 },
  { id: "mastered_50", title: "Deep Roots", description: "Master 50 words through review", icon: "tree", test: (p) => wordCounts(p).mastered >= 50 },
  { id: "letters_all", title: "Akshara Master", description: "Master 40 letters", icon: "letter", test: (p) => lettersMastered(p) >= 40 },
  { id: "scribe", title: "Scribe", description: "Trace 20 letters well", icon: "pen", test: (p) => Object.values(p.letters).reduce((n, l) => n + l.traced, 0) >= 20 },
  { id: "sentences_25", title: "Sentence Smith", description: "Build 25 correct sentences", icon: "tiles", test: (p) => p.stats.sentenceCorrect >= 25 },
  { id: "perfect_5", title: "Flawless", description: "Finish 5 sublevels without a mistake", icon: "star", test: (p) => p.stats.perfectSublevels >= 5 },
  { id: "streak_7", title: "One Week Strong", description: "Keep a 7-day streak", icon: "flame", test: (_p, s) => s.streak.best >= 7 },
  { id: "streak_30", title: "Monsoon of Habit", description: "Keep a 30-day streak", icon: "rain", test: (_p, s) => s.streak.best >= 30 },
  { id: "fast_20", title: "Quick Hands", description: "Match 20 pairs in one Fast Match", icon: "bolt", test: (p) => p.stats.fastMatchBest60 >= 400 || p.stats.fastMatchBest30 >= 400 },
  { id: "combo_10", title: "Combo Artist", description: "Reach a ×10 combo", icon: "spark", test: (p) => p.stats.fastMatchBestCombo >= 10 },
];

export function evaluateAchievements(s: AppState, cur: Curriculum, now: number): { state: AppState; events: RewardEvent[] } {
  const p = packOf(s);
  const unlocked = ACHIEVEMENTS.filter((a) => !p.achievements[a.id] && a.test(p, s, cur));
  if (!unlocked.length) return { state: s, events: [] };
  const achievements = { ...p.achievements };
  unlocked.forEach((a) => (achievements[a.id] = now));
  return {
    state: withPack(s, (pp) => ({ ...pp, achievements, coins: pp.coins + unlocked.length * 10 })),
    events: unlocked.map((a) => ({ type: "achievement" as const, achievementId: a.id })),
  };
}

// ─────────────────────────── misc mutations ───────────────────────────

export function toggleSaved(s: AppState, vocabId: string): AppState {
  return withPack(s, (p) => ({ ...p, saved: p.saved.includes(vocabId) ? p.saved.filter((x) => x !== vocabId) : [...p.saved, vocabId] }));
}

export function revealDailyWord(s: AppState, vocabId: string, now: number): AppState {
  return withPack(s, (p) => ({ ...p, dailyWord: { day: dayKey(now), revealed: true, vocabId } }));
}

/** Recovery: finishing a short no-penalty practice restores one life. */
export function restoreLife(s: AppState, cost = 0): AppState {
  const p = packOf(s);
  if (cost > p.coins || s.lives.count >= s.settings.maxLives) return s;
  const count = s.lives.count + 1;
  const s2 = withPack(s, (pp) => ({ ...pp, coins: pp.coins - cost }));
  return { ...s2, lives: { count, regenFrom: count >= s.settings.maxLives ? null : s.lives.regenFrom } };
}

export function switchPack(s: AppState, id: string): AppState {
  return { ...s, activePack: id, packs: s.packs[id] ? s.packs : { ...s.packs, [id]: emptyPackProgress() } };
}

/** Migrate/repair persisted state of any older shape. */
export function hydrate(raw: unknown, fallbackPack: string): AppState {
  const base = initialState(fallbackPack);
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<AppState>;
  if (r.version !== STATE_VERSION) return base;
  const packs: Record<string, PackProgress> = {};
  for (const [id, p] of Object.entries(r.packs ?? {})) {
    const e = emptyPackProgress();
    packs[id] = { ...e, ...p, stats: { ...e.stats, ...(p?.stats ?? {}) }, dailyWord: { ...e.dailyWord, ...(p?.dailyWord ?? {}) } };
  }
  return {
    ...base,
    ...r,
    learner: { ...base.learner, ...r.learner },
    settings: { ...base.settings, ...r.settings },
    lives: { ...base.lives, ...r.lives },
    streak: { ...base.streak, ...r.streak },
    days: r.days ?? {},
    packs: Object.keys(packs).length ? packs : base.packs,
  };
}
