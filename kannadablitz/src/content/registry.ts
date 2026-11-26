import type { LanguagePack } from "./schema";
import { KANNADA_PACK } from "./packs/kn";
import { HINDI_PACK } from "./packs/hi";
import { sanitizeImportedPack, validatePack, type ValidationReport } from "./validate";

const CUSTOM_KEY = "lj.packs.v1";

export const BUILTIN_PACKS: Record<string, LanguagePack> = {
  [KANNADA_PACK.config.id]: KANNADA_PACK,
  [HINDI_PACK.config.id]: HINDI_PACK,
};

export const DEFAULT_PACK_ID = KANNADA_PACK.config.id;

function readCustom(): Record<string, LanguagePack> {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const out: Record<string, LanguagePack> = {};
    for (const [id, pkg] of Object.entries(parsed)) {
      if (validatePack(pkg).ok) out[id] = sanitizeImportedPack(pkg as LanguagePack);
    }
    return out;
  } catch {
    return {};
  }
}

export function listPacks(): Record<string, LanguagePack> {
  return { ...BUILTIN_PACKS, ...readCustom() };
}

export function getPack(id: string): LanguagePack {
  return listPacks()[id] ?? BUILTIN_PACKS[DEFAULT_PACK_ID];
}

export function isBuiltin(id: string): boolean {
  return id in BUILTIN_PACKS;
}

/** Validate + persist an imported pack. Built-in ids cannot be overwritten. */
export function importPack(json: string): ValidationReport & { id?: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, errors: ["That file is not valid JSON."], warnings: [], stats: {} };
  }
  const report = validatePack(parsed);
  if (!report.ok) return report;
  const pack = sanitizeImportedPack(parsed as LanguagePack);
  if (isBuiltin(pack.config.id)) {
    return { ...report, ok: false, errors: [`"${pack.config.id}" is a built-in pack id. Choose another id.`] };
  }
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    const all = raw ? (JSON.parse(raw) as Record<string, LanguagePack>) : {};
    all[pack.config.id] = pack;
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(all));
  } catch {
    return { ...report, ok: false, errors: ["Could not save the pack (storage full or blocked)."] };
  }
  return { ...report, id: pack.config.id };
}

export function removePack(id: string): void {
  if (isBuiltin(id)) return;
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    if (!raw) return;
    const all = JSON.parse(raw) as Record<string, LanguagePack>;
    delete all[id];
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}

/** Export a pack as JSON (art stripped for portability). */
export function exportPack(pack: LanguagePack): string {
  return JSON.stringify({ ...pack, art: {}, postcardArt: {} }, null, 2);
}
