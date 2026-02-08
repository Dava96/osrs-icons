import assert from 'node:assert';
import { coinsPack, bucketPack, runePack, allPacks } from './packs';

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

// ── runePack tests ─────────────────────────────────────────────────

function testRunePackHasAllRunes(): void {
    const keys = Object.keys(runePack).filter((k) => k !== 'stages');
    assert.deepStrictEqual(keys, [
        'air', 'fire', 'water', 'earth', 'chaos', 'mind', 'death', 'law', 'nature', 'body',
    ]);
    console.log('✓ runePack: has all 10 rune keys');
}

function testRunePackAllValuesAreValidCursorStrings(): void {
    for (const [key, value] of Object.entries(runePack)) {
        if (key === 'stages') continue;
        assert.ok(
            typeof value === 'string' && (value as string).startsWith("url('data:image/png;base64,"),
            `runePack.${key} should be a valid cursor string`,
        );
    }
    console.log('✓ runePack: all values are valid cursor strings');
}

function testRunePackStagesArrayHas10Entries(): void {
    assert.strictEqual(runePack.stages.length, 10);
    assert.ok(runePack.stages[0] === runePack.air, 'stages[0] should be air');
    assert.ok(runePack.stages[9] === runePack.body, 'stages[9] should be body');
    console.log('✓ runePack: stages array has 10 entries');
}

// ── allPacks registry tests ────────────────────────────────────────

function testAllPacksRegistryIsNonEmpty(): void {
    assert.ok(allPacks.length > 0, 'allPacks should have at least one entry');
    console.log(`✓ allPacks: registry has ${allPacks.length} entries`);
}

function testAllPacksEntriesHaveRequiredFields(): void {
    for (const pack of allPacks) {
        assert.ok(pack.name.length > 0, `pack "${pack.importName}" must have a name`);
        assert.ok(pack.importName.length > 0, 'pack must have an importName');
        assert.ok(pack.description.length > 0, `pack "${pack.importName}" must have a description`);
        assert.ok(pack.stages.length >= 2, `pack "${pack.importName}" must have at least 2 stages`);
        assert.strictEqual(
            pack.stageLabels.length,
            pack.stages.length,
            `pack "${pack.importName}" stageLabels length must match stages length`,
        );
    }
    console.log('✓ allPacks: all entries have required fields with matching label/stage counts');
}

function testAllPacksStagesAreValidCursorStrings(): void {
    for (const pack of allPacks) {
        for (const cursor of pack.stages) {
            assert.ok(
                typeof cursor === 'string' && cursor.startsWith("url('data:image/png;base64,"),
                `pack "${pack.importName}" has an invalid cursor string`,
            );
        }
    }
    console.log('✓ allPacks: all stages are valid cursor strings');
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
testRunePackHasAllRunes();
testRunePackAllValuesAreValidCursorStrings();
testRunePackStagesArrayHas10Entries();
testAllPacksRegistryIsNonEmpty();
testAllPacksEntriesHaveRequiredFields();
testAllPacksStagesAreValidCursorStrings();

console.log('\nAll packs tests passed!\n');

