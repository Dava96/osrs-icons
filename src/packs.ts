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
    bucket,
    _15thsFullBucket,
    _25thsFullBucket,
    _35thsFullBucket,
    _45thsFullBucket,
    bucketOfWater,
} from './generated/icons';

/**
 * A cursor pack groups related OSRS icons by their in-game state.
 *
 * Each key is a semantic label and each value is the corresponding
 * CSS cursor string, ready to apply to any element's `cursor` property.
 *
 * **Want to add a new pack?** See the
 * {@link https://github.com/Dava96/osrs-icons/blob/main/CONTRIBUTING.md | Contributing Guide}
 * for instructions on assembling and submitting your own cursor packs.
 *
 * @example
 * ```ts
 * import { coinsPack, animateCursor } from '@dava96/osrs-icons';
 *
 * // Animate the coin stack growing
 * const stop = animateCursor(coinsPack.stages, { duration: 1200 });
 * ```
 */

// ── Progression Packs ──────────────────────────────────────────────

/**
 * Coins cursor pack — represents increasing wealth from 1gp to 10,000gp.
 *
 * In OSRS, the coin stack sprite changes based on the amount.
 * Great for progress indicators, score displays, or loading states.
 *
 * @example
 * ```ts
 * import { coinsPack } from '@dava96/osrs-icons';
 *
 * // Map a 0–100 progress value to a coin stack
 * const stages = coinsPack.stages;
 * const index = Math.min(Math.floor(progress / 100 * stages.length), stages.length - 1);
 * element.style.cursor = stages[index];
 * ```
 */
export const coinsPack = {
    _1: coins1,
    _2: coins2,
    _3: coins3,
    _4: coins4,
    _5: coins5,
    _25: coins25,
    _100: coins100,
    _250: coins250,
    _1000: coins1000,
    _10000: coins10000,
    /** Ordered array of all coin stages, from 1gp to 10,000gp. */
    stages: [
        coins1, coins2, coins3, coins4, coins5,
        coins25, coins100, coins250, coins1000, coins10000,
    ] as readonly string[],
} as const;

/**
 * Bucket cursor pack — represents a filling progression from empty to full.
 *
 * Perfect for loading indicators, progress bars, or upload states.
 * The `stages` array orders them from empty → full for easy indexing.
 *
 * @example
 * ```ts
 * import { bucketPack } from '@dava96/osrs-icons';
 *
 * // Map a 0–100 progress value to a bucket fill state
 * const stages = bucketPack.stages;
 * const index = Math.min(Math.floor(progress / 100 * stages.length), stages.length - 1);
 * element.style.cursor = stages[index];
 * ```
 */
export const bucketPack = {
    empty: bucket,
    fifth: _15thsFullBucket,
    twoFifths: _25thsFullBucket,
    threeFifths: _35thsFullBucket,
    fourFifths: _45thsFullBucket,
    full: bucketOfWater,
    /** Ordered array of all bucket stages, from empty to full. */
    stages: [
        bucket, _15thsFullBucket, _25thsFullBucket,
        _35thsFullBucket, _45thsFullBucket, bucketOfWater,
    ] as readonly string[],
} as const;
