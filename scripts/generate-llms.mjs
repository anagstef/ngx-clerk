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
  `---\ntitle: Migration v0 to v1\nnav_order: 10\ndescription: Upgrade an app from ngx-clerk v0.x to v1.\n---\n\n# Migrating from ngx-clerk v0.x to v1.0\n{: .no_toc }\n\n<!-- GENERATED from /MIGRATION.md by scripts/generate-llms.mjs — edit that file instead. -->\n\n${migration}`,
);

// Strips one layer of matching quotes so quoted YAML scalars parse cleanly.
function unquote(value) {
  const trimmed = value.trim();
  const isDoubleQuoted = trimmed.startsWith('"') && trimmed.endsWith('"');
  const isSingleQuoted = trimmed.startsWith("'") && trimmed.endsWith("'");
  return trimmed.length >= 2 && (isDoubleQuoted || isSingleQuoted) ? trimmed.slice(1, -1) : trimmed;
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
    const body = raw.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
    const slug = file === 'index.md' ? '' : file.replace(/\.md$/, '');
    return { file, slug, title: meta.title ?? file, description: meta.description ?? '', order: Number(meta.nav_order ?? 999), body };
  })
  .filter((p) => p.title)
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

// 4. llms-full.txt — all docs concatenated
const full = pages
  .map((p) => `# ${p.title}\n${p.description ? `> ${p.description}\n` : ''}Source: ${BASE_URL}/${p.slug ? p.slug + '.html' : ''}\n\n${p.body}`)
  .join('\n\n---\n\n');
writeFileSync(join(SITE, 'llms-full.txt'), `${full}\n`);

console.log(`Generated migration.md, llms.txt (${pages.length} pages), llms-full.txt`);
