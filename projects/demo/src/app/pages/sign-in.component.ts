import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClerkGoogleOneTapComponent, ClerkSignInComponent } from 'ngx-clerk';

@Component({
  selector: 'app-sign-in',
  imports: [RouterLink, ClerkSignInComponent, ClerkGoogleOneTapComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-dark to-dark-end flex flex-col items-center justify-center px-4">
      <a routerLink="/" class="text-sm text-gray-400 hover:text-white transition-colors mb-8">
        &larr; Back to home
      </a>
      <clerk-sign-in [props]="{ routing: 'path', path: '/sign-in', signUpUrl: '/sign-up' }" />
      <clerk-google-one-tap />
    </div>
  `,
})
export class SignInComponent {}
