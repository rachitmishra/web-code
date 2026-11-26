// Kannada phonetics using Lingadevaru Halemane's book scheme
// ("Kannada: A Self Instructional Course"):
//   - Doubled vowels are long: a/aa, i/ii, u/uu, e/ee, o/oo, ai, au, ru
//   - Capital letters are retroflex: T, Th, D, Dh, N, L, Sh (vs dental t, th, d, dh, n, l, s)
//   - Palatal c / ch / j / jh / ñ / sh preserved as in the book

export function knPhonetic(roman: string): string {
  return roman
    .replace(/R/g, "ru")
    .replace(/S(?!h)/g, "sh")
    .replace(/J/g, "j")
    .replace(/w/g, "v")
    .trim();
}
