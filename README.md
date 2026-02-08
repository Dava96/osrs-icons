# OSRS Icons

A collection of Old School RuneScape icons as ready-to-use CSS cursor values.
Import only what you need — unused icons are automatically tree-shaken from your bundle.

[![npm](https://img.shields.io/npm/v/@dava96/osrs-icons)](https://www.npmjs.com/package/@dava96/osrs-icons)
[![npm downloads](https://img.shields.io/npm/dw/@dava96/osrs-icons)](https://www.npmjs.com/package/@dava96/osrs-icons)
[![license](https://img.shields.io/npm/l/@dava96/osrs-icons)](./LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/Dava96/osrs-icons)](https://github.com/Dava96/osrs-icons)

📖 **[Browse icons & build packs →](https://dava96.github.io/osrs-icons/)**

---

## Installation

```bash
npm install @dava96/osrs-icons
```

Or use it directly from a CDN with no build step:

```html
<script type="module">
  import { abyssalWhip } from 'https://esm.sh/@dava96/osrs-icons';

  document.body.style.cursor = abyssalWhip;
</script>
```

## Quick Start

```tsx
import { abyssalWhip, toDataUrl } from '@dava96/osrs-icons';

// Use as a CSS cursor
<div style={{ cursor: abyssalWhip }}>Hover me!</div>

// Use as an image
<img src={toDataUrl(abyssalWhip)} alt="Abyssal Whip" />
```

Every icon export is a fully formed CSS `cursor` value (`url('data:image/png;base64,...'), auto`), so you can drop it straight into any `cursor` property.

---

## Icons

The package contains two icon collections:

### Inventory Icons (~17,400)

These are the item sprites from the in-game inventory. Each icon is a named export on the package root:

```ts
import { abyssalWhip, dragonScimitar } from '@dava96/osrs-icons';

element.style.cursor = abyssalWhip;
```

### Category Icons (~2,100)

UI icons from the OSRS Wiki — skill icons, prayer icons, map markers, spell icons, and more. These are exported under the `categoryIcons` namespace to avoid name collisions with inventory icons:

```ts
import { categoryIcons } from '@dava96/osrs-icons';

element.style.cursor = categoryIcons.combatIcon;
element.style.cursor = categoryIcons.prayerAugury;
```

### Discovering Icons

Browse icons programmatically or restrict values to valid names with TypeScript types:

```ts
import {
  iconNames, // all inventory icon names
  categoryIconNames, // all category icon names
  type IconName,
  type CategoryIconName,
} from '@dava96/osrs-icons';

// Search / autocomplete
const results = iconNames.filter((name) => name.includes('dragon'));

// Type-safe references
function setCustomCursor(name: IconName) {
  /* ... */
}
```

### Using Icons as Images

Use the `toDataUrl` helper to extract the raw `data:image/png;base64,...` URL for use outside of CSS — for example, as an `<img>` src or a CSS `background-image`:

```ts
import { abyssalWhip, dragonScimitar, toDataUrl } from '@dava96/osrs-icons';

// Single icon
<img src={toDataUrl(abyssalWhip)} alt="Abyssal Whip" />

// Multiple icons at once
const urls = toDataUrl({
  whip: abyssalWhip,
  sword: dragonScimitar,
});
// urls.whip  → "data:image/png;base64,..."
// urls.sword → "data:image/png;base64,..."
```

---

## Cursor Packs

Pre-built thematic icon groups. Each pack groups related icons by their in-game state and includes a `stages` array for sequential use (e.g. loading indicators):

```ts
import { runePack, bucketPack, coinsPack } from '@dava96/osrs-icons';

// Individual keys
element.style.cursor = runePack.air;

// Sequential stages — great for loading indicators
const stages = bucketPack.stages; // [empty, 1/5, 2/5, 3/5, 4/5, full]
const index = Math.min(Math.floor((progress / 100) * stages.length), stages.length - 1);
element.style.cursor = stages[index];
```

**Available packs:**

| Pack         | Keys                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------- |
| `coinsPack`  | `_1` to `_10000` + `stages[]`                                                                   |
| `bucketPack` | `empty` to `full` + `stages[]`                                                                  |
| `runePack`   | `air`, `fire`, `water`, `earth`, `chaos`, `mind`, `death`, `law`, `nature`, `body` + `stages[]` |

---

## Utilities

### `flipCursor` — Mirror Icons Horizontally

Many OSRS sprites face right, but cursors typically point left. Flip a single icon, an array, or an entire pack:

```ts
import { abyssalWhip, runePack, flipCursor } from '@dava96/osrs-icons';

// Single icon
const leftFacing = await flipCursor(abyssalWhip);

// Array of icons
const [flippedAir, flippedFire] = await flipCursor([runePack.air, runePack.fire]);

// Entire pack — flips all values and stages in one call
const flippedRunes = await flipCursor(runePack);
```

Results are cached internally — flipping the same icon twice returns instantly. Browser-only (uses Canvas API); returns the original value in Node.js/SSR.

### `applyCursors` — Map Icons to CSS Cursor States

Override standard CSS cursor states (`default`, `pointer`, `wait`, etc.) with OSRS icons globally or scoped to a specific element:

```ts
import { abyssalWhip, dragonScimitar, applyCursors } from '@dava96/osrs-icons';

// Apply globally
const cleanup = applyCursors({
  default: abyssalWhip,
  pointer: dragonScimitar,
});

// Later, revert to browser defaults
cleanup();
```

Scope to a specific element:

```ts
applyCursors({ default: abyssalWhip }, document.getElementById('game-area')!);
```

### `animateCursor` — Animated Sprite Cursors

Cycle through a sequence of icons as an animated cursor using pure CSS `@keyframes` — no JavaScript timers required:

```ts
import { coinsPack, animateCursor } from '@dava96/osrs-icons';

// Animate a growing coin stack on the whole page
const stop = animateCursor(coinsPack.stages, { duration: 1200 });

// Stop and clean up
stop();
```

Scope to an element and limit iterations:

```ts
import { bucketPack, animateCursor } from '@dava96/osrs-icons';

const stop = animateCursor(bucketPack.stages, {
  duration: 900,
  target: document.getElementById('loading')!,
  iterations: 3,
});
```

Requires at least 2 frames. Browser-only; returns a no-op cleanup in Node.js/SSR.

### `errorCursor` — Easter Egg 🐟

An alias for the Red Herring icon — a fun cursor for error states:

```ts
import { errorCursor } from '@dava96/osrs-icons';

element.style.cursor = errorCursor;
```

---

## API Reference

### Functions

| Function        | Signature                                                         | Description                                                                    |
| --------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `toDataUrl`     | `(cursor: string) → string`                                       | Extracts the raw `data:image/png;base64,...` URL from a CSS cursor value       |
| `toDataUrl`     | `(cursors: Record<K, string>) → Record<K, string>`                | Batch version — extracts URLs from an object of cursor values                  |
| `flipCursor`    | `(cursor: string) → Promise<string>`                              | Flips a single icon horizontally. Cached. Browser-only.                        |
| `flipCursor`    | `(cursors: string[]) → Promise<string[]>`                         | Flips an array of icons horizontally                                           |
| `flipCursor`    | `(pack: Record) → Promise<Record>`                                | Flips all values and stages in a pack                                          |
| `applyCursors`  | `(mapping: CursorMapping, target?: HTMLElement) → () => void`     | Injects CSS rules mapping cursor states to icons. Returns a cleanup function.  |
| `animateCursor` | `(frames: string[], options?: AnimateCursorOptions) → () => void` | Animates a cursor through a frame sequence via CSS keyframes. Returns cleanup. |

### Types

| Type                   | Description                                                                |
| ---------------------- | -------------------------------------------------------------------------- |
| `IconName`             | Union of all inventory icon export names                                   |
| `CategoryIconName`     | Union of all category icon export names                                    |
| `CursorState`          | Standard CSS cursor states (`'default'`, `'pointer'`, `'wait'`, etc.)      |
| `CursorMapping`        | `Partial<Record<CursorState, string>>` — maps cursor states to icon values |
| `AnimateCursorOptions` | `{ duration?: number, target?: HTMLElement, iterations?: number }`         |

### Constants

| Export              | Type                     | Description                                                |
| ------------------- | ------------------------ | ---------------------------------------------------------- |
| `iconNames`         | `readonly string[]`      | Array of all inventory icon export names (~17,400)         |
| `categoryIconNames` | `readonly string[]`      | Array of all category icon export names (~2,100)           |
| `categoryIcons`     | `namespace`              | All category icons as a namespace object                   |
| `errorCursor`       | `string`                 | Alias for `redHerring`                                     |
| `*Pack`             | `Record<string, string>` | Pre-built cursor packs (see [Cursor Packs](#cursor-packs)) |

---

## Browser Compatibility

| Feature         | Browser                | Node.js / SSR             |
| --------------- | ---------------------- | ------------------------- |
| Icon imports    | ✅ All                 | ✅ All                    |
| `toDataUrl`     | ✅ All                 | ✅ All                    |
| `applyCursors`  | ✅ All modern          | ⚠️ Returns no-op cleanup  |
| `flipCursor`    | ✅ Canvas API required | ⚠️ Returns original value |
| `animateCursor` | ✅ All modern          | ⚠️ Returns no-op cleanup  |
| Cursor packs    | ✅ All                 | ✅ All                    |

All features are SSR-safe — browser-only utilities degrade gracefully by returning safe fallback values.

---

## How It Works

Two build scripts fetch every icon from the [OSRS Wiki](https://oldschool.runescape.wiki/) and generate TypeScript source files:

| Script                  | Source Category                                                                                       | Output                            | Icons   |
| ----------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------- | ------- |
| `update-icons`          | [Item inventory images](https://oldschool.runescape.wiki/w/Category:Item_inventory_images)            | `src/generated/icons.ts`          | ~17,400 |
| `update-category-icons` | [Icons](https://oldschool.runescape.wiki/w/Category:Icons) (+ all subcategories, crawled recursively) | `src/generated/category-icons.ts` | ~2,100  |

Both scripts share common utilities from `scripts/shared.ts` and use an MD5-keyed disk cache so that subsequent runs only download new or changed images. SVGs are automatically rasterised to 32×32 PNGs.

Each icon is a small ~32×32 pixel sprite, base64-encoded inline — no external assets to host.

### Package Output

| Format | Path                  | Use                                  |
| ------ | --------------------- | ------------------------------------ |
| ESM    | `dist/esm/index.js`   | `import` (bundlers, modern browsers) |
| CJS    | `dist/cjs/index.js`   | `require()` (Node.js, legacy)        |
| Types  | `dist/cjs/index.d.ts` | TypeScript definitions               |

The package has `"sideEffects": false` for optimal tree-shaking in Webpack, Rollup, Vite, and esbuild.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup, project structure, and automation details.

## License

This project is not affiliated with Jagex Ltd. Icons are the property of Jagex/OSRS Wiki.
OSRS Wiki content is available under [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/).
