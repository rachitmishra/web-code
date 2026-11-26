const P: Record<string, string> = {
  home: "M3 11 12 4l9 7M5 10v10h5v-6h4v6h5V10",
  compass: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM15.5 8.5l-2 5-5 2 2-5 5-2Z",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7l1-8Z",
  book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Zm0 16a2 2 0 0 1 2-2h13M8 7h7M8 11h5",
  passport: "M6 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6V3Zm6 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-3 10h6",
  heart: "M12 20s-7-4.4-9-9a4.8 4.8 0 0 1 9-3 4.8 4.8 0 0 1 9 3c-2 4.6-9 9-9 9Z",
  flame: "M12 22c4 0 7-2.7 7-6.6 0-3.9-3.2-6.4-4.5-9.4-1 2.4-2.2 3.4-3.5 4-.3-2.2-1.3-4.3-3-6C8 7.5 5 10.4 5 15.4 5 19.3 8 22 12 22Z",
  coin: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v10M9 9.5c0-1 1.3-1.8 3-1.8s3 .8 3 1.8-1.3 1.6-3 1.8-3 .8-3 1.8 1.3 1.8 3 1.8 3-.8 3-1.8",
  star: "m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9L12 3Z",
  speaker: "M4 9v6h4l5 4V5L8 9H4Zm12.5-.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12",
  lock: "M6 11h12v10H6V11Zm2 0V8a4 4 0 1 1 8 0v3",
  check: "m4 12.5 5 5L20 6.5",
  x: "M6 6l12 12M18 6 6 18",
  arrowRight: "M5 12h14m-6-6 6 6-6 6",
  arrowLeft: "M19 12H5m6-6-6 6 6 6",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3a7.4 7.4 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7.5 7.5 0 0 0-2-1.2L14.5 3h-4l-.4 2.6a7.5 7.5 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7.5 7.5 0 0 0 2 1.2l.4 2.6h4l.4-2.6a7.5 7.5 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z",
  chart: "M4 20V10m6 10V4m6 16v-7m6 7H2",
  pen: "M4 20h4L19 9l-4-4L4 16v4Zm9-13 4 4",
  eraser: "M8 20h12M5.5 14.5 14 6l5 5-8.5 8.5H8l-2.5-2.5a1.4 1.4 0 0 1 0-2.5Z",
  eye: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  bookmark: "M6 3h12v18l-6-4-6 4V3Z",
  refresh: "M20 11a8 8 0 0 0-14.3-4.9L4 8m0-5v5h5M4 13a8 8 0 0 0 14.3 4.9L20 16m0 5v-5h-5",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3 2",
  trophy: "M8 21h8m-4-4v4m-5-17h10v5a5 5 0 0 1-10 0V4Zm0 2H4a3 3 0 0 0 3 4m10-4h3a3 3 0 0 1-3 4",
  sparkle: "M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5m7 7L18 18M6 18l2.5-2.5m7-7L18 6",
  cards: "M8 4h11a1 1 0 0 1 1 1v13M4 8h11a1 1 0 0 1 1 1v11H5a1 1 0 0 1-1-1V8Z",
  repeat: "M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4m14-1v2a3 3 0 0 1-3 3H3",
  target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  map: "M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-12v14",
  stamp: "M5 21h14M6 17h12v-3a3 3 0 0 0-3-3h-1V8a2 2 0 1 0-4 0v3H9a3 3 0 0 0-3 3v3Z",
  postcard: "M3 5h18v14H3V5Zm10 0v14m3-11h2v2h-2V8Zm-9 3h3m-3 3h4",
  crown: "M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5L3 8Z",
  books: "M4 4h4v16H4V4Zm6 0h4v16h-4V4Zm6.5.5 3.9 1 -3.8 15.4-3.9-1",
  scroll: "M8 4h11v13a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-1h11v1a3 3 0 0 0 3 3M8 4a2 2 0 0 0-2 2v10M8 4a2 2 0 0 1 2 2v0",
  tree: "M12 22v-6m0 0c-4 0-7-2.5-7-6a7 7 0 0 1 14 0c0 3.5-3 6-7 6Z",
  letter: "M6 19c0-6 2-12 6-12s5 4 2 6-6 2-6 6m10-1c-1 2-3 2-4 0",
  tiles: "M3 7h7v6H3V7Zm11 0h7v6h-7V7ZM8 16h8v5H8v-5Z",
  rain: "M7 15a4 4 0 0 1 0-8 5 5 0 0 1 9.7-1A3.5 3.5 0 0 1 17 15H7Zm1 3-1 3m5-3-1 3m5-3-1 3",
  spark: "M12 2l2 6.5L20 10l-6 2-2 7-2-7-6-2 6-1.5L12 2Z",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3Z",
  upload: "M12 16V4m-5 5 5-5 5 5M4 20h16",
  download: "M12 4v12m-5-5 5 5 5-5M4 20h16",
  image: "M4 5h16v14H4V5Zm0 11 4.5-4.5L13 16m-2-2 3-3 6 6M15.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  trash: "M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13",
  plus: "M12 5v14M5 12h14",
  shuffle: "M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5",
  hand: "M8 13V5.5a1.5 1.5 0 1 1 3 0V11m0-1V4.5a1.5 1.5 0 1 1 3 0V11m0-5a1.5 1.5 0 1 1 3 0v6m0-2a1.5 1.5 0 1 1 3 0V15a7 7 0 0 1-7 7h-1a7 7 0 0 1-5.6-2.8L3.2 16a1.6 1.6 0 0 1 2.4-2l2.4 2.2",
  pause: "M8.5 5.5v13M15.5 5.5v13",
  share: "M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm12 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8.6 13.5l6.8 4M15.4 6.5l-6.8 4",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v6m0-9.5v.5",
};

export type IconName = keyof typeof P;

export function Icon({ name, className = "", filled = false, label }: { name: IconName | string; className?: string; filled?: boolean; label?: string }) {
  const d = P[name] ?? P.sparkle;
  return (
    <svg
      viewBox="0 0 24 24"
      className={`ico ${className}`}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 1.2 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <path d={d} />
    </svg>
  );
}
