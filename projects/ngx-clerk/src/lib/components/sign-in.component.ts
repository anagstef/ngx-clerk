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
import type { SignInProps } from '@clerk/shared/types';
import { ClerkService } from '../services/clerk.service';

@Component({
  selector: 'clerk-sign-in',
  standalone: true,
  imports: [],
  template: `<div #ref></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
/** Renders the Clerk Sign In UI component. */
export class ClerkSignInComponent implements AfterViewInit, OnDestroy {
  @ViewChild('ref') ref: ElementRef | null = null;
  @Input() props: SignInProps | undefined;

  private _clerk = inject(ClerkService);
  private _injector = inject(Injector);
  private _mounted = false;

  ngAfterViewInit() {
    const clerkInstance = this._clerk.clerk();
    if (clerkInstance && this.ref) {
      clerkInstance.mountSignIn(this.ref.nativeElement, this.props);
      this._mounted = true;
    } else {
      const mountEffect = effect(() => {
        const c = this._clerk.clerk();
        if (c && this.ref && !this._mounted) {
          c.mountSignIn(this.ref.nativeElement, this.props);
          this._mounted = true;
          mountEffect.destroy();
        }
      }, { injector: this._injector });
    }
  }

  ngOnDestroy() {
    const clerkInstance = this._clerk.clerk();
    if (clerkInstance && this.ref && this._mounted) {
      clerkInstance.unmountSignIn(this.ref.nativeElement);
    }
  }
}
