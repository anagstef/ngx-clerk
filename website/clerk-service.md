---
title: ClerkService
nav_order: 9
description: Every signal and method on ClerkService, with effect() and error-handling examples.
---

# ClerkService

`ClerkService` is the reactive core of ngx-clerk: an injectable, `providedIn: 'root'` service
that wraps the Clerk instance in Angular signals. [`provideClerk()`]({% link quickstart.md %})
calls `initialize()` once at application startup — everything else below is safe to call
anywhere the service is injected.

> `initialize(options: ClerkInitOptions): Promise<void>` is **internal**. `provideClerk()`
> calls it once during application bootstrap; calling it yourself logs a warning and resolves
> immediately without re-initializing.

## Signals

| Signal | Type | Description |
| --- | --- | --- |
| `clerk()` | `Clerk` or `null` | the Clerk instance, or `null` until Clerk has loaded |
| `client()` | `ClientResource` or `null` | the current Clerk client resource |
| `session()` | `ActiveSessionResource` or `null` | the active session, or `null` when not signed in |
| `user()` | `UserResource` or `null` | the current user, or `null` when not signed in |
| `organization()` | `OrganizationResource` or `null` | the active organization, or `null` when none is active |
| `isLoaded()` | `boolean` | whether Clerk has finished loading |
| `isSignedIn()` | `boolean` | whether a user is currently signed in |
| `userId()` | `string` or `null` | the current user's ID |
| `orgId()` | `string` or `null` | the active organization's ID |
| `sessionId()` | `string` or `null` | the active session's ID |
| `orgRole()` | `string` or `null` | the current user's role in the active organization |
| `orgSlug()` | `string` or `null` | the active organization's slug |
| `sessionClaims()` | `JwtPayload` or `null` | the claims of the active session's JWT |
| `actor()` | `ActClaim` or `null` | the actor (impersonation) claim of the active session |
| `signIn()` | `SignInResource` or `null` | the active sign-in attempt resource |
| `signUp()` | `SignUpResource` or `null` | the active sign-up attempt resource |
| `sessions()` | `SessionResource[]` | every session registered on the current client device |
| `membership()` | `OrganizationMembershipResource` or `null` | the current user's membership in the active organization |

> `isSignedIn()` is `!!user()?.id` — it does not check session status. A Clerk Core 3 session
> with status `pending` (for example, an incomplete organization-selection task) still reports
> `isSignedIn() === true`, since the pending session already carries a full `user`. This differs
> from upstream SDKs' `useAuth()`, which treats `pending` as signed out by default
> (`treatPendingAsSignedOut`). ngx-clerk has no session-task UI yet, so check
> `session()?.status` yourself if your instance can put users into a pending state.

```ts
import { Component, inject } from '@angular/core';
import { ClerkService } from 'ngx-clerk';

@Component({ selector: 'app-profile', template: `…` })
export class ProfileComponent {
  protected readonly clerk = inject(ClerkService);
}
```

See [Reading auth state]({% link reading-auth-state.md %}) for template examples and the
`toObservable()` interop, and [Organizations & roles]({% link organizations.md %}) for the
org-specific signals.

## Reacting to signals with `effect()`

Every signal above is a plain Angular signal, so `effect()` re-runs whenever one it reads
changes — useful for side effects that aren't rendering, like reporting the signed-in user to
an analytics tool:

```ts
import { Component, effect, inject } from '@angular/core';
import { ClerkService } from 'ngx-clerk';

@Component({ selector: 'app-root', template: `…` })
export class AppComponent {
  private readonly clerk = inject(ClerkService);

  constructor() {
    effect(() => {
      const userId = this.clerk.userId();
      if (userId) {
        myAnalytics.identify(userId);
      }
    });
  }
}
```

## Methods

### Authorization & tokens

| Method | Description |
| --- | --- |
| `has(params: CheckAuthorizationParams): boolean` | Checks a role, permission, feature, or plan. `false` while signed out. See [Organizations & roles]({% link organizations.md %}). |
| `getToken(options?: GetTokenOptions): Promise<string \| null>` | Returns the current session JWT, optionally for a named template. Resolves to `null` when there's no active session. |
| `setActive(params: SetActiveParams): Promise<void>` | Sets the active session and/or organization. |
| `handleRedirectCallback(params?: HandleOAuthCallbackParams): Promise<void>` | Completes an OAuth/SSO redirect flow. |

```ts
await clerk.setActive({ organization: 'org_123' });
```

### Appearance & localization

| Method | Description |
| --- | --- |
| `updateAppearance(opts: ClerkOptions['appearance']): void` | Updates the global appearance configuration for all Clerk components. |
| `updateLocalization(opts: ClerkOptions['localization']): void` | Updates the localization configuration for all Clerk components. |
| `updateClerkOptions(options: ClerkUpdateOptions): void` | Updates appearance and/or localization together — `ClerkUpdateOptions` is `{ localization?, appearance? }`. |

### Open/close UI

The imperative equivalent of mounting the matching component from
[Components]({% link components.md %}) — open one from a click handler instead of always
rendering the component:

| Method | Description |
| --- | --- |
| `openSignIn(opts?: SignInProps): void` / `closeSignIn(): void` | Opens/closes the sign-in modal. |
| `openSignUp(opts?: SignUpProps): void` / `closeSignUp(): void` | Opens/closes the sign-up modal. |
| `openUserProfile(opts?: UserProfileProps): void` / `closeUserProfile(): void` | Opens/closes the user profile modal. |
| `openOrganizationProfile(opts?: OrganizationProfileProps): void` / `closeOrganizationProfile(): void` | Opens/closes the organization profile modal. |
| `openCreateOrganization(opts?: CreateOrganizationProps): void` / `closeCreateOrganization(): void` | Opens/closes the create organization modal. |

### Redirects

| Method | Description |
| --- | --- |
| `redirectToSignIn(opts?: SignInRedirectOptions): void` | Redirects to the Clerk sign-in page. |
| `redirectToSignUp(opts?: SignUpRedirectOptions): void` | Redirects to the Clerk sign-up page. |

### Sign out

| Method | Description |
| --- | --- |
| `signOut(opts?: SignOutOptions): Promise<void>` | Signs out the current user. Pass `sessionId` to sign out of one specific session; omit it to sign out of every session on the device. |

```ts
await clerk.signOut({ redirectUrl: '/' });
```

## Handling errors

`ngx-clerk` re-exports Clerk's error classes and type guards from `@clerk/shared/error`:
`ClerkAPIResponseError`, `ClerkOfflineError`, `ClerkRuntimeError`, `EmailLinkErrorCodeStatus`,
`isClerkAPIResponseError`, `isClerkRuntimeError`, `isEmailLinkError`, `isKnownError`,
`isMetamaskError`.

Methods that call the Clerk API — `setActive()`, `signOut()`, and the sign-in/up flows inside
the mounted components — can reject with a `ClerkAPIResponseError`. Narrow it with
`isClerkAPIResponseError` to read the structured `errors` array:

```ts
import { isClerkAPIResponseError } from 'ngx-clerk';

try {
  await clerk.setActive({ organization: orgId });
} catch (error) {
  if (isClerkAPIResponseError(error)) {
    console.error(error.errors[0]?.longMessage ?? error.errors[0]?.message);
  } else {
    throw error;
  }
}
```

See [Session tokens]({% link session-tokens.md %}) for the `ClerkOfflineError` /
`isClerkRuntimeError` pattern specific to `getToken()`.
