import { useState } from "react";
import { go } from "../app/router";
import { ACHIEVEMENTS, wordCounts } from "../engine/progress";
import { hashString } from "../engine/rng";
import { useEngine } from "../engine/store";
import { Icon } from "../ui/Icon";
import { AchievementBadge } from "../ui/Badge";
import { Modal, Native, Postcard, Stamp } from "../ui/kit";

export function Passport() {
  const { curriculum, progress, pack, state } = useEngine();
  const [tab, setTab] = useState<"postcards" | "stamps">("postcards");
  const [view, setView] = useState<string | null>(null);
  const totalStamps = curriculum.levels.reduce((n, l) => n + l.sublevels.length, 0);
  const got = Object.keys(progress.postcards).length;
  const viewPc = pack.postcards.find((p) => p.id === view);
  const viewLevel = curriculum.levels.find((l) => l.postcardId === view);

  return (
    <div className="stack lg">
      <header className="card ink" style={{ display: "grid", gap: 16, gridTemplateColumns: "auto 1fr", alignItems: "center", backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,.03) 0 10px, transparent 10px 20px)" }}>
        <div style={{ width: 84, height: 110, borderRadius: 10, border: "2px solid var(--saffron)", display: "grid", placeItems: "center" }}>
          <Native size={30} style={{ color: "var(--saffron)" }}>{[...pack.config.nativeName].slice(0, 2).join("")}</Native>
        </div>
        <div className="stack" style={{ gap: 4 }}>
          <span className="eyebrow" style={{ color: "rgba(255, 247, 230,.7)" }}>Language passport · {pack.config.name}</span>
          <h1 style={{ color: "var(--paper)" }}>{state.learner.name}</h1>
          <div className="row wrap" style={{ gap: 14, fontWeight: 800 }}>
            <span>{got}/{curriculum.levels.length} postcards</span><span>{progress.stamps.length}/{totalStamps} stamps</span>
            <span>{Object.keys(progress.achievements).length}/{ACHIEVEMENTS.length} badges</span>
          </div>
        </div>
      </header>

      <div className="row wrap" style={{ gap: 6 }} role="tablist">
        <button type="button" role="tab" aria-selected={tab === "postcards"} className={`chip ${tab === "postcards" ? "active" : ""}`} onClick={() => setTab("postcards")}><Icon name="postcard" /> Postcards</button>
        <button type="button" role="tab" aria-selected={tab === "stamps"} className={`chip ${tab === "stamps" ? "active" : ""}`} onClick={() => setTab("stamps")}><Icon name="stamp" /> Stamps</button>
        <button type="button" className="chip" onClick={() => go({ name: "achievements" })}><Icon name="trophy" /> Achievements</button>
        {progress.levels[curriculum.levels[curriculum.levels.length - 1].number] && <button type="button" className="chip" onClick={() => go({ name: "certificate" })}><Icon name="crown" /> Certificate</button>}
      </div>

      {tab === "postcards" ? (
        <div className="grid two">
          {curriculum.levels.map((l) => {
            const pc = pack.postcards.find((p) => p.id === l.postcardId);
            if (!pc) return null;
            const date = progress.postcards[pc.id];
            return (
              <button key={l.number} type="button" onClick={() => date && setView(pc.id)} style={{ border: "none", background: "none", padding: 0, textAlign: "left", cursor: date ? "pointer" : "default", transform: `rotate(${((l.number % 3) - 1) * 0.6}deg)` }} aria-label={`Level ${l.number} postcard: ${pc.city}${date ? "" : ", locked"}`}>
                <Postcard pc={pc} levelTitle={`Level ${l.number} · ${l.title}`} date={date} name={state.learner.name} locked={!date} />
              </button>
            );
          })}
        </div>
      ) : (
        <div className="stack lg">
          {curriculum.levels.map((l) => {
            const pc = pack.postcards.find((p) => p.id === l.postcardId);
            return (
              <section key={l.number} className="card">
                <div className="row between" style={{ marginBottom: 14 }}>
                  <div><span className="eyebrow">Page {l.number} · {pc?.city}</span><h3>{l.title}</h3></div>
                  <span className="muted" style={{ fontWeight: 700, fontSize: 13 }}>{l.sublevels.filter((s) => progress.stamps.includes(s.stampId)).length}/{l.sublevels.length}</span>
                </div>
                <div className="stamp-grid">
                  {l.sublevels.map((s) => (
                    <Stamp key={s.id} glyph={s.glyph} label={s.title} code={`${pc?.stampCode ?? ""}.${s.index}`} seed={hashString(s.stampId)} empty={!progress.stamps.includes(s.stampId)} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {viewPc && viewLevel && (
        <Modal label="Postcard" onClose={() => setView(null)} wide>
          <Postcard pc={viewPc} levelTitle={`Level ${viewLevel.number} · ${viewLevel.title}`} date={progress.postcards[viewPc.id]} name={state.learner.name} wide />
          <button type="button" className="btn block" style={{ marginTop: 16 }} onClick={() => setView(null)}>Close</button>
        </Modal>
      )}
    </div>
  );
}

export function Achievements() {
  const { progress } = useEngine();
  const earned = Object.keys(progress.achievements).length;
  return (
    <div className="stack lg">
      <button type="button" className="btn sm ghost" style={{ alignSelf: "flex-start" }} onClick={() => go({ name: "passport" })}><Icon name="arrowLeft" /> Passport</button>
      <header className="row between wrap">
        <div>
          <span className="eyebrow">Achievements</span>
          <h1>Badges &amp; milestones</h1>
        </div>
        <span className="tag saffron">{earned} / {ACHIEVEMENTS.length} unlocked</span>
      </header>
      <div className="grid three">
        {ACHIEVEMENTS.map((a) => {
          const at = progress.achievements[a.id];
          return (
            <div key={a.id} className={`card ach-card ${at ? "unlocked" : "locked"}`}>
              <AchievementBadge id={a.id} unlocked={!!at} size={72} />
              <div className="stack" style={{ gap: 3, minWidth: 0 }}>
                <strong>{a.title}</strong>
                <span className="muted" style={{ fontSize: 13, lineHeight: 1.35 }}>{a.description}</span>
                {at ? (
                  <span className="tag leaf" style={{ alignSelf: "flex-start", marginTop: 4 }}>{new Date(at).toLocaleDateString()}</span>
                ) : (
                  <span className="eyebrow" style={{ marginTop: 4, opacity: 0.65 }}>Locked</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Certificate() {
  const { curriculum, progress, pack, state } = useEngine();
  const last = curriculum.levels[curriculum.levels.length - 1];
  const done = progress.levels[last.number];
  const c = wordCounts(progress);
  const finalPc = pack.postcards.find((p) => p.id === last.postcardId);
  if (!done) {
    return (
      <div className="card dashed stack" style={{ alignItems: "center", textAlign: "center", padding: 40 }}>
        <Icon name="lock" />
        <h2>Certificate locked</h2>
        <p className="muted">Complete Level {last.number}'s final assessment to earn your {pack.config.name} proficiency certificate.</p>
        <button type="button" className="btn primary" onClick={() => go({ name: "learn" })}>Continue the journey</button>
      </div>
    );
  }
  return (
    <div className="stack lg">
      <article className="card" style={{ border: "3px double var(--ink)", padding: "40px 28px", textAlign: "center", background: "var(--card)" }}>
        <span className="eyebrow">Certificate of proficiency</span>
        <Native as="div" size={56} style={{ color: "var(--terracotta)", margin: "10px 0" }}>{pack.config.nativeName}</Native>
        <p className="muted">This certifies that</p>
        <h1 className="hand" style={{ fontSize: 52, margin: "6px 0" }}>{state.learner.name}</h1>
        <p className="muted" style={{ maxWidth: 520, margin: "0 auto" }}>
          has completed all {curriculum.levels.length} levels of the {pack.config.name} journey, covering script, {c.learned} words, sentence building and reading comprehension.
        </p>
        <div className="row wrap" style={{ justifyContent: "center", gap: 28, marginTop: 22 }}>
          <div className="stat"><b>{c.mastered}</b><span>words mastered</span></div>
          <div className="stat"><b>{progress.stamps.length}</b><span>stamps</span></div>
          <div className="stat"><b>{progress.xp}</b><span>XP</span></div>
        </div>
        <p className="muted" style={{ marginTop: 20, fontSize: 13 }}>{new Date(done).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}</p>
      </article>
      {finalPc && <Postcard pc={finalPc} levelTitle="Exclusive final postcard" date={done} name={state.learner.name} wide />}
    </div>
  );
}
