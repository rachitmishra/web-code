import { useEffect } from "react";
import { go, tabOf, useRoute, type Route, type Tab } from "./app/router";
import { liveStreak } from "./engine/progress";
import { useEngine } from "./engine/store";
import { Icon } from "./ui/Icon";
import { DebugHud, DebugLabel, Mascot } from "./ui/kit";
import { RewardOverlay } from "./screens/Rewards";
import { Onboarding } from "./screens/Onboarding";
import { Home } from "./screens/Home";
import { Journey, LevelScreen, SublevelIntro } from "./screens/Learn";
import { SessionScreen } from "./screens/Session";
import { PracticeHub, FlashcardDeck, RevisionCentre } from "./screens/Practice";
import { FastMatch } from "./screens/FastMatch";
import { Discover, DailyWordScreen } from "./screens/Discover";
import { Passport, Achievements, Certificate } from "./screens/Passport";
import { Stats } from "./screens/Stats";
import { Settings, ContentStudio } from "./screens/Settings";
import { LivesScreen } from "./screens/Lives";

const NAV: { tab: Tab; label: string; icon: string; route: Route }[] = [
  { tab: "home", label: "Home", icon: "home", route: { name: "home" } },
  { tab: "learn", label: "Learn", icon: "compass", route: { name: "learn" } },
  { tab: "practice", label: "Practice", icon: "bolt", route: { name: "practice" } },
  { tab: "discover", label: "Discover", icon: "book", route: { name: "discover" } },
  { tab: "passport", label: "Passport", icon: "passport", route: { name: "passport" } },
];

function Screen({ route }: { route: Route }) {
  switch (route.name) {
    case "home": return <Home />;
    case "learn": return <Journey />;
    case "level": return <LevelScreen n={route.level} />;
    case "sublevel": return <SublevelIntro id={route.id} />;
    case "session": return <SessionScreen key={route.id} id={route.id} />;
    case "practice": return <PracticeHub />;
    case "flashcards": return <FlashcardDeck />;
    case "fastmatch": return <FastMatch />;
    case "revision": return <RevisionCentre />;
    case "discover": return <Discover />;
    case "daily": return <DailyWordScreen />;
    case "passport": return <Passport />;
    case "achievements": return <Achievements />;
    case "certificate": return <Certificate />;
    case "stats": return <Stats />;
    case "settings": return <Settings />;
    case "content": return <ContentStudio />;
    case "lives": return <LivesScreen />;
  }
}

function screenName(route: Route): string {
  switch (route.name) {
    case "home": return "Home";
    case "learn": return "Journey";
    case "level": return `LevelScreen (L${route.level})`;
    case "sublevel": return `SublevelIntro (${route.id})`;
    case "session": return `SessionScreen (${route.id})`;
    case "practice": return "PracticeHub";
    case "flashcards": return "FlashcardDeck";
    case "fastmatch": return "FastMatch";
    case "revision": return "RevisionCentre";
    case "discover": return "Discover";
    case "daily": return "DailyWordScreen";
    case "passport": return "Passport";
    case "achievements": return "Achievements";
    case "certificate": return "Certificate";
    case "stats": return "Stats";
    case "settings": return "Settings";
    case "content": return "ContentStudio";
    case "lives": return "LivesScreen";
  }
}

export default function App() {
  const { state, pack, progress, curriculum, update } = useEngine();
  const route = useRoute();
  const tab = tabOf(route);
  const focus = route.name === "session" || route.name === "fastmatch";
  const activeScreen = screenName(route);

  useEffect(() => {
    document.documentElement.classList.toggle("reduced-motion", state.settings.reducedMotion);
  }, [state.settings.reducedMotion]);

  useEffect(() => {
    document.documentElement.classList.toggle("debug-ui", !!state.settings.debug);
  }, [state.settings.debug]);

  useEffect(() => {
    document.documentElement.dataset.theme = state.settings.theme ?? "studio";
  }, [state.settings.theme]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        update((s) => ({ ...s, settings: { ...s.settings, debug: !s.settings.debug } }));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [update]);

  if (!state.learner.onboarded) return <Onboarding />;

  return (
    <div className="shell">
      <aside className="sidebar" aria-label="Primary">
        <DebugLabel name="Sidebar" />
        <div className="brand">
          <Mascot size={42} />
          <div className="brand-name">{pack.config.brand ?? pack.config.name}<small>Games + Stories</small></div>
        </div>
        <nav className="side-nav">
          {NAV.map((n) => (
            <button key={n.tab} type="button" className={`side-link ${tab === n.tab ? "active" : ""}`} onClick={() => go(n.route)} aria-current={tab === n.tab ? "page" : undefined}>
              <Icon name={n.icon} /> {n.label}
            </button>
          ))}
        </nav>
        <div className="side-foot">
          <button type="button" className="side-link" onClick={() => go({ name: "stats" })}><Icon name="chart" /> Progress</button>
          <button type="button" className="side-link" onClick={() => go({ name: "settings" })}><Icon name="settings" /> Settings</button>
          <div className="card warm" style={{ padding: 14, marginTop: 8 }}>
            <span className="eyebrow">Passport</span>
            <div style={{ fontWeight: 800, marginTop: 2 }}>{Object.keys(progress.postcards).length} / {curriculum.levels.length} postcards</div>
            <div className="muted" style={{ fontSize: 12, fontWeight: 700 }}>{progress.stamps.length} stamps · {progress.xp} XP</div>
          </div>
        </div>
      </aside>

      <main className={`main ${focus ? "focus" : ""}`} id="main">
        {!focus && <StatusBar />}
        <div key={route.name === "level" ? `level-${route.level}` : route.name === "sublevel" || route.name === "session" ? `${route.name}-${route.id}` : route.name} className="screen-enter">
          <DebugLabel name={activeScreen} kind="screen" />
          <Screen route={route} />
        </div>
      </main>

      {!focus && (
        <nav className="bottom-nav" aria-label="Primary">
          <DebugLabel name="BottomNav" />
          {NAV.map((n) => (
            <button key={n.tab} type="button" className={`bottom-link ${tab === n.tab ? "active" : ""}`} onClick={() => go(n.route)} aria-current={tab === n.tab ? "page" : undefined}>
              <Icon name={n.icon} />{n.label}
            </button>
          ))}
        </nav>
      )}
      <RewardOverlay />
      <DebugHud screen={activeScreen} />
    </div>
  );
}

function StatusBar() {
  const { state, progress } = useEngine();
  const streak = liveStreak(state);
  return (
    <div className="topbar">
      <DebugLabel name="StatusBar" />
      <div className="status-pills">
        <button type="button" className="pill flame" onClick={() => go({ name: "stats" })} aria-label={`${streak} day streak`}><Icon name="flame" filled /> {streak}</button>
        <button type="button" className="pill heart" onClick={() => go({ name: "lives" })} aria-label={state.settings.livesEnabled ? `${state.lives.count} lives` : "Lives off"}>
          <Icon name="heart" filled /> {state.settings.livesEnabled ? state.lives.count : "∞"}
        </button>
        <span className="pill coin"><Icon name="coin" /> {progress.coins}</span>
        <span className="pill xp"><Icon name="bolt" filled /> {progress.xp} XP</span>
      </div>
      <div className="row" style={{ gap: 8 }}>
        <button type="button" className="icon-btn" onClick={() => go({ name: "stats" })} aria-label="Progress & analytics"><Icon name="chart" /></button>
        <button type="button" className="icon-btn" onClick={() => go({ name: "settings" })} aria-label="Settings"><Icon name="settings" /></button>
      </div>
    </div>
  );
}
