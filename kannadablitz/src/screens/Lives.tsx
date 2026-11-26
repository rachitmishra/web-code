import { useEffect, useState } from "react";
import { go } from "../app/router";
import { LIFE_REGEN_MS, nextLifeIn, packOf } from "../engine/progress";
import { useEngine } from "../engine/store";
import { Icon } from "../ui/Icon";
import { Bar, DebugLabel, Hearts } from "../ui/kit";
import { MascotAvatar } from "../ui/Mascot";

const LIFE_COST = 25;

export function LivesScreen() {
  const { state, update, recoverLife } = useEngine();
  const [, tick] = useState(0);
  useEffect(() => { const t = setInterval(() => tick((x) => x + 1), 1000); return () => clearInterval(t); }, []);
  const ms = nextLifeIn(state);
  const full = state.lives.count >= state.settings.maxLives;
  const coins = packOf(state).coins;
  const mm = ms !== null ? `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, "0")}` : "";
  const mood = !state.settings.livesEnabled ? "happy" : full ? "excited" : state.lives.count === 0 ? "encouraging" : "happy";

  return (
    <div className="lives-shell anim-rise">
      <DebugLabel name="LivesScreen" />

      <div className="lives-top">
        <button type="button" className="icon-btn lives-back" onClick={() => go({ name: "home" })} aria-label="Back to home">
          <Icon name="arrowLeft" />
        </button>
        <div className="lives-top-title">
          <span className="eyebrow">Lives &amp; recovery</span>
          <strong>Hearts</strong>
        </div>
        <span className="pill coin" aria-label={`${coins} coins`}>
          <Icon name="coin" /> {coins}
        </span>
      </div>

      <div className="lives-body stack">
        <section className="card lives-hero stack">
          <MascotAvatar mood={mood} size={74} />
          {state.settings.livesEnabled ? (
            <>
              <div className="lives-hearts">
                <Hearts count={state.lives.count} max={state.settings.maxLives} />
              </div>
              <h1 style={{ fontSize: "clamp(24px, 6vw, 30px)" }}>
                {state.lives.count} of {state.settings.maxLives} lives
              </h1>
              {full ? (
                <p className="muted" style={{ fontSize: 14 }}>You're at full strength. Ready for your next lesson!</p>
              ) : (
                <div className="stack" style={{ width: "100%", maxWidth: 340, gap: 6 }}>
                  <p className="muted" style={{ fontSize: 14 }}>Next heart refills in <strong>{mm}</strong></p>
                  <Bar value={ms !== null ? 1 - ms / LIFE_REGEN_MS : 1} tone="terracotta" label="Life refill progress" />
                </div>
              )}
            </>
          ) : (
            <>
              <span className="tag leaf">Unlimited</span>
              <h1 style={{ fontSize: "clamp(24px, 6vw, 30px)" }}>Lives are off</h1>
              <p className="muted" style={{ fontSize: 14 }}>You're studying without penalties. Mistakes still shape your revision schedule.</p>
            </>
          )}
        </section>

        {state.settings.livesEnabled && !full && (
          <section className="stack" style={{ gap: 10 }} aria-label="Recovery options">
            <span className="eyebrow" style={{ paddingLeft: 4 }}>Recover a heart</span>
            <button type="button" className="option-card lives-action" onClick={() => go({ name: "session", id: "recovery" })}>
              <span className="onboard-reason-ico" style={{ background: "var(--leaf-soft)", color: "var(--leaf)" }}>
                <Icon name="repeat" />
              </span>
              <span className="stack" style={{ gap: 2, flex: 1, textAlign: "left" }}>
                <strong>Recovery round</strong>
                <span className="muted" style={{ fontSize: 13 }}>5 quick review questions · no penalties</span>
              </span>
              <span className="tag leaf">+1 heart</span>
            </button>

            <button
              type="button"
              className="option-card lives-action"
              disabled={coins < LIFE_COST}
              onClick={() => recoverLife(LIFE_COST)}
              style={{ opacity: coins < LIFE_COST ? 0.55 : 1 }}
            >
              <span className="onboard-reason-ico">
                <Icon name="coin" />
              </span>
              <span className="stack" style={{ gap: 2, flex: 1, textAlign: "left" }}>
                <strong>Trade {LIFE_COST} coins</strong>
                <span className="muted" style={{ fontSize: 13 }}>
                  {coins >= LIFE_COST ? `You have ${coins} coins available` : `Need ${LIFE_COST - coins} more coins`}
                </span>
              </span>
              <span className="tag saffron">+1 heart</span>
            </button>
          </section>
        )}

        <section className="card stack" style={{ gap: 12 }}>
          <div className="setting-row" style={{ padding: 0, borderBottom: "none" }}>
            <div style={{ paddingRight: 10 }}>
              <strong>Study without lives</strong>
              <p className="muted" style={{ fontSize: 13 }}>Turn off hearts everywhere. Switch back on anytime.</p>
            </div>
            <button
              type="button"
              className={`switch ${!state.settings.livesEnabled ? "on" : ""}`}
              aria-pressed={!state.settings.livesEnabled}
              aria-label="Study without lives"
              onClick={() => update((s) => ({ ...s, settings: { ...s.settings, livesEnabled: !s.settings.livesEnabled } }))}
            />
          </div>
          <hr className="divider" style={{ margin: "2px 0" }} />
          <span className="eyebrow">How hearts work</span>
          <div className="lives-rules">
            <div className="lives-rule"><Icon name="heart" /> <span>Wrong answers in journey lessons use 1 heart; new words &amp; flashcards never do.</span></div>
            <div className="lives-rule"><Icon name="clock" /> <span>Hearts refill automatically — 1 every {LIFE_REGEN_MS / 60000} minutes.</span></div>
            <div className="lives-rule"><Icon name="bolt" /> <span>Practice, revision, and Fast Match never cost hearts.</span></div>
          </div>
        </section>
      </div>

      <div className="lives-dock">
        {state.settings.livesEnabled && !full ? (
          <button type="button" className="btn primary lg block" onClick={() => go({ name: "session", id: "recovery" })}>
            <Icon name="heart" filled /> Start recovery round (+1 heart)
          </button>
        ) : (
          <button type="button" className="btn primary lg block" onClick={() => go({ name: "learn" })}>
            Back to learning <Icon name="arrowRight" />
          </button>
        )}
      </div>
    </div>
  );
}
