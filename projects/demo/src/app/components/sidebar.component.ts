import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ClerkService, ClerkSignOutButtonDirective, ClerkUserButtonComponent } from 'ngx-clerk';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, ClerkUserButtonComponent, ClerkSignOutButtonDirective],
  template: `
    <aside class="fixed left-0 top-0 h-screen w-60 bg-dark-surface flex flex-col border-r border-dark-border">
      <!-- Logo -->
      <div class="px-6 py-5 border-b border-dark-border">
        <a routerLink="/" class="text-white font-bold text-lg tracking-tight">ngx-clerk</a>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        @for (item of navItems; track item.path) {
          <a
            [routerLink]="item.path"
            routerLinkActive="bg-white/10 text-white"
            [routerLinkActiveOptions]="{ exact: item.exact }"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" [attr.d]="item.icon" />
            </svg>
            {{ item.label }}
          </a>
        }
      </nav>

      <!-- User button + sign out at bottom -->
      <div class="px-4 py-4 border-t border-dark-border space-y-3">
        <div class="flex items-center gap-3">
          <clerk-user-button />
          @if (clerk.user(); as user) {
            <div class="min-w-0">
              <p class="text-sm font-medium text-white truncate">{{ user.fullName }}</p>
              <p class="text-xs text-gray-400 truncate">{{ user.primaryEmailAddress?.emailAddress }}</p>
            </div>
          }
        </div>
        <button
          clerkSignOutButton
          redirectUrl="/"
          class="w-full text-sm px-3 py-2 rounded-lg border border-dark-border text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  readonly clerk = inject(ClerkService);

  readonly navItems = [
    { path: '/dashboard', exact: true, label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1' },
    { path: '/dashboard/user-profile', exact: false, label: 'User Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { path: '/dashboard/organization-profile', exact: false, label: 'Organization', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { path: '/dashboard/create-organization', exact: false, label: 'Create Organization', icon: 'M12 4v16m8-8H4' },
    { path: '/dashboard/organization-list', exact: false, label: 'Organization List', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { path: '/dashboard/sessions', exact: false, label: 'Active Sessions', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { path: '/dashboard/session-token', exact: false, label: 'Session Token', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' },
    { path: '/dashboard/protect', exact: false, label: 'Authorization', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { path: '/dashboard/billing', exact: false, label: 'Billing', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { path: '/dashboard/admin', exact: false, label: 'Admin', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  ];
}
