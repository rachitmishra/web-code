import type { LanguagePack } from "./schema";

export interface ValidationReport {
  ok: boolean;
  errors: string[];
  warnings: string[];
  stats: Record<string, number>;
}

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** Structural + referential validation of a language pack. */
export function validatePack(candidate: unknown): ValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!isObj(candidate)) {
    return { ok: false, errors: ["Pack must be a JSON object."], warnings, stats: {} };
  }
  const p = candidate as Partial<LanguagePack>;
  const c = p.config as Partial<LanguagePack["config"]> | undefined;
  if (!c || !c.id || !c.name || !c.nativeName) errors.push("config.id, config.name and config.nativeName are required.");
  if (c?.id && !/^[a-z]{2,8}(-[a-z0-9]+)?$/i.test(c.id)) errors.push(`config.id "${c.id}" must be a short language code.`);

  const arrays = ["letters", "vocab", "phrases", "sentences", "levels", "postcards"] as const;
  for (const key of arrays) {
    if (!Array.isArray(p[key])) errors.push(`"${key}" must be an array.`);
  }
  if (errors.length) return { ok: false, errors, warnings, stats: {} };

  const pack = p as LanguagePack;
  const dupes = (label: string, ids: string[]) => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (!id) errors.push(`${label}: an entry is missing its id.`);
      else if (seen.has(id)) errors.push(`${label}: duplicate id "${id}".`);
      seen.add(id);
    }
  };
  dupes("vocab", pack.vocab.map((v) => v.id));
  dupes("letters", pack.letters.map((l) => l.id));
  dupes("phrases", pack.phrases.map((x) => x.id));
  dupes("sentences", pack.sentences.map((x) => x.id));
  dupes("postcards", pack.postcards.map((x) => x.id));

  pack.vocab.forEach((v) => {
    if (!v.script || !v.meaning) errors.push(`vocab "${v.id}" needs script and meaning.`);
    if (!v.roman) warnings.push(`vocab "${v.id}" has no romanisation.`);
  });
  pack.sentences.forEach((s) => {
    if (!Array.isArray(s.tokens) || s.tokens.length < 2) errors.push(`sentence "${s.id}" needs at least 2 tokens.`);
  });
  const postcardIds = new Set(pack.postcards.map((x) => x.id));
  const levelNumbers = new Set<number>();
  pack.levels.forEach((l) => {
    if (levelNumbers.has(l.number)) errors.push(`level ${l.number} is defined twice.`);
    levelNumbers.add(l.number);
    if (!postcardIds.has(l.postcardId)) warnings.push(`level ${l.number} references missing postcard "${l.postcardId}".`);
  });
  if (pack.vocab.length < 4) errors.push("At least 4 vocabulary entries are needed for matching exercises.");
  if (pack.levels.length === 0) errors.push("At least one level is required.");

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    stats: {
      letters: pack.letters.length,
      vocab: pack.vocab.length,
      phrases: pack.phrases.length,
      sentences: pack.sentences.length,
      levels: pack.levels.length,
      postcards: pack.postcards.length,
    },
  };
}

/**
 * Imported packs are untrusted: raw SVG strings would be injected as markup,
 * so they are dropped. Imported packs use the engine's generated motifs or
 * learner-uploaded images (rendered via <img>, never as HTML).
 */
export function sanitizeImportedPack(pack: LanguagePack): LanguagePack {
  return {
    ...pack,
    readings: Array.isArray(pack.readings) ? pack.readings : [],
    art: {},
    postcardArt: {},
    vocab: pack.vocab.map((v) => ({ ...v, source: "custom", art: undefined })),
  };
}
