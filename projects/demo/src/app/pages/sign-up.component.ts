import { Component } from '@angular/core';
import { ClerkSignUpComponent } from 'ngx-clerk';

@Component({
  selector: 'app-sign-up',
  imports: [ClerkSignUpComponent],
  template: `<clerk-sign-up [props]="{ routing: 'path', path: '/sign-up', signInUrl: '/sign-in' }" />`,
})
export class SignUpComponent {}
