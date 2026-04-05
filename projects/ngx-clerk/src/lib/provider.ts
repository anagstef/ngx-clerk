import {
  APP_INITIALIZER,
  EnvironmentProviders,
  InjectionToken,
  makeEnvironmentProviders,
} from '@angular/core';
import type { ClerkInitOptions } from './utils/types';
import { ClerkService } from './services/clerk.service';

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
