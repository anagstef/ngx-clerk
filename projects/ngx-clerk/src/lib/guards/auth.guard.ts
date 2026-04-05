import { inject } from '@angular/core';
import { type CanActivateFn, type RouterStateSnapshot } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';
import { ClerkService } from '../services/clerk.service';

function checkAuth(clerk: ClerkService, state: RouterStateSnapshot): boolean {
  if (!clerk.isSignedIn()) {
    clerk.redirectToSignIn({ signInFallbackRedirectUrl: state.url });
    return false;
  }
  return true;
}

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
