import fs from 'fs-extra';
import path from 'path';

import {
  OUTPUT_DIR,
  WikiItem,
  ImageRequest,
  fetchCategoryMembers,
  fetchImageInfo,
  downloadAndProcessImages,
  generateCodeStream,
  generateMetaFile,
  loadMainIconExports,
  sanitiseVariableName,
} from './shared';

/** Whether to use the disk cache. Disable with `--no-cache`. */
const SHOULD_USE_CACHE = !process.argv.includes('--no-cache');

/** The root wiki category to crawl for icons. */
const ROOT_CATEGORY = 'Category:Icons';

/**
 * Recursively collects all file members from a wiki category and its
 * subcategories. Tracks visited categories in a set to avoid infinite
 * loops caused by circular parent references.
 *
 * @param category - Full category title to crawl (e.g. `"Category:Icons"`).
 * @param visited  - Set of already-visited category titles (prevents cycles).
 * @returns A map of `file title -> WikiItem`, deduplicated across subcategories.
 */
export async function fetchAllFilesRecursively(
  category: string,
  visited: Set<string> = new Set()
): Promise<Map<string, WikiItem>> {
  if (visited.has(category)) {
    console.log(`Skipping already-visited category: ${category}`);
    return new Map();
  }
  visited.add(category);

  const fileMap = new Map<string, WikiItem>();

  const directFiles = await fetchCategoryMembers(category, 200, 'file');
  for (const file of directFiles) {
    if (!fileMap.has(file.title)) {
      fileMap.set(file.title, file);
    }
  }

  const subcategories = await fetchCategoryMembers(category, 200, 'subcat');
  console.log(
    `Found ${subcategories.length} subcategories in ${category}: ${subcategories.map((s) => s.title).join(', ')}`
  );

  for (const subcat of subcategories) {
    const childFiles = await fetchAllFilesRecursively(subcat.title, visited);
    for (const [title, item] of childFiles) {
      if (!fileMap.has(title)) {
        fileMap.set(title, item);
      }
    }
  }

  return fileMap;
}

/**
 * Filters file titles to only include image files (PNG and SVG).
 * Logs any skipped files that have unsupported extensions.
 *
 * @param files - Map of `file title -> WikiItem` collected from the wiki.
 * @returns A new map containing only files with `.png` or `.svg` extensions.
 */
export function filterImageFiles(files: Map<string, WikiItem>): Map<string, WikiItem> {
  const filtered = new Map<string, WikiItem>();
  const supportedExtensions = ['.png', '.svg'];

  for (const [title, item] of files) {
    const lowerTitle = title.toLowerCase();
    const isSupported = supportedExtensions.some((ext) => lowerTitle.endsWith(ext));
    if (isSupported) {
      filtered.set(title, item);
    } else {
      console.log(`Skipping unsupported file format: ${title}`);
    }
  }

  return filtered;
}

/**
 * Builds an array of {@link ImageRequest} objects from a deduplicated
 * file map. Strips the `File:` prefix and file extension from each
 * title to produce the key used as the generated variable name.
 *
 * @param files - Deduplicated map of `file title -> WikiItem`.
 * @returns Array of image requests ready for {@link fetchImageInfo}.
 */
export function buildImageRequests(files: Map<string, WikiItem>): ImageRequest[] {
  return Array.from(files.values()).map((item) => ({
    fileTitle: item.title,
    key: item.title.replace(/^File:/, '').replace(/\.(png|svg)$/i, ''),
  }));
}

/**
 * Resolves name collisions between category icons and the existing main
 * icon exports. Each category icon key is sanitised the same way
 * `generateCodeStream` would, then checked against the main icon set.
 *
 * - **Identical value**: the category icon is redundant and is removed.
 * - **Different value**: the category icon is kept with a `Category` suffix
 *   (e.g. `hunterKit` → `hunterKitCategory`).
 *
 * @param categoryBase64Map - Mutable map of `raw key → CSS cursor value` for category icons.
 * @param mainIconExports   - Map of `export name → CSS cursor value` from the main icons file.
 * @returns Summary stats: `{ dropped, renamed }`.
 */
export function resolveCollisionsWithMainIcons(
  categoryBase64Map: Map<string, string>,
  mainIconExports: Map<string, string>
): { dropped: number; renamed: number } {
  let dropped = 0;
  let renamed = 0;

  const mainNames = new Set(mainIconExports.keys());

  for (const [rawKey, categoryValue] of Array.from(categoryBase64Map.entries())) {
    let sanitised = sanitiseVariableName(rawKey);
    if (/^\d/.test(sanitised) || sanitised.length === 0) {
      sanitised = '_' + sanitised;
    }

    if (!mainNames.has(sanitised)) continue;

    const mainValue = mainIconExports.get(sanitised)!;

    if (mainValue === categoryValue) {
      categoryBase64Map.delete(rawKey);
      console.log(`  Collision (identical, dropped): ${sanitised}`);
      dropped++;
    } else {
      const renamedKey = rawKey + ' category';
      categoryBase64Map.delete(rawKey);
      categoryBase64Map.set(renamedKey, categoryValue);
      console.log(`  Collision (different, renamed): ${sanitised} → ${sanitised}Category`);
      renamed++;
    }
  }

  return { dropped, renamed };
}

/**
 * Entry point. Recursively crawls `Category:Icons` and all nested
 * subcategories on the OSRS Wiki, processes every icon into a base64
 * CSS cursor value, and writes the result as TypeScript source files.
 *
 * **Pipeline:**
 * 1. Recursively discover all files in `Category:Icons` and subcategories
 * 2. Deduplicate files that appear in multiple categories
 * 3. Filter to supported image formats (PNG, SVG)
 * 4. Resolve download URLs via the `imageinfo` API
 * 5. Download and compress each icon (SVGs are rasterised to 32×32 PNG)
 * 6. Resolve name collisions with main icon exports
 * 7. Stream the generated TypeScript to `src/generated/category-icons.ts`
 * 8. Generate `category-icons-meta.ts` with name array and union type
 */
async function main() {
  const startTime = Date.now();
  console.log('Starting Category Icons update script...');
  console.log(`Cache: ${SHOULD_USE_CACHE ? 'enabled' : 'disabled (--no-cache)'}`);
  await fs.ensureDir(OUTPUT_DIR);

  console.log(`\nCrawling ${ROOT_CATEGORY} recursively...\n`);
  const allFiles = await fetchAllFilesRecursively(ROOT_CATEGORY);
  console.log(`\nFound ${allFiles.size} unique files (before filtering).`);

  const imageFiles = filterImageFiles(allFiles);
  console.log(`${imageFiles.size} supported image files after filtering.\n`);

  const requests = buildImageRequests(imageFiles);
  console.log(`Total image requests prepared: ${requests.length}`);

  const imageUrls = await fetchImageInfo(requests);
  console.log(`Resolved ${imageUrls.size} image URLs.`);

  console.log('Downloading and processing images...');
  const base64Map = await downloadAndProcessImages(imageUrls, SHOULD_USE_CACHE);
  console.log(`Processed ${base64Map.size} images.`);

  console.log('\nResolving collisions with main icon exports...');
  const mainExports = await loadMainIconExports();
  const { dropped, renamed } = resolveCollisionsWithMainIcons(base64Map, mainExports);
  console.log(`Collision resolution: ${dropped} dropped (identical), ${renamed} renamed.`);
  console.log(`${base64Map.size} category icons remaining after collision resolution.\n`);

  console.log('Generating code...');
  const outputPath = path.join(OUTPUT_DIR, 'category-icons.ts');
  const sortedNames = await generateCodeStream(base64Map, outputPath);

  console.log('Generating category icon metadata...');
  const metaPath = path.join(OUTPUT_DIR, 'category-icons-meta.ts');
  await generateMetaFile(sortedNames, metaPath, 'categoryIconNames', 'CategoryIconName');

  const stats = await fs.stat(outputPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(1);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\nGenerated ${outputPath} (${sizeMB} MB)`);
  console.log(`Generated ${metaPath} (${sortedNames.length} category icon names)`);
  console.log(`Total time: ${elapsed}s`);
}

if (require.main === module) {
  main().catch(console.error);
}
