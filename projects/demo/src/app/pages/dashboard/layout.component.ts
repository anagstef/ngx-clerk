import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar.component';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-sidebar />
      <main class="ml-60 min-h-screen">
        <router-outlet />
      </main>
    </div>
  `,
})
export class DashboardLayoutComponent {}
