import {
  APP_INITIALIZER,
  EnvironmentProviders,
  InjectionToken,
  makeEnvironmentProviders,
} from '@angular/core';
import type { ClerkInitOptions } from './utils/types';
import { ClerkService } from './services/clerk.service';

/** Injection token for Clerk initialization options. Used internally by {@link provideClerk}. */
export const CLERK_OPTIONS = new InjectionToken<ClerkInitOptions>('CLERK_OPTIONS');

const NGX_CLERK_SDK_METADATA = {
  name: 'ngx-clerk',
  version: '1.0.0',
  environment: 'browser',
};

function initializeClerk(clerkService: ClerkService, options: ClerkInitOptions): () => Promise<void> {
  return () =>
    clerkService.initialize({
      ...options,
      sdkMetadata: options.sdkMetadata ?? NGX_CLERK_SDK_METADATA,
    });
}

/**
 * Provides Clerk authentication services to an Angular application.
 * Add this to your application's providers array in `app.config.ts`.
 *
 * @example
 * ```ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideClerk({ publishableKey: 'pk_test_...' }),
 *   ],
 * };
 * ```
 */
export function provideClerk(options: ClerkInitOptions): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: CLERK_OPTIONS, useValue: options },
    {
      provide: APP_INITIALIZER,
      useFactory: (clerkService: ClerkService) => initializeClerk(clerkService, options),
      deps: [ClerkService],
      multi: true,
    },
  ]);
}
