import { ChangeDetectionStrategy, Component, DestroyRef, ViewEncapsulation, effect, inject, input } from '@angular/core';
import type { GoogleOneTapProps } from '@clerk/shared/types';
import { ClerkService } from '../services/clerk.service';

/**
 * Renders Google One Tap sign-in. Opens once Clerk has loaded and closes on
 * destroy. Prop changes after the initial open are not re-applied.
 *
 * @example
 * ```html
 * <clerk-google-one-tap />
 * ```
 */
@Component({
  selector: 'clerk-google-one-tap',
  standalone: true,
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ClerkGoogleOneTapComponent {
  /** Props forwarded to Google One Tap. */
  readonly props = input<GoogleOneTapProps | undefined>(undefined);

  private readonly _clerk = inject(ClerkService);
  private _opened = false;

  constructor() {
    const destroyRef = inject(DestroyRef);

    effect(() => {
      const clerk = this._clerk.clerk();
      if (clerk && !this._opened) {
        this._opened = true;
        clerk.openGoogleOneTap({
          cancelOnTapOutside: true,
          itpSupport: true,
          fedCmSupport: true,
          ...this.props(),
        });
      }
    });

    destroyRef.onDestroy(() => {
      if (this._opened) {
        this._clerk.clerk()?.closeGoogleOneTap();
      }
    });
  }
}
