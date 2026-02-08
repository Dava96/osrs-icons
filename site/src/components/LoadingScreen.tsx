import React, { useState, useEffect } from 'react';
import { coinsPack, toDataUrl } from '@dava96/osrs-icons';
import './LoadingScreen.css';

const COIN_STAGES = coinsPack.stages;
const COIN_URLS = COIN_STAGES.map((cursor) => toDataUrl(cursor));
const LOOP_INTERVAL_MS = 200;

/**
 * Fullscreen loading overlay that loops through the coin pack.
 * Shows a black background with the coin animation centered
 * and "Loading..." text below it.
 *
 * Renders nothing once the fade-out transition completes.
 */
export const LoadingScreen: React.FC<{ visible: boolean }> = ({ visible }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [removed, setRemoved] = useState(!visible);

  /** Loop through coin stages continuously while visible. */
  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % COIN_STAGES.length);
    }, LOOP_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [visible]);

  /** Remove from DOM after fade-out transition completes. */
  const handleTransitionEnd = () => {
    if (!visible) {
      setRemoved(true);
    }
  };

  if (removed) return null;

  return (
    <div
      className={`loading-screen ${visible ? '' : 'fade-out'}`}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="loading-coins">
        {COIN_URLS.map((url, i) => (
          <img
            key={i}
            src={url}
            alt=""
            className={`loading-coin ${i === activeIndex ? 'active' : ''}`}
          />
        ))}
      </div>
      <span className="loading-text">Loading...</span>
    </div>
  );
};
