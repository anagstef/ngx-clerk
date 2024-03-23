import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable, map, take } from "rxjs";
import { ClerkService } from "../services/clerk.service";

@Injectable({ providedIn: 'root' })
export class ClerkAuthGuardService implements CanActivate {
  constructor(private readonly _clerk: ClerkService, private readonly _router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this._clerk.user$.pipe(
      take(1),
      map(user => {
        if (!user?.id) {
          this._clerk.redirectToSignIn({ afterSignInUrl: state.url });
          return false;
        }
        if (state.url.includes('__clerk_db_jwt') || state.url.includes('__clerk_handshake')) {
          const url = state.url.split('?');
          const searchParams = new URLSearchParams(url[1]);
          searchParams.delete('__clerk_db_jwt');
          searchParams.delete('__clerk_handshake');
          const newUrl = url[0] + (searchParams.toString() ? '?' + searchParams.toString() : '');
          this._router.navigateByUrl(newUrl, { replaceUrl: true });
          return false;
        }
        return true;
      })
    );
  }
}