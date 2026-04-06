import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClerk } from 'ngx-clerk';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClerk({
      publishableKey: environment.clerkPublishableKey,
      appearance: {
        cssLayerName: 'clerk',
        variables: {
          colorPrimary: '#6c47ff',
        },
        elements: {
          card: 'bg-white shadow-sm',
          formButtonPrimary: 'bg-primary hover:bg-primary-hover',
          socialButtonsBlockButton: 'bg-white border border-gray-200 hover:bg-gray-50',
          socialButtonsBlockButtonText: 'font-semibold text-gray-600',
          formButtonReset: 'text-primary hover:text-primary-hover',
          footerActionLink: 'text-primary hover:text-primary-hover',
        },
      },
    }),
  ],
};
