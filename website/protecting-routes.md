---
title: Protecting routes
nav_order: 4
---

# Protecting routes

## Require authentication

Use the `canActivateClerk` guard to restrict a route to signed-in users. It waits for Clerk to load, then redirects unauthenticated users to sign-in:

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

## Require a role or permission

`canActivateProtect` restricts a route to users that satisfy an authorization condition. Signed-in-but-unauthorized users are blocked, or redirected to `unauthorizedUrl` when provided:

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

## Check authorization imperatively

`ClerkService.has()` returns a boolean for the same conditions:

```ts
if (clerk.has({ permission: 'org:posts:manage' })) {
  // …
}
```
