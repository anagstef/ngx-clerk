---
title: Demo & contributing
nav_order: 12
description: Run the demo, tests, lint, and e2e locally, and how builds, docs, and releases work.
---

# Demo & contributing

## Repo layout

- `projects/ngx-clerk` — the library
- `projects/demo` — Angular app used for local development and e2e
- `website/` — this documentation site (Jekyll + just-the-docs)
- `e2e/` — Playwright end-to-end tests
- `skills/` — installable AI agent skills, see [Use with AI agents]({% link ai-agents.md %})

## Node.js version

Building ngx-clerk itself needs **Node 24** — pinned in `.nvmrc` and installed by every CI
job. That's a workspace tooling requirement (Angular CLI, Vite, ESLint), not the Node version
needed to *use* the published package: `ngx-clerk` itself supports **Node 20.19+** in
consuming apps, same as Angular 20 itself.

## Install and run the demo

```bash
pnpm install
pnpm dev
```

`pnpm dev` builds the library and serves `projects/demo` at `http://localhost:4200`. Its
development configuration already ships a Publishable Key for a shared Clerk dev instance, so
there's nothing else to configure.

## Unit tests

```bash
pnpm test
```

Runs the library's unit tests directly with `vitest run` — there's no `ng test` in this
workspace.

## Lint

```bash
pnpm lint
```

## End-to-end tests

Add a Clerk Secret Key from the shared dev instance to `e2e/.env` (gitignored, never
committed):

```text
CLERK_SECRET_KEY=sk_test_XXXX
```

Then run:

```bash
pnpm e2e
```

Playwright's `webServer` config runs `pnpm dev` for you and waits for
`http://localhost:4200` to come up. In CI, the E2E job skips fork pull requests entirely,
since forks don't have access to the `CLERK_SECRET_KEY` secret.

## Build

```bash
pnpm build
```

Builds `projects/ngx-clerk` with ng-packagr into `dist/ngx-clerk`, then copies the root
`README.md` in as the package's own readme — the file at the repo root is what ends up on npm.

## Docs site

This site lives under `website/` and is a Jekyll site using the just-the-docs theme:

```bash
cd website
bundle install
bundle exec jekyll serve
```

Needs Ruby 3.0 or higher. Run `pnpm docs:llms` first if you've changed `MIGRATION.md` or any
page in `website/` — it regenerates `migration.md`, `llms.txt`, and `llms-full.txt` from the
current sources.

## Forward-compatibility smoke test

```bash
pnpm build
scripts/compat-smoke.sh 22
```

Packs the built library and installs it into a fresh app on a newer Angular major, to catch
forward-compatibility breaks early. CI runs this same script against Angular 21 and 22 on
pull requests and pushes to main.

## Release process

Releases run through `semantic-release`, triggered by manually dispatching the "Release"
workflow on `main` — nothing ships automatically on merge. Commit messages must follow
[Conventional Commits](https://www.conventionalcommits.org/); a husky `commit-msg` hook runs
commitlint on every commit to enforce it.
