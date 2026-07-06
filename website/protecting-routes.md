---
title: Protecting routes
nav_order: 4
---

# Protecting routes

## Require authentication

Use the `canActivateClerk` guard to restrict a route to signed-in users:

```ts
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { canActivateClerk } from 'ngx-clerk';

export const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [canActivateClerk],
    loadComponent: () => import('./dashboard.component').then((m) => m.DashboardComponent),
  },
];
```

`canActivateClerk` is race-free: if Clerk hasn't finished loading yet when the route is activated, the guard waits for `isLoaded()` to become `true` before deciding, instead of evaluating a stale or default auth state. Once loaded, unauthenticated users are redirected to the Clerk sign-in page.

## Require a role or permission

`canActivateProtect` creates a guard that restricts a route to users satisfying an authorization condition, with this signature:

```ts
function canActivateProtect(
  params: CheckAuthorizationParams,
  options: CanActivateProtectOptions = {},
): CanActivateFn
```

`params` is the same `{ role | permission | feature | plan }` shape accepted by `has()` and `*clerkProtect`. `options.unauthorizedUrl` is where a signed-in-but-unauthorized user is redirected; omit it and they're simply blocked (the guard returns `false`). Unauthenticated users are always redirected to sign-in first:

```ts
import { canActivateProtect } from 'ngx-clerk';

export const routes: Routes = [
  {
    path: 'admin',
    canActivate: [canActivateProtect({ role: 'org:admin' }, { unauthorizedUrl: '/dashboard' })],
    loadComponent: () => import('./admin.component').then((m) => m.AdminComponent),
  },
];
```

## Gate UI with `*clerkProtect`

Protect part of a template by role, permission, feature, or plan. An optional `else` template renders when the user is unauthorized:

```html
<section *clerkProtect="{ role: 'org:admin' }; else noAccess">
  Admins only
</section>
<ng-template #noAccess>You do not have access.</ng-template>
```

For conditions that don't reduce to a single role/permission/feature/plan check, pass a predicate over `has` instead — this is the `ClerkProtectCondition` type exported from `ngx-clerk`:

```html
<section *clerkProtect="isBillingAdmin">Manage billing</section>
```

```ts
import type { CheckAuthorizationWithCustomPermissions } from 'ngx-clerk';

readonly isBillingAdmin = (has: CheckAuthorizationWithCustomPermissions) =>
  has({ role: 'org:admin' }) || has({ permission: 'org:billing:manage' });
```

Both guards and `*clerkProtect` evaluate their conditions against the active organization. See [Reading auth state]({% link reading-auth-state.md %}) for the `organization()`, `orgRole()`, and `membership()` signals backing them.

## Check authorization imperatively

`ClerkService.has()` returns a boolean for the same conditions:

```ts
if (clerk.has({ permission: 'org:posts:manage' })) {
  // …
}
```
