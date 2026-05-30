import React from 'react';
import '../styles/ModeSelector.css';
import { GameMode } from '../types';

interface ModeSelectorProps {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

const modes: { id: GameMode; label: string }[] = [
  { id: 'animals', label: 'Animals' },
  { id: 'birds', label: 'Birds' },
  { id: 'colors', label: 'Colors' },
  { id: 'piano', label: 'Piano' },
];

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
  const activeIndex = modes.findIndex(m => m.id === currentMode);

  return (
    <div className="mode-selector-container">
      <div className="mode-selector-track">
        <div 
          className="mode-selector-knob" 
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        />
        {modes.map((mode) => (
          <button
            key={mode.id}
            className={`mode-button ${currentMode === mode.id ? 'active' : ''}`}
            onClick={() => onModeChange(mode.id)}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
};
