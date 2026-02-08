import assert from 'node:assert';
import {
    sharkPack,
    herringPack,
    anglerfishPack,
    dragonDaggerPack,
    goldPack,
    ironPack,
    coinsPack,
    bucketPack,
} from './packs';

// ── Helper ─────────────────────────────────────────────────────────

function assertIsCursorString(value: unknown, label: string): void {
    assert.strictEqual(typeof value, 'string', `${label} should be a string`);
    assert.ok(
        (value as string).startsWith("url('data:image/png;base64,"),
        `${label} should start with url('data:image/png;base64,...')`
    );
    assert.ok(
        (value as string).endsWith("'), auto"),
        `${label} should end with '), auto`
    );
}

// ── Fish Packs ─────────────────────────────────────────────────────

function testSharkPackHasCorrectKeys(): void {
    const keys = Object.keys(sharkPack);
    assert.deepStrictEqual(keys, ['raw', 'cooked', 'burnt']);
    console.log('✓ sharkPack: has raw, cooked, burnt keys');
}

function testSharkPackValuesAreCursorStrings(): void {
    assertIsCursorString(sharkPack.raw, 'sharkPack.raw');
    assertIsCursorString(sharkPack.cooked, 'sharkPack.cooked');
    assertIsCursorString(sharkPack.burnt, 'sharkPack.burnt');
    console.log('✓ sharkPack: all values are valid cursor strings');
}

function testHerringPackHasErrorAlias(): void {
    const keys = Object.keys(herringPack);
    assert.deepStrictEqual(keys, ['raw', 'cooked', 'burnt', 'error']);
    assertIsCursorString(herringPack.error, 'herringPack.error');
    console.log('✓ herringPack: has error alias (red herring)');
}

function testAnglerfishPackHasCorrectKeys(): void {
    const keys = Object.keys(anglerfishPack);
    assert.deepStrictEqual(keys, ['raw', 'cooked', 'burnt']);
    assertIsCursorString(anglerfishPack.cooked, 'anglerfishPack.cooked');
    console.log('✓ anglerfishPack: has raw, cooked, burnt keys');
}

// ── Weapon Packs ───────────────────────────────────────────────────

function testDragonDaggerPackHasAllVariants(): void {
    const keys = Object.keys(dragonDaggerPack);
    assert.deepStrictEqual(keys, ['base', 'poisoned', 'poisonedPlus', 'poisonedPlusPlus']);
    assertIsCursorString(dragonDaggerPack.base, 'dragonDaggerPack.base');
    assertIsCursorString(dragonDaggerPack.poisonedPlusPlus, 'dragonDaggerPack.poisonedPlusPlus');
    console.log('✓ dragonDaggerPack: has all poison variants');
}

// ── Ore Packs ──────────────────────────────────────────────────────

function testGoldPackHasOreAndBar(): void {
    assert.deepStrictEqual(Object.keys(goldPack), ['ore', 'bar']);
    assertIsCursorString(goldPack.ore, 'goldPack.ore');
    assertIsCursorString(goldPack.bar, 'goldPack.bar');
    console.log('✓ goldPack: has ore and bar');
}

function testIronPackHasOreAndBar(): void {
    assert.deepStrictEqual(Object.keys(ironPack), ['ore', 'bar']);
    assertIsCursorString(ironPack.ore, 'ironPack.ore');
    assertIsCursorString(ironPack.bar, 'ironPack.bar');
    console.log('✓ ironPack: has ore and bar');
}

// ── Progression Packs ──────────────────────────────────────────────

function testCoinsPackHasStagesArray(): void {
    assert.ok(Array.isArray(coinsPack.stages), 'stages should be an array');
    assert.strictEqual(coinsPack.stages.length, 10, 'should have 10 coin stages');
    for (const stage of coinsPack.stages) {
        assertIsCursorString(stage, 'coinsPack.stages entry');
    }
    console.log('✓ coinsPack: stages array has 10 valid cursor strings');
}

function testCoinsPackStagesAreOrderedByValue(): void {
    assert.strictEqual(coinsPack.stages[0], coinsPack._1);
    assert.strictEqual(coinsPack.stages[9], coinsPack._10000);
    console.log('✓ coinsPack: stages[0] is _1, stages[9] is _10000');
}

function testBucketPackHasStagesArray(): void {
    assert.ok(Array.isArray(bucketPack.stages), 'stages should be an array');
    assert.strictEqual(bucketPack.stages.length, 6, 'should have 6 bucket stages');
    for (const stage of bucketPack.stages) {
        assertIsCursorString(stage, 'bucketPack.stages entry');
    }
    console.log('✓ bucketPack: stages array has 6 valid cursor strings');
}

function testBucketPackStagesAreOrderedEmptyToFull(): void {
    assert.strictEqual(bucketPack.stages[0], bucketPack.empty);
    assert.strictEqual(bucketPack.stages[5], bucketPack.full);
    console.log('✓ bucketPack: stages[0] is empty, stages[5] is full');
}

function testAllPackValuesAreDistinct(): void {
    const allValues = [
        ...Object.values(sharkPack),
        ...Object.values(herringPack),
        ...Object.values(anglerfishPack),
    ];
    const uniqueValues = new Set(allValues);
    assert.strictEqual(uniqueValues.size, allValues.length, 'all fish pack values should be distinct');
    console.log('✓ fish packs: all values across packs are distinct');
}

// ── Runner ─────────────────────────────────────────────────────────

console.log('\nRunning packs tests...\n');

testSharkPackHasCorrectKeys();
testSharkPackValuesAreCursorStrings();
testHerringPackHasErrorAlias();
testAnglerfishPackHasCorrectKeys();
testDragonDaggerPackHasAllVariants();
testGoldPackHasOreAndBar();
testIronPackHasOreAndBar();
testCoinsPackHasStagesArray();
testCoinsPackStagesAreOrderedByValue();
testBucketPackHasStagesArray();
testBucketPackStagesAreOrderedEmptyToFull();
testAllPackValuesAreDistinct();

console.log('\nAll packs tests passed!\n');
