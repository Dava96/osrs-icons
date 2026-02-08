/**
 * Options for {@link animateCursor}.
 */
export interface AnimateCursorOptions {
  /**
   * Total duration of one full animation cycle in milliseconds.
   * Each frame occupies `duration / frames.length` of the cycle.
   *
   * @default 1000
   */
  duration?: number;

  /**
   * Element to scope the animated cursor to.
   * When omitted the cursor animates on the entire page (`*`).
   */
  target?: HTMLElement;

  /**
   * How many times the cycle should repeat.
   * Use `Infinity` (the default) for a continuous loop.
   *
   * @default Infinity
   */
  iterations?: number;
}

/**
 * Animates a cursor by cycling through an ordered array of OSRS icon
 * strings using a pure‑CSS `@keyframes` rule.
 *
 * Each frame is assigned an equal slice of the total `duration` and
 * transitions are **discrete** (`step-end`), producing a clean
 * frame‑by‑frame sprite animation — no JavaScript timers required.
 *
 * **Browser‑only** — in non‑browser environments (Node / SSR) this
 * is a no‑op that returns an empty cleanup function.
 *
 * @param frames  - An ordered array of CSS cursor strings (≥ 2).
 * @param options - Optional configuration for duration, target, and iterations.
 * @returns A cleanup function that removes the injected styles and
 *          stops the animation.
 *
 * @throws {Error} If fewer than 2 frames are provided.
 *
 * @example
 * ```ts
 * import {
 *   coins1, coins2, coins3, coins4, coins5,
 *   animateCursor,
 * } from '@dava96/osrs-icons';
 *
 * // Animate a growing coin stack on the whole page
 * const stop = animateCursor(
 *   [coins1, coins2, coins3, coins4, coins5],
 *   { duration: 1200 },
 * );
 *
 * // Later, stop the animation and clean up
 * stop();
 * ```
 *
 * @example
 * ```ts
 * import { lobsterRaw, lobsterCooked, lobsterBurnt, animateCursor } from '@dava96/osrs-icons';
 *
 * // Scope to a specific element, play 3 times
 * const stop = animateCursor(
 *   [lobsterRaw, lobsterCooked, lobsterBurnt],
 *   { duration: 900, target: document.getElementById('cooking')!, iterations: 3 },
 * );
 * ```
 */
export function animateCursor(frames: string[], options: AnimateCursorOptions = {}): () => void {
  if (frames.length < 2) {
    throw new Error(`animateCursor requires at least 2 frames, received ${frames.length}.`);
  }

  if (typeof document === 'undefined') {
    return () => {};
  }

  const { duration = 1000, target, iterations = Infinity } = options;

  const animationName = generateAnimationName();
  const scopeId = `${animationName}-scope`;

  const selector = target ? `[data-osrs-anim-id="${scopeId}"]` : '*';

  if (target) {
    target.setAttribute('data-osrs-anim-id', scopeId);
  }

  const keyframeSteps = frames
    .map((cursorValue, index) => {
      const percentage = ((index / frames.length) * 100).toFixed(2);
      return `  ${percentage}% { cursor: ${cursorValue}; }`;
    })
    .join('\n');

  const iterationCount = iterations === Infinity ? 'infinite' : String(iterations);

  const css = [
    `@keyframes ${animationName} {`,
    keyframeSteps,
    '}',
    `${selector} {`,
    `  animation: ${animationName} ${duration}ms step-end ${iterationCount};`,
    '}',
  ].join('\n');

  const styleElement = document.createElement('style');
  styleElement.textContent = css;
  styleElement.setAttribute('data-osrs-animate', 'true');
  document.head.appendChild(styleElement);

  return () => {
    styleElement.remove();
    if (target) {
      target.removeAttribute('data-osrs-anim-id');
    }
  };
}

/** Generates a short unique ID for animation scoping. */
let animCounter = 0;
function generateAnimationName(): string {
  return `osrs-anim-${++animCounter}-${Date.now().toString(36)}`;
}
