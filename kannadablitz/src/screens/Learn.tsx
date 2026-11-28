import type { CSSProperties } from "react";
import { go } from "../app/router";
import { findSublevel, isLevelUnlocked, levelProgress, sublevelState } from "../engine/progress";
import { useEngine } from "../engine/store";
import type { ExerciseType } from "../engine/types";
import { Icon } from "../ui/Icon";
import { Bar, Difficulty, Native, Postcard, Stars } from "../ui/kit";
import { useSayScript } from "../ui/phonetic";

const DIFF = ["", "Beginner", "Elementary", "Conversational", "Intermediate", "Proficient"];

export function Journey() {
  const { curriculum, progress, pack } = useEngine();
  return (
    <div className="stack lg">
      <header>
        <span className="eyebrow">The journey · {curriculum.totals.levels} levels · {curriculum.totals.sublevels} sublevels · {curriculum.totals.exercises} exercises</span>
        <h1>From first letter to fluent conversation</h1>
        <p className="muted" style={{ maxWidth: 620 }}>Each level is a stop on a route across {pack.config.region ?? "the map"}. Finish its sublevels to collect stamps, then the level's postcard.</p>
      </header>
      <div className="journey">
        {curriculum.levels.map((l, i) => {
          const unlocked = isLevelUnlocked(curriculum, progress, l.number);
          const complete = !!progress.levels[l.number];
          const p = levelProgress(progress, l);
          const pc = pack.postcards.find((x) => x.id === l.postcardId);
          return (
            <div key={l.number} className="stack" style={{ gap: 0 }}>
              {i > 0 && <div className="journey-connector" aria-hidden="true" />}
              <button
                type="button"
                className={`level-card ${complete ? "complete" : unlocked ? "unlocked" : "locked"}`}
                onClick={() => go({ name: "level", level: l.number })}
                aria-label={`Level ${l.number}: ${l.title}. ${complete ? "Complete" : unlocked ? `${Math.round(p * 100)}% done` : "Locked"}`}
              >
                <div className="level-badge" style={{ background: complete ? "var(--leaf)" : unlocked ? pc?.palette.accent ?? "var(--terracotta)" : "var(--line-strong)" }}>
                  {unlocked ? l.number : <Icon name="lock" />}
                  <small>{pc?.stampCode.split("-")[0]}</small>
                </div>
                <div className="stack" style={{ gap: 4, minWidth: 0 }}>
                  <Native size={16} style={{ color: "var(--terracotta)" }}>{l.titleScript}</Native>
                  <h3 style={{ fontSize: 18 }}>{l.title}</h3>
                  <p className="muted" style={{ fontSize: 13 }}>{l.objective}</p>
                  <div className="row wrap" style={{ gap: 10, fontSize: 12, fontWeight: 700 }}>
                    <Difficulty n={l.difficulty} /><span className="muted">{DIFF[l.difficulty]}</span>
                    <span className="muted">· {pc?.city}</span>
                  </div>
                  {unlocked && !complete && <div style={{ maxWidth: 260 }}><Bar value={p} label={`Level ${l.number} progress`} /></div>}
                  {!unlocked && <span className="muted" style={{ fontSize: 12, fontWeight: 700 }}>Unlocks after Level {l.number - 1}'s challenge</span>}
                </div>
                <div className="stack" style={{ alignItems: "center", gap: 2 }}>
                  {complete ? <span className="tag leaf"><Icon name="check" /> Postcard</span> : <span style={{ fontWeight: 800 }}>{Math.round(p * 100)}%</span>}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LevelScreen({ n }: { n: number }) {
  const { curriculum, progress, pack, state } = useEngine();
  const level = curriculum.levels.find((l) => l.number === n) ?? curriculum.levels[0];
  const unlocked = isLevelUnlocked(curriculum, progress, level.number);
  const pc = pack.postcards.find((x) => x.id === level.postcardId);
  const p = levelProgress(progress, level);
  const required = level.sublevels.filter((s) => s.required).length;

  return (
    <div className="stack lg">
      <button type="button" className="btn sm ghost" style={{ alignSelf: "flex-start" }} onClick={() => go({ name: "learn" })}><Icon name="arrowLeft" /> All levels</button>
      <header className="grid two" style={{ alignItems: "center" }}>
        <div className="stack">
          <span className="eyebrow">Level {level.number} of {curriculum.levels.length} · {DIFF[level.difficulty]}</span>
          <Native size={24} style={{ color: "var(--terracotta)" }}>{level.titleScript}</Native>
          <h1>{level.title}</h1>
          <p className="muted">{level.objective}</p>
          <div className="row wrap" style={{ fontWeight: 700, fontSize: 13 }}>
            <span className="tag ink">{required} sublevels + bonus</span>
            <span className="tag saffron">+{level.xp} XP · +{level.coins} coins</span>
            <span className="tag leaf">{level.vocabIds.length} words</span>
          </div>
          <Bar value={p} thick label="Level progress" />
          <span className="muted" style={{ fontSize: 13, fontWeight: 700 }}>{Math.round(p * 100)}% complete{!unlocked && ` · Finish Level ${level.number - 1} to unlock`}</span>
        </div>
        {pc && <Postcard pc={pc} levelTitle={`Level reward · ${level.title}`} date={progress.postcards[pc.id]} name={state.learner.name} locked={!progress.postcards[pc.id]} />}
      </header>

      <section className="path" aria-label="Sublevel path">
        {level.sublevels.map((s, i) => {
          const st = sublevelState(curriculum, progress, level, s);
          const rec = progress.sublevels[s.id];
          const o = Math.sin(i * 0.9);
          return (
            <div key={s.id} className="path-node-wrap">
              {i > 0 && <div className={`path-line path-shift ${st === "done" ? "done" : ""}`} style={{ "--o": (o + Math.sin((i - 1) * 0.9)) / 2 } as CSSProperties} />}
              <div className="path-shift" style={{ "--o": o } as CSSProperties}>
                {st === "current" && <span className="current-flag">Start</span>}
                <button
                  type="button"
                  className={`path-node ${st} ${s.kind}`}
                  disabled={st === "locked"}
                  onClick={() => go({ name: "sublevel", id: s.id })}
                  aria-label={`${s.index}. ${s.title}, ${st === "done" ? "complete" : st === "locked" ? "locked" : s.kind === "bonus" ? "optional" : "ready"}`}
                  lang={pack.config.id}
                >
                  <span>{st === "locked" ? <Icon name="lock" /> : st === "done" && s.kind === "lesson" ? <Icon name="check" /> : [...s.glyph].slice(0, 3).join("")}</span>
                </button>
                <div className="path-label">
                  {s.title}
                  <small>{s.kind === "lesson" ? `Sublevel ${s.index}` : s.kind === "milestone" ? "Milestone" : s.kind === "challenge" ? "Challenge" : "Optional"}</small>
                  {rec && <Stars n={rec.stars} />}
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

const TYPE_LABEL: Record<ExerciseType, { label: string; icon: string }> = {
  letter_learn: { label: "Letter cards", icon: "letter" },
  letter_pick: { label: "Letter → sound", icon: "speaker" },
  letter_find: { label: "Sound → letter", icon: "target" },
  letter_trace: { label: "Tracing & drawing", icon: "pen" },
  word_intro: { label: "New words", icon: "sparkle" },
  word_swipe: { label: "Swipe word builder", icon: "hand" },
  meaning_pick: { label: "Read & choose", icon: "eye" },
  script_pick: { label: "Recall the script", icon: "letter" },
  match_grid: { label: "Word matching", icon: "tiles" },
  match_columns: { label: "Column matching", icon: "cards" },
  sentence_build: { label: "Sentence building", icon: "tiles" },
  sentence_fill: { label: "Fill in the blank", icon: "pen" },
  phrase_reveal: { label: "Phrases", icon: "book" },
  flashcard: { label: "Flashcards", icon: "cards" },
  reading: { label: "Reading", icon: "scroll" },
};

export function SublevelIntro({ id }: { id: string }) {
  const { curriculum, progress, pack, ix, state } = useEngine();
  const sayIt = useSayScript();
  const sub = findSublevel(curriculum, id);
  if (!sub) return <p>Sublevel not found.</p>;
  const level = curriculum.levels.find((l) => l.number === sub.levelNumber)!;
  const st = sublevelState(curriculum, progress, level, sub);
  const types = [...new Set(sub.plan.map((p) => p.type))];
  const words = sub.vocabIds.map((v) => ix.vocab.get(v)).filter(Boolean).slice(0, 8);
  const letters = sub.letterIds.map((l) => ix.letters.get(l)).filter(Boolean);
  const noLives = state.settings.livesEnabled && state.lives.count === 0;
  const rec = progress.sublevels[sub.id];

  return (
    <div className="stack lg anim-rise" style={{ maxWidth: 720 }}>
      <button type="button" className="btn sm ghost" style={{ alignSelf: "flex-start" }} onClick={() => go({ name: "level", level: level.number })}><Icon name="arrowLeft" /> Level {level.number}</button>
      <header className="stack">
        <span className="eyebrow">Level {level.number} · {sub.kind === "lesson" ? `Sublevel ${sub.index}` : sub.kind}</span>
        <h1>{sub.title}</h1>
        <p className="muted">
          {sub.kind === "milestone" ? "A checkpoint that mixes everything from the first half of the level."
            : sub.kind === "challenge" ? (level.number === curriculum.levels.length ? "The final proficiency assessment: script, vocabulary, sentences and reading across the whole course." : "Harder recall and sentence building across the whole level. Pass it to unlock the next level.")
            : sub.kind === "bonus" ? "Optional extra practice. It isn't required to finish the level, but it earns a bonus stamp."
            : level.mode === "letters" || level.mode === "writing" ? "Meet each letter, hear it, and then trace it." : "Meet new words in native script first. Tap to reveal what they mean."}
        </p>
      </header>

      {letters.length > 0 && (
        <section className="card stack">
          <span className="eyebrow">Letters</span>
          <div className="row wrap" style={{ gap: 10 }}>
            {letters.map((l) => <div key={l!.id} className="tile native-tile" style={{ width: 72, minHeight: 72, fontSize: 34 }} lang={pack.config.id} data-say={sayIt(l!.script)}>{l!.script}</div>)}
          </div>
        </section>
      )}
      {words.length > 0 && (
        <section className="card stack">
          <span className="eyebrow">{sub.kind === "lesson" ? "Words you'll meet" : "Words in play"}</span>
          <div className="row wrap" style={{ gap: 8 }}>
            {words.map((v) => <span key={v!.id} className="chip"><Native>{v!.script}</Native></span>)}
          </div>
          <span className="muted" style={{ fontSize: 12 }}>Meanings are revealed during the lesson.</span>
        </section>
      )}

      <section className="card stack">
        <span className="eyebrow">10 exercises</span>
        <div className="row wrap" style={{ gap: 8 }}>
          {types.map((t) => <span key={t} className="chip"><Icon name={TYPE_LABEL[t].icon} /> {TYPE_LABEL[t].label}</span>)}
        </div>
        <hr className="divider" />
        <div className="row wrap" style={{ gap: 18 }}>
          <div className="stat"><b>+{sub.xp}</b><span>XP</span></div>
          <div className="stat"><b>+{sub.coins}</b><span>coins</span></div>
          <div className="stat"><b>+15</b><span>perfect bonus</span></div>
          {rec && <div className="stat"><b><Stars n={rec.stars} className="trace-score" /></b><span>your best</span></div>}
        </div>
      </section>

      {st === "locked" ? (
        <div className="card dashed"><Icon name="lock" /> Finish the earlier sublevels first.</div>
      ) : noLives ? (
        <div className="card stack" style={{ borderColor: "var(--danger)" }}>
          <strong>You're out of lives</strong>
          <p className="muted">You can still do this lesson in practice mode, or win a life back first.</p>
          <div className="row wrap">
            <button type="button" className="btn primary" onClick={() => go({ name: "session", id: sub.id })}>Start in practice mode</button>
            <button type="button" className="btn" onClick={() => go({ name: "lives" })}><Icon name="heart" /> Lives</button>
          </div>
        </div>
      ) : (
        <button type="button" className="btn primary lg block sticky-cta" onClick={() => go({ name: "session", id: sub.id })}>
          {rec ? "Practise again" : "Start"} <Icon name="arrowRight" />
        </button>
      )}
    </div>
  );
}
