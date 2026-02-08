# OSRS Icons

A collection of Old School RuneScape inventory icons as ready-to-use CSS cursor values.
Designed for easy integration with modern web apps, with full tree-shaking support to keep your bundle small.

[![npm](https://img.shields.io/npm/v/@dava96/osrs-icons)](https://www.npmjs.com/package/@dava96/osrs-icons)
[![npm downloads](https://img.shields.io/npm/dw/@dava96/osrs-icons)](https://www.npmjs.com/package/@dava96/osrs-icons)
[![license](https://img.shields.io/npm/l/@dava96/osrs-icons)](./LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/Dava96/osrs-icons)](https://github.com/Dava96/osrs-icons)

## Installation

```bash
npm install @dava96/osrs-icons
```

## Usage

### CSS Cursor (Tree-Shaking Supported)

Import only the icons you need — unused icons are automatically excluded from your bundle.

```tsx
import { abyssalWhip } from '@dava96/osrs-icons';

function MyComponent() {
  return <div style={{ cursor: abyssalWhip }}>Hover me!</div>;
}
```

Each export is a fully formed CSS cursor value (e.g. `url('data:image/png;base64,...'), auto`).

### As an Image

Use the `toDataUrl` helper to extract the raw data URL for use outside of CSS:

```tsx
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

### Icon Discovery

Browse all available icons programmatically with `iconNames`, or restrict values to valid names with the `IconName` type:

```ts
import { iconNames, type IconName } from '@dava96/osrs-icons';

// Search / autocomplete
const results = iconNames.filter(name => name.includes('dragon'));

// Type-safe icon references
function setCustomCursor(name: IconName) { /* ... */ }
```

### CDN Usage (No Build Step)

You can use the package directly in the browser via ESM.sh:

```html
<script type="module">
  import { AbyssalWhip } from 'https://esm.sh/@dava96/osrs-icons';
  
  document.body.style.cursor = AbyssalWhip;
</script>
```

### Cursor Packs

Pre-built thematic icon groups — each pack groups related icons by their in-game state:

```ts
import { sharkPack, dragonDaggerPack, bucketPack } from '@dava96/osrs-icons';

// Fish: raw → cooked → burnt
element.style.cursor = sharkPack.cooked;

// Dragon dagger: base → poisoned → p+ → p++
element.style.cursor = dragonDaggerPack.poisonedPlusPlus;

// Bucket fill progression — great for loading states
const stages = bucketPack.stages; // [empty, 1/5, 2/5, 3/5, 4/5, full]
const index = Math.min(Math.floor(progress / 100 * stages.length), stages.length - 1);
element.style.cursor = stages[index];
```

**Available packs:**

| Pack | Keys |
|------|------|
| `sharkPack` | `raw`, `cooked`, `burnt` |
| `herringPack` | `raw`, `cooked`, `burnt`, `error` |
| `anglerfishPack` | `raw`, `cooked`, `burnt` |
| `dragonDaggerPack` | `base`, `poisoned`, `poisonedPlus`, `poisonedPlusPlus` |
| `goldPack` | `ore`, `bar` |
| `ironPack` | `ore`, `bar` |
| `coinsPack` | `_1` to `_10000` + `stages[]` |
| `bucketPack` | `empty` to `full` + `stages[]` |

### Flip Cursor

Many OSRS icons face right, but cursors typically point left. Flip any icon horizontally at runtime:

```ts
import { abyssalWhip, flipCursor } from '@dava96/osrs-icons';

const leftFacing = await flipCursor(abyssalWhip);
document.body.style.cursor = leftFacing;
```

Results are cached internally — flipping the same icon twice returns instantly. Browser-only (uses Canvas API); returns the original value in Node.js/SSR.

### Apply Cursors

Map OSRS icons to standard CSS cursor states with a one-liner:

```ts
import { abyssalWhip, dragonScimitar, bucketPack, applyCursors } from '@dava96/osrs-icons';

const cleanup = applyCursors({
  default: abyssalWhip,
  pointer: dragonScimitar,
  wait: bucketPack.full,
});

// Later, revert to browser defaults
cleanup();
```

You can also scope cursors to a specific element:

```ts
applyCursors({ default: abyssalWhip }, document.getElementById('game-area')!);
```

### Error Cursor 🐟

Use the iconic red herring as your error cursor:

```ts
import { errorCursor } from '@dava96/osrs-icons';

// Also available via herringPack.error
element.style.cursor = errorCursor;
```

## How It Works

The build script fetches every inventory sprite (~17,400 icons) from the
[OSRS Wiki](https://oldschool.runescape.wiki/w/Category:Item_inventory_images),
compresses them as palette PNGs, and generates a TypeScript file of named exports.

Each icon is a small ~32×32 pixel sprite, base64-encoded inline — no external assets to host.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details on updating icons and publishing new versions.

## License

This project is not affiliated with Jagex Ltd. Icons are the property of Jagex/OSRS Wiki.
OSRS Wiki content is available under [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/).
