import { ChangeDetectionStrategy, Component, ElementRef, ViewEncapsulation, input, viewChild } from '@angular/core';
import type { PricingTableProps } from '@clerk/shared/types';
import { mountClerkComponent } from '../utils/mount';

@Component({
  selector: 'clerk-pricing-table',
  standalone: true,
  template: `<div #ref></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
/** Renders the Clerk Pricing Table UI component. */
export class ClerkPricingTableComponent {
  /** Props forwarded to the Clerk Pricing Table component. Updates re-mount the component. */
  readonly props = input<PricingTableProps | undefined>(undefined);
  private readonly _ref = viewChild<ElementRef<HTMLElement>>('ref');

  constructor() {
    mountClerkComponent<PricingTableProps>({
      node: () => this._ref()?.nativeElement,
      props: () => this.props(),
      mount: (clerk, node, props) => clerk.mountPricingTable(node, props),
      unmount: (clerk, node) => clerk.unmountPricingTable(node),
    });
  }
}
