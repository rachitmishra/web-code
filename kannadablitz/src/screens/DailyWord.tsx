import { useState } from "react";
import { exampleFor } from "../engine/exercises";
import { dayKey } from "../engine/date";
import { useEngine } from "../engine/store";
import { Icon } from "../ui/Icon";
import { Art, DebugLabel, Native, SpeakButton, useMeaningMode } from "../ui/kit";

/** The daily word: native script first, meaning revealed on tap (or always shown per settings). */
export function DailyWordCard({ large = false }: { large?: boolean }) {
  const { dailyWord: v, progress, revealDaily, saveWord, ix, answer } = useEngine();
  const meaningMode = useMeaningMode();
  const today = dayKey();
  const already = progress.dailyWord.day === today && progress.dailyWord.revealed;
  const [open, setOpen] = useState(already);
  const saved = progress.saved.includes(v.id);
  const ex = exampleFor(ix, v);
  const showMeaning = meaningMode === "always" || open;

  const reveal = () => {
    if (showMeaning) return;
    setOpen(true);
    if (!already) {
      revealDaily();
      // seeing the daily word counts as an introduction (no lives involved)
      answer({ correct: true, skill: "vocab", vocabIds: [v.id], teaching: true, xp: 5 });
    }
  };

  return (
    <section className="daily" aria-label="Word of the day">
      <DebugLabel name="DailyWordCard" />
      <div className="daily-inner">
        <button type="button" onClick={reveal} style={{ border: "none", background: "none", padding: 0, justifySelf: "center" }} aria-label="Reveal meaning">
          <Art vocab={v} size={large ? 200 : 160} />
        </button>
        <div className="stack" style={{ gap: 8 }}>
          <div className="row between">
            <span className="eyebrow">Word of the day</span>
          </div>
          <button type="button" onClick={reveal} style={{ border: "none", background: "none", padding: 0, textAlign: "left" }} aria-expanded={showMeaning}>
            <Native as="div" size={v.script.length > 8 ? 44 : large ? 72 : 58} style={{ lineHeight: 1.1 }}>{v.script}</Native>
          </button>
          {showMeaning ? (
            <div className="reveal-body" style={{ gap: 4 }}>
              <h2>{v.meaning}</h2>
              {ex && (
                <div className="example">
                  <Native as="div">{ex.script}</Native>
                  <span className="muted" style={{ fontSize: 13 }}>{ex.meaning}</span>
                </div>
              )}
            </div>
          ) : (
            <button type="button" className="reveal-hint" onClick={reveal} style={{ alignSelf: "flex-start", background: "none" }}>
              <Icon name="hand" /> Tap to reveal
            </button>
          )}
          <div className="row" style={{ gap: 8, marginTop: 4 }}>
            <SpeakButton text={v.script} roman={v.roman} />
            <button type="button" className={`btn sm ${saved ? "ink" : ""}`} onClick={() => saveWord(v.id)} aria-pressed={saved}>
              <Icon name="bookmark" filled={saved} /> {saved ? "Saved" : "Save to collection"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
