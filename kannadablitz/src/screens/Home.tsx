import { useState } from "react";
import { go } from "../app/router";
import { dayKey, lastNDays } from "../engine/date";
import { dueWords, levelProgress, liveStreak, packOf, wordCounts } from "../engine/progress";
import { hashString } from "../engine/rng";
import { useEngine } from "../engine/store";
import { Icon } from "../ui/Icon";
import { Bar, DebugLabel, Native, Postcard, Ring, Roman, Stamp } from "../ui/kit";
import { MascotGreetingCard } from "../ui/Mascot";
import { DailyWordCard } from "./DailyWord";

function greeting(): string {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

function mascotContext(today: number, goal: number, streak: number) {
  if (today >= goal) return "goal_done" as const;
  const h = new Date().getHours();
  if (h < 12) return "morning" as const;
  if (h < 17) return "afternoon" as const;
  if (streak >= 3 && h >= 17 && h < 19) return "streak" as const;
  return "evening" as const;
}

export function WeekChart() {
  const { state } = useEngine();
  const days = lastNDays(7);
  const max = Math.max(state.learner.goalXp, ...days.map((d) => state.days[d]?.xp ?? 0));
  const today = dayKey();
  return (
    <div className="week" aria-label="XP over the last seven days">
      <DebugLabel name="WeekChart" />
      {days.map((d) => {
        const xp = state.days[d]?.xp ?? 0;
        const met = xp >= state.learner.goalXp;
        return (
          <div key={d} className={`day ${d === today ? "today" : ""}`} title={`${d}: ${xp} XP`}>
            <div className={`col ${met ? "met" : xp ? "some" : ""}`} style={{ height: `${Math.max(6, (xp / max) * 100)}%` }} />
            <span>{new Date(d + "T12:00").toLocaleDateString(undefined, { weekday: "narrow" })}</span>
          </div>
        );
      })}
    </div>
  );
}

export function Home() {
  const engine = useEngine();
  const { state, progress, curriculum, next, pack, ix } = engine;
  const today = state.days[dayKey()]?.xp ?? 0;
  const goal = state.learner.goalXp;
  const streak = liveStreak(state);
  const level = curriculum.levels.find((l) => l.number === (next?.levelNumber ?? curriculum.levels.length))!;
  const totalReq = curriculum.levels.reduce((n, l) => n + l.sublevels.filter((s) => s.required).length, 0);
  const doneReq = curriculum.levels.reduce((n, l) => n + l.sublevels.filter((s) => s.required && progress.sublevels[s.id]).length, 0);
  const due = dueWords(progress).length;
  const counts = wordCounts(progress);
  const greetPhrase = pack.phrases.find((p) => p.situation === "greetings");
  const phraseOfDay = pack.phrases[hashString(dayKey()) % pack.phrases.length];
  const [phraseOpen, setPhraseOpen] = useState(false);
  const recent = Object.entries(progress.words).sort((a, b) => b[1].lastSeen - a[1].lastSeen).slice(0, 8).map(([id]) => ix.vocab.get(id)).filter(Boolean);
  const pc = pack.postcards.find((p) => p.id === level.postcardId);
  const lp = levelProgress(packOf(state), level);

  return (
    <div className="stack lg">
      <header className="anim-rise stack" style={{ gap: 4, alignItems: "flex-start", textAlign: "left" }}>
        {greetPhrase && <Native as="div" size={18} style={{ color: "var(--terracotta)", textAlign: "left" }}>{greetPhrase.script}</Native>}
        <h1>{greeting()}, {state.learner.name}</h1>
        <p className="muted" style={{ fontWeight: 600 }}>
          {today >= goal ? "Today's goal is done. Anything more is a bonus." : streak > 0 ? `Keep your ${streak}-day streak alive with one short lesson.` : "One short lesson today starts a streak."}
        </p>
      </header>

      <MascotGreetingCard context={mascotContext(today, goal, streak)} learnerName={state.learner.name} />

      <div className="grid two">
        <section className="card ink stack" aria-label="Continue learning">
          <DebugLabel name="ContinueCard" />
          <div className="row between">
            <span className="eyebrow" style={{ color: "rgba(255, 247, 230,.7)" }}>Level {level.number} · {next ? `Sublevel ${next.index}` : "Complete"}</span>
            <span className="tag saffron">{level.difficulty <= 1 ? "Beginner" : level.difficulty <= 3 ? "Intermediate" : "Advanced"}</span>
          </div>
          <div>
            <Native size={22} style={{ color: "var(--saffron)" }}>{level.titleScript}</Native>
            <h2 style={{ color: "var(--paper)" }}>{level.title}</h2>
            {next && <p style={{ opacity: 0.8, fontWeight: 600, marginTop: 4 }}>Next: {next.title}</p>}
          </div>
          <Bar value={lp} tone="saffron" label="Level progress" />
          <div className="row between" style={{ fontSize: 13, fontWeight: 700, opacity: 0.85 }}>
            <span>{Math.round(lp * 100)}% of this level</span><span>{doneReq}/{totalReq} sublevels overall</span>
          </div>
          <button type="button" className="btn primary lg block" onClick={() => go(next ? { name: "sublevel", id: next.id } : { name: "certificate" })}>
            {next ? (doneReq === 0 ? "Start your first lesson" : "Continue learning") : "View certificate"} <Icon name="arrowRight" />
          </button>
        </section>

        <section className="card row wrap" style={{ alignItems: "center", gap: 20 }} aria-label="Daily goal">
          <DebugLabel name="DailyGoalCard" />
          <Ring value={today / goal} size={112} color={today >= goal ? "var(--leaf)" : "var(--saffron)"}>
            <div style={{ fontSize: 22 }}>{today}</div><div className="muted" style={{ fontSize: 11 }}>/ {goal} XP</div>
          </Ring>
          <div className="stack" style={{ gap: 10, flex: "1 1 200px" }}>
            <div className="row between"><span className="eyebrow">Daily goal</span><button type="button" className="btn sm ghost" onClick={() => go({ name: "settings" })}>Edit</button></div>
            <div className="row" style={{ gap: 18 }}>
              <div className="stat"><b>{streak}</b><span>day streak</span></div>
              <div className="stat"><b>{state.settings.livesEnabled ? state.lives.count : "∞"}</b><span>lives</span></div>
              <div className="stat"><b>{counts.learned}</b><span>words</span></div>
            </div>
            <WeekChart />
          </div>
        </section>
      </div>

      <DailyWordCard />

      <div className="grid two">
        <section className="card stack" aria-label="Recommended practice">
          <span className="eyebrow">Recommended for you</span>
          {due > 0 ? (
            <>
              <h3>{due} word{due > 1 ? "s" : ""} ready for review</h3>
              <p className="muted">Spaced repetition brings words back just before you'd forget them. A ten-question round takes about three minutes.</p>
              <button type="button" className="btn leaf" onClick={() => go({ name: "session", id: "revision" })}><Icon name="repeat" /> Start revision</button>
            </>
          ) : (
            <>
              <h3>Fast Match sprint</h3>
              <p className="muted">Match as many words as you can in 30 seconds. Combos multiply your score.</p>
              <button type="button" className="btn saffron" onClick={() => go({ name: "fastmatch" })}><Icon name="bolt" /> Play Fast Match</button>
            </>
          )}
        </section>

        <section className="card stack" aria-label="Phrase of the day">
          <span className="eyebrow">Phrase of the day · {phraseOfDay.situation}</span>
          <button type="button" onClick={() => setPhraseOpen(true)} style={{ border: "none", background: "none", padding: 0, textAlign: "left" }} aria-expanded={phraseOpen}>
            <Native as="div" size={28}>{phraseOfDay.script}</Native>
          </button>
          {phraseOpen ? (
            <div className="reveal-body"><strong>{phraseOfDay.meaning}</strong><Roman force>{phraseOfDay.roman}</Roman><span className="muted" style={{ fontSize: 13 }}>{phraseOfDay.context}</span></div>
          ) : <button type="button" className="reveal-hint" style={{ alignSelf: "flex-start", background: "none" }} onClick={() => setPhraseOpen(true)}><Icon name="hand" /> Tap to reveal</button>}
          <button type="button" className="btn sm ghost" style={{ alignSelf: "flex-start" }} onClick={() => go({ name: "discover" })}>More phrases <Icon name="arrowRight" /></button>
        </section>
      </div>

      <div className="grid two">
        <section className="card stack" aria-label="Recently learned">
          <div className="row between"><span className="eyebrow">Recently learned</span><button type="button" className="btn sm ghost" onClick={() => go({ name: "flashcards" })}>Flashcards</button></div>
          {recent.length ? (
            <div className="row wrap" style={{ gap: 8 }}>
              {recent.map((v) => <span key={v!.id} className="chip" title={v!.meaning}><Native>{v!.script}</Native></span>)}
            </div>
          ) : <p className="muted">Words you learn will collect here.</p>}
        </section>

        <section className="card stack" aria-label="Upcoming rewards">
          <span className="eyebrow">Upcoming rewards</span>
          <div className="row" style={{ alignItems: "center" }}>
            {next && <Stamp glyph={next.glyph} label={next.title} code={`${pc?.stampCode ?? ""}.${next.index}`} seed={hashString(next.stampId)} empty />}
            <div className="stack" style={{ gap: 4 }}>
              <strong>{next ? `Stamp for “${next.title}”` : "All stamps collected"}</strong>
              <span className="muted" style={{ fontSize: 13 }}>+{next?.xp ?? 0} XP · +{next?.coins ?? 0} coins on completion</span>
              <span className="muted" style={{ fontSize: 13 }}>{level.sublevels.filter((s) => s.required && !progress.sublevels[s.id]).length} sublevels to the {pc?.city} postcard</span>
            </div>
          </div>
          {pc && !progress.postcards[pc.id] && (
            <div style={{ maxWidth: 360 }}><Postcard pc={pc} levelTitle={`Level ${level.number}`} locked /></div>
          )}
        </section>
      </div>
    </div>
  );
}
