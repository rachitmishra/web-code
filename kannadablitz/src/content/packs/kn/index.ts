import type { LanguagePack, VocabEntry } from "../../schema";
import vocab from "./vocab.json";
import { KN_LETTERS } from "./letters";
import { KN_PHRASES } from "./phrases";
import { KN_SENTENCES } from "./sentences";
import { KN_READINGS } from "./readings";
import { KN_LEVELS } from "./levels";
import { knPhonetic } from "./phonetics";
import { hasKannada, knToRoman } from "./romanize";
import { KN_POSTCARDS } from "./postcards";
import { KN_HERITAGE, KN_NEWS_FEEDS } from "./heritage";
import { KN_MASCOT } from "./mascot";
import { KN_ART, KN_POSTCARD_ART, attachArt } from "./illustrations";

export const KANNADA_PACK: LanguagePack = {
  config: {
    id: "kn",
    name: "Kannada",
    brand: "Namma Kannada",
    region: "Karnataka",
    nativeName: "ಕನ್ನಡ",
    scriptName: "Kannada script (ಕನ್ನಡ ಲಿಪಿ)",
    fontFamily: '"Baloo Tamma 2", "Noto Sans Kannada", "Tunga", system-ui, sans-serif',
    webFont: "Baloo Tamma 2",
    direction: "ltr",
    speechLang: "kn-IN",
    writingTip:
      "Most Kannada strokes run anti-clockwise. Start at the bottom-left of the loop and sweep upward for the rounded, pearl-like shape (ಮುತ್ತಿನಂಥ ಅಕ್ಷರ).",
    romanisation: "Halemane scheme: doubled vowels are long (aa, ii), capitals are retroflex (T, D, N, L)",
    version: "3.0.0",
    sources: [
      "Lingadevaru Halemane, Kannada: A Self Instructional Course, Kannada Development Authority, Govt. of Karnataka (3rd ed., 2012)",
    ],
  },
  letters: KN_LETTERS,
  vocab: attachArt(vocab as VocabEntry[]),
  phrases: KN_PHRASES,
  sentences: KN_SENTENCES,
  readings: KN_READINGS,
  levels: KN_LEVELS,
  postcards: KN_POSTCARDS,
  heritage: KN_HERITAGE,
  newsFeeds: KN_NEWS_FEEDS,
  mascot: KN_MASCOT,
  art: KN_ART,
  postcardArt: KN_POSTCARD_ART,
  phonetics: knPhonetic,
  romanize: (script) => (hasKannada(script) ? knToRoman(script) : ""),
  sayScript: (script) => (hasKannada(script) ? knPhonetic(knToRoman(script)) : ""),
};
