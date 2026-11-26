/**
 * Text-to-speech via the Web Speech API.
 *
 * Pitfalls this handles:
 * - getVoices() is empty until the async `voiceschanged` event fires (Chrome, Android).
 * - Voice tags vary: "kn-IN", "kn_IN", "kn".
 * - Chrome drops an utterance queued in the same tick as cancel(), and can get stuck "paused".
 * - Utterances that get garbage-collected stop firing events (kept in `current`).
 * - Most devices have no voice for the target language. Then we read a phonetic respelling
 *   with an English (preferably Indian English) voice instead of failing silently.
 */
export type SpeakResult = "native" | "fallback" | "none";

let cachedVoices: SpeechSynthesisVoice[] = [];
/** Held so the active utterance isn't garbage-collected mid-speech (Chrome bug). */
export let current: SpeechSynthesisUtterance | null = null;

const synth = (): SpeechSynthesis | null =>
  typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : null;

const norm = (lang: string) => lang.toLowerCase().replace("_", "-");

function loadVoices(timeout = 1500): Promise<SpeechSynthesisVoice[]> {
  const s = synth();
  if (!s) return Promise.resolve([]);
  const now = s.getVoices();
  if (now.length) return Promise.resolve((cachedVoices = now));
  return new Promise((resolve) => {
    const done = () => {
      s.removeEventListener?.("voiceschanged", done);
      resolve((cachedVoices = s.getVoices()));
    };
    s.addEventListener?.("voiceschanged", done);
    setTimeout(done, timeout);
  });
}

function findVoice(voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | undefined {
  const want = norm(lang);
  const base = want.split("-")[0];
  return (
    voices.find((v) => norm(v.lang) === want) ??
    voices.find((v) => norm(v.lang).split("-")[0] === base)
  );
}

export function canSpeak(lang: string): boolean {
  const s = synth();
  if (!s) return false;
  if (!cachedVoices.length) cachedVoices = s.getVoices();
  return !!findVoice(cachedVoices, lang);
}

/** Speak one utterance; resolves true once audio starts, false on error / no start. */
function utter(text: string, lang: string, voice: SpeechSynthesisVoice | undefined, rate: number): Promise<boolean> {
  const s = synth()!;
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = voice?.lang ?? lang;
    if (voice) u.voice = voice;
    u.rate = rate;
    let settled = false;
    const finish = (ok: boolean) => { if (!settled) { settled = true; resolve(ok); } };
    u.onstart = () => finish(true);
    u.onend = () => finish(true);
    u.onerror = (e) => finish((e as SpeechSynthesisErrorEvent).error === "interrupted");
    current = u;
    s.speak(u);
    if (s.paused) s.resume();
    // Some engines never fire onstart; if it is speaking, that counts.
    setTimeout(() => finish(s.speaking), 1800);
  });
}

export async function speak(text: string, lang: string, opts: { rate?: number; fallbackText?: string } = {}): Promise<SpeakResult> {
  const s = synth();
  if (!s) return "none";
  const rate = opts.rate ?? 0.85;
  try {
    // iOS only allows speech started synchronously inside the tap, so avoid awaiting
    // anything when the voices are already known and nothing needs cancelling.
    const busy = s.speaking || s.pending;
    if (busy) s.cancel();
    const known = s.getVoices();
    const voices = known.length ? (cachedVoices = known) : await loadVoices();
    if (busy) await new Promise((r) => setTimeout(r, 40)); // let cancel() settle (Chrome)
    const native = findVoice(voices, lang);
    // Speak natively if a voice exists, or if the list is empty (some Android builds
    // hide voices but still synthesise by language tag).
    if (native || !voices.length) {
      if (await utter(text, lang, native, rate)) return "native";
    }
    if (opts.fallbackText) {
      const en = findVoice(voices, "en-IN") ?? findVoice(voices, "en-GB") ?? findVoice(voices, "en");
      if (await utter(opts.fallbackText, en?.lang ?? "en-IN", en, rate * 0.95)) return "fallback";
    }
    return "none";
  } catch {
    return "none";
  }
}

// Warm the voice list early so the first tap is fast.
if (synth()) void loadVoices();
