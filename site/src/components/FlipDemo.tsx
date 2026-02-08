import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as AllExports from '@dava96/osrs-icons';
import { flipCursor, toDataUrl } from '@dava96/osrs-icons';
import { RefreshCw, Copy } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { OsrsNavIcon } from './OsrsNavIcon';
import './FlipDemo.css';

/** Only real icon string exports (no packs, meta, or functions). */
const ICON_ENTRIES: [string, string][] = Object.entries(AllExports).filter(
  ([key, value]) =>
    typeof value === 'string' &&
    (value as string).startsWith("url('data:image/png;base64,") &&
    !key.endsWith('Pack') &&
    key !== 'iconNames'
) as [string, string][];

function pickRandomIcon(): [string, string] {
  const index = Math.floor(Math.random() * ICON_ENTRIES.length);
  return ICON_ENTRIES[index];
}

export const FlipDemo: React.FC = () => {
  const { addToast } = useToast();

  const [currentIcon, setCurrentIcon] = useState<[string, string]>(pickRandomIcon);
  const [flippedCursor, setFlippedCursor] = useState<string | null>(null);

  const iconName = currentIcon[0];
  const originalCursor = currentIcon[1];
  const originalSrc = useMemo(() => toDataUrl(originalCursor), [originalCursor]);
  const isFlipping = flippedCursor === null;

  /** Flip the current icon whenever it changes. */
  useEffect(() => {
    let cancelled = false;

    flipCursor(originalCursor).then((result) => {
      if (!cancelled) {
        setFlippedCursor(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [originalCursor]);

  const flippedSrc = useMemo(() => {
    if (!flippedCursor) return null;
    return toDataUrl(flippedCursor);
  }, [flippedCursor]);

  const handleRandomise = useCallback(() => {
    setFlippedCursor(null);
    setCurrentIcon(pickRandomIcon());
  }, []);

  const codeSnippet = useMemo(() => {
    return [
      `import { ${iconName}, flipCursor } from '@dava96/osrs-icons';`,
      '',
      `const flipped = await flipCursor(${iconName});`,
      'document.body.style.cursor = flipped;',
    ].join('\n');
  }, [iconName]);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(codeSnippet);
    addToast('Copied to clipboard!', 'success');
  }, [codeSnippet, addToast]);

  return (
    <section className="flip-demo">
      <h2>
        <OsrsNavIcon name="flip" size={24} /> Flip Cursor
      </h2>
      <p>
        Many OSRS icons face right, but cursors typically point left. Use <code>flipCursor</code> to
        mirror any icon horizontally at runtime.
      </p>

      <div className="flip-showcase">
        <div className="flip-card">
          <div className="flip-card-label">
            Currently showing: <span className="flip-icon-name">{iconName}</span>
          </div>

          <div className="flip-comparison">
            <div className="flip-side">
              <div className="flip-icon-wrapper" style={{ cursor: originalCursor }}>
                <img src={originalSrc} alt={`${iconName} original`} />
              </div>
              <span className="flip-label">Original</span>
            </div>

            <span className="flip-arrow">⇄</span>

            <div className="flip-side">
              {isFlipping ? (
                <div className="flip-icon-wrapper">
                  <span className="flip-loading">…</span>
                </div>
              ) : (
                <div className="flip-icon-wrapper" style={{ cursor: flippedCursor ?? undefined }}>
                  {flippedSrc && <img src={flippedSrc} alt={`${iconName} flipped`} />}
                </div>
              )}
              <span className="flip-label">Flipped</span>
            </div>
          </div>

          <div className="flip-interactive">
            <div className="flip-hover-zone" style={{ cursor: flippedCursor ?? originalCursor }}>
              Hover here to see the flipped cursor in action
            </div>

            <div className="flip-controls">
              <button className="flip-btn" onClick={handleRandomise}>
                <RefreshCw size={14} /> Try Another Icon
              </button>
              <button className="flip-btn secondary" onClick={handleCopyCode}>
                <Copy size={14} /> Copy Code
              </button>
            </div>
          </div>

          <pre className="flip-code">{codeSnippet}</pre>
        </div>
      </div>
    </section>
  );
};
