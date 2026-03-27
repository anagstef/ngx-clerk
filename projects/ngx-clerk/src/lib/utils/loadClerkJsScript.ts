import {
  loadClerkJSScript as loadClerkJSScriptShared,
  loadClerkUIScript as loadClerkUIScriptShared,
} from '@clerk/shared/loadClerkJsScript';
import type { ClerkInitOptions } from './types';

declare global {
  interface Window {
    __internal_ClerkUICtor: any;
  }
}

const FAILED_TO_LOAD_ERROR = 'Clerk: Failed to load Clerk';

/**
 * Loads ClerkJS and ClerkUI scripts in parallel.
 * Returns a promise for the ClerkUI constructor to be passed to Clerk.load().
 */
export const loadClerkScripts = (opts: ClerkInitOptions): { clerkPromise: Promise<any>; clerkUICtorPromise: Promise<any> } => {
  const { publishableKey } = opts;

  if (!publishableKey) {
    throw new Error('ClerkService requires a publishableKey');
  }

  const scriptOpts = {
    publishableKey,
    proxyUrl: opts.proxyUrl,
    domain: opts.domain,
    nonce: opts.nonce,
    sdkMetadata: opts.sdkMetadata,
    __internal_clerkJSUrl: opts.__internal_clerkJSUrl,
    __internal_clerkJSVersion: opts.__internal_clerkJSVersion,
  };

  const uiOpts = { publishableKey, proxyUrl: opts.proxyUrl, domain: opts.domain, nonce: opts.nonce };

  // Fire both downloads in parallel (same approach as Vue SDK)
  const clerkPromise = loadClerkJSScriptShared(scriptOpts).catch(() => {
    throw new Error(FAILED_TO_LOAD_ERROR);
  });

  const clerkUICtorPromise = (async () => {
    await loadClerkUIScriptShared(uiOpts);
    if (!window.__internal_ClerkUICtor) {
      throw new Error('Failed to download latest Clerk UI. Contact support@clerk.com.');
    }
    return window.__internal_ClerkUICtor;
  })();

  return { clerkPromise, clerkUICtorPromise };
};
