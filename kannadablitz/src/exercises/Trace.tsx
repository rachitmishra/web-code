import { useCallback, useEffect, useRef, useState } from "react";
import { useEngine } from "../engine/store";
import { Icon } from "../ui/Icon";
import { SpeakButton } from "../ui/kit";
import type { ExerciseProps } from "./types";

const GRID = 64;

interface Pt { x: number; y: number; w: number }

/** Classic 45° fountain-pen / Kannada lekhani nib angle. */
const NIB_ANGLE = -Math.PI / 4;

/** Adaptive One-Euro low-pass filter: steady on slow loops, zero lag on fast sweeps. */
class OneEuro {
  private prev: number | null = null;
  private dPrev = 0;
  private readonly minCutoff: number;
  private readonly beta: number;
  constructor(minCutoff: number, beta: number) {
    this.minCutoff = minCutoff;
    this.beta = beta;
  }
  private alpha(cutoff: number, dt: number) {
    const tau = 1 / (2 * Math.PI * cutoff);
    return 1 / (1 + tau / Math.max(0.001, dt));
  }
  filter(val: number, dtSec: number): number {
    if (this.prev === null) {
      this.prev = val;
      return val;
    }
    const d = (val - this.prev) / Math.max(0.001, dtSec);
    const ad = this.alpha(1.0, dtSec);
    this.dPrev = ad * d + (1 - ad) * this.dPrev;
    const cutoff = this.minCutoff + this.beta * Math.abs(this.dPrev);
    const a = this.alpha(cutoff, dtSec);
    this.prev = a * val + (1 - a) * this.prev;
    return this.prev;
  }
}

/** Light Chaikin corner-relaxation pass on a finished stroke (keeps endpoints anchored). */
function relaxStroke(pts: Pt[]): Pt[] {
  if (pts.length < 4) return pts;
  const out: Pt[] = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[i - 1], b = pts[i], c = pts[i + 1];
    out.push({
      x: a.x * 0.2 + b.x * 0.6 + c.x * 0.2,
      y: a.y * 0.2 + b.y * 0.6 + c.y * 0.2,
      w: a.w * 0.2 + b.w * 0.6 + c.w * 0.2,
    });
  }
  out.push(pts[pts.length - 1]);
  return out;
}

/** Centripetal Catmull-Rom subdivision for silk-smooth C1-continuous Kannada loops. */
function catmullRom(pts: Pt[], size: number): Pt[] {
  if (pts.length < 4) return pts;
  const out: Pt[] = [pts[0]];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const segPx = Math.hypot((p2.x - p1.x) * size, (p2.y - p1.y) * size);
    const steps = segPx > 3.5 ? Math.min(5, Math.ceil(segPx / 3.2)) : 1;
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const t2 = t * t;
      const t3 = t2 * t;
      const x = 0.5 * (
        (2 * p1.x) +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
      );
      const y = 0.5 * (
        (2 * p1.y) +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
      );
      const w = p1.w + (p2.w - p1.w) * t;
      out.push({ x, y, w });
    }
  }
  return out;
}

/** Draw the glyph centred on a canvas context, sized to fill ~70% of the board. */
function drawGlyph(ctx: CanvasRenderingContext2D, glyph: string, size: number, font: string) {
  let px = size * 0.62;
  ctx.font = `600 ${px}px ${font}`;
  let m = ctx.measureText(glyph);
  const w = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
  const h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  const scale = Math.min((size * 0.7) / Math.max(1, w), (size * 0.7) / Math.max(1, h));
  px *= scale;
  ctx.font = `600 ${px}px ${font}`;
  m = ctx.measureText(glyph);
  const x = size / 2 - (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2;
  const y = size / 2 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  return { x, y, px, box: { left: x - m.actualBoundingBoxLeft, right: x + m.actualBoundingBoxRight, top: y - m.actualBoundingBoxAscent, bottom: y + m.actualBoundingBoxDescent } };
}

function cells(canvas: HTMLCanvasElement): Uint8Array {
  const small = document.createElement("canvas");
  small.width = GRID;
  small.height = GRID;
  const sctx = small.getContext("2d");
  if (!sctx) return new Uint8Array(GRID * GRID);
  sctx.drawImage(canvas, 0, 0, GRID, GRID);
  const data = sctx.getImageData(0, 0, GRID, GRID).data;
  const out = new Uint8Array(GRID * GRID);
  for (let i = 0; i < out.length; i++) out[i] = data[i * 4 + 3] > 40 ? 1 : 0;
  return out;
}

function dilate(src: Uint8Array, r: number): Uint8Array {
  const out = new Uint8Array(src.length);
  for (let y = 0; y < GRID; y++)
    for (let x = 0; x < GRID; x++) {
      if (!src[y * GRID + x]) continue;
      for (let dy = -r; dy <= r; dy++)
        for (let dx = -r; dx <= r; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && ny >= 0 && nx < GRID && ny < GRID) out[ny * GRID + nx] = 1;
        }
    }
  return out;
}

/** F1 overlap between the learner's ink and the reference glyph. */
function scoreDrawing(target: Uint8Array, ink: Uint8Array): number {
  const tD = dilate(target, 2);
  const iD = dilate(ink, 2);
  let t = 0, i = 0, hitT = 0, hitI = 0;
  for (let k = 0; k < target.length; k++) {
    if (target[k]) { t++; if (iD[k]) hitT++; }
    if (ink[k]) { i++; if (tD[k]) hitI++; }
  }
  if (!t || !i) return 0;
  const recall = hitT / t;
  const precision = hitI / i;
  return (2 * recall * precision) / (recall + precision || 1);
}

/**
 * Render one stroke as a single continuous variable-width fountain-pen ink ribbon
 * (Catmull-Rom resampled centerline + quadratic-smoothed polygon edges + rounded endcaps).
 */
function drawStroke(ctx: CanvasRenderingContext2D, rawPts: Pt[], size: number, base: number) {
  if (!rawPts.length) return;
  const pts = rawPts.length >= 4 ? catmullRom(rawPts, size) : rawPts;
  const n = pts.length;
  if (n === 1) {
    const r = Math.max(1.5, (base * pts[0].w) / 2);
    ctx.beginPath();
    ctx.arc(pts[0].x * size, pts[0].y * size, r, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  if (n === 2) {
    ctx.lineWidth = base * ((pts[0].w + pts[1].w) / 2);
    ctx.beginPath();
    ctx.moveTo(pts[0].x * size, pts[0].y * size);
    ctx.lineTo(pts[1].x * size, pts[1].y * size);
    ctx.stroke();
    return;
  }

  // Build left and right ribbon edges using smooth per-point normals
  const left: { x: number; y: number }[] = new Array(n);
  const right: { x: number; y: number }[] = new Array(n);
  let prevNx = 0;
  let prevNy = 1;

  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const prev = pts[Math.max(0, i - 1)];
    const next = pts[Math.min(n - 1, i + 1)];
    const dx = (next.x - prev.x) * size;
    const dy = (next.y - prev.y) * size;
    const len = Math.hypot(dx, dy);
    let nx = prevNx;
    let ny = prevNy;
    if (len > 0.001) {
      nx = -dy / len;
      ny = dx / len;
      prevNx = nx;
      prevNy = ny;
    }
    const r = Math.max(1.0, (base * p.w) / 2);
    const px = p.x * size;
    const py = p.y * size;
    left[i] = { x: px + nx * r, y: py + ny * r };
    right[i] = { x: px - nx * r, y: py - ny * r };
  }

  ctx.beginPath();
  ctx.moveTo(left[0].x, left[0].y);
  for (let i = 1; i < n - 1; i++) {
    const mx = (left[i].x + left[i + 1].x) / 2;
    const my = (left[i].y + left[i + 1].y) / 2;
    ctx.quadraticCurveTo(left[i].x, left[i].y, mx, my);
  }
  ctx.lineTo(left[n - 1].x, left[n - 1].y);

  const endR = Math.max(1.0, (base * pts[n - 1].w) / 2);
  const endAngle = Math.atan2(left[n - 1].y - right[n - 1].y, left[n - 1].x - right[n - 1].x);
  ctx.arc(pts[n - 1].x * size, pts[n - 1].y * size, endR, endAngle, endAngle + Math.PI, true);

  for (let i = n - 2; i > 0; i--) {
    const mx = (right[i].x + right[i - 1].x) / 2;
    const my = (right[i].y + right[i - 1].y) / 2;
    ctx.quadraticCurveTo(right[i].x, right[i].y, mx, my);
  }
  ctx.lineTo(right[0].x, right[0].y);

  const startR = Math.max(1.0, (base * pts[0].w) / 2);
  const startAngle = Math.atan2(right[0].y - left[0].y, right[0].x - left[0].x);
  ctx.arc(pts[0].x * size, pts[0].y * size, startR, startAngle, startAngle + Math.PI, true);

  ctx.closePath();
  ctx.fill();
}

const INK = "#3b1214";
const inkStyle = (ctx: CanvasRenderingContext2D) => {
  ctx.strokeStyle = INK;
  ctx.fillStyle = INK;
  ctx.globalAlpha = 0.94;
  ctx.globalCompositeOperation = "source-over";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
};

export function TraceBoard({ glyph, roman, freehand = false, onScored, disabled = false }: {
  glyph: string; roman?: string; freehand?: boolean; onScored: (score: number) => void; disabled?: boolean;
}) {
  const { pack } = useEngine();
  const boardRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLCanvasElement>(null);
  const inkRef = useRef<HTMLCanvasElement>(null);
  const targetRef = useRef<HTMLCanvasElement | null>(null);
  // Finished strokes are baked into an offscreen bitmap, so each frame only redraws the
  // stroke in progress. Points are board-relative (0..1) so they survive resizes/rotation.
  const bakedRef = useRef<HTMLCanvasElement | null>(null);
  const strokes = useRef<Pt[][]>([]);
  const active = useRef<{ id: number; pts: Pt[]; pen: boolean } | null>(null);
  const predicted = useRef<Pt[]>([]);
  const frame = useRef<number | null>(null);
  const [strokeCount, setStrokeCount] = useState(0);
  const hasInk = strokeCount > 0;
  const [peek, setPeek] = useState(!freehand);
  const [result, setResult] = useState<number | null>(null);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const font = pack.config.fontFamily;
  const blocked = useRef(false);
  useEffect(() => { blocked.current = disabled || result !== null; }, [disabled, result]);

  const paintGuide = useCallback((showResult: boolean) => {
    const board = boardRef.current, g = guideRef.current;
    if (!board || !g) return;
    const dpr = window.devicePixelRatio || 1;
    const size = board.clientWidth;
    g.width = size * dpr;
    g.height = size * dpr;
    const ctx = g.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size, size);
    const { x, y, box } = drawGlyph(ctx, glyph, size, font);
    if (showResult) {
      ctx.fillStyle = "rgba(46,122,60,0.28)";
      ctx.fillText(glyph, x, y);
      ctx.strokeStyle = "#2e7a3c";
      ctx.lineWidth = 2;
      ctx.strokeText(glyph, x, y);
    } else if (peek) {
      ctx.fillStyle = "rgba(242,183,5,0.16)";
      ctx.fillText(glyph, x, y);
      ctx.setLineDash([3, 7]);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "rgba(59,18,20,0.5)";
      ctx.strokeText(glyph, x, y);
    }
    // start point: the bottom-left of the first loop, per the anti-clockwise convention
    setStart({ x: ((box.left + (box.right - box.left) * 0.22) / size) * 100, y: ((box.top + (box.bottom - box.top) * 0.72) / size) * 100 });
    const t = document.createElement("canvas");
    t.width = size;
    t.height = size;
    const tctx = t.getContext("2d");
    if (!tctx) return;
    const d = drawGlyph(tctx, glyph, size, font);
    tctx.fillStyle = "#000";
    tctx.fillText(glyph, d.x, d.y);
    targetRef.current = t;
  }, [glyph, font, peek]);

  const metrics = () => {
    const size = boardRef.current?.clientWidth || 300;
    return { size, base: Math.max(9, size * 0.058), dpr: window.devicePixelRatio || 1 };
  };

  /** Redraw every finished stroke into the offscreen bitmap (after undo, clear, resize). */
  const rebake = useCallback(() => {
    const ink = inkRef.current;
    if (!ink) return;
    const { size, base, dpr } = metrics();
    const b = bakedRef.current ?? (bakedRef.current = document.createElement("canvas"));
    b.width = ink.width;
    b.height = ink.height;
    const ctx = b.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    inkStyle(ctx);
    for (const s of strokes.current) drawStroke(ctx, s, size, base);
  }, []);

  /** Append just the newest finished stroke to the bitmap. */
  const bakeLast = useCallback(() => {
    const b = bakedRef.current, last = strokes.current[strokes.current.length - 1];
    const ctx = b?.getContext("2d");
    if (!ctx || !last) return;
    const size = boardRef.current?.clientWidth || 300;
    inkStyle(ctx);
    drawStroke(ctx, last, size, Math.max(9, size * 0.058));
  }, []);

  const render = useCallback(() => {
    frame.current = null;
    const ink = inkRef.current;
    const ctx = ink?.getContext("2d");
    if (!ink || !ctx) return;
    const { size, base, dpr } = metrics();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, ink.width, ink.height);
    if (bakedRef.current?.width) ctx.drawImage(bakedRef.current, 0, 0);
    if (active.current) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      inkStyle(ctx);
      // the predicted tail is drawn but never stored, so the line keeps up with the finger
      drawStroke(ctx, predicted.current.length ? [...active.current.pts, ...predicted.current] : active.current.pts, size, base);
    }
  }, []);
  const schedule = useCallback(() => {
    if (frame.current === null) frame.current = requestAnimationFrame(render);
  }, [render]);

  useEffect(() => {
    let alive = true;
    const run = () => alive && paintGuide(result !== null);
    void (document.fonts?.ready ?? Promise.resolve()).then(run);
    run();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(run) : null;
    if (boardRef.current) ro?.observe(boardRef.current);
    return () => { alive = false; ro?.disconnect(); };
  }, [paintGuide, result]);

  // Pointer handling with native listeners: pointerrawupdate (where supported) delivers
  // input before the next frame, coalesced events give every sample the digitiser
  // reported, and predicted events extend the line to where the finger is heading.
  useEffect(() => {
    const board = boardRef.current, ink = inkRef.current;
    if (!board || !ink) return;
    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      const px = Math.round(board.clientWidth * dpr);
      if (ink.width !== px) { ink.width = px; ink.height = px; }
      rebake();
      render();
    };
    fit();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(fit) : null;
    ro?.observe(board);

    let lastT = 0;
    let cachedRect: DOMRect | null = null;
    let smoothV = 0;
    let fx: OneEuro | null = null;
    let fy: OneEuro | null = null;
    const toPt = (e: globalThis.PointerEvent, r: DOMRect): Pt => ({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height, w: 1 });
    const add = (e: globalThis.PointerEvent, r: DOMRect, final = false) => {
      const a = active.current!;
      const raw = toPt(e, r);
      const pts = a.pts;
      const last = pts[pts.length - 1];
      const size = r.width || 300;
      if (!last) {
        fx = new OneEuro(a.pen ? 2.6 : 1.4, a.pen ? 0.03 : 0.02);
        fy = new OneEuro(a.pen ? 2.6 : 1.4, a.pen ? 0.03 : 0.02);
        fx.filter(raw.x, 1 / 60);
        fy.filter(raw.y, 1 / 60);
        // Calligraphic entry taper as nib touches paper
        raw.w = a.pen && e.pressure > 0 ? 0.44 + Math.pow(e.pressure, 0.75) * 0.76 : 0.62;
        pts.push(raw);
        lastT = e.timeStamp;
        smoothV = 0;
        return;
      }
      const dist = Math.hypot((raw.x - last.x) * size, (raw.y - last.y) * size);
      if (dist < (a.pen ? 0.45 : 0.9) && !final) return; // filter micro-jitter
      const dtMs = Math.max(1, e.timeStamp - lastT);
      const dtSec = dtMs / 1000;
      const v = dist / dtMs; // px per ms
      smoothV = smoothV * 0.72 + v * 0.28;

      const nx = final ? last.x + (raw.x - last.x) * 0.85 : fx!.filter(raw.x, dtSec);
      const ny = final ? last.y + (raw.y - last.y) * 0.85 : fy!.filter(raw.y, dtSec);
      const dx = (nx - last.x) * size;
      const dy = (ny - last.y) * size;
      const stepDist = Math.hypot(dx, dy);

      // 1) Fountain-pen nib angle: cross-nib strokes swell, along-nib strokes become crisp hairlines
      const nibAngle = a.pen && (e.tiltX || e.tiltY)
        ? Math.atan2(e.tiltY, e.tiltX)
        : NIB_ANGLE;
      const strokeAngle = stepDist > 0.2 ? Math.atan2(dy, dx) : nibAngle + Math.PI / 2;
      const nibFactor = 0.52 + 0.58 * Math.abs(Math.sin(strokeAngle - nibAngle));

      // 2) Pressure: real stylus pressure (gamma curve) or simulated downstroke gravity + contact size
      let pressureFactor: number;
      if (a.pen && e.pressure > 0) {
        pressureFactor = 0.48 + Math.pow(e.pressure, 0.75) * 0.86;
      } else {
        const downBias = stepDist > 0.2 ? 1 + 0.16 * (dy / stepDist) : 1;
        const speedPool = Math.min(1.12, Math.max(0.68, 1.12 - smoothV * 0.22));
        const contact = e.width > 1 && e.width < 80 ? Math.min(1.12, Math.max(0.9, 0.88 + e.width * 0.008)) : 1;
        pressureFactor = downBias * speedPool * contact;
      }

      const targetW = Math.min(1.26, Math.max(0.36, nibFactor * pressureFactor));
      const w = last.w * 0.72 + targetW * 0.28;

      lastT = e.timeStamp;
      pts.push({ x: nx, y: ny, w });
    };

    const down = (e: globalThis.PointerEvent) => {
      if (blocked.current || active.current || (e.pointerType === "mouse" && e.button !== 0)) return;
      e.preventDefault();
      ink.setPointerCapture?.(e.pointerId);
      cachedRect = ink.getBoundingClientRect();
      active.current = { id: e.pointerId, pts: [], pen: e.pointerType === "pen" };
      add(e, cachedRect);
      schedule();
    };
    const move = (e: globalThis.PointerEvent) => {
      if (!active.current || active.current.id !== e.pointerId) return;
      e.preventDefault?.();
      const r = cachedRect ?? (cachedRect = ink.getBoundingClientRect());
      const batch = typeof e.getCoalescedEvents === "function" ? e.getCoalescedEvents() : [];
      (batch.length ? batch : [e]).forEach((ce) => add(ce, r));
      const pred = typeof e.getPredictedEvents === "function" ? e.getPredictedEvents() : [];
      const last = active.current.pts[active.current.pts.length - 1];
      predicted.current = pred.slice(0, 2).map((pe) => ({ ...toPt(pe, r), w: last?.w ?? 1 }));
      schedule();
    };
    const up = (e: globalThis.PointerEvent) => {
      if (!active.current || active.current.id !== e.pointerId) return;
      const r = cachedRect ?? ink.getBoundingClientRect();
      cachedRect = null;
      add(e, r, true);
      // Light post-lift micro-polish + natural calligraphic lifted-nib exit taper
      const pts = relaxStroke(active.current.pts);
      const tail = Math.min(6, pts.length - 1);
      for (let i = 0; i < tail; i++) {
        const factor = 0.32 + (i / Math.max(1, tail)) * 0.68;
        pts[pts.length - 1 - i].w *= factor;
      }
      strokes.current = [...strokes.current, pts];
      active.current = null;
      predicted.current = [];
      bakeLast();
      setStrokeCount(strokes.current.length);
      schedule();
    };
    const moveEvent = "onpointerrawupdate" in window ? "pointerrawupdate" : "pointermove";
    const opts = { passive: false } as AddEventListenerOptions;
    ink.addEventListener("pointerdown", down, opts);
    ink.addEventListener(moveEvent as "pointermove", move, opts);
    ink.addEventListener("pointerup", up);
    ink.addEventListener("pointercancel", up);
    // Safari: stop the page scrolling / bouncing while drawing
    const stopTouch = (e: TouchEvent) => e.preventDefault();
    ink.addEventListener("touchstart", stopTouch, opts);
    ink.addEventListener("touchmove", stopTouch, opts);
    return () => {
      ro?.disconnect();
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      ink.removeEventListener("pointerdown", down);
      ink.removeEventListener(moveEvent as "pointermove", move);
      ink.removeEventListener("pointerup", up);
      ink.removeEventListener("pointercancel", up);
      ink.removeEventListener("touchstart", stopTouch);
      ink.removeEventListener("touchmove", stopTouch);
    };
  }, [glyph, render, rebake, schedule, bakeLast]);

  const clear = () => {
    strokes.current = [];
    active.current = null;
    setStrokeCount(0);
    setResult(null);
    rebake();
    schedule();
  };
  const undo = () => {
    strokes.current = strokes.current.slice(0, -1);
    setStrokeCount(strokes.current.length);
    rebake();
    schedule();
  };

  const check = () => {
    if (!targetRef.current || !inkRef.current) return;
    render(); // make sure the latest stroke is on the canvas before scoring
    const s = scoreDrawing(cells(targetRef.current), cells(inkRef.current));
    setResult(s);
    navigator.vibrate?.(s >= 0.3 ? 12 : [20, 40, 20]);
    onScored(s);
  };

  const stars = result === null ? 0 : result >= 0.55 ? 3 : result >= 0.4 ? 2 : result >= 0.25 ? 1 : 0;

  return (
    <div className="trace-wrap">
      <div className="trace-board" ref={boardRef}>
        <canvas ref={guideRef} aria-hidden="true" />
        <canvas
          ref={inkRef}
          onContextMenu={(e) => e.preventDefault()}
          aria-label={`Drawing area for ${glyph}`}
          role="img"
        />
        {peek && !hasInk && start && result === null && (
          <span aria-hidden="true" style={{ position: "absolute", left: `${start.x}%`, top: `${start.y}%`, transform: "translate(-50%,-50%)", width: 18, height: 18, borderRadius: "50%", background: "var(--terracotta)", boxShadow: "0 0 0 6px rgba(200, 16, 46,.25)", animation: "pulse 1.6s infinite" }} />
        )}
      </div>
      {result !== null && (
        <div className="stack" style={{ alignItems: "center", gap: 4 }}>
          <div className="trace-score">{[1, 2, 3].map((i) => <Icon key={i} name="star" filled className={i <= stars ? "on" : ""} />)}</div>
          <strong>{stars === 3 ? "Beautiful, that's a clean letter" : stars === 2 ? "Nice shape, close to the model" : stars === 1 ? "Recognisable. Try rounder curves" : "Not quite. Compare with the green outline"}</strong>
          <span className="muted" style={{ fontSize: 13 }}>The green outline shows the model letter over your drawing.</span>
        </div>
      )}
      <div className="trace-actions">
        <button type="button" className="btn" onClick={undo} disabled={disabled || !hasInk || result !== null}><Icon name="arrowLeft" /> Undo</button>
        <button type="button" className="btn" onClick={clear} disabled={disabled}><Icon name="eraser" /> Clear</button>
        {freehand && <button type="button" className="btn" onClick={() => setPeek((p) => !p)} disabled={result !== null}><Icon name="eye" /> {peek ? "Hide guide" : "Peek"}</button>}
        <SpeakButton text={glyph} roman={roman} />
        {result === null && <button type="button" className="btn primary" onClick={check} disabled={!hasInk || disabled}><Icon name="check" /> Compare</button>}
      </div>
    </div>
  );
}

export function TraceExercise({ ex, onAnswer, locked }: ExerciseProps) {
  const { pack } = useEngine();
  const [showTip, setShowTip] = useState(false);
  const l = ex.letter!;
  return (
    <div>
      <div className="row between" style={{ marginBottom: showTip || l.kind === "combo" ? 10 : 18, alignItems: "center" }}>
        <p className="prompt" style={{ marginBottom: 0 }}>
          {ex.freehand ? "Now write it from memory" : l.kind === "combo" ? "Trace the combination" : "Trace the letter"}{" "}
          <span className="native" style={{ color: "var(--terracotta)" }}>{l.script}</span>{" "}
          <span className="roman" style={{ fontSize: 16 }}>({l.roman})</span>
        </p>
        {pack.config.writingTip && (
          <button
            type="button"
            className={`icon-btn ${showTip ? "playing" : ""}`}
            style={{ width: 34, height: 34, flexShrink: 0 }}
            aria-expanded={showTip}
            aria-label="Writing tip"
            title="Writing tip"
            onClick={() => setShowTip((v) => !v)}
          >
            <Icon name="info" />
          </button>
        )}
      </div>
      {l.kind === "combo" && l.hint && (
        <p className="muted" style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 12 }}>{l.hint}</p>
      )}
      {showTip && pack.config.writingTip && (
        <p className="trace-tip-box">{pack.config.writingTip}</p>
      )}
      <TraceBoard key={`${l.id}.${ex.freehand}`} glyph={l.script} roman={l.roman} freehand={ex.freehand} disabled={locked} onScored={(score) => onAnswer({ correct: score >= 0.3, score })} />
    </div>
  );
}
