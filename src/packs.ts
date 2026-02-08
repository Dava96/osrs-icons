import {
    rawShark,
    shark,
    burntShark,
    rawHerring,
    herring,
    burntFishHerring,
    redHerring,
    rawAnglerfish,
    anglerfish,
    burntAnglerfish,
    dragonDagger,
    dragonDaggerp,
    dragonDaggerpplus,
    dragonDaggerpplusplus,
    goldOre,
    goldBar,
    ironOre,
    ironBar,
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
 * Each key is a semantic label (e.g. `raw`, `cooked`, `burnt`) and
 * each value is the corresponding CSS cursor string, ready to apply
 * to any element's `cursor` property.
 *
 * @example
 * ```ts
 * import { sharkPack } from '@dava96/osrs-icons';
 *
 * // Use the raw shark as the cursor
 * document.body.style.cursor = sharkPack.raw;
 *
 * // Swap to the cooked variant on click
 * button.addEventListener('click', () => {
 *   document.body.style.cursor = sharkPack.cooked;
 * });
 * ```
 */

// ── Fish Packs ─────────────────────────────────────────────────────

/**
 * Shark cursor pack — raw, cooked, and burnt states.
 *
 * @example
 * ```ts
 * import { sharkPack } from '@dava96/osrs-icons';
 * element.style.cursor = sharkPack.cooked;
 * ```
 */
export const sharkPack = {
    raw: rawShark,
    cooked: shark,
    burnt: burntShark,
} as const;

/**
 * Herring cursor pack — raw, cooked, burnt, and the infamous red herring.
 *
 * The `error` alias points to `redHerring` — a fun easter egg for
 * error states. Also available as the top-level `errorCursor` export.
 *
 * @example
 * ```ts
 * import { herringPack } from '@dava96/osrs-icons';
 * element.style.cursor = herringPack.error; // 🐟 Red herring!
 * ```
 */
export const herringPack = {
    raw: rawHerring,
    cooked: herring,
    burnt: burntFishHerring,
    error: redHerring,
} as const;

/**
 * Anglerfish cursor pack — raw, cooked, and burnt states.
 *
 * @example
 * ```ts
 * import { anglerfishPack } from '@dava96/osrs-icons';
 * element.style.cursor = anglerfishPack.raw;
 * ```
 */
export const anglerfishPack = {
    raw: rawAnglerfish,
    cooked: anglerfish,
    burnt: burntAnglerfish,
} as const;

// ── Weapon Packs ───────────────────────────────────────────────────

/**
 * Dragon dagger cursor pack — base through poisoned++ variants.
 *
 * @example
 * ```ts
 * import { dragonDaggerPack } from '@dava96/osrs-icons';
 *
 * // Start with the base dagger
 * element.style.cursor = dragonDaggerPack.base;
 *
 * // Upgrade to poisoned++
 * element.style.cursor = dragonDaggerPack.poisonedPlusPlus;
 * ```
 */
export const dragonDaggerPack = {
    base: dragonDagger,
    poisoned: dragonDaggerp,
    poisonedPlus: dragonDaggerpplus,
    poisonedPlusPlus: dragonDaggerpplusplus,
} as const;

// ── Ore & Bar Packs ────────────────────────────────────────────────

/**
 * Gold ore/bar cursor pack — represents the smelting progression.
 *
 * @example
 * ```ts
 * import { goldPack } from '@dava96/osrs-icons';
 * element.style.cursor = isComplete ? goldPack.bar : goldPack.ore;
 * ```
 */
export const goldPack = {
    ore: goldOre,
    bar: goldBar,
} as const;

/**
 * Iron ore/bar cursor pack — represents the smelting progression.
 *
 * @example
 * ```ts
 * import { ironPack } from '@dava96/osrs-icons';
 * element.style.cursor = ironPack.ore;
 * ```
 */
export const ironPack = {
    ore: ironOre,
    bar: ironBar,
} as const;

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
