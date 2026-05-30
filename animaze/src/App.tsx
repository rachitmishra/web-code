import { useGameLogic } from "./hooks/useGameLogic";
import { HUD } from "./components/HUD";
import { Logo } from "./components/Logo";
import { StageDisplay } from "./components/StageDisplay";
import { AnimalGrid } from "./components/AnimalGrid";
import { EmptyState } from "./components/EmptyState";
import { FooterLegend } from "./components/FooterLegend";
import { ErrorToast } from "./components/ErrorToast";
import { KeyWaveAnimation } from "./components/KeyWaveAnimation";
import { ModeSelector } from "./components/ModeSelector";

export default function App() {
  const {
    gameMode,
    setGameMode,
    displayType,
    currentItems,
    lastKeyPressed,
    lastPressId,
    isSpeaking,
    isGeneratingImage,
    error
  } = useGameLogic();

  return (
    <div className="app-container">
      <KeyWaveAnimation triggerId={lastPressId} />
      <Logo />
      <ModeSelector 
        currentMode={gameMode} 
        onModeChange={setGameMode} 
      />
      <HUD 
        lastKeyPressed={lastKeyPressed} 
        displayType={displayType} 
        isSpeaking={isSpeaking} 
      />

      <main className="main-stage">
        {gameMode === "piano" && (
           <div className="piano-view">
             <div className="piano-instruction">
                Press keys <strong>A S D F G H J K L</strong> to play!
             </div>
           </div>
        )}

        {displayType === "single" && currentItems.length > 0 && (
          <StageDisplay 
            item={currentItems[0]}
            isSpeaking={isSpeaking}
            isGeneratingImage={isGeneratingImage}
            mode={gameMode}
          />
        )}

        {displayType === "multiple" && (
          <AnimalGrid animals={currentItems as any} />
        )}

        {currentItems.length === 0 && gameMode !== "piano" && (
          <EmptyState />
        )}
      </main>

      <FooterLegend />

      {error && <ErrorToast message={error} />}
    </div>
  );
}
