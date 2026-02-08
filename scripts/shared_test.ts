import assert from 'node:assert';
import { sanitiseVariableName, hashUrl, limitConcurrency, RESERVED_WORDS } from './shared';

// ── sanitiseVariableName ───────────────────────────────────────────

/** Data provider of title → expected variable name pairs. */
const SANITISE_CASES: [string, string][] = [
    ['Abyssal whip', 'abyssalWhip'],
    ['Dragon scimitar', 'dragonScimitar'],
    ['3rd age amulet', '3rdAgeAmulet'],
    ['1/2 anchovy pizza', '12AnchovyPizza'],
    ['Coins (100)', 'coins100'],
    ['Ring of wealth (+5)', 'ringOfWealthPlus5'],
    ['Saradomin & Zamorak', 'saradominAndZamorak'],
    ["Bob's axe", 'bobsAxe'],
    ['Combat icon', 'combatIcon'],
    ['Free-to-play icon', 'freeToPlayIcon'],
    ['Magic Damage icon', 'magicDamageIcon'],
    ['Equipment_slot_icon', 'equipmentSlotIcon'],
    ['', ''],
];

function testSanitiseVariableNameDataProvider(): void {
    for (const [input, expected] of SANITISE_CASES) {
        const result = sanitiseVariableName(input);
        assert.strictEqual(
            result,
            expected,
            `sanitiseVariableName("${input}") should return "${expected}", got "${result}"`
        );
    }
    console.log(`✓ sanitiseVariableName: ${SANITISE_CASES.length} cases passed`);
}

function testSanitiseReservedWordsArePrefixed(): void {
    for (const word of ['class', 'return', 'delete', 'void', 'yield']) {
        const result = sanitiseVariableName(word);
        assert.strictEqual(
            result,
            `_${word}`,
            `Reserved word "${word}" should be prefixed with underscore`
        );
    }
    console.log('✓ sanitiseVariableName: reserved words are prefixed with underscore');
}

function testReservedWordsSetIsPopulated(): void {
    assert.ok(RESERVED_WORDS.size > 0, 'RESERVED_WORDS should not be empty');
    assert.ok(RESERVED_WORDS.has('class'), 'RESERVED_WORDS should contain "class"');
    assert.ok(RESERVED_WORDS.has('return'), 'RESERVED_WORDS should contain "return"');
    assert.ok(!RESERVED_WORDS.has('foobar'), 'RESERVED_WORDS should not contain "foobar"');
    console.log(`✓ RESERVED_WORDS: contains ${RESERVED_WORDS.size} entries`);
}

// ── hashUrl ────────────────────────────────────────────────────────

function testHashUrlProducesDeterministicOutput(): void {
    const url = 'https://oldschool.runescape.wiki/images/Abyssal_whip.png';
    const hash1 = hashUrl(url);
    const hash2 = hashUrl(url);
    assert.strictEqual(hash1, hash2, 'hashUrl should return the same hash for the same URL');
    assert.strictEqual(hash1.length, 32, 'MD5 hex digest should be 32 characters');
    console.log('✓ hashUrl: produces deterministic 32-char MD5 digest');
}

function testHashUrlDifferentUrlsProduceDifferentHashes(): void {
    const hash1 = hashUrl('https://example.com/a.png');
    const hash2 = hashUrl('https://example.com/b.png');
    assert.notStrictEqual(hash1, hash2, 'Different URLs should produce different hashes');
    console.log('✓ hashUrl: different URLs produce different hashes');
}

// ── limitConcurrency ───────────────────────────────────────────────

async function testLimitConcurrencyReturnsAllResults(): Promise<void> {
    const tasks = [1, 2, 3, 4, 5].map(
        (n) => () => new Promise<number>((resolve) => setTimeout(() => resolve(n), 10))
    );
    const results = await limitConcurrency(tasks, 2);
    assert.strictEqual(results.length, 5, 'Should return 5 results');
    const sorted = [...results].sort((a, b) => a - b);
    assert.deepStrictEqual(sorted, [1, 2, 3, 4, 5], 'Should contain all input values');
    console.log('✓ limitConcurrency: returns all results with limited concurrency');
}

async function testLimitConcurrencyRespectsLimit(): Promise<void> {
    let maxConcurrent = 0;
    let currentConcurrent = 0;
    const limit = 3;

    const tasks = Array.from({ length: 10 }, () => async () => {
        currentConcurrent++;
        maxConcurrent = Math.max(maxConcurrent, currentConcurrent);
        await new Promise((resolve) => setTimeout(resolve, 20));
        currentConcurrent--;
    });

    await limitConcurrency(tasks, limit);
    assert.ok(
        maxConcurrent <= limit,
        `Max concurrent (${maxConcurrent}) should not exceed limit (${limit})`
    );
    console.log(`✓ limitConcurrency: respects concurrency limit (max was ${maxConcurrent})`);
}

async function testLimitConcurrencyHandlesEmptyPool(): Promise<void> {
    const results = await limitConcurrency([], 5);
    assert.deepStrictEqual(results, [], 'Empty pool should return empty results');
    console.log('✓ limitConcurrency: handles empty task pool');
}

// ── Runner ─────────────────────────────────────────────────────────

async function run(): Promise<void> {
    console.log('\nRunning shared.ts tests...\n');

    testSanitiseVariableNameDataProvider();
    testSanitiseReservedWordsArePrefixed();
    testReservedWordsSetIsPopulated();
    testHashUrlProducesDeterministicOutput();
    testHashUrlDifferentUrlsProduceDifferentHashes();
    await testLimitConcurrencyReturnsAllResults();
    await testLimitConcurrencyRespectsLimit();
    await testLimitConcurrencyHandlesEmptyPool();

    console.log('\nAll shared.ts tests passed!\n');
}

run().catch((error) => {
    console.error('Test failure:', error);
    process.exit(1);
});
