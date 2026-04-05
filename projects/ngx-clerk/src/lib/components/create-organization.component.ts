import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  Injector,
  Input,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import type { CreateOrganizationProps } from '@clerk/shared/types';
import { ClerkService } from '../services/clerk.service';

@Component({
  selector: 'clerk-create-organization',
  standalone: true,
  imports: [],
  template: `<div #ref></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
/** Renders the Clerk Create Organization UI component. */
export class ClerkCreateOrganizationComponent implements AfterViewInit, OnDestroy {
  @ViewChild('ref') ref: ElementRef | null = null;
  @Input() props: CreateOrganizationProps | undefined;

  private _clerk = inject(ClerkService);
  private _injector = inject(Injector);
  private _mounted = false;

  ngAfterViewInit() {
    const clerkInstance = this._clerk.clerk();
    if (clerkInstance && this.ref) {
      clerkInstance.mountCreateOrganization(this.ref.nativeElement, this.props);
      this._mounted = true;
    } else {
      const mountEffect = effect(() => {
        const c = this._clerk.clerk();
        if (c && this.ref && !this._mounted) {
          c.mountCreateOrganization(this.ref.nativeElement, this.props);
          this._mounted = true;
          mountEffect.destroy();
        }
      }, { injector: this._injector });
    }
  }

  ngOnDestroy() {
    const clerkInstance = this._clerk.clerk();
    if (clerkInstance && this.ref && this._mounted) {
      clerkInstance.unmountCreateOrganization(this.ref.nativeElement);
    }
  }
}
