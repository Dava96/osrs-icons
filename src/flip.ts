/**
 * Horizontally flips CSS cursor icons so they point in the opposite direction.
 *
 * Many OSRS inventory icons face right, but cursor conventions typically
 * expect left-facing images. This helper mirrors the embedded base64 PNG
 * using the Canvas API and returns new, ready-to-use CSS cursor strings.
 *
 * Results are cached internally — flipping the same icon twice returns
 * the cached value instantly.
 *
 * **Browser-only** — requires the Canvas API. In non-browser environments
 * (Node.js, SSR) the original cursor strings are returned unchanged.
 *
 * Supports three input shapes:
 * - **Single string** → returns a single flipped string.
 * - **Array of strings** → returns an array of flipped strings (same order).
 * - **Record of strings** → returns a record with the same keys, values flipped.
 *   Perfect for flipping an entire pack in one call.
 *
 * @example
 * ```ts
 * import { abyssalWhip, flipCursor } from '@dava96/osrs-icons';
 *
 * // Single icon
 * const flipped = await flipCursor(abyssalWhip);
 * document.body.style.cursor = flipped;
 * ```
 *
 * @example
 * ```ts
 * import { coinsPack, flipCursor } from '@dava96/osrs-icons';
 *
 * // Flip an entire pack
 * const flippedPack = await flipCursor(coinsPack);
 * // flippedPack._1, flippedPack._2, ... are all flipped
 * // flippedPack.stages is a flipped array
 * ```
 *
 * @example
 * ```ts
 * import { airRune, fireRune, flipCursor } from '@dava96/osrs-icons';
 *
 * // Flip an array of cursors
 * const [flippedAir, flippedFire] = await flipCursor([airRune, fireRune]);
 * ```
 */

/** Matches `url('...')` in a CSS cursor value. Precompiled to avoid re-creation per call. */
const FLIP_URL_REGEX = /url\('(.*?)'\)/;

/** Internal cache to avoid re-processing the same icon. */
const flipCache = new Map<string, string>();

// ── Public overloads ───────────────────────────────────────────────

/** Flip a single CSS cursor string. */
export async function flipCursor(cursorValue: string): Promise<string>;

/** Flip an array of CSS cursor strings, preserving order. */
export async function flipCursor(cursorValues: readonly string[]): Promise<string[]>;

/** Flip every string value in a record (e.g. a pack object), preserving keys. */
export async function flipCursor<T extends Record<string, unknown>>(
    pack: T
): Promise<{ [K in keyof T]: T[K] extends string ? string : T[K] extends readonly string[] ? string[] : T[K] }>;

// ── Implementation ─────────────────────────────────────────────────

export async function flipCursor(
    input: string | readonly string[] | Record<string, unknown>
): Promise<string | string[] | Record<string, unknown>> {
    if (typeof input === 'string') {
        return flipSingleCursor(input);
    }

    if (Array.isArray(input)) {
        return Promise.all(input.map(flipSingleCursor));
    }

    const entries = Object.entries(input);
    const flippedEntries = await Promise.all(
        entries.map(async ([key, value]) => {
            if (typeof value === 'string') {
                return [key, await flipSingleCursor(value)] as const;
            }
            if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
                return [key, await Promise.all((value as string[]).map(flipSingleCursor))] as const;
            }
            return [key, value] as const;
        })
    );

    return Object.fromEntries(flippedEntries);
}

// ── Internal helpers ───────────────────────────────────────────────

/** Flips a single CSS cursor string, using the cache. */
async function flipSingleCursor(cursorValue: string): Promise<string> {
    if (flipCache.has(cursorValue)) {
        return flipCache.get(cursorValue)!;
    }

    if (typeof document === 'undefined') {
        return cursorValue;
    }

    const dataUrlMatch = cursorValue.match(FLIP_URL_REGEX);
    if (!dataUrlMatch) {
        return cursorValue;
    }

    const originalDataUrl = dataUrlMatch[1];
    const flippedDataUrl = await mirrorImage(originalDataUrl);
    const flippedCursor = cursorValue.replace(originalDataUrl, flippedDataUrl);

    flipCache.set(cursorValue, flippedCursor);
    return flippedCursor;
}

/**
 * Loads a data URL into an off-screen canvas, mirrors it horizontally,
 * and returns the flipped image as a new data URL.
 */
function mirrorImage(dataUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve(dataUrl);
                return;
            }

            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(img, 0, 0);

            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => reject(new Error('Failed to load cursor image for flipping'));
        img.src = dataUrl;
    });
}
