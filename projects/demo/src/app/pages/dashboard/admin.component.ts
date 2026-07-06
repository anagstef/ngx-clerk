import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-page',
  imports: [RouterLink],
  template: `
    <div class="p-8 max-w-3xl">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Admin area</h1>
        <p class="mt-1 text-gray-500">
          This route is protected by <code>canActivateProtect(&#123; role: 'org:admin' &#125;)</code>.
        </p>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-700">
        You can only see this page because you hold the <code>org:admin</code> role in the active organization.
        Otherwise the guard would have redirected you back to the
        <a routerLink="/dashboard" class="text-primary hover:underline">dashboard</a>.
      </div>
    </div>
  `,
})
export class AdminPageComponent {}
