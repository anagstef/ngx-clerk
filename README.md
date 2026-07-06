# ngx-clerk

[![npm version](https://img.shields.io/npm/v/ngx-clerk)](https://www.npmjs.com/package/ngx-clerk)
[![CI](https://github.com/anagstef/ngx-clerk/actions/workflows/ci.yml/badge.svg)](https://github.com/anagstef/ngx-clerk/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/ngx-clerk)](./LICENSE)

Unofficial [Clerk](https://clerk.com) SDK for Angular — signals-based auth state, all Clerk UI components, route guards, and template directives.

> Community-maintained, not affiliated with Clerk. Supports Clerk Core 3 (ClerkJS v6), Angular 20+, Node 20.19+. Client-side rendering only.

## Documentation

**Full docs: [anagstef.github.io/ngx-clerk](https://anagstef.github.io/ngx-clerk/)** — quickstart, components, guards, organizations, [migration from v0](https://anagstef.github.io/ngx-clerk/migration.html), and [LLM-ready docs](https://anagstef.github.io/ngx-clerk/ai-agents.html).

## Quickstart

```bash
npm install ngx-clerk
```

```ts
// app.config.ts
import { provideClerk } from 'ngx-clerk';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClerk({
      publishableKey: 'pk_test_XXXX',
      signInUrl: '/sign-in',
      signUpUrl: '/sign-up',
    }),
  ],
};
```

```ts
// app.routes.ts
import { canActivateClerk, catchAllRoute } from 'ngx-clerk';

export const routes: Routes = [
  { matcher: catchAllRoute('sign-in'), component: SignInPageComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [canActivateClerk] },
];
```

```html
<!-- Anywhere in your templates -->
<clerk-user-button *clerkSignedIn />
<button *clerkSignedOut clerkSignInButton>Sign in</button>
```

See the [quickstart guide](https://anagstef.github.io/ngx-clerk/quickstart.html) for the complete walkthrough.

## Migrating from v0.x

v1 is a rewrite for Clerk Core 3: signals instead of RxJS, `provideClerk()` instead of `__init()`, functional guards. Read it as a [docs page](https://anagstef.github.io/ngx-clerk/migration.html) or straight from [MIGRATION.md](./MIGRATION.md) in this repo — handy offline or for handing to an AI agent — or point your agent at the [migration skill](./skills/ngx-clerk-migrate-v0-v1/SKILL.md) directly.

## Demo

A full demo app lives in [`projects/demo`](./projects/demo). It runs out of the box against a shared Clerk dev instance — no setup required:

```bash
pnpm install
pnpm dev
```

Open http://localhost:4200.

## License

[MIT](./LICENSE)
