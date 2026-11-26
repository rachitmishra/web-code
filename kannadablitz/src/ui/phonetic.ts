import { useEngine } from "../engine/store";

/**
 * Phonetic respelling as a function, for hints placed on interactive tiles via a
 * `data-say` attribute (drawn with CSS so the tile's own text stays the native word).
 */
export function usePhonetic(): (roman?: string) => string | undefined {
  const { pack, state } = useEngine();
  return (roman) => (roman && state.settings.showPhonetics && pack.phonetics ? pack.phonetics(roman) : undefined);
}

/** Phonetic respelling for native-script text ("" when hints are off or not applicable). */
export function useSayScript(): (script?: string) => string | undefined {
  const { pack, state } = useEngine();
  return (script) => (script && state.settings.showPhonetics && pack.sayScript ? pack.sayScript(script) || undefined : undefined);
}
