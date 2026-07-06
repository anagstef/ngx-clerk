# ngx-clerk

**ngx-clerk** is an unofficial, community Angular SDK for [Clerk](https://clerk.com/) —
drop-in components, a reactive service, structural directives, and route guards for
authentication, user management, and organizations.

> **Disclaimer:** This is an unofficial, community-maintained package and is not affiliated
> with Clerk.com.

## Prerequisites

- Angular version **19 or higher**.
- Clerk Core 3 (ClerkJS v6).
- Client-side operations only. Server-Side Rendering (SSR) is not supported at the moment.

## Installation

```bash
npm i ngx-clerk
```

## Getting Started

1. Create an app in the [Clerk Dashboard](https://dashboard.clerk.com/) and copy the Publishable Key.
2. **Add `provideClerk()` to your app config:**

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClerk } from 'ngx-clerk';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClerk({
      publishableKey: 'pk_test_XXXXXXXX',
    }),
  ],
};
```

3. **Use Clerk components in your templates:**

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClerkUserButtonComponent } from 'ngx-clerk';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ClerkUserButtonComponent],
  template: `
    <clerk-user-button />
    <router-outlet />
  `,
})
export class AppComponent {}
```

4. **Protect routes** with the `canActivateClerk` guard:

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { canActivateClerk } from 'ngx-clerk';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [canActivateClerk] },
];
```

## UI Components

All Clerk UI components are available and prefixed with `clerk-`. They accept the
matching Clerk props via the `[props]` input, and update reactively when the input changes.

| Component | Selector |
| --- | --- |
| Sign In | `<clerk-sign-in />` |
| Sign Up | `<clerk-sign-up />` |
| User Profile | `<clerk-user-profile />` |
| User Button | `<clerk-user-button />` |
| User Avatar | `<clerk-user-avatar />` |
| Organization Profile | `<clerk-organization-profile />` |
| Organization Switcher | `<clerk-organization-switcher />` |
| Organization List | `<clerk-organization-list />` |
| Create Organization | `<clerk-create-organization />` |
| Waitlist | `<clerk-waitlist />` |
| Pricing Table | `<clerk-pricing-table />` |
| Google One Tap | `<clerk-google-one-tap />` |
| OAuth/SSO callback | `<clerk-authenticate-with-redirect-callback />` |

```html
<clerk-sign-in [props]="{ routing: 'path', path: '/sign-in', signUpUrl: '/sign-up' }" />
```

## Control-flow directives

Idiomatic Angular structural directives for conditionally rendering content based on
auth state:

```html
<div *clerkLoading>Loading…</div>

<ng-container *clerkLoaded>
  <clerk-user-button *clerkSignedIn />
  <button *clerkSignedOut clerkSignInButton>Sign in</button>
</ng-container>
```

- `*clerkSignedIn` — renders when a user is signed in.
- `*clerkSignedOut` — renders when Clerk is loaded and no user is signed in.
- `*clerkLoaded` / `*clerkLoading` — renders based on whether Clerk has finished loading.

## Authorization

Gate UI by role, permission, feature, or plan with the `*clerkProtect` directive (with an
optional `else` template), or check imperatively with `ClerkService.has()`:

```html
<section *clerkProtect="{ role: 'org:admin' }; else noAccess">Admins only</section>
<ng-template #noAccess>You do not have access.</ng-template>
```

Protect a whole route with the `canActivateProtect` guard factory:

```typescript
import { canActivateProtect } from 'ngx-clerk';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [canActivateProtect({ role: 'org:admin' }, { unauthorizedUrl: '/dashboard' })],
  },
];
```

## Buttons

Attribute directives that trigger auth actions on your own button, with no extra DOM:

```html
<button clerkSignInButton>Sign in</button>
<button clerkSignUpButton mode="modal">Create account</button>
<button clerkSignOutButton redirectUrl="/">Sign out</button>
```

## Session tokens

Fetch the current session JWT to authenticate your backend:

```typescript
const token = await clerk.getToken();
```

## ClerkService

Central service exposing auth state as Angular signals plus imperative helpers.

**Signals:** `clerk()`, `client()`, `session()`, `user()`, `organization()`, `isLoaded()`,
`isSignedIn()`, `userId()`, `orgId()`, `sessionId()`, `orgRole()`, `orgSlug()`,
`sessionClaims()`, `actor()`, `signIn()`, `signUp()`, `sessions()`, `membership()`.

**Methods:** `has(params)`, `getToken(options?)`, `setActive(params)`,
`handleRedirectCallback(params?)`, `signOut(options?)`, `openSignIn()` / `closeSignIn()`
(and the other modal open/close helpers), `redirectToSignIn()` / `redirectToSignUp()`,
`updateAppearance()`, `updateLocalization()`, `updateClerkOptions()`.

```typescript
import { Component, inject } from '@angular/core';
import { ClerkService } from 'ngx-clerk';

@Component({
  selector: 'app-dashboard',
  template: `
    @if (clerk.user(); as user) {
      <p>Hello {{ user.firstName }}</p>
    }
  `,
})
export class DashboardComponent {
  clerk = inject(ClerkService);
}
```

## OAuth / SSO callback

Place the callback component on your `/sso-callback` route to complete an OAuth redirect flow:

```html
<clerk-authenticate-with-redirect-callback
  [props]="{ signInFallbackRedirectUrl: '/dashboard' }" />
```

## Migrating from v0.x

See [MIGRATION.md](./MIGRATION.md) for a detailed upgrade guide.
