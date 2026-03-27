import { loadClerkJSScript as loadClerkJSScriptShared } from '@clerk/shared/loadClerkJsScript';
import type { ClerkInitOptions } from './types';

const FAILED_TO_LOAD_ERROR = 'Clerk: Failed to load Clerk';

export const loadClerkJSScript = (opts: ClerkInitOptions) => {
  const { publishableKey } = opts;

  if (!publishableKey) {
    throw new Error('ClerkService requires a publishableKey');
  }

  return loadClerkJSScriptShared({
    publishableKey,
    proxyUrl: opts.proxyUrl,
    domain: opts.domain,
    nonce: opts.nonce,
    sdkMetadata: opts.sdkMetadata,
    __internal_clerkJSUrl: opts.__internal_clerkJSUrl,
    __internal_clerkJSVersion: opts.__internal_clerkJSVersion,
  }).catch(() => {
    throw new Error(FAILED_TO_LOAD_ERROR);
  });
};
