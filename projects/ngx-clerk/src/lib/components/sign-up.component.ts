import { ChangeDetectionStrategy, Component, ElementRef, ViewEncapsulation, input, viewChild } from '@angular/core';
import type { SignUpProps } from '@clerk/shared/types';
import { mountClerkComponent } from '../utils/mount';

@Component({
  selector: 'clerk-sign-up',
  standalone: true,
  template: `<div #ref></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
/** Renders the Clerk Sign Up UI component. */
export class ClerkSignUpComponent {
  /** Props forwarded to the Clerk Sign Up component. Updates re-mount the component. */
  readonly props = input<SignUpProps | undefined>(undefined);
  private readonly _ref = viewChild<ElementRef<HTMLElement>>('ref');

  constructor() {
    mountClerkComponent<SignUpProps>({
      node: () => this._ref()?.nativeElement,
      props: () => this.props(),
      mount: (clerk, node, props) => clerk.mountSignUp(node, props),
      unmount: (clerk, node) => clerk.unmountSignUp(node),
    });
  }
}
