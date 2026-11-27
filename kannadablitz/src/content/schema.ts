/**
 * Layer 3 — Language content schema.
 *
 * Everything language-specific lives in a LanguagePack. The engine and UI only
 * ever consume these types; nothing in /engine, /ui or /screens may contain
 * words, translations or sentences of a specific language.
 */

export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "pronoun"
  | "adverb"
  | "number"
  | "phrase";

/** Topic tags drive curriculum selection and the fallback illustration motif. */
export type Topic =
  | "greetings" | "pronouns" | "people" | "family" | "professions" | "questions"
  | "numbers" | "colors" | "time" | "days" | "food" | "market" | "home"
  | "clothing" | "body" | "animals" | "nature" | "directions" | "places"
  | "transport" | "verbs" | "adjectives" | "emotions" | "culture"
  | "language" | "society" | "grammar" | "concepts";

export type PhraseSituation =
  | "greetings" | "travel" | "shopping" | "restaurants" | "conversations" | "cultural";

export interface LanguageConfig {
  id: string;
  /** English name, e.g. "Kannada" */
  name: string;
  /** Product name shown in the shell for this pack, e.g. "Namma Kannada" */
  brand?: string;
  /** Region the postcard journey travels through, e.g. "Karnataka" */
  region?: string;
  /** Endonym in native script, e.g. "ಕನ್ನಡ" */
  nativeName: string;
  scriptName: string;
  /** CSS font-family stack used for every native-script string */
  fontFamily: string;
  /** Google Fonts family to load (optional) */
  webFont?: string;
  direction: "ltr" | "rtl";
  /** BCP-47 tag for speechSynthesis */
  speechLang: string;
  /** Short handwriting guidance shown on the tracing canvas */
  writingTip: string;
  /** Name of the romanisation scheme shown to learners */
  romanisation: string;
  version: string;
  /** Attribution for source material */
  sources: string[];
}

export interface Letter {
  id: string;
  script: string;
  roman: string;
  kind: "vowel" | "yogavaha" | "consonant" | "conjunct";
  /** Phonetic group, e.g. "velar" — used to build sublevels */
  group: string;
  hint: string;
  /** vocab id of an example word starting with/containing the letter */
  exampleId?: string;
}

export interface VocabEntry {
  id: string;
  script: string;
  roman: string;
  meaning: string;
  pos: PartOfSpeech;
  topic: Topic;
  /** Lesson number in the source course (difficulty signal) */
  lesson: number;
  source: "halemane" | "core" | "custom";
  /** Key into pack.art (bespoke illustration). Falls back to topic motif. */
  art?: string;
  /** Optional authored example. If absent the engine looks one up in sentences. */
  example?: { script: string; meaning: string };
  audio?: string | null;
}

export interface Phrase {
  id: string;
  situation: PhraseSituation;
  script: string;
  roman: string;
  meaning: string;
  context: string;
  level: number;
}

export interface Sentence {
  id: string;
  /** Tokens in correct order (the learner rebuilds this) */
  tokens: string[];
  roman: string;
  meaning: string;
  note?: string;
  level: number;
}

export interface Reading {
  id: string;
  title: string;
  titleScript: string;
  script: string;
  meaning: string;
  question: { prompt: string; options: string[]; answer: number; explanation: string };
}

/**
 * A level declares *what* to teach via selectors; the engine's curriculum
 * builder turns it into ≥10 sublevels × 10 exercises.
 */
export interface LevelSpec {
  number: number;
  title: string;
  titleScript: string;
  objective: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  /** What kind of practice dominates the level */
  mode: "letters" | "writing" | "vocab" | "sentences" | "mixed" | "review";
  topics?: Topic[];
  /** Inclusive range of source lessons to draw vocabulary from */
  lessons?: [number, number];
  letterKinds?: Letter["kind"][];
  situations?: PhraseSituation[];
  sentenceLevels?: [number, number];
  /** Optional hand-written sublevel titles (engine fills the rest) */
  sublevelTitles?: string[];
  postcardId: string;
}

export interface PostcardSpec {
  id: string;
  place: string;
  city: string;
  phraseScript: string;
  phraseMeaning: string;
  stampTitle: string;
  stampCode: string;
  note: string;
  /** key into pack.postcardArt */
  art: string;
  palette: { paper: string; ink: string; accent: string };
}

export type HeritageCategory = "stories" | "folk_tales" | "traditions" | "music" | "art";

export interface HeritageParagraph {
  script: string;
  roman: string;
  meaning: string;
}

export interface HeritageEntry {
  id: string;
  category: HeritageCategory;
  region: string;
  title: string;
  titleScript: string;
  titleRoman: string;
  summary: string;
  story: string;
  keyTerm: { script: string; roman: string; meaning: string };
  /** Full multi-paragraph native-script story with phonetics & English meaning */
  paragraphs?: HeritageParagraph[];
  /** Key vocabulary words highlighted & summarised at the end of the story */
  glossary?: { script: string; roman: string; meaning: string }[];
  /** Short native-script reading passage with meaning for reading comprehension */
  readingPassage?: { script: string; roman: string; meaning: string };
  references: string[];
  /** Optional key into pack.postcardArt for a visual header */
  postcardArt?: string;
}

export interface NewsFeedSpec {
  id: string;
  name: string;
  url: string;
  tagline: string;
}

export type MascotMood = "happy" | "excited" | "thinking" | "encouraging" | "proud" | "curious" | "sleepy";
export type MascotContext = "morning" | "afternoon" | "evening" | "streak" | "goal_done" | "correct" | "wrong" | "idle" | "chat_preview";

export interface MascotLine {
  id: string;
  context: MascotContext;
  mood: MascotMood;
  script: string;
  roman: string;
  meaning: string;
}

export interface MascotSpec {
  name: string;
  nameScript: string;
  role: string;
  /** Optional 3D/illustrated portrait URLs keyed by mood */
  avatars?: Partial<Record<MascotMood, string>>;
  lines: MascotLine[];
  /** Sample conversation starters shown in the upcoming Live Chat preview */
  chatStarters: { script: string; roman: string; meaning: string }[];
}

export interface LanguagePack {
  config: LanguageConfig;
  letters: Letter[];
  vocab: VocabEntry[];
  phrases: Phrase[];
  sentences: Sentence[];
  readings: Reading[];
  levels: LevelSpec[];
  postcards: PostcardSpec[];
  /** Optional cultural heritage stories, traditions, music and art references. */
  heritage?: HeritageEntry[];
  /** Optional native-script RSS news feeds for the Discover → News tab. */
  newsFeeds?: NewsFeedSpec[];
  /** Optional relatable mascot companion with greetings, expressions and chat starters. */
  mascot?: MascotSpec;
  /**
   * Bespoke SVG illustrations. Only trusted, bundled packs may supply raw SVG;
   * imported packs have this stripped (see validate.ts).
   */
  art: Record<string, string>;
  postcardArt: Record<string, string>;
  /**
   * Optional English-friendly pronunciation respelling of a romanised string, shown
   * to beginners who cannot read the script yet. Bundled packs only (not serialised).
   */
  phonetics?: (roman: string) => string;
  /** Transliterate native script to English/Latin letters (e.g. for live news feeds). */
  romanize?: (script: string) => string;
  /** Same, straight from native script (for text with no stored romanisation). */
  sayScript?: (script: string) => string;
}
