import { useCallback, useEffect, useMemo, useState } from "react";
import { go } from "../app/router";
import type { HeritageCategory, HeritageEntry, NewsFeedSpec, PhraseSituation } from "../content/schema";
import { fetchRssFeed, findVocabInText, formatRelativeTime, loadCustomFeeds, translateToEnglish, type MatchedVocab, type NewsItem } from "../engine/news";
import { useEngine } from "../engine/store";
import { Icon } from "../ui/Icon";
import { Art, DebugLabel, Empty, Native, SpeakButton, useMeaningMode } from "../ui/kit";
import { DailyWordCard } from "./DailyWord";

type DiscoverTab = "heritage" | "phrases" | "news";

const SITUATIONS: { id: PhraseSituation | "all"; label: string; icon: string }[] = [
  { id: "all", label: "All", icon: "sparkle" },
  { id: "greetings", label: "Greetings", icon: "hand" },
  { id: "conversations", label: "Conversation", icon: "book" },
  { id: "travel", label: "Travel", icon: "map" },
  { id: "shopping", label: "Shopping", icon: "coin" },
  { id: "restaurants", label: "Food & cafés", icon: "target" },
  { id: "cultural", label: "Culture & proverbs", icon: "scroll" },
];

const HERITAGE_CATS: { id: HeritageCategory | "all"; label: string; icon: string }[] = [
  { id: "all", label: "All", icon: "sparkle" },
  { id: "stories", label: "Stories", icon: "book" },
  { id: "folk_tales", label: "Folk Tales", icon: "scroll" },
  { id: "traditions", label: "Traditions", icon: "flame" },
  { id: "music", label: "Music", icon: "speaker" },
  { id: "art", label: "Art & Craft", icon: "star" },
];

const CAT_LABEL: Record<HeritageCategory, string> = {
  stories: "Story",
  folk_tales: "Folk Tale",
  traditions: "Tradition",
  music: "Music",
  art: "Art & Craft",
};

export function Discover() {
  const { pack } = useEngine();
  const hasHeritage = (pack.heritage?.length ?? 0) > 0;
  const [activeTab, setActiveTab] = useState<DiscoverTab>(hasHeritage ? "heritage" : "phrases");

  return (
    <div className="stack lg">
      <header className="stack" style={{ gap: 6 }}>
        <span className="eyebrow">Discover · {pack.config.region ?? pack.config.name}</span>
        <h1>Heritage, culture &amp; living {pack.config.name}</h1>
        <p className="muted">
          Fall in love with the stories, traditions, music, art, everyday phrases, and live news of {pack.config.region ?? pack.config.name}.
        </p>
      </header>

      <div className="discover-tabs" role="tablist" aria-label="Discover sections">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "heritage"}
          className={`discover-tab ${activeTab === "heritage" ? "active" : ""}`}
          onClick={() => setActiveTab("heritage")}
        >
          <Icon name="crown" /> Heritage
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "phrases"}
          className={`discover-tab ${activeTab === "phrases" ? "active" : ""}`}
          onClick={() => setActiveTab("phrases")}
        >
          <Icon name="book" /> Phrasebook
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "news"}
          className={`discover-tab ${activeTab === "news" ? "active" : ""}`}
          onClick={() => setActiveTab("news")}
        >
          <Icon name="scroll" /> News
        </button>
      </div>

      {activeTab === "heritage" && <HeritageTab />}
      {activeTab === "phrases" && <PhrasebookTab />}
      {activeTab === "news" && <NewsTab />}
    </div>
  );
}

function HeritageTab() {
  const { pack } = useEngine();
  const [cat, setCat] = useState<HeritageCategory | "all">("all");
  const entries = pack.heritage ?? [];
  const filtered = entries.filter((e) => cat === "all" || e.category === cat);

  if (entries.length === 0) {
    return <Empty icon="crown" title="Heritage stories coming soon" body="This language pack does not include cultural stories yet." />;
  }

  return (
    <div className="stack lg screen-enter">
      <DebugLabel name="HeritageTab" />
      <DailyWordCard />

      <section className="stack">
        <div className="row wrap" style={{ gap: 6 }} role="tablist" aria-label="Heritage categories">
          {HERITAGE_CATS.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={cat === c.id}
              className={`chip ${cat === c.id ? "active" : ""}`}
              onClick={() => setCat(c.id)}
            >
              <Icon name={c.icon} /> {c.label}
            </button>
          ))}
        </div>

        <div className="grid two">
          {filtered.map((item) => (
            <HeritageCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

function VocabMatches({ matches }: { matches: MatchedVocab[] }) {
  const { progress, saveWord, pack } = useEngine();
  if (!matches.length) return null;
  const learnedCount = matches.filter((m) => m.learned).length;
  return (
    <div className="vocab-spot stack" style={{ gap: 6 }}>
      <div className="row between">
        <span className="eyebrow">Words in this story</span>
        {learnedCount > 0 && <span className="tag leaf">{learnedCount} learned</span>}
      </div>
      <div className="row wrap" style={{ gap: 6 }}>
        {matches.map(({ vocab: v, learned }) => {
          const saved = progress.saved.includes(v.id);
          const phon = pack.phonetics ? pack.phonetics(v.roman) : v.roman;
          return (
            <button
              key={v.id}
              type="button"
              className={`vocab-pill ${learned ? "learned" : ""} ${saved ? "saved" : ""}`}
              onClick={() => saveWord(v.id)}
              title={saved ? "Saved in your collection (tap to remove)" : "Tap to save to your collection"}
            >
              {learned && <Icon name="check" />}
              <Native size={15} say={false}>{v.script}</Native>
              <span className="vocab-pill-phon">{phon}</span>
              <span className="vocab-pill-mean">· {v.meaning}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function HeritageCard({ item }: { item: HeritageEntry }) {
  const { pack, state } = useEngine();
  const art = item.postcardArt ? pack.postcardArt[item.postcardArt] : undefined;
  const titlePhon = pack.phonetics ? pack.phonetics(item.titleRoman) : item.titleRoman;
  const paraCount = item.paragraphs?.length ?? 0;

  return (
    <article
      className="card heritage-card heritage-card-link stack"
      style={{ gap: 0, padding: 0, overflow: "hidden", cursor: "pointer" }}
      onClick={() => go({ name: "heritage", id: item.id })}
      role="button"
      tabIndex={0}
      aria-label={`Read ${item.title}`}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go({ name: "heritage", id: item.id }); } }}
    >
      <DebugLabel name="HeritageCard" />
      {art && (
        <div className="heritage-banner">
          {art.trimStart().startsWith("<") ? (
            <div style={{ width: "100%", height: "100%" }} dangerouslySetInnerHTML={{ __html: art }} />
          ) : (
            <img src={art} alt={item.title} loading="lazy" />
          )}
          <span className="heritage-cat-pill">{CAT_LABEL[item.category]}</span>
          <span className="heritage-region">{item.region}</span>
        </div>
      )}

      <div className="stack" style={{ padding: 18, gap: 8, flex: 1 }}>
        <div className="stack" style={{ gap: 2, minWidth: 0 }}>
          {!art && <span className="eyebrow">{CAT_LABEL[item.category]} · {item.region}</span>}
          {state.settings.showPhonetics && <span className="mascot-phon" style={{ fontSize: 12 }}>{titlePhon}</span>}
          <Native as="div" size={19} say={false} style={{ color: "var(--ink)", lineHeight: 1.3 }}>{item.titleScript}</Native>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink-soft)", lineHeight: 1.3 }}>{item.title}</h3>
        </div>

        <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.5, margin: 0 }}>{item.summary}</p>

        <div className="row between" style={{ marginTop: "auto", paddingTop: 6 }}>
          <span className="muted" style={{ fontSize: 12, fontWeight: 700 }}>
            {paraCount > 0 ? `${paraCount} parts` : CAT_LABEL[item.category]}
          </span>
          <span className="story-read-cta">Read <Icon name="arrowRight" /></span>
        </div>
      </div>
    </article>
  );
}

export function HeritageStoryScreen({ id }: { id: string }) {
  const { pack, progress, state } = useEngine();
  const meaningMode = useMeaningMode();
  const entries = pack.heritage ?? [];
  const idx = entries.findIndex((e) => e.id === id);
  const item = entries[idx];

  const [openParas, setOpenParas] = useState<Set<number>>(new Set());
  const [showAllMeanings, setShowAllMeanings] = useState(false);

  const learnedIds = useMemo(
    () => new Set(Object.entries(progress.words).filter(([, c]) => c.correct + c.wrong > 0).map(([k]) => k)),
    [progress.words],
  );

  const fullScript = useMemo(() => {
    if (!item) return "";
    const parts = [
      item.titleScript,
      item.keyTerm.script,
      ...(item.paragraphs?.map((p) => p.script) ?? []),
      item.readingPassage?.script ?? "",
    ];
    return parts.join(" ");
  }, [item]);

  const matches = useMemo(
    () => (item ? findVocabInText(fullScript, pack.vocab, learnedIds, 10) : []),
    [item, fullScript, pack.vocab, learnedIds],
  );

  if (!item) {
    return (
      <div className="stack lg">
        <button type="button" className="btn sm ghost" style={{ alignSelf: "flex-start" }} onClick={() => go({ name: "discover" })}>
          <Icon name="arrowLeft" /> Discover
        </button>
        <Empty icon="crown" title="Story not found" body="Pick another story from Discover → Heritage." />
      </div>
    );
  }

  const art = item.postcardArt ? pack.postcardArt[item.postcardArt] : undefined;
  const showPhon = state.settings.showPhonetics;
  const titlePhon = pack.phonetics ? pack.phonetics(item.titleRoman) : item.titleRoman;
  const paragraphs = item.paragraphs?.length
    ? item.paragraphs
    : item.readingPassage
      ? [item.readingPassage]
      : [];
  const nextEntry = entries.length > 1 ? entries[(idx + 1) % entries.length] : undefined;

  const glossaryItems = [
    ...(item.glossary ?? []),
    ...((item.glossary ?? []).some((g) => g.script === item.keyTerm.script) ? [] : [item.keyTerm]),
  ];
  const learnedMatchCount = matches.filter((m) => m.learned).length;

  const togglePara = (i: number) => {
    setOpenParas((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="story-shell stack lg">
      <DebugLabel name="HeritageStoryScreen" />
      <div className="row between wrap" style={{ gap: 8 }}>
        <button type="button" className="btn sm ghost" onClick={() => go({ name: "discover" })}>
          <Icon name="arrowLeft" /> Heritage
        </button>
        {meaningMode !== "always" && meaningMode !== "off" && paragraphs.length > 0 && (
          <button
            type="button"
            className={`chip ${showAllMeanings ? "active" : ""}`}
            onClick={() => setShowAllMeanings((v) => !v)}
          >
            <Icon name="eye" /> {showAllMeanings ? "Hide meanings" : "Show all meanings"}
          </button>
        )}
      </div>

      <article className="card stack" style={{ padding: 0, overflow: "hidden", gap: 0 }}>
        {art && (
          <div className="story-hero-banner">
            {art.trimStart().startsWith("<") ? (
              <div style={{ width: "100%", height: "100%" }} dangerouslySetInnerHTML={{ __html: art }} />
            ) : (
              <img src={art} alt={item.title} />
            )}
            <span className="heritage-cat-pill">{CAT_LABEL[item.category]}</span>
            <span className="heritage-region">{item.region}</span>
          </div>
        )}

        <div className="stack" style={{ padding: "20px 22px 22px", gap: 10 }}>
          <div className="row between" style={{ alignItems: "flex-start", gap: 12 }}>
            <div className="stack" style={{ gap: 3, minWidth: 0 }}>
              {showPhon && <span className="mascot-phon" style={{ fontSize: 13 }}>{titlePhon}</span>}
              <Native as="h1" size={26} say={false} style={{ lineHeight: 1.25, color: "var(--ink)" }}>{item.titleScript}</Native>
              <p style={{ fontSize: 16, fontWeight: 700, color: "var(--ink-soft)", margin: 0 }}>{item.title}</p>
            </div>
            <SpeakButton text={item.titleScript} roman={item.titleRoman} />
          </div>
          <p className="muted" style={{ fontSize: 14, lineHeight: 1.55, margin: 0 }}>{item.story}</p>
        </div>
      </article>

      {paragraphs.length > 0 && (
        <section className="stack" style={{ gap: 12 }} aria-label="Story paragraphs">
          <div className="row between">
            <span className="eyebrow">Read in {pack.config.name}</span>
            {meaningMode === "tap" && !showAllMeanings && (
              <span className="muted" style={{ fontSize: 12, fontWeight: 600 }}>Tap a paragraph for meaning</span>
            )}
          </div>

          {paragraphs.map((p, i) => {
            const phon = pack.phonetics ? pack.phonetics(p.roman) : p.roman;
            const meaningShown =
              meaningMode === "always" ||
              (meaningMode === "tap" && (showAllMeanings || openParas.has(i)));
            return (
              <div key={i} className="card story-para stack" style={{ gap: 8 }}>
                <div className="row between" style={{ alignItems: "flex-start", gap: 10 }}>
                  <button
                    type="button"
                    className={`mascot-phrase-btn ${meaningMode === "tap" ? "tappable" : ""}`}
                    onClick={() => { if (meaningMode === "tap") togglePara(i); }}
                    aria-expanded={meaningMode === "tap" ? meaningShown : undefined}
                  >
                    {showPhon && <span className="mascot-phon" style={{ fontSize: 13, lineHeight: 1.45 }}>{phon}</span>}
                    <Native as="span" size={19} say={false} style={{ lineHeight: 1.6, color: "var(--ink)" }}>
                      {p.script}
                    </Native>
                  </button>
                  <SpeakButton text={p.script} roman={p.roman} small />
                </div>
                {meaningShown && (
                  <p className="story-para-meaning">{p.meaning}</p>
                )}
              </div>
            );
          })}
        </section>
      )}

      <section className="card story-words-card stack" style={{ gap: 14 }} aria-label="Words learnt summary">
        <div className="row between wrap" style={{ gap: 8 }}>
          <div className="stack" style={{ gap: 2 }}>
            <span className="eyebrow">Words learnt &amp; spotted</span>
            <h2 style={{ fontSize: 19 }}>Story vocabulary summary</h2>
          </div>
          <div className="row wrap" style={{ gap: 6 }}>
            <span className="tag saffron">{glossaryItems.length} key words</span>
            {matches.length > 0 && (
              <span className="tag leaf">{learnedMatchCount}/{matches.length} lesson words learned</span>
            )}
          </div>
        </div>

        <div className="story-glossary-grid">
          {glossaryItems.map((w) => {
            const phon = pack.phonetics ? pack.phonetics(w.roman) : w.roman;
            return (
              <div key={w.script} className="story-glossary-item row between" style={{ gap: 8 }}>
                <div className="stack" style={{ gap: 2, minWidth: 0 }}>
                  {showPhon && <span className="mascot-phon" style={{ fontSize: 11.5 }}>{phon}</span>}
                  <Native as="span" size={17} say={false} style={{ color: "var(--ink)" }}>{w.script}</Native>
                  <span className="muted" style={{ fontSize: 12.5, fontWeight: 600 }}>{w.meaning}</span>
                </div>
                <SpeakButton text={w.script} roman={w.roman} small />
              </div>
            );
          })}
        </div>

        {matches.length > 0 && <VocabMatches matches={matches} />}
      </section>

      {item.references.length > 0 && (
        <section className="card warm stack" style={{ gap: 8 }}>
          <span className="eyebrow">Explore &amp; listen</span>
          <ul className="heritage-ref-list">
            {item.references.map((ref) => (
              <li key={ref}>{ref}</li>
            ))}
          </ul>
        </section>
      )}

      {nextEntry && (
        <button
          type="button"
          className="card row between story-next-btn"
          onClick={() => go({ name: "heritage", id: nextEntry.id })}
        >
          <div className="stack" style={{ gap: 2, textAlign: "left" }}>
            <span className="eyebrow">Next in Heritage</span>
            <strong>{nextEntry.title}</strong>
          </div>
          <Icon name="arrowRight" />
        </button>
      )}
    </div>
  );
}

function PhrasebookTab() {
  const { pack } = useEngine();
  const meaningMode = useMeaningMode();
  const [filter, setFilter] = useState<PhraseSituation | "all">("all");
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [reading, setReading] = useState<string | null>(null);
  const phrases = pack.phrases.filter((p) => filter === "all" || p.situation === filter);

  return (
    <div className="stack lg screen-enter">
      <DebugLabel name="PhrasebookTab" />
      <section>
        <div className="section-head" style={{ marginTop: 0 }}>
          <h2>Phrasebook</h2>
          <span className="muted" style={{ fontSize: 13 }}>{pack.phrases.length} phrases</span>
        </div>
        <div className="row wrap" style={{ gap: 6, marginBottom: 16 }} role="tablist" aria-label="Situations">
          {SITUATIONS.map((s) => (
            <button key={s.id} type="button" role="tab" aria-selected={filter === s.id} className={`chip ${filter === s.id ? "active" : ""}`} onClick={() => setFilter(s.id)}>
              <Icon name={s.icon} /> {s.label}
            </button>
          ))}
        </div>
        <div className="grid two">
          {phrases.map((p) => {
            const isOpen = meaningMode === "always" || (meaningMode === "tap" && open.has(p.id));
            return (
              <div key={p.id} className="card stack" style={{ gap: 8 }}>
                <div className="row between"><span className="tag saffron">{p.situation}</span><SpeakButton text={p.script} roman={p.roman} small /></div>
                <button type="button" style={{ border: "none", background: "none", padding: 0, textAlign: "left" }} aria-expanded={isOpen}
                  onClick={() => setOpen((o) => { const n = new Set(o); if (n.has(p.id)) n.delete(p.id); else n.add(p.id); return n; })}>
                  <Native as="div" size={26}>{p.script}</Native>
                  {!isOpen && meaningMode === "tap" && <span className="reveal-hint" style={{ marginTop: 8 }}><Icon name="hand" /> Tap to reveal</span>}
                </button>
                {isOpen && (
                  <div className="reveal-body">
                    <strong style={{ fontSize: 17 }}>{p.meaning}</strong>
                    <span className="muted" style={{ fontSize: 13 }}>{p.context}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="section-head"><h2>Reading room</h2></div>
        {pack.readings.length === 0 ? <Empty icon="scroll" title="No readings in this pack yet" body="Readings appear when a language pack includes them." /> : (
          <div className="grid two">
            {pack.readings.map((r) => (
              <div key={r.id} className="card stack">
                <span className="eyebrow">{r.title}</span>
                <Native as="h2" size={24}>{r.titleScript}</Native>
                <Native as="p" size={17} style={{ fontWeight: 500, lineHeight: 1.7, display: "-webkit-box", WebkitLineClamp: reading === r.id ? undefined : 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{r.script}</Native>
                {reading === r.id && <p className="muted">{r.meaning}</p>}
                <button type="button" className="btn sm" style={{ alignSelf: "flex-start" }} onClick={() => setReading(reading === r.id ? null : r.id)}>
                  <Icon name="eye" /> {reading === r.id ? "Collapse" : "Read with translation"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card warm stack">
        <span className="eyebrow">Source</span>
        {pack.config.sources.map((s) => <p key={s} className="muted" style={{ fontSize: 13 }}>{s}</p>)}
      </section>
    </div>
  );
}

function NewsTab() {
  const { pack, progress, state } = useEngine();
  const meaningMode = useMeaningMode();
  const customFeeds = useMemo(() => loadCustomFeeds(pack.config.id), [pack.config.id]);
  const feeds = useMemo(() => [...(pack.newsFeeds ?? []), ...customFeeds], [pack.newsFeeds, customFeeds]);
  const [feedId, setFeedId] = useState<string>(() => feeds[0]?.id ?? "");
  const activeFeed = feeds.find((f) => f.id === feedId) ?? feeds[0];

  const [items, setItems] = useState<NewsItem[]>([]);
  const [openMeanings, setOpenMeanings] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const showPhonetics = state.settings.newsPhonetics ?? true;
  const showMeaningSetting = (state.settings.newsMeaning ?? true) && meaningMode !== "off";
  const toggleMeaning = (id: string) => setOpenMeanings((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });

  const learnedIds = useMemo(
    () => new Set(Object.entries(progress.words).filter(([, c]) => c.correct + c.wrong > 0).map(([k]) => k)),
    [progress.words],
  );

  const loadFeed = useCallback(async (feed: NewsFeedSpec | undefined, force = false) => {
    if (!feed || import.meta.env.MODE === "test") return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchRssFeed(feed.url, feed.name, force);
      setItems(res.items);
      setLoading(false);
      // Progressively translate headlines & summaries to English for reading comprehension.
      const srcLang = pack.config.id;
      void Promise.all(
        res.items.map(async (it) => {
          const [titleEn, summaryEn] = await Promise.all([
            it.titleEn ? Promise.resolve(it.titleEn) : translateToEnglish(it.title, srcLang),
            it.summary ? (it.summaryEn ? Promise.resolve(it.summaryEn) : translateToEnglish(it.summary, srcLang)) : Promise.resolve(""),
          ]);
          setItems((cur) => cur.map((x) => (x.id === it.id ? { ...x, titleEn, summaryEn } : x)));
        }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load news feed.");
      setItems([]);
      setLoading(false);
    }
  }, [pack.config.id]);

  useEffect(() => {
    void loadFeed(activeFeed, false);
  }, [activeFeed, loadFeed]);

  if (feeds.length === 0) {
    return <Empty icon="scroll" title="No news feeds configured" body="Add an RSS feed in Settings to read live headlines." />;
  }

  return (
    <div className="stack lg screen-enter">
      <DebugLabel name="NewsTab" />
      <section className="card stack" style={{ gap: 12 }}>
        <div className="row between wrap">
          <div>
            <span className="eyebrow">Reading comprehension · Live {pack.config.name} RSS</span>
            <h2 style={{ marginTop: 2 }}>Read today's news</h2>
          </div>
          <div className="row" style={{ gap: 6 }}>
            <button type="button" className="icon-btn" aria-label="News settings" title="News settings" onClick={() => go({ name: "settings" })}>
              <Icon name="settings" />
            </button>
            <button type="button" className="icon-btn" aria-label="Refresh news" onClick={() => void loadFeed(activeFeed, true)} disabled={loading}>
              <Icon name="refresh" />
            </button>
          </div>
        </div>

        <div className="row wrap" style={{ gap: 6 }} role="tablist" aria-label="News feeds">
          {feeds.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={activeFeed?.id === f.id}
              className={`chip ${activeFeed?.id === f.id ? "active" : ""}`}
              onClick={() => setFeedId(f.id)}
            >
              {f.name}
            </button>
          ))}
        </div>
      </section>

      {loading && (
        <div className="card stack" style={{ alignItems: "center", textAlign: "center", padding: 32 }}>
          <span className="eyebrow">Fetching headlines…</span>
          <p className="muted" style={{ fontSize: 14 }}>Loading {activeFeed?.name} and preparing phonetics &amp; translations.</p>
        </div>
      )}

      {!loading && error && (
        <Empty
          icon="scroll"
          title="Could not fetch headlines"
          body={error}
          action={<button type="button" className="btn primary sm" onClick={() => void loadFeed(activeFeed, true)}>Try again</button>}
        />
      )}

      {!loading && !error && items.length > 0 && (
        <div className="stack" style={{ gap: 14 }}>
          {items.map((item) => {
            const titleSay = pack.sayScript ? pack.sayScript(item.title) : "";
            const titleRoman = pack.romanize ? pack.romanize(item.title) : "";
            const summarySay = item.summary && pack.sayScript ? pack.sayScript(item.summary) : "";
            const ago = formatRelativeTime(item.pubDate);
            const matches = findVocabInText(`${item.title} ${item.summary}`, pack.vocab, learnedIds, 6);

            const meaningVisible = showMeaningSetting && (meaningMode === "always" || openMeanings.has(item.id));

            return (
              <article key={item.id} className="card news-card stack" style={{ gap: 10 }}>
                <DebugLabel name="NewsCard" />
                <div className="row between" style={{ gap: 8 }}>
                  <div className="row wrap" style={{ gap: 6 }}>
                    <span className="tag saffron">{item.source}</span>
                    {ago && <span className="muted" style={{ fontSize: 12, fontWeight: 700 }}>{ago}</span>}
                  </div>
                  <SpeakButton text={item.title} roman={titleRoman || undefined} small />
                </div>

                <div className="stack" style={{ gap: 6 }}>
                  <button
                    type="button"
                    className={`mascot-phrase-btn ${showMeaningSetting && meaningMode === "tap" ? "tappable" : ""}`}
                    onClick={() => { if (showMeaningSetting && meaningMode === "tap") toggleMeaning(item.id); }}
                    aria-expanded={showMeaningSetting && meaningMode === "tap" ? meaningVisible : undefined}
                  >
                    {showPhonetics && titleSay && (
                      <span className="news-summary-say" style={{ fontSize: 13 }}>{titleSay}</span>
                    )}
                    <Native as="span" size={20} say={false} style={{ lineHeight: 1.38, color: "var(--ink)" }}>{item.title}</Native>
                  </button>
                  {meaningVisible && item.titleEn && (
                    <p className="news-meaning">{item.titleEn}</p>
                  )}
                </div>

                {item.summary && (
                  <div className="news-summary stack" style={{ gap: 5 }}>
                    {showPhonetics && summarySay && <p className="news-summary-say">{summarySay}</p>}
                    <Native as="p" size={15} say={false} style={{ lineHeight: 1.55, fontWeight: 500 }}>{item.summary}</Native>
                    {meaningVisible && item.summaryEn && <p className="news-meaning">{item.summaryEn}</p>}
                  </div>
                )}

                <VocabMatches matches={matches} />
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function DailyWordScreen() {
  const { progress, ix } = useEngine();
  const saved = progress.saved.map((id) => ix.vocab.get(id)).filter(Boolean);
  return (
    <div className="stack lg">
      <button type="button" className="btn sm ghost" style={{ alignSelf: "flex-start" }} onClick={() => go({ name: "discover" })}><Icon name="arrowLeft" /> Discover</button>
      <DailyWordCard large />
      <section>
        <div className="section-head"><h2>Your collection</h2><span className="muted">{saved.length} saved</span></div>
        {saved.length === 0 ? <Empty icon="bookmark" title="Nothing saved yet" body="Tap the bookmark on any word card to keep it here." /> : (
          <div className="grid four">
            {saved.map((v) => (
              <div key={v!.id} className="card stack" style={{ alignItems: "center", textAlign: "center", gap: 6 }}>
                <Art vocab={v!} size={84} />
                <Native size={24}>{v!.script}</Native>
                <span className="muted" style={{ fontSize: 13 }}>{v!.meaning}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
