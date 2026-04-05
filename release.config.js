/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/changelog', {
      changelogFile: 'CHANGELOG.md',
    }],
    ['@semantic-release/exec', {
      prepareCmd: 'npm version ${nextRelease.version} --no-git-tag-version --prefix projects/ngx-clerk && pnpm build',
    }],
    ['@semantic-release/npm', {
      pkgRoot: 'dist/ngx-clerk',
    }],
    ['@semantic-release/git', {
      assets: ['CHANGELOG.md', 'projects/ngx-clerk/package.json'],
      message: 'chore(release): ${nextRelease.version}',
    }],
    '@semantic-release/github',
  ],
};
