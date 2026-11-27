import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { go } from "../app/router";
import { materializeAll, revisionPlans, sentencePracticePlans, wordQuizPlans } from "../engine/exercises";
import { dueWords, findSublevel, starsFor, sublevelState, weakWords } from "../engine/progress";
import { seeded, shuffle } from "../engine/rng";
import { useEngine } from "../engine/store";
import type { Exercise, ExercisePlan } from "../engine/types";
import { ExerciseView, type AnswerInfo } from "../exercises";
import { Icon } from "../ui/Icon";
import { Bar, DebugLabel, Hearts, Modal, Native, Stars } from "../ui/kit";
import { MascotAvatar, pickMascotLine } from "../ui/Mascot";

const PRAISE = ["Nicely done", "Exactly right", "Lovely", "Spot on", "You've got it", "Well read"];

interface Plan { title: string; exercises: Exercise[]; kind: "sublevel" | "revision" | "practice"; sublevelId?: string; recovery?: boolean }

function usePlan(id: string): Plan | null {
  const { curriculum, ix, progress, pack } = useEngine();
  // Re-randomise once per mount (a fresh attempt), not on every render.
  const seed = useRef(Date.now()).current;
  return useMemo(() => {
    const rng = seeded(seed);
    const sub = findSublevel(curriculum, id);
    if (sub) {
      const lvl = curriculum.levels.find((l) => l.number === sub.levelNumber)!;
      return { title: `${lvl.title} · ${sub.title}`, exercises: materializeAll(ix, sub.plan, sub.id, rng), kind: "sublevel", sublevelId: sub.id };
    }
    if (id === "sentences-build" || id === "sentences-fill") {
      const mode = id === "sentences-build" ? "build" : "fill";
      const allIds = shuffle(pack.sentences.map((s) => s.id), rng);
      const plans = sentencePracticePlans(allIds, mode, 8);
      return {
        title: mode === "build" ? "Sentence builder" : "Fill in the blank",
        exercises: materializeAll(ix, plans, `prac.${id}`, rng),
        kind: "practice",
      };
    }
    const learned = Object.entries(progress.words).filter(([, c]) => c.correct + c.wrong > 0).map(([k]) => k);
    const fallback = curriculum.levels.find((l) => l.mode !== "letters" && l.mode !== "writing")?.vocabIds.slice(0, 12) ?? pack.vocab.slice(0, 12).map((v) => v.id);
    if (id === "word-quiz") {
      const pool = shuffle([...new Set([...learned, ...fallback])], rng);
      const plans = wordQuizPlans(pool, 10);
      return {
        title: "Word translation",
        exercises: materializeAll(ix, plans, "prac.word-quiz", rng),
        kind: "practice",
      };
    }
    let ids: string[];
    let title: string;
    if (id === "saved") { ids = progress.saved; title = "Saved words"; }
    else if (id === "weak") { ids = weakWords(progress); title = "Tricky words"; }
    else if (id === "recovery") { ids = shuffle(learned.length >= 4 ? learned : fallback, rng); title = "Recovery round"; }
    else {
      const due = dueWords(progress);
      const weak = weakWords(progress).filter((w) => !due.includes(w));
      const recent = Object.entries(progress.words).sort((a, b) => b[1].lastSeen - a[1].lastSeen).map(([k]) => k);
      ids = [...new Set([...due, ...weak, ...recent])];
      title = "Spaced revision";
    }
    if (ids.length < 4) ids = [...new Set([...ids, ...fallback])];
    const plans: ExercisePlan[] = revisionPlans(ids, id === "recovery" ? 5 : 10);
    return { title, exercises: materializeAll(ix, plans, `rev.${id}`, rng), kind: id === "recovery" ? "practice" : "revision", recovery: id === "recovery" };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, curriculum, ix, seed]);
}

export function SessionScreen({ id }: { id: string }) {
  const engine = useEngine();
  const { state, pack } = engine;
  const plan = usePlan(id);
  // The plan is frozen per mount; the screen is keyed by session id in App.
  const [queue, setQueue] = useState<Exercise[]>(() => plan?.exercises ?? []);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState<AnswerInfo | null>(null);
  const [firstTryMistakes, setFirstTryMistakes] = useState(0);
  const [retried, setRetried] = useState<Set<string>>(new Set());
  const [xp, setXp] = useState(0);
  const [practiceMode, setPracticeMode] = useState(!state.settings.livesEnabled || plan?.kind === "practice" || !!plan?.recovery || state.lives.count === 0);
  const [outOfLives, setOutOfLives] = useState(false);
  const [confirmQuit, setConfirmQuit] = useState(false);
  const [done, setDone] = useState(false);
  const started = useRef(0);
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => { started.current = Date.now(); }, []);


  const lockedSub = plan?.sublevelId ? findSublevel(engine.curriculum, plan.sublevelId) : undefined;
  if (lockedSub && sublevelState(engine.curriculum, engine.progress, engine.curriculum.levels.find((l) => l.number === lockedSub.levelNumber)!, lockedSub) === "locked") {
    return (
      <div className="card stack" style={{ alignItems: "center", textAlign: "center" }}>
        <Icon name="lock" />
        <h2>This sublevel is still locked</h2>
        <p className="muted">Finish the earlier sublevels on the path first.</p>
        <button type="button" className="btn primary" onClick={() => go({ name: "level", level: lockedSub.levelNumber })}>Back to the path</button>
      </div>
    );
  }
  if (!plan || !queue.length) {
    return (
      <div className="card stack" style={{ alignItems: "center", textAlign: "center" }}>
        <h2>Nothing to practise yet</h2>
        <p className="muted">Learn a few words in the journey first. They'll show up here for revision.</p>
        <button type="button" className="btn primary" onClick={() => go({ name: "learn" })}>Go to the journey</button>
      </div>
    );
  }

  const ex = queue[idx];
  const isRetry = retried.has(ex.key) && idx >= (plan.exercises.length);
  const total = plan.exercises.filter((e) => !e.teaching).length;

  const handle = (a: AnswerInfo) => {
    if (answer) return;
    const practice = practiceMode || a.selfGraded;
    engine.answer({
      correct: a.correct,
      skill: ex.skill,
      vocabIds: ex.vocab ? [ex.vocab.id] : ex.pairs?.map((p) => p.id),
      letterId: ex.letter?.id,
      traced: ex.type === "letter_trace",
      teaching: ex.teaching && !a.selfGraded,
      practice,
    });
    if (a.correct) setXp((x) => x + (ex.teaching ? 2 : 10));
    if (!ex.teaching && !a.selfGraded && engine.state.settings.sound) navigator.vibrate?.(a.correct ? 10 : [25, 50, 25]);
    if (!a.correct && !ex.teaching && !isRetry) setFirstTryMistakes((m) => m + 1);
    if (!a.correct && !ex.teaching && !retried.has(ex.key)) {
      // repeat difficult items once at the end of the session
      setRetried((r) => new Set(r).add(ex.key));
      setQueue((q) => [...q, ex]);
    }
    // Teaching cards advance straight away; everything else shows feedback.
    if (ex.teaching && !a.selfGraded) return advance();
    setAnswer(a);
    const livesLeft = state.lives.count - (!a.correct && !practice && !ex.teaching ? 1 : 0);
    if (!a.correct && !practice && state.settings.livesEnabled && livesLeft <= 0) setTimeout(() => setOutOfLives(true), 600);
  };

  function advance() {
    setAnswer(null);
    if (idx + 1 >= queue.length) finish();
    else setIdx((i) => i + 1);
  }

  function finish() {
    const ms = Date.now() - started.current;
    setElapsed(ms);
    setDone(true);
    engine.completeSession({
      kind: plan!.kind === "sublevel" ? "sublevel" : plan!.kind,
      sublevelId: plan!.sublevelId,
      total,
      mistakes: firstTryMistakes,
      xpEarned: xp,
      durationMs: ms,
    });
    if (plan!.recovery) engine.recoverLife(0);
  }

  if (done) return <Results plan={plan} total={total} mistakes={firstTryMistakes} xp={xp} ms={elapsed} />;

  const correctLabel = (() => {
    if (ex.vocab && (ex.type === "meaning_pick" || ex.type === "script_pick")) return { native: ex.vocab.script, text: ex.vocab.meaning, roman: ex.vocab.roman };
    if (ex.letter && (ex.type === "letter_pick" || ex.type === "letter_find")) return { native: ex.letter.script, text: ex.letter.hint, roman: ex.letter.roman };
    if (ex.sentence) return { native: ex.sentence.tokens.join(" "), text: ex.sentence.meaning, roman: ex.sentence.roman };
    if (ex.reading) return { native: "", text: ex.reading.question.explanation, roman: "" };
    return null;
  })();

  return (
    <div className="anim-rise">
      <div className="session-top">
        <DebugLabel name="SessionTopBar" />
        <button type="button" className="icon-btn" onClick={() => setConfirmQuit(true)} aria-label="Leave session"><Icon name="x" /></button>
        <Bar value={(idx + (answer ? 1 : 0)) / queue.length} thick label="Session progress" />
        {practiceMode ? <span className="tag sky">Practice</span> : <Hearts count={state.lives.count} max={state.settings.maxLives} />}
      </div>
      {isRetry && <p className="tag terracotta" style={{ marginBottom: 12 }}><Icon name="repeat" /> Let's try that one again</p>}

      <ExerciseView key={`${ex.key}.${idx}`} ex={ex} onAnswer={handle} locked={!!answer} />

      {answer && <div className="feedback-spacer" aria-hidden="true" />}
      {answer && createPortal(
        <div className="feedback-portal">
          <div key={`${ex.key}.${idx}`} className={`feedback ${answer.correct ? "ok" : answer.selfGraded ? "neutral" : "bad"}`} role="status" aria-live="polite">
            <DebugLabel name="FeedbackSheet" />
            <div className="feedback-head">
              {pack.mascot ? (
                <MascotAvatar
                  mood={answer.correct ? "excited" : answer.selfGraded ? "thinking" : "encouraging"}
                  size={46}
                />
              ) : (
                <span className="feedback-badge" aria-hidden="true">
                  <Icon name={answer.correct ? "check" : answer.selfGraded ? "repeat" : "x"} />
                </span>
              )}
              <div className="feedback-title">
                <h3>
                  {answer.correct ? PRAISE[idx % PRAISE.length]
                    : answer.selfGraded ? "We'll bring this back soon"
                    : ex.type === "letter_trace" ? "Keep practising that shape"
                    : answer.mistakes ? `Done · ${answer.mistakes} mix-up${answer.mistakes > 1 ? "s" : ""}`
                    : "Not quite"}
                </h3>
                {pack.mascot && (() => {
                  const ml = pickMascotLine(pack.mascot.lines, answer.correct ? "correct" : "wrong", idx);
                  if (!ml) return null;
                  return (
                    <span className="feedback-mascot-line">
                      <Native size={14} say={false}>{ml.script}</Native>
                      <span className="muted">· {ml.meaning}</span>
                    </span>
                  );
                })()}
                {answer.correct && !ex.teaching && (
                  <span className="feedback-meta">+10 XP</span>
                )}
                {!answer.correct && !answer.selfGraded && !practiceMode && state.settings.livesEnabled && !ex.teaching && (
                  <span className="feedback-meta"><Icon name="heart" filled /> -1 life · Will retry later</span>
                )}
              </div>
            </div>

            {!answer.correct && correctLabel && (
              <div className="feedback-answer">
                <span className="eyebrow">Correct answer</span>
                <div className="feedback-answer-row">
                  {correctLabel.native && <Native as="span" size={22}>{correctLabel.native}</Native>}
                  <div className="detail">
                    {correctLabel.text} {correctLabel.roman && <span className="roman">· {correctLabel.roman}</span>}
                  </div>
                </div>
              </div>
            )}

            {answer.correct && (ex.type === "sentence_build" || ex.type === "sentence_fill") && ex.sentence?.note && <div className="feedback-note">{ex.sentence.note}</div>}
            {!answer.correct && ex.sentence?.note && <div className="feedback-note">{ex.sentence.note}</div>}

            <button type="button" className={`btn lg block ${answer.correct ? "leaf" : "ink"}`} onClick={advance} autoFocus>
              Continue <Icon name="arrowRight" />
            </button>
          </div>
        </div>,
        document.body,
      )}

      {outOfLives && (
        <Modal sheet label="Out of lives" onClose={() => setOutOfLives(false)}>
          <div className="stack" style={{ textAlign: "center", alignItems: "center" }}>
            <Hearts count={0} max={state.settings.maxLives} />
            <h2>You're out of lives</h2>
            <p className="muted">Mistakes are how you learn. Keep going without penalties, or win a life back with a short recovery round.</p>
            <button type="button" className="btn primary block lg" onClick={() => { setPracticeMode(true); setOutOfLives(false); }}>Keep going in practice mode</button>
            <button type="button" className="btn block" onClick={() => go({ name: "session", id: "recovery" })}><Icon name="heart" /> Recovery round (+1 life)</button>
            <button type="button" className="btn ghost block" onClick={() => go({ name: "lives" })}>See lives &amp; timer</button>
          </div>
        </Modal>
      )}
      {confirmQuit && (
        <Modal sheet label="Leave session" onClose={() => setConfirmQuit(false)}>
          <div className="stack" style={{ textAlign: "center" }}>
            <h2>Leave this session?</h2>
            <p className="muted">Words you've already answered are saved. The stamp is only awarded when you finish.</p>
            <button type="button" className="btn primary block" onClick={() => setConfirmQuit(false)}>Keep learning</button>
            <button type="button" className="btn ghost block" onClick={() => history.back()}>Leave</button>
          </div>
        </Modal>
      )}
      <span className="sr-only">{pack.config.name}</span>
    </div>
  );
}

function Results({ plan, total, mistakes, xp, ms }: { plan: Plan; total: number; mistakes: number; xp: number; ms: number }) {
  const { curriculum, ix } = useEngine();
  const stars = starsFor(total, mistakes);
  const acc = total ? Math.round(((total - mistakes) / total) * 100) : 100;
  const sub = plan.sublevelId ? findSublevel(curriculum, plan.sublevelId) : undefined;
  const words = [...new Set(plan.exercises.flatMap((e) => (e.vocab ? [e.vocab.id] : e.pairs?.map((p) => p.id) ?? [])))].slice(0, 8);
  return (
    <div className="stack lg anim-rise" style={{ alignItems: "center", textAlign: "center" }}>
      <DebugLabel name="SessionResults" />
      <span className="eyebrow">{plan.title}</span>
      <h1>{plan.kind === "sublevel" ? (stars === 3 ? "Flawless!" : "Sublevel complete") : plan.recovery ? "Life restored" : "Revision done"}</h1>
      {plan.kind === "sublevel" && <Stars n={stars} className="trace-score" />}
      <div className="grid four" style={{ width: "100%" }}>
        <div className="card stat"><b>{acc}%</b><span>First-try accuracy</span></div>
        <div className="card stat"><b>+{xp}</b><span>XP from answers</span></div>
        <div className="card stat"><b>{Math.max(1, Math.round(ms / 60000))}m</b><span>Time</span></div>
        <div className="card stat"><b>{total}</b><span>Questions</span></div>
      </div>
      {words.length > 0 && (
        <div className="card" style={{ width: "100%", textAlign: "left" }}>
          <span className="eyebrow">Words in this session</span>
          <div className="row wrap" style={{ marginTop: 10, gap: 8 }}>
            {words.map((id) => { const v = ix.vocab.get(id); return v ? <span key={id} className="chip"><Native>{v.script}</Native><span className="muted">{v.meaning}</span></span> : null; })}
          </div>
        </div>
      )}
      <div className="row" style={{ width: "100%" }}>
        {sub && <button type="button" className="btn block" onClick={() => go({ name: "sublevel", id: sub.id })}><Icon name="refresh" /> Again</button>}
        <button type="button" className="btn primary lg block" onClick={() => go(sub ? { name: "level", level: sub.levelNumber } : { name: "practice" })}>
          Continue <Icon name="arrowRight" />
        </button>
      </div>
    </div>
  );
}
