import { useEngine } from "../engine/store";
import { DebugLabel } from "./kit";

type Palette = { rimA: string; rimB: string; faceA: string; faceB: string; accent: string; shape: "medal" | "shield" | "seal" | "oct" };

const PALETTES: Record<string, Palette> = {
  first_stamp:    { rimA: "#FCE38A", rimB: "#B87D14", faceA: "#E2384C", faceB: "#9A0D23", accent: "#FFF7E6", shape: "seal" },
  first_postcard: { rimA: "#FCE38A", rimB: "#B87D14", faceA: "#2E8A9E", faceB: "#154E5C", accent: "#FFF7E6", shape: "seal" },
  five_postcards: { rimA: "#FCE38A", rimB: "#A66E12", faceA: "#3E9450", faceB: "#1E542B", accent: "#FFF0C2", shape: "medal" },
  passport_full:  { rimA: "#FFF0A6", rimB: "#B8860B", faceA: "#5E1620", faceB: "#2B080D", accent: "#F7C948", shape: "shield" },
  words_25:       { rimA: "#F9D976", rimB: "#B07814", faceA: "#3D8E52", faceB: "#1F5730", accent: "#FFF7E6", shape: "medal" },
  words_100:      { rimA: "#FCE38A", rimB: "#A66E12", faceA: "#2B7A8E", faceB: "#144957", accent: "#FFF0C2", shape: "oct" },
  words_300:      { rimA: "#FFF0A6", rimB: "#B8860B", faceA: "#C81E38", faceB: "#780B1D", accent: "#FFE599", shape: "shield" },
  mastered_50:    { rimA: "#FCE38A", rimB: "#9E6E14", faceA: "#2E7A3C", faceB: "#164521", accent: "#F2E3B6", shape: "seal" },
  letters_all:    { rimA: "#FFF0A6", rimB: "#B8860B", faceA: "#C8102E", faceB: "#6E0B1A", accent: "#FFF0C2", shape: "seal" },
  scribe:         { rimA: "#FCE38A", rimB: "#9C6715", faceA: "#4E2228", faceB: "#260B0F", accent: "#F7C948", shape: "oct" },
  sentences_25:   { rimA: "#FCE38A", rimB: "#A66E12", faceA: "#28768A", faceB: "#13424F", accent: "#FFF7E6", shape: "oct" },
  perfect_5:      { rimA: "#FFF2B2", rimB: "#B8860B", faceA: "#E8A212", faceB: "#9C5B08", accent: "#FFFDF8", shape: "shield" },
  streak_7:       { rimA: "#FCE38A", rimB: "#B06E12", faceA: "#D93829", faceB: "#8A1610", accent: "#FFE599", shape: "medal" },
  streak_30:      { rimA: "#E6F4F8", rimB: "#4B8DA0", faceA: "#1D6F80", faceB: "#0E3F4A", accent: "#FFE082", shape: "shield" },
  fast_20:        { rimA: "#FFF0A6", rimB: "#B87D14", faceA: "#D46A1A", faceB: "#873308", accent: "#FFFDF8", shape: "oct" },
  combo_10:       { rimA: "#FFF0A6", rimB: "#B87D14", faceA: "#8E244D", faceB: "#4A0D27", accent: "#FFE082", shape: "medal" },
};

function Emblem({ id, accent, letterGlyph }: { id: string; accent: string; letterGlyph: string }) {
  const s = { stroke: accent, strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (id) {
    case "first_stamp":
      return (
        <g {...s}>
          <rect x="33" y="29" width="34" height="42" rx="4" fill="rgba(255,255,255,0.16)" />
          <path d="M50 38l3.2 6.8 7.3 1-5.3 5 1.3 7.2L50 54.5 43.5 58l1.3-7.2-5.3-5 7.3-1Z" fill={accent} stroke="none" />
        </g>
      );
    case "first_postcard":
      return (
        <g {...s}>
          <rect x="26" y="34" width="48" height="32" rx="5" fill="rgba(255,255,255,0.16)" />
          <path d="M27 37l23 16 23-16" fill="none" />
          <circle cx="50" cy="52" r="5" fill="#F2B705" stroke="none" />
        </g>
      );
    case "five_postcards":
      return (
        <g {...s}>
          <circle cx="50" cy="50" r="21" fill="rgba(255,255,255,0.12)" />
          <polygon points="50,31 55,47 50,50 45,47" fill={accent} stroke="none" />
          <polygon points="50,69 55,53 50,50 45,53" fill="rgba(255,255,255,0.45)" stroke="none" />
          <circle cx="50" cy="50" r="3" fill="#3B1214" stroke="none" />
        </g>
      );
    case "passport_full":
      return (
        <g {...s}>
          <path d="M28 60l4-22 10 9 8-14 8 14 10-9 4 22Z" fill={accent} />
          <rect x="29" y="63" width="42" height="5" rx="2.5" fill={accent} stroke="none" />
          <circle cx="50" cy="31" r="3" fill="#FFFDF8" stroke="none" />
        </g>
      );
    case "words_25":
      return (
        <g {...s}>
          <path d="M26 36c9-3 17-2 24 4v26c-7-6-15-7-24-4V36Z" fill="rgba(255,255,255,0.2)" />
          <path d="M74 36c-9-3-17-2-24 4v26c7-6 15-7 24-4V36Z" fill="rgba(255,255,255,0.14)" />
          <path d="M33 45h10M33 53h10M57 45h10M57 53h10" strokeWidth="2.2" />
        </g>
      );
    case "words_100":
      return (
        <g {...s}>
          <rect x="28" y="54" width="44" height="12" rx="3" fill="rgba(255,255,255,0.22)" />
          <rect x="31" y="42" width="38" height="12" rx="3" fill="rgba(255,255,255,0.16)" />
          <rect x="34" y="30" width="32" height="12" rx="3" fill={accent} />
        </g>
      );
    case "words_300":
      return (
        <g {...s}>
          <rect x="33" y="29" width="34" height="42" rx="6" fill="rgba(255,255,255,0.16)" />
          <path d="M29 33h42M29 67h42" strokeWidth="4" />
          <path d="M41 44h18M41 51h18M41 58h12" strokeWidth="2.4" />
        </g>
      );
    case "mastered_50":
      return (
        <g {...s}>
          <path d="M50 48v20M43 68c3-4 11-4 14 0" fill="none" strokeWidth="3.5" />
          <circle cx="50" cy="39" r="13" fill={accent} stroke="none" />
          <circle cx="38" cy="45" r="9" fill={accent} opacity="0.88" stroke="none" />
          <circle cx="62" cy="45" r="9" fill={accent} opacity="0.88" stroke="none" />
        </g>
      );
    case "letters_all":
      return (
        <g>
          <circle cx="50" cy="50" r="23" fill="rgba(255,255,255,0.14)" stroke={accent} strokeWidth="2" strokeDasharray="4 4" />
          <text x="50" y="61" textAnchor="middle" fill={accent} fontFamily="var(--native-font)" fontSize="34" fontWeight="700">{letterGlyph}</text>
        </g>
      );
    case "scribe":
      return (
        <g {...s}>
          <path d="M64 28l8 8-22 28-14 4 4-14Z" fill={accent} />
          <path d="M36 68l10-10" stroke="#3B1214" strokeWidth="2.2" />
          <circle cx="53" cy="47" r="2.5" fill="#3B1214" stroke="none" />
        </g>
      );
    case "sentences_25":
      return (
        <g {...s}>
          <rect x="28" y="34" width="20" height="16" rx="4" fill={accent} />
          <rect x="52" y="34" width="20" height="16" rx="4" fill="rgba(255,255,255,0.22)" />
          <rect x="34" y="54" width="32" height="14" rx="4" fill="rgba(255,255,255,0.22)" />
        </g>
      );
    case "perfect_5":
      return (
        <g {...s}>
          <polygon points="50,26 68,46 50,74 32,46" fill={accent} />
          <path d="M32 46h36M42 46l8 28 8-28M42 46l8-20 8 20" stroke="#B87D14" strokeWidth="1.8" fill="none" />
        </g>
      );
    case "streak_7":
      return (
        <g {...s}>
          <path d="M50 26c10 13 17 22 17 31a17 17 0 0 1-34 0c0-9 7-18 17-31Z" fill={accent} />
          <path d="M50 43c5 6 7 10 7 14a7 7 0 0 1-14 0c0-4 2-8 7-14Z" fill="#D93829" stroke="none" />
        </g>
      );
    case "streak_30":
      return (
        <g {...s}>
          <path d="M34 52h32a9 9 0 0 0 1-18 13 13 0 0 0-25-3 10 10 0 0 0-12 10 9 9 0 0 0 4 11Z" fill="#FFFDF8" stroke="none" />
          <path d="M39 59l-3 8M50 59l-3 8M61 59l-3 8" stroke={accent} strokeWidth="3.2" />
        </g>
      );
    case "fast_20":
      return (
        <g {...s}>
          <polygon points="55,26 33,53 48,53 45,74 67,47 52,47" fill={accent} />
        </g>
      );
    default:
      return (
        <g {...s}>
          <path d="M50 26l6 17 18 7-18 7-6 17-6-17-18-7 18-7Z" fill={accent} />
          <circle cx="69" cy="33" r="3" fill="#FFFDF8" stroke="none" />
          <circle cx="31" cy="67" r="2.5" fill="#FFFDF8" stroke="none" />
        </g>
      );
  }
}

function FramePath({ shape }: { shape: Palette["shape"] }) {
  if (shape === "shield") return <path d="M50 6L84 18v28c0 24-15 39-34 48C31 85 16 70 16 46V18Z" />;
  if (shape === "oct") return <polygon points="32,8 68,8 92,32 92,68 68,92 32,92 8,68 8,32" />;
  if (shape === "seal") return <path d="M50 6l8 5 9-2 5 8 9 2 1 9 8 6-3 9 5 8-6 7 1 9-9 4-3 9-9 1-6 7-9-3-9 3-6-7-9-1-3-9-9-4 1-9-6-7 5-8-3-9 8-6 1-9 9-2 5-8 9 2Z" />;
  return <circle cx="50" cy="50" r="44" />;
}

export function AchievementBadge({ id, unlocked, size = 68 }: { id: string; unlocked: boolean; size?: number }) {
  const { pack } = useEngine();
  const letterGlyph = pack.letters[0]?.script ?? "A";
  const p = PALETTES[id] ?? PALETTES.first_stamp;
  const uid = `${id}-${unlocked ? "u" : "l"}`;
  const rimA = unlocked ? p.rimA : "#E5D8BD";
  const rimB = unlocked ? p.rimB : "#B5A386";
  const faceA = unlocked ? p.faceA : "#D6C9B2";
  const faceB = unlocked ? p.faceB : "#B9AA92";
  const accent = unlocked ? p.accent : "#8C7D68";

  return (
    <div className={`ach-badge ${unlocked ? "unlocked" : "locked"}`} style={{ width: size, height: size }}>
      <DebugLabel name={`Badge:${id}`} />
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
        <defs>
          <linearGradient id={`rim-${uid}`} x1="0.15" y1="0" x2="0.85" y2="1">
            <stop offset="0%" stopColor={rimA} />
            <stop offset="100%" stopColor={rimB} />
          </linearGradient>
          <linearGradient id={`face-${uid}`} x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor={faceA} />
            <stop offset="100%" stopColor={faceB} />
          </linearGradient>
          <linearGradient id={`shine-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={unlocked ? 0.45 : 0.25} />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g fill={`url(#rim-${uid})`} stroke="rgba(59,18,20,0.22)" strokeWidth="1.5">
          <FramePath shape={p.shape} />
        </g>
        <g transform="translate(50 50) scale(0.84) translate(-50 -50)" fill={`url(#face-${uid})`} stroke="rgba(255,255,255,0.35)" strokeWidth="1.2">
          <FramePath shape={p.shape} />
        </g>
        <g transform="translate(50 50) scale(0.84) translate(-50 -50)" fill={`url(#shine-${uid})`}>
          <FramePath shape={p.shape} />
        </g>
        <Emblem id={id} accent={accent} letterGlyph={letterGlyph} />
        {!unlocked && (
          <g transform="translate(72 72)">
            <circle cx="0" cy="0" r="13" fill="#FFF7E6" stroke="#B5A386" strokeWidth="2" />
            <rect x="-5" y="-1" width="10" height="7" rx="1.8" fill="#7C5A4F" />
            <path d="M-3 -1v-3a3 3 0 0 1 6 0v3" fill="none" stroke="#7C5A4F" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </div>
  );
}
