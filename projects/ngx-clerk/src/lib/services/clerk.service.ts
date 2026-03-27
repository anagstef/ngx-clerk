import { Injectable, NgZone, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import type {
  ActiveSessionResource,
  Clerk,
  ClerkOptions,
  ClientResource,
  CreateOrganizationProps,
  OrganizationProfileProps,
  OrganizationResource,
  SignInProps,
  SignInRedirectOptions,
  SignUpProps,
  SignUpRedirectOptions,
  UserProfileProps,
  UserResource,
  Without,
} from '@clerk/shared/types';
import { loadClerkScripts } from '../utils/loadClerkJsScript';
import type { ClerkInitOptions } from '../utils/types';

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
  providedIn: 'root',
})
export class ClerkService {
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _router = inject(Router);
  private readonly _ngZone = inject(NgZone);

  private _initialized = false;

  // Core state signals (private writable, public readonly)
  private readonly _clerk = signal<HeadlessBrowserClerk | BrowserClerk | null>(null);
  private readonly _client = signal<ClientResource | null>(null);
  private readonly _session = signal<ActiveSessionResource | null>(null);
  private readonly _user = signal<UserResource | null>(null);
  private readonly _organization = signal<OrganizationResource | null>(null);

  readonly clerk = this._clerk.asReadonly();
  readonly client = this._client.asReadonly();
  readonly session = this._session.asReadonly();
  readonly user = this._user.asReadonly();
  readonly organization = this._organization.asReadonly();

  // Derived signals
  readonly isLoaded = computed(() => this._clerk() !== null);
  readonly isSignedIn = computed(() => !!this._user()?.id);
  readonly userId = computed(() => this._user()?.id ?? null);
  readonly orgId = computed(() => this._organization()?.id ?? null);

  /**
   * Initialize ClerkJS. Called internally by provideClerk() via APP_INITIALIZER.
   * Do not call directly -- use provideClerk() in your app config.
   */
  initialize(options: ClerkInitOptions): Promise<void> {
    if (!isPlatformBrowser(this._platformId)) {
      return Promise.resolve();
    }
    if (this._initialized) {
      console.warn('ClerkService already initialized');
      return Promise.resolve();
    }
    this._initialized = true;

    const { clerkPromise, clerkUICtorPromise } = loadClerkScripts(options);

    return clerkPromise.then(async () => {
      const { publishableKey, __internal_clerkJSUrl, __internal_clerkJSVersion, sdkMetadata, ...loadOptions } = options;
      await window.Clerk.load({
        routerPush: (to: string) =>
          this._ngZone.run(() => {
            const url = new URL(to.replace('#/', ''), 'http://dummy.clerk');
            const queryParams = Object.fromEntries((url.searchParams as any).entries());
            return this._router.navigate([url.pathname], { queryParams });
          }),
        routerReplace: (to: string) =>
          this._ngZone.run(() => {
            const url = new URL(to.replace('#/', ''), 'http://dummy.clerk');
            const queryParams = Object.fromEntries((url.searchParams as any).entries());
            return this._router.navigate([url.pathname], { queryParams, replaceUrl: true });
          }),
        ...loadOptions,
        ui: { ClerkUI: clerkUICtorPromise },
      } as any);

      this._ngZone.run(() => {
        this._client.set(window.Clerk.client ?? null);
        this._session.set((window.Clerk.session as ActiveSessionResource) ?? null);
        this._user.set(window.Clerk.user ?? null);
        this._organization.set(window.Clerk.organization ?? null);
        this._clerk.set(window.Clerk);
      });

      window.Clerk.addListener((resources) => {
        this._ngZone.run(() => {
          this._client.set(resources.client ?? null);
          this._session.set((resources.session as ActiveSessionResource) ?? null);
          this._user.set(resources.user ?? null);
          this._organization.set(resources.organization ?? null);
          this._clerk.set(window.Clerk);
        });
      });
    });
  }

  // --- Appearance & Localization ---

  updateAppearance(opts: ClerkOptions['appearance']) {
    const clerkInstance = this.clerk();
    if (clerkInstance) {
      (clerkInstance as any).__internal_updateProps({ appearance: opts });
    }
  }

  updateLocalization(opts: ClerkOptions['localization']) {
    const clerkInstance = this.clerk();
    if (clerkInstance) {
      (clerkInstance as any).__internal_updateProps({ localization: opts });
    }
  }

  // --- Open / Close UI ---

  openSignIn(opts?: SignInProps) {
    this.clerk()?.openSignIn(opts);
  }

  closeSignIn() {
    this.clerk()?.closeSignIn();
  }

  openSignUp(opts?: SignUpProps) {
    this.clerk()?.openSignUp(opts);
  }

  closeSignUp() {
    this.clerk()?.closeSignUp();
  }

  openUserProfile(opts?: UserProfileProps) {
    this.clerk()?.openUserProfile(opts);
  }

  closeUserProfile() {
    this.clerk()?.closeUserProfile();
  }

  openOrganizationProfile(opts?: OrganizationProfileProps) {
    this.clerk()?.openOrganizationProfile(opts);
  }

  closeOrganizationProfile() {
    this.clerk()?.closeOrganizationProfile();
  }

  openCreateOrganization(opts?: CreateOrganizationProps) {
    this.clerk()?.openCreateOrganization(opts);
  }

  closeCreateOrganization() {
    this.clerk()?.closeCreateOrganization();
  }

  // --- Redirects ---

  redirectToSignIn(opts?: SignInRedirectOptions) {
    this.clerk()?.redirectToSignIn(opts);
  }

  redirectToSignUp(opts?: SignUpRedirectOptions) {
    this.clerk()?.redirectToSignUp(opts);
  }

  // --- Sign Out ---

  signOut(opts?: Parameters<Clerk['signOut']>[0]) {
    return this.clerk()?.signOut(opts);
  }
}
