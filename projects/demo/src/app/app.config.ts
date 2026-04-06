import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClerk } from 'ngx-clerk';
import { routes } from './app.routes';

declare global {
  var __CLERK_PUBLISHABLE_KEY__: string | undefined;
}

const publishableKey = globalThis.__CLERK_PUBLISHABLE_KEY__;
if (!publishableKey) {
  throw new Error(
    'Missing __CLERK_PUBLISHABLE_KEY__ on globalThis. ' +
      'Set it before bootstrapping the app (e.g. via index.html or environment config).',
  );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClerk({ publishableKey }),
  ],
};
