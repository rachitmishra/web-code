import { go } from "../app/router";
import { dueWords, levelProgress, lettersMastered, liveStreak, weakWords, wordCounts } from "../engine/progress";
import { mastery } from "../engine/srs";
import { useEngine } from "../engine/store";
import { Icon } from "../ui/Icon";
import { Bar, Ring } from "../ui/kit";
import { WeekChart } from "./Home";

const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);

export function Stats() {
  const { state, progress, curriculum, pack } = useEngine();
  const c = wordCounts(progress);
  const st = progress.stats;
  const minutes = Object.values(state.days).reduce((n, d) => n + d.minutes, 0);
  const reqSubs = curriculum.levels.flatMap((l) => l.sublevels.filter((s) => s.required));
  const doneSubs = reqSubs.filter((s) => progress.sublevels[s.id]).length;
  const levelsDone = Object.keys(progress.levels).length;

  const tracks = [
    { label: "Vocabulary retention", value: pct(st.reviewCorrect, st.reviewAnswers), n: st.reviewAnswers, note: "Correct answers on words you had already met", color: "var(--leaf)" },
    { label: "Comprehension", value: pct(st.comprehensionCorrect + st.vocabCorrect, st.comprehensionAnswers + st.vocabAnswers), n: st.comprehensionAnswers + st.vocabAnswers, note: "Reading and meaning questions", color: "var(--sky)" },
    { label: "Sentence building", value: pct(st.sentenceCorrect, st.sentenceAnswers), n: st.sentenceAnswers, note: "Sentences put in the right order", color: "var(--terracotta)" },
    { label: "Overall accuracy", value: pct(st.correct, st.answers), n: st.answers, note: "All scored answers", color: "var(--saffron)" },
  ];

  const tiles = [
    { k: "Words learned", v: c.learned, icon: "book" },
    { k: "Words mastered", v: c.mastered, icon: "tree" },
    { k: "Letters mastered", v: `${lettersMastered(progress)}/${pack.letters.length}`, icon: "letter" },
    { k: "Sentences built", v: st.sentenceCorrect, icon: "tiles" },
    { k: "Levels completed", v: `${levelsDone}/${curriculum.levels.length}`, icon: "compass" },
    { k: "Sublevels", v: `${doneSubs}/${reqSubs.length}`, icon: "stamp" },
    { k: "Total XP", v: progress.xp, icon: "bolt" },
    { k: "Current streak", v: `${liveStreak(state)}d (best ${state.streak.best})`, icon: "flame" },
    { k: "Learning time", v: minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`, icon: "clock" },
    { k: "Fast Match best", v: Math.max(st.fastMatchBest30, st.fastMatchBest60), icon: "trophy" },
    { k: "Due for revision", v: dueWords(progress).length, icon: "repeat" },
    { k: "Tricky words", v: weakWords(progress).length, icon: "target" },
  ];

  return (
    <div className="stack lg">
      <header><span className="eyebrow">Learning analytics</span><h1>How your {pack.config.name} is growing</h1>
        <p className="muted">Finishing exercises is not the same as knowing the language, so retention, comprehension and sentence building are tracked separately.</p></header>

      <div className="grid four">
        {tracks.map((t) => (
          <div key={t.label} className="card stack" style={{ alignItems: "center", textAlign: "center" }}>
            <Ring value={t.value / 100} color={t.color}><span style={{ fontSize: 20 }}>{t.n ? `${t.value}%` : "–"}</span></Ring>
            <strong>{t.label}</strong>
            <span className="muted" style={{ fontSize: 12 }}>{t.note} · {t.n} answers</span>
          </div>
        ))}
      </div>

      <div className="grid four">
        {tiles.map((t) => (
          <div key={t.k} className="card row" style={{ padding: 16 }}>
            <Icon name={t.icon} className="faint" />
            <div className="stat"><b style={{ fontSize: 20 }}>{t.v}</b><span>{t.k}</span></div>
          </div>
        ))}
      </div>

      <section className="card"><span className="eyebrow">This week</span><div style={{ marginTop: 12 }}><WeekChart /></div></section>

      <section className="card stack">
        <div className="row between"><span className="eyebrow">Level mastery</span><span className="muted" style={{ fontSize: 12 }}>Completion vs. words you actually remember</span></div>
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>Level</th><th style={{ width: "34%" }}>Completion</th><th style={{ width: "34%" }}>Word mastery</th></tr></thead>
            <tbody>
              {curriculum.levels.map((l) => {
                const comp = levelProgress(progress, l);
                const known = l.vocabIds.filter((id) => ["familiar", "mastered"].includes(mastery(progress.words[id]))).length;
                const m = l.vocabIds.length ? known / l.vocabIds.length : 0;
                return (
                  <tr key={l.number}>
                    <td><button type="button" className="btn sm ghost" onClick={() => go({ name: "level", level: l.number })}>{l.number}. {l.title}</button></td>
                    <td><div className="row" style={{ gap: 8 }}><div style={{ flex: 1 }}><Bar value={comp} /></div><span style={{ fontSize: 12, fontWeight: 700, minWidth: 34 }}>{Math.round(comp * 100)}%</span></div></td>
                    <td><div className="row" style={{ gap: 8 }}><div style={{ flex: 1 }}><Bar value={m} tone="saffron" /></div><span style={{ fontSize: 12, fontWeight: 700, minWidth: 34 }}>{Math.round(m * 100)}%</span></div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
