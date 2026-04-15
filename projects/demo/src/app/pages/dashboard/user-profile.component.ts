import { Component } from '@angular/core';
import { ClerkUserProfileComponent } from 'ngx-clerk';

@Component({
  selector: 'app-user-profile-page',
  imports: [ClerkUserProfileComponent],
  template: `
    <div class="p-8">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">User Profile</h1>
        <p class="mt-1 text-gray-500">Manage your account settings, email addresses, and security</p>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white p-6">
        <clerk-user-profile />
      </div>
    </div>
  `,
})
export class UserProfilePageComponent {}
