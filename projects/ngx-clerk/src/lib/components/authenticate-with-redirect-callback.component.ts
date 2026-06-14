import { ChangeDetectionStrategy, Component, ViewEncapsulation, effect, inject, input } from '@angular/core';
import type { HandleOAuthCallbackParams } from '@clerk/shared/types';
import { ClerkService } from '../services/clerk.service';

/**
 * Completes an OAuth/SSO redirect flow. Place it on your callback route (e.g.
 * `/sso-callback`); it calls `handleRedirectCallback()` once Clerk has loaded.
 *
 * @example
 * ```html
 * <clerk-authenticate-with-redirect-callback
 *   [props]="{ signInForceRedirectUrl: '/dashboard' }" />
 * ```
 */
@Component({
  selector: 'clerk-authenticate-with-redirect-callback',
  standalone: true,
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ClerkAuthenticateWithRedirectCallbackComponent {
  /** Parameters forwarded to `handleRedirectCallback`. */
  readonly props = input<HandleOAuthCallbackParams | undefined>(undefined);

  private readonly _clerk = inject(ClerkService);
  private _handled = false;

  constructor() {
    effect(() => {
      const clerk = this._clerk.clerk();
      if (clerk && !this._handled) {
        this._handled = true;
        void this._clerk.handleRedirectCallback(this.props());
      }
    });
  }
}
