---
title: Session tokens
nav_order: 6
description: How to retrieve session JWTs with getToken() and attach them to backend requests.
---

# Session tokens

Call `ClerkService.getToken()` to retrieve the current session JWT and authenticate requests to your backend. It resolves to `null` when no user is signed in.

```ts
const token = await clerk.getToken();
```

You can also request a token for a specific [JWT template](https://clerk.com/docs/backend-requests/making/jwt-templates):

```ts
const token = await clerk.getToken({ template: 'my-template' });
```

## Handling offline errors

In Clerk Core 3, `getToken()` throws a `ClerkOfflineError` — instead of resolving to `null` — when the request fails because the client is offline. Catch it with the `isClerkRuntimeError` guard, or the more specific `ClerkOfflineError.is()`:

```ts
import { ClerkOfflineError, isClerkRuntimeError } from 'ngx-clerk';

try {
  const token = await clerk.getToken();
} catch (error) {
  if (ClerkOfflineError.is(error)) {
    // the client is offline — show a banner, retry later, etc.
  } else if (isClerkRuntimeError(error)) {
    // some other Clerk runtime error; error.code has the details
  } else {
    throw error;
  }
}
```

## In an HTTP interceptor

Attach the token to outgoing requests with a functional interceptor:

```ts
// src/app/clerk-auth.interceptor.ts
import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { from, switchMap } from 'rxjs';
import { ClerkService } from 'ngx-clerk';

export const clerkAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const clerk = inject(ClerkService);
  return from(clerk.getToken()).pipe(
    switchMap((token) =>
      next(token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req),
    ),
  );
};
```

Register it in your app config:

```ts
// src/app/app.config.ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { clerkAuthInterceptor } from './clerk-auth.interceptor';

export const appConfig = {
  providers: [
    provideHttpClient(withInterceptors([clerkAuthInterceptor])),
    // …provideClerk, provideRouter, etc.
  ],
};
```
