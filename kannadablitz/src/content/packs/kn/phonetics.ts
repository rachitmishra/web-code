// Simplified, readable English phonetics for Kannada, derived from Halemane romanisation.
//   baaLehaNNu → "baalehannu"   namaskaara → "namaskaara"   sangiita → "sangeeta"
// Folds retroflex capitals into plain letters and uses familiar English vowel spellings
// (aa, ee, oo) without cluttering words with syllable hyphens.

const MAP: [string, string][] = [
  ["aa", "aa"],
  ["ii", "ee"],
  ["uu", "oo"],
  ["ee", "e"],
  ["oo", "o"],
  ["ai", "ai"],
  ["au", "au"],
  ["chh", "ch"],
  ["ch", "ch"],
  ["kh", "kh"],
  ["gh", "gh"],
  ["jh", "jh"],
  ["Th", "th"],
  ["Dh", "dh"],
  ["th", "th"],
  ["dh", "dh"],
  ["ph", "ph"],
  ["bh", "bh"],
  ["sh", "sh"],
  ["Sh", "sh"],
  ["c", "ch"],
  ["T", "t"],
  ["D", "d"],
  ["N", "n"],
  ["L", "l"],
  ["S", "sh"],
  ["M", "m"],
  ["H", "h"],
  ["R", "ru"],
  ["ñ", "ny"],
];

function simplifyWord(word: string): string {
  let out = "";
  let i = 0;
  outer: while (i < word.length) {
    for (const [k, s] of MAP) {
      if (word.startsWith(k, i)) {
        out += s;
        i += k.length;
        continue outer;
      }
    }
    out += word[i].toLowerCase();
    i++;
  }
  return out;
}

/** "nanna hesaru Ravi." → "nanna hesaru ravi." */
export function knPhonetic(roman: string): string {
  return roman.replace(/[A-Za-zñ]+/g, (w) => simplifyWord(w));
}
