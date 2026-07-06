// Keeps the SDK metadata version in provider.ts in sync with the library's
// package.json version. Run during the semantic-release prepare step, after the
// package.json version has been bumped, so the published bundle reports the
// correct version in its telemetry.
import { readFileSync, writeFileSync } from 'node:fs';

const pkgPath = 'projects/ngx-clerk/package.json';
const providerPath = 'projects/ngx-clerk/src/lib/provider.ts';

const { version } = JSON.parse(readFileSync(pkgPath, 'utf8'));
const source = readFileSync(providerPath, 'utf8');

const updated = source.replace(
  /(NGX_CLERK_SDK_METADATA[\s\S]*?version:\s*')[^']*(')/,
  `$1${version}$2`,
);

if (updated === source && !source.includes(`version: '${version}'`)) {
  throw new Error(`Could not update SDK metadata version in ${providerPath}`);
}

writeFileSync(providerPath, updated);
console.log(`Synced SDK metadata version to ${version}`);
