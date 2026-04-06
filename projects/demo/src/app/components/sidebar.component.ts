import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ClerkService, ClerkUserButtonComponent } from 'ngx-clerk';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, ClerkUserButtonComponent],
  template: `
    <aside class="fixed left-0 top-0 h-screen w-60 bg-dark-surface flex flex-col border-r border-dark-border">
      <!-- Logo -->
      <div class="px-6 py-5 border-b border-dark-border">
        <a routerLink="/" class="text-white font-bold text-lg tracking-tight">ngx-clerk</a>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <a
          routerLink="/dashboard"
          routerLinkActive="bg-white/10 text-white"
          [routerLinkActiveOptions]="{ exact: true }"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
          </svg>
          Dashboard
        </a>

        <a
          routerLink="/dashboard/user-profile"
          routerLinkActive="bg-white/10 text-white"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          User Profile
        </a>

        <a
          routerLink="/dashboard/organization-profile"
          routerLinkActive="bg-white/10 text-white"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Organization
        </a>

        <a
          routerLink="/dashboard/create-organization"
          routerLinkActive="bg-white/10 text-white"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
          </svg>
          Create Organization
        </a>

        <a
          routerLink="/dashboard/organization-list"
          routerLinkActive="bg-white/10 text-white"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Organization List
        </a>
      </nav>

      <!-- User button at bottom -->
      <div class="px-4 py-4 border-t border-dark-border">
        <div class="flex items-center gap-3">
          <clerk-user-button />
          @if (clerk.user(); as user) {
            <div class="min-w-0">
              <p class="text-sm font-medium text-white truncate">{{ user.fullName }}</p>
              <p class="text-xs text-gray-400 truncate">{{ user.primaryEmailAddress?.emailAddress }}</p>
            </div>
          }
        </div>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  clerk = inject(ClerkService);
}
