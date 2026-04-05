import { Routes } from '@angular/router';
import { canActivateClerk, catchAllRoute } from 'ngx-clerk';

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
    path: 'dashboard',
    canActivate: [canActivateClerk],
    loadComponent: () => import('./pages/dashboard.component').then(m => m.DashboardComponent),
  },
];
