import { useEffect, useState } from "react";

export type Route =
  | { name: "home" }
  | { name: "learn" }
  | { name: "level"; level: number }
  | { name: "sublevel"; id: string }
  | { name: "session"; id: string }
  | { name: "practice" }
  | { name: "flashcards" }
  | { name: "fastmatch" }
  | { name: "revision" }
  | { name: "discover" }
  | { name: "heritage"; id: string }
  | { name: "daily" }
  | { name: "passport" }
  | { name: "achievements" }
  | { name: "stats" }
  | { name: "settings" }
  | { name: "content" }
  | { name: "lives" }
  | { name: "certificate" };

export function parse(hash: string): Route {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
  const [a, b] = parts;
  switch (a) {
    case undefined: case "": return { name: "home" };
    case "learn": return b ? { name: "level", level: Number(b) || 1 } : { name: "learn" };
    case "sub": return b ? { name: "sublevel", id: b } : { name: "learn" };
    case "session": return { name: "session", id: b ?? "revision" };
    case "practice":
      if (b === "flashcards") return { name: "flashcards" };
      if (b === "fast") return { name: "fastmatch" };
      if (b === "revision") return { name: "revision" };
      return { name: "practice" };
    case "discover":
      if (b === "daily") return { name: "daily" };
      if (b === "heritage" && parts[2]) return { name: "heritage", id: parts[2] };
      return { name: "discover" };
    case "passport": return b === "achievements" ? { name: "achievements" } : { name: "passport" };
    case "stats": return { name: "stats" };
    case "settings": return b === "content" ? { name: "content" } : { name: "settings" };
    case "lives": return { name: "lives" };
    case "certificate": return { name: "certificate" };
    default: return { name: "home" };
  }
}

export function href(r: Route): string {
  switch (r.name) {
    case "home": return "#/";
    case "learn": return "#/learn";
    case "level": return `#/learn/${r.level}`;
    case "sublevel": return `#/sub/${encodeURIComponent(r.id)}`;
    case "session": return `#/session/${encodeURIComponent(r.id)}`;
    case "practice": return "#/practice";
    case "flashcards": return "#/practice/flashcards";
    case "fastmatch": return "#/practice/fast";
    case "revision": return "#/practice/revision";
    case "discover": return "#/discover";
    case "heritage": return `#/discover/heritage/${encodeURIComponent(r.id)}`;
    case "daily": return "#/discover/daily";
    case "passport": return "#/passport";
    case "achievements": return "#/passport/achievements";
    case "stats": return "#/stats";
    case "settings": return "#/settings";
    case "content": return "#/settings/content";
    case "lives": return "#/lives";
    case "certificate": return "#/certificate";
  }
}

export function go(r: Route): void {
  window.location.hash = href(r);
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parse(window.location.hash));
  useEffect(() => {
    const h = () => {
      setRoute(parse(window.location.hash));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);
  return route;
}

export type Tab = "home" | "learn" | "practice" | "discover" | "passport";
export function tabOf(r: Route): Tab | null {
  switch (r.name) {
    case "home": case "stats": case "settings": case "content": case "lives": return "home";
    case "learn": case "level": case "sublevel": return "learn";
    case "practice": case "flashcards": case "fastmatch": case "revision": return "practice";
    case "discover": case "heritage": case "daily": return "discover";
    case "passport": case "achievements": case "certificate": return "passport";
    default: return null;
  }
}
