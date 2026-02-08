export * from './generated/icons';
export * from './generated/meta';
export * from './packs';
export * from './flip';
export * from './applyCursors';
export * from './animateCursor';
/**
 * A fun easter-egg cursor for error states — the OSRS Red Herring icon.
 *
 * @example
 * ```ts
 * import { errorCursor } from '@dava96/osrs-icons';
 *
 * document.body.style.cursor = errorCursor;
 * ```
 */
export { redHerring as errorCursor } from './generated/icons';

/**
 * Extracts the raw `data:image/png;base64,...` URL from one or more
 * CSS cursor values.
 *
 * Each icon export is a fully formed CSS cursor string
 * (e.g. `url('data:image/png;base64,...'), auto`). Use this helper
 * when you need just the image URL — for example, as an `<img>` src
 * or a CSS `background-image`.
 *
 * @example
 * ```ts
 * import { abyssalWhip, dragonScimitar, toDataUrl } from '@dava96/osrs-icons';
 *
 * // Single icon
 * const url = toDataUrl(abyssalWhip);
 *
 * // Multiple icons at once
 * const urls = toDataUrl({
 *   whip: abyssalWhip,
 *   sword: dragonScimitar,
 * });
 * // urls.whip  → "data:image/png;base64,..."
 * // urls.sword → "data:image/png;base64,..."
 * ```
 */
export function toDataUrl(cursorValue: string): string;
export function toDataUrl<T extends Record<string, string>>(
  cursorValues: T
): { [K in keyof T]: string };
export function toDataUrl(input: string | Record<string, string>): string | Record<string, string> {
  if (typeof input === 'string') {
    return extractUrl(input);
  }

  return Object.fromEntries(Object.entries(input).map(([key, value]) => [key, extractUrl(value)]));
}

/** Matches `url('...')` in a CSS cursor value. Precompiled for use in loops. */
const CURSOR_URL_REGEX = /url\('(.*)'\)/;

/** Extracts the URL from a single `url('...')` CSS value. */
function extractUrl(cursorValue: string): string {
  const match = cursorValue.match(CURSOR_URL_REGEX);
  return match ? match[1] : cursorValue;
}
