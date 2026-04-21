import { useState } from 'react';
import { X } from './Icons';

interface Vocab {
  id: number;
  kannada: string;
  english: string;
  phonetic: string;
}

interface ClickableSentenceProps {
  text: string;
  vocab: Vocab[];
}

export default function ClickableSentence({ text, vocab }: ClickableSentenceProps) {
  const [selectedWord, setSelectedWord] = useState<Vocab | null>(null);

  const words = text.split(/(\s+|[.,!?;])/);

  const getVocabMatch = (word: string) => {
    const clean = word.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!clean) return null;
    return vocab.find(v => 
        v.english.toLowerCase() === clean
    );
  };

  return (
    <>
      <p className="context-text">
        {words.map((part, i) => {
            const match = getVocabMatch(part);
            if (match) {
                return (
                    <span 
                        key={i} 
                        className="interactive-word"
                        onClick={() => setSelectedWord(match)}
                        style={{ 
                            borderBottom: '2px dashed var(--brand-action)', 
                            cursor: 'pointer',
                            color: 'var(--brand-action)' 
                        }}
                    >
                        {part}
                    </span>
                );
            }
            return <span key={i}>{part}</span>;
        })}
      </p>

      {selectedWord && (
          <div className="glass-overlay" onClick={() => setSelectedWord(null)}>
            <div className="modal-container animate-modal" onClick={e => e.stopPropagation()}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h3 style={{margin: 0, color: 'var(--brand-action)'}}>{selectedWord.english}</h3>
                     <button onClick={() => setSelectedWord(null)} className="btn--icon"><X /></button>
                </div>
                <div 
                  className="kannada-text"
                  style={{fontSize: '2.5rem', margin: 'var(--spacing-3) 0', color: 'var(--text-main)'}}
                >
                    {selectedWord.kannada}
                </div>
                <div className="text-small" style={{fontStyle: 'italic', fontSize: '1.1rem'}}>
                    {selectedWord.phonetic}
                </div>
            </div>
          </div>
      )}
    </>
  );
}
