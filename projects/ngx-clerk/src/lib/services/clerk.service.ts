import { Injectable, NgZone, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { deriveState } from '@clerk/shared/deriveState';
import { createCheckAuthorization } from '@clerk/shared/authorization';
import type {
  CheckAuthorizationWithCustomPermissions,
  Clerk,
  ClerkOptions,
  ClientResource,
  CreateOrganizationProps,
  GetTokenOptions,
  HandleOAuthCallbackParams,
  JwtPayload,
  OrganizationMembershipResource,
  OrganizationProfileProps,
  OrganizationResource,
  SessionResource,
  SetActiveParams,
  SignedInSessionResource,
  SignInProps,
  SignInRedirectOptions,
  SignInResource,
  SignOutOptions,
  SignUpProps,
  SignUpRedirectOptions,
  SignUpResource,
  UserProfileProps,
  UserResource,
  Without,
} from '@clerk/shared/types';
import { loadClerkScripts } from '../utils/loadClerkJsScript';
import type { ClerkInitOptions } from '../utils/types';

interface HeadlessBrowserClerk extends Clerk {
  load: (opts?: Without<ClerkOptions, 'isSatellite'> & Record<string, unknown>) => Promise<void>;
  updateClient: (client: ClientResource) => void;
  __internal_updateProps: (props: Record<string, unknown>) => void;
}

interface BrowserClerk extends HeadlessBrowserClerk {
  onComponentsReady: Promise<void>;
  components: Record<string, unknown>;
}

declare global {
  interface Window {
    Clerk: HeadlessBrowserClerk | BrowserClerk;
  }
}

/** The authorization parameters accepted by {@link ClerkService.has}. */
export type CheckAuthorizationParams = Parameters<CheckAuthorizationWithCustomPermissions>[0];

/** Options accepted by {@link ClerkService.updateClerkOptions}. */
export interface ClerkUpdateOptions {
  localization?: ClerkOptions['localization'];
  appearance?: ClerkOptions['appearance'];
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
  private readonly _session = signal<SignedInSessionResource | null>(null);
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
   * Auth state derived from the current Clerk resources, built from the cached
   * session JWT claims.
   */
  private readonly _derivedState = computed(() =>
    deriveState(
      this.isLoaded(),
      {
        client: this._client(),
        session: this._session(),
        user: this._user(),
        organization: this._organization(),
      } as Parameters<typeof deriveState>[1],
      undefined,
    ),
  );

  /** The active session's ID, or `null` if not signed in. */
  readonly sessionId = computed(() => this._derivedState().sessionId ?? null);
  /** The current user's role in the active organization, or `null`. */
  readonly orgRole = computed(() => this._derivedState().orgRole ?? null);
  /** The active organization's slug, or `null`. */
  readonly orgSlug = computed(() => this._derivedState().orgSlug ?? null);
  /** The claims of the active session's JWT, or `null`. */
  readonly sessionClaims = computed(() => this._derivedState().sessionClaims ?? null);
  /** The actor (impersonation) claim of the active session, or `null`. */
  readonly actor = computed(() => this._derivedState().actor ?? null);

  /** The active sign-in attempt resource, or `null`. */
  readonly signIn = computed<SignInResource | null>(() => this._client()?.signIn ?? null);
  /** The active sign-up attempt resource, or `null`. */
  readonly signUp = computed<SignUpResource | null>(() => this._client()?.signUp ?? null);
  /** All sessions registered on the current client device. */
  readonly sessions = computed<SessionResource[]>(() => this._client()?.sessions ?? []);

  /** The current user's membership in the active organization, or `null`. */
  readonly membership = computed<OrganizationMembershipResource | null>(() => {
    const orgId = this.orgId();
    const user = this._user();
    if (!orgId || !user) {
      return null;
    }
    return user.organizationMemberships?.find((m) => m.organization.id === orgId) ?? null;
  });

  /**
   * The authorization checker for the current session, built from the cached
   * JWT claims. Returns `false` while signed out.
   */
  private readonly _checkAuthorization = computed<CheckAuthorizationWithCustomPermissions>(() => {
    const d = this._derivedState();
    const claims = d.sessionClaims as (JwtPayload & { fea?: string; pla?: string }) | null | undefined;
    return createCheckAuthorization({
      userId: d.userId,
      orgId: d.orgId,
      orgRole: d.orgRole,
      orgPermissions: d.orgPermissions,
      factorVerificationAge: d.factorVerificationAge,
      features: claims?.fea || '',
      plans: claims?.pla || '',
    });
  });

  /**
   * Initialize ClerkJS. Called internally by provideClerk() at application startup.
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
      const { publishableKey, __internal_clerkJSUrl, __internal_clerkJSVersion, ...loadOptions } = options;
      await window.Clerk.load({
        routerPush: (to: string) =>
          this._ngZone.run(() => {
            const url = new URL(to.replace('#/', ''), 'http://dummy.clerk');
            const queryParams: Record<string, string> = {};
            url.searchParams.forEach((v, k) => (queryParams[k] = v));
            return this._router.navigate([url.pathname], { queryParams });
          }),
        routerReplace: (to: string) =>
          this._ngZone.run(() => {
            const url = new URL(to.replace('#/', ''), 'http://dummy.clerk');
            const queryParams: Record<string, string> = {};
            url.searchParams.forEach((v, k) => (queryParams[k] = v));
            return this._router.navigate([url.pathname], { queryParams, replaceUrl: true });
          }),
        ...loadOptions,
        ui: { ClerkUI: clerkUICtorPromise },
      });

      this._ngZone.run(() => {
        this._client.set(window.Clerk.client ?? null);
        this._session.set((window.Clerk.session as SignedInSessionResource) ?? null);
        this._user.set(window.Clerk.user ?? null);
        this._organization.set(window.Clerk.organization ?? null);
        this._clerk.set(window.Clerk);
      });

      window.Clerk.addListener((resources) => {
        this._ngZone.run(() => {
          this._client.set(resources.client ?? null);
          this._session.set((resources.session as SignedInSessionResource) ?? null);
          this._user.set(resources.user ?? null);
          this._organization.set(resources.organization ?? null);
          this._clerk.set(window.Clerk);
        });
      });
    });
  }

  // --- Authorization & Tokens ---

  /**
   * Checks whether the current user satisfies an authorization condition
   * (role, permission, feature, or plan). Returns `false` while signed out.
   *
   * @example
   * ```ts
   * if (clerk.has({ role: 'org:admin' })) { ... }
   * if (clerk.has({ permission: 'org:posts:manage' })) { ... }
   * ```
   */
  has(params: CheckAuthorizationParams): boolean {
    return this._checkAuthorization()(params);
  }

  /**
   * Returns the current session token (JWT), optionally for a named template.
   * Resolves to `null` when there is no active session.
   */
  getToken(options?: GetTokenOptions): Promise<string | null> {
    const session = this._session();
    if (!session) {
      return Promise.resolve(null);
    }
    return session.getToken(options);
  }

  /** Sets the active session and/or organization. */
  setActive(params: SetActiveParams): Promise<void> {
    return this.clerk()?.setActive(params) ?? Promise.resolve();
  }

  /** Completes an OAuth/SSO redirect flow by handling the callback. */
  async handleRedirectCallback(params?: HandleOAuthCallbackParams): Promise<void> {
    await this.clerk()?.handleRedirectCallback(params ?? {});
  }

  // --- Appearance & Localization ---

  /** Updates the global appearance configuration for all Clerk components. */
  updateAppearance(opts: ClerkOptions['appearance']) {
    this.clerk()?.__internal_updateProps({ appearance: opts });
  }

  /** Updates the localization configuration for all Clerk components. */
  updateLocalization(opts: ClerkOptions['localization']) {
    this.clerk()?.__internal_updateProps({ options: { localization: opts } });
  }

  /**
   * Updates Clerk's global options (localization and/or appearance) at runtime.
   */
  updateClerkOptions(options: ClerkUpdateOptions) {
    this.clerk()?.__internal_updateProps({
      options: { localization: options.localization },
      appearance: options.appearance,
    });
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
  signOut(opts?: SignOutOptions) {
    return this.clerk()?.signOut(opts) ?? Promise.resolve();
  }
}
