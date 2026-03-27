import type { ClerkOptions, SDKMetadata } from '@clerk/shared/types';

export type ClerkInitOptions = Omit<ClerkOptions, 'isSatellite'> & {
  publishableKey: string;
  isSatellite?: boolean | ((url: URL) => boolean);
  sdkMetadata?: SDKMetadata;
  __internal_clerkJSUrl?: string;
  __internal_clerkJSVersion?: string;
};
