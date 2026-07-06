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

The sign-up page follows the same pattern with `<clerk-sign-up [props]="{ routing: 'path', path: '/sign-up', signInUrl: '/sign-in' }" />`.

Prop changes re-mount the underlying Clerk component, so keep the `[props]` object reference stable (e.g. a class field) rather than creating a new object literal on every change-detection cycle.

## Auth buttons

Attribute directives trigger auth actions on your own button — no extra DOM, so you keep full control of styling:

```html
<button clerkSignInButton>Sign in</button>
<button clerkSignUpButton mode="modal">Create account</button>
<button clerkSignOutButton redirectUrl="/">Sign out</button>
```

Each button directive defaults to `redirect` mode, which navigates to your sign-in/up page; `mode="modal"` opens Clerk's modal instead. The full set of inputs, exactly as declared on each directive:

### `clerkSignInButton`

| Input | Type | Description |
| --- | --- | --- |
| `mode` | `'redirect' \| 'modal'` | `'redirect'` (default) navigates to the sign-in page; `'modal'` opens the modal |
| `forceRedirectUrl` | `string` | Always redirect here after sign-in |
| `fallbackRedirectUrl` | `string` | Redirect here after sign-in if no other redirect URL applies |
| `signUpForceRedirectUrl` | `string` | Same as `forceRedirectUrl`, applied if the user signs up instead |
| `signUpFallbackRedirectUrl` | `string` | Same as `fallbackRedirectUrl`, applied if the user signs up instead |

### `clerkSignUpButton`

| Input | Type | Description |
| --- | --- | --- |
| `mode` | `'redirect' \| 'modal'` | `'redirect'` (default) navigates to the sign-up page; `'modal'` opens the modal |
| `forceRedirectUrl` | `string` | Always redirect here after sign-up |
| `fallbackRedirectUrl` | `string` | Redirect here after sign-up if no other redirect URL applies |
| `signInForceRedirectUrl` | `string` | Same as `forceRedirectUrl`, applied if the user signs in instead |
| `signInFallbackRedirectUrl` | `string` | Same as `fallbackRedirectUrl`, applied if the user signs in instead |

### `clerkSignOutButton`

| Input | Type | Description |
| --- | --- | --- |
| `redirectUrl` | `string` | URL to navigate to after signing out |
| `sessionId` | `string` | Sign out of one specific session; omit to sign out of every session on the device |

`redirectUrl` only exists on `clerkSignOutButton` — the sign-in/up buttons use the more specific `forceRedirectUrl` / `fallbackRedirectUrl` pair instead:

```html
<button clerkSignInButton mode="modal" fallbackRedirectUrl="/dashboard">Sign in</button>
<button clerkSignOutButton redirectUrl="/" sessionId="sess_xxx">Sign out of this device</button>
```

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

It opens automatically once Clerk has loaded and closes when the component is destroyed. Prop changes made after that initial open are not re-applied.

## OAuth / SSO callback

For custom OAuth flows, render the callback component on your `/sso-callback` route to complete the redirect:

```ts
// src/app/sso-callback.component.ts
import { Component } from '@angular/core';
import { ClerkAuthenticateWithRedirectCallbackComponent } from 'ngx-clerk';

@Component({
  selector: 'app-sso-callback',
  imports: [ClerkAuthenticateWithRedirectCallbackComponent],
  template: `
    <clerk-authenticate-with-redirect-callback
      [props]="{ signInFallbackRedirectUrl: '/dashboard', signUpFallbackRedirectUrl: '/dashboard' }" />
  `,
})
export class SsoCallbackComponent {}
```

```ts
// src/app/app.routes.ts
{
  path: 'sso-callback',
  loadComponent: () => import('./sso-callback.component').then((m) => m.SsoCallbackComponent),
},
```
