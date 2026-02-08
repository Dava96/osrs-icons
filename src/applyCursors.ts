/**
 * Standard CSS cursor states that can be mapped to OSRS icons.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/cursor
 */
export type CursorState =
    | 'default'
    | 'pointer'
    | 'wait'
    | 'text'
    | 'move'
    | 'crosshair'
    | 'grab'
    | 'grabbing'
    | 'not-allowed'
    | 'help'
    | 'progress'
    | 'cell'
    | 'copy'
    | 'alias'
    | 'no-drop'
    | 'col-resize'
    | 'row-resize'
    | 'n-resize'
    | 'e-resize'
    | 's-resize'
    | 'w-resize'
    | 'zoom-in'
    | 'zoom-out';

/**
 * A mapping of CSS cursor states to OSRS icon cursor strings.
 *
 * Only include the states you want to override — unlisted states
 * keep their default browser cursor.
 */
export type CursorMapping = Partial<Record<CursorState, string>>;

/**
 * Applies OSRS cursor icons to CSS cursor states on a target element
 * or globally across the entire page.
 *
 * Injects a `<style>` tag with CSS rules that map each specified cursor
 * state to the given OSRS icon. Returns a cleanup function that removes
 * the injected styles and restores the previous cursors.
 *
 * **Browser-only** — in non-browser environments this is a no-op that
 * returns an empty cleanup function.
 *
 * @param mapping - An object mapping CSS cursor states to OSRS cursor strings.
 * @param target  - Optional element to scope the cursors to. Defaults to the
 *                  entire document (global).
 * @returns A cleanup function that reverts all applied cursors.
 *
 * @example
 * ```ts
 * import { abyssalWhip, dragonScimitar, applyCursors } from '@dava96/osrs-icons';
 *
 * // Apply globally
 * const remove = applyCursors({
 *   default: abyssalWhip,
 *   pointer: dragonScimitar,
 * });
 *
 * // Later, revert to browser defaults
 * remove();
 * ```
 *
 * @example
 * ```ts
 * import { bucketPack, applyCursors } from '@dava96/osrs-icons';
 *
 * // Scope to a specific element
 * const cleanup = applyCursors(
 *   { wait: bucketPack.full },
 *   document.getElementById('loading-area')!,
 * );
 * ```
 *
 * @example
 * ```ts
 * import { herringPack, applyCursors } from '@dava96/osrs-icons';
 *
 * // Use the red herring for error states!
 * applyCursors({ not-allowed: herringPack.error });
 * ```
 */
export function applyCursors(
    mapping: CursorMapping,
    target?: HTMLElement,
): () => void {
    if (typeof document === 'undefined') {
        return () => { };
    }

    const styleElement = document.createElement('style');
    const selector = target ? `[data-osrs-cursor-id="${generateId()}"]` : '*';

    if (target) {
        target.setAttribute('data-osrs-cursor-id', selector.slice(22, -2));
    }

    const rules = Object.entries(mapping)
        .map(([state, cursorValue]) => {
            const fallback = state === 'default' ? 'auto' : state;
            return `${selector} { cursor: ${cursorValue.replace(', auto', `, ${fallback}`)}; }`;
        })
        .join('\n');

    styleElement.textContent = rules;
    styleElement.setAttribute('data-osrs-cursors', 'true');
    document.head.appendChild(styleElement);

    return () => {
        styleElement.remove();
        if (target) {
            target.removeAttribute('data-osrs-cursor-id');
        }
    };
}

/** Generates a short unique ID for scoping cursor styles to elements. */
let idCounter = 0;
function generateId(): string {
    return `osrs-${++idCounter}-${Date.now().toString(36)}`;
}
