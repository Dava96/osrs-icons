import { toDataUrl } from './index';
import { iconNames } from './generated/meta';
import assert from 'node:assert';

const VALID_CURSOR = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAA'), auto";
const EXPECTED_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAA';

// ── Single-value mode ──────────────────────────────────────────────

function testExtractsDataUrlFromValidCursorValue(): void {
  const result = toDataUrl(VALID_CURSOR);
  assert.strictEqual(result, EXPECTED_DATA_URL);
  console.log('✓ single: extracts data URL from a valid cursor value');
}

function testReturnsOriginalStringWhenNoUrlPatternFound(): void {
  const plainString = 'not-a-cursor-value';
  const result = toDataUrl(plainString);
  assert.strictEqual(result, plainString);
  console.log('✓ single: returns original string when no url() pattern found');
}

function testHandlesEmptyString(): void {
  const result = toDataUrl('');
  assert.strictEqual(result, '');
  console.log('✓ single: handles empty string gracefully');
}

function testExtractsFromMinimalUrlPattern(): void {
  const minimal = "url('https://example.com/icon.png'), auto";
  const result = toDataUrl(minimal);
  assert.strictEqual(result, 'https://example.com/icon.png');
  console.log('✓ single: extracts URL from minimal url() pattern');
}

function testDoesNotMatchDoubleQuotedUrls(): void {
  const doubleQuoted = 'url("data:image/png;base64,abc123"), auto';
  const result = toDataUrl(doubleQuoted);
  assert.strictEqual(result, doubleQuoted);
  console.log('✓ single: does not match double-quoted url() (single-quote only)');
}

// ── Batch mode ─────────────────────────────────────────────────────

function testBatchExtractsMultipleIcons(): void {
  const secondCursor = "url('data:image/png;base64,AAAA'), auto";
  const result = toDataUrl({
    first: VALID_CURSOR,
    second: secondCursor,
  });
  assert.deepStrictEqual(result, {
    first: EXPECTED_DATA_URL,
    second: 'data:image/png;base64,AAAA',
  });
  console.log('✓ batch: extracts data URLs from multiple icons');
}

function testBatchHandlesMixedValues(): void {
  const result = toDataUrl({
    valid: VALID_CURSOR,
    invalid: 'not-a-cursor',
  });
  assert.deepStrictEqual(result, {
    valid: EXPECTED_DATA_URL,
    invalid: 'not-a-cursor',
  });
  console.log('✓ batch: handles mixed valid and invalid values');
}

function testBatchHandlesEmptyObject(): void {
  const result = toDataUrl({});
  assert.deepStrictEqual(result, {});
  console.log('✓ batch: handles empty object');
}

// ── iconNames & IconName ───────────────────────────────────────────

function testIconNamesIsNonEmptyArray(): void {
  assert.ok(Array.isArray(iconNames), 'iconNames should be an array');
  assert.ok(iconNames.length > 0, 'iconNames should not be empty');
  console.log(`✓ iconNames: is a non-empty array (${iconNames.length} entries)`);
}

function testIconNamesContainsKnownIcons(): void {
  const knownIcons = ['abyssalWhip', '_24CaratSword', 'dragonScimitar'];
  for (const name of knownIcons) {
    assert.ok(
      (iconNames as readonly string[]).includes(name),
      `iconNames should contain "${name}"`
    );
  }
  console.log('✓ iconNames: contains known icon names');
}

function testIconNamesEntriesAreStrings(): void {
  const sample = iconNames.slice(0, 100);
  for (const name of sample) {
    assert.strictEqual(typeof name, 'string', `Expected string, got ${typeof name}`);
    assert.ok(name.length > 0, 'Icon name should not be empty');
  }
  console.log('✓ iconNames: all sampled entries are non-empty strings');
}

function testIconNamesIsSorted(): void {
  for (let i = 1; i < iconNames.length; i++) {
    assert.ok(
      iconNames[i] >= iconNames[i - 1],
      `iconNames[${i}] ("${iconNames[i]}") should come after iconNames[${i - 1}] ("${iconNames[i - 1]}")`
    );
  }
  console.log('✓ iconNames: is sorted alphabetically');
}

// ── Runner ─────────────────────────────────────────────────────────

console.log('\nRunning toDataUrl tests...\n');

testExtractsDataUrlFromValidCursorValue();
testReturnsOriginalStringWhenNoUrlPatternFound();
testHandlesEmptyString();
testExtractsFromMinimalUrlPattern();
testDoesNotMatchDoubleQuotedUrls();
testBatchExtractsMultipleIcons();
testBatchHandlesMixedValues();
testBatchHandlesEmptyObject();
testIconNamesIsNonEmptyArray();
testIconNamesContainsKnownIcons();
testIconNamesEntriesAreStrings();
testIconNamesIsSorted();

console.log('\nAll tests passed!\n');
