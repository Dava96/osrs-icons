import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import crypto from 'crypto';

/** Directory where generated TypeScript source is written. */
export const OUTPUT_DIR = path.join(__dirname, '../src/generated');

/** Directory for the MD5-keyed disk cache of processed icons. */
export const CACHE_DIR = path.join(OUTPUT_DIR, 'cache');

/** MediaWiki API endpoint for the Old School RuneScape Wiki. */
export const WIKI_API_URL = 'https://oldschool.runescape.wiki/api.php';

/** Use all available CPU cores for sharp's image processing thread pool. */
sharp.concurrency(0);

/** A single item returned by the MediaWiki `categorymembers` API. */
export interface WikiItem {
  pageid: number;
  ns: number;
  title: string;
}

/** Maps a wiki file title to the variable-name key used in the generated code. */
export interface ImageRequest {
  fileTitle: string;
  key: string;
}

/** Persisted cache mapping a URL hash to its processed base64 CSS data URL. */
export interface CacheManifest {
  [urlHash: string]: string;
}

axios.defaults.timeout = 15000;
axios.defaults.headers.common['User-Agent'] = 'osrs-icons-npm-package/1.0.0 (dava96/osrs-icons)';

/**
 * Returns a promise that resolves after the given number of milliseconds.
 * Used for retry back-off delays.
 *
 * @param ms - The number of milliseconds to wait.
 * @returns A promise that resolves after the specified delay.
 */
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Executes an array of async task factories with a maximum number of tasks
 * running at the same time. Returns the collected results in completion order.
 *
 * @param pool  - Array of zero-argument functions that each return a Promise.
 * @param limit - Maximum number of Promises executing concurrently.
 * @returns All resolved values once every task has completed.
 */
export async function limitConcurrency<T>(pool: (() => Promise<T>)[], limit: number): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];

  for (const task of pool) {
    const p = task().then((result) => {
      results.push(result);
    });
    executing.push(p);

    const clean = () => executing.splice(executing.indexOf(p), 1);
    p.then(clean).catch(clean);

    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}

/**
 * Wrapper around `axios` that automatically retries on HTTP 429 (rate-limit)
 * and 5xx (server error) responses with exponential-ish jitter.
 *
 * @param config  - Axios request config object.
 * @param retries - Remaining retry attempts before throwing.
 * @returns The Axios response.
 */
export async function fetchWithRetry(
  config: import('axios').AxiosRequestConfig,
  retries = 10
): Promise<import('axios').AxiosResponse> {
  try {
    return await axios(config);
  } catch (error: unknown) {
    const isRetryable =
      axios.isAxiosError(error) &&
      error.response &&
      (error.response.status === 429 || error.response.status >= 500);
    if (isRetryable && retries > 0) {
      const waitTime = 5000 + Math.random() * 5000;
      console.log(
        `Rate limited (or server error) on API. Retrying in ${Math.round(waitTime)}ms...`
      );
      await delay(waitTime);
      return fetchWithRetry(config, retries - 1);
    }
    throw error;
  }
}

/**
 * Downloads a binary resource with automatic retry on rate-limit / server errors.
 *
 * @param url     - The URL to download.
 * @param retries - Remaining retry attempts before throwing.
 * @returns The downloaded file contents as a Buffer.
 */
export async function downloadWithRetry(url: string, retries = 5): Promise<Buffer> {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data);
  } catch (error: unknown) {
    const isRetryable =
      axios.isAxiosError(error) &&
      error.response &&
      (error.response.status === 429 || error.response.status >= 500);
    if (isRetryable && retries > 0) {
      const waitTime = 5000 + Math.random() * 5000;
      console.log(`Rate limited downloading. Retrying in ${Math.round(waitTime)}ms...`);
      await delay(waitTime);
      return downloadWithRetry(url, retries - 1);
    }
    throw error;
  }
}

/**
 * Produces an MD5 hex digest for a given URL string.
 * Used as the cache key for each processed icon.
 *
 * @param url - The URL to hash.
 * @returns The hex-encoded MD5 digest.
 */
export function hashUrl(url: string): string {
  return crypto.createHash('md5').update(url).digest('hex');
}

/**
 * Reads the cache manifest from disk. Returns an empty object if the
 * manifest does not exist or is corrupted.
 *
 * @returns The loaded cache manifest, or an empty object.
 */
export async function loadCacheManifest(): Promise<CacheManifest> {
  const manifestPath = path.join(CACHE_DIR, 'manifest.json');
  if (await fs.pathExists(manifestPath)) {
    try {
      return await fs.readJson(manifestPath);
    } catch {
      console.log('Cache manifest corrupted, starting fresh.');
    }
  }
  return {};
}

/**
 * Persists the cache manifest to disk as JSON.
 *
 * @param manifest - The cache manifest to save.
 */
export async function saveCacheManifest(manifest: CacheManifest): Promise<void> {
  const manifestPath = path.join(CACHE_DIR, 'manifest.json');
  await fs.writeJson(manifestPath, manifest);
}

/**
 * Paginates through a MediaWiki category, collecting all members.
 *
 * @param category - Full category title, e.g. `"Category:Item_inventory_images"`.
 * @param limit    - Page size per API request (max 500 for bots, 200 for anons).
 * @param type     - Whether to fetch `"page"`, `"file"`, or `"subcat"` members.
 * @returns Every item in the category.
 */
export async function fetchCategoryMembers(
  category: string,
  limit: number = 200,
  type: 'page' | 'file' | 'subcat' = 'page'
): Promise<WikiItem[]> {
  console.log(`Fetching items from ${category} (type: ${type})...`);
  const allItems: WikiItem[] = [];
  let continueToken: string | undefined = undefined;

  do {
    const params: Record<string, string | number> = {
      action: 'query',
      list: 'categorymembers',
      cmtitle: category,
      cmlimit: limit,
      cmtype: type,
      format: 'json',
      origin: '*',
    };

    if (continueToken) {
      params.cmcontinue = continueToken;
    }

    try {
      const response = await fetchWithRetry({
        method: 'get',
        url: WIKI_API_URL,
        params,
      });
      const data = response.data;

      if (data.query?.categorymembers) {
        allItems.push(...data.query.categorymembers);
        console.log(
          `Fetched ${data.query.categorymembers.length} items (Total: ${allItems.length})`
        );
      }

      continueToken = data.continue?.cmcontinue;
    } catch (error) {
      console.error('Error fetching category members:', error);
      break;
    }
  } while (continueToken);

  return allItems;
}

/**
 * Resolves download URLs for a batch of wiki file titles by querying the
 * MediaWiki `imageinfo` property in chunks of 50.
 *
 * @param requests - The image requests containing file titles and keys.
 * @returns A map of `key -> download URL`.
 */
export async function fetchImageInfo(requests: ImageRequest[]): Promise<Map<string, string>> {
  console.log(`Fetching image info for ${requests.length} files...`);

  const requestMap = new Map<string, string[]>();
  for (const r of requests) {
    const keys = requestMap.get(r.fileTitle) || [];
    keys.push(r.key);
    requestMap.set(r.fileTitle, keys);
  }

  const allFileTitles = Array.from(requestMap.keys());
  const chunks: string[][] = [];
  for (let i = 0; i < allFileTitles.length; i += 50) {
    chunks.push(allFileTitles.slice(i, i + 50));
  }

  const urlMap = new Map<string, string>();
  let chunkCount = 0;
  const totalChunks = chunks.length;

  const tasks = chunks.map((chunk) => async () => {
    const params = {
      action: 'query',
      titles: chunk.join('|'),
      prop: 'imageinfo',
      iiprop: 'url',
      format: 'json',
      origin: '*',
    };

    try {
      const response = await fetchWithRetry({
        method: 'get',
        url: WIKI_API_URL,
        params,
      });
      const pages = response.data.query.pages;

      for (const pageId in pages) {
        const page = pages[pageId];
        if (page.imageinfo?.[0]?.url) {
          const keys = requestMap.get(page.title);
          if (keys) {
            for (const key of keys) {
              urlMap.set(key, page.imageinfo[0].url);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching image info:', error);
    }

    chunkCount++;
    if (chunkCount % 20 === 0) {
      console.log(`Processed ${chunkCount}/${totalChunks} chunks...`);
    }
  });

  await limitConcurrency(tasks, 2);

  return urlMap;
}

/**
 * Compresses a PNG image buffer with palette mode for the smallest
 * possible base64 output.
 *
 * @param buffer - Raw PNG image data.
 * @returns A CSS `cursor` value containing the base64-encoded data URL.
 */
export async function processImageBuffer(buffer: Buffer): Promise<string> {
  const compressedBuffer = await sharp(buffer)
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();

  const base64 = compressedBuffer.toString('base64');
  return `url('data:image/png;base64,${base64}'), auto`;
}

/**
 * Rasterises an SVG buffer to a 32×32 PNG and compresses it with palette
 * mode, returning a CSS `cursor` value identical in format to
 * {@link processImageBuffer}.
 *
 * @param buffer - Raw SVG image data.
 * @returns A CSS `cursor` value containing the base64-encoded PNG data URL.
 */
export async function processSvgBuffer(buffer: Buffer): Promise<string> {
  const compressedBuffer = await sharp(buffer)
    .resize(32, 32, { fit: 'inside' })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();

  const base64 = compressedBuffer.toString('base64');
  return `url('data:image/png;base64,${base64}'), auto`;
}

/**
 * Downloads and processes every icon, using the disk cache to skip icons
 * that have already been processed in a previous run.
 *
 * Network downloads are limited to 10 concurrent requests. Image processing
 * is handled by sharp's internal thread pool across all available CPU cores.
 *
 * @param urlMap         - Map of `key -> download URL` from {@link fetchImageInfo}.
 * @param shouldUseCache - Whether to read/write the disk cache.
 * @returns Map of `key -> CSS cursor data URL` for code generation.
 */
export async function downloadAndProcessImages(
  urlMap: Map<string, string>,
  shouldUseCache: boolean = true
): Promise<Map<string, string>> {
  const base64Map = new Map<string, string>();
  let cacheHits = 0;
  let downloads = 0;
  const total = urlMap.size;

  let manifest: CacheManifest = {};
  if (shouldUseCache) {
    await fs.ensureDir(CACHE_DIR);
    manifest = await loadCacheManifest();
    console.log(`Cache: loaded ${Object.keys(manifest).length} cached entries.`);
  }

  const tasks = Array.from(urlMap.entries()).map(([key, url]) => async () => {
    const urlHash = hashUrl(url);

    if (shouldUseCache && manifest[urlHash]) {
      base64Map.set(key, manifest[urlHash]);
      cacheHits++;
      return;
    }

    try {
      const buffer = await downloadWithRetry(url);
      const isSvg = url.toLowerCase().endsWith('.svg');
      const dataUrl = isSvg ? await processSvgBuffer(buffer) : await processImageBuffer(buffer);

      base64Map.set(key, dataUrl);

      if (shouldUseCache) {
        manifest[urlHash] = dataUrl;
      }

      downloads++;
      if (downloads % 100 === 0) {
        console.log(`Downloaded ${downloads} / ~${total - cacheHits} new images...`);
      }
    } catch (e) {
      console.error(`Failed to download/process ${key}:`, e);
    }
  });

  await limitConcurrency(tasks, 10);

  if (shouldUseCache) {
    await saveCacheManifest(manifest);
    console.log(`Cache: ${cacheHits} hits, ${downloads} new downloads.`);
  }

  return base64Map;
}

/**
 * JavaScript and TypeScript reserved words that cannot be used as
 * `export const` identifiers. Any sanitised name that collides with
 * this set is prefixed with an underscore.
 */
export const RESERVED_WORDS = new Set([
  'abstract',
  'arguments',
  'await',
  'boolean',
  'break',
  'byte',
  'case',
  'catch',
  'char',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'double',
  'else',
  'enum',
  'eval',
  'export',
  'extends',
  'false',
  'final',
  'finally',
  'float',
  'for',
  'function',
  'goto',
  'if',
  'implements',
  'import',
  'in',
  'instanceof',
  'int',
  'interface',
  'let',
  'long',
  'native',
  'new',
  'null',
  'package',
  'private',
  'protected',
  'public',
  'return',
  'short',
  'static',
  'super',
  'switch',
  'synchronized',
  'this',
  'throw',
  'throws',
  'transient',
  'true',
  'try',
  'typeof',
  'undefined',
  'var',
  'void',
  'volatile',
  'while',
  'with',
  'yield',
]);

/**
 * Converts a wiki file title into a valid camelCase JavaScript identifier.
 *
 * Handles special characters (`+` → `Plus`, `&` → `And`), strips punctuation,
 * and prefixes names that collide with reserved words.
 *
 * @param title - The raw item title from the wiki (e.g. `"Abyssal whip"`).
 * @returns A safe camelCase identifier (e.g. `"abyssalWhip"`).
 */
export function sanitiseVariableName(title: string): string {
  let name = title
    .replace(/\+/g, 'Plus')
    .replace(/&/g, 'And')
    .replace(/['"().,]/g, '')
    .replace(/[^a-zA-Z0-9\s\-_]/g, '')
    .split(/[\s\-_]+/)
    .filter((w) => w.length > 0)
    .map((word, index) => {
      if (index === 0) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');

  if (RESERVED_WORDS.has(name)) {
    name = '_' + name;
  }

  return name;
}

/**
 * Streams the final TypeScript source file to disk one export at a time,
 * avoiding the need to hold the entire file in a single string. Each icon
 * is written as `export const <name> = "<dataUrl>";`.
 *
 * Variable names are sorted alphabetically for deterministic, diff-friendly output.
 * Collisions (two titles that sanitise to the same name) are resolved with a
 * numeric suffix.
 *
 * @param base64Map  - Map of `key -> CSS cursor data URL`.
 * @param outputPath - Absolute path to the output `.ts` file.
 * @returns Sorted array of export identifiers written to the file.
 */
export async function generateCodeStream(
  base64Map: Map<string, string>,
  outputPath: string
): Promise<string[]> {
  const stream = fs.createWriteStream(outputPath, { flags: 'w' });

  stream.write(`// Auto-generated OSRS Icon definitions\n\n`);

  const usedNames = new Set<string>();
  const sortedNames: string[] = [];
  const sortedKeys = Array.from(base64Map.keys()).sort();

  for (const title of sortedKeys) {
    const dataUrl = base64Map.get(title)!;

    let varName = sanitiseVariableName(title);

    if (/^\d/.test(varName) || varName.length === 0) {
      varName = '_' + varName;
    }

    let finalName = varName;
    let counter = 1;
    while (usedNames.has(finalName)) {
      finalName = `${varName}_${counter}`;
      counter++;
    }
    usedNames.add(finalName);
    sortedNames.push(finalName);

    const line = `export const ${finalName} = "${dataUrl}";\n`;
    if (!stream.write(line)) {
      await new Promise<void>((resolve) => stream.once('drain', resolve));
    }
  }

  stream.end();
  await new Promise<void>((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  return sortedNames;
}

/**
 * Writes a metadata TypeScript file containing a sorted array of all icon
 * export names and a union type for type-safe dynamic lookups.
 *
 * @param names      - Sorted array of export identifiers from {@link generateCodeStream}.
 * @param outputPath - Absolute path to the output `.ts` file.
 * @param typeName   - The name of the exported union type (e.g. `"IconName"`).
 * @param arrayName  - The name of the exported const array (e.g. `"iconNames"`).
 */
export async function generateMetaFile(
  names: string[],
  outputPath: string,
  arrayName: string = 'iconNames',
  typeName: string = 'IconName'
): Promise<void> {
  const stream = fs.createWriteStream(outputPath, { flags: 'w' });

  stream.write('// Auto-generated OSRS Icon metadata\n\n');
  stream.write(`export const ${arrayName} = [\n`);

  for (const name of names) {
    const line = `  '${name}',\n`;
    if (!stream.write(line)) {
      await new Promise<void>((resolve) => stream.once('drain', resolve));
    }
  }

  stream.write('] as const;\n\n');
  stream.write(`export type ${typeName} = (typeof ${arrayName})[number];\n`);

  stream.end();
  await new Promise<void>((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

/**
 * Loads the set of export names from the main icons file (`icons.ts`) by
 * importing it at runtime. Used by the category icons script to detect
 * cross-file name collisions before code generation.
 *
 * @returns A set of every export identifier in `src/generated/icons.ts`.
 */
export async function loadMainIconExports(): Promise<Map<string, string>> {
  const iconsModule = await import('../src/generated/icons');
  const exports = new Map<string, string>();
  for (const [key, value] of Object.entries(iconsModule)) {
    if (typeof value === 'string') {
      exports.set(key, value);
    }
  }
  return exports;
}
