import assert from 'node:assert';
import { animateCursor } from './animateCursor';
import type { AnimateCursorOptions } from './animateCursor';

// ── animateCursor tests (Node.js — no DOM) ──────────────────────────

function testAnimateCursorIsExported(): void {
    assert.strictEqual(typeof animateCursor, 'function');
    console.log('✓ animateCursor: is a function export');
}

function testAnimateCursorThrowsOnFewerThanTwoFrames(): void {
    assert.throws(
        () => animateCursor([]),
        /at least 2 frames/,
        'should throw for empty frames',
    );
    assert.throws(
        () => animateCursor(['single-frame']),
        /at least 2 frames/,
        'should throw for single frame',
    );
    console.log('✓ animateCursor: throws on fewer than 2 frames');
}

function testAnimateCursorReturnsCleanupInNode(): void {
    // In Node.js (no document), animateCursor should return a no-op function
    const cleanup = animateCursor(['frame-a', 'frame-b']);
    assert.strictEqual(typeof cleanup, 'function', 'should return a cleanup function');
    cleanup(); // should not throw
    console.log('✓ animateCursor: returns no-op cleanup function in Node.js');
}

function testAnimateCursorOptionsTypeIsUsable(): void {
    const options: AnimateCursorOptions = {
        duration: 500,
        iterations: 3,
    };
    const cleanup = animateCursor(['frame-a', 'frame-b', 'frame-c'], options);
    assert.strictEqual(typeof cleanup, 'function');
    cleanup();
    console.log('✓ AnimateCursorOptions: type is exported and usable');
}

function testAnimateCursorAcceptsInfiniteIterations(): void {
    const cleanup = animateCursor(['frame-a', 'frame-b'], { iterations: Infinity });
    assert.strictEqual(typeof cleanup, 'function');
    cleanup();
    console.log('✓ animateCursor: accepts Infinity iterations without error');
}

function testAnimateCursorAcceptsCustomDuration(): void {
    const cleanup = animateCursor(['frame-a', 'frame-b'], { duration: 2500 });
    assert.strictEqual(typeof cleanup, 'function');
    cleanup();
    console.log('✓ animateCursor: accepts custom duration without error');
}

// ── Runner ─────────────────────────────────────────────────────────

console.log('\nRunning animateCursor tests...\n');

testAnimateCursorIsExported();
testAnimateCursorThrowsOnFewerThanTwoFrames();
testAnimateCursorReturnsCleanupInNode();
testAnimateCursorOptionsTypeIsUsable();
testAnimateCursorAcceptsInfiniteIterations();
testAnimateCursorAcceptsCustomDuration();

console.log('\nAll animateCursor tests passed!\n');
