# Migrating from ngx-clerk v0.x to v1.0

This guide covers all breaking changes when upgrading from ngx-clerk v0.x (Clerk Core 2 / ClerkJS v5) to v1.0 (Clerk Core 3 / ClerkJS v6).

## Requirements

- **Angular 19+** (v0.x supported Angular 17+)
- **Node.js 20.9+**

## 1. Update the package

```bash
npm install ngx-clerk@1
```

This will also install `@clerk/shared@4.x` automatically. You can remove `@clerk/types` if you had it as a direct dependency -- it's no longer needed.

## 2. Initialization: Replace `__init()` with `provideClerk()`

The manual initialization in your component is replaced by a provider in your app config.

**Before (v0.x):**

```typescript
// app.component.ts
import { ClerkService } from 'ngx-clerk';

@Component({ ... })
export class AppComponent {
  constructor(private clerk: ClerkService) {
    clerk.__init({
      publishableKey: 'pk_test_...',
      afterSignInUrl: '/dashboard',
    });
  }
}
```

**After (v1.0):**

```typescript
// app.config.ts
import { provideClerk } from 'ngx-clerk';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClerk({
      publishableKey: 'pk_test_...',
      signInFallbackRedirectUrl: '/dashboard',
    }),
  ],
};
```

Remove the `__init()` call from your component entirely. Clerk now initializes automatically when the app starts.

## 3. State access: Replace RxJS observables with signals

All state on `ClerkService` is now exposed as Angular signals instead of RxJS `ReplaySubject` streams.

**Before (v0.x):**

```typescript
// Component class
constructor(public clerk: ClerkService) {}

// Template
<div *ngIf="clerk.user$ | async as user">
  Hello {{ user.firstName }}
</div>

// Imperative
clerk.user$.subscribe(user => console.log(user));
```

**After (v1.0):**

```typescript
// Component class
clerk = inject(ClerkService);

// Template
@if (clerk.user(); as user) {
  <p>Hello {{ user.firstName }}</p>
}

// Imperative (in an effect or computed)
effect(() => {
  const user = this.clerk.user();
  console.log(user);
});
```

### Signal reference

| v0.x (RxJS)        | v1.0 (Signal)          |
|---------------------|------------------------|
| `clerk.clerk$`      | `clerk.clerk()`        |
| `clerk.user$`       | `clerk.user()`         |
| `clerk.session$`    | `clerk.session()`      |
| `clerk.client$`     | `clerk.client()`       |
| `clerk.organization$` | `clerk.organization()` |
| n/a                 | `clerk.isLoaded()`     |
| n/a                 | `clerk.isSignedIn()`   |
| n/a                 | `clerk.userId()`       |
| n/a                 | `clerk.orgId()`        |

### If you still need an Observable

Use `toObservable()` from `@angular/core/rxjs-interop`:

```typescript
import { toObservable } from '@angular/core/rxjs-interop';

user$ = toObservable(this.clerk.user);
```

## 4. Auth guard: Replace `ClerkAuthGuardService` with `canActivateClerk`

**Before (v0.x):**

```typescript
import { ClerkAuthGuardService } from 'ngx-clerk';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [ClerkAuthGuardService],
  },
];
```

**After (v1.0):**

```typescript
import { canActivateClerk } from 'ngx-clerk';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [canActivateClerk],
  },
];
```

The new guard also fixes a race condition where the old guard could check auth state before Clerk finished loading.

## 5. Redirect prop renames (Clerk Core 3)

Several redirect-related properties have been renamed in Clerk Core 3. Update them anywhere you pass options to Clerk components or methods.

| v0.x                          | v1.0                            |
|-------------------------------|---------------------------------|
| `afterSignInUrl`              | `signInFallbackRedirectUrl`     |
| `afterSignUpUrl`              | `signUpFallbackRedirectUrl`     |
| `afterSwitchOrganizationUrl`  | `afterSelectOrganizationUrl`    |
| `redirectUrl`                 | `signInFallbackRedirectUrl`     |

For forced redirects (always redirect, ignore the URL the user was trying to visit), use `signInForceRedirectUrl` / `signUpForceRedirectUrl`.

## 6. Type imports

Types are still re-exported from `ngx-clerk`, so your existing imports continue to work:

```typescript
import type { UserResource, SessionResource } from 'ngx-clerk';
```

Under the hood, these now come from `@clerk/shared/types` instead of `@clerk/types`. If you were importing directly from `@clerk/types`, update those imports:

```typescript
// Before
import type { UserResource } from '@clerk/types';

// After
import type { UserResource } from 'ngx-clerk';
// or
import type { UserResource } from '@clerk/shared/types';
```

## 7. New components

v1.0 adds three new components:

```html
<!-- Waitlist -->
<clerk-waitlist [props]="waitlistProps"></clerk-waitlist>

<!-- User Avatar -->
<clerk-user-avatar [props]="avatarProps"></clerk-user-avatar>

<!-- Pricing Table -->
<clerk-pricing-table [props]="pricingProps"></clerk-pricing-table>
```

Import them from `ngx-clerk`:

```typescript
import {
  ClerkWaitlistComponent,
  ClerkUserAvatarComponent,
  ClerkPricingTableComponent,
} from 'ngx-clerk';
```

## 8. Other Clerk Core 3 breaking changes

These are upstream Clerk changes that may affect your app:

- **`client.activeSessions`** is now **`client.sessions`**
- **`strategy: 'saml'`** is now **`strategy: 'enterprise_sso'`**
- **`user.samlAccounts`** is now **`user.enterpriseAccounts`**
- **`hideSlug` prop** on organization components has been removed (manage via Clerk Dashboard)
- **`appearance.layout`** is now **`appearance.options`**
- **`getToken()`** now throws `ClerkOfflineError` when offline (previously returned `null`)

For the full list of Clerk Core 3 changes, see the [official upgrade guide](https://clerk.com/docs/guides/development/upgrading/upgrade-guides/core-3).

## Quick migration checklist

- [ ] Update to Angular 19+ and Node.js 20.9+
- [ ] Install `ngx-clerk@1`
- [ ] Remove `@clerk/types` from your `package.json` if present
- [ ] Replace `__init()` call with `provideClerk()` in `app.config.ts`
- [ ] Replace `clerk.user$` / `| async` with `clerk.user()` signals in templates
- [ ] Replace `ClerkAuthGuardService` with `canActivateClerk` in routes
- [ ] Rename `afterSignInUrl` to `signInFallbackRedirectUrl` (and similar)
- [ ] Update any direct `@clerk/types` imports to `ngx-clerk` or `@clerk/shared/types`
- [ ] Test your auth flows
