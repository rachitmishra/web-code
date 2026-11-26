import type { VocabEntry } from "../content/schema";

/**
 * Client-side RSS reader + English translation + vocabulary matcher for reading comprehension.
 * Keeps zero language-specific text here so any LanguagePack with `newsFeeds` can use it.
 */
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  link: string;
  pubDate: string;
  source: string;
  titleEn?: string;
  summaryEn?: string;
}

interface CachedFeed {
  fetchedAt: number;
  items: NewsItem[];
}

const CACHE_PREFIX = "lj.rss.v2:";
const TRANS_PREFIX = "lj.tr.v1:";
const CUSTOM_FEEDS_KEY = "lj.rss.custom.v1";
const TTL_MS = 15 * 60 * 1000;

export function loadCustomFeeds(packId: string): { id: string; name: string; url: string; tagline: string }[] {
  try {
    const all = JSON.parse(localStorage.getItem(CUSTOM_FEEDS_KEY) ?? "{}") as Record<
      string,
      { id: string; name: string; url: string; tagline: string }[]
    >;
    return Array.isArray(all[packId]) ? all[packId] : [];
  } catch {
    return [];
  }
}

export function saveCustomFeeds(
  packId: string,
  feeds: { id: string; name: string; url: string; tagline: string }[],
): void {
  try {
    const all = JSON.parse(localStorage.getItem(CUSTOM_FEEDS_KEY) ?? "{}") as Record<string, unknown>;
    all[packId] = feeds;
    localStorage.setItem(CUSTOM_FEEDS_KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable */
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/** Trim an RSS description into a concise 1–2 sentence summary for comfortable reading practice. */
export function summarizeText(raw: string, maxChars = 190): string {
  const clean = stripHtml(raw);
  if (!clean) return "";
  const sentences = clean.split(/(?<=[.!?।])\s+/).filter(Boolean);
  let acc = "";
  for (const s of sentences.slice(0, 2)) {
    if (acc && (acc.length + s.length + 1) > maxChars) break;
    acc = acc ? `${acc} ${s}` : s;
  }
  if (!acc) acc = clean;
  return acc.length > maxChars ? `${acc.slice(0, maxChars - 1).trimEnd()}…` : acc;
}

function readCache(url: string): CachedFeed | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + url);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedFeed;
    if (!Array.isArray(parsed.items)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(url: string, items: NewsItem[]): void {
  try {
    localStorage.setItem(CACHE_PREFIX + url, JSON.stringify({ fetchedAt: Date.now(), items }));
  } catch {
    /* storage full */
  }
}

function parseRssXml(xmlText: string, fallbackSource: string): NewsItem[] {
  const doc = new DOMParser().parseFromString(xmlText, "text/xml");
  const channelTitle = stripHtml(doc.querySelector("channel > title, feed > title")?.textContent ?? fallbackSource);
  const nodes = Array.from(doc.querySelectorAll("item, entry")).slice(0, 14);
  const items: NewsItem[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const el = nodes[i];
    const title = stripHtml(el.querySelector("title")?.textContent ?? "");
    if (!title) continue;
    const summary = summarizeText(el.querySelector("description, summary")?.textContent ?? "");
    const linkEl = el.querySelector("link");
    const link = (linkEl?.getAttribute("href") || linkEl?.textContent || "").trim();
    const pubDate = (el.querySelector("pubDate, published, updated")?.textContent ?? "").trim();
    const source = stripHtml(el.querySelector("source")?.textContent ?? "") || channelTitle;
    items.push({
      id: `${link || title}-${i}`,
      title,
      summary: summary && summary !== title ? summary : "",
      link,
      pubDate,
      source,
    });
  }
  return items;
}

/** Translate native-script text to English with localStorage caching and fallback. */
export async function translateToEnglish(text: string, sourceLang: string): Promise<string> {
  const clean = text.trim();
  if (!clean) return "";
  const cacheKey = `${TRANS_PREFIX}${sourceLang}:${clean.slice(0, 120)}`;
  try {
    const hit = localStorage.getItem(cacheKey);
    if (hit) return hit;
  } catch {
    /* ignore */
  }

  // Primary: public translate endpoint (fast, supports full sentences)
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sourceLang)}&tl=en&dt=t&q=${encodeURIComponent(clean)}`;
    const r = await fetch(url);
    if (r.ok) {
      const data = (await r.json()) as unknown[];
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const joined = (data[0] as unknown[][])
          .map((seg) => (Array.isArray(seg) && typeof seg[0] === "string" ? seg[0] : ""))
          .join("")
          .trim();
        if (joined) {
          try { localStorage.setItem(cacheKey, joined); } catch { /* ignore */ }
          return joined;
        }
      }
    }
  } catch {
    /* fall through */
  }

  // Fallback: MyMemory free translation API
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean.slice(0, 400))}&langpair=${encodeURIComponent(sourceLang)}|en`;
    const r = await fetch(url);
    if (r.ok) {
      const data = (await r.json()) as { responseData?: { translatedText?: string } };
      const out = data.responseData?.translatedText?.trim() ?? "";
      if (out) {
        try { localStorage.setItem(cacheKey, out); } catch { /* ignore */ }
        return out;
      }
    }
  } catch {
    /* ignore */
  }

  return "";
}

/** Fetch an RSS feed via rss2json with automatic XML proxy fallback + 15-minute cache. */
export async function fetchRssFeed(
  feedUrl: string,
  sourceName: string,
  forceRefresh = false,
): Promise<{ items: NewsItem[]; fromCache: boolean }> {
  const cached = readCache(feedUrl);
  if (!forceRefresh && cached && Date.now() - cached.fetchedAt < TTL_MS && cached.items.length > 0) {
    return { items: cached.items, fromCache: true };
  }

  // Strategy 1: rss2json (fast JSON conversion, CORS-enabled)
  try {
    const r = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`);
    if (r.ok) {
      const data = (await r.json()) as {
        status?: string;
        feed?: { title?: string };
        items?: { title?: string; description?: string; link?: string; pubDate?: string }[];
      };
      if (data.status === "ok" && Array.isArray(data.items) && data.items.length > 0) {
        const items: NewsItem[] = data.items
          .slice(0, 14)
          .map((it, i) => {
            const title = stripHtml(it.title ?? "");
            const summary = summarizeText(it.description ?? "");
            return {
              id: `${it.link || title}-${i}`,
              title,
              summary: summary && summary !== title ? summary : "",
              link: (it.link ?? "").trim(),
              pubDate: (it.pubDate ?? "").trim(),
              source: stripHtml(data.feed?.title ?? "") || sourceName,
            };
          })
          .filter((x) => x.title.length > 0);
        if (items.length > 0) {
          writeCache(feedUrl, items);
          return { items, fromCache: false };
        }
      }
    }
  } catch {
    /* fall through */
  }

  // Strategy 2: AllOrigins CORS proxy + browser DOMParser
  try {
    const r = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`);
    if (r.ok) {
      const xml = await r.text();
      const items = parseRssXml(xml, sourceName);
      if (items.length > 0) {
        writeCache(feedUrl, items);
        return { items, fromCache: false };
      }
    }
  } catch {
    /* fall through */
  }

  if (cached && cached.items.length > 0) {
    return { items: cached.items, fromCache: true };
  }
  throw new Error("Could not load this RSS feed right now. Check your connection or try another feed.");
}

export interface MatchedVocab {
  vocab: VocabEntry;
  learned: boolean;
}

/**
 * Find vocabulary words from the active pack that appear inside a native-script text,
 * surfacing words the learner already studied first so they can spot them in real news & tales.
 */
export function findVocabInText(
  text: string,
  vocab: VocabEntry[],
  learnedIds: Set<string>,
  limit = 6,
): MatchedVocab[] {
  if (!text) return [];
  const seenMeaning = new Set<string>();
  const matches: MatchedVocab[] = [];
  // Prefer longer, distinct single-word stems (>= 2 codepoints) to avoid noisy single-letter hits.
  for (const v of vocab) {
    const word = v.script.trim();
    if (!word || word.includes(" ") || [...word].length < 2) continue;
    if (text.includes(word)) {
      const key = v.meaning.toLowerCase();
      if (seenMeaning.has(key)) continue;
      seenMeaning.add(key);
      matches.push({ vocab: v, learned: learnedIds.has(v.id) });
    }
  }
  matches.sort((a, b) => Number(b.learned) - Number(a.learned) || b.vocab.script.length - a.vocab.script.length);
  return matches.slice(0, limit);
}

export function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return "";
  const t = Date.parse(dateStr);
  if (Number.isNaN(t)) return "";
  const mins = Math.max(0, Math.round((Date.now() - t) / 60000));
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}
