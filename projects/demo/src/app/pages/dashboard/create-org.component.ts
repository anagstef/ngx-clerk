import { Component } from '@angular/core';
import { ClerkCreateOrganizationComponent } from 'ngx-clerk';

@Component({
  selector: 'app-create-org-page',
  imports: [ClerkCreateOrganizationComponent],
  template: `
    <div class="p-8">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Create Organization</h1>
        <p class="mt-1 text-gray-500">Start a new organization and invite your team members</p>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white p-6">
        <clerk-create-organization />
      </div>
    </div>
  `,
})
export class CreateOrgPageComponent {}
