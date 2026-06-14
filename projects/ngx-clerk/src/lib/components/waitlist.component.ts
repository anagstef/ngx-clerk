import { ChangeDetectionStrategy, Component, ElementRef, ViewEncapsulation, input, viewChild } from '@angular/core';
import type { WaitlistProps } from '@clerk/shared/types';
import { mountClerkComponent } from '../utils/mount';

@Component({
  selector: 'clerk-waitlist',
  standalone: true,
  template: `<div #ref></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
/** Renders the Clerk Waitlist UI component. */
export class ClerkWaitlistComponent {
  /** Props forwarded to the Clerk Waitlist component. Updates re-mount the component. */
  readonly props = input<WaitlistProps | undefined>(undefined);
  private readonly _ref = viewChild<ElementRef<HTMLElement>>('ref');

  constructor() {
    mountClerkComponent<WaitlistProps>({
      node: () => this._ref()?.nativeElement,
      props: () => this.props(),
      mount: (clerk, node, props) => clerk.mountWaitlist(node, props),
      unmount: (clerk, node) => clerk.unmountWaitlist(node),
    });
  }
}
