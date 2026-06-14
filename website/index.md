---
title: Home
nav_order: 1
---

# ngx-clerk

Unofficial Clerk SDK for Angular (Core 3) — drop-in components, a reactive service, structural directives, and route guards for authentication, user management, and organizations.

> **Disclaimer:** This is an unofficial, community-maintained package and is not affiliated with Clerk.com.

## Install

```bash
npm install ngx-clerk
```

## Get started

- [Quickstart]({% link quickstart.md %}) — add authentication to a new app in a few steps
- [Authentication]({% link authentication.md %}) — sign-in/up, auth buttons, and control-flow directives
- [Protecting routes]({% link protecting-routes.md %}) — guards and the `*clerkProtect` directive
- [Session tokens]({% link session-tokens.md %}) — call your backend with `getToken()`
- [Reading auth state]({% link reading-auth-state.md %}) — the `ClerkService` signals

## Requirements

- Angular 19 or higher
- Clerk Core 3 (ClerkJS v6)
- Client-side only — Server-Side Rendering (SSR) is not supported yet
