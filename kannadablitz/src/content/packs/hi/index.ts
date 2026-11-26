import type { LanguagePack, Topic, VocabEntry } from "../../schema";

/**
 * A deliberately small Hindi starter pack. It exists to prove that the engine
 * and UI are language-agnostic: switching to it in Settings changes the script,
 * font, speech voice, curriculum and postcards without touching any UI code.
 */
type W = [script: string, roman: string, meaning: string, topic: Topic, pos: VocabEntry["pos"]];
const WORDS: W[] = [
  ["नमस्ते", "namaste", "hello", "greetings", "phrase"],
  ["धन्यवाद", "dhanyavaad", "thank you", "greetings", "phrase"],
  ["हाँ", "haan", "yes", "greetings", "phrase"],
  ["नहीं", "nahiin", "no", "greetings", "phrase"],
  ["मैं", "main", "I", "pronouns", "pronoun"],
  ["आप", "aap", "you (polite)", "pronouns", "pronoun"],
  ["वह", "vah", "he / she / that", "pronouns", "pronoun"],
  ["नाम", "naam", "name", "people", "noun"],
  ["दोस्त", "dost", "friend", "people", "noun"],
  ["माँ", "maan", "mother", "family", "noun"],
  ["पिता", "pitaa", "father", "family", "noun"],
  ["भाई", "bhaaii", "brother", "family", "noun"],
  ["बहन", "bahan", "sister", "family", "noun"],
  ["घर", "ghar", "house", "home", "noun"],
  ["किताब", "kitaab", "book", "language", "noun"],
  ["पानी", "paanii", "water", "food", "noun"],
  ["चाय", "chaay", "tea", "food", "noun"],
  ["खाना", "khaanaa", "food / meal", "food", "noun"],
  ["आम", "aam", "mango", "food", "noun"],
  ["एक", "ek", "one", "numbers", "number"],
  ["दो", "do", "two", "numbers", "number"],
  ["तीन", "tiin", "three", "numbers", "number"],
  ["चार", "chaar", "four", "numbers", "number"],
  ["पाँच", "paanch", "five", "numbers", "number"],
  ["लाल", "laal", "red", "colors", "adjective"],
  ["हरा", "haraa", "green", "colors", "adjective"],
  ["बड़ा", "baDaa", "big", "adjectives", "adjective"],
  ["छोटा", "chhoTaa", "small", "adjectives", "adjective"],
  ["जाना", "jaanaa", "to go", "verbs", "verb"],
  ["आना", "aanaa", "to come", "verbs", "verb"],
  ["खाना", "khaanaa ", "to eat", "verbs", "verb"],
  ["पीना", "piinaa", "to drink", "verbs", "verb"],
  ["कहाँ", "kahaan", "where", "questions", "adverb"],
  ["क्या", "kyaa", "what", "questions", "pronoun"],
  ["कौन", "kaun", "who", "questions", "pronoun"],
  ["बस", "bas", "bus", "transport", "noun"],
];

export const HINDI_PACK: LanguagePack = {
  config: {
    id: "hi",
    name: "Hindi (starter)",
    nativeName: "हिन्दी",
    region: "North India",
    scriptName: "Devanagari (देवनागरी)",
    fontFamily: '"Baloo 2", "Noto Sans Devanagari", system-ui, sans-serif',
    webFont: "Baloo 2",
    direction: "ltr",
    speechLang: "hi-IN",
    writingTip: "Draw the letter body first, then finish with the headline (शिरोरेखा) from left to right.",
    romanisation: "Simplified Hunterian",
    version: "0.2.0",
    sources: ["Starter sample, authored for demonstration"],
  },
  letters: [
    ["अ", "a", "vowel", "a"], ["आ", "aa", "vowel", "a"], ["इ", "i", "vowel", "i"], ["ई", "ii", "vowel", "i"],
    ["उ", "u", "vowel", "u"], ["ए", "e", "vowel", "e"], ["क", "ka", "consonant", "velar"], ["ख", "kha", "consonant", "velar"],
    ["ग", "ga", "consonant", "velar"], ["च", "cha", "consonant", "palatal"], ["ज", "ja", "consonant", "palatal"],
    ["त", "ta", "consonant", "dental"], ["द", "da", "consonant", "dental"], ["न", "na", "consonant", "dental"],
    ["प", "pa", "consonant", "labial"], ["म", "ma", "consonant", "labial"],
  ].map(([script, roman, kind, group]) => ({
    id: `hi.l.${roman}`, script, roman, kind: kind as "vowel" | "consonant", group, hint: `sounds like '${roman}'`,
  })),
  vocab: WORDS.map(([script, roman, meaning, topic, pos], i) => ({
    id: `hi.w${i + 1}`, script, roman: roman.trim(), meaning, topic, pos, lesson: 1 + Math.floor(i / 12), source: "core",
  })),
  phrases: [
    { id: "hi.p1", situation: "greetings", script: "आप कैसे हैं?", roman: "aap kaise hain?", meaning: "How are you?", context: "Polite, for anyone you've just met.", level: 2 },
    { id: "hi.p2", situation: "greetings", script: "आपका नाम क्या है?", roman: "aapkaa naam kyaa hai?", meaning: "What is your name?", context: "Polite introduction.", level: 2 },
    { id: "hi.p3", situation: "restaurants", script: "एक चाय दीजिए", roman: "ek chaay diijie", meaning: "One tea, please", context: "दीजिए is the polite 'give'.", level: 3 },
    { id: "hi.p4", situation: "travel", script: "बस कहाँ है?", roman: "bas kahaan hai?", meaning: "Where is the bus?", context: "Question word sits before the verb.", level: 3 },
  ],
  sentences: [
    { id: "hi.s1", tokens: ["मैं", "घर", "जाता", "हूँ"], roman: "main ghar jaataa huun", meaning: "I go home", level: 2 },
    { id: "hi.s2", tokens: ["यह", "मेरी", "किताब", "है"], roman: "yah merii kitaab hai", meaning: "This is my book", level: 2 },
    { id: "hi.s3", tokens: ["आपका", "नाम", "क्या", "है"], roman: "aapkaa naam kyaa hai", meaning: "What is your name?", level: 2 },
    { id: "hi.s4", tokens: ["मुझे", "पानी", "चाहिए"], roman: "mujhe paanii chaahie", meaning: "I need water", level: 3 },
  ],
  readings: [],
  levels: [
    { number: 1, title: "Script Basics", titleScript: "अक्षर", objective: "Recognise core vowels and consonants.", difficulty: 1, mode: "letters", letterKinds: ["vowel", "consonant"], postcardId: "hi.pc.1" },
    { number: 2, title: "First Words", titleScript: "पहले शब्द", objective: "Greetings, people and family.", difficulty: 1, mode: "vocab", topics: ["greetings", "pronouns", "people", "family", "home", "language"], situations: ["greetings"], sentenceLevels: [2, 2], postcardId: "hi.pc.2" },
    { number: 3, title: "Out and About", titleScript: "बाहर", objective: "Food, numbers, travel and simple questions.", difficulty: 2, mode: "mixed", topics: ["food", "numbers", "colors", "verbs", "questions", "transport", "adjectives"], situations: ["restaurants", "travel"], sentenceLevels: [2, 3], postcardId: "hi.pc.3" },
  ],
  postcards: [
    { id: "hi.pc.1", place: "India Gate", city: "Delhi", phraseScript: "स्वागत है", phraseMeaning: "Welcome", stampTitle: "Gate Arch", stampCode: "DEL-01", note: "Your first letters are on the page.", art: "", palette: { paper: "#fff7e6", ink: "#3b1214", accent: "#c8102e" } },
    { id: "hi.pc.2", place: "Ghats", city: "Varanasi", phraseScript: "नमस्ते दोस्त", phraseMeaning: "Hello friend", stampTitle: "River Lamp", stampCode: "VNS-02", note: "Now you can greet anyone you meet.", art: "", palette: { paper: "#FDF0DC", ink: "#3b1214", accent: "#f2b705" } },
    { id: "hi.pc.3", place: "Hawa Mahal", city: "Jaipur", phraseScript: "चलो चलें", phraseMeaning: "Let's go", stampTitle: "Pink Window", stampCode: "JAI-03", note: "Starter pack complete. The engine is ready for more.", art: "", palette: { paper: "#FCE7EF", ink: "#3b1214", accent: "#BE185D" } },
  ],
  art: {},
  postcardArt: {},
};
