import { Component, inject } from '@angular/core';
import { ClerkProtectDirective, ClerkService } from 'ngx-clerk';

@Component({
  selector: 'app-protect-page',
  imports: [ClerkProtectDirective],
  template: `
    <div class="p-8 max-w-3xl">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Authorization</h1>
        <p class="mt-1 text-gray-500">
          Gate UI with the <code>*clerkProtect</code> directive and <code>ClerkService.has()</code>.
        </p>
      </div>

      <div class="space-y-4">
        <div class="rounded-xl border border-gray-200 bg-white p-6">
          <h3 class="font-semibold text-gray-900 mb-3">Admins only</h3>
          <div
            *clerkProtect="{ role: 'org:admin' }; else notAdmin"
            class="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2"
          >
            ✓ You have the <code>org:admin</code> role in the active organization.
          </div>
          <ng-template #notAdmin>
            <div data-testid="protect-fallback" class="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
              You need the <code>org:admin</code> role to see this content.
            </div>
          </ng-template>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-6">
          <h3 class="font-semibold text-gray-900 mb-2">Imperative check</h3>
          <p class="text-sm text-gray-600">
            <code>has(&#123; permission: 'org:posts:manage' &#125;)</code> →
            <span data-testid="protect-permission-value" class="font-mono font-medium">{{ clerk.has({ permission: 'org:posts:manage' }) }}</span>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class ProtectPageComponent {
  readonly clerk = inject(ClerkService);
}
