# Contributing

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

## Publishing

Publishing happens automatically when changes to `src/` or `package.json` land on `main`.
The workflow bumps the patch version, commits it, builds, and publishes to npm.

You can also trigger a publish manually from the **Actions** tab → **Publish to npm** → **Run workflow**.
