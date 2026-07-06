// Generates website/migration.md (from MIGRATION.md), website/llms.txt and
// website/llms-full.txt from the docs sources. Run before `jekyll build`.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = join(ROOT, 'website');
const BASE_URL = 'https://anagstef.github.io/ngx-clerk';

// 1. Generate the migration page from the canonical root MIGRATION.md
const migration = readFileSync(join(ROOT, 'MIGRATION.md'), 'utf8').replace(/^# .*\n/, '');
writeFileSync(
  join(SITE, 'migration.md'),
  `---\ntitle: Migration v0 to v1\nnav_order: 10\ndescription: Upgrade an app from ngx-clerk v0.x to v1.\n---\n\n# Migrating from ngx-clerk v0.x to v1.0\n{: .no_toc }\n\n<!-- GENERATED from /MIGRATION.md by scripts/generate-llms.mjs — edit that file instead. -->\n\n{% raw %}\n${migration}\n{% endraw %}\n`,
);

// Strips one layer of matching quotes so quoted YAML scalars parse cleanly.
function unquote(value) {
  const trimmed = value.trim();
  const isDoubleQuoted = trimmed.startsWith('"') && trimmed.endsWith('"');
  const isSingleQuoted = trimmed.startsWith("'") && trimmed.endsWith("'");
  return trimmed.length >= 2 && (isDoubleQuoted || isSingleQuoted) ? trimmed.slice(1, -1) : trimmed;
}

// Same slug rule Jekyll's `{% link %}` resolves to: index.md publishes at the site root.
function slugFromFile(file) {
  return file === 'index.md' ? '' : file.replace(/\.md$/, '');
}

// A page's published URL for its slug; index.md's slug ('') is the bare base URL.
function urlForSlug(slug) {
  return slug ? `${BASE_URL}/${slug}.html` : BASE_URL;
}

// 2. Collect pages
const pages = readdirSync(SITE)
  .filter((f) => f.endsWith('.md'))
  .map((file) => {
    const raw = readFileSync(join(SITE, file), 'utf8');
    const fm = raw.match(/^---\n([\s\S]*?)\n---\n/);
    const meta = Object.fromEntries(
      (fm?.[1] ?? '')
        .split('\n')
        .map((l) => l.match(/^(\w+):\s*(.*)$/))
        .filter(Boolean)
        .map((m) => [m[1], unquote(m[2])]),
    );
    if (!('title' in meta) || !('nav_order' in meta)) {
      console.warn(`generate-llms: skipping ${file} — missing required front matter (title, nav_order)`);
      return null;
    }
    const body = raw.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
    const slug = slugFromFile(file);
    const order =
      Number.isFinite(Number(meta.nav_order)) && String(meta.nav_order).trim() !== '' ? Number(meta.nav_order) : 999;
    return { file, slug, title: meta.title, description: meta.description ?? '', order, body };
  })
  .filter(Boolean)
  .sort((a, b) => a.order - b.order);

// 3. llms.txt — index with links
const index = [
  '# ngx-clerk',
  '',
  '> Unofficial Clerk SDK for Angular (Angular 20+, Clerk Core 3 / ClerkJS v6). Signals-based auth state, prebuilt Clerk components, route guards, and directives.',
  '',
  '## Docs',
  '',
  ...pages.map((p) => `- [${p.title}](${BASE_URL}/${p.slug ? p.slug + '.html' : ''})${p.description ? `: ${p.description}` : ''}`),
  '',
  '## Optional',
  '',
  `- [Migration guide (raw)](https://raw.githubusercontent.com/anagstef/ngx-clerk/main/MIGRATION.md): plain-markdown v0 to v1 upgrade guide`,
  `- [Agent skills](https://github.com/anagstef/ngx-clerk/tree/main/skills): installable skills for AI coding agents`,
  '',
].join('\n');
writeFileSync(join(SITE, 'llms.txt'), index);

// Rewrites {% link %} targets to absolute URLs and drops {% raw %}/{% endraw %} markers —
// both are meaningless outside Jekyll — so llms-full.txt reads as plain text.
function processBody(body) {
  return body
    .replace(/\{%\s*link\s+([^\s%]+)\s*%\}/g, (_, file) => urlForSlug(slugFromFile(file)))
    .split('\n')
    .filter((line) => !/^\s*\{%\s*(raw|endraw)\s*%\}\s*$/.test(line))
    .map((line) => line.replace(/\{%\s*(raw|endraw)\s*%\}/g, ''))
    .join('\n');
}

// 4. llms-full.txt — all docs concatenated
const full = pages
  .map((p) => `# ${p.title}\n${p.description ? `> ${p.description}\n` : ''}Source: ${BASE_URL}/${p.slug ? p.slug + '.html' : ''}\n\n${processBody(p.body)}`)
  .join('\n\n---\n\n');
writeFileSync(join(SITE, 'llms-full.txt'), `${full}\n`);

console.log(`Generated migration.md, llms.txt (${pages.length} pages), llms-full.txt`);
