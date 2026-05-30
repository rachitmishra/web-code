import React from "react";
import type { Animal, Bird, ColorItem, GameMode } from "../types";

interface StageDisplayProps {
  item: Animal | Bird | ColorItem;
  isSpeaking: boolean;
  isGeneratingImage: boolean;
  mode: GameMode;
}

export const StageDisplay: React.FC<StageDisplayProps> = ({ item, isSpeaking, isGeneratingImage, mode }) => {
  // Color Mode Display
  if (mode === "colors") {
    const colorItem = item as ColorItem;
    return (
      <div className="stage-display color-mode">
        <div 
          className="color-swatch animate-in fade-in zoom-in duration-500"
          style={{ 
            backgroundColor: colorItem.hex,
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            margin: '0 auto',
            boxShadow: `0 0 40px ${colorItem.hex}88, 0 10px 20px rgba(0,0,0,0.3)`
          }}
        />
        <h1 className="item-name" style={{ color: colorItem.hex }}>
          {colorItem.name}
        </h1>
        {isSpeaking && (
          <div className="synthesis-indicator">
            <span className="synthesis-text">Speaking...</span>
          </div>
        )}
      </div>
    );
  }

  // Animal and Bird Mode Display
  const organicItem = item as Animal | Bird;
  return (
    <div className="stage-display">
      <div className={`item-visual ${isSpeaking ? "speaking" : ""}`}>
           {organicItem.imageUrl ? (
               <div className="item-image-wrapper">
                  <img 
                      src={organicItem.imageUrl} 
                      alt={organicItem.name} 
                      className="item-generated-image animate-in fade-in zoom-in duration-500"
                  />
                  <div className="item-emoji-overlay">{organicItem.emoji}</div>
               </div>
           ) : (
              <div className="item-emoji">
                  {isGeneratingImage && <div className="loading-sparkle">✨</div>}
                  {organicItem.emoji}
              </div>
           )}
      </div>
      
      <h1 className="item-name">
        {organicItem.name}
      </h1>
      {isSpeaking && (
        <div className="synthesis-indicator">
          <span className="synthesis-text">
            Synthesizing {mode === 'birds' ? 'bird' : 'animal'} sound...
          </span>
        </div>
      )}
    </div>
  );
};
