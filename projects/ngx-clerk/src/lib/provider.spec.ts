import { describe, it, expect, vi } from 'vitest';
import { APP_INITIALIZER } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CLERK_OPTIONS, provideClerk } from './provider';
import { ClerkService } from './services/clerk.service';

describe('provideClerk', () => {
  it('registers the Clerk options token', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideClerk({ publishableKey: 'pk_test_x' })],
    });

    expect(TestBed.inject(CLERK_OPTIONS)).toEqual(expect.objectContaining({ publishableKey: 'pk_test_x' }));
  });

  it('initializes ClerkService via an APP_INITIALIZER, injecting SDK metadata', () => {
    const initSpy = vi.spyOn(ClerkService.prototype, 'initialize').mockResolvedValue(undefined);
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideClerk({ publishableKey: 'pk_test_x' })],
    });

    const initializers = TestBed.inject(APP_INITIALIZER);
    initializers.forEach((init) => init());

    expect(initSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        publishableKey: 'pk_test_x',
        sdkMetadata: expect.objectContaining({ name: 'ngx-clerk' }),
      }),
    );
  });
});
