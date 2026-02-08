import { useEffect, useState } from 'react';
import * as Icons from '@dava96/osrs-icons';

export const useRandomCursor = () => {
  const [randomIcon, setRandomIcon] = useState<{ name: string; url: string } | null>(() => {
    const iconKeys = Object.keys(Icons);
    if (iconKeys.length === 0) return null;
    const randomKey = iconKeys[Math.floor(Math.random() * iconKeys.length)];
    // @ts-expect-error - indexing by string key
    const iconUrl = Icons[randomKey];
    return { name: randomKey, url: iconUrl };
  });

  const randomize = () => {
    const iconKeys = Object.keys(Icons);
    if (iconKeys.length === 0) return;
    const randomKey = iconKeys[Math.floor(Math.random() * iconKeys.length)];
    // @ts-expect-error - indexing by string key
    const iconUrl = Icons[randomKey];
    setRandomIcon({ name: randomKey, url: iconUrl });
  };

  useEffect(() => {
    if (randomIcon) {
      // Apply to body
      document.body.style.cursor = randomIcon.url;

      // Update favicon
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = randomIcon.url.replace(/url\('(.*)'\), auto/, '$1');
      }
    }

    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [randomIcon]);

  return { randomIcon, randomize };
};
