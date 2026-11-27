import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { PostcardSpec, VocabEntry } from "../content/schema";
import { useEngine } from "../engine/store";
import { speak } from "../engine/speech";
import { Icon } from "./Icon";
import { useSayScript } from "./phonetic";
import { Motif } from "./Motif";

/** Native-script text. Always rendered with the pack font + language tag. */
export function Native({ children, size, className = "", as: Tag = "span", style, say = true }: {
  children: ReactNode; size?: number; className?: string; as?: "span" | "div" | "p" | "h1" | "h2" | "h3"; style?: CSSProperties;
  /** Show the English pronunciation under the text (drawn by CSS from data-say). */
  say?: boolean;
}) {
  const { pack } = useEngine();
  const sayScript = useSayScript();
  // Every native word carries its phonetics. Drawn as CSS generated content so the
  // element's text stays the pure native word (copy/paste, matching, tests).
  const said = typeof children === "string" ? sayScript(children) : undefined;
  return (
    <Tag className={`native ${className}`} lang={pack.config.id} dir={pack.config.direction} style={{ fontSize: size, ...style }}
      data-say={say ? said : undefined} title={said && !say ? `say ${said}` : undefined}>
      {children}
    </Tag>
  );
}

/** Resolve a native-script token's English meaning from pack vocabulary (exact or longest root prefix). */
export function lookupWordMeaning(token: string, vocab: VocabEntry[]): string | undefined {
  const clean = token.replace(/[.,!?;:"'()—–-]+/g, "").trim();
  if (!clean) return undefined;
  const exact = vocab.find((v) => v.script === clean);
  if (exact) return exact.meaning;
  let best: VocabEntry | undefined;
  for (const v of vocab) {
    if (v.script.length >= 2 && !v.script.includes(" ") && clean.startsWith(v.script)) {
      if (!best || v.script.length > best.script.length) best = v;
    }
  }
  return best?.meaning;
}

/** Single native-script word with phonetics on top and optional tap-to-peek English meaning. */
export function WordPeek({
  token,
  className = "",
  size,
  active = false,
  onToggle,
}: {
  token: string;
  className?: string;
  size?: number;
  active?: boolean;
  onToggle?: () => void;
}) {
  const { pack, state } = useEngine();
  const sayScript = useSayScript();
  const enabled = state.settings.showWordMeaning ?? true;
  const meaning = enabled ? lookupWordMeaning(token, pack.vocab) : undefined;
  const said = sayScript(token);

  if (!meaning) {
    return (
      <span
        className={`word-peek-plain ${className}`}
        lang={pack.config.id}
        style={size ? { fontSize: size } : undefined}
        data-say={said}
      >
        {token}
      </span>
    );
  }

  return (
    <span className="word-peek-wrap">
      <button
        type="button"
        className={`word-peek ${active ? "open" : ""} ${className}`}
        lang={pack.config.id}
        style={size ? { fontSize: size } : undefined}
        data-say={said}
        aria-expanded={active}
        onClick={(e) => { e.stopPropagation(); onToggle?.(); }}
      >
        {token}
      </button>
      {active && (
        <span className="word-peek-tip" role="tooltip">
          {meaning}
        </span>
      )}
    </span>
  );
}

/** Renders a multi-word native passage with per-word phonetics on top and tap-to-peek meanings. */
export function NativeWords({ text, size, className = "" }: { text: string; size?: number; className?: string }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const tokens = text.split(/\s+/).filter(Boolean);
  return (
    <span className={`native-words ${className}`}>
      {tokens.map((tok, i) => (
        <WordPeek
          key={`${i}.${tok}`}
          token={tok}
          size={size}
          active={openIdx === i}
          onToggle={() => setOpenIdx((cur) => (cur === i ? null : i))}
        />
      ))}
    </span>
  );
}

/** Romanisation, hidden when the learner turns it off in Settings. */
export function Roman({ children, force = false }: { children: ReactNode; force?: boolean }) {
  const { state } = useEngine();
  if (!state.settings.showRoman && !force) return null;
  return <span className="roman">{children}</span>;
}

/** Floating debug badge shown when Settings → Debug UI is enabled; renders nothing when off. */
export function DebugLabel({ name, kind = "comp" }: { name: string; kind?: "screen" | "comp" }) {
  const { state } = useEngine();
  if (!state.settings.debug) return null;
  return (
    <span className={`debug-tag ${kind}`} aria-hidden="true">
      {kind === "screen" ? `Screen · ${name}` : name}
    </span>
  );
}

/** Floating Liquid Glass HUD showing the active screen name and a quick toggle off. */
export function DebugHud({ screen }: { screen: string }) {
  const { state, update } = useEngine();
  if (!state.settings.debug) return null;
  return (
    <div className="debug-hud" role="region" aria-label="Debug overlay">
      <span className="debug-hud-dot" aria-hidden="true" />
      <span className="debug-hud-name">{screen}</span>
      <button
        type="button"
        className="debug-hud-off"
        onClick={() => update((s) => ({ ...s, settings: { ...s.settings, debug: false } }))}
        title="Turn off debug labels (Alt+D)"
      >
        OFF
      </button>
    </div>
  );
}

export function Art({ vocab, size = 120, className = "" }: { vocab: VocabEntry; size?: number | string; className?: string }) {
  const { art } = useEngine();
  const a = art(vocab);
  const style = { width: size, height: size };
  if (a.kind === "img") return <div className={`art ${className}`} style={style}><DebugLabel name="Art" /><img src={a.src} alt={a.alt} /></div>;
  if (a.kind === "svg")
    // Built-in pack art only: imported packs have raw SVG stripped in validate.ts
    return <div className={`art ${className}`} style={style} role="img" aria-label={a.alt}><DebugLabel name="Art" /><div style={{ width: "100%", height: "100%" }} dangerouslySetInnerHTML={{ __html: a.svg }} /></div>;
  return <div className={`art ${className}`} style={style} aria-label={a.alt}><DebugLabel name="Art:Motif" /><Motif topic={a.topic} variant={a.variant} hue={a.hue} /></div>;
}

/** English-friendly pronunciation ("baa-le-han-nu") for learners who can't read the script yet. */
export function Say({ roman, small = false, className = "" }: { roman?: string; small?: boolean; className?: string }) {
  const { pack, state } = useEngine();
  if (!roman || !state.settings.showPhonetics || !pack.phonetics) return null;
  const said = pack.phonetics(roman);
  return <span className={`say ${small ? "small" : ""} ${className}`} title={`Sounds like: ${said}`}><b>{said}</b></span>;
}

/**
 * Speaks the native text with the device's voice for the pack language. Devices with no
 * such voice (most desktops, many phones) read the phonetic respelling with an English voice.
 */
export function SpeakButton({ text, roman, className = "", small = false }: { text: string; roman?: string; className?: string; small?: boolean }) {
  const { pack, state } = useEngine();
  const [status, setStatus] = useState<"idle" | "playing" | "fallback" | "none">("idle");
  if (!state.settings.sound) return null;
  const fallback = roman ? (pack.phonetics ? pack.phonetics(roman) : roman).replace(/-/g, " ") : undefined;
  const play = async () => {
    setStatus("playing");
    const r = await speak(text, pack.config.speechLang, { fallbackText: fallback });
    setStatus(r === "native" ? "idle" : r === "fallback" ? "fallback" : "none");
    if (r !== "native") window.setTimeout(() => setStatus("idle"), 3200);
  };
  return (
    <span className="speak-wrap">
      <button
        type="button"
        className={`icon-btn ${status === "playing" ? "playing" : ""} ${className}`}
        style={small ? { width: 36, height: 36 } : undefined}
        onClick={(e) => { e.stopPropagation(); void play(); }}
        aria-label="Play pronunciation"
        title="Play pronunciation"
      >
        <Icon name="speaker" />
      </button>
      {status === "fallback" && <span className="speak-note" role="status">No {pack.config.name} voice on this device, so the phonetic spelling was read aloud</span>}
      {status === "none" && <span className="speak-note" role="status">This browser has no speech voices. Try Chrome, or install a {pack.config.name} voice.</span>}
    </span>
  );
}

export function Bar({ value, tone = "", thick = false, label }: { value: number; tone?: "" | "saffron" | "terracotta"; thick?: boolean; label?: string }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div className={`bar ${tone} ${thick ? "thick" : ""}`} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <span style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Ring({ value, size = 88, stroke = 9, color = "var(--leaf)", children }: { value: number; size?: number; stroke?: number; color?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value));
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <DebugLabel name="Ring" />
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--paper-3)" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - v)} style={{ transition: "stroke-dashoffset .6s" }} />
      </svg>
      <div className="ring-label">{children}</div>
    </div>
  );
}

export function Hearts({ count, max }: { count: number; max: number }) {
  return (
    <span className="hearts" aria-label={`${count} of ${max} lives`}>
      {Array.from({ length: max }, (_, i) => <Icon key={i} name="heart" filled className={i < count ? "" : "empty"} />)}
    </span>
  );
}

export function Stars({ n, of = 3, className = "path-stars" }: { n: number; of?: number; className?: string }) {
  return (
    <span className={className} aria-label={`${n} of ${of} stars`}>
      {Array.from({ length: of }, (_, i) => <Icon key={i} name="star" filled className={i < n ? "on" : ""} />)}
    </span>
  );
}

export function Difficulty({ n }: { n: number }) {
  return <span className="difficulty" aria-label={`Difficulty ${n} of 5`}>{[1, 2, 3, 4, 5].map((i) => <i key={i} className={i <= n ? "on" : ""} />)}</span>;
}

// Karnataka stamp inks: kumkuma red, temple maroon, Mysore gold, peacock silk, betel green, indigo, sandal brown
const STAMP_COLORS = ["#C8102E", "#7A1F2B", "#B8860B", "#1D6F80", "#2E7A3C", "#3B3F8F", "#9C5B2E"];
export function Stamp({ glyph, label, code, seed, empty = false, className = "" }: { glyph: string; label: string; code: string; seed: number; empty?: boolean; className?: string }) {
  const bg = STAMP_COLORS[seed % STAMP_COLORS.length];
  return (
    <div className={`stamp ${empty ? "empty" : ""} ${className}`} title={empty ? `${label} (not collected yet)` : label}>
      <DebugLabel name="Stamp" />
      <div className="stamp-inner" style={{ backgroundColor: bg }}>
        <span className="stamp-top">
          <small className="stamp-issuer">KARNATAKA</small>
          <small className="stamp-code">{code}</small>
        </span>
        <span className="stamp-medallion">
          <Native className="native" say={false} style={{ fontSize: glyph.length > 5 ? 18 : glyph.length > 3 ? 22 : glyph.length > 2 ? 25 : undefined }}>{glyph || "·"}</Native>
        </span>
        <small className="stamp-label">{label}</small>
      </div>
    </div>
  );
}

function FallbackScene({ pc }: { pc: PostcardSpec }) {
  return (
    <svg viewBox="0 0 360 190" xmlns="http://www.w3.org/2000/svg">
      <rect width="360" height="190" fill={pc.palette.paper} />
      <circle cx="290" cy="46" r="22" fill={pc.palette.accent} />
      <path d="M0 130 Q90 80 180 120 T360 110 V190 H0 Z" fill={pc.palette.ink} opacity="0.85" />
      <path d="M0 160 Q120 120 240 156 T360 150 V190 H0 Z" fill={pc.palette.accent} opacity="0.5" />
    </svg>
  );
}

export function Postcard({ pc, levelTitle, date, name, locked = false, wide = false, message }: {
  pc: PostcardSpec; levelTitle: string; date?: number; name?: string; locked?: boolean; wide?: boolean; message?: string;
}) {
  const { pack } = useEngine();
  const svg = pack.postcardArt[pc.art];
  return (
    <article className={`postcard ${wide ? "wide" : ""} ${locked ? "locked" : ""}`} style={{ background: pc.palette.paper }}>
      <DebugLabel name="Postcard" />
      <div className="postcard-art">
        {!svg ? <FallbackScene pc={pc} /> : svg.trimStart().startsWith("<")
          ? <div style={{ width: "100%", height: "100%" }} dangerouslySetInnerHTML={{ __html: svg }} />
          : <img src={svg} alt={pc.place} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
        <span className="city">{pc.city}</span>
      </div>
      <div className="postcard-back">
        <div className="postmark" aria-label={`Postmark ${pc.stampCode}`}>
          <span className="postmark-ring">
            <span className="postmark-arc top">KARNATAKA POST</span>
            <span className="postmark-date">
              <b>{pc.stampCode}</b>
              <span>{date ? new Date(date).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "2-digit" }) : "— — —"}</span>
            </span>
            <span className="postmark-arc bot">{pc.city.toUpperCase()}</span>
          </span>
        </div>
        <span className="eyebrow">{levelTitle}</span>
        <Native size={26} className="postcard-phrase">{pc.phraseScript}</Native>
        <span className="muted" style={{ fontWeight: 700, fontSize: 13 }}>“{pc.phraseMeaning}”</span>
        {!locked && (
          <p className="hand">{message ?? `Dear ${name || "traveller"}, ${pc.note}`}</p>
        )}
        {locked && <p className="muted" style={{ fontSize: 13 }}>Complete this level to have this postcard delivered.</p>}
        <span className="muted" style={{ fontSize: 12, fontWeight: 700 }}>{pc.place} · {pc.stampTitle}</span>
      </div>
    </article>
  );
}

export function Modal({ children, onClose, wide = false, sheet = false, label }: { children: ReactNode; onClose?: () => void; wide?: boolean; sheet?: boolean; label: string }) {
  useEffect(() => {
    if (!onClose) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return createPortal(
    <div className={`overlay ${sheet ? "sheet" : ""}`} role="dialog" aria-modal="true" aria-label={label} onClick={onClose}>
      <div className={`modal ${wide ? "wide" : ""} ${sheet ? "sheet" : ""}`} onClick={(e) => e.stopPropagation()}>
        <DebugLabel name={`Modal (${label})`} />
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function Empty({ icon, title, body, action }: { icon: string; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="card dashed stack" style={{ alignItems: "center", textAlign: "center", padding: 32 }}>
      <DebugLabel name="Empty" />
      <Icon name={icon} className="faint" />
      <h3>{title}</h3>
      <p className="muted">{body}</p>
      {action}
    </div>
  );
}

export { MascotAvatar as Mascot } from "./Mascot";
