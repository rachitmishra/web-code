import { useMemo, useState } from "react";
import type { MascotContext, MascotLine, MascotMood } from "../content/schema";
import { useEngine } from "../engine/store";
import { Icon } from "./Icon";
import { DebugLabel, Modal, Native, SpeakButton } from "./kit";

const MOOD_LABEL: Record<MascotMood, string> = {
  happy: "Cheerful",
  excited: "Hyped",
  thinking: "Thinking",
  encouraging: "Rooting for you",
  proud: "Proud",
  curious: "Curious",
  sleepy: "Cozy",
};

/**
 * Relatable Mysuru elephant calf mascot portrait.
 * Renders the pack's 3D studio character portrait per mood (with a clean SVG fallback
 * if a language pack doesn't supply custom portraits).
 */
export function MascotAvatar({
  mood = "happy",
  size = 56,
  className = "",
}: {
  mood?: MascotMood;
  size?: number;
  className?: string;
}) {
  const { pack } = useEngine();
  const src = pack.mascot?.avatars?.[mood] ?? pack.mascot?.avatars?.happy;

  if (src) {
    const radius = Math.round(size * 0.28);
    return (
      <span
        className={`mascot-frame mood-${mood} ${className}`}
        style={{ width: size, height: size, borderRadius: radius }}
        aria-hidden="true"
      >
        <img
          key={src}
          src={src}
          alt={pack.mascot?.name ?? "Mascot"}
          className="mascot-img"
          draggable={false}
        />
      </span>
    );
  }

  const isExcited = mood === "excited" || mood === "proud";
  const isThinking = mood === "thinking";
  const isSleepy = mood === "sleepy";
  const isEncouraging = mood === "encouraging";
  const isCurious = mood === "curious";

  // Trunk curls up joyfully when excited/proud, gently rests otherwise.
  const trunkPath = isExcited
    ? "M32 39 C32 45 35 50 41 48 C45 47 46 42 42 41"
    : isThinking
      ? "M32 39 C31 46 27 49 24 47 C22 45 23 43 26 43"
      : "M32 39 C32 46 34 51 39 50 C42 49.5 43 46.5 40.5 45.5";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`mascot-svg mood-${mood} ${className}`}
      aria-hidden="true"
    >
      {/* Karnataka kumkuma vermilion badge backdrop */}
      <rect x="3" y="3" width="58" height="58" rx="18" fill="#C8102E" stroke="#1E1716" strokeWidth="3.2" />

      {/* Expressive big elephant ears */}
      <ellipse cx="14.5" cy="31" rx="9" ry="12" transform="rotate(-10 14.5 31)" fill="#FFF4DC" stroke="#1E1716" strokeWidth="2.8" />
      <ellipse cx="15" cy="31.5" rx="4.8" ry="7" transform="rotate(-10 15 31.5)" fill="#F2B705" opacity="0.65" />
      <ellipse cx="49.5" cy="31" rx="9" ry="12" transform="rotate(10 49.5 31)" fill="#FFF4DC" stroke="#1E1716" strokeWidth="2.8" />
      <ellipse cx="49" cy="31.5" rx="4.8" ry="7" transform="rotate(10 49 31.5)" fill="#F2B705" opacity="0.65" />

      {/* Elephant head */}
      <circle cx="32" cy="33" r="18" fill="#FFFDF8" stroke="#1E1716" strokeWidth="3" />

      {/* Mysore-inspired royal arishina gold headband + kumkuma tilak */}
      <path d="M17.5 23.5 C23 17 41 17 46.5 23.5" fill="#F2B705" stroke="#1E1716" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="32" cy="21" r="2.3" fill="#C8102E" stroke="#1E1716" strokeWidth="1.4" />

      {/* Minimalist round glasses */}
      <circle cx="24" cy="31.5" r="6.5" fill="#FFFFFF" stroke="#1E1716" strokeWidth="2.5" />
      <circle cx="40" cy="31.5" r="6.5" fill="#FFFFFF" stroke="#1E1716" strokeWidth="2.5" />
      <path d="M30.5 31.5 H33.5" stroke="#1E1716" strokeWidth="2.5" strokeLinecap="round" />

      {/* Eyes by mood */}
      {isExcited ? (
        <>
          <path d="M21 32 C22.2 29.2 25.8 29.2 27 32" stroke="#1E1716" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M37 32 C38.2 29.2 41.8 29.2 43 32" stroke="#1E1716" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : isSleepy ? (
        <>
          <path d="M21 31.5 C22.5 33.8 25.5 33.8 27 31.5" stroke="#1E1716" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M37 31.5 C38.5 33.8 41.5 33.8 43 31.5" stroke="#1E1716" strokeWidth="2.4" strokeLinecap="round" />
        </>
      ) : isThinking ? (
        <>
          <circle cx="25.2" cy="30.2" r="2.4" fill="#1E1716" />
          <circle cx="41.2" cy="30.2" r="2.4" fill="#1E1716" />
        </>
      ) : isCurious ? (
        <>
          <circle cx="24" cy="31.5" r="2.9" fill="#1E1716" />
          <circle cx="25" cy="30.5" r="0.9" fill="#FFFFFF" />
          <circle cx="40" cy="31.5" r="2.9" fill="#1E1716" />
          <circle cx="41" cy="30.5" r="0.9" fill="#FFFFFF" />
        </>
      ) : (
        <>
          <circle cx="24" cy="31.5" r="2.5" fill="#1E1716" />
          <circle cx="24.9" cy="30.6" r="0.8" fill="#FFFFFF" />
          <circle cx="40" cy="31.5" r="2.5" fill="#1E1716" />
          <circle cx="40.9" cy="30.6" r="0.8" fill="#FFFFFF" />
        </>
      )}

      {/* Subtle rosy cheeks */}
      <circle cx="19" cy="38.5" r="2.4" fill="#C8102E" opacity="0.28" />
      <circle cx="45" cy="38.5" r="2.4" fill="#C8102E" opacity="0.28" />

      {/* Friendly smile behind trunk */}
      {isEncouraging ? (
        <path d="M26 42 C28.5 44 35.5 44 38 42" stroke="#1E1716" strokeWidth="2.2" strokeLinecap="round" />
      ) : (
        <path d="M25 41.5 C28 45 36 45 39 41.5" stroke="#1E1716" strokeWidth="2.2" strokeLinecap="round" />
      )}

      {/* Expressive little trunk */}
      <path d={trunkPath} stroke="#1E1716" strokeWidth="5.4" strokeLinecap="round" />
      <path d={trunkPath} stroke="#FFFDF8" strokeWidth="2.4" strokeLinecap="round" />

      {/* Sparkle star when excited/proud */}
      {isExcited && (
        <path d="M53 11 L54.3 14.2 L57.5 15.5 L54.3 16.8 L53 20 L51.7 16.8 L48.5 15.5 L51.7 14.2 Z" fill="#F2B705" stroke="#1E1716" strokeWidth="1.2" />
      )}
    </svg>
  );
}

/** Pick a mascot line matching the current context (deterministic by index). */
export function pickMascotLine(lines: MascotLine[], context: MascotContext, offset = 0): MascotLine | undefined {
  const matching = lines.filter((l) => l.context === context);
  const pool = matching.length ? matching : lines;
  return pool.length ? pool[offset % pool.length] : undefined;
}

/**
 * Interactive Companion Greeting Card for Home.
 * Greets the learner in Kannada with simplified phonetics, audio playback,
 * tap-to-cycle expressions, and a preview hook for the upcoming Live Chat feature.
 */
export function MascotGreetingCard({
  context,
  learnerName,
}: {
  context: MascotContext;
  learnerName: string;
}) {
  const { pack } = useEngine();
  const mascot = pack.mascot;
  const [tapCount, setTapCount] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);

  const greetingPool = useMemo(() => {
    if (!mascot) return [];
    const primary = mascot.lines.filter((l) => l.context === context);
    const extras = mascot.lines.filter((l) => l.context !== context && l.context !== "correct" && l.context !== "wrong");
    return [...primary, ...extras];
  }, [mascot, context]);

  if (!mascot || greetingPool.length === 0) return null;
  const line = greetingPool[tapCount % greetingPool.length];
  const phonetics = pack.phonetics ? pack.phonetics(line.roman) : line.roman;

  return (
    <>
      <section className="card mascot-card" aria-label={`${mascot.name} companion greeting`}>
        <DebugLabel name="MascotGreetingCard" />
        <div className="mascot-row">
          <button
            type="button"
            className="mascot-avatar-btn"
            onClick={() => setTapCount((n) => n + 1)}
            aria-label={`Tap ${mascot.name} for another greeting`}
            title={`Tap ${mascot.name} to say hi!`}
          >
            <MascotAvatar mood={line.mood} size={82} />
            <span className="mascot-mood-dot">{MOOD_LABEL[line.mood]}</span>
          </button>

          <div className="mascot-bubble stack" style={{ gap: 6, flex: 1, minWidth: 0 }}>
            <div className="row between wrap" style={{ gap: 6 }}>
              <div className="row" style={{ gap: 6 }}>
                <strong style={{ fontSize: 14 }}>{mascot.name}</strong>
                <Native size={14} say={false} style={{ color: "var(--terracotta)" }}>{mascot.nameScript}</Native>
                <span className="muted" style={{ fontSize: 12 }}>· {mascot.role}</span>
              </div>
              <SpeakButton text={line.script} roman={line.roman} small />
            </div>

            <Native as="p" size={19} say={false} style={{ lineHeight: 1.35, color: "var(--ink)" }}>
              {line.script}
            </Native>
            <p className="mascot-phon">{phonetics}</p>
            <p className="muted" style={{ fontSize: 13.5, fontWeight: 600 }}>{line.meaning}</p>

            <div className="row wrap" style={{ gap: 8, marginTop: 4 }}>
              <button
                type="button"
                className="chip"
                onClick={() => setTapCount((n) => n + 1)}
              >
                <Icon name="sparkle" /> Say something else
              </button>
              <button
                type="button"
                className="chip mascot-chat-pill"
                onClick={() => setChatOpen(true)}
              >
                <Icon name="bolt" /> Live Chat · Soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {chatOpen && (
        <Modal sheet label={`Chat with ${mascot.name}`} onClose={() => setChatOpen(false)}>
          <div className="stack" style={{ gap: 14 }}>
            <div className="row" style={{ gap: 12 }}>
              <MascotAvatar mood="excited" size={56} />
              <div className="stack" style={{ gap: 2 }}>
                <span className="eyebrow">Coming soon · Live Chat</span>
                <h2>Chat with {mascot.name} in {pack.config.name}</h2>
              </div>
            </div>
            <p className="muted" style={{ fontSize: 14 }}>
              Soon you'll be able to have real, friendly {pack.config.name} conversations with {mascot.name} — practicing everyday situations like ordering coffee, taking an auto, or chatting with friends, {learnerName}.
            </p>
            <div className="stack" style={{ gap: 8 }}>
              <span className="eyebrow">Conversation starters you'll practice</span>
              {mascot.chatStarters.map((st) => (
                <div key={st.script} className="mascot-starter row between" style={{ gap: 10 }}>
                  <div className="stack" style={{ gap: 2 }}>
                    <Native size={16} say={false}>{st.script}</Native>
                    <span className="mascot-phon" style={{ fontSize: 12 }}>{pack.phonetics ? pack.phonetics(st.roman) : st.roman}</span>
                    <span className="muted" style={{ fontSize: 12.5 }}>{st.meaning}</span>
                  </div>
                  <SpeakButton text={st.script} roman={st.roman} small />
                </div>
              ))}
            </div>
            <button type="button" className="btn primary block" onClick={() => setChatOpen(false)}>
              Got it
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
