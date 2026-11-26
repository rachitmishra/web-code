import { useEffect, useState, type ReactNode } from "react";
import { useEngine } from "../engine/store";
import { Art, Native, Roman, SpeakButton } from "../ui/kit";
import { usePhonetic } from "../ui/phonetic";
import type { ExerciseProps } from "./types";

/** letter_pick · letter_find · meaning_pick · script_pick */
export function ChoiceExercise({ ex, onAnswer, locked }: ExerciseProps) {
  const [picked, setPicked] = useState<string | null>(null);
  const lang = useEngine().pack.config.id;
  const say = usePhonetic();
  const choices = ex.choices ?? [];

  const choose = (id: string) => {
    if (locked || picked) return;
    setPicked(id);
    const c = choices.find((x) => x.id === id)!;
    onAnswer({ correct: c.correct, given: c.label });
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= choices.length) choose(choices[n - 1].id);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  let header: ReactNode;
  if (ex.type === "letter_pick" && ex.letter) {
    header = (
      <>
        <p className="prompt">Which sound does this letter make?</p>
        <div className="letter-hero letter-pick-hero"><span lang={lang}>{ex.letter.script}</span></div>
      </>
    );
  } else if (ex.type === "letter_find" && ex.letter) {
    header = (
      <>
        <p className="prompt">Find the letter that sounds like <span style={{ color: "var(--terracotta)" }}>“{ex.letter.roman}”</span></p>
        <p className="prompt-sub">{ex.letter.hint}</p>
      </>
    );
  } else if (ex.type === "script_pick" && ex.vocab) {
    header = (
      <>
        <p className="prompt">How do you write this?</p>
        <div className="row" style={{ marginBottom: 22 }}>
          <Art vocab={ex.vocab} size={96} />
          <div className="stack" style={{ gap: 4 }}>
            <span className="eyebrow">Meaning</span>
            <h2>{ex.vocab.meaning}</h2>
          </div>
        </div>
      </>
    );
  } else if (ex.vocab) {
    header = (
      <>
        <p className="prompt">What does this mean?</p>
        <div className="row" style={{ marginBottom: 22, alignItems: "center" }}>
          <Art vocab={ex.vocab} size={110} />
          <div className="stack" style={{ gap: 4 }}>
            <Native size={ex.vocab.script.length > 10 ? 34 : 46} as="div">{ex.vocab.script}</Native>
            <div className="row" style={{ gap: 8 }}>
              <SpeakButton text={ex.vocab.script} roman={ex.vocab.roman} small />
              {picked && <Roman force>{ex.vocab.roman}</Roman>}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div>
      {header}
      <div className="choices" role="group" aria-label="Answer choices">
        {choices.map((c, i) => {
          const state = picked ? (c.correct ? "right" : c.id === picked ? "wrong" : "dim") : "";
          return (
            <button
              key={c.id}
              type="button"
              className={`choice ${c.native ? "native-choice" : ""} ${state}`}
              onClick={() => choose(c.id)}
              disabled={locked || !!picked}
              lang={c.native ? lang : undefined}
              data-say={c.native && !picked ? say(c.sub) : undefined}
            >
              {!c.native && <span className="key">{i + 1}</span>}
              <span>{c.label}</span>
              {c.native && c.sub && picked && <small>{c.sub}</small>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
