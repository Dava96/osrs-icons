/**
 * Horizontally flips a CSS cursor icon so it points in the opposite direction.
 *
 * Many OSRS inventory icons face right, but cursor conventions typically
 * expect left-facing images. This helper mirrors the embedded base64 PNG
 * using the Canvas API and returns a new, ready-to-use CSS cursor string.
 *
 * Results are cached internally — flipping the same icon twice returns
 * the cached value instantly.
 *
 * **Browser-only** — requires the Canvas API. In non-browser environments
 * (Node.js, SSR) the original cursor string is returned unchanged.
 *
 * @param cursorValue - A CSS cursor string (e.g. `url('data:image/png;base64,...'), auto`).
 * @returns A promise that resolves to a new cursor string with the image flipped.
 *
 * @example
 * ```ts
 * import { abyssalWhip, flipCursor } from '@dava96/osrs-icons';
 *
 * const leftFacingWhip = await flipCursor(abyssalWhip);
 * document.body.style.cursor = leftFacingWhip;
 * ```
 *
 * @example
 * ```ts
 * import { dragonDaggerPack, flipCursor } from '@dava96/osrs-icons';
 *
 * // Flip an entire pack
 * const flippedDagger = await flipCursor(dragonDaggerPack.base);
 * ```
 */
/** Matches `url('...')` in a CSS cursor value. Precompiled to avoid re-creation per call. */
const FLIP_URL_REGEX = /url\('(.*?)'\)/;

export async function flipCursor(cursorValue: string): Promise<string> {
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

/** Internal cache to avoid re-processing the same icon. */
const flipCache = new Map<string, string>();

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
