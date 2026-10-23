import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate HTML IDs');
for (const [, reference] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  if (reference.startsWith('#')) assert.ok(ids.includes(reference.slice(1)), `Missing anchor ${reference}`);
  else if (!/^(?:https?:|mailto:|tel:)/.test(reference)) assert.ok(fs.existsSync(path.join(root, reference)), `Missing asset ${reference}`);
}
for (const [, asset] of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) assert.ok(fs.existsSync(path.join(root, asset)), `Missing CSS asset ${asset}`);
assert.ok(!/href="#"/.test(html), 'Placeholder link');
assert.ok(html.includes('Not an official website.'), 'Missing concept disclosure');
assert.ok(html.includes('https://www.instagram.com/c.cvaleting/'), 'Missing verified contact');
console.log('Passed: assets, anchors, unique IDs, contact links and demo disclosure.');
