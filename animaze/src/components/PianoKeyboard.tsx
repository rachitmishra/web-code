import React from 'react';
import '../styles/PianoKeyboard.css';

interface PianoKeyboardProps {
    activeKey: string | null;
}

const PIANO_KEYS = [
    { key: 'a', note: 'C' },
    { key: 's', note: 'D' },
    { key: 'd', note: 'E' },
    { key: 'f', note: 'F' },
    { key: 'g', note: 'G' },
    { key: 'h', note: 'A' },
    { key: 'j', note: 'B' },
    { key: 'k', note: 'C+' },
    { key: 'l', note: 'D+' },
];

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({ activeKey }) => {
    const normalizedActiveKey = activeKey?.toLowerCase();

    return (
        <div className="piano-container">
            <div className="piano-keys">
                {PIANO_KEYS.map((pk) => (
                    <div 
                        key={pk.key} 
                        className={`piano-key ${normalizedActiveKey === pk.key ? 'active' : ''}`}
                    >
                        <div className="key-label">{pk.key.toUpperCase()}</div>
                        <div className="note-label">{pk.note}</div>
                    </div>
                ))}
            </div>
            <div className="piano-instruction">
                Press keys <strong>A S D F G H J K L</strong> to play!
            </div>
        </div>
    );
};
