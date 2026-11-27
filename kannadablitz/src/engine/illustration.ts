import type { LanguagePack, Topic, VocabEntry } from "../content/schema";
import { hashString } from "./rng";

/**
 * Illustration resolution order:
 *   1. learner/admin override (uploaded image, stored per pack + word)
 *   2. bespoke bundled SVG (pack.art[vocab.art])
 *   3. generated motif: a consistent editorial composition derived from the
 *      word's topic, with a deterministic palette + layout variant.
 * The same resolved art is reused by flashcards, matching, daily cards, etc.
 */
export type ResolvedArt =
  | { kind: "img"; src: string; alt: string }
  | { kind: "svg"; svg: string; alt: string }
  | { kind: "motif"; topic: Topic; variant: number; hue: number; alt: string };

export interface ArtOverride { src?: string; variant?: number; updatedAt: number }
export type ArtOverrides = Record<string, Record<string, ArtOverride>>;

const KEY = "lj.art.v1";

export function loadArtOverrides(): ArtOverrides {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as ArtOverrides;
  } catch {
    return {};
  }
}

export function saveArtOverrides(o: ArtOverrides): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(o));
    return true;
  } catch {
    return false;
  }
}

/** Only data:image/* (png/jpeg/webp/gif) uploads are accepted; never SVG markup. */
export function isSafeImageSrc(src: string): boolean {
  return /^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(src);
}

export function resolveArt(v: VocabEntry, pack: LanguagePack, overrides: ArtOverrides): ResolvedArt {
  const alt = v.meaning;
  const o = overrides[pack.config.id]?.[v.id];
  if (o?.src && isSafeImageSrc(o.src)) return { kind: "img", src: o.src, alt };
  const bundled = v.art ? pack.art[v.art] : undefined;
  if (bundled && !o?.variant) {
    // Built-in packs ship SVG markup or a bundled raster URL (see packs/*/illustrations)
    return bundled.trimStart().startsWith("<") ? { kind: "svg", svg: bundled, alt } : { kind: "img", src: bundled, alt };
  }
  const h = hashString(v.id);
  return { kind: "motif", topic: v.topic, variant: ((o?.variant ?? 0) + h) % 4, hue: h % 360, alt };
}

/**
 * Art-direction prompt for an external image model. Kept with the engine so a
 * generation service can produce consistent assets from vocabulary metadata.
 */
export function artPrompt(v: VocabEntry, languageName: string): string {
  return [
    `Minimal Scandinavian flat-editorial vector illustration of "${v.meaning}" (${v.pos}, topic: ${v.topic}) for a ${languageName} vocabulary card.`,
    "Single clear rounded subject, centred, generous margin, soft pale sky-mist gradient background with a subtle oval ground shadow.",
    "Lineless flat pastel shapes (no heavy black outlines), warm terracotta coral (#E07A5F), soft butter yellow (#F2C974), eucalyptus sage (#7BB28C), slate blue (#84A7C4) and oatmeal cream (#EFE0CA).",
    "Calm modern iOS editorial aesthetic, no text or letters, culturally appropriate South Indian context, square 1:1.",
  ].join(" ");
}
