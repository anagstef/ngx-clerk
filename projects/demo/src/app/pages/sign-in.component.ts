import { Component } from '@angular/core';
import { ClerkSignInComponent } from 'ngx-clerk';

@Component({
  selector: 'app-sign-in',
  imports: [ClerkSignInComponent],
  template: `<clerk-sign-in [props]="{ routing: 'path', path: '/sign-in', signUpUrl: '/sign-up' }" />`,
})
export class SignInComponent {}
