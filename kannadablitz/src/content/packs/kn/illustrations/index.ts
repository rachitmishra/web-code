// Every Kannada illustration lives in this folder, one file per picture.
//
//   <name>.svg|png|jpg|webp      word art, named after the English meaning (coffee.svg, elephant.svg)
//   postcard-<place>.svg          level postcard scenes (postcard-hampi.svg)
//   catalog.json                  every word → expected file name + art-direction description
//
// To add or replace a picture, drop a file with the catalogued name here; no code changes.
// Regenerate the catalogue with `python3 tools/illustrations/catalog.py`.
import type { VocabEntry } from "../../../schema";

const svgs = import.meta.glob<string>("./*.svg", { query: "?raw", import: "default", eager: true });
const rasters = import.meta.glob<string>("./*.{png,jpg,jpeg,webp}", { query: "?url", import: "default", eager: true });

const stem = (path: string) => path.replace(/^\.\//, "").replace(/\.[a-z]+$/, "");

/** File-name stem for a word's illustration. Must match slug() in tools/illustrations/catalog.py. */
export function illustrationName(meaning: string): string {
  const m = meaning.toLowerCase().replace(/\([^)]*\)/g, "").split(/[,;/]/)[0];
  return m.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40).replace(/-+$/, "") || "untitled";
}

/** name → SVG markup, or a bundled image URL for raster files (rasters win over SVG). */
export const KN_ART: Record<string, string> = {};
export const KN_POSTCARD_ART: Record<string, string> = {};
for (const [path, value] of [...Object.entries(svgs), ...Object.entries(rasters)]) {
  const name = stem(path);
  if (name.startsWith("postcard-")) KN_POSTCARD_ART[name.slice(9)] = value;
  else KN_ART[name] = value;
}

/** Points each word at its file: an explicit `art` alias, otherwise the file named after its meaning. */
export function attachArt(vocab: VocabEntry[]): VocabEntry[] {
  return vocab.map((v) => {
    if (v.art && KN_ART[v.art]) return v;
    const name = illustrationName(v.meaning);
    return KN_ART[name] ? { ...v, art: name } : v;
  });
}
