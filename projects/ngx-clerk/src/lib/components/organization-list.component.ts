import { ChangeDetectionStrategy, Component, ElementRef, ViewEncapsulation, input, viewChild } from '@angular/core';
import type { OrganizationListProps } from '@clerk/shared/types';
import { mountClerkComponent } from '../utils/mount';

@Component({
  selector: 'clerk-organization-list',
  standalone: true,
  template: `<div #ref></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
/** Renders the Clerk Organization List UI component. */
export class ClerkOrganizationListComponent {
  /** Props forwarded to the Clerk Organization List component. Updates re-mount the component. */
  readonly props = input<OrganizationListProps | undefined>(undefined);
  private readonly _ref = viewChild<ElementRef<HTMLElement>>('ref');

  constructor() {
    mountClerkComponent<OrganizationListProps>({
      node: () => this._ref()?.nativeElement,
      props: () => this.props(),
      mount: (clerk, node, props) => clerk.mountOrganizationList(node, props),
      unmount: (clerk, node) => clerk.unmountOrganizationList(node),
    });
  }
}
