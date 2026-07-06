---
title: Components
nav_order: 8
description: All 13 Clerk UI components for Angular with their inputs.
---

# Components

ngx-clerk ships 13 standalone components that mount Clerk's prebuilt UI. Import them
individually from `ngx-clerk`; every one is `ChangeDetectionStrategy.OnPush` with
`ViewEncapsulation.None` so Clerk's own styles can reach into the DOM it mounts.

Every `[props]` type below lives in `@clerk/shared/types` and is re-exported by `ngx-clerk`
itself, so `import type { SignInProps } from 'ngx-clerk';` works without adding
`@clerk/shared` as a direct dependency.

| Component | Selector | Props type |
| --- | --- | --- |
| `ClerkSignInComponent` | `clerk-sign-in` | `SignInProps` |
| `ClerkSignUpComponent` | `clerk-sign-up` | `SignUpProps` |
| `ClerkUserProfileComponent` | `clerk-user-profile` | `UserProfileProps` |
| `ClerkUserButtonComponent` | `clerk-user-button` | `UserButtonProps` |
| `ClerkUserAvatarComponent` | `clerk-user-avatar` | `UserAvatarProps` |
| `ClerkOrganizationProfileComponent` | `clerk-organization-profile` | `OrganizationProfileProps` |
| `ClerkOrganizationSwitcherComponent` | `clerk-organization-switcher` | `OrganizationSwitcherProps` |
| `ClerkCreateOrganizationComponent` | `clerk-create-organization` | `CreateOrganizationProps` |
| `ClerkOrganizationListComponent` | `clerk-organization-list` | `OrganizationListProps` |
| `ClerkWaitlistComponent` | `clerk-waitlist` | `WaitlistProps` |
| `ClerkPricingTableComponent` | `clerk-pricing-table` | `PricingTableProps` |
| `ClerkGoogleOneTapComponent` | `clerk-google-one-tap` | `GoogleOneTapProps` |
| `ClerkAuthenticateWithRedirectCallbackComponent` | `clerk-authenticate-with-redirect-callback` | `HandleOAuthCallbackParams` |

## Path routing

Five components — Sign In, Sign Up, User Profile, Organization Profile, and Create
Organization — accept a `routing`/`path` pair in their props. Set `routing: 'path'` and a
`path` to give the component its own addressable Angular route instead of Clerk's default
in-place navigation, and pair it with a `catchAllRoute` matcher so Clerk's own sub-routes
(e.g. `/sign-in/factor-one`) fall under the same route:

```ts
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { catchAllRoute } from 'ngx-clerk';

export const routes: Routes = [
  {
    matcher: catchAllRoute('sign-in'),
    loadComponent: () => import('./sign-in.component').then((m) => m.SignInComponent),
  },
];
```

```html
<clerk-sign-in [props]="{ routing: 'path', path: '/sign-in', signUpUrl: '/sign-up' }" />
```

Omit `routing`/`path` and the component manages its own sub-navigation in place — this is how
the other three routed components (User Profile, Organization Profile, Create Organization)
are typically used, each already living at its own Angular route. See
[Quickstart]({% link quickstart.md %}) for the full route setup.

## Prop reactivity

11 of the 13 components — every one except Google One Tap and Authenticate With Redirect
Callback, both covered below — mount through a shared internal helper: it mounts once the
Clerk instance and host element are both ready, re-mounts whenever `[props]` genuinely
changes so the update takes effect, and unmounts when the component is destroyed. Inline
object literals that are structurally equal to the previous value do not trigger a re-mount,
so it's safe to bind a literal directly in the template rather than hoisting it to a class
field.

The two exceptions:

- **Google One Tap** opens once, the first time Clerk finishes loading, and closes on
  destroy — prop changes after that initial open are not re-applied.
- **Authenticate With Redirect Callback** never mounts anything into the DOM. It calls
  `handleRedirectCallback()` exactly once, the first time Clerk is available; changing
  `[props]` afterward has no effect since the callback already ran.

## Sign In

`clerk-sign-in` · `ClerkSignInComponent` · props: `SignInProps`

```html
<clerk-sign-in [props]="{ routing: 'path', path: '/sign-in', signUpUrl: '/sign-up' }" />
```

See [Authentication]({% link authentication.md %}) for the full catch-all route setup and the
auth button directives.

## Sign Up

`clerk-sign-up` · `ClerkSignUpComponent` · props: `SignUpProps`

```html
<clerk-sign-up [props]="{ routing: 'path', path: '/sign-up', signInUrl: '/sign-in' }" />
```

## User Profile

`clerk-user-profile` · `ClerkUserProfileComponent` · props: `UserProfileProps`

Account settings, email addresses, and security — the same UI `openUserProfile()` opens in a
modal, mounted in place instead. Supports [path routing](#path-routing).

```html
<clerk-user-profile />
```

## User Button

`clerk-user-button` · `ClerkUserButtonComponent` · props: `UserButtonProps`

Trigger button that opens the account menu, with sign-out and (from the menu) the user
profile.

```html
<clerk-user-button />
```

## User Avatar

`clerk-user-avatar` · `ClerkUserAvatarComponent` · props: `UserAvatarProps`

Just the user's avatar image, without the button chrome around it — useful in a list of items
that each belong to a user, like a session picker.

```html
<clerk-user-avatar />
```

## Organization Profile

`clerk-organization-profile` · `ClerkOrganizationProfileComponent` · props:
`OrganizationProfileProps`

Settings, members, and invitations for the active organization. Supports
[path routing](#path-routing). See [Organizations & roles]({% link organizations.md %}).

```html
<clerk-organization-profile />
```

## Organization Switcher

`clerk-organization-switcher` · `ClerkOrganizationSwitcherComponent` · props:
`OrganizationSwitcherProps`

Dropdown to switch the active organization, or the user's personal account.

```html
<clerk-organization-switcher />
```

## Create Organization

`clerk-create-organization` · `ClerkCreateOrganizationComponent` · props:
`CreateOrganizationProps`

Form to create a new organization. Supports [path routing](#path-routing).

```html
<clerk-create-organization />
```

## Organization List

`clerk-organization-list` · `ClerkOrganizationListComponent` · props: `OrganizationListProps`

Every organization the user belongs to, with actions to switch to one or create a new one.

```html
<clerk-organization-list />
```

## Waitlist

`clerk-waitlist` · `ClerkWaitlistComponent` · props: `WaitlistProps`

Collects an email address for Clerk's waitlist flow, used when sign-ups are gated behind
approval.

```html
<clerk-waitlist />
```

## Pricing Table

`clerk-pricing-table` · `ClerkPricingTableComponent` · props: `PricingTableProps`

Renders the plans configured for billing in the Clerk Dashboard.

```html
<clerk-pricing-table />
```

## Google One Tap

`clerk-google-one-tap` · `ClerkGoogleOneTapComponent` · props: `GoogleOneTapProps`

Google's One Tap sign-in prompt. Does not support path routing; see
[Prop reactivity](#prop-reactivity) above for its open-once behavior.

```html
<clerk-google-one-tap />
```

## Authenticate With Redirect Callback

`clerk-authenticate-with-redirect-callback` · `ClerkAuthenticateWithRedirectCallbackComponent`
· props: `HandleOAuthCallbackParams`

Completes an OAuth/SSO redirect flow. Renders nothing — place it on your callback route; see
[Prop reactivity](#prop-reactivity) above for its call-once behavior.

```html
<clerk-authenticate-with-redirect-callback
  [props]="{ signInFallbackRedirectUrl: '/dashboard', signUpFallbackRedirectUrl: '/dashboard' }" />
```

See [Authentication]({% link authentication.md %}) for the full `/sso-callback` route setup.

## Not yet supported

- **Custom pages and menu items** — `customPages` (User Profile, Organization Profile) and
  `customMenuItems` (User Button) exist on the underlying prop types, but there's no
  Angular-idiomatic way yet to author the raw `mount`/`unmount` DOM callbacks they expect.
- **`<APIKeys />`** — no dedicated component; `apiKeysProps` only configures the built-in API
  Keys page inside User Profile / Organization Profile.
- **`<OAuthConsent />`** — not wrapped.
- **Experimental billing buttons** (checkout, plan details, subscription details buttons) —
  only Pricing Table is wrapped.
- **Metamask and other Web3 wallet flows** — not wrapped.
- **Session tasks (Core 3)** — after-auth task routing (e.g. forced organization selection);
  pending sessions are treated as signed-in across the full auth surface. See
  [ClerkService]({% link clerk-service.md %}).
- **Server-side rendering** — client-side rendering only. See [Home]({% link index.md %}).
