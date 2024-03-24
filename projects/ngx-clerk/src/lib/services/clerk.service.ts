import { Injectable, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ActiveSessionResource, Clerk, ClerkOptions, ClientResource, CreateOrganizationProps, OrganizationProfileProps, OrganizationResource, SignInProps, SignInRedirectOptions, SignUpProps, SignUpRedirectOptions, UserProfileProps, UserResource, Without } from '@clerk/types';
import { ReplaySubject, take } from 'rxjs';
import { ClerkInitOptions } from '../utils/types';
import { loadClerkJsScript } from '../utils/loadClerkJsScript';

interface HeadlessBrowserClerk extends Clerk {
  load: (opts?: Without<ClerkOptions, 'isSatellite'>) => Promise<void>;
  updateClient: (client: ClientResource) => void;
}

interface BrowserClerk extends HeadlessBrowserClerk {
  onComponentsReady: Promise<void>;
  components: any;
}

declare global {
  interface Window {
    Clerk: HeadlessBrowserClerk | BrowserClerk;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ClerkService {
  public readonly clerk$: ReplaySubject<HeadlessBrowserClerk | BrowserClerk> = new ReplaySubject(1);
  public readonly client$: ReplaySubject<ClientResource | undefined> = new ReplaySubject(1);
  public readonly session$: ReplaySubject<ActiveSessionResource | undefined | null> = new ReplaySubject(1);
  public readonly user$: ReplaySubject<UserResource | undefined | null> = new ReplaySubject(1);
  public readonly organization$: ReplaySubject<OrganizationResource | undefined  | null> = new ReplaySubject(1);

  private _initialized: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private _router: Router,
    private _ngZone: NgZone) {} 

  public __init(options: ClerkInitOptions) {
    if (!isPlatformBrowser(this.platformId)) {
      // ClerkService can only be used in the browser
      return;
    }
    if (this._initialized) {
      console.warn('ClerkService already initialized');
      return;
    }
    this._initialized = true;
    loadClerkJsScript(options).then(async () => {
      await window.Clerk.load({
        routerPush: (to: string) => this._ngZone.run(() => {
          const url = new URL(to.replace('#/', ''), 'http://dummy.clerk');
          const queryParams = Object.fromEntries((url.searchParams as any).entries());
          return this._router.navigate([url.pathname], { queryParams });
        }), 
        routerReplace: (to: string) => this._ngZone.run(() => {
          const url = new URL(to.replace('#/', ''), 'http://dummy.clerk');
          const queryParams = Object.fromEntries((url.searchParams as any).entries());
          return this._router.navigate([url.pathname], { queryParams, replaceUrl: true });
        }),
        ...options
      });
      this.client$.next(window.Clerk.client);
      this.session$.next(window.Clerk.session);
      this.user$.next(window.Clerk.user);
      this.organization$.next(window.Clerk.organization);

      // emits all of them every time 1 thing changes
      window.Clerk.addListener((resources) => {
        this.client$.next(resources.client);
        this.session$.next(resources.session);
        this.user$.next(resources.user);
        this.organization$.next(resources.organization);
        this.clerk$.next(window.Clerk);
      });

      this.clerk$.next(window.Clerk);
    });
  }

  public updateAppearance(opts: ClerkOptions['appearance']) {
    this.clerk$.pipe(take(1)).subscribe((clerk) => {
      (clerk as any).__unstable__updateProps({ appearance: opts });
    });
  }

  public updateLocalization(opts: ClerkOptions['localization']) {
    this.clerk$.pipe(take(1)).subscribe((clerk) => {
      (clerk as any).__unstable__updateProps({ localization: opts });
    });
  }

  public openSignIn(opts?: SignInProps) {
    this.clerk$.pipe(take(1)).subscribe((clerk) => {
      clerk.openSignIn(opts);
    });
  }

  public closeSignIn() {
    this.clerk$.pipe(take(1)).subscribe((clerk) => {
      clerk.closeSignIn();
    });
  }

  public openSignUp(opts?: SignUpProps) {
    this.clerk$.pipe(take(1)).subscribe((clerk) => {
      clerk.openSignUp(opts);
    });
  }

  public closeSignUp() {
    this.clerk$.pipe(take(1)).subscribe((clerk) => {
      clerk.closeSignUp();
    });
  }

  public openUserProfile(opts?: UserProfileProps) {
    this.clerk$.pipe(take(1)).subscribe((clerk) => {
      clerk.openUserProfile(opts);
    });
  }

  public closeUserProfile() {
    this.clerk$.pipe(take(1)).subscribe((clerk) => {
      clerk.closeUserProfile();
    });
  }

  public openOrganizationProfile(opts?: OrganizationProfileProps) {
    this.clerk$.pipe(take(1)).subscribe((clerk) => {
      clerk.openOrganizationProfile(opts);
    });
  }

  public closeOrganizationProfile() {
    this.clerk$.pipe(take(1)).subscribe((clerk) => {
      clerk.closeOrganizationProfile();
    });
  }

  public openCreateOrganization(opts?: CreateOrganizationProps) {
    this.clerk$.pipe(take(1)).subscribe((clerk) => {
      clerk.openCreateOrganization(opts);
    });
  }

  public closeCreateOrganization() {
    this.clerk$.pipe(take(1)).subscribe((clerk) => {
      clerk.closeCreateOrganization();
    });
  }

  public redirectToSignIn(opts?: SignInRedirectOptions) {
    this.clerk$.pipe(take(1)).subscribe((clerk) => {
      clerk.redirectToSignIn(opts);
    });
  }

  public redirectToSignUp(opts?: SignUpRedirectOptions) {
    this.clerk$.pipe(take(1)).subscribe((clerk) => {
      clerk.redirectToSignUp(opts);
    });
  }
}
