import { ChangeDetectionStrategy, Component, ElementRef, ViewEncapsulation, input, viewChild } from '@angular/core';
import type { OrganizationSwitcherProps } from '@clerk/shared/types';
import { mountClerkComponent } from '../utils/mount';

@Component({
  selector: 'clerk-organization-switcher',
  standalone: true,
  template: `<div #ref></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
/** Renders the Clerk Organization Switcher UI component. */
export class ClerkOrganizationSwitcherComponent {
  /** Props forwarded to the Clerk Organization Switcher component. Updates re-mount the component. */
  readonly props = input<OrganizationSwitcherProps | undefined>(undefined);
  private readonly _ref = viewChild<ElementRef<HTMLElement>>('ref');

  constructor() {
    mountClerkComponent<OrganizationSwitcherProps>({
      node: () => this._ref()?.nativeElement,
      props: () => this.props(),
      mount: (clerk, node, props) => clerk.mountOrganizationSwitcher(node, props),
      unmount: (clerk, node) => clerk.unmountOrganizationSwitcher(node),
    });
  }
}
