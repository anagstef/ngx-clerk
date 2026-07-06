import { Routes } from '@angular/router';
import { canActivateClerk, canActivateProtect, catchAllRoute } from 'ngx-clerk';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home.component').then(m => m.HomeComponent),
  },
  {
    matcher: catchAllRoute('sign-in'),
    loadComponent: () => import('./pages/sign-in.component').then(m => m.SignInComponent),
  },
  {
    matcher: catchAllRoute('sign-up'),
    loadComponent: () => import('./pages/sign-up.component').then(m => m.SignUpComponent),
  },
  {
    path: 'waitlist',
    loadComponent: () => import('./pages/waitlist.component').then(m => m.WaitlistComponent),
  },
  {
    path: 'sso-callback',
    loadComponent: () => import('./pages/sso-callback.component').then(m => m.SsoCallbackComponent),
  },
  {
    path: 'dashboard',
    canActivate: [canActivateClerk],
    loadComponent: () => import('./pages/dashboard/layout.component').then(m => m.DashboardLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/dashboard-home.component').then(m => m.DashboardHomeComponent),
      },
      {
        path: 'user-profile',
        loadComponent: () => import('./pages/dashboard/user-profile.component').then(m => m.UserProfilePageComponent),
      },
      {
        path: 'organization-profile',
        loadComponent: () => import('./pages/dashboard/org-profile.component').then(m => m.OrgProfilePageComponent),
      },
      {
        path: 'create-organization',
        loadComponent: () => import('./pages/dashboard/create-org.component').then(m => m.CreateOrgPageComponent),
      },
      {
        path: 'organization-list',
        loadComponent: () => import('./pages/dashboard/org-list.component').then(m => m.OrgListPageComponent),
      },
      {
        path: 'sessions',
        loadComponent: () => import('./pages/dashboard/sessions.component').then(m => m.SessionsPageComponent),
      },
      {
        path: 'session-token',
        loadComponent: () => import('./pages/dashboard/session-token.component').then(m => m.SessionTokenPageComponent),
      },
      {
        path: 'protect',
        loadComponent: () => import('./pages/dashboard/protect.component').then(m => m.ProtectPageComponent),
      },
      {
        path: 'billing',
        loadComponent: () => import('./pages/dashboard/billing.component').then(m => m.BillingPageComponent),
      },
      {
        path: 'admin',
        canActivate: [canActivateProtect({ role: 'org:admin' }, { unauthorizedUrl: '/dashboard' })],
        loadComponent: () => import('./pages/dashboard/admin.component').then(m => m.AdminPageComponent),
      },
    ],
  },
];
