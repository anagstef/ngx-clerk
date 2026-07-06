---
title: Reading auth state
nav_order: 5
---

# Reading auth state

`ClerkService` exposes Clerk's state as Angular signals. Inject it anywhere:

```ts
import { Component, inject } from '@angular/core';
import { ClerkService } from 'ngx-clerk';

@Component({
  selector: 'app-profile',
  template: `<!-- … -->`,
})
export class ProfileComponent {
  protected readonly clerk = inject(ClerkService);
}
```

Read the signals in a template:

{% raw %}
```html
@if (clerk.user(); as user) {
  <p>Hello {{ user.firstName }}</p>
}
```
{% endraw %}

## Signals

| Signal | Description |
| --- | --- |
| `clerk()` | the Clerk instance, or `null` until loaded |
| `client()` | the current Clerk `ClientResource`, or `null` |
| `session()` | the active session, or `null` |
| `user()` | the current `UserResource`, or `null` |
| `organization()` | the active organization, or `null` |
| `isLoaded()` | whether Clerk has finished loading |
| `isSignedIn()` | whether a user is signed in |
| `userId()`, `orgId()`, `sessionId()` | the corresponding IDs, or `null` |
| `orgRole()`, `orgSlug()` | the user's role in, and slug of, the active organization |
| `sessionClaims()`, `actor()` | the active session's JWT claims, and the actor (impersonation) claim |
| `signIn()`, `signUp()` | the active sign-in / sign-up attempt resources |
| `sessions()` | every session registered on the current device |
| `membership()` | the user's membership in the active organization |

## Control-flow directives

Structural directives read the same state so you don't have to check signals manually in templates:

| Directive | Renders when |
| --- | --- |
| `*clerkSignedIn` | a user is signed in |
| `*clerkSignedOut` | Clerk is loaded and no user is signed in |
| `*clerkLoaded` | Clerk has finished loading |
| `*clerkLoading` | Clerk is still loading |

See [Authentication]({% link authentication.md %}) for examples combining them with the user button and auth buttons.

## Methods

| Method | Description |
| --- | --- |
| `has(params)` | check a role / permission / feature / plan |
| `getToken(options?)` | get the current session JWT |
| `setActive(params)` | switch the active session or organization |
| `handleRedirectCallback(params?)` | complete an OAuth/SSO redirect |
| `signOut(options?)` | sign the current user out |
| `redirectToSignIn()`, `redirectToSignUp()` | navigate to the Clerk sign-in/up pages |
| `openSignIn()`, `openUserProfile()`, … | open the modal UIs (with matching `close*` helpers) |
| `updateAppearance(opts)`, `updateLocalization(opts)` | update just the appearance or localization config |
| `updateClerkOptions(options)` | update appearance and/or localization together |

## Using an Observable

Everything on `ClerkService` is a signal. If you need an `Observable` — to combine auth state with `HttpClient` streams, for example — convert it with `toObservable()` from `@angular/core/rxjs-interop`:

```ts
import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ClerkService } from 'ngx-clerk';

const clerk = inject(ClerkService);
const user$ = toObservable(clerk.user);
```
