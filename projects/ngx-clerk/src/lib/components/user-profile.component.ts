import { ChangeDetectionStrategy, Component, ElementRef, ViewEncapsulation, input, viewChild } from '@angular/core';
import type { UserProfileProps } from '@clerk/shared/types';
import { mountClerkComponent } from '../utils/mount';

@Component({
  selector: 'clerk-user-profile',
  standalone: true,
  template: `<div #ref></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
/** Renders the Clerk User Profile UI component. */
export class ClerkUserProfileComponent {
  /** Props forwarded to the Clerk User Profile component. Updates re-mount the component. */
  readonly props = input<UserProfileProps | undefined>(undefined);
  private readonly _ref = viewChild<ElementRef<HTMLElement>>('ref');

  constructor() {
    mountClerkComponent<UserProfileProps>({
      node: () => this._ref()?.nativeElement,
      props: () => this.props(),
      mount: (clerk, node, props) => clerk.mountUserProfile(node, props),
      unmount: (clerk, node) => clerk.unmountUserProfile(node),
    });
  }
}
