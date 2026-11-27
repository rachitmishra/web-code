import type { Topic } from "../content/schema";

/**
 * Generated topic motifs. One art direction for all: soft Scandinavian pastel
 * flat-editorial vector style — lineless rounded shapes, airy sky-mist gradient,
 * subtle oval ground shadow, warm coral / butter / eucalyptus / slate accents.
 */
const INK = "#56616E";
const T = "#E07A5F";
const S = "#F2C974";
const L = "#7BB28C";
const SKY = "#84A7C4";
const CREAM = "#FFFFFF";
const sw = { strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const ln = { fill: "none", stroke: INK, strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const BG_GRAD: [string, string][] = [
  ["#EBF4F8", "#FAFDFE"],
  ["#EDF5EF", "#FAFDFA"],
  ["#F8F1EA", "#FDFBF8"],
  ["#F4EFF7", "#FCFBFD"],
];

function Subject({ topic }: { topic: Topic }) {
  switch (topic) {
    case "greetings":
      return (<g {...sw}><path d="M100 150V78c0-10-12-12-14-2l-8 40c-2 10 2 20 10 26" fill={S} /><path d="M100 150V78c0-10 12-12 14-2l8 40c2 10-2 20-10 26" fill={S} /><path d="M80 152h40" {...ln} /><circle cx="100" cy="56" r="6" fill={T} /></g>);
    case "pronouns":
      return (<g {...sw}><circle cx="82" cy="84" r="18" fill={S} /><path d="M52 146c0-20 14-34 30-34s30 14 30 34" fill={T} /><path d="M112 58h46a10 10 0 0 1 10 10v22a10 10 0 0 1-10 10h-24l-12 12v-12h-10a10 10 0 0 1-10-10V68a10 10 0 0 1 10-10Z" fill={CREAM} /><circle cx="124" cy="79" r="3" fill={INK} /><circle cx="135" cy="79" r="3" fill={INK} /><circle cx="146" cy="79" r="3" fill={INK} /></g>);
    case "people":
      return (<g {...sw}><circle cx="76" cy="80" r="16" fill={S} /><path d="M48 146c0-18 12-32 28-32s28 14 28 32" fill={SKY} /><circle cx="126" cy="76" r="17" fill={S} /><path d="M96 146c0-20 13-34 30-34s30 14 30 34" fill={T} /></g>);
    case "family":
      return (<g {...sw}><circle cx="64" cy="78" r="15" fill={S} /><path d="M38 146c0-18 11-30 26-30s26 12 26 30" fill={SKY} /><circle cx="136" cy="78" r="15" fill={S} /><path d="M110 146c0-18 11-30 26-30s26 12 26 30" fill={T} /><circle cx="100" cy="104" r="11" fill={S} /><path d="M82 148c0-12 8-22 18-22s18 10 18 22" fill={L} /></g>);
    case "professions":
      return (<g {...sw}><circle cx="100" cy="64" r="17" fill={S} /><path d="M66 140c0-22 15-38 34-38s34 16 34 38" fill={SKY} /><rect x="110" y="118" width="40" height="30" rx="5" fill={T} /><path d="M122 118v-6h16v6" {...ln} /></g>);
    case "questions":
      return (<g {...sw}><path d="M50 62h100a12 12 0 0 1 12 12v40a12 12 0 0 1-12 12H96l-20 18v-18H50a12 12 0 0 1-12-12V74a12 12 0 0 1 12-12Z" fill={CREAM} /><path d="M88 84c0-8 6-12 12-12s12 4 12 11c0 8-12 9-12 17" {...ln} /><circle cx="100" cy="112" r="3.5" fill={INK} /></g>);
    case "numbers":
      return (<g {...sw}><rect x="44" y="52" width="112" height="96" rx="10" fill={CREAM} /><path d="M44 84h112M44 116h112" {...ln} />{[62, 84, 106].map((x) => <circle key={`a${x}`} cx={x} cy={84} r="8" fill={T} />)}{[118, 140].map((x) => <circle key={`b${x}`} cx={x} cy={116} r="8" fill={S} />)}{[62].map((x) => <circle key={`c${x}`} cx={x} cy={116} r="8" fill={L} />)}</g>);
    case "colors":
      return (<g {...sw}><path d="M100 46c34 0 60 22 60 52 0 18-14 22-26 20-10-2-16 6-12 16 4 12-6 20-22 20-32 0-56-26-56-56s24-52 56-52Z" fill={CREAM} /><circle cx="76" cy="80" r="10" fill={T} /><circle cx="104" cy="68" r="10" fill={S} /><circle cx="132" cy="82" r="10" fill={L} /><circle cx="78" cy="114" r="10" fill={SKY} /></g>);
    case "time":
      return (<g {...sw}><circle cx="100" cy="100" r="52" fill={CREAM} /><circle cx="100" cy="100" r="44" {...ln} strokeWidth="1.5" strokeDasharray="2 9" /><path d="M100 70v32l20 12" fill="none" stroke={T} strokeWidth="4.5" /><circle cx="100" cy="100" r="5" fill={INK} /></g>);
    case "days":
      return (<g {...sw}><rect x="48" y="56" width="104" height="96" rx="12" fill={CREAM} /><rect x="48" y="56" width="104" height="26" rx="12" fill={T} /><path d="M74 46v20M126 46v20" {...ln} />{[0, 1, 2, 3].map((c) => [0, 1, 2].map((r) => <rect key={`${c}${r}`} x={60 + c * 22} y={92 + r * 18} width="12" height="10" rx="3" fill={c === 2 && r === 1 ? S : "#E4E8EE"} />))}</g>);
    case "food":
      return (<g {...sw}><path d="M40 112c0 26 27 40 60 40s60-14 60-40H40Z" fill={L} /><ellipse cx="100" cy="112" rx="60" ry="10" fill="#92C4A0" /><ellipse cx="80" cy="104" rx="18" ry="10" fill={CREAM} /><ellipse cx="114" cy="102" rx="18" ry="10" fill={CREAM} /><circle cx="136" cy="108" r="9" fill={S} /><path d="M84 70c-4-8 4-12 0-20M104 66c-4-8 4-12 0-20" stroke={T} strokeWidth="2.4" fill="none" /></g>);
    case "market":
      return (<g {...sw}><path d="M100 44v86M60 64h80" {...ln} /><path d="M60 64 44 102h32L60 64Zm80 0-16 38h32l-16-38Z" fill={S} /><path d="M44 102a16 8 0 0 0 32 0M124 102a16 8 0 0 0 32 0" fill={T} /><rect x="76" y="130" width="48" height="16" rx="4" fill={INK} /></g>);
    case "home":
      return (<g {...sw}><path d="M44 96 100 50l56 46" fill={T} /><rect x="56" y="94" width="88" height="56" fill={CREAM} /><rect x="88" y="114" width="24" height="36" fill={S} /><rect x="64" y="106" width="16" height="16" rx="2" fill="#D5E4EE" /><rect x="120" y="106" width="16" height="16" rx="2" fill="#D5E4EE" /></g>);
    case "clothing":
      return (<g {...sw}><path d="M78 50h44l26 22-14 18-10-8v66H76V82l-10 8-14-18 26-22Z" fill={T} /><path d="M86 50c2 10 26 10 28 0" {...ln} /><path d="M76 120h48" stroke={S} strokeWidth="6" /></g>);
    case "body":
      return (<g {...sw}><path d="M78 152v-32l-18-26c-4-6 4-12 9-6l13 16V58c0-7 10-7 10 0v40-48c0-7 10-7 10 0v48-44c0-7 10-7 10 0v46-36c0-7 10-7 10 0v52c0 18-8 30-16 42Z" fill={S} /><circle cx="100" cy="128" r="8" fill={T} /></g>);
    case "animals":
      return (<g {...sw}><ellipse cx="100" cy="122" rx="26" ry="22" fill={T} /><ellipse cx="66" cy="88" rx="12" ry="16" fill={S} /><ellipse cx="90" cy="70" rx="12" ry="16" fill={S} /><ellipse cx="112" cy="70" rx="12" ry="16" fill={S} /><ellipse cx="136" cy="88" rx="12" ry="16" fill={S} /></g>);
    case "nature":
      return (<g {...sw}><path d="M100 150c-34 0-50-30-38-62 20 6 34 22 38 44 4-22 18-38 38-44 12 32-4 62-38 62Z" fill={L} /><path d="M100 150V96" {...ln} /><path d="M100 96c0-22 8-38 22-48-2 18-10 32-22 48Z" fill="#92C4A0" /><circle cx="152" cy="56" r="12" fill={S} /></g>);
    case "directions":
      return (<g {...sw}><path d="M100 154V46" {...ln} strokeWidth="4.5" /><path d="M100 60h46l14 12-14 12h-46V60Z" fill={T} /><path d="M100 96H54l-14 12 14 12h46V96Z" fill={S} /></g>);
    case "places":
      return (<g {...sw}><path d="M66 150V112h68v38" fill={CREAM} /><path d="M72 112V92h56v20M80 92V74h40v18M88 74V58h24v16" fill={T} /><path d="M100 58V46" {...ln} /><circle cx="100" cy="44" r="4" fill={S} /><path d="M92 150v-22a8 8 0 0 1 16 0v22" fill={INK} /></g>);
    case "transport":
      return (<g {...sw}><path d="M46 132V96c0-14 10-28 30-30h44c18 0 28 12 32 30l6 36H46Z" fill={S} /><path d="M58 96c2-10 8-18 18-18h22v26H58v-8Z" fill="#D5E4EE" /><path d="M108 78h12c10 0 16 8 18 26h-30V78Z" fill="#D5E4EE" /><rect x="46" y="118" width="112" height="14" fill={INK} /><circle cx="70" cy="138" r="12" fill={CREAM} /><circle cx="134" cy="138" r="12" fill={CREAM} /></g>);
    case "verbs":
      return (<g {...sw}><circle cx="116" cy="54" r="12" fill={S} /><path d="M110 70 94 104l20 14-6 32M94 104l-24 8M104 78l24 14 14-10" {...ln} strokeWidth="5.5" /><path d="M42 86h22M36 106h20M44 126h18" fill="none" stroke={T} strokeWidth="2.5" /></g>);
    case "adjectives":
      return (<g {...sw}><path d="M100 40 140 80 100 160 60 80 100 40Z" fill={S} /><path d="M60 80h80M84 80l16 80 16-80M84 80l16-40 16 40" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.7" /><path d="M150 48v16M142 56h16M50 120v12M44 126h12" fill="none" stroke={T} strokeWidth="2.4" /></g>);
    case "emotions":
      return (<g {...sw}><circle cx="100" cy="100" r="52" fill={S} /><circle cx="82" cy="90" r="4.5" fill={INK} /><circle cx="118" cy="90" r="4.5" fill={INK} /><path d="M78 112c10 14 34 14 44 0" {...ln} /><circle cx="70" cy="110" r="7" fill={T} opacity="0.55" /><circle cx="130" cy="110" r="7" fill={T} opacity="0.55" /></g>);
    case "culture":
      return (<g {...sw}><path d="M56 122c0 16 20 26 44 26s44-10 44-26H56Z" fill={S} /><path d="M140 122c10 0 14-6 14-12" {...ln} /><path d="M100 118c-12-8-12-26 0-48 12 22 12 40 0 48Z" fill={T} /><path d="M100 112c-5-4-5-12 0-22 5 10 5 18 0 22Z" fill={S} /></g>);
    case "language":
      return (<g {...sw}><path d="M38 70c20-8 42-8 62 6v74c-20-14-42-14-62-6V70Z" fill={CREAM} /><path d="M162 70c-20-8-42-8-62 6v74c20-14 42-14 62-6V70Z" fill={CREAM} /><path d="M52 92c10-3 24-3 34 2M52 110c10-3 24-3 34 2M114 94c10-5 24-5 34-2" {...ln} strokeWidth="2" /><path d="M150 40 120 110" fill="none" stroke={T} strokeWidth="3.5" /><path d="M150 40c8 10 6 24-6 30" fill={S} /></g>);
    case "society":
      return (<g {...sw}><path d="M42 82 100 50l58 32H42Z" fill={T} /><rect x="48" y="82" width="104" height="10" fill={CREAM} />{[60, 84, 108, 132].map((x) => <rect key={x} x={x} y={94} width="10" height="44" fill={CREAM} />)}<rect x="42" y="138" width="116" height="12" fill={S} /></g>);
    case "grammar":
      return (<g {...sw}><path d="M50 60h40v14a10 10 0 1 1 0 20v16H50V60Z" fill={T} /><path d="M110 60h40v50h-16a10 10 0 1 0-20 0h-4V94a10 10 0 1 1 0-20V60Z" fill={S} /><path d="M50 120h40v30H50v-30ZM110 120h40v30h-40v-30Z" fill={L} /></g>);
    default:
      return (<g {...sw}><path d="M100 46a34 34 0 0 1 20 62c-4 3-6 8-6 12v6H86v-6c0-4-2-9-6-12a34 34 0 0 1 20-62Z" fill={S} /><path d="M88 138h24M92 150h16" {...ln} /><path d="M58 50l10 10M142 50l-10 10M100 30v12" fill="none" stroke={T} strokeWidth="2.4" /></g>);
  }
}

function Backdrop({ variant, color }: { variant: number; color: string }) {
  if (variant === 1) return <g opacity="0.5">{[30, 60, 90, 120, 150, 180].map((y) => <path key={y} d={`M0 ${y} q25 -10 50 0 t50 0 t50 0 t50 0`} stroke={color} strokeWidth="2" fill="none" />)}</g>;
  if (variant === 2) return <g opacity="0.45">{Array.from({ length: 36 }, (_, i) => <circle key={i} cx={20 + (i % 6) * 32} cy={20 + Math.floor(i / 6) * 32} r="2.5" fill={color} />)}</g>;
  if (variant === 3) return <circle cx="100" cy="100" r="78" fill={color} opacity="0.35" />;
  return <path d="M0 160 Q50 140 100 160 T200 160 V200 H0 Z" fill={color} opacity="0.4" />;
}

export function Motif({ topic, variant = 0, hue = 0 }: { topic: Topic; variant?: number; hue?: number }) {
  const [top, bot] = BG_GRAD[hue % BG_GRAD.length];
  const accent = ["#D8E6F0", "#D7E8DC", "#EEDFD2", "#E4DBEC"][hue % 4];
  const gid = `motif-bg-${hue % 4}-${variant}`;
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={top} />
          <stop offset="100%" stopColor={bot} />
        </linearGradient>
      </defs>
      <rect width="200" height="200" rx="28" fill={`url(#${gid})`} />
      <Backdrop variant={variant} color={accent} />
      <ellipse cx="100" cy="167" rx="46" ry="6" fill="#C9D4DE" opacity="0.45" />
      <Subject topic={topic} />
    </svg>
  );
}
