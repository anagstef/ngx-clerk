# ngx-clerk

Welcome to **ngx-clerk**, an unofficial Angular package that integrates with [Clerk](https://clerk.com/).

### ⚠️ Disclaimer: This unofficial package is not affiliated with Clerk.com. It is an unofficial project that aims to provide a seamless integration of Clerk features into Angular applications.

## Prerequisites

- Angular version **17 or higher**.
- Currently, this package supports **client-side operations only**. Server-Side Rendering (SSR) is not supported at the moment.

## Installation

To install `ngx-clerk`, run the following command in your project directory:

```bash
npm i ngx-clerk
```

## Getting Started

To begin using `ngx-clerk` in your project, follow these steps:
1. Create an app in [Clerk Dashboard](https://dashboard.clerk.com/) and get the Publishable Key.
2. **Inject the ClerkService**: In your `app.component.ts`, inject the `ClerkService` and call its `__init` method. You need to provide at least the Publishable Key and, optionally, any `ClerkOptions`.
```typescript
// Example: app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClerkService } from 'ngx-clerk';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private _clerk: ClerkService) {
    this._clerk.__init({ 
      publishableKey: 'pk_test_XXXXXXXX'
     });
  }
}

```
3. **Utilize Observables**: Use the observables provided by the `ClerkService` to access and manage the state throughout your application.
4. **Route Guarding**: Leverage the guard to protect routes, ensuring that certain parts of your application are accessible only after authentication.
```typescript
// Example: app-routes.ts
import { Routes } from '@angular/router';
import { catchAllRoute, AuthGuardService } from 'ngx-clerk';
import { UserProfilePageComponent } from './pages/user-profile-page.component';
import { HomePageComponent } from './pages/home-page.component';

export const routes: Routes = [
    { 
        matcher: catchAllRoute('user'), 
        component: UserProfilePageComponent, 
        canActivate: [AuthGuardService] 
    },
    { 
        path: '', 
        component: HomePageComponent
    }
];

```

## Features

- **Clerk UI Components**: All Clerk UI components are readily available and prefixed with `clerk-`. Available components:
    1. `<clerk-sign-in />`
    2. `<clerk-sign-up />`
    3. `<clerk-user-profile />`
    4. `<clerk-user-button />`
    5. `<clerk-organization-profile />`
    6. `<clerk-organization-switcher />`
    7. `<clerk-organization-list />`
    8. `<clerk-create-organization />`

- **ClerkService**: This service is a central part of the package, offering observables for various Clerk resources:
    - `user$` - Emits every time the `UserResource` is updated
    - `session$` - Emits every time the `SessionResource` is updated
    - `organization$` - Emits every time the `OrganizationResource` is updated
    - `client$` - Emits every time the `ClientResource` is updated
    - `clerk$` - Emits when Clerk has loaded
- **AuthGuardService**: This service implements a `canActivate` that can be used to protect routes in your application.

## Remaining Tasks

While `ngx-clerk` aims to provide a comprehensive solution for integrating Clerk into Angular applications, there are several areas that are still under development:

- Enhanced API for Custom Pages.
- Implement support for Organization multidomain and proxy features.
- Add support for Server-Side Rendering (SSR) and Static Site Generation (SSG).

We welcome contributions and suggestions from the community to help us address these tasks and improve `ngx-clerk`.