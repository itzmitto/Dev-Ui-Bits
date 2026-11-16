import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const lock = JSON.parse(await readFile(resolve(root, 'package-lock.json'), 'utf8'));
const supplemental = JSON.parse(await readFile(resolve(root, 'licenses/supplemental/sources.json'), 'utf8'));
const notices = [], missing = [], skipped = [];
for (const [path, metadata] of Object.entries(lock.packages).sort(([a], [b]) => a.localeCompare(b))) {
  if (!path || !path.startsWith('node_modules/')) continue;
  const directory = resolve(root, path);
  try { await stat(directory); } catch { skipped.push(path); continue; }
  const pkg = JSON.parse(await readFile(resolve(directory, 'package.json'), 'utf8'));
  const names = (await readdir(directory)).filter(name => /^(licen[cs]e|copying|notice|ofl|third-party-licen[cs]e)([._-]|$)/i.test(name));
  let text = `## ${pkg.name}@${pkg.version}\n\nLicense metadata: ${pkg.license || metadata.license || 'not declared'}\n\n`;
  const repo = typeof pkg.repository === 'string' ? pkg.repository : pkg.repository?.url;
  if (repo && !repo.includes('@devui-bits')) text += `Upstream: ${repo.replace(/^git\+/, '')}\n\n`;
  text += pkg.version.includes('devui-browser-only') ? 'Original local source: vendor/nodebox-browser-only (not an upstream Nodebox release).\n\n' : `Package source: https://www.npmjs.com/package/${pkg.name}/v/${pkg.version}\n\n`;
  let count = 0;
  for (const name of names) {
    const path = resolve(directory, name);
    if (!(await stat(path)).isFile()) continue;
    text += `### ${name}\n\n${await readFile(path, 'utf8')}\n\n`; count++;
  }
  if (!count && supplemental[pkg.name]) {
    const extra = supplemental[pkg.name];
    text += `### Supplemental upstream license\n\nSource: ${extra.source}\n\n${extra.note}\n\n${await readFile(resolve(root, 'licenses/supplemental', extra.file), 'utf8')}\n\n`; count++;
  }
  if (!count) { missing.push(`${pkg.name}@${pkg.version}`); text += 'No separate license text shipped in the installed package. Consult the upstream source before redistributing that package.\n\n'; }
  notices.push(text);
}
const document = `# Third-party notices — DevUI Bits\n\nGenerated from the installed lockfile packages. Original DevUI Bits code uses the MIT license in LICENSE. Third-party licenses remain separate. Includes build/test dependencies for completeness. Platform-specific optional packages not installed here are listed at the end; their original notices must be retained if redistributed.\n\nGeist is OFL-1.1. Lucide icons are ISC. Lightning CSS has MPL-2.0 terms; its unmodified upstream source is available from the npm version identified below and its lockfile tarball. No third-party source files were modified. The unused restrictive Nodebox package is replaced by the original MIT browser-only adapter in vendor/nodebox-browser-only.\n\nThis inventory is a technical review, not a legal guarantee. npm package metadata can be incomplete; service terms for the remote Sandpack compiler and Tailwind CDN are separate.\n\n${notices.join('\n---\n\n')}\n## Optional packages not installed on this platform\n\n${skipped.map(path => `- ${path}: ${lock.packages[path].license || 'license not declared'}`).join('\n')}\n`;
await mkdir(resolve(root, 'public'), { recursive: true });
await writeFile(resolve(root, 'THIRD_PARTY_NOTICES.md'), document);
await writeFile(resolve(root, 'public/third-party-notices.txt'), document);
console.log(`${notices.length} installed packages documented; ${skipped.length} platform-specific packages absent.`);
if (missing.length) { console.error('License texts needing review:', missing.join(', ')); process.exitCode = 1; }
