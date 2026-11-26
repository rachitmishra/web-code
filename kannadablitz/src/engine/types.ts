import type { Letter, Phrase, Reading, Sentence, VocabEntry } from "../content/schema";

export type ExerciseType =
  | "letter_learn"   // teach: big letter, sound, example
  | "letter_pick"    // see letter → choose its sound
  | "letter_find"    // see sound → choose the letter
  | "letter_trace"   // trace / free-draw
  | "word_intro"     // teach: native-first word card, tap to reveal
  | "meaning_pick"   // see script → choose meaning
  | "script_pick"    // see meaning → choose script
  | "match_grid"     // tile pairs
  | "match_columns"  // vertical two-column tap matching
  | "sentence_build" // arrange tiles
  | "sentence_fill"  // pick the missing word in a sentence
  | "phrase_reveal"  // teach: tap phrase for meaning + context
  | "flashcard"      // self-graded card
  | "reading";       // passage + comprehension question

/** Exercise plans are pure references to content ids. */
export interface ExercisePlan {
  type: ExerciseType;
  vocabIds?: string[];
  letterId?: string;
  letterIds?: string[];
  phraseId?: string;
  sentenceId?: string;
  readingId?: string;
  /** trace mode: dotted guide or free drawing */
  freehand?: boolean;
}

export type SublevelKind = "lesson" | "milestone" | "challenge" | "bonus";

export interface Sublevel {
  id: string;
  levelNumber: number;
  index: number;
  kind: SublevelKind;
  title: string;
  /** native-script highlight shown on the path node */
  glyph: string;
  /** required for level completion (bonus nodes are optional) */
  required: boolean;
  vocabIds: string[];
  letterIds: string[];
  phraseIds: string[];
  sentenceIds: string[];
  plan: ExercisePlan[];
  xp: number;
  coins: number;
  stampId: string;
}

export interface Level {
  number: number;
  title: string;
  titleScript: string;
  objective: string;
  difficulty: number;
  mode: string;
  postcardId: string;
  sublevels: Sublevel[];
  xp: number;
  coins: number;
  /** distinct words taught in this level */
  vocabIds: string[];
}

export interface Curriculum {
  packId: string;
  levels: Level[];
  totals: { levels: number; sublevels: number; exercises: number; requiredExercises: number };
}

export interface Choice {
  id: string;
  label: string;
  sub?: string;
  native?: boolean;
  correct: boolean;
}

export interface PairItem {
  id: string;
  script: string;
  meaning: string;
  roman: string;
}

/** A materialised, renderable exercise. */
export interface Exercise {
  key: string;
  type: ExerciseType;
  /** Teaching exercises cannot be failed and never cost lives */
  teaching: boolean;
  skill: "letters" | "vocab" | "sentences" | "comprehension";
  vocab?: VocabEntry;
  letter?: Letter;
  phrase?: Phrase;
  sentence?: Sentence;
  reading?: Reading;
  example?: { script: string; meaning: string };
  choices?: Choice[];
  pairs?: PairItem[];
  /** shuffled tokens (with optional distractor) for sentence_build */
  tiles?: { id: string; text: string }[];
  /** index of the blanked token in sentence.tokens for sentence_fill */
  blankIndex?: number;
  freehand?: boolean;
}

export type SessionKind = "sublevel" | "revision" | "practice";

export interface SessionResult {
  kind: SessionKind;
  sublevelId?: string;
  total: number;
  mistakes: number;
  xpEarned: number;
  durationMs: number;
}

export type RewardEvent =
  | { type: "stamp"; stampId: string; sublevelId: string; stars: number }
  | { type: "postcard"; postcardId: string; levelNumber: number }
  | { type: "achievement"; achievementId: string }
  | { type: "level_unlocked"; levelNumber: number }
  | { type: "goal_met"; xp: number }
  | { type: "streak"; days: number }
  | { type: "certificate" };
