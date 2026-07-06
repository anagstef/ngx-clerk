import { Component, inject } from '@angular/core';
import { ClerkService, ClerkUserAvatarComponent } from 'ngx-clerk';

@Component({
  selector: 'app-sessions-page',
  imports: [ClerkUserAvatarComponent],
  template: `
    <div class="p-8 max-w-3xl">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Active sessions</h1>
        <p class="mt-1 text-gray-500">
          Every session on this device from <code>ClerkService.sessions()</code>. Switch with <code>setActive()</code>.
        </p>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
        @for (session of clerk.sessions(); track session.id) {
          <div class="flex items-center justify-between gap-4 p-4">
            <div class="flex items-center gap-3 min-w-0">
              <clerk-user-avatar />
              <div class="min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ session.publicUserData.identifier || session.id }}
                </p>
                <p class="text-xs text-gray-500">{{ session.status }}</p>
              </div>
            </div>
            @if (session.id === clerk.sessionId()) {
              <span class="text-xs font-medium text-green-700 bg-green-50 rounded-full px-2.5 py-1">Active</span>
            } @else {
              <button
                (click)="setActive(session.id)"
                class="text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Set active
              </button>
            }
          </div>
        } @empty {
          <p class="p-4 text-sm text-gray-500">No sessions found.</p>
        }
      </div>
    </div>
  `,
})
export class SessionsPageComponent {
  readonly clerk = inject(ClerkService);

  setActive(sessionId: string): void {
    void this.clerk.setActive({ session: sessionId });
  }
}
