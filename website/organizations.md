---
title: Organizations & roles
nav_order: 7
description: How to render organization components and gate access by role, permission, feature, or plan.
---

# Organizations & roles

Clerk's organizations feature lets users belong to shared workspaces with roles and
permissions. ngx-clerk covers it with four prebuilt components, an authorization check on
`ClerkService`, the `*clerkProtect` directive, and the `canActivateProtect` guard.

## Organization components

Four of the [13 components]({% link components.md %}) manage organizations. They mount the
same way as every other Clerk component, with no required `[props]`:

| Component | Selector | Renders |
| --- | --- | --- |
| `ClerkOrganizationSwitcherComponent` | `clerk-organization-switcher` | dropdown to switch the active organization or personal account |
| `ClerkOrganizationProfileComponent` | `clerk-organization-profile` | settings, members, and invitations for the active organization |
| `ClerkCreateOrganizationComponent` | `clerk-create-organization` | form to create a new organization |
| `ClerkOrganizationListComponent` | `clerk-organization-list` | every organization the user belongs to, with actions to switch or create |

```ts
// src/app/dashboard/dashboard-home.component.ts
import { Component } from '@angular/core';
import { ClerkOrganizationSwitcherComponent } from 'ngx-clerk';

@Component({
  selector: 'app-dashboard-home',
  imports: [ClerkOrganizationSwitcherComponent],
  template: `<clerk-organization-switcher />`,
})
export class DashboardHomeComponent {}
```

`ClerkOrganizationProfileComponent`, `ClerkCreateOrganizationComponent`, and
`ClerkOrganizationListComponent` follow the same pattern — `<clerk-organization-profile />`,
`<clerk-create-organization />`, `<clerk-organization-list />`. See
[Components]({% link components.md %}) for their full `[props]` types and path-routing support.

## Checking roles, permissions, features, and plans

`ClerkService.has()` checks the current user's authorization against the cached session JWT
claims — it never makes a network request:

```ts
has(params: CheckAuthorizationParams): boolean
```

`CheckAuthorizationParams` (exported from `ngx-clerk`) accepts the same
`{ role | permission | feature | plan }` shape used by `*clerkProtect` and route guards —
exactly one of the four:

```ts
clerk.has({ role: 'org:admin' });
clerk.has({ permission: 'org:posts:manage' });
clerk.has({ feature: 'user:premium_support' });
clerk.has({ plan: 'org:pro' });
```

`role` and `permission` are evaluated against the **active organization** — both are `false`
if there's no active organization, even for a signed-in user. `feature` and `plan` are looked
up by scope prefix (`org:` or `user:`) in the session claims. **While signed out, `has()`
always returns `false`**, regardless of the params passed. See
[Roles and permissions](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions)
and [features and plans](https://clerk.com/docs/guides/billing/overview) for how these are
configured in the Clerk Dashboard.

## Gate UI with `*clerkProtect`

`*clerkProtect` renders its content only when the condition is authorized, with an optional
`else` template for the unauthorized case:

```html
<section *clerkProtect="{ role: 'org:admin' }; else notAdmin">
  You have the <code>org:admin</code> role in the active organization.
</section>
<ng-template #notAdmin>
  You need the <code>org:admin</code> role to see this content.
</ng-template>
```

See [Protecting routes]({% link protecting-routes.md %}) for the predicate form
(`*clerkProtect="fn"`) and the rest of the guard reference.

## Guard a route by role

`canActivateProtect` creates a guard from the same `CheckAuthorizationParams` shape.
Unauthenticated users are redirected to sign-in; signed-in-but-unauthorized users are blocked
or sent to `unauthorizedUrl`:

```ts
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { canActivateProtect } from 'ngx-clerk';

export const routes: Routes = [
  {
    path: 'admin',
    canActivate: [canActivateProtect({ role: 'org:admin' }, { unauthorizedUrl: '/dashboard' })],
    loadComponent: () => import('./admin.component').then((m) => m.AdminComponent),
  },
];
```

## Reading organization state

`ClerkService` exposes the active organization as signals — see
[Reading auth state]({% link reading-auth-state.md %}) for the complete signal table and
[ClerkService]({% link clerk-service.md %}) for every method:

| Signal | Description |
| --- | --- |
| `organization()` | the active organization resource, or `null` if none is active |
| `orgId()`, `orgSlug()` | the active organization's ID and slug |
| `orgRole()` | the current user's role in the active organization |
| `membership()` | the current user's membership in the active organization — carries `.role` and `.permissions` |

```ts
const clerk = inject(ClerkService);
clerk.orgRole(); // e.g. 'org:admin', or null with no active organization
clerk.membership()?.permissions; // e.g. ['org:posts:manage', …]
```

Switch the active organization with `setActive()`:

```ts
await clerk.setActive({ organization: orgId });
```
