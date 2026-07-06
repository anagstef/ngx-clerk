---
title: Home
nav_order: 1
description: Overview of ngx-clerk — the unofficial Angular SDK for Clerk authentication, covering features, installation, and requirements.
---

# ngx-clerk

Unofficial Clerk SDK for Angular (Core 3) — 13 prebuilt UI components, a reactive `ClerkService` built on Angular signals, control-flow directives (`*clerkSignedIn`, `*clerkSignedOut`, `*clerkLoaded`, `*clerkLoading`), the `*clerkProtect` authorization directive, button directives (`clerkSignInButton`, `clerkSignUpButton`, `clerkSignOutButton`), and route guards (`canActivateClerk`, `canActivateProtect`) for authentication, user management, and organizations.

> **Disclaimer:** This is an unofficial, community-maintained package and is not affiliated with Clerk.com.

## Install

```bash
npm install ngx-clerk
```

## Get started

- [Quickstart]({% link quickstart.md %}) — add authentication to a new app in a few steps
- [Migration guide](https://github.com/anagstef/ngx-clerk/blob/main/MIGRATION.md) — upgrading from v0.x to v1.0

## Guides

- [Authentication]({% link authentication.md %}) — sign-in/up, auth buttons, and control-flow directives
- [Protecting routes]({% link protecting-routes.md %}) — guards and the `*clerkProtect` directive
- [Reading auth state]({% link reading-auth-state.md %}) — the `ClerkService` signals
- [Session tokens]({% link session-tokens.md %}) — call your backend with `getToken()`

## Requirements

- Angular 20 or higher
- Clerk Core 3 (ClerkJS v6)
- Client-side rendering only — Server-Side Rendering (SSR) is not supported yet

## Links

- [GitHub](https://github.com/anagstef/ngx-clerk)
- [npm](https://www.npmjs.com/package/ngx-clerk)
