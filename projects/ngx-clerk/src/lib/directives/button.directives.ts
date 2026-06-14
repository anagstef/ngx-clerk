import { Directive, inject, input } from '@angular/core';
import { ClerkService } from '../services/clerk.service';

/** Sign-in/up button trigger mode. */
export type ClerkButtonMode = 'redirect' | 'modal';

/**
 * Attribute directive that triggers Clerk sign-in on click. In `redirect` mode
 * (default) it navigates to the sign-in page; in `modal` mode it opens the
 * sign-in modal. Apply it to your own button so you keep full control of styling.
 *
 * @example
 * ```html
 * <button clerkSignInButton>Sign in</button>
 * <button clerkSignInButton mode="modal">Sign in</button>
 * ```
 */
@Directive({
  selector: '[clerkSignInButton]',
  standalone: true,
  host: { '(click)': 'onClick()' },
})
export class ClerkSignInButtonDirective {
  private readonly _clerk = inject(ClerkService);

  /** `'redirect'` (default) navigates to the sign-in page; `'modal'` opens the modal. */
  readonly mode = input<ClerkButtonMode>('redirect');
  readonly forceRedirectUrl = input<string>();
  readonly fallbackRedirectUrl = input<string>();
  readonly signUpForceRedirectUrl = input<string>();
  readonly signUpFallbackRedirectUrl = input<string>();

  onClick(): void {
    if (this.mode() === 'modal') {
      this._clerk.openSignIn({
        forceRedirectUrl: this.forceRedirectUrl(),
        fallbackRedirectUrl: this.fallbackRedirectUrl(),
        signUpForceRedirectUrl: this.signUpForceRedirectUrl(),
        signUpFallbackRedirectUrl: this.signUpFallbackRedirectUrl(),
      });
      return;
    }
    this._clerk.redirectToSignIn({
      signInForceRedirectUrl: this.forceRedirectUrl(),
      signInFallbackRedirectUrl: this.fallbackRedirectUrl(),
      signUpForceRedirectUrl: this.signUpForceRedirectUrl(),
      signUpFallbackRedirectUrl: this.signUpFallbackRedirectUrl(),
    });
  }
}

/**
 * Attribute directive that triggers Clerk sign-up on click. In `redirect` mode
 * (default) it navigates to the sign-up page; in `modal` mode it opens the
 * sign-up modal.
 *
 * @example
 * ```html
 * <button clerkSignUpButton>Create account</button>
 * ```
 */
@Directive({
  selector: '[clerkSignUpButton]',
  standalone: true,
  host: { '(click)': 'onClick()' },
})
export class ClerkSignUpButtonDirective {
  private readonly _clerk = inject(ClerkService);

  /** `'redirect'` (default) navigates to the sign-up page; `'modal'` opens the modal. */
  readonly mode = input<ClerkButtonMode>('redirect');
  readonly forceRedirectUrl = input<string>();
  readonly fallbackRedirectUrl = input<string>();
  readonly signInForceRedirectUrl = input<string>();
  readonly signInFallbackRedirectUrl = input<string>();

  onClick(): void {
    if (this.mode() === 'modal') {
      this._clerk.openSignUp({
        forceRedirectUrl: this.forceRedirectUrl(),
        fallbackRedirectUrl: this.fallbackRedirectUrl(),
        signInForceRedirectUrl: this.signInForceRedirectUrl(),
        signInFallbackRedirectUrl: this.signInFallbackRedirectUrl(),
      });
      return;
    }
    this._clerk.redirectToSignUp({
      signUpForceRedirectUrl: this.forceRedirectUrl(),
      signUpFallbackRedirectUrl: this.fallbackRedirectUrl(),
      signInForceRedirectUrl: this.signInForceRedirectUrl(),
      signInFallbackRedirectUrl: this.signInFallbackRedirectUrl(),
    });
  }
}

/**
 * Attribute directive that signs the current user out on click.
 *
 * @example
 * ```html
 * <button clerkSignOutButton redirectUrl="/">Sign out</button>
 * ```
 */
@Directive({
  selector: '[clerkSignOutButton]',
  standalone: true,
  host: { '(click)': 'onClick()' },
})
export class ClerkSignOutButtonDirective {
  private readonly _clerk = inject(ClerkService);

  /** URL to navigate to after signing out. */
  readonly redirectUrl = input<string>();
  /** A specific session to sign out of. Omit to sign out of all sessions. */
  readonly sessionId = input<string>();

  onClick(): void {
    void this._clerk.signOut({ redirectUrl: this.redirectUrl(), sessionId: this.sessionId() });
  }
}
