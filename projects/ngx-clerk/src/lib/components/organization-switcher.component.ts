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
import type { OrganizationSwitcherProps } from '@clerk/shared/types';
import { ClerkService } from '../services/clerk.service';

@Component({
  selector: 'clerk-organization-switcher',
  standalone: true,
  imports: [],
  template: `<div #ref></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ClerkOrganizationSwitcherComponent implements AfterViewInit, OnDestroy {
  @ViewChild('ref') ref: ElementRef | null = null;
  @Input() props: OrganizationSwitcherProps | undefined;

  private _clerk = inject(ClerkService);
  private _injector = inject(Injector);
  private _mounted = false;

  ngAfterViewInit() {
    const clerkInstance = this._clerk.clerk();
    if (clerkInstance && this.ref) {
      clerkInstance.mountOrganizationSwitcher(this.ref.nativeElement, this.props);
      this._mounted = true;
    } else {
      const mountEffect = effect(() => {
        const c = this._clerk.clerk();
        if (c && this.ref && !this._mounted) {
          c.mountOrganizationSwitcher(this.ref.nativeElement, this.props);
          this._mounted = true;
          mountEffect.destroy();
        }
      }, { injector: this._injector });
    }
  }

  ngOnDestroy() {
    const clerkInstance = this._clerk.clerk();
    if (clerkInstance && this.ref && this._mounted) {
      clerkInstance.unmountOrganizationSwitcher(this.ref.nativeElement);
    }
  }
}
