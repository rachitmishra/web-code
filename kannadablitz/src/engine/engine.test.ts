import { describe, expect, it } from "vitest";
import { KANNADA_PACK } from "../content/packs/kn";
import { HINDI_PACK } from "../content/packs/hi";
import { sanitizeImportedPack, validatePack } from "../content/validate";
import { buildCurriculum, EXERCISES_PER_SUBLEVEL, REQUIRED_SUBLEVELS } from "./curriculum";
import { checkSentence, indexPack, materialize, materializeAll, sentencePracticePlans } from "./exercises";
import { seeded } from "./rng";
import {
  applyAnswer, applySessionComplete, initialState, liveStreak, nextSublevel, packOf, regenLives, sublevelState, LIFE_REGEN_MS,
} from "./progress";
import { review, mastery } from "./srs";
import { dayKey } from "./date";
import { isSafeImageSrc } from "./illustration";
import { generateSyncTag, normalizeSyncTag } from "./sync";

const cur = buildCurriculum(KANNADA_PACK);
const ix = indexPack(KANNADA_PACK);

describe("Kannada content pack", () => {
  it("is valid", () => {
    const r = validatePack(KANNADA_PACK);
    expect(r.errors).toEqual([]);
    expect(r.stats.vocab).toBeGreaterThan(700);
  });
  it("has no duplicate scripts in vocab", () => {
    const scripts = KANNADA_PACK.vocab.map((v) => v.script);
    expect(new Set(scripts).size).toBe(scripts.length);
  });
  it("only contains Kannada script in vocab entries", () => {
    for (const v of KANNADA_PACK.vocab) expect(v.script).toMatch(/^(?:[ಀ-೿\s/]|‌|‍)+$/);
  });
});

describe("curriculum", () => {
  it("has 20 levels, ≥10 sublevels each and exactly 10 exercises per sublevel", () => {
    expect(cur.levels).toHaveLength(20);
    for (const l of cur.levels) {
      expect(l.sublevels.filter((s) => s.required)).toHaveLength(REQUIRED_SUBLEVELS);
      for (const s of l.sublevels) expect(s.plan).toHaveLength(EXERCISES_PER_SUBLEVEL);
    }
    expect(cur.totals.requiredExercises).toBe(2000);
  });
  it("materialises every one of the exercises", () => {
    const rng = seeded(1);
    const failures: string[] = [];
    for (const l of cur.levels)
      for (const s of l.sublevels)
        s.plan.forEach((p, i) => { if (!materialize(ix, p, `${s.id}.${i}`, rng)) failures.push(`${s.id}#${i}:${p.type}`); });
    expect(failures).toEqual([]);
  });
  it("teaches mostly new words in each vocabulary level", () => {
    const seen = new Set<string>();
    let fresh = 0, total = 0;
    for (const l of cur.levels.filter((x) => x.mode !== "letters" && x.mode !== "writing" && x.mode !== "review")) {
      for (const id of l.vocabIds) { total++; if (!seen.has(id)) fresh++; seen.add(id); }
    }
    expect(fresh / total).toBeGreaterThan(0.75);
  });
  it("builds for another language without code changes", () => {
    const hi = buildCurriculum(HINDI_PACK);
    expect(hi.levels).toHaveLength(3);
    const hix = indexPack(HINDI_PACK);
    const ex = hi.levels.flatMap((l) => l.sublevels.flatMap((s) => materializeAll(hix, s.plan, s.id, seeded(2))));
    expect(ex.length).toBeGreaterThan(250);
  });
});

describe("exercises", () => {
  it("multiple-choice has exactly one correct answer and unique labels", () => {
    const rng = seeded(3);
    for (const v of KANNADA_PACK.vocab.slice(0, 200)) {
      const e = materialize(ix, { type: "meaning_pick", vocabIds: [v.id] }, "k", rng)!;
      expect(e.choices!.filter((c) => c.correct)).toHaveLength(1);
      expect(new Set(e.choices!.map((c) => c.label.toLowerCase())).size).toBe(e.choices!.length);
    }
  });
  it("sentence tiles are scrambled and checked by order", () => {
    const s = KANNADA_PACK.sentences[0];
    const e = materialize(ix, { type: "sentence_build", sentenceId: s.id }, "k", seeded(4))!;
    expect(e.tiles!.map((t) => t.text).join(" ")).not.toBe(s.tokens.join(" "));
    expect(checkSentence(s, s.tokens)).toBe(true);
    expect(checkSentence(s, [...s.tokens].reverse())).toBe(false);
  });
  it("sentence fill-in-the-blank picks a valid blank with unique choices", () => {
    const rng = seeded(5);
    for (const s of KANNADA_PACK.sentences.slice(0, 20)) {
      const e = materialize(ix, { type: "sentence_fill", sentenceId: s.id }, `f.${s.id}`, rng)!;
      expect(e.blankIndex).toBeGreaterThanOrEqual(0);
      expect(e.blankIndex).toBeLessThan(s.tokens.length);
      expect(e.choices!.length).toBeGreaterThanOrEqual(3);
      const right = e.choices!.filter((c) => c.correct);
      expect(right).toHaveLength(1);
      expect(right[0].label).toBe(s.tokens[e.blankIndex!]);
      expect(new Set(e.choices!.map((c) => c.label)).size).toBe(e.choices!.length);
    }
    const plans = sentencePracticePlans(KANNADA_PACK.sentences.map((s) => s.id), "fill", 6);
    expect(plans).toHaveLength(6);
    expect(plans.every((p) => p.type === "sentence_fill")).toBe(true);
  });
});

describe("progress", () => {
  const now = new Date(2026, 10, 24, 10).getTime();
  it("awards a stamp per sublevel and a postcard on level completion", () => {
    let s = initialState("kn");
    const l1 = cur.levels[0];
    const events: string[] = [];
    for (const sub of l1.sublevels.filter((x) => x.required)) {
      const r = applySessionComplete(s, cur, { kind: "sublevel", sublevelId: sub.id, total: 10, mistakes: 0, xpEarned: 0, durationMs: 60000 }, now);
      s = r.state;
      events.push(...r.events.map((e) => e.type));
    }
    expect(events.filter((e) => e === "stamp")).toHaveLength(10);
    expect(events).toContain("postcard");
    expect(events).toContain("level_unlocked");
    expect(packOf(s).postcards[l1.postcardId]).toBe(now);
    expect(nextSublevel(cur, packOf(s))?.levelNumber).toBe(2);
  });
  it("locks sublevels until the previous one is done", () => {
    const p = packOf(initialState("kn"));
    const l1 = cur.levels[0];
    expect(sublevelState(cur, p, l1, l1.sublevels[0])).toBe("current");
    expect(sublevelState(cur, p, l1, l1.sublevels[1])).toBe("locked");
    expect(sublevelState(cur, p, cur.levels[1], cur.levels[1].sublevels[0])).toBe("locked");
  });
  it("wrong answers cost a life, practice and teaching do not, and lives regenerate", () => {
    let s = initialState("kn");
    s = applyAnswer(s, { correct: false, skill: "vocab" }, now).state;
    expect(s.lives.count).toBe(4);
    s = applyAnswer(s, { correct: false, skill: "vocab", practice: true }, now).state;
    s = applyAnswer(s, { correct: false, skill: "vocab", teaching: true }, now).state;
    expect(s.lives.count).toBe(4);
    s = regenLives(s, now + LIFE_REGEN_MS + 1);
    expect(s.lives.count).toBe(5);
    expect(s.lives.regenFrom).toBeNull();
  });
  it("streak counts calendar days and lapses after a gap", () => {
    let s = initialState("kn");
    s = applyAnswer(s, { correct: true, skill: "vocab" }, now).state;
    s = applyAnswer(s, { correct: true, skill: "vocab" }, now + 86400000).state;
    expect(s.streak.count).toBe(2);
    expect(liveStreak(s, now + 86400000 * 5)).toBe(0);
    expect(s.days[dayKey(now)].xp).toBe(10);
  });
});

describe("srs + safety", () => {
  it("promotes on correct and demotes on wrong", () => {
    let c = review(undefined, true, 0);
    c = review(c, true, 0); c = review(c, true, 0); c = review(c, true, 0);
    expect(mastery(c)).toBe("mastered");
    c = review(c, false, 0);
    expect(c.box).toBe(2);
  });
  it("strips raw SVG from imported packs and only allows raster data URLs", () => {
    const bad = { ...HINDI_PACK, art: { x: "<svg onload=alert(1)>" }, vocab: HINDI_PACK.vocab.map((v) => ({ ...v, art: "x" })) };
    const clean = sanitizeImportedPack(bad);
    expect(clean.art).toEqual({});
    expect(clean.vocab.every((v) => !v.art)).toBe(true);
    expect(isSafeImageSrc("data:image/svg+xml;base64,PHN2Zz4=")).toBe(false);
    expect(isSafeImageSrc("data:image/png;base64,iVBORw0KGgo=")).toBe(true);
  });

  it("generates and normalises name#1234 Firebase sync keys", () => {
    const tag = generateSyncTag("Asha Rao!");
    expect(tag).toMatch(/^asha-rao#\d{4}$/);
    expect(generateSyncTag("   ")).toMatch(/^traveller#\d{4}$/);
    expect(normalizeSyncTag("Asha #4829")).toEqual({ tag: "asha#4829", docId: "asha-4829" });
    expect(normalizeSyncTag("asha-4829")).toEqual({ tag: "asha#4829", docId: "asha-4829" });
    expect(normalizeSyncTag("badkey")).toBeNull();
    expect(normalizeSyncTag("asha#12")).toBeNull();
  });
});
