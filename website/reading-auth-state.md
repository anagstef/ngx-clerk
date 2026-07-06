---
title: Reading auth state
nav_order: 6
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
| `user()` | the current `UserResource`, or `null` |
| `session()` | the active session, or `null` |
| `organization()` | the active organization, or `null` |
| `isLoaded()` | whether Clerk has finished loading |
| `isSignedIn()` | whether a user is signed in |
| `userId()`, `sessionId()`, `orgId()` | the corresponding IDs, or `null` |
| `orgRole()`, `orgSlug()` | the user's role in, and slug of, the active organization |
| `sessionClaims()`, `actor()` | the active session's JWT claims and actor |
| `signIn()`, `signUp()` | the active sign-in / sign-up attempt resources |
| `sessions()` | every session registered on the device |
| `membership()` | the user's membership in the active organization |

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
| `updateClerkOptions(options)` | update appearance/localization at runtime |
