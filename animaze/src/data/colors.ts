import type { ColorItem } from "../types";

export const COLOR_MAP: Record<string, ColorItem> = {
  a: { name: "Azure", hex: "#F0FFFF", sound: "Azure is a very light blue color." },
  b: { name: "Blue", hex: "#0000FF", sound: "Blue like the deep ocean." },
  c: { name: "Crimson", hex: "#DC143C", sound: "Crimson is a deep, rich red." },
  d: { name: "Deep Pink", hex: "#FF1493", sound: "Deep Pink is a bright and bold color." },
  e: { name: "Emerald", hex: "#50C878", sound: "Emerald is a beautiful green, like a gemstone." },
  f: { name: "Fuchsia", hex: "#FF00FF", sound: "Fuchsia is a bright, purplish-red." },
  g: { name: "Gold", hex: "#FFD700", sound: "Gold is a shiny, yellow color." },
  h: { name: "Hot Pink", hex: "#FF69B4", sound: "Hot Pink is a very bright pink." },
  i: { name: "Indigo", hex: "#4B0082", sound: "Indigo is a dark, purplish-blue." },
  j: { name: "Jade", hex: "#00A86B", sound: "Jade is a cool, green color." },
  k: { name: "Khaki", hex: "#F0E68C", sound: "Khaki is a light, brownish-yellow." },
  l: { name: "Lime", hex: "#00FF00", sound: "Lime is a bright, zesty green." },
  m: { name: "Magenta", hex: "#FF00FF", sound: "Magenta is a purplish-red color." },
  n: { name: "Navy", hex: "#000080", sound: "Navy is a very dark blue." },
  o: { name: "Orange", hex: "#FFA500", sound: "Orange like a fresh fruit." },
  p: { name: "Purple", hex: "#800080", sound: "Purple is a royal color." },
  q: { name: "Quartz", hex: "#51484F", sound: "Quartz is a smoky gray color." },
  r: { name: "Red", hex: "#FF0000", sound: "Red like a fire engine." },
  s: { name: "Silver", hex: "#C0C0C0", sound: "Silver is a shiny gray." },
  t: { name: "Teal", hex: "#008080", sound: "Teal is a blue-green color." },
  u: { name: "Ultramarine", hex: "#3F00FF", sound: "Ultramarine is a brilliant deep blue." },
  v: { name: "Violet", hex: "#EE82EE", sound: "Violet is a light purple." },
  w: { name: "White", hex: "#FFFFFF", sound: "White like a fluffy cloud." },
  x: { name: "Xanthic", hex: "#FFFF00", sound: "Xanthic is a bright yellow color." },
  y: { name: "Yellow", hex: "#FFFF00", sound: "Yellow like the bright sun." },
  z: { name: "Zucchini", hex: "#506022", sound: "Zucchini is a dark green color." },
};

export const ALL_COLORS: ColorItem[] = Object.values(COLOR_MAP);
