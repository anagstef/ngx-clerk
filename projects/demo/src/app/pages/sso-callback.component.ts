import { Component } from '@angular/core';
import { ClerkAuthenticateWithRedirectCallbackComponent } from 'ngx-clerk';

@Component({
  selector: 'app-sso-callback',
  imports: [ClerkAuthenticateWithRedirectCallbackComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-dark to-dark-end flex flex-col items-center justify-center px-4 text-white">
      <div class="animate-pulse text-sm text-gray-300">Completing sign in…</div>
      <clerk-authenticate-with-redirect-callback
        [props]="{ signInFallbackRedirectUrl: '/dashboard', signUpFallbackRedirectUrl: '/dashboard' }"
      />
    </div>
  `,
})
export class SsoCallbackComponent {}
