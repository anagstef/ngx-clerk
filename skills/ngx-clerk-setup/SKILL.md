---
name: ngx-clerk-setup
description: Install and wire ngx-clerk (unofficial Clerk SDK for Angular) into an Angular 20+ standalone app — provider, sign-in/sign-up routes, route guards, and UI components.
---

# ngx-clerk setup

You are adding Clerk authentication to an Angular application using ngx-clerk v1.

## Prerequisites check

1. Angular 20 or newer (`ng version` or check `@angular/core` in package.json). If older, stop and tell the user to upgrade Angular first.
2. Standalone bootstrap (`bootstrapApplication` in `main.ts`). If the app uses NgModule bootstrap, convert it first (see "NgModule apps" below).
3. A Clerk publishable key. If the user doesn't have one: create an application at https://dashboard.clerk.com and copy the publishable key from **Configure → API keys**.

## Steps

### 1. Install

```bash
npm install ngx-clerk
```

### 2. Register the provider

In `app.config.ts`:

```ts
import { provideClerk } from 'ngx-clerk';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClerk({
      publishableKey: '<the user's pk_test_… or pk_live_… key>',
      signInUrl: '/sign-in',
      signUpUrl: '/sign-up',
    }),
  ],
};
```

Clerk initializes automatically at app startup. Never hardcode secret keys (`sk_…`) anywhere — ngx-clerk is client-side only and never needs one.

### 3. Add sign-in and sign-up routes

Clerk components use path routing with nested steps, so use the catch-all matcher:

```ts
// app.routes.ts
import { catchAllRoute } from 'ngx-clerk';

export const routes: Routes = [
  { matcher: catchAllRoute('sign-in'), component: SignInPageComponent },
  { matcher: catchAllRoute('sign-up'), component: SignUpPageComponent },
];
```

```ts
// sign-in-page.component.ts
import { Component } from '@angular/core';
import { ClerkSignInComponent } from 'ngx-clerk';

@Component({
  selector: 'app-sign-in-page',
  imports: [ClerkSignInComponent],
  template: `<clerk-sign-in [props]="{ routing: 'path', path: '/sign-in' }" />`,
})
export class SignInPageComponent {}
```

Mirror the same for sign-up (`ClerkSignUpComponent`, `<clerk-sign-up>`, path `/sign-up`).

### 4. Protect routes

```ts
import { canActivateClerk } from 'ngx-clerk';

{ path: 'dashboard', component: DashboardComponent, canActivate: [canActivateClerk] }
```

For role/permission gating: `canActivateProtect({ role: 'org:admin' }, { unauthorizedUrl: '/' })`.

### 5. Show auth state in templates

```html
<clerk-user-button *clerkSignedIn />
<button *clerkSignedOut clerkSignInButton>Sign in</button>
```

Import `ClerkUserButtonComponent`, `ClerkSignedInDirective`, `ClerkSignedOutDirective`, `ClerkSignInButtonDirective` in the component's `imports`.

### 6. Read auth state in code

```ts
import { ClerkService } from 'ngx-clerk';

export class MyComponent {
  clerk = inject(ClerkService);
  // Signals: clerk.user(), clerk.isSignedIn(), clerk.isLoaded(), clerk.userId(), …
  // Token for API calls: await clerk.getToken()
}
```

## NgModule apps

`provideClerk()` returns `EnvironmentProviders` and requires standalone bootstrap. Minimal conversion: create `app.config.ts` with the providers, switch `main.ts` to `bootstrapApplication(AppComponent, appConfig)`, make `AppComponent` standalone, delete `AppModule`.

## Verify

1. `ng build` — no type errors.
2. `ng serve` — visiting a guarded route while signed out redirects to `/sign-in`; the SignIn card renders; after signing in the guarded route renders and `<clerk-user-button />` appears.

## Full documentation

https://anagstef.github.io/ngx-clerk/llms-full.txt
