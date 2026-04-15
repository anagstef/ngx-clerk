import { Component } from '@angular/core';
import { ClerkOrganizationListComponent } from 'ngx-clerk';

@Component({
  selector: 'app-org-list-page',
  imports: [ClerkOrganizationListComponent],
  template: `
    <div class="p-8">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Organization List</h1>
        <p class="mt-1 text-gray-500">Browse and switch between your organizations</p>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white p-6">
        <clerk-organization-list />
      </div>
    </div>
  `,
})
export class OrgListPageComponent {}
