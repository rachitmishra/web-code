import { useState } from "react";
import { go } from "../app/router";
import { switchPack } from "../engine/progress";
import { useEngine } from "../engine/store";
import { Icon } from "../ui/Icon";
import { DebugHud, DebugLabel, Modal, Postcard } from "../ui/kit";

const GOALS = [
  { xp: 20, label: "Casual", note: "5 min / day" },
  { xp: 50, label: "Regular", note: "10 min / day" },
  { xp: 100, label: "Serious", note: "20 min / day" },
  { xp: 150, label: "Intense", note: "30+ min / day" },
];
const REASONS = [
  { id: "live", label: "Living in or moving to Karnataka", icon: "home" },
  { id: "travel", label: "Travel and exploring", icon: "map" },
  { id: "family", label: "Family, friends or a partner", icon: "heart" },
  { id: "work", label: "Work and colleagues", icon: "target" },
  { id: "culture", label: "Literature, film and culture", icon: "book" },
];

export function Onboarding() {
  const { packs, state, update, pack, sync } = useEngine();
  const [step, setStep] = useState(0);
  const [langId, setLangId] = useState(state.activePack);
  const [reason, setReason] = useState("");
  const [goal, setGoal] = useState(50);
  const [name, setName] = useState("");
  const [lives, setLives] = useState(true);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [restoreKey, setRestoreKey] = useState("");
  const [restoreErr, setRestoreErr] = useState<string | null>(null);
  const chosen = packs[langId] ?? pack;

  const handleRestore = async () => {
    setRestoreErr(null);
    const res = await sync.restore(restoreKey);
    if (res.ok) {
      setRestoreOpen(false);
      go({ name: "home" });
    } else if (res.error) {
      setRestoreErr(res.error);
    }
  };

  const finish = () => {
    update((s) => ({
      ...switchPack(s, langId),
      learner: { name: name.trim() || "Traveller", onboarded: true, goalXp: goal, reason },
      settings: { ...s.settings, livesEnabled: lives },
    }));
    go({ name: "home" });
  };

  const stepTitle = ["Welcome", "Language", "Goal", "Profile"][step] ?? `Step ${step + 1}`;

  return (
    <main className="onboard-shell">
      <DebugLabel name={`Onboarding (${stepTitle})`} kind="screen" />
      <header className="onboard-top">
        <DebugLabel name="OnboardingTopBar" />
        {step > 0 ? (
          <button type="button" className="icon-btn onboard-back" onClick={() => setStep((s) => s - 1)} aria-label="Back">
            <Icon name="arrowLeft" />
          </button>
        ) : (
          <span className="onboard-back-spacer" aria-hidden="true" />
        )}
        <div className="onboard-steps" aria-label={`Step ${step + 1} of 4`}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`onboard-seg ${i <= step ? "on" : ""} ${i === step ? "now" : ""}`} />
          ))}
        </div>
        <span className="onboard-count">{step + 1}/4</span>
      </header>

      <div className="onboard-body">
        {step === 0 && (
          <div key="s0" className="onboard-welcome screen-enter">
            <div className="onboard-hero-badge">
              <span className="native" lang={chosen.config.id}>{chosen.config.nativeName}</span>
            </div>
            <div className="stack" style={{ gap: 8, alignItems: "center" }}>
              <h1>Your language journal starts here</h1>
              <p className="muted onboard-lead">
                Learn {chosen.config.name} the way a traveller does: script first, words in context, and a postcard for every place you reach.
              </p>
            </div>
            {chosen.postcards[0] && (
              <div className="onboard-postcard fly-in">
                <Postcard
                  pc={chosen.postcards[0]}
                  levelTitle="Your first postcard"
                  message="Twenty levels, two hundred stamps, and one passport. See you at the first stop."
                />
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div key="s1" className="stack lg screen-enter">
            <div className="stack" style={{ gap: 4 }}>
              <span className="eyebrow">Step 1 of 3</span>
              <h1>Choose a language</h1>
              <p className="muted" style={{ fontSize: 14 }}>Switch languages or import new packs anytime in Settings.</p>
            </div>
            <div className="stack" style={{ gap: 10 }}>
              {Object.values(packs).map((p) => {
                const active = langId === p.config.id;
                return (
                  <button key={p.config.id} type="button" className={`option-card onboard-lang ${active ? "active" : ""}`} onClick={() => setLangId(p.config.id)} aria-pressed={active}>
                    <span className="onboard-lang-glyph native" lang={p.config.id} style={{ fontFamily: p.config.fontFamily }}>{p.config.nativeName}</span>
                    <span className="stack" style={{ gap: 2, flex: 1, minWidth: 0 }}>
                      <strong style={{ fontSize: 17 }}>{p.config.name}</strong>
                      <span className="muted" style={{ fontSize: 13 }}>{p.levels.length} levels · {p.vocab.length} words · {p.config.scriptName}</span>
                    </span>
                    <span className={`onboard-check ${active ? "on" : ""}`} aria-hidden="true">
                      {active && <Icon name="check" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div key="s2" className="stack lg screen-enter">
            <div className="stack" style={{ gap: 4 }}>
              <span className="eyebrow">Step 2 of 3</span>
              <h1>What brings you to {chosen.config.name}?</h1>
            </div>
            <div className="stack" style={{ gap: 8 }}>
              {REASONS.map((r) => {
                const active = reason === r.id;
                return (
                  <button key={r.id} type="button" className={`option-card onboard-reason ${active ? "active" : ""}`} onClick={() => setReason(r.id)} aria-pressed={active}>
                    <span className="onboard-reason-ico"><Icon name={r.icon} /></span>
                    <strong style={{ flex: 1, fontSize: 15 }}>{r.label}</strong>
                    <span className={`onboard-check ${active ? "on" : ""}`} aria-hidden="true">
                      {active && <Icon name="check" />}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="stack" style={{ gap: 10 }}>
              <div className="row between">
                <h3>Daily goal</h3>
                <span className="tag saffron">{goal} XP / day</span>
              </div>
              <div className="goal-grid">
                {GOALS.map((g) => (
                  <button key={g.xp} type="button" className={`option-card goal-tile ${goal === g.xp ? "active" : ""}`} onClick={() => setGoal(g.xp)} aria-pressed={goal === g.xp}>
                    <div className="row between" style={{ width: "100%" }}>
                      <strong>{g.label}</strong>
                      <span className="goal-xp">{g.xp} XP</span>
                    </div>
                    <span className="muted" style={{ fontSize: 12 }}>{g.note}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div key="s3" className="stack lg screen-enter">
            <div className="stack" style={{ gap: 4 }}>
              <span className="eyebrow">Step 3 of 3</span>
              <h1>Who should postcards be addressed to?</h1>
            </div>
            <div className="card stack" style={{ gap: 14 }}>
              <div className="field">
                <label htmlFor="name">Your name</label>
                <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Traveller" maxLength={40} autoComplete="given-name" />
              </div>
              <div className="onboard-preview">
                <span className="eyebrow">Postcard preview</span>
                <p className="hand" style={{ fontSize: 22, color: "var(--ink-2)" }}>
                  Dear {name.trim() || "Traveller"}, welcome to Bengaluru!
                </p>
              </div>
            </div>
            <div className="card">
              <div className="setting-row" style={{ padding: 0 }}>
                <div>
                  <strong>Use lives</strong>
                  <p className="muted" style={{ fontSize: 13 }}>Wrong answers use a heart that refills over time. Turn off to study freely.</p>
                </div>
                <button type="button" className={`switch ${lives ? "on" : ""}`} onClick={() => setLives((x) => !x)} aria-pressed={lives} aria-label="Use lives" />
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="onboard-dock">
        <DebugLabel name="OnboardingDock" />
        {step === 0 && (
          <div className="stack" style={{ gap: 8 }}>
            <button type="button" className="btn primary lg block" onClick={() => setStep(1)}>
              Begin <Icon name="arrowRight" />
            </button>
            <button type="button" className="btn ghost sm block" onClick={() => setRestoreOpen(true)}>
              Already have a sync key? Restore progress
            </button>
          </div>
        )}
        {step === 1 && (
          <button type="button" className="btn primary lg block" onClick={() => setStep(2)}>
            Continue <Icon name="arrowRight" />
          </button>
        )}
        {step === 2 && (
          <button type="button" className="btn primary lg block" onClick={() => setStep(3)}>
            Continue <Icon name="arrowRight" />
          </button>
        )}
        {step === 3 && (
          <button type="button" className="btn primary lg block" onClick={finish}>
            Start my journey <Icon name="compass" />
          </button>
        )}
      </footer>
      {restoreOpen && (
        <Modal label="Restore from cloud" onClose={() => setRestoreOpen(false)}>
          <div className="stack" style={{ gap: 14 }}>
            <h2>Restore your journal</h2>
            <p className="muted" style={{ fontSize: 14 }}>
              Enter your sync key (your name and 4-digit hash, like <strong>asha#4829</strong>) to load your saved progress and settings.
            </p>
            <input
              className="input"
              value={restoreKey}
              onChange={(e) => setRestoreKey(e.target.value)}
              placeholder="name#1234"
              aria-label="Sync key"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
            />
            {restoreErr && <p style={{ color: "var(--danger)", fontSize: 13, fontWeight: 700 }}>{restoreErr}</p>}
            <button type="button" className="btn primary lg block" disabled={sync.status === "syncing" || !restoreKey.trim()} onClick={() => void handleRestore()}>
              {sync.status === "syncing" ? "Restoring…" : "Restore progress"}
            </button>
          </div>
        </Modal>
      )}
      <DebugHud screen={`Onboarding (${stepTitle})`} />
    </main>
  );
}
