import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  coins1,
  coins2,
  coins3,
  coins4,
  coins5,
  coins25,
  coins100,
  coins250,
  coins1000,
  coins10000,
  animateCursor,
  toDataUrl,
} from '@dava96/osrs-icons';
import { Copy } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import './AnimateDemo.css';

/**
 * Ordered coin frames from a single coin to a full stack.
 * These are the raw CSS cursor strings exported by the package.
 */
const COIN_FRAMES = [
  coins1,
  coins2,
  coins3,
  coins4,
  coins5,
  coins25,
  coins100,
  coins250,
  coins1000,
  coins10000,
];

const COIN_NAMES = [
  'coins1',
  'coins2',
  'coins3',
  'coins4',
  'coins5',
  'coins25',
  'coins100',
  'coins250',
  'coins1000',
  'coins10000',
];

export const AnimateDemo: React.FC = () => {
  const { addToast } = useToast();
  const hoverZoneRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const [duration, setDuration] = useState(1200);

  const frameSources = useMemo(() => COIN_FRAMES.map((frame) => toDataUrl(frame)), []);

  /** Start (or restart) the animation on the hover zone. */
  const startAnimation = useCallback(() => {
    cleanupRef.current?.();
    if (hoverZoneRef.current) {
      cleanupRef.current = animateCursor(COIN_FRAMES, {
        duration,
        target: hoverZoneRef.current,
      });
    }
  }, [duration]);

  /** Restart animation whenever duration changes. */
  useEffect(() => {
    startAnimation();
    return () => {
      cleanupRef.current?.();
    };
  }, [startAnimation]);

  const codeSnippet = useMemo(
    () =>
      [
        'import {',
        '  coins1, coins2, coins3, coins4, coins5,',
        '  coins25, coins100, coins250, coins1000, coins10000,',
        '  animateCursor,',
        "} from '@dava96/osrs-icons';",
        '',
        'const stop = animateCursor(',
        '  [coins1, coins2, coins3, coins4, coins5,',
        '   coins25, coins100, coins250, coins1000, coins10000],',
        `  { duration: ${duration} },`,
        ');',
        '',
        '// Later: stop();',
      ].join('\n'),
    [duration]
  );

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(codeSnippet);
    addToast('Copied to clipboard!', 'success');
  }, [codeSnippet, addToast]);

  return (
    <section className="animate-demo">
      <h2>🎞️ Animate Cursor</h2>
      <p>
        Cycle through multiple icons as cursor frames using pure CSS
        <code>@keyframes</code>. No JavaScript timers — just <code>step-end</code> transitions that
        snap between sprites.
      </p>

      <div className="animate-card">
        {/* Frame strip */}
        <div className="frame-strip">
          {COIN_FRAMES.map((frame, index) => (
            <React.Fragment key={COIN_NAMES[index]}>
              {index > 0 && <span className="frame-arrow">→</span>}
              <div className="frame-cell">
                <div className="frame-sprite" style={{ cursor: frame }}>
                  <img src={frameSources[index]} alt={COIN_NAMES[index]} />
                </div>
                <span className="frame-index">{COIN_NAMES[index]}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Hover zone */}
        <div ref={hoverZoneRef} className="animate-hover-zone">
          Hover here to see the coins grow!
        </div>

        {/* Controls */}
        <div className="animate-controls">
          <div className="speed-control">
            <label htmlFor="animate-speed">Speed:</label>
            <input
              id="animate-speed"
              type="range"
              min={200}
              max={3000}
              step={100}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
            <span className="speed-value">{duration}ms</span>
          </div>

          <button className="animate-btn secondary" onClick={handleCopyCode}>
            <Copy size={14} /> Copy Code
          </button>
        </div>

        {/* Code snippet */}
        <pre className="animate-code">{codeSnippet}</pre>
      </div>
    </section>
  );
};
