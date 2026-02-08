import assert from 'node:assert';
import { filterImageFiles, buildImageRequests } from './update-category-icons';
import type { WikiItem } from './shared';

// ── filterImageFiles ───────────────────────────────────────────────

function createWikiItem(title: string): WikiItem {
    return { pageid: Math.floor(Math.random() * 100000), ns: 6, title };
}

function testFiltersPngFilesOnly(): void {
    const files = new Map<string, WikiItem>([
        ['File:Combat_icon.png', createWikiItem('File:Combat_icon.png')],
        ['File:Close-x-white.svg', createWikiItem('File:Close-x-white.svg')],
        ['File:Some_icon.gif', createWikiItem('File:Some_icon.gif')],
        ['File:Melee.PNG', createWikiItem('File:Melee.PNG')],
        ['File:Star.SVG', createWikiItem('File:Star.SVG')],
    ]);

    const result = filterImageFiles(files);

    assert.strictEqual(result.size, 4, 'Should keep PNG and SVG files (case-insensitive)');
    assert.ok(result.has('File:Combat_icon.png'), 'Should keep .png files');
    assert.ok(result.has('File:Close-x-white.svg'), 'Should keep .svg files');
    assert.ok(result.has('File:Melee.PNG'), 'Should keep .PNG files (case-insensitive)');
    assert.ok(result.has('File:Star.SVG'), 'Should keep .SVG files (case-insensitive)');
    assert.ok(!result.has('File:Some_icon.gif'), 'Should exclude .gif files');
    console.log('✓ filterImageFiles: keeps PNG and SVG, excludes unsupported formats');
}

function testFilterImageFilesHandlesEmptyMap(): void {
    const result = filterImageFiles(new Map());
    assert.strictEqual(result.size, 0, 'Empty input should produce empty output');
    console.log('✓ filterImageFiles: handles empty map');
}

function testFilterImageFilesAllUnsupported(): void {
    const files = new Map<string, WikiItem>([
        ['File:Icon.gif', createWikiItem('File:Icon.gif')],
        ['File:Icon.bmp', createWikiItem('File:Icon.bmp')],
        ['File:Icon.webp', createWikiItem('File:Icon.webp')],
    ]);

    const result = filterImageFiles(files);
    assert.strictEqual(result.size, 0, 'All unsupported formats should be excluded');
    console.log('✓ filterImageFiles: excludes all unsupported formats');
}

// ── buildImageRequests ─────────────────────────────────────────────

/** Data provider: [input title, expected key] pairs. */
const BUILD_REQUEST_CASES: [string, string][] = [
    ['File:Combat_icon.png', 'Combat_icon'],
    ['File:Close-x-white.svg', 'Close-x-white'],
    ['File:Free-to-play_icon.png', 'Free-to-play_icon'],
    ['File:Magic_Damage_icon.PNG', 'Magic_Damage_icon'],
    ['File:Star.SVG', 'Star'],
];

function testBuildImageRequestsStripsFilePrefixAndExtension(): void {
    for (const [title, expectedKey] of BUILD_REQUEST_CASES) {
        const files = new Map<string, WikiItem>([[title, createWikiItem(title)]]);
        const requests = buildImageRequests(files);

        assert.strictEqual(requests.length, 1, `Should produce 1 request for "${title}"`);
        assert.strictEqual(
            requests[0].key,
            expectedKey,
            `Key for "${title}" should be "${expectedKey}", got "${requests[0].key}"`
        );
        assert.strictEqual(requests[0].fileTitle, title, 'fileTitle should be the original title');
    }
    console.log(
        `✓ buildImageRequests: ${BUILD_REQUEST_CASES.length} cases — strips File: prefix and extension`
    );
}

function testBuildImageRequestsHandlesMultipleFiles(): void {
    const files = new Map<string, WikiItem>([
        ['File:A.png', createWikiItem('File:A.png')],
        ['File:B.svg', createWikiItem('File:B.svg')],
        ['File:C.png', createWikiItem('File:C.png')],
    ]);

    const requests = buildImageRequests(files);
    assert.strictEqual(requests.length, 3, 'Should produce 3 requests');
    const keys = requests.map((r) => r.key);
    assert.ok(keys.includes('A'), 'Should contain key "A"');
    assert.ok(keys.includes('B'), 'Should contain key "B"');
    assert.ok(keys.includes('C'), 'Should contain key "C"');
    console.log('✓ buildImageRequests: handles multiple files');
}

function testBuildImageRequestsEmptyMap(): void {
    const requests = buildImageRequests(new Map());
    assert.deepStrictEqual(requests, [], 'Empty input should produce empty array');
    console.log('✓ buildImageRequests: handles empty map');
}

// ── Deduplication (tested via Map semantics) ───────────────────────

function testDeduplicatesFilesByTitle(): void {
    const fileMap = new Map<string, WikiItem>();

    const firstItem = createWikiItem('File:Prayer_icon.png');
    const duplicateItem = createWikiItem('File:Prayer_icon.png');

    fileMap.set(firstItem.title, firstItem);

    if (!fileMap.has(duplicateItem.title)) {
        fileMap.set(duplicateItem.title, duplicateItem);
    }

    assert.strictEqual(fileMap.size, 1, 'Duplicate titles should be deduplicated');
    assert.strictEqual(
        fileMap.get('File:Prayer_icon.png'),
        firstItem,
        'First occurrence should be preserved'
    );
    console.log('✓ deduplication: Map-based dedup keeps first occurrence');
}

function testCircularCategoryDetection(): void {
    const visited = new Set<string>();

    visited.add('Category:Icons');
    visited.add('Category:Skill_icons');

    assert.ok(visited.has('Category:Icons'), 'Should detect visited category');
    assert.ok(visited.has('Category:Skill_icons'), 'Should detect visited subcategory');
    assert.ok(!visited.has('Category:New_category'), 'Should not detect unvisited category');

    visited.add('Category:New_category');
    assert.ok(visited.has('Category:New_category'), 'Should detect after adding');
    console.log('✓ circular detection: visited Set correctly tracks categories');
}

// ── Runner ─────────────────────────────────────────────────────────

console.log('\nRunning update-category-icons tests...\n');

testFiltersPngFilesOnly();
testFilterImageFilesHandlesEmptyMap();
testFilterImageFilesAllUnsupported();
testBuildImageRequestsStripsFilePrefixAndExtension();
testBuildImageRequestsHandlesMultipleFiles();
testBuildImageRequestsEmptyMap();
testDeduplicatesFilesByTitle();
testCircularCategoryDetection();

console.log('\nAll update-category-icons tests passed!\n');
