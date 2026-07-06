---
title: Session tokens
nav_order: 5
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

## In an HTTP interceptor

Attach the token to outgoing requests with a functional interceptor:

```ts
// src/app/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { ClerkService } from 'ngx-clerk';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
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
import { authInterceptor } from './auth.interceptor';

export const appConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    // …provideClerk, provideRouter, etc.
  ],
};
```
