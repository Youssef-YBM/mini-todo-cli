#!/usr/bin/env node
// Tiny todo list stored in a JSON file. Usage: node todo.js add "text" | list | done <id> | remove <id>
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

export function load(file) {
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : [];
}

export function add(items, text) {
  if (!text?.trim()) throw new Error('Todo text is required');
  const id = items.reduce((m, i) => Math.max(m, i.id), 0) + 1;
  return [...items, { id, text: text.trim(), done: false }];
}

export function complete(items, id) {
  if (!items.some((i) => i.id === id)) throw new Error(`No todo with id ${id}`);
  return items.map((i) => (i.id === id ? { ...i, done: true } : i));
}

export function remove(items, id) {
  if (!items.some((i) => i.id === id)) throw new Error(`No todo with id ${id}`);
  return items.filter((i) => i.id !== id);
}

export function format(items) {
  return items.length ? items.map((i) => `${i.done ? '[x]' : '[ ]'} ${i.id}. ${i.text}`).join('\n') : 'No todos yet.';
}

function main([cmd, arg]) {
  const file = process.env.TODO_FILE || 'todos.json';
  let items = load(file);
  if (cmd === 'add') items = add(items, arg);
  else if (cmd === 'done') items = complete(items, Number(arg));
  else if (cmd === 'remove') items = remove(items, Number(arg));
  else if (cmd !== 'list') return console.log('Usage: todo.js add "text" | list | done <id> | remove <id>');
  if (cmd !== 'list') writeFileSync(file, JSON.stringify(items, null, 2) + '\n');
  console.log(format(items));
}

if (import.meta.url === `file:///${process.argv[1]?.replace(/\\/g, '/')}`) main(process.argv.slice(2));
