---
title: Quickstart
nav_order: 2
---

# Quickstart

Add authentication to a new Angular app with ngx-clerk.

## Before you start

- [Create a Clerk application](https://dashboard.clerk.com/) in the Clerk Dashboard and copy your **Publishable Key**.
- This guide assumes a standalone Angular 20+ app with the router.

## Create a new Angular app

```bash
ng new my-app --routing --style=css
cd my-app
```

## Install ngx-clerk

```bash
npm install ngx-clerk
```

## Set your Clerk Publishable Key

Add your key to the environment file:

```ts
// src/environments/environment.ts
export const environment = {
  clerkPublishableKey: 'pk_test_XXXXXXXX',
};
```

## Add `provideClerk` to your app

Register Clerk in your application config with your Publishable Key:

```ts
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClerk } from 'ngx-clerk';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClerk({ publishableKey: environment.clerkPublishableKey }),
  ],
};
```

## Add Clerk components

Use the control-flow directives and the user button to build a header that reacts to auth state:

```ts
// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  ClerkSignedInDirective,
  ClerkSignedOutDirective,
  ClerkUserButtonComponent,
} from 'ngx-clerk';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, ClerkSignedInDirective, ClerkSignedOutDirective, ClerkUserButtonComponent],
  template: `
    <header>
      <a *clerkSignedOut routerLink="/sign-in">Sign in</a>
      <clerk-user-button *clerkSignedIn />
    </header>
    <router-outlet />
  `,
})
export class AppComponent {}
```

Add a catch-all route for the sign-in page (covered in full under [Authentication]({% link authentication.md %})):

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

## Run your app

```bash
ng serve
```

Open `http://localhost:4200`. You'll see the **Sign in** link; once you've signed in, the user button appears in its place.

## Create your first user

1. Run your app and click **Sign in**.
2. Complete the sign-up flow in the Clerk UI.
3. Find the new user in the [Clerk Dashboard](https://dashboard.clerk.com/) under **Users**.

## Next steps

- [Authentication]({% link authentication.md %}) — sign-in/up components, auth buttons, and control-flow directives
- [Protecting routes]({% link protecting-routes.md %}) — route guards and the `*clerkProtect` directive
- [Session tokens]({% link session-tokens.md %}) — authenticate your backend with `getToken()`
- [Reading auth state]({% link reading-auth-state.md %}) — access the current user, session, and organization
