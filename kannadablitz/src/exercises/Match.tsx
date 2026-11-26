import { useMemo, useState } from "react";
import { shuffle } from "../engine/rng";
import { useEngine } from "../engine/store";
import type { PairItem } from "../engine/types";
import { usePhonetic } from "../ui/phonetic";
import type { ExerciseProps } from "./types";

type Side = "n" | "m";
interface Card { key: string; pairId: string; side: Side; text: string; roman?: string }

function useMatcher(pairs: PairItem[], onDone: (mistakes: number) => void) {
  const [sel, setSel] = useState<Card | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [miss, setMiss] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);

  const tap = (c: Card) => {
    if (matched.has(c.pairId)) return;
    if (!sel || sel.side === c.side) {
      setSel(sel?.key === c.key ? null : c);
      return;
    }
    if (sel.pairId === c.pairId) {
      const m = new Set(matched).add(c.pairId);
      setMatched(m);
      setSel(null);
      if (m.size === pairs.length) setTimeout(() => onDone(mistakes), 350);
    } else {
      setMistakes((x) => x + 1);
      setMiss([sel.key, c.key]);
      setSel(null);
      setTimeout(() => setMiss([]), 420);
    }
  };
  const cls = (c: Card) =>
    `tile ${c.side === "n" ? "native-tile" : ""} ${matched.has(c.pairId) ? "matched" : ""} ${sel?.key === c.key ? "selected" : ""} ${miss.includes(c.key) ? "miss" : ""}`;
  return { tap, cls, matched, mistakes };
}

const toCards = (pairs: PairItem[]): Card[] =>
  pairs.flatMap((p) => [
    { key: `${p.id}.n`, pairId: p.id, side: "n" as const, text: p.script, roman: p.roman },
    { key: `${p.id}.m`, pairId: p.id, side: "m" as const, text: p.meaning },
  ]);

/** Tile grid: native and meaning tiles mixed together. */
export function MatchGrid({ ex, onAnswer, locked }: ExerciseProps) {
  const lang = useEngine().pack.config.id;
  const say = usePhonetic();
  const pairs = useMemo(() => ex.pairs ?? [], [ex.pairs]);
  const cards = useMemo(() => shuffle(toCards(pairs)), [pairs]);
  const m = useMatcher(pairs, (mistakes) => onAnswer({ correct: mistakes === 0, mistakes }));
  return (
    <div>
      <p className="prompt">Match the pairs</p>
      <p className="prompt-sub">Tap a word, then its meaning. {m.matched.size}/{pairs.length} matched</p>
      <div className="match-grid">
        {cards.map((c) => (
          <button key={c.key} type="button" className={m.cls(c)} disabled={locked || m.matched.has(c.pairId)} onClick={() => m.tap(c)} lang={c.side === "n" ? lang : undefined} data-say={c.side === "n" ? say(c.roman) : undefined}>
            {c.text}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Two vertical columns: native script left, meanings right. */
export function MatchColumns({ ex, onAnswer, locked }: ExerciseProps) {
  const lang = useEngine().pack.config.id;
  const say = usePhonetic();
  const pairs = useMemo(() => ex.pairs ?? [], [ex.pairs]);
  const left = useMemo(() => shuffle(toCards(pairs).filter((c) => c.side === "n")), [pairs]);
  const right = useMemo(() => shuffle(toCards(pairs).filter((c) => c.side === "m")), [pairs]);
  const m = useMatcher(pairs, (mistakes) => onAnswer({ correct: mistakes === 0, mistakes }));
  return (
    <div>
      <p className="prompt">Connect each word to its meaning</p>
      <p className="prompt-sub">{m.matched.size}/{pairs.length} pairs</p>
      <div className="columns">
        <div className="col">
          <div className="col-head">Script</div>
          {left.map((c) => (
            <button key={c.key} type="button" className={m.cls(c)} disabled={locked || m.matched.has(c.pairId)} onClick={() => m.tap(c)} lang={lang} data-say={say(c.roman)}>{c.text}</button>
          ))}
        </div>
        <div className="col">
          <div className="col-head">Meaning</div>
          {right.map((c) => (
            <button key={c.key} type="button" className={m.cls(c)} disabled={locked || m.matched.has(c.pairId)} onClick={() => m.tap(c)}>{c.text}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
