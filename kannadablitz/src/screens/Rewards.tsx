import { useEffect } from "react";
import confetti from "canvas-confetti";
import { go } from "../app/router";
import { ACHIEVEMENTS, findSublevel } from "../engine/progress";
import { hashString } from "../engine/rng";
import { useEngine } from "../engine/store";
import { Icon } from "../ui/Icon";
import { AchievementBadge } from "../ui/Badge";
import { Modal, Postcard, Stamp, Stars } from "../ui/kit";

const TOASTS = new Set(["level_unlocked", "goal_met", "streak"]);

export function RewardOverlay() {
  const { rewards, dismissReward, curriculum, pack, state, progress } = useEngine();
  const ev = rewards[0];

  useEffect(() => {
    if (!ev) return;
    if (TOASTS.has(ev.type)) {
      const t = setTimeout(dismissReward, 2600);
      return () => clearTimeout(t);
    }
    if ((ev.type === "postcard" || ev.type === "certificate") && !state.settings.reducedMotion) {
      confetti({ particleCount: 140, spread: 80, origin: { y: 0.35 }, colors: ["#c8102e", "#f2b705", "#2e7a3c", "#3b1214"] });
    }
  }, [ev, dismissReward, state.settings.reducedMotion]);

  if (!ev) return null;

  if (ev.type === "level_unlocked" || ev.type === "goal_met" || ev.type === "streak") {
    const text =
      ev.type === "level_unlocked" ? `Level ${ev.levelNumber} unlocked: ${curriculum.levels.find((l) => l.number === ev.levelNumber)?.title ?? ""}`
      : ev.type === "goal_met" ? `Daily goal reached: ${ev.xp} XP`
      : `${ev.days}-day streak!`;
    return (
      <div className="toast-stack" role="status" aria-live="polite">
        <div className="toast"><Icon name={ev.type === "streak" ? "flame" : ev.type === "goal_met" ? "target" : "compass"} /> {text}</div>
      </div>
    );
  }

  if (ev.type === "stamp") {
    const sub = findSublevel(curriculum, ev.sublevelId);
    const level = curriculum.levels.find((l) => l.number === sub?.levelNumber);
    const pc = pack.postcards.find((p) => p.id === level?.postcardId);
    return (
      <Modal label="Stamp collected" onClose={dismissReward}>
        <div className="stack" style={{ alignItems: "center", textAlign: "center" }}>
          <span className="eyebrow">Sublevel complete</span>
          <div className="stamp-in" style={{ transform: "rotate(-4deg)" }}>
            <Stamp glyph={sub?.glyph ?? "✦"} label={sub?.title ?? "Stamp"} code={`${pc?.stampCode ?? "L"}.${sub?.index ?? ""}`} seed={hashString(ev.stampId)} />
          </div>
          <h2>{sub?.title}</h2>
          <Stars n={ev.stars} className="trace-score" />
          <p className="muted">A new stamp for your passport. {sub && sub.kind !== "challenge" ? "The next sublevel is open." : ""}</p>
          <button type="button" className="btn primary lg block" onClick={dismissReward} autoFocus>Collect</button>
        </div>
      </Modal>
    );
  }

  if (ev.type === "postcard") {
    const level = curriculum.levels.find((l) => l.number === ev.levelNumber)!;
    const pc = pack.postcards.find((p) => p.id === ev.postcardId);
    return (
      <Modal label="Postcard delivered" onClose={dismissReward} wide>
        <div className="stack" style={{ textAlign: "center" }}>
          <span className="eyebrow">Level {level.number} complete · a postcard has arrived</span>
          <h1>{level.title}</h1>
          {pc && (
            <div className="fly-in" style={{ textAlign: "left" }}>
              <Postcard pc={pc} levelTitle={`Level ${level.number} · ${level.title}`} date={progress.postcards[ev.postcardId]} name={state.learner.name} wide />
            </div>
          )}
          <div className="row">
            <button type="button" className="btn block" onClick={() => { dismissReward(); go({ name: "passport" }); }}><Icon name="passport" /> Open passport</button>
            <button type="button" className="btn primary block" onClick={dismissReward} autoFocus>Continue</button>
          </div>
        </div>
      </Modal>
    );
  }

  if (ev.type === "achievement") {
    const a = ACHIEVEMENTS.find((x) => x.id === ev.achievementId);
    return (
      <Modal label="Achievement" onClose={dismissReward}>
        <div className="stack" style={{ alignItems: "center", textAlign: "center" }}>
          <span className="eyebrow">Achievement unlocked · +10 coins</span>
          <div className="stamp-in">
            <AchievementBadge id={ev.achievementId} unlocked size={112} />
          </div>
          <h2>{a?.title}</h2>
          <p className="muted">{a?.description}</p>
          <button type="button" className="btn primary lg block" onClick={dismissReward} autoFocus>Nice</button>
        </div>
      </Modal>
    );
  }

  // certificate
  return (
    <Modal label="Certificate" onClose={dismissReward}>
      <div className="stack" style={{ alignItems: "center", textAlign: "center" }}>
        <span className="eyebrow">Journey complete</span>
        <h1>You've finished all {curriculum.levels.length} levels</h1>
        <p className="muted">Your proficiency certificate and a special postcard are waiting in your passport.</p>
        <button type="button" className="btn primary block lg" onClick={() => { dismissReward(); go({ name: "certificate" }); }}>View certificate</button>
      </div>
    </Modal>
  );
}
