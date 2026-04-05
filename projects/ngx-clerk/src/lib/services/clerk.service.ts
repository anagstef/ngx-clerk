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

/**
 * Core service for interacting with Clerk authentication.
 * Provides reactive signals for auth state and methods for UI controls.
 *
 * @example
 * ```ts
 * const clerk = inject(ClerkService);
 * const user = clerk.user();
 * const isSignedIn = clerk.isSignedIn();
 * ```
 */
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

  /** The current Clerk instance. `null` until Clerk has loaded. */
  readonly clerk = this._clerk.asReadonly();
  /** The current Clerk client resource. */
  readonly client = this._client.asReadonly();
  /** The current active session. `null` when not signed in. */
  readonly session = this._session.asReadonly();
  /** The current user. `null` when not signed in. */
  readonly user = this._user.asReadonly();
  /** The current active organization. `null` when no organization is active. */
  readonly organization = this._organization.asReadonly();

  // Derived signals
  /** Whether Clerk has finished loading. */
  readonly isLoaded = computed(() => this._clerk() !== null);
  /** Whether a user is currently signed in. */
  readonly isSignedIn = computed(() => !!this._user()?.id);
  /** The current user's ID, or `null` if not signed in. */
  readonly userId = computed(() => this._user()?.id ?? null);
  /** The current active organization's ID, or `null` if none is active. */
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

  /** Updates the global appearance configuration for all Clerk components. */
  updateAppearance(opts: ClerkOptions['appearance']) {
    const clerkInstance = this.clerk();
    if (clerkInstance) {
      (clerkInstance as any).__internal_updateProps({ appearance: opts });
    }
  }

  /** Updates the localization configuration for all Clerk components. */
  updateLocalization(opts: ClerkOptions['localization']) {
    const clerkInstance = this.clerk();
    if (clerkInstance) {
      (clerkInstance as any).__internal_updateProps({ localization: opts });
    }
  }

  // --- Open / Close UI ---

  /** Opens the sign-in modal. */
  openSignIn(opts?: SignInProps) {
    this.clerk()?.openSignIn(opts);
  }

  /** Closes the sign-in modal. */
  closeSignIn() {
    this.clerk()?.closeSignIn();
  }

  /** Opens the sign-up modal. */
  openSignUp(opts?: SignUpProps) {
    this.clerk()?.openSignUp(opts);
  }

  /** Closes the sign-up modal. */
  closeSignUp() {
    this.clerk()?.closeSignUp();
  }

  /** Opens the user profile modal. */
  openUserProfile(opts?: UserProfileProps) {
    this.clerk()?.openUserProfile(opts);
  }

  /** Closes the user profile modal. */
  closeUserProfile() {
    this.clerk()?.closeUserProfile();
  }

  /** Opens the organization profile modal. */
  openOrganizationProfile(opts?: OrganizationProfileProps) {
    this.clerk()?.openOrganizationProfile(opts);
  }

  /** Closes the organization profile modal. */
  closeOrganizationProfile() {
    this.clerk()?.closeOrganizationProfile();
  }

  /** Opens the create organization modal. */
  openCreateOrganization(opts?: CreateOrganizationProps) {
    this.clerk()?.openCreateOrganization(opts);
  }

  /** Closes the create organization modal. */
  closeCreateOrganization() {
    this.clerk()?.closeCreateOrganization();
  }

  // --- Redirects ---

  /** Redirects to the Clerk sign-in page. */
  redirectToSignIn(opts?: SignInRedirectOptions) {
    this.clerk()?.redirectToSignIn(opts);
  }

  /** Redirects to the Clerk sign-up page. */
  redirectToSignUp(opts?: SignUpRedirectOptions) {
    this.clerk()?.redirectToSignUp(opts);
  }

  // --- Sign Out ---

  /** Signs out the current user. */
  signOut(opts?: Parameters<Clerk['signOut']>[0]) {
    return this.clerk()?.signOut(opts) ?? Promise.resolve();
  }
}
