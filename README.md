# ngx-clerk

Welcome to **ngx-clerk**, an unofficial Angular package that integrates with [Clerk](https://clerk.com/).

### Disclaimer: This unofficial package is not affiliated with Clerk.com. It is an unofficial project that aims to provide a seamless integration of Clerk features into Angular applications.

## Prerequisites

- Angular version **19 or higher**.
- Clerk Core 3 (ClerkJS v6).
- Currently, this package supports **client-side operations only**. Server-Side Rendering (SSR) is not supported at the moment.

## Installation

```bash
npm i ngx-clerk
```

## Getting Started

1. Create an app in [Clerk Dashboard](https://dashboard.clerk.com/) and get the Publishable Key.
2. **Add `provideClerk()` to your app config**:

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

3. **Use Clerk components in your templates**:

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClerkUserButtonComponent } from 'ngx-clerk';

@Component({
  selector: 'app-root',
  standalone: true,
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
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [canActivateClerk],
  },
];
```

5. **Access auth state** via signals on `ClerkService`:

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

## Features

- **Clerk UI Components**: All Clerk UI components are available and prefixed with `clerk-`:
    1. `<clerk-sign-in />`
    2. `<clerk-sign-up />`
    3. `<clerk-user-profile />`
    4. `<clerk-user-button />`
    5. `<clerk-organization-profile />`
    6. `<clerk-organization-switcher />`
    7. `<clerk-organization-list />`
    8. `<clerk-create-organization />`
    9. `<clerk-waitlist />`
    10. `<clerk-user-avatar />`
    11. `<clerk-pricing-table />`

- **ClerkService**: Central service exposing auth state as Angular signals:
    - `user()` - Current `UserResource` or `null`
    - `session()` - Current `ActiveSessionResource` or `null`
    - `organization()` - Current `OrganizationResource` or `null`
    - `client()` - Current `ClientResource` or `null`
    - `clerk()` - The Clerk instance or `null`
    - `isLoaded()` - Whether Clerk has finished loading
    - `isSignedIn()` - Whether the user is signed in
    - `userId()` - Current user ID or `null`
    - `orgId()` - Current organization ID or `null`

- **`canActivateClerk`**: A functional route guard that protects routes and waits for Clerk to load before checking auth state.

## Migrating from v0.x

See [MIGRATION.md](./MIGRATION.md) for a detailed upgrade guide.
