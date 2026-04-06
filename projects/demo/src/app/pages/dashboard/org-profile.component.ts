import { Component } from '@angular/core';
import { ClerkOrganizationProfileComponent } from 'ngx-clerk';

@Component({
  selector: 'app-org-profile-page',
  imports: [ClerkOrganizationProfileComponent],
  template: `
    <div class="p-8">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Organization Profile</h1>
        <p class="mt-1 text-gray-500">View and manage your organization settings and members</p>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white p-6">
        <clerk-organization-profile />
      </div>
    </div>
  `,
})
export class OrgProfilePageComponent {}
