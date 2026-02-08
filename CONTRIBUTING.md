# Contributing

## Local Development

### Prerequisites

- Node.js 20+
- npm 9+

### Setup

```bash
git clone https://github.com/Dava96/osrs-icons.git
cd osrs-icons
npm install
```

### Available Scripts

| Command                         | Description                                                 |
| ------------------------------- | ----------------------------------------------------------- |
| `npm run build`                 | Build both CJS and ESM outputs to `dist/`                   |
| `npm run lint`                  | Lint source files with ESLint                               |
| `npm run format`                | Format all files with Prettier                              |
| `npm test`                      | Run all unit tests                                          |
| `npm run update-icons`          | Fetch latest inventory icons from the OSRS Wiki             |
| `npm run update-category-icons` | Fetch latest category icons (skills, prayers, spells, etc.) |

Both update scripts support a `--no-cache` flag to force re-downloading all images:

```bash
npx ts-node scripts/update-icons.ts --no-cache
npx ts-node scripts/update-category-icons.ts --no-cache
```

### Documentation Site

The doc site lives in `site/` and is a standalone Vite + React app:

```bash
cd site
npm install
npm run dev       # Start dev server at http://localhost:5173/osrs-icons/
npm run build     # Production build to site/dist/
npm run lint      # Lint site source
```

### Project Structure

```
osrs-icons/
├── src/
│   ├── generated/                  # Auto-generated icon + meta exports
│   │   ├── icons.ts                # ~17,400 inventory icon exports
│   │   ├── meta.ts                 # iconNames array + IconName type
│   │   ├── category-icons.ts       # ~2,100 category icon exports
│   │   └── category-icons-meta.ts  # categoryIconNames + CategoryIconName
│   ├── packs.ts                    # Pre-built cursor packs
│   ├── flip.ts                     # flipCursor() — Canvas horizontal flip
│   ├── applyCursors.ts             # applyCursors() — CSS state mapping
│   ├── animateCursor.ts            # animateCursor() — CSS keyframe animation
│   ├── index.ts                    # Public API entry point
│   └── *_test.ts                   # Tests (one per source file)
├── scripts/
│   ├── shared.ts                   # Shared utilities (fetch, cache, process)
│   ├── shared_test.ts              # Tests for shared utilities
│   ├── update-icons.ts             # Inventory icon fetcher
│   ├── update-category-icons.ts    # Category icon fetcher (recursive)
│   └── update-category-icons_test.ts
├── site/                           # Documentation website (Vite + React)
├── dist/                           # Build output (CJS + ESM)
├── .github/workflows/              # CI, publish, and icon update automation
└── package.json
```

## Updating Icons

### Inventory Icons

```bash
npm run update-icons
```

Fetches all item sprites from [Category:Item_inventory_images](https://oldschool.runescape.wiki/w/Category:Item_inventory_images) and regenerates `src/generated/icons.ts` and `src/generated/meta.ts`.

### Category Icons

```bash
npm run update-category-icons
```

Recursively crawls [Category:Icons](https://oldschool.runescape.wiki/w/Category:Icons) and all subcategories (skill icons, prayer icons, spell icons, map icons, etc.), deduplicates files that appear in multiple categories, and regenerates `src/generated/category-icons.ts` and `src/generated/category-icons-meta.ts`.

SVG icons are automatically rasterised to 32×32 PNGs.

### Caching

Both scripts use an MD5-keyed disk cache in `src/generated/cache/`. Only new or changed images are downloaded on subsequent runs.

## Automation

### Weekly Icon Updates

Icons are updated weekly via GitHub Actions:

- The **Update Icons and Deploy Site** workflow runs every Saturday at midnight.
- It runs both `update-icons` and `update-category-icons`.
- A Pull Request is automatically created with any new or changed icons.
- **Human review is required** before merging.

### CI Pipeline

Every pull request and feature branch push triggers the **CI** workflow:

1. Install dependencies (root + site)
2. Lint (root + site)
3. Format check
4. Run tests
5. Build package
6. Build site

All checks must pass before merging.

### Publishing

Publishing happens automatically when changes to `src/` or `package.json` land on `main`. The workflow bumps the patch version, commits it, builds, and publishes to npm.

You can also trigger a publish manually from the **Actions** tab → **Publish to npm** → **Run workflow**.
