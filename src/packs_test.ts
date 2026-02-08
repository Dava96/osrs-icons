import assert from 'node:assert';
import { coinsPack, bucketPack } from './packs';

// ── Packs tests ────────────────────────────────────────────────────

function testCoinsPackHasAllDenominations(): void {
    const keys = Object.keys(coinsPack).filter((k) => k !== 'stages');
    assert.deepStrictEqual(keys, [
        '_1', '_2', '_3', '_4', '_5', '_25', '_100', '_250', '_1000', '_10000',
    ]);
    console.log('✓ coinsPack: has all denomination keys');
}

function testCoinsPackAllValuesAreValidCursorStrings(): void {
    for (const [key, value] of Object.entries(coinsPack)) {
        if (key === 'stages') continue;
        assert.ok(
            typeof value === 'string' && (value as string).startsWith("url('data:image/png;base64,"),
            `coinsPack.${key} should be a valid cursor string`,
        );
    }
    console.log('✓ coinsPack: all values are valid cursor strings');
}

function testCoinsPackStagesArrayHas10Entries(): void {
    assert.strictEqual(coinsPack.stages.length, 10);
    assert.ok(coinsPack.stages[0] === coinsPack._1, 'stages[0] should be _1');
    assert.ok(coinsPack.stages[9] === coinsPack._10000, 'stages[9] should be _10000');
    console.log('✓ coinsPack: stages array has 10 valid cursor strings');
}

function testBucketPackHasAllStages(): void {
    const keys = Object.keys(bucketPack).filter((k) => k !== 'stages');
    assert.deepStrictEqual(keys, [
        'empty', 'fifth', 'twoFifths', 'threeFifths', 'fourFifths', 'full',
    ]);
    console.log('✓ bucketPack: has all stage keys');
}

function testBucketPackAllValuesAreValidCursorStrings(): void {
    for (const [key, value] of Object.entries(bucketPack)) {
        if (key === 'stages') continue;
        assert.ok(
            typeof value === 'string' && (value as string).startsWith("url('data:image/png;base64,"),
            `bucketPack.${key} should be a valid cursor string`,
        );
    }
    console.log('✓ bucketPack: all values are valid cursor strings');
}

function testBucketPackStagesArrayHas6Entries(): void {
    assert.strictEqual(bucketPack.stages.length, 6);
    assert.ok(bucketPack.stages[0] === bucketPack.empty, 'stages[0] should be empty');
    assert.ok(bucketPack.stages[5] === bucketPack.full, 'stages[5] should be full');
    console.log('✓ bucketPack: stages array has 6 valid cursor strings');
}

function testPackValuesDoNotOverlap(): void {
    const coinValues = new Set(
        Object.entries(coinsPack)
            .filter(([k]) => k !== 'stages')
            .map(([, v]) => v as string),
    );
    const bucketValues = Object.entries(bucketPack)
        .filter(([k]) => k !== 'stages')
        .map(([, v]) => v as string);

    const overlap = bucketValues.filter((v) => coinValues.has(v));
    assert.strictEqual(overlap.length, 0, 'coin and bucket packs should not share values');
    console.log('✓ packs: coin and bucket values do not overlap');
}

// ── Runner ─────────────────────────────────────────────────────────

console.log('\nRunning packs tests...\n');

testCoinsPackHasAllDenominations();
testCoinsPackAllValuesAreValidCursorStrings();
testCoinsPackStagesArrayHas10Entries();
testBucketPackHasAllStages();
testBucketPackAllValuesAreValidCursorStrings();
testBucketPackStagesArrayHas6Entries();
testPackValuesDoNotOverlap();

console.log('\nAll packs tests passed!\n');
