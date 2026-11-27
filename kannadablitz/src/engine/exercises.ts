import type { LanguagePack, Letter, Sentence, VocabEntry } from "../content/schema";
import type { Choice, Exercise, ExercisePlan, PairItem } from "./types";
import { sample, shuffle, type Rng } from "./rng";

const TEACHING = new Set(["letter_learn", "word_intro", "phrase_reveal", "flashcard"]);

export interface PackIndex {
  pack: LanguagePack;
  vocab: Map<string, VocabEntry>;
  letters: Map<string, Letter>;
  sentenceByWord: Map<string, Sentence>;
}

export function indexPack(pack: LanguagePack): PackIndex {
  const vocab = new Map(pack.vocab.map((v) => [v.id, v]));
  const letters = new Map(pack.letters.map((l) => [l.id, l]));
  const sentenceByWord = new Map<string, Sentence>();
  for (const v of pack.vocab) {
    const hit = pack.sentences.find((s) => s.tokens.some((t) => t === v.script || t.startsWith(v.script)));
    if (hit) sentenceByWord.set(v.id, hit);
  }
  return { pack, vocab, letters, sentenceByWord };
}

export function exampleFor(ix: PackIndex, v: VocabEntry): { script: string; meaning: string } | undefined {
  if (v.example) return v.example;
  const s = ix.sentenceByWord.get(v.id);
  return s ? { script: s.tokens.join(" "), meaning: s.meaning } : undefined;
}

/** Distractors share part of speech/topic when possible: harder, fairer choices. */
function distractors(ix: PackIndex, target: VocabEntry, n: number, rng: Rng): VocabEntry[] {
  const all = ix.pack.vocab.filter(
    (v) => v.id !== target.id && v.meaning.toLowerCase() !== target.meaning.toLowerCase() && v.script !== target.script,
  );
  const sameTopic = all.filter((v) => v.topic === target.topic);
  const samePos = all.filter((v) => v.pos === target.pos && v.topic !== target.topic);
  const picked: VocabEntry[] = [];
  const meanings = new Set([target.meaning.toLowerCase()]);
  for (const pool of [shuffle(sameTopic, rng), shuffle(samePos, rng), shuffle(all, rng)]) {
    for (const v of pool) {
      if (picked.length >= n) break;
      const m = v.meaning.toLowerCase();
      if (meanings.has(m) || picked.some((p) => p.script === v.script)) continue;
      meanings.add(m);
      picked.push(v);
    }
  }
  return picked;
}

function letterChoices(ix: PackIndex, target: Letter, rng: Rng, show: "roman" | "script"): Choice[] {
  const sameKind = ix.pack.letters.filter((l) => l.id !== target.id && l.kind === target.kind);
  const pool = sameKind.length >= 3 ? sameKind : ix.pack.letters.filter((l) => l.id !== target.id);
  const near = pool.filter((l) => l.group === target.group);
  const others = sample([...near, ...shuffle(pool, rng)].filter((l, i, a) => a.indexOf(l) === i), 3, rng);
  return shuffle([target, ...others], rng).map((l) => ({
    id: l.id,
    label: show === "roman" ? l.roman : l.script,
    native: show === "script",
    correct: l.id === target.id,
  }));
}

const toPair = (v: VocabEntry): PairItem => ({ id: v.id, script: v.script, meaning: v.meaning, roman: v.roman });

function uniquePairs(list: VocabEntry[]): VocabEntry[] {
  const scripts = new Set<string>();
  const meanings = new Set<string>();
  return list.filter((v) => {
    const m = v.meaning.toLowerCase();
    if (scripts.has(v.script) || meanings.has(m)) return false;
    scripts.add(v.script);
    meanings.add(m);
    return true;
  });
}

export function materialize(ix: PackIndex, plan: ExercisePlan, key: string, rng: Rng): Exercise | null {
  const v = plan.vocabIds?.[0] ? ix.vocab.get(plan.vocabIds[0]) : undefined;
  const base = { key, type: plan.type, teaching: TEACHING.has(plan.type) };
  switch (plan.type) {
    case "letter_learn":
    case "letter_pick":
    case "letter_find":
    case "letter_trace": {
      const letter = plan.letterId ? ix.letters.get(plan.letterId) : undefined;
      if (!letter) return null;
      const exampleWord =
        ix.pack.vocab.find((w) => w.script.startsWith(letter.script) && w.script.length <= 8) ??
        ix.pack.vocab.find((w) => w.script.includes(letter.script));
      return {
        ...base,
        skill: "letters",
        letter,
        vocab: exampleWord,
        freehand: plan.freehand,
        choices:
          plan.type === "letter_pick" ? letterChoices(ix, letter, rng, "roman")
          : plan.type === "letter_find" ? letterChoices(ix, letter, rng, "script")
          : undefined,
      };
    }
    case "word_intro":
    case "flashcard":
      return v ? { ...base, skill: "vocab", vocab: v, example: exampleFor(ix, v) } : null;
    case "meaning_pick":
    case "script_pick": {
      if (!v) return null;
      const opts = distractors(ix, v, 3, rng);
      if (opts.length < 2) return null;
      const reverse = plan.type === "script_pick";
      return {
        ...base,
        skill: "vocab",
        vocab: v,
        example: exampleFor(ix, v),
        choices: shuffle([v, ...opts], rng).map((o) => ({
          id: o.id,
          label: reverse ? o.script : o.meaning,
          sub: reverse ? o.roman : undefined,
          native: reverse,
          correct: o.id === v.id,
        })),
      };
    }
    case "match_grid":
    case "match_columns": {
      const given = (plan.vocabIds ?? []).map((id) => ix.vocab.get(id)).filter((x): x is VocabEntry => !!x);
      let list = uniquePairs(given);
      if (list.length < 4 && given.length) {
        // top up with same-topic words so the board never collapses below 4 pairs
        const extra = shuffle(ix.pack.vocab.filter((w) => w.topic === given[0].topic && !given.includes(w)), rng);
        list = uniquePairs([...list, ...extra, ...shuffle(ix.pack.vocab, rng)]).slice(0, Math.max(4, list.length));
      }
      if (list.length < 3) return null;
      return { ...base, skill: "vocab", pairs: list.slice(0, plan.type === "match_grid" ? 4 : 6).map(toPair) };
    }
    case "sentence_build": {
      const s = plan.sentenceId ? ix.pack.sentences.find((x) => x.id === plan.sentenceId) : undefined;
      if (!s) return null;
      const tokens = s.tokens.map((t, i) => ({ id: `${s.id}.${i}`, text: t }));
      // One distractor tile for sentences of 3+ tokens keeps learners reading, not guessing.
      const extra =
        s.tokens.length >= 3
          ? sample(ix.pack.vocab.filter((w) => !s.tokens.includes(w.script) && !w.script.includes(" ")), 1, rng).map((w) => ({ id: `${s.id}.x`, text: w.script }))
          : [];
      let tiles = shuffle([...tokens, ...extra], rng);
      if (tiles.map((t) => t.text).join(" ") === s.tokens.join(" ")) tiles = tiles.reverse();
      return { ...base, skill: "sentences", sentence: s, tiles };
    }
    case "sentence_fill": {
      const s = plan.sentenceId ? ix.pack.sentences.find((x) => x.id === plan.sentenceId) : undefined;
      if (!s || s.tokens.length < 2) return null;
      const candidates = s.tokens.map((t, i) => ({ t, i })).filter((x) => x.t.length >= 2);
      const poolIdx = candidates.length ? candidates.map((x) => x.i) : s.tokens.map((_, i) => i);
      const blankIndex = poolIdx[Math.floor(rng() * poolIdx.length)];
      const target = s.tokens[blankIndex];

      // Gather plausible single-token distractors from other sentences first, then vocab.
      const seen = new Set<string>([target]);
      const distractorsList: string[] = [];
      const addFrom = (items: string[], avoidInSentence: boolean) => {
        for (const tok of items) {
          if (distractorsList.length >= 3) break;
          if (!tok || seen.has(tok)) continue;
          if (avoidInSentence && s.tokens.includes(tok)) continue;
          seen.add(tok);
          distractorsList.push(tok);
        }
      };
      const otherTokens = shuffle(
        ix.pack.sentences.filter((x) => x.id !== s.id).flatMap((x) => x.tokens),
        rng,
      );
      const vocabTokens = shuffle(
        ix.pack.vocab.filter((w) => !w.script.includes(" ")).map((w) => w.script),
        rng,
      );
      addFrom(otherTokens, true);
      addFrom(vocabTokens, true);
      addFrom(otherTokens, false);
      addFrom(vocabTokens, false);
      if (distractorsList.length < 2) return null;

      const romanOf = (script: string) =>
        ix.pack.vocab.find((w) => w.script === script)?.roman ?? ix.pack.romanize?.(script);
      const choices: Choice[] = shuffle([target, ...distractorsList], rng).map((script, idx) => ({
        id: `${s.id}.b.${idx}`,
        label: script,
        sub: romanOf(script),
        native: true,
        correct: script === target,
      }));
      return { ...base, skill: "sentences", sentence: s, blankIndex, choices };
    }
    case "phrase_reveal": {
      const phrase = ix.pack.phrases.find((p) => p.id === plan.phraseId);
      return phrase ? { ...base, skill: "vocab", phrase } : null;
    }
    case "reading": {
      const reading = ix.pack.readings.find((r) => r.id === plan.readingId);
      return reading ? { ...base, skill: "comprehension", reading } : null;
    }
  }
}

export function materializeAll(ix: PackIndex, plans: ExercisePlan[], prefix: string, rng: Rng): Exercise[] {
  const out: Exercise[] = [];
  plans.forEach((p, i) => {
    const ex = materialize(ix, p, `${prefix}.${i}`, rng);
    if (ex) out.push(ex);
  });
  return out;
}

/** Revision: due & weak words first, mixed exercise types. */
export function revisionPlans(vocabIds: string[], count = 10): ExercisePlan[] {
  const ids = vocabIds.slice(0, Math.max(count, 4));
  const out: ExercisePlan[] = [];
  for (let i = 0; out.length < count && ids.length; i++) {
    const id = ids[i % ids.length];
    const slot = i % 5;
    if (slot === 2 && ids.length >= 4) out.push({ type: "match_columns", vocabIds: sample(ids, Math.min(5, ids.length)) });
    else if (slot === 4) out.push({ type: "script_pick", vocabIds: [id] });
    else if (slot === 3) out.push({ type: "flashcard", vocabIds: [id] });
    else out.push({ type: "meaning_pick", vocabIds: [id] });
  }
  return out;
}

/** Practice plans for matching a word to its correct translation from options. */
export function wordQuizPlans(vocabIds: string[], count = 10): ExercisePlan[] {
  return vocabIds.slice(0, count).map((id) => ({ type: "meaning_pick", vocabIds: [id] }));
}

/** Practice plans for sentence building and fill-in-the-blank drills. */
export function sentencePracticePlans(sentenceIds: string[], mode: "build" | "fill" | "mixed", count = 8): ExercisePlan[] {
  const picked = sentenceIds.slice(0, count);
  return picked.map((sentenceId, i) => ({
    type: mode === "build" ? "sentence_build" : mode === "fill" ? "sentence_fill" : i % 2 === 0 ? "sentence_fill" : "sentence_build",
    sentenceId,
  }));
}

/** Sentence exactness check (ignores distractor tiles). */
export function checkSentence(sentence: Sentence, answer: string[]): boolean {
  return answer.join(" ") === sentence.tokens.join(" ");
}
