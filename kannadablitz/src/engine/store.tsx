import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { LanguagePack, VocabEntry } from "../content/schema";
import { DEFAULT_PACK_ID, getPack, importPack, listPacks, removePack } from "../content/registry";
import type { ValidationReport } from "../content/validate";
import { buildCurriculum } from "./curriculum";
import { indexPack, type PackIndex } from "./exercises";
import {
  applyAnswer, applyFastMatch, applySessionComplete, hydrate, initialState, nextSublevel, packOf, regenLives,
  restoreLife, revealDailyWord, switchPack, toggleSaved, type AnswerInput, type AppState, type PackProgress,
} from "./progress";
import type { Curriculum, RewardEvent, SessionResult, Sublevel } from "./types";
import { dayKey } from "./date";
import { hashString } from "./rng";
import { loadArtOverrides, resolveArt, saveArtOverrides, type ArtOverrides, type ResolvedArt } from "./illustration";
import { generateSyncTag, loadSyncMeta, normalizeSyncTag, pullCloudState, pushCloudState, saveSyncMeta } from "./sync";

const STATE_KEY = "lj.state.v3";

export type SyncStatus = "idle" | "syncing" | "synced" | "error";

export interface SyncController {
  tag: string | null;
  status: SyncStatus;
  lastSyncedAt: number | null;
  error: string | null;
  enable: () => Promise<{ ok: boolean; tag?: string; error?: string }>;
  syncNow: () => Promise<{ ok: boolean; error?: string }>;
  restore: (tagInput: string) => Promise<{ ok: boolean; tag?: string; error?: string }>;
  disconnect: () => void;
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    return hydrate(raw ? JSON.parse(raw) : null, DEFAULT_PACK_ID);
  } catch {
    return initialState(DEFAULT_PACK_ID);
  }
}

export interface Engine {
  state: AppState;
  pack: LanguagePack;
  packs: Record<string, LanguagePack>;
  ix: PackIndex;
  curriculum: Curriculum;
  progress: PackProgress;
  next: Sublevel | null;
  dailyWord: VocabEntry;
  rewards: RewardEvent[];
  art: (v: VocabEntry) => ResolvedArt;
  artOverrides: ArtOverrides;
  setArtOverride: (vocabId: string, patch: { src?: string | null; variant?: number }) => void;
  dismissReward: () => void;
  answer: (a: AnswerInput) => void;
  completeSession: (r: SessionResult) => RewardEvent[];
  fastMatchDone: (r: Parameters<typeof applyFastMatch>[2]) => { newBest: boolean };
  update: (fn: (s: AppState) => AppState) => void;
  saveWord: (id: string) => void;
  revealDaily: () => void;
  recoverLife: (cost?: number) => void;
  selectPack: (id: string) => void;
  importPackJson: (json: string) => ValidationReport & { id?: string };
  deletePack: (id: string) => void;
  reset: () => void;
  sync: SyncController;
}

const Ctx = createContext<Engine | null>(null);

export function EngineProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(load);
  const [packsVersion, setPacksVersion] = useState(0);
  const [rewards, setRewards] = useState<RewardEvent[]>([]);
  const [artOverrides, setArtOverrides] = useState<ArtOverrides>(loadArtOverrides);
  const initialSync = useMemo(() => loadSyncMeta(), []);
  const [syncTag, setSyncTag] = useState<string | null>(() => initialSync?.tag ?? state.learner.syncTag ?? null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() => (initialSync?.lastSyncedAt ? "synced" : "idle"));
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(() => initialSync?.lastSyncedAt ?? null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const skipNextAutoPush = useRef(true);
  const stateRef = useRef(state);
  stateRef.current = state;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const packs = useMemo(() => listPacks(), [packsVersion]);
  const pack = useMemo(() => packs[state.activePack] ?? getPack(state.activePack), [packs, state.activePack]);
  const curriculum = useMemo(() => buildCurriculum(pack), [pack]);
  const ix = useMemo(() => indexPack(pack), [pack]);
  const progress = packOf(state);
  const next = useMemo(() => nextSublevel(curriculum, progress), [curriculum, progress]);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STATE_KEY, JSON.stringify(state));
      } catch {
        /* storage full / private mode */
      }
    }, 150);
    return () => clearTimeout(t);
  }, [state]);

  // Debounced background push to Firebase when Cloud Sync is enabled.
  useEffect(() => {
    if (!syncTag || import.meta.env.MODE === "test") return;
    if (skipNextAutoPush.current) {
      skipNextAutoPush.current = false;
      return;
    }
    const t = setTimeout(() => {
      setSyncStatus("syncing");
      void pushCloudState(syncTag, stateRef.current)
        .then(({ tag, updatedAt }) => {
          setSyncStatus("synced");
          setLastSyncedAt(updatedAt);
          setSyncError(null);
          saveSyncMeta({ tag, lastSyncedAt: updatedAt });
        })
        .catch((err) => {
          setSyncStatus("error");
          setSyncError(err instanceof Error ? err.message : "Could not sync to cloud.");
        });
    }, 2200);
    return () => clearTimeout(t);
  }, [state, syncTag]);

  useEffect(() => {
    const id = setInterval(() => setState((s) => regenLives(s, Date.now())), 30000);
    setState((s) => regenLives(s, Date.now()));
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--native-font", pack.config.fontFamily);
    document.documentElement.lang = "en";
    if (pack.config.webFont) {
      const id = `font-${pack.config.id}`;
      if (!document.getElementById(id)) {
        const link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(pack.config.webFont)}:wght@400;500;600;700;800&display=swap`;
        document.head.appendChild(link);
      }
    }
  }, [pack]);

  const today = dayKey();
  const dailyWord = useMemo(() => {
    // Draw from words the learner has reached (or Level 4–6 words for beginners).
    const reached = curriculum.levels.filter((l) => l.number <= Math.max(6, (next?.levelNumber ?? 1) + 1));
    const ids = new Set(reached.flatMap((l) => l.vocabIds));
    const pool = pack.vocab.filter((v) => ids.has(v.id) && v.pos !== "phrase" && !v.script.includes(" "));
    const withArt = pool.filter((v) => v.art);
    const src = (hashString(today) % 3 === 0 && withArt.length ? withArt : pool.length ? pool : pack.vocab);
    return src[hashString(`${pack.config.id}:${today}`) % src.length];
  }, [curriculum, pack, next?.levelNumber, today]);

  const run = useCallback((fn: (s: AppState) => { state: AppState; events: RewardEvent[] }) => {
    const res = fn(stateRef.current);
    stateRef.current = res.state;
    setState(res.state);
    if (res.events.length) setRewards((r) => [...r, ...res.events]);
    return res.events;
  }, []);

  const update = useCallback((fn: (s: AppState) => AppState) => {
    const s = fn(stateRef.current);
    stateRef.current = s;
    setState(s);
  }, []);

  const engine: Engine = {
    state,
    pack,
    packs,
    ix,
    curriculum,
    progress,
    next,
    dailyWord,
    rewards,
    artOverrides,
    art: (v) => resolveArt(v, pack, artOverrides),
    setArtOverride: (vocabId, patch) => {
      setArtOverrides((o) => {
        const forPack = { ...(o[pack.config.id] ?? {}) };
        const cur = forPack[vocabId] ?? { updatedAt: Date.now() };
        const nextO = { ...cur, ...patch, src: patch.src === null ? undefined : patch.src ?? cur.src, updatedAt: Date.now() };
        forPack[vocabId] = nextO;
        const all = { ...o, [pack.config.id]: forPack };
        saveArtOverrides(all);
        return all;
      });
    },
    dismissReward: () => setRewards((r) => r.slice(1)),
    answer: (a) => void run((s) => applyAnswer(s, a, Date.now())),
    completeSession: (r) => run((s) => applySessionComplete(s, curriculum, r, Date.now())),
    fastMatchDone: (r) => {
      let newBest = false;
      run((s) => {
        const res = applyFastMatch(s, curriculum, r, Date.now());
        newBest = res.newBest;
        return res;
      });
      return { newBest };
    },
    update,
    saveWord: (id) => update((s) => toggleSaved(s, id)),
    revealDaily: () => update((s) => revealDailyWord(s, dailyWord.id, Date.now())),
    recoverLife: (cost = 0) => update((s) => restoreLife(s, cost)),
    selectPack: (id) => update((s) => switchPack(s, id)),
    importPackJson: (json) => {
      const res = importPack(json);
      if (res.ok) setPacksVersion((v) => v + 1);
      return res;
    },
    deletePack: (id) => {
      removePack(id);
      setPacksVersion((v) => v + 1);
      update((s) => (s.activePack === id ? switchPack(s, DEFAULT_PACK_ID) : s));
    },
    reset: () => {
      const fresh = initialState(DEFAULT_PACK_ID);
      stateRef.current = fresh;
      setState(fresh);
      setRewards([]);
      setSyncTag(null);
      setSyncStatus("idle");
      setLastSyncedAt(null);
      setSyncError(null);
      saveSyncMeta(null);
    },
    sync: {
      tag: syncTag,
      status: syncStatus,
      lastSyncedAt,
      error: syncError,
      enable: async () => {
        const tag = syncTag ?? generateSyncTag(stateRef.current.learner.name);
        setSyncStatus("syncing");
        setSyncError(null);
        try {
          const nextState: AppState = {
            ...stateRef.current,
            learner: { ...stateRef.current.learner, syncTag: tag },
          };
          const { tag: cleanTag, updatedAt } = await pushCloudState(tag, nextState);
          skipNextAutoPush.current = true;
          stateRef.current = nextState;
          setState(nextState);
          setSyncTag(cleanTag);
          setLastSyncedAt(updatedAt);
          setSyncStatus("synced");
          saveSyncMeta({ tag: cleanTag, lastSyncedAt: updatedAt });
          return { ok: true, tag: cleanTag };
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Could not enable Cloud Sync.";
          setSyncStatus("error");
          setSyncError(msg);
          return { ok: false, error: msg };
        }
      },
      syncNow: async () => {
        if (!syncTag) return { ok: false, error: "Cloud Sync is not enabled." };
        setSyncStatus("syncing");
        setSyncError(null);
        try {
          const { tag, updatedAt } = await pushCloudState(syncTag, stateRef.current);
          setLastSyncedAt(updatedAt);
          setSyncStatus("synced");
          saveSyncMeta({ tag, lastSyncedAt: updatedAt });
          return { ok: true };
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Could not sync to cloud.";
          setSyncStatus("error");
          setSyncError(msg);
          return { ok: false, error: msg };
        }
      },
      restore: async (tagInput: string) => {
        const norm = normalizeSyncTag(tagInput);
        if (!norm) {
          const msg = "Enter a valid key like asha#4829 (name + # + 4 digits).";
          setSyncError(msg);
          return { ok: false, error: msg };
        }
        setSyncStatus("syncing");
        setSyncError(null);
        try {
          const res = await pullCloudState(norm.tag);
          if (!res) {
            const msg = `No saved journal found for ${norm.tag}.`;
            setSyncStatus("error");
            setSyncError(msg);
            return { ok: false, error: msg };
          }
          skipNextAutoPush.current = true;
          stateRef.current = res.state;
          setState(res.state);
          setSyncTag(res.tag);
          setLastSyncedAt(res.updatedAt);
          setSyncStatus("synced");
          saveSyncMeta({ tag: res.tag, lastSyncedAt: res.updatedAt });
          return { ok: true, tag: res.tag };
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Could not restore from cloud.";
          setSyncStatus("error");
          setSyncError(msg);
          return { ok: false, error: msg };
        }
      },
      disconnect: () => {
        setSyncTag(null);
        setSyncStatus("idle");
        setLastSyncedAt(null);
        setSyncError(null);
        saveSyncMeta(null);
        update((s) => ({ ...s, learner: { ...s.learner, syncTag: undefined } }));
      },
    },
  };

  return <Ctx.Provider value={engine}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useEngine(): Engine {
  const e = useContext(Ctx);
  if (!e) throw new Error("useEngine must be used inside <EngineProvider>");
  return e;
}
