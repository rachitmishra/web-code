import type { Letter } from "../../schema";

type Row = [script: string, roman: string, hint: string];

const make = (kind: Letter["kind"], group: string, rows: Row[]): Letter[] =>
  rows.map(([script, roman, hint]) => ({
    id: `kn.l.${roman.replace(/[^a-zA-Z]/g, "") || "x"}${kind === "conjunct" ? "_c" : kind === "combo" ? "_k" : ""}`,
    script,
    roman,
    kind,
    group,
    hint,
  }));

// Source: Halemane, "Kannada: A Self Instructional Course", Part II (Kannada Script)
export const KN_LETTERS: Letter[] = [
  ...make("vowel", "short-long a i", [
    ["ಅ", "a", "short 'u' as in cup"],
    ["ಆ", "aa", "long 'a' as in father"],
    ["ಇ", "i", "short 'i' as in kit"],
    ["ಈ", "ii", "long 'ee' as in keep"],
  ]),
  ...make("vowel", "u uu ru", [
    ["ಉ", "u", "short 'u' as in put"],
    ["ಊ", "uu", "long 'oo' as in moon"],
    ["ಋ", "ru", "'ru' as in rishi (Sanskrit loans)"],
  ]),
  ...make("vowel", "e ee ai", [
    ["ಎ", "e", "short 'e' as in egg"],
    ["ಏ", "ee", "long 'ay' as in make"],
    ["ಐ", "ai", "'ai' as in island"],
  ]),
  ...make("vowel", "o oo au", [
    ["ಒ", "o", "short 'o' as in omit"],
    ["ಓ", "oo", "long 'oa' as in coat"],
    ["ಔ", "au", "'ow' as in owl"],
  ]),
  ...make("yogavaha", "yogavaha", [
    ["ಅಂ", "am", "anusvara — a nasal hum after the vowel"],
    ["ಅಃ", "ah", "visarga — a soft breath after the vowel"],
  ]),
  ...make("consonant", "velar", [
    ["ಕ", "ka", "'k' as in king"],
    ["ಖ", "kha", "breathy 'kh'"],
    ["ಗ", "ga", "'g' as in get"],
    ["ಘ", "gha", "breathy 'gh'"],
    ["ಙ", "nga", "'ng' as in sing (rare)"],
  ]),
  ...make("consonant", "palatal", [
    ["ಚ", "ca", "'ch' as in church"],
    ["ಛ", "cha", "breathy 'chh'"],
    ["ಜ", "ja", "'j' as in judge"],
    ["ಝ", "jha", "breathy 'jh'"],
    ["ಞ", "nya", "'ny' as in señor (rare)"],
  ]),
  ...make("consonant", "retroflex", [
    ["ಟ", "Ta", "'t' with tongue curled back"],
    ["ಠ", "Tha", "breathy retroflex 'th'"],
    ["ಡ", "Da", "'d' with tongue curled back"],
    ["ಢ", "Dha", "breathy retroflex 'dh'"],
    ["ಣ", "Na", "'n' with tongue curled back"],
  ]),
  ...make("consonant", "dental", [
    ["ತ", "ta", "soft 't', tongue on the teeth"],
    ["ಥ", "tha", "breathy dental 'th'"],
    ["ದ", "da", "soft 'd' as in 'this'"],
    ["ಧ", "dha", "breathy dental 'dh'"],
    ["ನ", "na", "'n' as in number"],
  ]),
  ...make("consonant", "labial", [
    ["ಪ", "pa", "'p' as in people"],
    ["ಫ", "pha", "breathy 'ph'"],
    ["ಬ", "ba", "'b' as in but"],
    ["ಭ", "bha", "breathy 'bh'"],
    ["ಮ", "ma", "'m' as in mail"],
  ]),
  ...make("consonant", "approximant", [
    ["ಯ", "ya", "'y' as in young"],
    ["ರ", "ra", "tapped 'r'"],
    ["ಲ", "la", "'l' as in live"],
    ["ವ", "va", "between 'v' and 'w'"],
  ]),
  ...make("consonant", "sibilant", [
    ["ಶ", "sha", "'sh' as in shave"],
    ["ಷ", "Sha", "retroflex 'sh'"],
    ["ಸ", "sa", "'s' as in small"],
    ["ಹ", "ha", "'h' as in hall"],
    ["ಳ", "La", "'l' with tongue curled back"],
  ]),
  ...make("conjunct", "ottakshara", [
    ["ಕ್ಕ", "kka", "doubled k — ಅಕ್ಕ (elder sister)"],
    ["ಣ್ಣ", "NNa", "doubled retroflex n — ಅಣ್ಣ"],
    ["ತ್ತ", "tta", "doubled t — ಹತ್ತು (ten)"],
    ["ನ್ನ", "nna", "doubled n — ಕನ್ನಡ"],
    ["ಪ್ಪ", "ppa", "doubled p — ಉಪ್ಪು (salt)"],
    ["ಲ್ಲ", "lla", "doubled l — ಎಲ್ಲಿ (where)"],
    ["ಸ್ತ", "sta", "s + t — ಪುಸ್ತಕ (book)"],
    ["ಕ್ಷ", "kSha", "k + Sh — ಪರೀಕ್ಷೆ (exam)"],
    ["ಜ್ಞ", "jña", "j + ñ — ವಿಜ್ಞಾನ (science)"],
    ["ರ್ಯ", "rya", "arkavattu — ಕಾರ್ಯ (work)"],
  ]),
  ...make("combo", "kagunita", [
    ["ಕಾ", "kaa", "ಕ + ಆ = ಕಾ — ಕಾಡು (forest)"],
    ["ಕಿ", "ki", "ಕ + ಇ = ಕಿ — ಕಿಟಕಿ (window)"],
    ["ಕೀ", "kii", "ಕ + ಈ = ಕೀ — ಕೀಲಿ (key)"],
    ["ಕು", "ku", "ಕ + ಉ = ಕು — ಕುರಿ (sheep)"],
    ["ಕೂ", "kuu", "ಕ + ಊ = ಕೂ — ಕೂದಲು (hair)"],
    ["ಕೆ", "ke", "ಕ + ಎ = ಕೆ — ಕೆರೆ (lake)"],
    ["ಕೇ", "kee", "ಕ + ಏ = ಕೇ — ಕೇಳು (listen)"],
    ["ಕೈ", "kai", "ಕ + ಐ = ಕೈ — ಕೈ (hand)"],
    ["ಕೊ", "ko", "ಕ + ಒ = ಕೊ — ಕೊಡು (give)"],
    ["ಕೋ", "koo", "ಕ + ಓ = ಕೋ — ಕೋಟೆ (fort)"],
    ["ಕೌ", "kau", "ಕ + ಔ = ಕೌ — ಕೌಶಲ್ಯ (skill)"],
    ["ಕಂ", "kam", "ಕ + ಅಂ = ಕಂ — ಕಂಬ (pillar)"],
    ["ಗಾ", "gaa", "ಗ + ಆ = ಗಾ — ಗಾಳಿ (wind)"],
    ["ಗಿ", "gi", "ಗ + ಇ = ಗಿ — ಗಿಡ (plant)"],
    ["ಗು", "gu", "ಗ + ಉ = ಗು — ಗುಡಿ (temple)"],
    ["ನಾ", "naa", "ನ + ಆ = ನಾ — ನಾನು (I)"],
    ["ನೀ", "nii", "ನ + ಈ = ನೀ — ನೀರು (water)"],
    ["ನೆ", "ne", "ನ + ಎ = ನೆ — ನೆಲ (ground)"],
    ["ಮಾ", "maa", "ಮ + ಆ = ಮಾ — ಮಾತು (word)"],
    ["ಮೇ", "mee", "ಮ + ಏ = ಮೇ — ಮೇಲೆ (above)"],
    ["ರಾ", "raa", "ರ + ಆ = ರಾ — ರಾತ್ರಿ (night)"],
    ["ಬಾ", "baa", "ಬ + ಆ = ಬಾ — ಬಾಳೆ (banana)"],
    ["ಸಾ", "saa", "ಸ + ಆ = ಸಾ — ಸಾರು (rasam)"],
    ["ಹಾ", "haa", "ಹ + ಆ = ಹಾ — ಹಾಲು (milk)"],
  ]),
];
