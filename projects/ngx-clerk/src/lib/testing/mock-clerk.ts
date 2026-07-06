import { Provider, WritableSignal, signal } from '@angular/core';
import { Mock, vi } from 'vitest';
import { ClerkService } from '../services/clerk.service';

/** Mock state used to seed a fake Clerk instance. */
export interface MockClerkState {
  client?: unknown;
  session?: unknown;
  user?: unknown;
  organization?: unknown;
}

const INSTANCE_METHODS = [
  'mountSignIn', 'unmountSignIn', 'mountSignUp', 'unmountSignUp',
  'mountUserProfile', 'unmountUserProfile', 'mountUserButton', 'unmountUserButton',
  'mountUserAvatar', 'unmountUserAvatar', 'mountOrganizationProfile', 'unmountOrganizationProfile',
  'mountOrganizationSwitcher', 'unmountOrganizationSwitcher', 'mountCreateOrganization', 'unmountCreateOrganization',
  'mountOrganizationList', 'unmountOrganizationList', 'mountWaitlist', 'unmountWaitlist',
  'mountPricingTable', 'unmountPricingTable',
  'openSignIn', 'closeSignIn', 'openSignUp', 'closeSignUp', 'openUserProfile', 'closeUserProfile',
  'openOrganizationProfile', 'closeOrganizationProfile', 'openCreateOrganization', 'closeCreateOrganization',
  'openGoogleOneTap', 'closeGoogleOneTap', 'redirectToSignIn', 'redirectToSignUp', '__internal_updateProps',
] as const;

/** A fake `window.Clerk`-style instance whose methods are all spies. */
export type MockClerkInstance = Record<string, Mock> & {
  client: unknown;
  session: unknown;
  user: unknown;
  organization: unknown;
};

/** Creates a fake `window.Clerk`-style instance with every method spied. */
export function createMockClerkInstance(state: MockClerkState = {}): MockClerkInstance {
  const instance: Record<string, unknown> = {
    client: state.client ?? null,
    session: state.session ?? null,
    user: state.user ?? null,
    organization: state.organization ?? null,
    load: vi.fn().mockResolvedValue(undefined),
    addListener: vi.fn(),
    signOut: vi.fn().mockResolvedValue(undefined),
    setActive: vi.fn().mockResolvedValue(undefined),
    handleRedirectCallback: vi.fn().mockResolvedValue(undefined),
  };
  for (const method of INSTANCE_METHODS) {
    if (!instance[method]) {
      instance[method] = vi.fn();
    }
  }
  return instance as MockClerkInstance;
}

/** A fake {@link ClerkService} with writable signals and spied methods for tests. */
export interface MockClerkService {
  clerk: WritableSignal<MockClerkInstance | null>;
  client: WritableSignal<unknown>;
  session: WritableSignal<unknown>;
  user: WritableSignal<unknown>;
  organization: WritableSignal<unknown>;
  isLoaded: WritableSignal<boolean>;
  isSignedIn: WritableSignal<boolean>;
  has: Mock;
  getToken: Mock;
  setActive: Mock;
  handleRedirectCallback: Mock;
  openSignIn: Mock;
  closeSignIn: Mock;
  openSignUp: Mock;
  closeSignUp: Mock;
  redirectToSignIn: Mock;
  redirectToSignUp: Mock;
  signOut: Mock;
  updateClerkOptions: Mock;
  updateAppearance: Mock;
  updateLocalization: Mock;
  instance: MockClerkInstance;
}

/** Creates a fake {@link ClerkService} for directive/component/guard tests. */
export function createMockClerkService(): MockClerkService {
  return {
    clerk: signal<MockClerkInstance | null>(null),
    client: signal<unknown>(null),
    session: signal<unknown>(null),
    user: signal<unknown>(null),
    organization: signal<unknown>(null),
    isLoaded: signal(false),
    isSignedIn: signal(false),
    has: vi.fn().mockReturnValue(false),
    getToken: vi.fn().mockResolvedValue(null),
    setActive: vi.fn().mockResolvedValue(undefined),
    handleRedirectCallback: vi.fn().mockResolvedValue(undefined),
    openSignIn: vi.fn(),
    closeSignIn: vi.fn(),
    openSignUp: vi.fn(),
    closeSignUp: vi.fn(),
    redirectToSignIn: vi.fn(),
    redirectToSignUp: vi.fn(),
    signOut: vi.fn().mockResolvedValue(undefined),
    updateClerkOptions: vi.fn(),
    updateAppearance: vi.fn(),
    updateLocalization: vi.fn(),
    instance: createMockClerkInstance(),
  };
}

/** Returns a provider that supplies a {@link MockClerkService} for {@link ClerkService}. */
export function provideMockClerk(): { mock: MockClerkService; providers: Provider[] } {
  const mock = createMockClerkService();
  return {
    mock,
    providers: [{ provide: ClerkService, useValue: mock as unknown as ClerkService }],
  };
}
