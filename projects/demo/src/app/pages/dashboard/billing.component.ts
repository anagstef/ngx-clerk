import { Component } from '@angular/core';
import { ClerkPricingTableComponent } from 'ngx-clerk';

@Component({
  selector: 'app-billing-page',
  imports: [ClerkPricingTableComponent],
  template: `
    <div class="p-8">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Billing</h1>
        <p class="mt-1 text-gray-500">Clerk's <code>&lt;clerk-pricing-table /&gt;</code> rendered with your configured plans.</p>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white p-6">
        <clerk-pricing-table />
      </div>
    </div>
  `,
})
export class BillingPageComponent {}
