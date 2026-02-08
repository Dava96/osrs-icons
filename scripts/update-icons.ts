import fs from 'fs-extra';
import path from 'path';

import {
  OUTPUT_DIR,
  fetchCategoryMembers,
  fetchImageInfo,
  downloadAndProcessImages,
  generateCodeStream,
  generateMetaFile,
  ImageRequest,
} from './shared';

/** Whether to use the disk cache. Disable with `--no-cache`. */
const SHOULD_USE_CACHE = !process.argv.includes('--no-cache');

/**
 * Entry point. Fetches every OSRS inventory sprite from the wiki, processes
 * them into base64 CSS cursor values, and writes the result as a TypeScript
 * source file of named exports.
 *
 * **Pipeline:**
 * 1. Fetch file titles from `Category:Item_inventory_images`
 * 2. Resolve download URLs via the `imageinfo` API
 * 3. Download and compress each sprite (with disk caching)
 * 4. Stream the generated TypeScript to `src/generated/icons.ts`
 * 5. Generate `meta.ts` with icon name array and union type
 */
async function main() {
  const startTime = Date.now();
  console.log('Starting OSRS Icons update script...');
  console.log(`Cache: ${SHOULD_USE_CACHE ? 'enabled' : 'disabled (--no-cache)'}`);
  await fs.ensureDir(OUTPUT_DIR);

  console.log('Fetching Item Inventory Images...');
  const items = await fetchCategoryMembers('Category:Item_inventory_images', 200, 'file');
  console.log(`Found ${items.length} items.`);

  const requests: ImageRequest[] = items.map((item) => ({
    fileTitle: item.title,
    key: item.title.replace(/^File:/, '').replace(/\.png$/i, ''),
  }));

  console.log(`Total image requests prepared: ${requests.length}`);

  const imageUrls = await fetchImageInfo(requests);
  console.log(`Resolved ${imageUrls.size} image URLs.`);

  console.log('Downloading and processing images...');
  const base64Map = await downloadAndProcessImages(imageUrls, SHOULD_USE_CACHE);
  console.log(`Processed ${base64Map.size} images.`);

  console.log('Generating code...');
  const outputPath = path.join(OUTPUT_DIR, 'icons.ts');
  const sortedNames = await generateCodeStream(base64Map, outputPath);

  console.log('Generating icon metadata...');
  const metaPath = path.join(OUTPUT_DIR, 'meta.ts');
  await generateMetaFile(sortedNames, metaPath);

  const stats = await fs.stat(outputPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(1);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`Generated ${outputPath} (${sizeMB} MB)`);
  console.log(`Generated ${metaPath} (${sortedNames.length} icon names)`);
  console.log(`Total time: ${elapsed}s`);
}

if (require.main === module) {
  main().catch(console.error);
}
