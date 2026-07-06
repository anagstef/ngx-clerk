import { inject } from '@angular/core';
import { Router, type CanActivateFn, type RouterStateSnapshot, type UrlTree } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';
import { ClerkService, type CheckAuthorizationParams } from '../services/clerk.service';

function checkAuth(clerk: ClerkService, state: RouterStateSnapshot): boolean {
  if (!clerk.isSignedIn()) {
    clerk.redirectToSignIn({ signInFallbackRedirectUrl: state.url });
    return false;
  }
  return true;
}

/**
 * Route guard that restricts access to authenticated users.
 * Redirects unauthenticated users to the Clerk sign-in page.
 *
 * @example
 * ```ts
 * const routes: Routes = [
 *   { path: 'dashboard', component: DashboardComponent, canActivate: [canActivateClerk] },
 * ];
 * ```
 */
export const canActivateClerk: CanActivateFn = (_route, state) => {
  const clerk = inject(ClerkService);

  if (clerk.isLoaded()) {
    return checkAuth(clerk, state);
  }

  return toObservable(clerk.isLoaded).pipe(
    filter((loaded) => loaded),
    take(1),
    map(() => checkAuth(clerk, state)),
  );
};

/** Options for {@link canActivateProtect}. */
export interface CanActivateProtectOptions {
  /** Where to redirect a signed-in but unauthorized user. Defaults to blocking (returns `false`). */
  unauthorizedUrl?: string;
}

/**
 * Creates a route guard that restricts access to users satisfying an
 * authorization condition (role, permission, feature, or plan). Unauthenticated
 * users are redirected to sign-in; signed-in-but-unauthorized users are blocked
 * (or redirected to `unauthorizedUrl`).
 *
 * @example
 * ```ts
 * const routes: Routes = [
 *   {
 *     path: 'admin',
 *     component: AdminComponent,
 *     canActivate: [canActivateProtect({ role: 'org:admin' }, { unauthorizedUrl: '/dashboard' })],
 *   },
 * ];
 * ```
 */
export function canActivateProtect(
  params: CheckAuthorizationParams,
  options: CanActivateProtectOptions = {},
): CanActivateFn {
  return (_route, state) => {
    const clerk = inject(ClerkService);
    const router = inject(Router);

    const check = (): boolean | UrlTree => {
      if (!clerk.isSignedIn()) {
        clerk.redirectToSignIn({ signInFallbackRedirectUrl: state.url });
        return false;
      }
      if (clerk.has(params)) {
        return true;
      }
      return options.unauthorizedUrl ? router.parseUrl(options.unauthorizedUrl) : false;
    };

    if (clerk.isLoaded()) {
      return check();
    }

    return toObservable(clerk.isLoaded).pipe(
      filter((loaded) => loaded),
      take(1),
      map(() => check()),
    );
  };
}
