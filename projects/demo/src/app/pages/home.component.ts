import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClerkService, ClerkUserButtonComponent } from 'ngx-clerk';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ClerkUserButtonComponent],
  template: `
    <h1>ngx-clerk Demo</h1>

    @if (clerk.isLoaded()) {
      @if (clerk.isSignedIn()) {
        <div>
          <clerk-user-button />
          <p>Welcome, {{ clerk.user()?.firstName }}!</p>
          <a routerLink="/dashboard">Go to Dashboard</a>
        </div>
      } @else {
        <div>
          <a routerLink="/sign-in">Sign In</a>
          <span> | </span>
          <a routerLink="/sign-up">Sign Up</a>
        </div>
      }
    } @else {
      <p>Loading Clerk...</p>
    }
  `,
})
export class HomeComponent {
  clerk = inject(ClerkService);
}
