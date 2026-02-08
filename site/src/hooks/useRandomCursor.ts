import { useEffect, useState } from 'react';
import * as Icons from '@dava96/osrs-icons';
import { categoryIcons } from '@dava96/osrs-icons';

/**
 * Merges main and category icon string exports into a single
 * deduplicated array of `[name, cursorValue]` pairs.
 */
function collectIconKeys(): string[] {
  const seen = new Set<string>();
  const keys: string[] = [];
  for (const [key, value] of Object.entries(Icons)) {
    if (typeof value === 'string' && !seen.has(key)) {
      seen.add(key);
      keys.push(key);
    }
  }
  for (const [key, value] of Object.entries(categoryIcons)) {
    if (typeof value === 'string' && !seen.has(key)) {
      seen.add(key);
      keys.push(key);
    }
  }
  return keys;
}

const allIconKeys = collectIconKeys();

/** Looks up a cursor value by key from either the main or category icons. */
function getIconValue(key: string): string {
  // @ts-expect-error - indexing by string key
  return (Icons[key] as string) ?? (categoryIcons as Record<string, string>)[key];
}

export const useRandomCursor = () => {
  const [randomIcon, setRandomIcon] = useState<{ name: string; url: string } | null>(() => {
    if (allIconKeys.length === 0) return null;
    const randomKey = allIconKeys[Math.floor(Math.random() * allIconKeys.length)];
    return { name: randomKey, url: getIconValue(randomKey) };
  });

  const randomize = () => {
    if (allIconKeys.length === 0) return;
    const randomKey = allIconKeys[Math.floor(Math.random() * allIconKeys.length)];
    setRandomIcon({ name: randomKey, url: getIconValue(randomKey) });
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
