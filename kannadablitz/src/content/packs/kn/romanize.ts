// Kannada script → Halemane romanisation (the book's scheme), ported from
// tools/pdf-extract/translit.py. Used to give phonetics to any Kannada text that has
// no curated romanisation (example sentences, titles, postcards, readings).

const KV: Record<string, string> = { "ಅ": "a", "ಆ": "aa", "ಇ": "i", "ಈ": "ii", "ಉ": "u", "ಊ": "uu", "ಋ": "ru", "ಎ": "e", "ಏ": "ee", "ಐ": "ai", "ಒ": "o", "ಓ": "oo", "ಔ": "au" };
const KM: Record<string, string> = { "ಾ": "aa", "ಿ": "i", "ೀ": "ii", "ು": "u", "ೂ": "uu", "ೃ": "ru", "ೆ": "e", "ೇ": "ee", "ೈ": "ai", "ೊ": "o", "ೋ": "oo", "ೌ": "au" };
const KC: Record<string, string> = {
  "ಕ": "k", "ಖ": "kh", "ಗ": "g", "ಘ": "gh", "ಙ": "n", "ಚ": "c", "ಛ": "ch", "ಜ": "j", "ಝ": "jh", "ಞ": "ñ",
  "ಟ": "T", "ಠ": "Th", "ಡ": "D", "ಢ": "Dh", "ಣ": "N", "ತ": "t", "ಥ": "th", "ದ": "d", "ಧ": "dh", "ನ": "n",
  "ಪ": "p", "ಫ": "ph", "ಬ": "b", "ಭ": "bh", "ಮ": "m", "ಯ": "y", "ರ": "r", "ಲ": "l", "ವ": "v",
  "ಶ": "sh", "ಷ": "Sh", "ಸ": "s", "ಹ": "h", "ಳ": "L", "ೞ": "L", "ಱ": "r",
};
/** anusvara takes the nasal of the following consonant's class */
const NAS: Record<string, string> = { k: "n", g: "n", c: "n", j: "n", T: "N", D: "N", t: "n", d: "n", p: "m", b: "m", m: "m" };
const DIGITS = "೦೧೨೩೪೫೬೭೮೯";

export function knToRoman(text: string): string {
  const ch = [...text.normalize("NFC").replace(/[‌‍]/g, "")];
  let out = "";
  for (let i = 0; i < ch.length; i++) {
    const c = ch[i], n = ch[i + 1] ?? "";
    if (KC[c]) {
      out += KC[c];
      if (n === "್") { i++; continue; }
      if (KM[n]) { out += KM[n]; i++; continue; }
      out += "a";
      continue;
    }
    if (KV[c]) { out += KV[c]; continue; }
    if (c === "ಂ") { out += NAS[(KC[n] ?? "")[0] ?? ""] ?? "m"; continue; }
    if (c === "ಃ") { out += "h"; continue; }
    const d = DIGITS.indexOf(c);
    out += d >= 0 ? String(d) : c;
  }
  return out;
}

/** True if the string contains Kannada letters. */
export const hasKannada = (s: string) => /[ಀ-೿]/.test(s);
