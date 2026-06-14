import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ClerkService } from './clerk.service';
import { createMockClerkInstance, MockClerkInstance } from '../testing/mock-clerk';

// Avoid loading real ClerkJS from the CDN during tests by stubbing the shared loader.
vi.mock('@clerk/shared/loadClerkJsScript', () => ({
  loadClerkJSScript: vi.fn().mockResolvedValue(null),
  loadClerkUIScript: vi.fn().mockResolvedValue(undefined),
}));

type ResourceListener = (resources: Record<string, unknown>) => void;

describe('ClerkService', () => {
  let instance: MockClerkInstance;
  let listeners: ResourceListener[];

  beforeEach(() => {
    listeners = [];
    instance = createMockClerkInstance();
    instance['addListener'] = vi.fn((cb: ResourceListener) => {
      listeners.push(cb);
      return () => undefined;
    });
    window.Clerk = instance as unknown as Window['Clerk'];
    (window as unknown as { __internal_ClerkUICtor: unknown }).__internal_ClerkUICtor = class {};
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  afterEach(() => {
    delete (window as { Clerk?: unknown }).Clerk;
    vi.restoreAllMocks();
  });

  async function initService(): Promise<ClerkService> {
    const service = TestBed.inject(ClerkService);
    await service.initialize({ publishableKey: 'pk_test_x' });
    return service;
  }

  const emit = (resources: Record<string, unknown>) => listeners.forEach((cb) => cb(resources));

  it('is not loaded before initialize', () => {
    const service = TestBed.inject(ClerkService);
    expect(service.isLoaded()).toBe(false);
    expect(service.isSignedIn()).toBe(false);
  });

  it('loads ClerkJS and reflects the signed-out state', async () => {
    const service = await initService();

    expect(instance['load']).toHaveBeenCalled();
    expect(service.isLoaded()).toBe(true);
    expect(service.isSignedIn()).toBe(false);
    expect(service.user()).toBeNull();
  });

  it('reflects signed-in resources after a listener emission', async () => {
    const service = await initService();
    const session = { id: 'sess_1', status: 'active', lastActiveToken: { jwt: { claims: {} } }, factorVerificationAge: null };
    emit({ client: { sessions: [session] }, session, user: { id: 'user_1', organizationMemberships: [] }, organization: null });

    expect(service.isSignedIn()).toBe(true);
    expect(service.userId()).toBe('user_1');
    expect(service.sessionId()).toBe('sess_1');
  });

  it('delegates UI and session methods to the Clerk instance', async () => {
    const service = await initService();
    service.openSignIn();
    service.signOut({ redirectUrl: '/bye' });
    service.setActive({ session: null });

    expect(instance['openSignIn']).toHaveBeenCalled();
    expect(instance['signOut']).toHaveBeenCalledWith({ redirectUrl: '/bye' });
    expect(instance['setActive']).toHaveBeenCalledWith({ session: null });
  });

  it('getToken returns null when signed out and the token when signed in', async () => {
    const service = await initService();
    expect(await service.getToken()).toBeNull();

    const session = {
      id: 'sess_1',
      status: 'active',
      lastActiveToken: { jwt: { claims: {} } },
      factorVerificationAge: null,
      getToken: vi.fn().mockResolvedValue('jwt-token'),
    };
    emit({ client: {}, session, user: { id: 'user_1', organizationMemberships: [] }, organization: null });

    expect(await service.getToken()).toBe('jwt-token');
  });

  it('has() returns false when signed out', async () => {
    const service = await initService();
    expect(service.has({ role: 'org:admin' })).toBe(false);
  });

  it('has() evaluates organization roles and permissions from claims', async () => {
    const service = await initService();
    const organization = { id: 'org_1', slug: 'acme' };
    const user = {
      id: 'user_1',
      organizationMemberships: [
        { organization: { id: 'org_1' }, role: 'org:admin', permissions: ['org:posts:manage'] },
      ],
    };
    const session = { id: 'sess_1', status: 'active', lastActiveToken: { jwt: { claims: { fea: '', pla: '' } } }, factorVerificationAge: null };
    emit({ client: {}, session, user, organization });

    expect(service.orgRole()).toBe('org:admin');
    expect(service.has({ role: 'org:admin' })).toBe(true);
    expect(service.has({ role: 'org:member' })).toBe(false);
    expect(service.has({ permission: 'org:posts:manage' })).toBe(true);
  });
});
