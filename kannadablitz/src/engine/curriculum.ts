import type { LanguagePack, LevelSpec, Letter, Topic, VocabEntry } from "../content/schema";
import type { Curriculum, ExercisePlan, Level, Sublevel, SublevelKind } from "./types";
import { chunk, seeded, shuffle } from "./rng";

/** Every level has 10 required sublevels plus one optional bonus node. */
export const REQUIRED_SUBLEVELS = 10;
export const EXERCISES_PER_SUBLEVEL = 10;
const LESSON_SLOTS = [1, 2, 3, 4, 6, 7, 8, 9];
const MILESTONE = 5;
const CHALLENGE = 10;
const WORDS_PER_LESSON = 4;

export const TOPIC_LABEL: Record<Topic, string> = {
  greetings: "Greetings", pronouns: "Pronouns", people: "People", family: "Family",
  professions: "People at Work", questions: "Questions", numbers: "Numbers", colors: "Colours",
  time: "Time", days: "Days", food: "Food", market: "Market", home: "Home", clothing: "Clothing",
  body: "Body & Health", animals: "Animals", nature: "Nature", directions: "Directions",
  places: "Places", transport: "Transport", verbs: "Verbs", adjectives: "Describing",
  emotions: "Feelings", culture: "Culture", language: "Language", society: "Society",
  grammar: "Grammar Forms", concepts: "Ideas",
};

const GROUP_LABEL: Record<string, string> = {
  velar: "Velars", palatal: "Palatals", retroflex: "Retroflex", dental: "Dentals",
  labial: "Labials", approximant: "Semivowels", sibilant: "Sibilants", ottakshara: "Ottaksharas",
  yogavaha: "Yogavahas",
};

function selectVocab(pack: LanguagePack, spec: LevelSpec, used: Set<string>): VocabEntry[] {
  const inLessons = (v: VocabEntry) =>
    !spec.lessons || (v.lesson >= spec.lessons[0] && v.lesson <= spec.lessons[1]);
  const inTopics = (v: VocabEntry) => !spec.topics || spec.topics.includes(v.topic);
  const tiers = [
    pack.vocab.filter((v) => inLessons(v) && inTopics(v)),
    pack.vocab.filter((v) => inTopics(v)),
    pack.vocab.filter((v) => inLessons(v)),
  ];
  const want = WORDS_PER_LESSON * LESSON_SLOTS.length;
  const picked: VocabEntry[] = [];
  const seen = new Set<string>();
  const take = (v: VocabEntry) => {
    if (!seen.has(v.id) && picked.length < want) {
      picked.push(v);
      seen.add(v.id);
    }
  };
  // Prefer fresh on-topic words, then on-topic review, and only then off-topic words.
  const [exact, topical, lessonOnly] = tiers;
  for (const tier of [exact, topical]) tier.filter((v) => !used.has(v.id)).forEach(take);
  for (const tier of [exact, topical]) tier.forEach(take);
  lessonOnly.filter((v) => !used.has(v.id)).forEach(take);
  lessonOnly.forEach(take);
  if (picked.length < 8) pack.vocab.forEach(take);
  // Group by the spec's topic order so each sublevel is coherent; easier words first.
  const order = (t: Topic) => (spec.topics ? (spec.topics.indexOf(t) + 1 || 99) : 0);
  return picked.sort(
    (a, b) => order(a.topic) - order(b.topic) || a.lesson - b.lesson || a.script.length - b.script.length,
  );
}

function letterChunks(letters: Letter[]): Letter[][] {
  const byGroup = new Map<string, Letter[]>();
  letters.forEach((l) => byGroup.set(l.group, [...(byGroup.get(l.group) ?? []), l]));
  const groups = [...byGroup.values()];
  // Split big groups / merge to fill exactly 8 lesson slots
  while (groups.length < LESSON_SLOTS.length) {
    const i = groups.reduce((best, g, idx) => (g.length > groups[best].length ? idx : best), 0);
    if (groups[i].length < 2) break;
    const g = groups[i];
    const half = Math.ceil(g.length / 2);
    groups.splice(i, 1, g.slice(0, half), g.slice(half));
  }
  while (groups.length > LESSON_SLOTS.length) {
    let bi = 0;
    for (let i = 0; i < groups.length - 1; i++) {
      if (groups[i].length + groups[i + 1].length < groups[bi].length + groups[bi + 1].length) bi = i;
    }
    groups.splice(bi, 2, [...groups[bi], ...groups[bi + 1]]);
  }
  while (groups.length < LESSON_SLOTS.length) groups.push(groups[groups.length % Math.max(1, groups.length)] ?? []);
  return groups;
}

/** Short, early words that contain one of the given letters (fresh words first). */
function wordsForLetters(pack: LanguagePack, letters: Letter[], used: Set<string>, n = 3): string[] {
  const easy = pack.vocab
    .filter((v) => v.lesson <= 6 && !v.script.includes(" ") && v.script.length <= 7)
    .sort((a, b) => a.script.length - b.script.length || a.lesson - b.lesson);
  const picked: string[] = [];
  for (const l of letters) {
    const hit = easy.find((v) => v.script.includes(l.script) && !picked.includes(v.id) && !used.has(v.id))
      ?? easy.find((v) => v.script.includes(l.script) && !picked.includes(v.id));
    if (hit) picked.push(hit.id);
    if (picked.length >= n) break;
  }
  for (const v of easy) {
    if (picked.length >= Math.min(2, n)) break;
    if (!picked.includes(v.id) && !used.has(v.id)) picked.push(v.id);
  }
  picked.forEach((id) => used.add(id));
  return picked;
}

const cycle = <T,>(arr: T[], i: number): T | undefined => (arr.length ? arr[i % arr.length] : undefined);

/** Ten-exercise templates; each slot references content ids only. */
function planFor(
  kind: SublevelKind,
  mode: LevelSpec["mode"],
  words: string[],
  letters: string[],
  phrases: string[],
  sentences: string[],
  readings: string[],
  review: string[],
  priorVocab: string[],
  priorLetters: string[],
  rng: () => number,
): ExercisePlan[] {
  const w = (i: number) => cycle(words, i);
  const pv = (i: number) => cycle(priorVocab, i);
  const pl = (i: number) => cycle(priorLetters, i);
  const pool = review.length >= 4 ? review : [...new Set([...words, ...review])];
  const group = (n: number, off = 0) => {
    const src = pool.length >= n ? pool : [...new Set([...pool, ...words])];
    return shuffle(src, rng).slice(off, off + n);
  };
  const spiralGroup = (n: number, priorCount = 1) => {
    const fromPrior = priorVocab.length ? shuffle(priorVocab, rng).slice(0, priorCount) : [];
    const fromCur = shuffle(pool.length ? pool : words, rng).filter((id) => !fromPrior.includes(id));
    return [...fromPrior, ...fromCur].slice(0, n);
  };
  const s = (i: number) => cycle(sentences, i);
  const p = (i: number) => cycle(phrases, i);
  const out: ExercisePlan[] = [];
  const push = (e: ExercisePlan | null) => e && out.push(e);
  const intro = (i: number) => (w(i) ? { type: "word_intro" as const, vocabIds: [w(i)!] } : null);
  const pick = (id?: string) => (id ? { type: "meaning_pick" as const, vocabIds: [id] } : null);
  const rpick = (id?: string) => (id ? { type: "script_pick" as const, vocabIds: [id] } : null);
  const grid = (ids: string[]) => (ids.length >= 3 ? { type: "match_grid" as const, vocabIds: ids } : null);
  const cols = (ids: string[]) => (ids.length >= 3 ? { type: "match_columns" as const, vocabIds: ids } : null);
  const build = (id?: string) => (id ? { type: "sentence_build" as const, sentenceId: id } : null);
  const fill = (id?: string) => (id ? { type: "sentence_fill" as const, sentenceId: id } : null);
  const phrase = (id?: string) => (id ? { type: "phrase_reveal" as const, phraseId: id } : null);
  const flash = (id?: string) => (id ? { type: "flashcard" as const, vocabIds: [id] } : null);

  if (mode === "letters" || mode === "writing") {
    const L = (i: number) => cycle(letters, i)!;
    const learn = (i: number) => ({ type: "letter_learn" as const, letterId: L(i) });
    const lpick = (i: number) => ({ type: "letter_pick" as const, letterId: L(i) });
    const find = (i: number) => ({ type: "letter_find" as const, letterId: L(i) });
    const trace = (i: number, freehand = false) => ({ type: "letter_trace" as const, letterId: L(i), freehand });
    const prevLpick = (i: number) => (pl(i) ? { type: "letter_pick" as const, letterId: pl(i)! } : lpick(i));
    const prevFind = (i: number) => (pl(i) ? { type: "letter_find" as const, letterId: pl(i)! } : find(i));
    const n = letters.length;
    // Words that use this lesson's letters, so every letter is immediately read in context.
    const wIntro = (i: number) => intro(i) ?? lpick(i);
    const wPick = (i: number) => pick(w(i)) ?? find(i);
    if (kind === "lesson") {
      let seq: ExercisePlan[];
      if (mode === "writing") {
        seq = [learn(0), trace(0), trace(0, true), prevLpick(0), learn(1), trace(1), trace(1, true), lpick(0), prevFind(1), wPick(0)];
      } else if (n >= 4) {
        seq = [learn(0), trace(0), learn(1), trace(1), wIntro(0), learn(2), learn(3), prevLpick(0), find(3), wPick(0)];
      } else if (n === 3) {
        seq = [learn(0), trace(0), learn(1), trace(1), wIntro(0), learn(2), trace(2), prevLpick(0), find(1), wPick(0)];
      } else {
        seq = [learn(0), trace(0), n > 1 ? learn(1) : lpick(0), trace(n > 1 ? 1 : 0, n <= 1), wIntro(0), prevLpick(0), wIntro(1), find(n - 1), trace(0, true), wPick(1)];
      }
      seq.forEach(push);
    } else {
      // review: recognise, trace from memory, and spiral-review prior level letters & words
      for (let i = 0; i < EXERCISES_PER_SUBLEVEL - 1; i++) {
        const t = i % 5;
        const word = pool.length ? pick(cycle(shuffle(pool, rng), i)) : null;
        push(t === 0 ? (i % 2 === 1 ? prevLpick(i) : lpick(i)) : t === 1 ? trace(i, kind !== "milestone" || i > 4) : t === 2 ? (i % 2 === 0 ? prevFind(i) : find(i)) : t === 3 ? word ?? lpick(i + 3) : trace(i + 2, true));
      }
      push(pool.length >= 3 ? { type: "match_grid", vocabIds: spiralGroup(4, 1) } : prevFind(9));
    }
    return out.slice(0, EXERCISES_PER_SUBLEVEL);
  }

  if (kind === "lesson") {
    if (mode === "sentences") {
      [intro(0), fill(s(0)), pick(pv(0)) ?? pick(w(0)), intro(1), build(s(1)), grid(spiralGroup(4, 2)), fill(s(2)), rpick(w(1)), phrase(p(0)) ?? flash(pv(1) ?? w(2)), build(s(3))].forEach(push);
    } else if (mode === "mixed") {
      [intro(0), intro(1), pick(w(0)), phrase(p(0)) ?? pick(pv(0)) ?? intro(2), intro(2), grid([...words.slice(0, 3), ...(pv(0) ? [pv(0)!] : [])].filter(Boolean)), fill(s(0)) ?? pick(pv(1) ?? w(2)), intro(3), build(s(1)) ?? rpick(pv(2) ?? w(3) ?? w(1)), cols(spiralGroup(5, 2))].forEach(push);
    } else {
      [intro(0), intro(1), pick(w(0)), intro(2), pick(pv(0) ?? w(1)), grid([...words.slice(0, 3), ...(pv(1) ? [pv(1)!] : [])].filter(Boolean)), intro(3), rpick(w(2)), fill(s(0)) ?? flash(pv(2) ?? w(3)), cols(spiralGroup(5, 2))].forEach(push);
    }
  } else if (kind === "milestone") {
    const r = group(6);
    [pick(r[0]), rpick(pv(0) ?? r[1]), grid(spiralGroup(4, 2)), pick(r[2]), fill(s(0)) ?? pick(pv(1) ?? r[5]), flash(r[3]), cols(spiralGroup(5, 2)), build(s(1)) ?? rpick(r[4]), phrase(p(0)) ?? pick(pv(2) ?? r[1]), grid(spiralGroup(4, 1))].forEach(push);
  } else {
    // challenge + bonus: harder mix with strong spiral revision of prior levels + sentences
    const r = group(7);
    const read = readings.length ? { type: "reading" as const, readingId: readings[0] } : null;
    [rpick(r[0]), fill(s(0)) ?? pick(pv(0) ?? r[0]), cols(spiralGroup(5, 2)), rpick(pv(1) ?? r[1]), build(s(1)) ?? pick(r[1]), pick(pv(2) ?? r[2]),
      read ?? grid(spiralGroup(5, 2)), rpick(r[3]), build(s(2)) ?? rpick(pv(3) ?? r[4]), cols(spiralGroup(6, 2))].forEach(push);
  }
  // Pad with safe fallbacks if a slot had nothing to reference.
  let k = 0;
  while (out.length < EXERCISES_PER_SUBLEVEL && pool.length) push(pick(cycle(pool, k++)));
  return out.slice(0, EXERCISES_PER_SUBLEVEL);
}

export function buildCurriculum(pack: LanguagePack): Curriculum {
  const used = new Set<string>();
  const priorVocabAll: string[] = [];
  const priorLettersAll: string[] = [];
  const rng = seeded(`${pack.config.id}@${pack.config.version}`);
  const levels: Level[] = [];

  for (const spec of [...pack.levels].sort((a, b) => a.number - b.number)) {
    const lettersAll = spec.letterKinds ? pack.letters.filter((l) => spec.letterKinds!.includes(l.kind)) : [];
    const isLetterMode = spec.mode === "letters" || spec.mode === "writing";
    const vocab = isLetterMode ? [] : selectVocab(pack, spec, used);
    vocab.forEach((v) => used.add(v.id));
    const phrases = pack.phrases
      .filter((p) => (!spec.situations || spec.situations.includes(p.situation)) && p.level <= spec.number + 2)
      .map((p) => p.id);
    const sentences = pack.sentences
      .filter((s) => !spec.sentenceLevels || (s.level >= spec.sentenceLevels[0] && s.level <= spec.sentenceLevels[1]))
      .map((s) => s.id);
    const readings = spec.number >= 18 ? pack.readings.map((r) => r.id) : [];

    const lChunks = isLetterMode ? letterChunks(lettersAll) : [];
    const wordChunks = isLetterMode
      ? lChunks.map((ls) => wordsForLetters(pack, ls, used))
      : chunk(vocab.map((v) => v.id), WORDS_PER_LESSON);
    const sentChunks = sentences.length ? chunk(shuffle(sentences, rng), Math.max(1, Math.ceil(sentences.length / 8))) : [];
    const subs: Sublevel[] = [];
    const levelWords: string[] = [];

    for (let index = 1; index <= REQUIRED_SUBLEVELS + 1; index++) {
      const kind: SublevelKind =
        index === MILESTONE ? "milestone" : index === CHALLENGE ? "challenge" : index > REQUIRED_SUBLEVELS ? "bonus" : "lesson";
      const slot = LESSON_SLOTS.indexOf(index);
      const words = kind === "lesson" ? wordChunks[slot % Math.max(1, wordChunks.length)] ?? [] : [];
      const letters = isLetterMode
        ? kind === "lesson"
          ? (lChunks[slot] ?? []).map((l) => l.id)
          : shuffle(lettersAll.slice(0, index === MILESTONE ? Math.ceil(lettersAll.length / 2) : undefined), rng).slice(0, 8).map((l) => l.id)
        : [];
      if (kind === "lesson") levelWords.push(...words);
      const review = kind === "lesson" ? [] : index === MILESTONE || isLetterMode ? [...new Set(levelWords)] : vocab.map((v) => v.id);
      const subSentences = kind === "lesson" ? sentChunks[slot % Math.max(1, sentChunks.length)] ?? [] : shuffle(sentences, rng).slice(0, 4);
      const subPhrases = shuffle(phrases, rng).slice(0, 2);
      const subPriorVocab = shuffle(priorVocabAll, rng).slice(0, 8);
      const subPriorLetters = shuffle(priorLettersAll, rng).slice(0, 6);
      const plan = planFor(kind, spec.mode, words, letters, subPhrases, subSentences, readings, review, subPriorVocab, subPriorLetters, rng);
      const leadVocab = pack.vocab.find((v) => v.id === words[0]);
      const leadLetters = letters.map((id) => pack.letters.find((l) => l.id === id)!).filter(Boolean);

      let title: string;
      let glyph: string;
      if (spec.sublevelTitles?.[index - 1]) {
        title = spec.sublevelTitles[index - 1];
        glyph = leadVocab?.script ?? leadLetters[0]?.script ?? spec.titleScript.slice(0, 2);
      } else if (kind === "milestone") {
        title = "Milestone Review";
        glyph = "★";
      } else if (kind === "challenge") {
        title = spec.number === pack.levels.length ? "Final Assessment" : "Level Challenge";
        glyph = "♛";
      } else if (kind === "bonus") {
        title = readings.length ? "Bonus: Reading Room" : "Bonus: Speed Round";
        glyph = "✦";
      } else if (isLetterMode) {
        const g = leadLetters[0]?.group ?? "";
        title = `${GROUP_LABEL[g] ?? (leadLetters[0]?.kind === "vowel" ? "Vowels" : "Letters")} ${leadLetters.map((l) => l.script).slice(0, 4).join(" ")}`;
        glyph = leadLetters[0]?.script ?? "";
      } else {
        title = leadVocab ? TOPIC_LABEL[leadVocab.topic] : `Lesson ${index}`;
        glyph = leadVocab?.script ?? "";
      }

      const xp = kind === "challenge" ? 60 : kind === "milestone" ? 40 : kind === "bonus" ? 50 : 25;
      subs.push({
        id: `${pack.config.id}.L${spec.number}.S${index}`,
        levelNumber: spec.number,
        index,
        kind,
        title,
        glyph,
        required: kind !== "bonus",
        vocabIds: kind === "lesson" ? words : review,
        letterIds: letters,
        phraseIds: subPhrases,
        sentenceIds: subSentences,
        plan,
        xp,
        coins: Math.round(xp / 3),
        stampId: `${pack.config.id}.stamp.${spec.number}.${index}`,
      });
    }

    // Disambiguate repeated topic titles within a level: "Food", "Food II", ...
    const counts = new Map<string, number>();
    subs.forEach((s) => {
      if (s.kind !== "lesson") return;
      const n = (counts.get(s.title) ?? 0) + 1;
      counts.set(s.title, n);
      if (n > 1) s.title = `${s.title} ${["", "", "II", "III", "IV", "V", "VI", "VII", "VIII"][n] ?? n}`;
    });

    const levelVocabIds = isLetterMode ? [...new Set(levelWords)] : vocab.map((v) => v.id);
    levels.push({
      number: spec.number,
      title: spec.title,
      titleScript: spec.titleScript,
      objective: spec.objective,
      difficulty: spec.difficulty,
      mode: spec.mode,
      postcardId: spec.postcardId,
      sublevels: subs,
      xp: 100 + spec.number * 10,
      coins: 40 + spec.number * 5,
      vocabIds: levelVocabIds,
    });
    for (const id of levelVocabIds) if (!priorVocabAll.includes(id)) priorVocabAll.push(id);
    for (const l of lettersAll) if (!priorLettersAll.includes(l.id)) priorLettersAll.push(l.id);
  }

  const sublevels = levels.flatMap((l) => l.sublevels);
  return {
    packId: pack.config.id,
    levels,
    totals: {
      levels: levels.length,
      sublevels: sublevels.length,
      exercises: sublevels.reduce((n, s) => n + s.plan.length, 0),
      requiredExercises: sublevels.filter((s) => s.required).reduce((n, s) => n + s.plan.length, 0),
    },
  };
}
