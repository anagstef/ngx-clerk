import { Component, inject, signal } from '@angular/core';
import { ClerkService } from 'ngx-clerk';

@Component({
  selector: 'app-session-token-page',
  template: `
    <div class="p-8 max-w-3xl">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Session token</h1>
        <p class="mt-1 text-gray-500">
          Fetch the current session JWT with <code>ClerkService.getToken()</code> and use it to authenticate your backend.
        </p>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-6 space-y-5">
        <dl class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt class="text-gray-500">User ID</dt>
            <dd class="font-mono text-gray-900 truncate">{{ clerk.userId() ?? '—' }}</dd>
          </div>
          <div>
            <dt class="text-gray-500">Session ID</dt>
            <dd class="font-mono text-gray-900 truncate">{{ clerk.sessionId() ?? '—' }}</dd>
          </div>
          <div>
            <dt class="text-gray-500">Org role</dt>
            <dd class="font-mono text-gray-900">{{ clerk.orgRole() ?? '—' }}</dd>
          </div>
          <div>
            <dt class="text-gray-500">Org slug</dt>
            <dd class="font-mono text-gray-900">{{ clerk.orgSlug() ?? '—' }}</dd>
          </div>
        </dl>

        <button
          (click)="fetchToken()"
          class="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          Get token
        </button>

        @if (token(); as value) {
          <pre data-testid="session-token-value" class="p-3 rounded-lg bg-gray-900 text-green-300 text-xs overflow-x-auto whitespace-pre-wrap break-all">{{ value }}</pre>
        }
      </div>
    </div>
  `,
})
export class SessionTokenPageComponent {
  readonly clerk = inject(ClerkService);
  readonly token = signal<string | null>(null);

  async fetchToken(): Promise<void> {
    this.token.set(await this.clerk.getToken());
  }
}
