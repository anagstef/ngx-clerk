import { ChangeDetectionStrategy, Component, ElementRef, ViewEncapsulation, input, viewChild } from '@angular/core';
import type { CreateOrganizationProps } from '@clerk/shared/types';
import { mountClerkComponent } from '../utils/mount';

@Component({
  selector: 'clerk-create-organization',
  standalone: true,
  template: `<div #ref></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
/** Renders the Clerk Create Organization UI component. */
export class ClerkCreateOrganizationComponent {
  /** Props forwarded to the Clerk Create Organization component. Updates re-mount the component. */
  readonly props = input<CreateOrganizationProps | undefined>(undefined);
  private readonly _ref = viewChild<ElementRef<HTMLElement>>('ref');

  constructor() {
    mountClerkComponent<CreateOrganizationProps>({
      node: () => this._ref()?.nativeElement,
      props: () => this.props(),
      mount: (clerk, node, props) => clerk.mountCreateOrganization(node, props),
      unmount: (clerk, node) => clerk.unmountCreateOrganization(node),
    });
  }
}
