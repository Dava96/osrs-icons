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

| Command | Description |
|---------|-------------|
| `npm run build` | Build both CJS and ESM outputs to `dist/` |
| `npm run lint` | Lint source files with ESLint |
| `npm run format` | Format files with Prettier |
| `npm test` | Run all tests |
| `npm run update-icons` | Fetch latest icons from the OSRS Wiki |

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
│   ├── generated/        # Auto-generated icon + meta exports
│   │   ├── icons.ts      # ~17,400 named icon exports
│   │   └── meta.ts       # iconNames array + IconName type
│   ├── packs.ts          # Pre-built cursor packs
│   ├── flip.ts           # flipCursor() — Canvas horizontal flip
│   ├── applyCursors.ts   # applyCursors() — CSS state mapping
│   ├── index.ts          # Public API entry point
│   └── *_test.ts         # Tests
├── scripts/
│   ├── update-icons.ts   # Wiki scraper + icon processor
│   └── generate-meta.js  # Builds meta.ts from icons.ts
├── site/                 # Documentation website (Vite + React)
├── dist/                 # Build output (CJS + ESM)
├── .github/workflows/    # CI + publish automation
└── package.json
```

## Updating Icons

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

## Automation

Icons are updated weekly via GitHub Actions.

- The **Update Icons** workflow runs every Saturday at midnight.
- It creates a Pull Request with any new or changed icons.
- **Human review is required** before merging and publishing.

## CI Pipeline

Every pull request and feature branch push triggers the **CI** workflow:

1. Install dependencies (root + site)
2. Lint (root + site)
3. Run tests
4. Build package
5. Build site

All checks must pass before merging.

## Publishing

Publishing happens automatically when changes to `src/` or `package.json` land on `main`.
The workflow bumps the patch version, commits it, builds, and publishes to npm.

You can also trigger a publish manually from the **Actions** tab → **Publish to npm** → **Run workflow**.

