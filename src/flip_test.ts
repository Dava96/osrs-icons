import assert from 'node:assert';
import { flipCursor } from './flip';

// ── flipCursor tests (Node.js — no Canvas API) ────────────────────

function testFlipCursorIsExported(): void {
    assert.strictEqual(typeof flipCursor, 'function');
    console.log('✓ flipCursor: is a function export');
}

async function testFlipCursorFallsBackInNode(): Promise<void> {
    const input = "url('data:image/png;base64,abc123'), auto";
    const result = await flipCursor(input);
    assert.strictEqual(result, input, 'should return original in non-browser environment');
    console.log('✓ flipCursor: returns original value in Node.js (no Canvas)');
}

async function testFlipCursorHandlesPlainString(): Promise<void> {
    const input = 'not-a-cursor-value';
    const result = await flipCursor(input);
    assert.strictEqual(result, input, 'should return as-is when no url() pattern');
    console.log('✓ flipCursor: returns plain strings unchanged');
}

async function testFlipCursorReturnsSamePromiseType(): Promise<void> {
    const input = "url('data:image/png;base64,test'), auto";
    const result = flipCursor(input);
    assert.ok(result instanceof Promise, 'should return a Promise');
    console.log('✓ flipCursor: returns a Promise');
}

// ── Runner ─────────────────────────────────────────────────────────

console.log('\nRunning flip tests...\n');

testFlipCursorIsExported();

(async () => {
    await testFlipCursorFallsBackInNode();
    await testFlipCursorHandlesPlainString();
    await testFlipCursorReturnsSamePromiseType();

    console.log('\nAll flip tests passed!\n');
})();
