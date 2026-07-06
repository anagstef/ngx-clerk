/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/exec', {
      prepareCmd: 'npm version ${nextRelease.version} --no-git-tag-version --allow-same-version --prefix projects/ngx-clerk && node scripts/sync-sdk-version.mjs && pnpm build',
    }],
    ['@semantic-release/npm', {
      pkgRoot: 'dist/ngx-clerk',
    }],
    '@semantic-release/github',
  ],
};
