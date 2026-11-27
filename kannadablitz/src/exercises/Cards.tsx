import { useRef, useState } from "react";
import { useEngine } from "../engine/store";
import { Icon } from "../ui/Icon";
import { Art, Native, NativeWords, Roman, Say, SpeakButton } from "../ui/kit";
import type { ExerciseProps } from "./types";

/** Native-script-first reveal card: word + art first, meaning on tap. */
export function RevealWord({ ex, onAnswer, locked }: ExerciseProps) {
  const [open, setOpen] = useState(false);
  const { saveWord, progress } = useEngine();
  const v = ex.vocab!;
  const saved = progress.saved.includes(v.id);
  return (
    <div className="stack lg" style={{ alignItems: "center" }}>
      <p className="prompt" style={{ marginBottom: 0, alignSelf: "flex-start" }}>New word</p>
      <button type="button" className="reveal" onClick={() => setOpen(true)} aria-expanded={open}>
        <Art vocab={v} size={150} />
        <Native className={`native-word ${v.script.length > 9 ? "long" : ""}`} as="div">{v.script}</Native>
        {!open ? (
          <span className="reveal-hint"><Icon name="hand" /> Tap to reveal the meaning</span>
        ) : (
          <div className="reveal-body">
            <span className="meaning">{v.meaning}</span>
            <Roman force>{v.roman}</Roman>
            {ex.example && (
              <div className="example">
                <Native as="div">{ex.example.script}</Native>
                <span className="muted" style={{ fontSize: 13 }}>{ex.example.meaning}</span>
              </div>
            )}
          </div>
        )}
      </button>
      <div className="row" style={{ width: "100%" }}>
        <SpeakButton text={v.script} roman={v.roman} />
        <button type="button" className={`icon-btn`} onClick={() => saveWord(v.id)} aria-pressed={saved} aria-label={saved ? "Remove from saved words" : "Save word"}>
          <Icon name="bookmark" filled={saved} />
        </button>
        <button type="button" className="btn primary lg" style={{ flex: 1 }} disabled={!open || locked} onClick={() => onAnswer({ correct: true })}>
          Got it <Icon name="arrowRight" />
        </button>
      </div>
    </div>
  );
}

export function LetterLearn({ ex, onAnswer, locked }: ExerciseProps) {
  const l = ex.letter!;
  const { pack } = useEngine();
  return (
    <div className="stack lg" style={{ alignItems: "center", textAlign: "center" }}>
      <p className="prompt" style={{ marginBottom: 0, alignSelf: "flex-start" }}>Meet a letter</p>
      <div className="letter-hero"><span lang={pack.config.id}>{l.script}</span></div>
      <div className="stack" style={{ gap: 4, alignItems: "center" }}>
        <h1 style={{ fontFamily: "var(--font-ui)" }}>{l.roman}</h1>
        <Say roman={l.roman} />
        <span className="muted" style={{ fontWeight: 600 }}>{l.hint}</span>
        <span className="tag sky">{l.kind}</span>
      </div>
      {ex.vocab && (
        <div className="card warm row" style={{ width: "100%", textAlign: "left" }}>
          <Art vocab={ex.vocab} size={72} />
          <div className="stack" style={{ gap: 2 }}>
            <span className="eyebrow">As in</span>
            <div className="row" style={{ gap: 8 }}><Native size={26}>{ex.vocab.script}</Native></div>
            <span className="muted">{ex.vocab.meaning} · <Roman force>{ex.vocab.roman}</Roman></span>
          </div>
        </div>
      )}
      <div className="row" style={{ width: "100%" }}>
        <SpeakButton text={l.script} roman={l.roman} />
        <button type="button" className="btn primary lg" style={{ flex: 1 }} disabled={locked} onClick={() => onAnswer({ correct: true })}>
          Continue <Icon name="arrowRight" />
        </button>
      </div>
    </div>
  );
}

export function PhraseReveal({ ex, onAnswer, locked }: ExerciseProps) {
  const [open, setOpen] = useState(false);
  const p = ex.phrase!;
  return (
    <div className="stack lg">
      <p className="prompt" style={{ marginBottom: 0 }}>Everyday phrase <span className="tag saffron" style={{ verticalAlign: "middle" }}>{p.situation}</span></p>
      <button type="button" className="reveal" onClick={() => setOpen(true)} aria-expanded={open} style={{ minHeight: 260, justifyContent: "center" }}>
        <Native className="native-word long" as="div">{p.script}</Native>
        {!open ? (
          <span className="reveal-hint"><Icon name="hand" /> Tap for meaning & context</span>
        ) : (
          <div className="reveal-body">
            <span className="meaning">{p.meaning}</span>
            <Roman force>{p.roman}</Roman>
            <p className="muted" style={{ maxWidth: 420 }}>{p.context}</p>
          </div>
        )}
      </button>
      <div className="row">
        <SpeakButton text={p.script} roman={p.roman} />
        <button type="button" className="btn primary lg" style={{ flex: 1 }} disabled={!open || locked} onClick={() => onAnswer({ correct: true })}>
          Continue <Icon name="arrowRight" />
        </button>
      </div>
    </div>
  );
}

/** Flip card with self-grading. Swipe right = know it, left = needs practice. */
export function Flashcard({ ex, onAnswer, locked, compact = false }: ExerciseProps & { compact?: boolean }) {
  const [flipped, setFlipped] = useState(false);
  const [dx, setDx] = useState(0);
  const start = useRef<number | null>(null);
  const v = ex.vocab!;
  const grade = (knew: boolean) => !locked && onAnswer({ correct: knew, selfGraded: true });

  return (
    <div className="stack lg">
      {!compact && <p className="prompt" style={{ marginBottom: 0 }}>Do you know this word?</p>}
      <div
        className="flash flash-drag"
        style={{ transform: `translateX(${dx}px) rotate(${dx / 20}deg)` }}
        onPointerDown={(e) => { start.current = e.clientX; }}
        onPointerMove={(e) => { if (start.current !== null && flipped) setDx(e.clientX - start.current); }}
        onPointerUp={() => {
          if (flipped && Math.abs(dx) > 90) grade(dx > 0);
          else if (Math.abs(dx) < 6) setFlipped((f) => !f);
          setDx(0);
          start.current = null;
        }}
        onPointerCancel={() => { setDx(0); start.current = null; }}
        role="button"
        tabIndex={0}
        aria-label={flipped ? "Card back. Use the buttons to grade yourself." : "Card front. Press to flip."}
        onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); setFlipped((f) => !f); } }}
      >
        <div className={`flash-inner ${flipped ? "flipped" : ""}`}>
          <div className="flash-face">
            <Art vocab={v} size={170} />
            <Native size={v.script.length > 9 ? 40 : 58} as="div">{v.script}</Native>
            <span className="reveal-hint"><Icon name="refresh" /> Tap to flip</span>
          </div>
          <div className="flash-face back">
            <span className="eyebrow">Meaning</span>
            <h1>{v.meaning}</h1>
            <Roman force>{v.roman}</Roman>
            {ex.example && (
              <div className="example" style={{ width: "100%" }}>
                <Native as="div">{ex.example.script}</Native>
                <span className="muted" style={{ fontSize: 13 }}>{ex.example.meaning}</span>
              </div>
            )}
            <SpeakButton text={v.script} roman={v.roman} />
          </div>
        </div>
      </div>
      <div className="row">
        <button type="button" className="btn block" disabled={!flipped || locked} onClick={() => grade(false)}>
          <Icon name="repeat" /> Need practice
        </button>
        <button type="button" className="btn leaf block" disabled={!flipped || locked} onClick={() => grade(true)}>
          <Icon name="check" /> I know this
        </button>
      </div>
    </div>
  );
}

export function ReadingExercise({ ex, onAnswer, locked }: ExerciseProps) {
  const r = ex.reading!;
  const [showEn, setShowEn] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="stack lg">
      <p className="prompt" style={{ marginBottom: 0 }}>Reading room</p>
      <div className="card">
        <span className="eyebrow">{r.title}</span>
        <Native as="h2" size={26} style={{ margin: "6px 0 12px" }}>{r.titleScript}</Native>
        <div style={{ lineHeight: 1.7 }}><NativeWords text={r.script} size={19} /></div>
        <hr className="divider" />
        {showEn ? <p className="muted">{r.meaning}</p> : (
          <button type="button" className="btn sm ghost" onClick={() => setShowEn(true)}><Icon name="eye" /> Show translation</button>
        )}
      </div>
      <div>
        <p className="prompt" style={{ fontSize: 18 }}>{r.question.prompt}</p>
        <div className="choices">
          {r.question.options.map((o, i) => {
            const st = picked === null ? "" : i === r.question.answer ? "right" : i === picked ? "wrong" : "dim";
            return (
              <button key={o} type="button" className={`choice ${st}`} disabled={locked || picked !== null}
                onClick={() => { setPicked(i); onAnswer({ correct: i === r.question.answer, given: o }); }}>
                <span className="key">{i + 1}</span>{o}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
