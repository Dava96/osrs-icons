import assert from 'node:assert';
import { flipCursor } from './flip';

// ── flipCursor tests (Node.js — no Canvas API) ────────────────────

function testFlipCursorIsExported(): void {
  assert.strictEqual(typeof flipCursor, 'function');
  console.log('✓ flipCursor: is a function export');
}

// ── Single string overload ─────────────────────────────────────────

async function testFlipCursorFallsBackInNode(): Promise<void> {
  const input = "url('data:image/png;base64,abc123'), auto";
  const result = await flipCursor(input);
  assert.strictEqual(result, input, 'should return original in non-browser environment');
  console.log('✓ flipCursor(string): returns original value in Node.js (no Canvas)');
}

async function testFlipCursorHandlesPlainString(): Promise<void> {
  const input = 'not-a-cursor-value';
  const result = await flipCursor(input);
  assert.strictEqual(result, input, 'should return as-is when no url() pattern');
  console.log('✓ flipCursor(string): returns plain strings unchanged');
}

async function testFlipCursorReturnsSamePromiseType(): Promise<void> {
  const input = "url('data:image/png;base64,test'), auto";
  const result = flipCursor(input);
  assert.ok(result instanceof Promise, 'should return a Promise');
  console.log('✓ flipCursor(string): returns a Promise');
}

// ── Array overload ─────────────────────────────────────────────────

async function testFlipCursorAcceptsArray(): Promise<void> {
  const cursors = [
    "url('data:image/png;base64,aaa'), auto",
    "url('data:image/png;base64,bbb'), auto",
    "url('data:image/png;base64,ccc'), auto",
  ];
  const result = await flipCursor(cursors);
  assert.ok(Array.isArray(result), 'should return an array');
  assert.strictEqual(result.length, 3, 'should have same length as input');
  for (let i = 0; i < cursors.length; i++) {
    assert.strictEqual(result[i], cursors[i], `element ${i} should match (Node.js passthrough)`);
  }
  console.log('✓ flipCursor(string[]): returns array of same length in Node.js');
}

async function testFlipCursorArrayHandlesEmptyArray(): Promise<void> {
  const result = await flipCursor([]);
  assert.ok(Array.isArray(result), 'should return an array');
  assert.strictEqual(result.length, 0, 'should be empty');
  console.log('✓ flipCursor(string[]): handles empty array');
}

// ── Record (pack) overload ─────────────────────────────────────────

async function testFlipCursorAcceptsRecord(): Promise<void> {
  const pack = {
    base: "url('data:image/png;base64,xxx'), auto",
    alt: "url('data:image/png;base64,yyy'), auto",
  };
  const result = await flipCursor(pack);
  assert.strictEqual(typeof result, 'object', 'should return an object');
  assert.ok(!Array.isArray(result), 'should not be an array');
  assert.deepStrictEqual(Object.keys(result), ['base', 'alt'], 'should preserve keys');
  assert.strictEqual(result.base, pack.base, 'base should match (Node.js passthrough)');
  assert.strictEqual(result.alt, pack.alt, 'alt should match (Node.js passthrough)');
  console.log('✓ flipCursor(Record): returns object with same keys in Node.js');
}

async function testFlipCursorRecordPreservesNonStringValues(): Promise<void> {
  const pack = {
    base: "url('data:image/png;base64,xxx'), auto",
    stages: ["url('data:image/png;base64,aaa'), auto", "url('data:image/png;base64,bbb'), auto"],
  };
  const result = (await flipCursor(pack)) as Record<string, unknown>;
  assert.strictEqual(typeof result.base, 'string', 'string values should remain strings');
  assert.ok(Array.isArray(result.stages), 'array values should remain arrays');
  assert.strictEqual((result.stages as string[]).length, 2, 'array length should be preserved');
  console.log('✓ flipCursor(Record): flips string values and string arrays, preserves structure');
}

// ── Runner ─────────────────────────────────────────────────────────

console.log('\nRunning flip tests...\n');

testFlipCursorIsExported();

(async () => {
  await testFlipCursorFallsBackInNode();
  await testFlipCursorHandlesPlainString();
  await testFlipCursorReturnsSamePromiseType();
  await testFlipCursorAcceptsArray();
  await testFlipCursorArrayHandlesEmptyArray();
  await testFlipCursorAcceptsRecord();
  await testFlipCursorRecordPreservesNonStringValues();

  console.log('\nAll flip tests passed!\n');
})();
