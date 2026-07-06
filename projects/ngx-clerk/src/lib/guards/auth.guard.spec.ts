import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { canActivateClerk, canActivateProtect } from './auth.guard';
import { MockClerkService, provideMockClerk } from '../testing/mock-clerk';

describe('auth guards', () => {
  let mock: MockClerkService;
  let routerMock: { parseUrl: ReturnType<typeof vi.fn> };
  const state = { url: '/dashboard' } as RouterStateSnapshot;
  const route = {} as ActivatedRouteSnapshot;

  beforeEach(() => {
    const { mock: m, providers } = provideMockClerk();
    mock = m;
    routerMock = { parseUrl: vi.fn((url: string) => ({ url })) };
    TestBed.configureTestingModule({
      providers: [...providers, { provide: Router, useValue: routerMock }],
    });
  });

  const run = (guard: ReturnType<typeof canActivateProtect> | typeof canActivateClerk) =>
    TestBed.runInInjectionContext(() => guard(route, state));

  describe('canActivateClerk', () => {
    it('allows signed-in users', () => {
      mock.isLoaded.set(true);
      mock.isSignedIn.set(true);
      expect(run(canActivateClerk)).toBe(true);
    });

    it('blocks and redirects signed-out users', () => {
      mock.isLoaded.set(true);
      mock.isSignedIn.set(false);
      expect(run(canActivateClerk)).toBe(false);
      expect(mock.redirectToSignIn).toHaveBeenCalledWith(
        expect.objectContaining({ signInFallbackRedirectUrl: '/dashboard' }),
      );
    });
  });

  describe('canActivateProtect', () => {
    it('allows authorized users', () => {
      mock.isLoaded.set(true);
      mock.isSignedIn.set(true);
      mock.has.mockReturnValue(true);
      expect(run(canActivateProtect({ role: 'org:admin' }))).toBe(true);
      expect(mock.has).toHaveBeenCalledWith({ role: 'org:admin' });
    });

    it('blocks unauthorized users with no fallback url', () => {
      mock.isLoaded.set(true);
      mock.isSignedIn.set(true);
      mock.has.mockReturnValue(false);
      expect(run(canActivateProtect({ role: 'org:admin' }))).toBe(false);
    });

    it('redirects unauthorized users to unauthorizedUrl', () => {
      mock.isLoaded.set(true);
      mock.isSignedIn.set(true);
      mock.has.mockReturnValue(false);
      run(canActivateProtect({ role: 'org:admin' }, { unauthorizedUrl: '/dashboard' }));
      expect(routerMock.parseUrl).toHaveBeenCalledWith('/dashboard');
    });

    it('redirects signed-out users to sign-in', () => {
      mock.isLoaded.set(true);
      mock.isSignedIn.set(false);
      expect(run(canActivateProtect({ role: 'org:admin' }))).toBe(false);
      expect(mock.redirectToSignIn).toHaveBeenCalled();
    });
  });
});
