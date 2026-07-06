import {
  EnvironmentProviders,
  inject,
  InjectionToken,
  makeEnvironmentProviders,
  provideAppInitializer,
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
    provideAppInitializer(() =>
      inject(ClerkService).initialize({
        ...options,
        sdkMetadata: options.sdkMetadata ?? NGX_CLERK_SDK_METADATA,
      }),
    ),
  ]);
}
