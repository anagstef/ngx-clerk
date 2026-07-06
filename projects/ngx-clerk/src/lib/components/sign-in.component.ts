import { ChangeDetectionStrategy, Component, ElementRef, ViewEncapsulation, input, viewChild } from '@angular/core';
import type { SignInProps } from '@clerk/shared/types';
import { mountClerkComponent } from '../utils/mount';

@Component({
  selector: 'clerk-sign-in',
  standalone: true,
  template: `<div #ref></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
/** Renders the Clerk Sign In UI component. */
export class ClerkSignInComponent {
  /** Props forwarded to the Clerk Sign In component. Updates re-mount the component. */
  readonly props = input<SignInProps | undefined>(undefined);
  private readonly _ref = viewChild<ElementRef<HTMLElement>>('ref');

  constructor() {
    mountClerkComponent<SignInProps>({
      node: () => this._ref()?.nativeElement,
      props: () => this.props(),
      mount: (clerk, node, props) => clerk.mountSignIn(node, props),
      unmount: (clerk, node) => clerk.unmountSignIn(node),
    });
  }
}
