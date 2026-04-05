import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ClerkService,
  ClerkUserButtonComponent,
  ClerkOrganizationSwitcherComponent,
} from 'ngx-clerk';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, ClerkUserButtonComponent, ClerkOrganizationSwitcherComponent],
  template: `
    <header>
      <h1>Dashboard</h1>
      <clerk-user-button />
    </header>

    <section>
      <h2>User Info</h2>
      <p>Name: {{ clerk.user()?.fullName }}</p>
      <p>Email: {{ clerk.user()?.primaryEmailAddress?.emailAddress }}</p>
      <p>User ID: {{ clerk.userId() }}</p>
    </section>

    <section>
      <h2>Organization</h2>
      <clerk-organization-switcher />
    </section>

    <a routerLink="/">Back to Home</a>
  `,
})
export class DashboardComponent {
  clerk = inject(ClerkService);
}
