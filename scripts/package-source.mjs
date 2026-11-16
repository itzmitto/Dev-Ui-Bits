import { readdir, readFile, writeFile, mkdir, lstat } from 'node:fs/promises';
import { dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateRawSync } from 'node:zlib';
import { createHash } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(process.argv[2] || resolve(root, 'artifacts/DevUI-Bits-Source.zip'));
const rootFiles = [
  'package.json', 'package-lock.json', 'index.html', 'vite.config.ts', 'vercel.json',
  'tsconfig.json', 'playwright.config.ts', '.gitignore', '.npmrc', '.nvmrc',
  'README.md', 'PROGRESS.md', 'SETUP-GITHUB-VERCEL.md', 'LICENSE',
  'THIRD_PARTY_NOTICES.md', 'LICENSE_REVIEW.md',
];
const files = [];
async function add(path) {
  const info = await lstat(path);
  if (info.isSymbolicLink()) throw new Error(`Source archives cannot include symlinks: ${relative(root, path)}`);
  if (info.isDirectory()) {
    for (const name of (await readdir(path)).sort()) {
      if (/^(node_modules|dist|\.git|\.openai|\.vercel|\.vite|artifacts|test-results|playwright-report)$/.test(name) || name.startsWith('.env') || /\.(log|tsbuildinfo)$/.test(name)) continue;
      await add(resolve(path, name));
    }
  } else {
    files.push({ name: `DevUI-Bits/${relative(root, path).split(sep).join('/')}`, body: await readFile(path) });
  }
}
for (const name of rootFiles) await add(resolve(root, name));
for (const directory of ['src', 'public', 'tests', 'scripts', 'vendor', 'licenses']) await add(resolve(root, directory));

function crc32(data) {
  let crc = 0xffffffff;
  for (const byte of data) { crc ^= byte; for (let i = 0; i < 8; i++) crc = crc >>> 1 ^ (0xedb88320 & -(crc & 1)); }
  return (crc ^ 0xffffffff) >>> 0;
}
const chunks = [], entries = []; let offset = 0;
for (const file of files.sort((a, b) => a.name.localeCompare(b.name))) {
  const name = Buffer.from(file.name), compressed = deflateRawSync(file.body, { level: 9 }), crc = crc32(file.body);
  const header = Buffer.alloc(30 + name.length);
  header.writeUInt32LE(0x04034b50); header.writeUInt16LE(20, 4); header.writeUInt16LE(0x800, 6); header.writeUInt16LE(8, 8); header.writeUInt16LE(33, 12);
  header.writeUInt32LE(crc, 14); header.writeUInt32LE(compressed.length, 18); header.writeUInt32LE(file.body.length, 22); header.writeUInt16LE(name.length, 26); name.copy(header, 30);
  entries.push({ name, crc, compressed: compressed.length, length: file.body.length, offset });
  chunks.push(header, compressed); offset += header.length + compressed.length;
}
const centralOffset = offset;
for (const entry of entries) {
  const header = Buffer.alloc(46 + entry.name.length);
  header.writeUInt32LE(0x02014b50); header.writeUInt16LE(20, 4); header.writeUInt16LE(20, 6); header.writeUInt16LE(0x800, 8); header.writeUInt16LE(8, 10); header.writeUInt16LE(33, 14);
  header.writeUInt32LE(entry.crc, 16); header.writeUInt32LE(entry.compressed, 20); header.writeUInt32LE(entry.length, 24); header.writeUInt16LE(entry.name.length, 28); header.writeUInt32LE(entry.offset, 42); entry.name.copy(header, 46);
  chunks.push(header); offset += header.length;
}
const end = Buffer.alloc(22); end.writeUInt32LE(0x06054b50); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10); end.writeUInt32LE(offset - centralOffset, 12); end.writeUInt32LE(centralOffset, 16); chunks.push(end);
const zip = Buffer.concat(chunks);
await mkdir(dirname(output), { recursive: true }); await writeFile(output, zip);
await writeFile(`${output}.sha256`, `${createHash('sha256').update(zip).digest('hex')}  DevUI-Bits-Source.zip\n`);
console.log(`${output}\n${files.length} source files; ${(zip.length / 1024).toFixed(1)} KiB. SHA-256 sidecar written.`);
