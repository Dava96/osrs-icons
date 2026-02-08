import assert from 'node:assert';
import { applyCursors } from './applyCursors';
import type { CursorMapping, CursorState } from './applyCursors';

// ── applyCursors tests (Node.js — no DOM) ──────────────────────────

function testApplyCursorsIsExported(): void {
  assert.strictEqual(typeof applyCursors, 'function');
  console.log('✓ applyCursors: is a function export');
}

function testApplyCursorsReturnsCleanupInNode(): void {
  const cleanup = applyCursors({ default: 'test-cursor' });
  assert.strictEqual(typeof cleanup, 'function', 'should return a cleanup function');
  cleanup();
  console.log('✓ applyCursors: returns no-op cleanup function in Node.js');
}

function testCursorStateTypeIsExported(): void {
  const validStates: CursorState[] = [
    'default',
    'pointer',
    'wait',
    'text',
    'move',
    'crosshair',
    'grab',
    'grabbing',
    'not-allowed',
    'help',
  ];
  assert.ok(validStates.length > 0, 'CursorState type should compile');
  console.log('✓ CursorState: type is exported and usable');
}

function testCursorMappingTypeAcceptsPartialStates(): void {
  const mapping: CursorMapping = {
    default: 'cursor-a',
    pointer: 'cursor-b',
  };
  assert.strictEqual(Object.keys(mapping).length, 2);
  console.log('✓ CursorMapping: accepts partial state mappings');
}

// ── Runner ─────────────────────────────────────────────────────────

console.log('\nRunning applyCursors tests...\n');

testApplyCursorsIsExported();
testApplyCursorsReturnsCleanupInNode();
testCursorStateTypeIsExported();
testCursorMappingTypeAcceptsPartialStates();

console.log('\nAll applyCursors tests passed!\n');
