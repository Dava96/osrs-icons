import React from 'react';
import { useRandomCursor } from '../hooks/useRandomCursor';
import { Sparkles, Dice5 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import './Hero.css';

/** Pre-computed layout for a single floating icon. */
interface FloatingLayout {
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
}

/** Generated once at module load — stable for the lifetime of the page. */
const FLOATING_LAYOUTS: FloatingLayout[] = Array.from({ length: 6 }, () => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 5}s`,
  animationDuration: `${15 + Math.random() * 10}s`,
}));

export const Hero: React.FC = () => {
  const { randomize } = useRandomCursor();
  const { addToast } = useToast();

  const handleRandomize = () => {
    randomize();
    addToast('Cursor randomized! (Check your mouse pointer)', 'success');
  };

  return (
    <header className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="gradient-text">OSRS Icons</span>
          <Sparkles className="hero-icon" size={32} />
        </h1>
        <p className="hero-subtitle">
          Legendary cursors from Gielinor. <br />
          Add a touch of nostalgia to your project.
        </p>

        <div className="hero-actions">
          <button onClick={handleRandomize} className="btn-primary">
            <Dice5 size={20} />
            Randomize Cursor
          </button>

          <div className="badges">
            <img src="https://img.shields.io/npm/v/@dava96/osrs-icons" alt="npm version" />
            <img
              src="https://img.shields.io/badge/Tree_Shaking-Supported-green"
              alt="Tree Shaking"
            />
          </div>
        </div>
      </div>

      <div className="hero-background">
        <div className="rune-circle"></div>
        {FLOATING_LAYOUTS.map((layout, i) => (
          <div key={i} className="floating-icon" style={layout}>
            <Dice5 size={24} style={{ opacity: 0.1 }} />
          </div>
        ))}
      </div>
    </header>
  );
};
