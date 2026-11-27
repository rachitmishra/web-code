import { useMemo, useState } from "react";
import { go } from "../app/router";
import { exampleFor } from "../engine/exercises";
import { dueWords, weakWords, wordCounts } from "../engine/progress";
import { mastery } from "../engine/srs";
import { shuffle } from "../engine/rng";
import { useEngine } from "../engine/store";
import type { Exercise } from "../engine/types";
import { Flashcard } from "../exercises/Cards";
import { TraceBoard } from "../exercises/Trace";
import { Icon } from "../ui/Icon";
import { Bar, Empty, Native } from "../ui/kit";
import { useSayScript } from "../ui/phonetic";

export function PracticeHub() {
  const { progress, pack, answer } = useEngine();
  const sayIt = useSayScript();
  const due = dueWords(progress).length;
  const weak = weakWords(progress).length;
  const [letterId, setLetterId] = useState(pack.letters[0]?.id);
  const letter = pack.letters.find((l) => l.id === letterId) ?? pack.letters[0];

  const tiles = [
    { title: "Fast Match", body: `30 or 60 seconds of rapid matching. Best: ${Math.max(progress.stats.fastMatchBest30, progress.stats.fastMatchBest60)}`, icon: "bolt", tone: "saffron", go: () => go({ name: "fastmatch" }) },
    { title: "Word Translation", body: `Pick the right translation for each ${pack.config.name} word from four options.`, icon: "target", tone: "sky", go: () => go({ name: "session", id: "word-quiz" }) },
    { title: "Flashcards", body: "Swipe through cards. Mark what you know, keep what you don't.", icon: "cards", tone: "gold", go: () => go({ name: "flashcards" }) },
    { title: "Sentence Builder", body: `Arrange ${pack.config.name} words into natural sentences.`, icon: "tiles", tone: "terracotta", go: () => go({ name: "session", id: "sentences-build" }) },
    { title: "Fill in the Blank", body: `Complete real ${pack.config.name} sentences by picking the missing word.`, icon: "pen", tone: "saffron", go: () => go({ name: "session", id: "sentences-fill" }) },
    { title: "Revision centre", body: due ? `${due} due now · ${weak} tricky` : "Spaced repetition of everything you've learned", icon: "repeat", tone: "leaf", go: () => go({ name: "revision" }) },
  ];

  return (
    <div className="stack lg">
      <header><span className="eyebrow">Practice</span><h1>Sharpen what you know</h1><p className="muted">Practice never costs lives. It's separate from the journey, so revisit anything as often as you like.</p></header>
      <div className="grid three">
        {tiles.map((t) => (
          <button key={t.title} type="button" className="card clickable stack" onClick={t.go}>
            <div className={`practice-icon ${t.tone}`}><Icon name={t.icon} /></div>
            <h3>{t.title}</h3>
            <p className="muted" style={{ fontSize: 13 }}>{t.body}</p>
          </button>
        ))}
      </div>

      <section className="card stack">
        <div className="row between wrap">
          <div><span className="eyebrow">Writing desk</span><h2>Letter tracing</h2></div>
          <span className="muted" style={{ fontSize: 13 }}>{pack.config.writingTip}</span>
        </div>
        <div className="row wrap" style={{ gap: 6 }}>
          {pack.letters.map((l) => (
            <button key={l.id} type="button" className={`chip ${l.id === letterId ? "active" : ""}`} onClick={() => setLetterId(l.id)} lang={pack.config.id} style={{ fontFamily: "var(--native-font)", fontSize: 18, padding: "4px 12px" }} aria-pressed={l.id === letterId} data-say={sayIt(l.script)}>
              {l.script}
            </button>
          ))}
        </div>
        {letter && (
          <div className="grid two" style={{ alignItems: "center" }}>
            <TraceBoard key={letter.id} glyph={letter.script} onScored={(s) => answer({ correct: s >= 0.3, skill: "letters", letterId: letter.id, traced: true, practice: true })} />
            <div className="stack">
              <Native size={64}>{letter.script}</Native>
              <h3>{letter.roman}</h3>
              <p className="muted">{letter.hint}</p>
              <span className="tag sky" style={{ alignSelf: "flex-start" }}>{letter.kind} · {letter.group}</span>
              <p className="muted" style={{ fontSize: 13 }}>Trace over the dotted guide, starting at the red dot. Use “Compare” to overlay the model letter on your drawing.</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

type DeckSource = "learned" | "saved" | "tricky" | "level";

export function FlashcardDeck() {
  const { progress, ix, curriculum, next, answer, saveWord } = useEngine();
  const [source, setSource] = useState<DeckSource>(Object.keys(progress.words).length >= 4 ? "learned" : "level");
  const pool = useMemo(() => {
    if (source === "saved") return progress.saved;
    if (source === "tricky") return weakWords(progress);
    if (source === "level") return curriculum.levels.find((l) => l.number === Math.max(4, next?.levelNumber ?? 4))?.vocabIds ?? [];
    return Object.keys(progress.words);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);
  const [deck, setDeck] = useState<string[]>(() => shuffle(pool).slice(0, 20));
  const [i, setI] = useState(0);
  const [known, setKnown] = useState(0);
  const [again, setAgain] = useState<string[]>([]);
  const [key, setKey] = useState(0);

  const restart = (src: DeckSource) => {
    setSource(src);
    const p = src === "saved" ? progress.saved : src === "tricky" ? weakWords(progress) : src === "level" ? curriculum.levels.find((l) => l.number === Math.max(4, next?.levelNumber ?? 4))?.vocabIds ?? [] : Object.keys(progress.words);
    setDeck(shuffle(p).slice(0, 20)); setI(0); setKnown(0); setAgain([]); setKey((k) => k + 1);
  };

  const id = deck[i];
  const v = id ? ix.vocab.get(id) : undefined;
  const ex: Exercise | null = v ? { key: `fc.${id}.${i}`, type: "flashcard", teaching: false, skill: "vocab", vocab: v, example: exampleFor(ix, v) } : null;

  return (
    <div className="stack lg" style={{ maxWidth: 640, margin: "0 auto" }}>
      <button type="button" className="btn sm ghost" style={{ alignSelf: "flex-start" }} onClick={() => go({ name: "practice" })}><Icon name="arrowLeft" /> Practice</button>
      <header><span className="eyebrow">Flashcards</span><h1>Word deck</h1></header>
      <div className="row wrap" style={{ gap: 6 }}>
        {(["learned", "saved", "tricky", "level"] as DeckSource[]).map((s) => (
          <button key={s} type="button" className={`chip ${source === s ? "active" : ""}`} onClick={() => restart(s)} aria-pressed={source === s}>
            {s === "learned" ? "All learned" : s === "saved" ? `Saved (${progress.saved.length})` : s === "tricky" ? "Tricky" : "Current level"}
          </button>
        ))}
      </div>
      {!deck.length ? (
        <Empty icon="cards" title="This deck is empty" body={source === "saved" ? "Save words from any word card to build your own deck." : "Learn some words first, then come back."} />
      ) : ex ? (
        <>
          <div className="row between"><span className="muted" style={{ fontWeight: 700 }}>{i + 1} / {deck.length}</span><Bar value={i / deck.length} /></div>
          <Flashcard key={`${key}.${i}`} ex={ex} locked={false} compact onAnswer={(a) => {
            answer({ correct: a.correct, skill: "vocab", vocabIds: [v!.id], practice: true });
            if (a.correct) setKnown((k) => k + 1); else setAgain((x) => [...x, v!.id]);
            setI((n) => n + 1);
          }} />
          <button type="button" className="btn sm ghost" style={{ alignSelf: "center" }} onClick={() => saveWord(v!.id)}>
            <Icon name="bookmark" filled={progress.saved.includes(v!.id)} /> {progress.saved.includes(v!.id) ? "Saved for later" : "Save for later"}
          </button>
        </>
      ) : (
        <div className="card stack" style={{ textAlign: "center", alignItems: "center" }}>
          <h2>Deck finished</h2>
          <p className="muted">{known} known · {again.length} to repeat</p>
          <div className="row wrap" style={{ justifyContent: "center" }}>
            {again.length > 0 && <button type="button" className="btn primary" onClick={() => { setDeck(shuffle(again)); setAgain([]); setI(0); setKnown(0); setKey((k) => k + 1); }}><Icon name="repeat" /> Repeat difficult words</button>}
            <button type="button" className="btn" onClick={() => restart(source)}><Icon name="shuffle" /> New shuffle</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function RevisionCentre() {
  const { progress, ix, curriculum } = useEngine();
  const due = dueWords(progress);
  const weak = weakWords(progress);
  const c = wordCounts(progress);
  const total = Math.max(1, c.learning + c.familiar + c.mastered);
  const completedSubs = curriculum.levels.flatMap((l) => l.sublevels).filter((s) => progress.sublevels[s.id]).slice(-6).reverse();

  return (
    <div className="stack lg">
      <button type="button" className="btn sm ghost" style={{ alignSelf: "flex-start" }} onClick={() => go({ name: "practice" })}><Icon name="arrowLeft" /> Practice</button>
      <header><span className="eyebrow">Revision centre</span><h1>Keep words from fading</h1><p className="muted">Words return on a schedule (1, 3, 7, 16 and then 35 days). Mistakes bring a word back sooner.</p></header>
      <div className="grid three">
        <div className="card stack"><span className="eyebrow">Due now</span><b style={{ fontFamily: "var(--font-display)", fontSize: 38 }}>{due.length}</b>
          <button type="button" className="btn leaf" disabled={!c.learned && !due.length} onClick={() => go({ name: "session", id: "revision" })}><Icon name="repeat" /> Review due words</button></div>
        <div className="card stack"><span className="eyebrow">Tricky words</span><b style={{ fontFamily: "var(--font-display)", fontSize: 38 }}>{weak.length}</b>
          <button type="button" className="btn" disabled={weak.length < 1} onClick={() => go({ name: "session", id: "weak" })}><Icon name="target" /> Drill mistakes</button></div>
        <div className="card stack"><span className="eyebrow">Saved</span><b style={{ fontFamily: "var(--font-display)", fontSize: 38 }}>{progress.saved.length}</b>
          <button type="button" className="btn" disabled={progress.saved.length < 1} onClick={() => go({ name: "session", id: "saved" })}><Icon name="bookmark" /> Review saved</button></div>
      </div>

      <section className="card stack">
        <span className="eyebrow">Memory strength</span>
        {[["Mastered", c.mastered, ""], ["Familiar", c.familiar, "saffron"], ["Learning", c.learning, "terracotta"]].map(([label, n, tone]) => (
          <div key={label as string} className="stack" style={{ gap: 4 }}>
            <div className="row between" style={{ fontWeight: 700, fontSize: 13 }}><span>{label}</span><span>{n as number}</span></div>
            <Bar value={(n as number) / total} tone={tone as "" | "saffron" | "terracotta"} />
          </div>
        ))}
      </section>

      {completedSubs.length > 0 && (
        <section className="card stack">
          <span className="eyebrow">Replay a completed sublevel</span>
          <div className="row wrap" style={{ gap: 8 }}>
            {completedSubs.map((s) => <button key={s.id} type="button" className="chip" onClick={() => go({ name: "session", id: s.id })}>L{s.levelNumber}.{s.index} · {s.title}</button>)}
          </div>
        </section>
      )}

      <section className="card">
        <span className="eyebrow">Needs revision</span>
        {weak.length === 0 && due.length === 0 ? <p className="muted" style={{ marginTop: 8 }}>Nothing urgent. Nice work.</p> : (
          <div className="table-wrap"><table className="data" style={{ marginTop: 8 }}>
            <thead><tr><th>Word</th><th>Meaning</th><th>Status</th><th>Mistakes</th></tr></thead>
            <tbody>
              {[...new Set([...weak, ...due])].slice(0, 30).map((id) => {
                const v = ix.vocab.get(id); const card = progress.words[id];
                return v ? <tr key={id}><td><Native size={18}>{v.script}</Native></td><td>{v.meaning}</td><td><span className="tag saffron">{mastery(card)}</span></td><td>{card.wrong}</td></tr> : null;
              })}
            </tbody>
          </table></div>
        )}
      </section>
    </div>
  );
}
