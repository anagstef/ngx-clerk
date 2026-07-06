import { ChangeDetectionStrategy, Component, ElementRef, ViewEncapsulation, input, viewChild } from '@angular/core';
import type { UserAvatarProps } from '@clerk/shared/types';
import { mountClerkComponent } from '../utils/mount';

@Component({
  selector: 'clerk-user-avatar',
  standalone: true,
  template: `<div #ref></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
/** Renders the Clerk User Avatar UI component. */
export class ClerkUserAvatarComponent {
  /** Props forwarded to the Clerk User Avatar component. Updates re-mount the component. */
  readonly props = input<UserAvatarProps | undefined>(undefined);
  private readonly _ref = viewChild<ElementRef<HTMLElement>>('ref');

  constructor() {
    mountClerkComponent<UserAvatarProps>({
      node: () => this._ref()?.nativeElement,
      props: () => this.props(),
      mount: (clerk, node, props) => clerk.mountUserAvatar(node, props),
      unmount: (clerk, node) => clerk.unmountUserAvatar(node),
    });
  }
}
