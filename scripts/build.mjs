import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist');
await fs.mkdir(out, { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js', 'robots.txt', '.nojekyll']) await fs.copyFile(path.join(root, file), path.join(out, file));
await fs.cp(path.join(root, 'assets'), path.join(out, 'assets'), { recursive: true });
console.log('Static website built in dist/');
