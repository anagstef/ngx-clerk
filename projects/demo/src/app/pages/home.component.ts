import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClerkService } from 'ngx-clerk';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a2e] text-white">
      <!-- Navigation -->
      <nav class="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <span class="text-lg font-bold tracking-tight">ngx-clerk</span>
        <div class="flex items-center gap-4">
          <a
            href="https://github.com/anagstef/ngx-clerk"
            target="_blank"
            rel="noopener"
            class="text-sm text-gray-400 hover:text-white transition-colors"
          >
            GitHub
          </a>
          @if (clerk.isLoaded()) {
            @if (clerk.isSignedIn()) {
              <a
                routerLink="/dashboard"
                class="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
              >
                Dashboard
              </a>
            } @else {
              <a
                routerLink="/sign-in"
                class="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
              >
                Sign in
              </a>
            }
          }
        </div>
      </nav>

      <!-- Hero -->
      <section class="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <span class="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-4">
          Clerk + Angular
        </span>
        <h1 class="text-5xl font-bold leading-tight mb-4">
          Authentication for Angular
        </h1>
        <p class="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
          Drop-in Clerk components for sign-in, user management, and organizations
        </p>
        <div class="flex items-center justify-center gap-3">
          @if (clerk.isLoaded() && clerk.isSignedIn()) {
            <a
              routerLink="/dashboard"
              class="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
            >
              Go to Dashboard
            </a>
          } @else {
            <a
              routerLink="/sign-in"
              class="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
            >
              Get Started
            </a>
          }
          <a
            href="https://github.com/anagstef/ngx-clerk#readme"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center px-6 py-3 rounded-lg border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
          >
            Documentation
          </a>
        </div>
      </section>

      <!-- Feature Cards -->
      <section class="max-w-6xl mx-auto px-6 pb-20">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <div class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 mb-4">
              <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h3 class="font-semibold text-white mb-1">Sign In / Sign Up</h3>
            <p class="text-sm text-gray-400">Pre-built authentication flows with social logins, MFA, and email/password</p>
          </div>

          <div class="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <div class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 mb-4">
              <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 class="font-semibold text-white mb-1">Organizations</h3>
            <p class="text-sm text-gray-400">Multi-tenant support with org creation, member management, and switching</p>
          </div>

          <div class="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
            <div class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 mb-4">
              <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 class="font-semibold text-white mb-1">User Management</h3>
            <p class="text-sm text-gray-400">Full user profile, account settings, email management, and security</p>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="border-t border-white/10 py-8">
        <div class="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm text-gray-500">
          <span>Built with ngx-clerk</span>
          <div class="flex items-center gap-6">
            <a href="https://clerk.com/docs" target="_blank" rel="noopener" class="hover:text-white transition-colors">Clerk Docs</a>
            <a href="https://github.com/anagstef/ngx-clerk" target="_blank" rel="noopener" class="hover:text-white transition-colors">GitHub</a>
            <a href="https://www.npmjs.com/package/ngx-clerk" target="_blank" rel="noopener" class="hover:text-white transition-colors">npm</a>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class HomeComponent {
  clerk = inject(ClerkService);
}
