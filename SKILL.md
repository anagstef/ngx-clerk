# ngx-clerk v0.x to v1.0 Migration Skill

You are migrating an Angular application from ngx-clerk v0.x (Clerk Core 2 / ClerkJS v5) to ngx-clerk v1.0 (Clerk Core 3 / ClerkJS v6).

## Prerequisites

- The target app must be on Angular 19 or higher. If it's on Angular 17 or 18, upgrade Angular first.
- Node.js 20.9+.

## Step-by-step migration

### 1. Update dependencies

```bash
npm install ngx-clerk@1
```

Remove `@clerk/types` from `package.json` if present -- it's been merged into `@clerk/shared/types` and is installed automatically.

### 2. Replace `__init()` with `provideClerk()`

**Find** the `ClerkService.__init()` call. It's typically in `app.component.ts`:

```typescript
// OLD -- delete this
import { ClerkService } from 'ngx-clerk';

constructor(private clerk: ClerkService) {
  clerk.__init({ publishableKey: '...', afterSignInUrl: '/dashboard' });
}
```

**Replace** with `provideClerk()` in the app's provider configuration.

If the app uses **standalone bootstrap** (`bootstrapApplication` in `main.ts`), add it to `app.config.ts`:

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClerk } from 'ngx-clerk';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClerk({
      publishableKey: 'pk_test_...',
    }),
  ],
};
```

If the app uses **NgModule bootstrap** (`AppModule`), you cannot use `provideClerk()` directly because it returns `EnvironmentProviders`. You must first convert the app to standalone bootstrap. The minimal conversion is:

1. Create `app.config.ts` with `provideClerk()` and other providers.
2. Change `main.ts` from `platformBrowserDynamic().bootstrapModule(AppModule)` to `bootstrapApplication(AppComponent, appConfig)`.
3. Make `AppComponent` standalone with `standalone: true` and move its template dependencies to the `imports` array.
4. Delete `AppModule`.

After moving to `provideClerk()`, remove the `ClerkService` import and constructor injection from `AppComponent` -- Clerk now initializes automatically via `APP_INITIALIZER`.

### 3. Rename redirect props

Apply these renames in `provideClerk()` options, component props, and any `redirectToSignIn()`/`redirectToSignUp()` calls:

| Old (v0.x)                     | New (v1.0)                       |
|--------------------------------|----------------------------------|
| `afterSignInUrl`               | `signInFallbackRedirectUrl`      |
| `afterSignUpUrl`               | `signUpFallbackRedirectUrl`      |
| `afterSwitchOrganizationUrl`   | `afterSelectOrganizationUrl`     |
| `redirectUrl`                  | `signInFallbackRedirectUrl`      |

For forced redirects, use `signInForceRedirectUrl` / `signUpForceRedirectUrl`.

### 4. Replace RxJS observables with signals

**Search** the codebase for these patterns and replace them:

| Find                          | Replace with                   |
|-------------------------------|--------------------------------|
| `clerk.clerk$`                | `clerk.clerk()`                |
| `clerk.user$`                 | `clerk.user()`                 |
| `clerk.session$`              | `clerk.session()`              |
| `clerk.client$`               | `clerk.client()`               |
| `clerk.organization$`         | `clerk.organization()`         |
| `.pipe(take(1)).subscribe(`   | Direct signal read             |
| `\| async`                    | Direct signal read in template |

**Template migration:**

```html
<!-- OLD -->
<div *ngIf="clerk.user$ | async as user">{{ user.firstName }}</div>

<!-- NEW -->
@if (clerk.user(); as user) {
  <p>{{ user.firstName }}</p>
}
```

**Component class migration:**

```typescript
// OLD
constructor(public clerk: ClerkService) {}

// NEW
clerk = inject(ClerkService);
```

**Imperative access migration:**

```typescript
// OLD
this.clerk.user$.pipe(take(1)).subscribe(user => { ... });

// NEW
const user = this.clerk.user(); // synchronous read
// or use effect() for reactive code:
effect(() => {
  const user = this.clerk.user();
  // runs whenever user changes
});
```

**New derived signals** (no v0.x equivalent):
- `clerk.isLoaded()` -- `boolean`, true when Clerk has finished initializing
- `clerk.isSignedIn()` -- `boolean`, true when user is signed in
- `clerk.userId()` -- `string | null`
- `clerk.orgId()` -- `string | null`

If the app still needs an Observable, use `toObservable()`:

```typescript
import { toObservable } from '@angular/core/rxjs-interop';
user$ = toObservable(this.clerk.user);
```

### 5. Replace auth guard

**Search** for `ClerkAuthGuardService` and replace with `canActivateClerk`:

```typescript
// OLD
import { ClerkAuthGuardService } from 'ngx-clerk';
canActivate: [ClerkAuthGuardService]

// NEW
import { canActivateClerk } from 'ngx-clerk';
canActivate: [canActivateClerk]
```

### 6. Update type imports

If the app imports types directly from `@clerk/types`, update them:

```typescript
// OLD
import type { UserResource } from '@clerk/types';

// NEW
import type { UserResource } from 'ngx-clerk';
```

Types re-exported from `ngx-clerk` are unchanged -- they now come from `@clerk/shared/types` internally but the consumer import path is the same.

### 7. Update upstream Clerk Core 3 API renames

Search for and replace these deprecated patterns:

| Old                        | New                          |
|----------------------------|------------------------------|
| `client.activeSessions`    | `client.sessions`            |
| `strategy: 'saml'`        | `strategy: 'enterprise_sso'` |
| `user.samlAccounts`        | `user.enterpriseAccounts`    |
| `appearance.layout`        | `appearance.options`         |

### 8. Verify

After all changes:
1. Run `ng build` and fix any type errors.
2. Run `ng serve` and test:
   - Sign in / sign up flows work.
   - Protected routes redirect to sign-in when not authenticated.
   - User data renders correctly from signals.
   - Clerk UI components (`<clerk-user-button />`, etc.) render.

## Files typically modified

| File | Changes |
|------|---------|
| `package.json` | Update `ngx-clerk`, remove `@clerk/types` |
| `app.config.ts` (or `app.module.ts` -> standalone conversion) | Add `provideClerk()`, remove `ClerkService` init |
| `app.component.ts` | Remove `ClerkService` injection and `__init()` call |
| `app.routes.ts` / routing config | `ClerkAuthGuardService` -> `canActivateClerk` |
| Any component using `clerk.user$` etc. | RxJS -> signals |
| Any template with `\| async` on Clerk data | Signal reads |

## Common mistakes

- **Forgetting to remove `__init()`** from `AppComponent` after adding `provideClerk()` -- this causes double initialization.
- **Using `clerk.user$` syntax** with signals -- signals are called as `clerk.user()`, not `clerk.user$`.
- **Not converting to standalone bootstrap** -- `provideClerk()` returns `EnvironmentProviders` which requires `bootstrapApplication()`, not `NgModule`.
- **Using `afterSignInUrl`** -- renamed to `signInFallbackRedirectUrl` in Core 3.
- **Importing from `@clerk/types`** -- package no longer exists, use `ngx-clerk` or `@clerk/shared/types`.
