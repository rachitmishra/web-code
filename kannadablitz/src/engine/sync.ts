import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, signInAnonymously, type Auth } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc, type Firestore } from "firebase/firestore";
import { DEFAULT_PACK_ID } from "../content/registry";
import { hydrate, type AppState } from "./progress";

const SYNC_META_KEY = "lj.sync.v1";

export interface SyncMeta {
  tag: string;
  lastSyncedAt: number | null;
}

const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "",
};

let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;
let cachedDb: Firestore | null = null;

function getFirebase() {
  if (!FIREBASE_CONFIG.apiKey || !FIREBASE_CONFIG.projectId) {
    throw new Error("Cloud sync is not configured (missing VITE_FIREBASE_* env vars).");
  }
  if (!cachedApp) {
    cachedApp = getApps()[0] ?? initializeApp(FIREBASE_CONFIG);
    cachedAuth = getAuth(cachedApp);
    cachedDb = getFirestore(cachedApp);
  }
  return { auth: cachedAuth!, db: cachedDb! };
}

/** Convert a display name into a clean lowercase username prefix. */
export function cleanNamePrefix(name: string): string {
  const cleaned = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 20)
    .replace(/-+$/, "");
  return cleaned || "traveller";
}

/** Generate a unique `<name>#<4-digit-hash>` sync key (e.g. `asha#4829`). */
export function generateSyncTag(name: string): string {
  const prefix = cleanNamePrefix(name);
  let num = 1000 + Math.floor(Math.random() * 9000);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    num = 1000 + (buf[0] % 9000);
  }
  return `${prefix}#${num}`;
}

/**
 * Parse and normalise user input like `"Asha#4829"`, `"asha #4829"`, or `"asha-4829"`.
 * Returns canonical display `tag` (`asha#4829`) and Firestore `docId` (`asha-4829`), or `null` if invalid.
 */
export function normalizeSyncTag(input: string): { tag: string; docId: string } | null {
  const trimmed = input.trim().toLowerCase();
  const match = trimmed.match(/^([a-z0-9][a-z0-9_-]{0,23})\s*[#-]\s*(\d{4})$/);
  if (!match) return null;
  const prefix = match[1].replace(/_+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
  if (!prefix) return null;
  const code = match[2];
  return { tag: `${prefix}#${code}`, docId: `${prefix}-${code}` };
}

export function loadSyncMeta(): SyncMeta | null {
  try {
    const raw = localStorage.getItem(SYNC_META_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SyncMeta>;
    if (!parsed.tag || !normalizeSyncTag(parsed.tag)) return null;
    return { tag: normalizeSyncTag(parsed.tag)!.tag, lastSyncedAt: typeof parsed.lastSyncedAt === "number" ? parsed.lastSyncedAt : null };
  } catch {
    return null;
  }
}

export function saveSyncMeta(meta: SyncMeta | null): void {
  try {
    if (!meta) localStorage.removeItem(SYNC_META_KEY);
    else localStorage.setItem(SYNC_META_KEY, JSON.stringify(meta));
  } catch {
    /* ignore storage errors */
  }
}

async function ensureAuth(auth: Auth) {
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
}

/** Strip undefined values so Firestore accepts the JSON payload cleanly. */
function cleanForFirestore<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

/** Save progress & settings to Firestore under `users/{docId}`. */
export async function pushCloudState(tagInput: string, state: AppState): Promise<{ tag: string; updatedAt: number }> {
  const norm = normalizeSyncTag(tagInput);
  if (!norm) throw new Error("Invalid sync key. Use format name#1234.");
  const { auth, db } = getFirebase();
  await ensureAuth(auth);
  const updatedAt = Date.now();
  await setDoc(
    doc(db, "users", norm.docId),
    {
      syncTag: norm.tag,
      name: state.learner.name || "Traveller",
      updatedAt,
      journalState: cleanForFirestore({ ...state, learner: { ...state.learner, syncTag: norm.tag } }),
    },
    { merge: true },
  );
  return { tag: norm.tag, updatedAt };
}

/** Load progress & settings from Firestore by `name#1234` key. */
export async function pullCloudState(tagInput: string): Promise<{ tag: string; state: AppState; updatedAt: number } | null> {
  const norm = normalizeSyncTag(tagInput);
  if (!norm) throw new Error("Invalid sync key. Use format name#1234.");
  const { auth, db } = getFirebase();
  await ensureAuth(auth);
  const snap = await getDoc(doc(db, "users", norm.docId));
  if (!snap.exists()) return null;
  const data = snap.data() as { journalState?: unknown; updatedAt?: number };
  if (!data?.journalState) return null;
  const hydrated = hydrate(data.journalState, DEFAULT_PACK_ID);
  return {
    tag: norm.tag,
    state: { ...hydrated, learner: { ...hydrated.learner, syncTag: norm.tag } },
    updatedAt: typeof data.updatedAt === "number" ? data.updatedAt : Date.now(),
  };
}
