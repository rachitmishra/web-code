import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { go } from "../app/router";
import { shuffle } from "../engine/rng";
import { useEngine } from "../engine/store";
import type { VocabEntry } from "../content/schema";
import { Icon } from "../ui/Icon";
import { Bar, Hearts } from "../ui/kit";
import { useSayScript } from "../ui/phonetic";

const BOARD = 5;
const GAME_LIVES = 3;

interface Slot { v: VocabEntry; key: string }

export function FastMatch() {
  const { progress, curriculum, next, ix, fastMatchDone, state } = useEngine();
  const [seconds, setSeconds] = useState<30 | 60>(30);
  const [phase, setPhase] = useState<"setup" | "count" | "play" | "end">("setup");
  const [count, setCount] = useState(3);
  const [result, setResult] = useState<{ score: number; pairs: number; attempts: number; bestCombo: number; newBest: boolean } | null>(null);

  const pool = useMemo(() => {
    const learned = Object.keys(progress.words);
    const lvl = curriculum.levels.filter((l) => l.mode !== "letters" && l.mode !== "writing" && l.number <= Math.max(5, (next?.levelNumber ?? 4) + 1)).flatMap((l) => l.vocabIds);
    const ids = [...new Set([...learned, ...lvl])];
    const seenS = new Set<string>(); const seenM = new Set<string>();
    return ids.map((id) => ix.vocab.get(id)!).filter((v) => {
      if (!v || seenS.has(v.script) || seenM.has(v.meaning.toLowerCase()) || v.script.length > 14) return false;
      seenS.add(v.script); seenM.add(v.meaning.toLowerCase()); return true;
    });
  }, [progress.words, curriculum, next, ix]);

  useEffect(() => {
    if (phase !== "count") return;
    const t = setTimeout(() => {
      if (count <= 1) setPhase("play");
      setCount((c) => c - 1);
    }, 650);
    return () => clearTimeout(t);
  }, [phase, count]);

  const best = seconds === 30 ? progress.stats.fastMatchBest30 : progress.stats.fastMatchBest60;

  if (phase === "setup" || phase === "count") {
    return (
      <div className="stack lg" style={{ alignItems: "center", textAlign: "center" }}>
        <button type="button" className="btn sm ghost" style={{ alignSelf: "flex-start" }} onClick={() => go({ name: "practice" })}><Icon name="arrowLeft" /> Practice</button>
        <div style={{ width: 96, height: 96, borderRadius: 28, background: "var(--saffron)", display: "grid", placeItems: "center", border: "3px solid var(--ink)", boxShadow: "0 6px 0 var(--ink)" }}><Icon name="bolt" /></div>
        <h1>Fast Match</h1>
        <p className="muted" style={{ maxWidth: 440 }}>Match native words to their meanings as fast as you can. Every three in a row raises your multiplier. Three misses end the round.</p>
        {phase === "count" ? (
          <div className="native" style={{ fontSize: 120, fontFamily: "var(--font-display)", color: "var(--terracotta)" }} aria-live="assertive">{count > 0 ? count : "Go!"}</div>
        ) : (
          <>
            <div className="row" role="radiogroup" aria-label="Round length">
              {([30, 60] as const).map((s) => (
                <button key={s} type="button" role="radio" aria-checked={seconds === s} className={`option-card ${seconds === s ? "active" : ""}`} style={{ flexDirection: "column", minWidth: 140 }} onClick={() => setSeconds(s)}>
                  <strong style={{ fontSize: 26, fontFamily: "var(--font-display)" }}>{s}s</strong>
                  <span className="muted" style={{ fontSize: 12 }}>Best {s === 30 ? progress.stats.fastMatchBest30 : progress.stats.fastMatchBest60}</span>
                </button>
              ))}
            </div>
            <span className="muted" style={{ fontSize: 13 }}>{pool.length} words in your pool · best combo ×{progress.stats.fastMatchBestCombo}</span>
            <button type="button" className="btn primary lg" style={{ minWidth: 240 }} disabled={pool.length < BOARD} onClick={() => { setCount(3); setPhase("count"); }}>Play</button>
          </>
        )}
      </div>
    );
  }

  if (phase === "play") {
    return (
      <Game
        pool={pool}
        seconds={seconds}
        reducedMotion={state.settings.reducedMotion}
        onEnd={(r) => {
          const { newBest } = fastMatchDone({ seconds, ...r });
          setResult({ ...r, newBest });
          setPhase("end");
        }}
      />
    );
  }

  const r = result!;
  const acc = r.attempts ? Math.round((r.pairs / r.attempts) * 100) : 0;
  return (
    <div className="stack lg anim-rise" style={{ alignItems: "center", textAlign: "center" }}>
      <span className="eyebrow">Fast Match · {seconds}s</span>
      <h1>{r.newBest ? "New best score!" : "Round over"}</h1>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 72, fontWeight: 800, color: "var(--terracotta)", lineHeight: 1 }}>{r.score}</div>
      <div className="grid four" style={{ width: "100%" }}>
        <div className="card stat"><b>{r.pairs}</b><span>Pairs</span></div>
        <div className="card stat"><b>{acc}%</b><span>Accuracy</span></div>
        <div className="card stat"><b>×{r.bestCombo}</b><span>Best combo</span></div>
        <div className="card stat"><b>{Math.max(best, r.score)}</b><span>Best score</span></div>
      </div>
      <div className="row" style={{ width: "100%" }}>
        <button type="button" className="btn block" onClick={() => go({ name: "practice" })}>Done</button>
        <button type="button" className="btn primary lg block" onClick={() => { setCount(3); setPhase("count"); }}><Icon name="refresh" /> Replay</button>
      </div>
    </div>
  );
}

function Game({ pool, seconds, onEnd, reducedMotion }: {
  pool: VocabEntry[]; seconds: number; reducedMotion: boolean;
  onEnd: (r: { score: number; pairs: number; attempts: number; bestCombo: number; durationMs: number }) => void;
}) {
  const { pack } = useEngine();
  const sayIt = useSayScript();
  const deck = useRef(shuffle(pool));
  const cursor = useRef(0);
  const draw = useCallback((): Slot => {
    const v = deck.current[cursor.current % deck.current.length];
    cursor.current++;
    if (cursor.current % deck.current.length === 0) deck.current = shuffle(pool);
    return { v, key: `${v.id}.${cursor.current}` };
  }, [pool]);
  const initial = useMemo(() => {
    const s: Slot[] = [];
    while (s.length < BOARD) { const x = draw(); if (!s.some((y) => y.v.id === x.v.id)) s.push(x); }
    return s;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [left, setLeft] = useState<Slot[]>(initial);
  const [right, setRight] = useState<Slot[]>(() => shuffle(initial));
  const [sel, setSel] = useState<{ side: "l" | "r"; id: string } | null>(null);
  const [flash, setFlash] = useState<{ ok: string[]; bad: string[] }>({ ok: [], bad: [] });
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [pairs, setPairs] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [lives, setLives] = useState(GAME_LIVES);
  const [left_ms, setLeftMs] = useState(seconds * 1000);
  const startedAt = useRef(Date.now());
  const ended = useRef(false);
  const mult = 1 + Math.floor(combo / 3);

  const end = useCallback(() => {
    if (ended.current) return;
    ended.current = true;
    onEnd({ score, pairs, attempts, bestCombo, durationMs: Date.now() - startedAt.current });
  }, [onEnd, score, pairs, attempts, bestCombo]);

  useEffect(() => {
    const t = setInterval(() => {
      const remain = seconds * 1000 - (Date.now() - startedAt.current);
      setLeftMs(Math.max(0, remain));
    }, 100);
    return () => clearInterval(t);
  }, [seconds]);
  useEffect(() => { if (left_ms <= 0 || lives <= 0) end(); }, [left_ms, lives, end]);

  const tap = (side: "l" | "r", id: string) => {
    if (ended.current) return;
    if (!sel || sel.side === side) { setSel(sel?.id === id && sel.side === side ? null : { side, id }); return; }
    const lId = side === "l" ? id : sel.id;
    const rId = side === "r" ? id : sel.id;
    setAttempts((a) => a + 1);
    setSel(null);
    if (lId === rId) {
      const c = combo + 1;
      setCombo(c);
      setBestCombo((b) => Math.max(b, c));
      setScore((s) => s + 10 * (1 + Math.floor(c / 3)));
      setPairs((p) => p + 1);
      setFlash({ ok: [lId], bad: [] });
      setTimeout(() => {
        let n = draw();
        let guard = 0;
        while ((left.some((x) => x.v.id === n.v.id) && n.v.id !== lId) && guard++ < 20) n = draw();
        setLeft((L) => L.map((x) => (x.v.id === lId ? n : x)));
        // put the new meaning at a random position so columns don't line up
        setRight((R) => {
          const rest = R.filter((x) => x.v.id !== lId);
          const pos = Math.floor(Math.random() * (rest.length + 1));
          return [...rest.slice(0, pos), n, ...rest.slice(pos)];
        });
        setFlash({ ok: [], bad: [] });
      }, reducedMotion ? 0 : 180);
    } else {
      setCombo(0);
      setLives((l) => l - 1);
      setFlash({ ok: [], bad: [lId, rId] });
      setTimeout(() => setFlash({ ok: [], bad: [] }), 300);
    }
  };

  const cls = (side: "l" | "r", id: string) =>
    `tile ${side === "l" ? "native-tile" : ""} ${sel?.side === side && sel.id === id ? "selected" : ""} ${flash.ok.includes(id) ? "matched" : ""} ${flash.bad.includes(id) && sel === null ? "miss" : ""}`;

  return (
    <div className="stack">
      <div className="session-top" style={{ marginBottom: 8 }}>
        <button type="button" className="icon-btn" onClick={end} aria-label="End round"><Icon name="pause" /></button>
        <Bar value={left_ms / (seconds * 1000)} thick tone={left_ms < 8000 ? "terracotta" : "saffron"} label="Time left" />
        <strong style={{ fontVariantNumeric: "tabular-nums", minWidth: 40 }}>{Math.ceil(left_ms / 1000)}s</strong>
      </div>
      <div className="row between wrap" style={{ marginBottom: 12 }}>
        <div className="row" style={{ gap: 16 }}>
          <div className="stat"><b style={{ color: "var(--terracotta)" }}>{score}</b><span>score</span></div>
          <div className="stat"><b>×{mult}</b><span>combo {combo}</span></div>
          <div className="stat"><b>{pairs}</b><span>pairs</span></div>
          <div className="stat"><b>{attempts ? Math.round((pairs / attempts) * 100) : 100}%</b><span>accuracy</span></div>
        </div>
        <Hearts count={lives} max={GAME_LIVES} />
      </div>
      <div className="columns">
        <div className="col">{left.map((s) => <button key={s.key} type="button" className={cls("l", s.v.id)} onClick={() => tap("l", s.v.id)} lang={pack.config.id} data-say={sayIt(s.v.script)}>{s.v.script}</button>)}</div>
        <div className="col">{right.map((s) => <button key={s.key} type="button" className={cls("r", s.v.id)} onClick={() => tap("r", s.v.id)}>{s.v.meaning}</button>)}</div>
      </div>
    </div>
  );
}
