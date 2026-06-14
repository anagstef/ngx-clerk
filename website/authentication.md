---
title: Authentication
nav_order: 3
---

# Authentication

## Sign-in and sign-up pages

ngx-clerk renders Clerk's prebuilt UI. Mount the sign-in component on a **catch-all route** so Clerk can handle its sub-routes (e.g. `/sign-in/factor-one`):

```ts
// src/app/sign-in.component.ts
import { Component } from '@angular/core';
import { ClerkSignInComponent } from 'ngx-clerk';

@Component({
  selector: 'app-sign-in',
  imports: [ClerkSignInComponent],
  template: `<clerk-sign-in [props]="{ routing: 'path', path: '/sign-in', signUpUrl: '/sign-up' }" />`,
})
export class SignInComponent {}
```

```ts
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { catchAllRoute } from 'ngx-clerk';

export const routes: Routes = [
  {
    matcher: catchAllRoute('sign-in'),
    loadComponent: () => import('./sign-in.component').then((m) => m.SignInComponent),
  },
  {
    matcher: catchAllRoute('sign-up'),
    loadComponent: () => import('./sign-up.component').then((m) => m.SignUpComponent),
  },
];
```

The sign-up page follows the same pattern with `<clerk-sign-up />`.

## Auth buttons

Attribute directives trigger auth actions on your own button — no extra DOM, so you keep full control of styling:

```html
<button clerkSignInButton>Sign in</button>
<button clerkSignUpButton mode="modal">Create account</button>
<button clerkSignOutButton redirectUrl="/">Sign out</button>
```

`mode="modal"` opens Clerk's modal; the default `redirect` mode navigates to your sign-in/up page.

## Control-flow directives

Render content conditionally on auth state with structural directives — no need to read signals manually:

```html
<span *clerkLoading>Loading…</span>

<ng-container *clerkLoaded>
  <clerk-user-button *clerkSignedIn />
  <button *clerkSignedOut clerkSignInButton>Sign in</button>
</ng-container>
```

| Directive | Renders when |
| --- | --- |
| `*clerkSignedIn` | a user is signed in |
| `*clerkSignedOut` | Clerk is loaded and no user is signed in |
| `*clerkLoaded` | Clerk has finished loading |
| `*clerkLoading` | Clerk is still loading |

## Google One Tap

```html
<clerk-google-one-tap />
```

## OAuth / SSO callback

For custom OAuth flows, render the callback component on your `/sso-callback` route to complete the redirect:

```html
<clerk-authenticate-with-redirect-callback
  [props]="{ signInFallbackRedirectUrl: '/dashboard' }" />
```
