# OSRS Icons

A collection of Old School RuneScape inventory icons as ready-to-use CSS cursor values.
Designed for easy integration with modern web apps, with full tree-shaking support to keep your bundle small.

[![npm](https://img.shields.io/npm/v/@dava96/osrs-icons)](https://www.npmjs.com/package/@dava96/osrs-icons)
[![license](https://img.shields.io/npm/l/@dava96/osrs-icons)](./LICENSE)

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

### Raw Base64

If you need just the data URL for use outside of CSS:

```ts
import { abyssalWhip } from '@dava96/osrs-icons';

const dataUrl = abyssalWhip.replace(/url\('(.*)'\), auto/, '$1');
```

## How It Works

The build script fetches every inventory sprite (~17,400 icons) from the
[OSRS Wiki](https://oldschool.runescape.wiki/w/Category:Item_inventory_images),
compresses them as palette PNGs, and generates a TypeScript file of named exports.

Each icon is a small ~36×36 pixel sprite, base64-encoded inline — no external assets to host.

## Maintenance

### Updating Icons

```bash
npm run update-icons
```

This fetches the latest inventory sprites from the OSRS Wiki, processes them,
and regenerates `src/generated/icons.ts`. The script uses an MD5-keyed disk cache,
so subsequent runs only download new or changed icons.

Pass `--no-cache` to force a full rebuild:

```bash
npx ts-node scripts/update-icons.ts --no-cache
```

### Automation

Icons are updated weekly via GitHub Actions.

- The **Update Icons** workflow runs every Saturday at midnight.
- It creates a Pull Request with any new or changed icons.
- **Human review is required** before merging and publishing.

### Publishing

After merging an icon update PR, publish to npm:

```bash
npm version patch
npm publish --access public
```

Or use the automated publish workflow by pushing a version tag:

```bash
git tag v1.0.1
git push origin v1.0.1
```

## License

This project is not affiliated with Jagex Ltd. Icons are the property of Jagex/OSRS Wiki.
OSRS Wiki content is available under [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/).
