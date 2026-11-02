import { test } from 'node:test';
import assert from 'node:assert/strict';
import { add, complete, format } from './todo.js';

test('add assigns incrementing ids and trims text', () => {
  const items = add(add([], ' first '), 'second');
  assert.deepEqual(items.map((i) => [i.id, i.text]), [[1, 'first'], [2, 'second']]);
});

test('add rejects empty text', () => {
  assert.throws(() => add([], '   '), /required/);
});

test('complete marks one item and rejects unknown ids', () => {
  const items = complete(add([], 'a'), 1);
  assert.equal(items[0].done, true);
  assert.throws(() => complete(items, 9), /No todo/);
});

test('format renders checkboxes', () => {
  assert.equal(format(complete(add([], 'a'), 1)), '[x] 1. a');
  assert.equal(format([]), 'No todos yet.');
});
