import { useEffect, useState } from "react";
import { go } from "../app/router";
import { LIFE_REGEN_MS, nextLifeIn, packOf } from "../engine/progress";
import { useEngine } from "../engine/store";
import { Icon } from "../ui/Icon";
import { Bar, Hearts } from "../ui/kit";

const LIFE_COST = 25;

export function LivesScreen() {
  const { state, update, recoverLife } = useEngine();
  const [, tick] = useState(0);
  useEffect(() => { const t = setInterval(() => tick((x) => x + 1), 1000); return () => clearInterval(t); }, []);
  const ms = nextLifeIn(state);
  const full = state.lives.count >= state.settings.maxLives;
  const coins = packOf(state).coins;
  const mm = ms !== null ? `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, "0")}` : "";

  return (
    <div className="stack lg" style={{ maxWidth: 640 }}>
      <header><span className="eyebrow">Lives &amp; recovery</span><h1>Hearts</h1></header>
      <section className="card stack" style={{ alignItems: "center", textAlign: "center" }}>
        {state.settings.livesEnabled ? (
          <>
            <div style={{ transform: "scale(1.6)", margin: "10px 0 14px" }}><Hearts count={state.lives.count} max={state.settings.maxLives} /></div>
            <h2>{state.lives.count} of {state.settings.maxLives} lives</h2>
            {full ? <p className="muted">You're at full strength.</p> : (
              <div className="stack" style={{ width: "100%", gap: 6 }}>
                <p className="muted">Next life in <strong>{mm}</strong></p>
                <Bar value={ms !== null ? 1 - ms / LIFE_REGEN_MS : 1} tone="terracotta" />
              </div>
            )}
          </>
        ) : (
          <>
            <h2>Lives are off</h2>
            <p className="muted">You're studying without penalties. Mistakes still shape your revision schedule.</p>
          </>
        )}
      </section>

      {state.settings.livesEnabled && !full && (
        <div className="grid two">
          <button type="button" className="card clickable stack" onClick={() => go({ name: "session", id: "recovery" })}>
            <Icon name="repeat" /><h3>Recovery round</h3><p className="muted" style={{ fontSize: 13 }}>Five quick review questions with no penalties. Finish them to earn one life.</p>
          </button>
          <button type="button" className="card clickable stack" disabled={coins < LIFE_COST} onClick={() => recoverLife(LIFE_COST)} style={{ opacity: coins < LIFE_COST ? 0.55 : 1 }}>
            <Icon name="coin" /><h3>Trade {LIFE_COST} coins</h3><p className="muted" style={{ fontSize: 13 }}>You have {coins} coins. Earn more from sublevels, achievements and Fast Match.</p>
          </button>
        </div>
      )}

      <section className="card stack">
        <span className="eyebrow">How lives work</span>
        <ul className="muted" style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
          <li>A wrong answer in a journey lesson uses one life, and the feedback says which answer used it.</li>
          <li>New-word cards, phrases and flashcards never cost lives.</li>
          <li>Lives refill on their own, one every {LIFE_REGEN_MS / 60000} minutes.</li>
          <li>Out of lives? You can always carry on in practice mode.</li>
          <li>Practice, revision and Fast Match never touch your lives.</li>
        </ul>
        <div className="setting-row">
          <div><strong>Study without lives</strong><p className="muted" style={{ fontSize: 13 }}>Turns off hearts everywhere. You can switch them back on any time.</p></div>
          <button type="button" className={`switch ${!state.settings.livesEnabled ? "on" : ""}`} aria-pressed={!state.settings.livesEnabled} aria-label="Study without lives"
            onClick={() => update((s) => ({ ...s, settings: { ...s.settings, livesEnabled: !s.settings.livesEnabled } }))} />
        </div>
      </section>
    </div>
  );
}
