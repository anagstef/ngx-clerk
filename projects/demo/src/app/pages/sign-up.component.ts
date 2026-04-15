import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClerkSignUpComponent } from 'ngx-clerk';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, ClerkSignUpComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-dark to-dark-end flex flex-col items-center justify-center px-4">
      <a routerLink="/" class="text-sm text-gray-400 hover:text-white transition-colors mb-8">
        &larr; Back to home
      </a>
      <clerk-sign-up [props]="{ routing: 'path', path: '/sign-up', signInUrl: '/sign-in' }" />
    </div>
  `,
})
export class SignUpComponent {}
