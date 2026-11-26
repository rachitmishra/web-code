import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { EngineProvider } from "./engine/store";
import { KANNADA_PACK } from "./content/packs/kn";
import { indexPack, materialize } from "./engine/exercises";
import { seeded } from "./engine/rng";
import { ExerciseView } from "./exercises";
import { buildCurriculum } from "./engine/curriculum";
import { applySessionComplete, initialState } from "./engine/progress";
import type { ExercisePlan } from "./engine/types";

vi.mock("canvas-confetti", () => ({ default: vi.fn() }));

function mount() {
  return render(<EngineProvider><App /></EngineProvider>);
}

async function onboard() {
  mount();
  fireEvent.click(screen.getByRole("button", { name: /begin/i }));
  fireEvent.click(screen.getByRole("button", { name: /continue/i }));
  fireEvent.click(screen.getByRole("button", { name: /continue/i }));
  fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: "Asha" } });
  fireEvent.click(screen.getByRole("button", { name: /start my journey/i }));
}

const nav = async (hash: string) => {
  await act(async () => {
    window.location.hash = hash;
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });
};

beforeEach(() => {
  localStorage.clear();
  window.location.hash = "";
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
});

describe("app shell", () => {
  it("onboards and lands on a personalised home dashboard", async () => {
    await onboard();
    expect(await screen.findByRole("heading", { name: /asha/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/word of the day/i)).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /start your first lesson/i }).length).toBeGreaterThan(0);
  });

  it.each([
    ["#/learn", /from first letter/i],
    ["#/learn/4", /first words/i],
    ["#/sub/kn.L1.S1", /10 exercises/i],
    ["#/practice", /sharpen what you know/i],
    ["#/practice/flashcards", /word deck/i],
    ["#/practice/fast", /fast match/i],
    ["#/practice/revision", /keep words from fading/i],
    ["#/discover", /phrasebook/i],
    ["#/discover/daily", /your collection/i],
    ["#/passport", /language passport/i],
    ["#/passport/achievements", /badges/i],
    ["#/certificate", /certificate locked/i],
    ["#/stats", /how your kannada is growing/i],
    ["#/settings", /your journal/i],
    ["#/settings/content", /language pack/i],
    ["#/lives", /hearts/i],
  ])("renders %s", async (hash, text) => {
    await onboard();
    await nav(hash);
    expect((await screen.findAllByText(text)).length).toBeGreaterThan(0);
  });

  it("locks later sublevels and levels", async () => {
    await onboard();
    await nav("#/learn/1");
    const path = screen.getByLabelText(/sublevel path/i);
    const nodes = within(path).getAllByRole("button");
    expect(nodes[0]).not.toBeDisabled();
    expect(nodes[1]).toBeDisabled();
  });

  it("blocks locked sublevels opened by URL", async () => {
    await onboard();
    await nav("#/session/kn.L4.S1");
    expect(screen.getByText(/still locked/i)).toBeInTheDocument();
  });

  it("plays a full vocabulary sublevel end to end and awards its stamp", async () => {
    // Seed: onboarded learner who has finished Levels 1–3.
    const cur = buildCurriculum(KANNADA_PACK);
    let s = initialState("kn");
    s = { ...s, learner: { ...s.learner, name: "Asha", onboarded: true }, settings: { ...s.settings, livesEnabled: false } };
    for (const l of cur.levels.slice(0, 3))
      for (const sub of l.sublevels.filter((x) => x.required))
        s = applySessionComplete(s, cur, { kind: "sublevel", sublevelId: sub.id, total: 10, mistakes: 0, xpEarned: 0, durationMs: 1 }, Date.now()).state;
    localStorage.setItem("lj.state.v3", JSON.stringify(s));
    window.location.hash = "#/session/kn.L4.S1";
    mount();
    const byScript = new Map(KANNADA_PACK.vocab.map((v) => [v.script, v.meaning]));
    vi.useFakeTimers({ shouldAdvanceTime: true });
    let answered = 0;
    for (let step = 0; step < 80 && !screen.queryAllByText(/sublevel complete|flawless/i).length; step++) {
      const feedback = screen.queryByRole("status");
      const cont = screen.queryAllByRole("button", { name: /^(continue|got it)/i }).find((b) => !(b as HTMLButtonElement).disabled);
      if (feedback && cont) { fireEvent.click(cont); continue; }
      const group = screen.queryByRole("group", { name: /answer choices/i });
      if (group) {
        // pick the right option using the prompt word
        const word = document.querySelector(".native")?.textContent ?? "";
        const btns = within(group).getAllByRole("button");
        const meaning = byScript.get(word);
        const right = btns.find((b) => (meaning && b.textContent?.includes(meaning)) || (!meaning && byScript.get(b.textContent?.replace(/[a-z]+$/i, "") ?? "")));
        fireEvent.click(right ?? btns[0]); answered++; continue;
      }
      const blankCard = screen.queryByLabelText(/sentence with blank/i);
      if (blankCard) {
        const wGroup = screen.getByRole("group", { name: /word choices/i });
        const btns = within(wGroup).getAllByRole("button");
        const visibleToks = [...blankCard.querySelectorAll(".sentence-tok")].map((el) => el.textContent ?? "");
        const sentence = KANNADA_PACK.sentences.find((x) => visibleToks.every((t) => x.tokens.includes(t)));
        const right = sentence ? btns.find((b) => sentence.tokens.some((t) => !visibleToks.includes(t) && b.textContent?.includes(t))) : undefined;
        fireEvent.click(right ?? btns[0]); answered++; continue;
      }
      const bank = screen.queryByLabelText(/word bank/i);
      if (bank) {
        const sentence = KANNADA_PACK.sentences.find((x) => x.tokens.every((t) => within(bank).queryByRole("button", { name: t })))!;
        for (const tok of sentence.tokens) {
          const tile = within(bank).getByRole("button", { name: tok });
          fireEvent.pointerDown(tile, { clientX: 1, clientY: 1 }); fireEvent.pointerUp(tile, { clientX: 1, clientY: 1 });
        }
        fireEvent.click(screen.getByRole("button", { name: /^check$/i })); answered++; continue;
      }
      const tiles = [...document.querySelectorAll<HTMLButtonElement>(".tile.native-tile:not(:disabled)")];
      if (tiles.length) {
        for (const t of tiles) {
          const m = byScript.get(t.textContent ?? "");
          const target = [...document.querySelectorAll<HTMLButtonElement>(".tile:not(.native-tile):not(:disabled)")].find((x) => x.textContent === m);
          fireEvent.click(t); if (target) fireEvent.click(target);
        }
        await act(async () => { vi.advanceTimersByTime(500); });
        answered++; continue;
      }
      const reveal = screen.queryByRole("button", { expanded: false });
      if (reveal) { fireEvent.click(reveal); continue; }
      if (cont) { fireEvent.click(cont); continue; }
      break;
    }
    vi.useRealTimers();
    expect(answered).toBeGreaterThanOrEqual(5);
    expect(screen.getAllByText(/sublevel complete|flawless/i).length).toBeGreaterThan(0);
    // the stamp reward modal is queued
    expect(await screen.findByRole("dialog", { name: /stamp collected/i })).toBeInTheDocument();
  }, 60000);
});

describe("exercise renderers", () => {
  const ix = indexPack(KANNADA_PACK);
  const v = KANNADA_PACK.vocab.slice(0, 6).map((x) => x.id);
  const plans: ExercisePlan[] = [
    { type: "letter_learn", letterId: KANNADA_PACK.letters[0].id },
    { type: "letter_pick", letterId: KANNADA_PACK.letters[16].id },
    { type: "letter_find", letterId: KANNADA_PACK.letters[3].id },
    { type: "word_intro", vocabIds: [v[0]] },
    { type: "meaning_pick", vocabIds: [v[1]] },
    { type: "script_pick", vocabIds: [v[2]] },
    { type: "flashcard", vocabIds: [v[3]] },
    { type: "phrase_reveal", phraseId: KANNADA_PACK.phrases[0].id },
    { type: "reading", readingId: KANNADA_PACK.readings[0].id },
  ];

  it.each(plans.map((p) => [p.type, p] as const))("%s renders and accepts a correct answer", (_t, plan) => {
    const ex = materialize(ix, plan, "t", seeded(9))!;
    const onAnswer = vi.fn();
    render(<EngineProvider><ExerciseView ex={ex} onAnswer={onAnswer} locked={false} /></EngineProvider>);
    if (ex.choices) {
      const right = ex.choices.find((c) => c.correct)!;
      const group = screen.getByRole("group", { name: /answer choices/i });
      const btn = within(group).getAllByRole("button").find((b) => b.textContent?.includes(right.label))!;
      fireEvent.click(btn);
      expect(onAnswer).toHaveBeenCalledWith(expect.objectContaining({ correct: true }));
    } else if (ex.reading) {
      fireEvent.click(screen.getByRole("button", { name: new RegExp(ex.reading.question.options[ex.reading.question.answer]) }));
      expect(onAnswer).toHaveBeenCalledWith(expect.objectContaining({ correct: true }));
    } else if (ex.type === "flashcard") {
      fireEvent.pointerDown(screen.getByRole("button", { name: /card front/i }), { clientX: 0 });
      fireEvent.pointerUp(screen.getByRole("button", { name: /card front/i }), { clientX: 0 });
      fireEvent.click(screen.getByRole("button", { name: /i know this/i }));
      expect(onAnswer).toHaveBeenCalledWith(expect.objectContaining({ correct: true, selfGraded: true }));
    } else {
      const reveal = screen.queryByRole("button", { expanded: false });
      if (reveal) fireEvent.click(reveal);
      fireEvent.click(screen.getByRole("button", { name: /got it|continue/i }));
      expect(onAnswer).toHaveBeenCalledWith(expect.objectContaining({ correct: true }));
    }
  });

  it("matching: pairing every word correctly reports zero mistakes", async () => {
    vi.useFakeTimers();
    const ex = materialize(ix, { type: "match_columns", vocabIds: v.slice(0, 4) }, "m", seeded(1))!;
    const onAnswer = vi.fn();
    render(<EngineProvider><ExerciseView ex={ex} onAnswer={onAnswer} locked={false} /></EngineProvider>);
    for (const p of ex.pairs!) {
      fireEvent.click(screen.getByRole("button", { name: p.script }));
      fireEvent.click(screen.getByRole("button", { name: p.meaning }));
    }
    act(() => { vi.advanceTimersByTime(1000); });
    expect(onAnswer).toHaveBeenCalledWith({ correct: true, mistakes: 0 });
    vi.useRealTimers();
  });

  it("sentence builder: tapping tiles in order is correct", () => {
    const s = KANNADA_PACK.sentences[0];
    const ex = materialize(ix, { type: "sentence_build", sentenceId: s.id }, "s", seeded(2))!;
    const onAnswer = vi.fn();
    render(<EngineProvider><ExerciseView ex={ex} onAnswer={onAnswer} locked={false} /></EngineProvider>);
    const bank = screen.getByLabelText(/word bank/i);
    for (const tok of s.tokens) {
      const tile = within(bank).getByRole("button", { name: tok });
      fireEvent.pointerDown(tile, { clientX: 5, clientY: 5, pointerId: 1 });
      fireEvent.pointerUp(tile, { clientX: 5, clientY: 5, pointerId: 1 });
    }
    fireEvent.click(screen.getByRole("button", { name: /check/i }));
    expect(onAnswer).toHaveBeenCalledWith(expect.objectContaining({ correct: true }));
  });

  it("sentence fill in the blank: picking the missing word is correct", () => {
    const s = KANNADA_PACK.sentences[0];
    const ex = materialize(ix, { type: "sentence_fill", sentenceId: s.id }, "sf", seeded(3))!;
    const onAnswer = vi.fn();
    render(<EngineProvider><ExerciseView ex={ex} onAnswer={onAnswer} locked={false} /></EngineProvider>);
    const target = s.tokens[ex.blankIndex!];
    const group = screen.getByRole("group", { name: /word choices/i });
    const btn = within(group).getAllByRole("button").find((b) => b.textContent?.includes(target))!;
    fireEvent.click(btn);
    expect(onAnswer).toHaveBeenCalledWith(expect.objectContaining({ correct: true, given: target }));
  });
});

describe("architecture", () => {
  it("keeps native-script content out of the UI and engine layers", () => {
    const roots = ["src/ui", "src/exercises", "src/screens", "src/engine", "src/app", "src/App.tsx"];
    const offenders: string[] = [];
    const walk = (p: string) => {
      if (statSync(p).isDirectory()) return readdirSync(p).forEach((f) => walk(join(p, f)));
      if (!/\.(ts|tsx)$/.test(p) || /\.test\./.test(p)) return;
      // Kannada and Devanagari blocks: no language content may be hardcoded in these layers
      if (/\p{Script=Kannada}|\p{Script=Devanagari}/u.test(readFileSync(p, "utf8"))) offenders.push(p);
    };
    roots.forEach(walk);
    expect(offenders).toEqual([]);
  });
});
