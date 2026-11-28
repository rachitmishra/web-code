import { useMemo, useRef, useState } from "react";
import { useEngine } from "../engine/store";
import { Icon } from "../ui/Icon";
import { Art, Native, SpeakButton } from "../ui/kit";
import { useSayScript } from "../ui/phonetic";
import type { ExerciseProps } from "./types";

const PAD_SIZE = 264;
const CENTER = PAD_SIZE / 2;
const RADIUS = 94;
const NODE_HIT = 34;

/**
 * Swipe-to-build word exercise: glide a finger/mouse across circular letter nodes
 * (or tap them in order) to spell the target word from its meaning and illustration.
 */
export function WordSwipe({ ex, onAnswer, locked }: ExerciseProps) {
  const { pack } = useEngine();
  const sayIt = useSayScript();
  const v = ex.vocab!;
  const target = useMemo(() => ex.swipeTarget ?? [], [ex.swipeTarget]);
  const nodes = useMemo(() => ex.swipeNodes ?? [], [ex.swipeNodes]);

  const [selected, setSelected] = useState<string[]>([]);
  const [swiping, setSwiping] = useState(false);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const padRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef(false);

  const positions = useMemo(() => {
    const n = Math.max(1, nodes.length);
    return nodes.map((node, i) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      return {
        ...node,
        x: CENTER + Math.cos(angle) * RADIUS,
        y: CENTER + Math.sin(angle) * RADIUS,
      };
    });
  }, [nodes]);

  const nodeById = useMemo(() => new Map(positions.map((p) => [p.id, p])), [positions]);
  const builtText = selected.map((id) => nodeById.get(id)?.text ?? "").join("");
  const targetText = target.join("");

  const localPoint = (clientX: number, clientY: number) => {
    const r = padRef.current?.getBoundingClientRect();
    if (!r) return null;
    return {
      x: ((clientX - r.left) / r.width) * PAD_SIZE,
      y: ((clientY - r.top) / r.height) * PAD_SIZE,
    };
  };

  const hitNode = (x: number, y: number) => {
    for (const p of positions) {
      if (Math.hypot(x - p.x, y - p.y) <= NODE_HIT) return p;
    }
    return null;
  };

  const commit = (ids: string[]) => {
    if (locked || submitted || ids.length === 0) return;
    const given = ids.map((id) => nodeById.get(id)?.text ?? "").join("");
    setSubmitted(true);
    onAnswer({ correct: given === targetText, given });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (locked || submitted) return;
    const pt = localPoint(e.clientX, e.clientY);
    if (!pt) return;
    const hit = hitNode(pt.x, pt.y);
    if (!hit) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    draggedRef.current = false;
    setSwiping(true);
    setPointer(pt);
    setSelected((cur) => {
      // If starting a fresh swipe on a node already in the list, toggle/remove if it's the last one
      if (cur.includes(hit.id)) {
        return cur[cur.length - 1] === hit.id ? cur.slice(0, -1) : cur;
      }
      return [...cur, hit.id];
    });
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!swiping || locked || submitted) return;
    const pt = localPoint(e.clientX, e.clientY);
    if (!pt) return;
    e.preventDefault();
    setPointer(pt);
    const hit = hitNode(pt.x, pt.y);
    if (!hit) return;
    setSelected((cur) => {
      if (cur[cur.length - 1] === hit.id) return cur;
      // Dragging back onto the previous node undoes the last letter
      if (cur.length >= 2 && cur[cur.length - 2] === hit.id) {
        draggedRef.current = true;
        return cur.slice(0, -1);
      }
      if (cur.includes(hit.id)) return cur;
      draggedRef.current = true;
      navigator.vibrate?.(8);
      return [...cur, hit.id];
    });
  };

  const onPointerUp = () => {
    if (!swiping) return;
    setSwiping(false);
    setPointer(null);
    // Auto-submit when a swipe gesture builds the exact target word
    if (draggedRef.current && selected.length >= target.length) {
      const given = selected.map((id) => nodeById.get(id)?.text ?? "").join("");
      if (given === targetText) commit(selected);
    }
  };

  const giveHint = () => {
    if (locked || submitted) return;
    const nextIdx = selected.length;
    if (nextIdx >= target.length) return;
    const neededText = target[nextIdx];
    const match = positions.find((p) => p.text === neededText && !selected.includes(p.id));
    if (match) setSelected((cur) => [...cur, match.id]);
  };

  const trailPoints = selected
    .map((id) => nodeById.get(id))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .map((p) => `${p.x},${p.y}`);
  if (swiping && pointer && trailPoints.length > 0) {
    trailPoints.push(`${pointer.x},${pointer.y}`);
  }

  return (
    <div className="stack" style={{ alignItems: "center", gap: 14 }}>
      <p className="prompt" style={{ marginBottom: 0, alignSelf: "flex-start" }}>Swipe to build the word</p>

      <div className="row" style={{ gap: 14, alignItems: "center", width: "100%" }}>
        <Art vocab={v} size={80} />
        <div className="stack" style={{ gap: 4, flex: 1, minWidth: 0 }}>
          <span className="eyebrow">Spell in {pack.config.name}</span>
          <h2 style={{ fontSize: 22, lineHeight: 1.2 }}>{v.meaning}</h2>
        </div>
        <SpeakButton text={v.script} roman={v.roman} small />
      </div>

      {/* Live built-word preview tray */}
      <div className={`swipe-tray ${submitted ? (builtText === targetText ? "right" : "wrong") : ""}`} aria-live="polite">
        {selected.length === 0 ? (
          <span className="faint" style={{ fontSize: 13.5, fontWeight: 700 }}>
            Swipe or tap {target.length} letters in order
          </span>
        ) : (
          <Native as="div" size={28} style={{ lineHeight: 1.2 }}>{builtText}</Native>
        )}
      </div>

      {/* Circular swipe wheel */}
      <div
        ref={padRef}
        className="swipe-pad"
        style={{ width: PAD_SIZE, height: PAD_SIZE }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="group"
        aria-label="Letter swipe wheel"
      >
        <svg className="swipe-lines" viewBox={`0 0 ${PAD_SIZE} ${PAD_SIZE}`} aria-hidden="true">
          <circle cx={CENTER} cy={CENTER} r={RADIUS} className="swipe-ring" />
          {trailPoints.length >= 2 && (
            <polyline points={trailPoints.join(" ")} className="swipe-trail" />
          )}
        </svg>

        {positions.map((p) => {
          const order = selected.indexOf(p.id);
          const isPicked = order !== -1;
          return (
            <button
              key={p.id}
              type="button"
              lang={pack.config.id}
              className={`swipe-node ${isPicked ? "active" : ""}`}
              style={{ left: p.x, top: p.y }}
              disabled={locked || submitted}
              data-say={sayIt(p.text)}
              aria-pressed={isPicked}
            >
              <span>{p.text}</span>
              {isPicked && <i className="swipe-order">{order + 1}</i>}
            </button>
          );
        })}
      </div>

      {!locked && !submitted && (
        <div className="row" style={{ width: "100%", gap: 8 }}>
          <button type="button" className="btn" onClick={() => setSelected([])} disabled={!selected.length}>
            <Icon name="eraser" /> Clear
          </button>
          <button type="button" className="btn" onClick={giveHint} disabled={selected.length >= target.length}>
            <Icon name="sparkle" /> Hint
          </button>
          <button
            type="button"
            className="btn primary lg"
            style={{ flex: 1 }}
            disabled={selected.length < 2}
            onClick={() => commit(selected)}
          >
            Check
          </button>
        </div>
      )}
    </div>
  );
}
