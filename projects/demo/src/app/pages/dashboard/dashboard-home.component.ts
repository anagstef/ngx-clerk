import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClerkService, ClerkOrganizationSwitcherComponent } from 'ngx-clerk';

@Component({
  selector: 'app-dashboard-home',
  imports: [RouterLink, ClerkOrganizationSwitcherComponent],
  template: `
    <div class="p-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              Welcome back{{ clerk.user()?.firstName ? ', ' + clerk.user()?.firstName : '' }}
            </h1>
            <p class="mt-1 text-gray-500">Explore the ngx-clerk component showcase</p>
          </div>
          <clerk-organization-switcher />
        </div>
      </div>

      <!-- Feature Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          routerLink="/dashboard/user-profile"
          class="group block rounded-xl border border-gray-200 bg-white p-6 hover:border-primary/30 hover:shadow-md transition-all"
        >
          <div class="flex items-start justify-between">
            <div>
              <div class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mb-3">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900">User Profile</h3>
              <p class="mt-1 text-sm text-gray-500">Manage your account settings, email, and security</p>
            </div>
            <svg class="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </a>

        <a
          routerLink="/dashboard/organization-profile"
          class="group block rounded-xl border border-gray-200 bg-white p-6 hover:border-primary/30 hover:shadow-md transition-all"
        >
          <div class="flex items-start justify-between">
            <div>
              <div class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mb-3">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900">Organization Profile</h3>
              <p class="mt-1 text-sm text-gray-500">View and manage your organization settings</p>
            </div>
            <svg class="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </a>

        <a
          routerLink="/dashboard/create-organization"
          class="group block rounded-xl border border-gray-200 bg-white p-6 hover:border-primary/30 hover:shadow-md transition-all"
        >
          <div class="flex items-start justify-between">
            <div>
              <div class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mb-3">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900">Create Organization</h3>
              <p class="mt-1 text-sm text-gray-500">Start a new organization and invite members</p>
            </div>
            <svg class="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </a>

        <a
          routerLink="/dashboard/organization-list"
          class="group block rounded-xl border border-gray-200 bg-white p-6 hover:border-primary/30 hover:shadow-md transition-all"
        >
          <div class="flex items-start justify-between">
            <div>
              <div class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mb-3">
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900">Organization List</h3>
              <p class="mt-1 text-sm text-gray-500">Browse and switch between your organizations</p>
            </div>
            <svg class="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </a>
      </div>
    </div>
  `,
})
export class DashboardHomeComponent {
  clerk = inject(ClerkService);
}
