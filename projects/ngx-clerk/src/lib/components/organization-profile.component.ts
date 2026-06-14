import { ChangeDetectionStrategy, Component, ElementRef, ViewEncapsulation, input, viewChild } from '@angular/core';
import type { OrganizationProfileProps } from '@clerk/shared/types';
import { mountClerkComponent } from '../utils/mount';

@Component({
  selector: 'clerk-organization-profile',
  standalone: true,
  template: `<div #ref></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
/** Renders the Clerk Organization Profile UI component. */
export class ClerkOrganizationProfileComponent {
  /** Props forwarded to the Clerk Organization Profile component. Updates re-mount the component. */
  readonly props = input<OrganizationProfileProps | undefined>(undefined);
  private readonly _ref = viewChild<ElementRef<HTMLElement>>('ref');

  constructor() {
    mountClerkComponent<OrganizationProfileProps>({
      node: () => this._ref()?.nativeElement,
      props: () => this.props(),
      mount: (clerk, node, props) => clerk.mountOrganizationProfile(node, props),
      unmount: (clerk, node) => clerk.unmountOrganizationProfile(node),
    });
  }
}
