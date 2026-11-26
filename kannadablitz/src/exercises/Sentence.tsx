import { useEffect, useRef, useState, type PointerEvent } from "react";
import { checkSentence } from "../engine/exercises";
import { useEngine } from "../engine/store";
import { Icon } from "../ui/Icon";
import { Roman, SpeakButton } from "../ui/kit";
import type { ExerciseProps } from "./types";
import { useSayScript } from "../ui/phonetic";

/**
 * Tap a tile to add it, tap a placed tile to remove it, or drag placed tiles
 * to reorder them. Bank tiles can also be dragged straight onto the line.
 */
export function SentenceBuild({ ex, onAnswer, locked }: ExerciseProps) {
  const { pack } = useEngine();
  const sayIt = useSayScript();
  const s = ex.sentence!;
  const tiles = ex.tiles ?? [];
  const [line, setLine] = useState<string[]>([]);
  const [drag, setDrag] = useState<{ id: string; from: "bank" | "line"; x: number; y: number; moved: boolean } | null>(null);
  const [dropAt, setDropAt] = useState<number | null>(null);
  const [showMeaning, setShowMeaning] = useState(true);
  const lineRef = useRef<HTMLDivElement>(null);
  const textOf = (id: string) => tiles.find((t) => t.id === id)?.text ?? "";

  const add = (id: string, at?: number) => {
    if (locked) return;
    setLine((l) => {
      const without = l.filter((x) => x !== id);
      const i = at === undefined ? without.length : Math.min(at, without.length);
      return [...without.slice(0, i), id, ...without.slice(i)];
    });
  };
  const remove = (id: string) => !locked && setLine((l) => l.filter((x) => x !== id));

  const indexAtPoint = (x: number, y: number): number => {
    const el = lineRef.current;
    if (!el) return line.length;
    const kids = [...el.querySelectorAll<HTMLElement>("[data-tile]")];
    for (let i = 0; i < kids.length; i++) {
      const r = kids[i].getBoundingClientRect();
      if (y < r.bottom && x < r.left + r.width / 2) return i;
    }
    return kids.length;
  };

  const startDrag = (id: string, from: "bank" | "line") => (e: PointerEvent) => {
    if (locked) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setDrag({ id, from, x: e.clientX, y: e.clientY, moved: false });
  };
  const moveDrag = (e: PointerEvent) => {
    if (!drag) return;
    const moved = drag.moved || Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 8;
    if (moved !== drag.moved) setDrag({ ...drag, moved });
    if (!moved) return;
    const r = lineRef.current?.getBoundingClientRect();
    const over = r && e.clientY >= r.top - 30 && e.clientY <= r.bottom + 30;
    setDropAt(over ? indexAtPoint(e.clientX, e.clientY) : null);
  };
  const endDrag = (id: string) => () => {
    if (!drag) return;
    if (!drag.moved) {
      // a tap: bank → line, line → bank
      if (drag.from === "bank") add(id);
      else remove(id);
    } else if (dropAt !== null) add(id, dropAt);
    else if (drag.from === "line") remove(id);
    setDrag(null);
    setDropAt(null);
  };

  const check = () => {
    const words = line.map(textOf);
    onAnswer({ correct: checkSentence(s, words), given: words.join(" ") });
  };

  return (
    <div>
      <p className="prompt">Build the sentence</p>
      <div className="row between" style={{ marginBottom: 6 }}>
        {showMeaning ? <h2 style={{ fontFamily: "var(--font-ui)", fontSize: 19 }}>“{s.meaning}”</h2> : <span className="muted">Meaning hidden: build from memory</span>}
        <button type="button" className="btn sm ghost" onClick={() => setShowMeaning((x) => !x)}><Icon name="eye" /> {showMeaning ? "Hide" : "Show"}</button>
      </div>
      <div className="answer-line" ref={lineRef} aria-label="Your sentence">
        {line.length === 0 && <span className="faint" style={{ alignSelf: "center" }}>Tap or drag the words here</span>}
        {line.map((id, i) => (
          <button
            key={id}
            type="button"
            data-tile
            lang={pack.config.id}
            className={`word-tile ${drag?.id === id ? "dragging" : ""} ${dropAt === i && drag && drag.id !== id ? "drop-before" : ""}`}
            onPointerDown={startDrag(id, "line")}
            onPointerMove={moveDrag}
            onPointerUp={endDrag(id)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); remove(id); } }}
            disabled={locked}
            data-say={sayIt(textOf(id))}
          >
            {textOf(id)}
          </button>
        ))}
      </div>
      <div className="bank" aria-label="Word bank">
        {tiles.map((t) => (
          <button
            key={t.id}
            type="button"
            lang={pack.config.id}
            className={`word-tile ${line.includes(t.id) ? "ghost" : ""} ${drag?.id === t.id ? "dragging" : ""}`}
            onPointerDown={startDrag(t.id, "bank")}
            onPointerMove={moveDrag}
            onPointerUp={endDrag(t.id)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); add(t.id); } }}
            disabled={locked || line.includes(t.id)}
            data-say={sayIt(t.text)}
          >
            {t.text}
          </button>
        ))}
      </div>
      {locked && (
        <div className="row" style={{ marginTop: 14, justifyContent: "center", gap: 10 }}>
          <Roman force>{s.roman}</Roman>
          <SpeakButton text={s.tokens.join(" ")} roman={s.roman} small />
        </div>
      )}
      {!locked && (
        <div className="row" style={{ marginTop: 26 }}>
          <button type="button" className="btn" onClick={() => setLine([])} disabled={!line.length}><Icon name="eraser" /> Clear</button>
          <button type="button" className="btn primary lg" style={{ flex: 1 }} onClick={check} disabled={line.length < 2}>Check</button>
        </div>
      )}
    </div>
  );
}

/** Fill-in-the-blank: read a real sentence with one missing word and pick the right tile. */
export function SentenceFill({ ex, onAnswer, locked }: ExerciseProps) {
  const { pack } = useEngine();
  const sayIt = useSayScript();
  const s = ex.sentence!;
  const blankIndex = ex.blankIndex ?? 0;
  const choices = ex.choices ?? [];
  const [picked, setPicked] = useState<string | null>(null);
  const [showMeaning, setShowMeaning] = useState(true);

  const choose = (id: string) => {
    if (locked || picked) return;
    setPicked(id);
    const c = choices.find((x) => x.id === id);
    if (!c) return;
    onAnswer({ correct: c.correct, given: c.label });
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= choices.length) choose(choices[n - 1].id);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  const pickedChoice = choices.find((c) => c.id === picked);
  const blankState = !pickedChoice ? "" : pickedChoice.correct ? "right" : "wrong";

  return (
    <div>
      <p className="prompt">Fill in the blank</p>
      <div className="row between" style={{ marginBottom: 12 }}>
        {showMeaning ? <h2 style={{ fontFamily: "var(--font-ui)", fontSize: 19 }}>“{s.meaning}”</h2> : <span className="muted">Meaning hidden: read from context</span>}
        <button type="button" className="btn sm ghost" onClick={() => setShowMeaning((x) => !x)}><Icon name="eye" /> {showMeaning ? "Hide" : "Show"}</button>
      </div>

      <div className="sentence-fill-card" aria-label="Sentence with blank">
        {s.tokens.map((tok, i) =>
          i === blankIndex ? (
            <span
              key={i}
              lang={pack.config.id}
              className={`sentence-blank ${blankState}`}
              data-say={pickedChoice ? sayIt(pickedChoice.label) : undefined}
              aria-label={pickedChoice ? `Selected word: ${pickedChoice.label}` : "Blank word"}
            >
              {pickedChoice ? pickedChoice.label : "_____"}
            </span>
          ) : (
            <span key={i} lang={pack.config.id} className="sentence-tok" data-say={sayIt(tok)}>
              {tok}
            </span>
          ),
        )}
      </div>

      <div className="choices" role="group" aria-label="Word choices" style={{ marginTop: 22 }}>
        {choices.map((c, i) => {
          const st = picked ? (c.correct ? "right" : c.id === picked ? "wrong" : "dim") : "";
          return (
            <button
              key={c.id}
              type="button"
              className={`choice native-choice ${st}`}
              onClick={() => choose(c.id)}
              disabled={locked || !!picked}
              lang={pack.config.id}
              data-say={!picked ? sayIt(c.label) : undefined}
            >
              <span className="key">{i + 1}</span>
              <span>{c.label}</span>
              {c.sub && picked && <small>{c.sub}</small>}
            </button>
          );
        })}
      </div>

      {locked && (
        <div className="row" style={{ marginTop: 14, justifyContent: "center", gap: 10 }}>
          <Roman force>{s.roman}</Roman>
          <SpeakButton text={s.tokens.join(" ")} roman={s.roman} small />
        </div>
      )}
    </div>
  );
}
