import type { ClerkOptions, SDKMetadata } from '@clerk/shared/types';

/** Configuration options for initializing Clerk via {@link provideClerk}. */
export type ClerkInitOptions = Omit<ClerkOptions, 'isSatellite'> & {
  publishableKey: string;
  isSatellite?: boolean | ((url: URL) => boolean);
  proxyUrl?: string;
  domain?: string;
  nonce?: string;
  sdkMetadata?: SDKMetadata;
  __internal_clerkJSUrl?: string;
  __internal_clerkJSVersion?: string;
};
