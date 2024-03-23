import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { ClerkService } from '../services/clerk.service';
import { take } from 'rxjs';
import { SignUpProps } from '@clerk/types';

@Component({
  selector: 'clerk-sign-up',
  standalone: true,
  imports: [],
  template: `<div #ref></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ClerkSignUpComponent implements AfterViewInit, OnDestroy {
  @ViewChild('ref') ref: ElementRef | null = null; 
  @Input() props: SignUpProps | undefined;

  constructor(private _clerk: ClerkService) {}

  ngAfterViewInit() {
    this._clerk.clerk$.pipe(take(1)).subscribe((clerk) => {
      clerk.mountSignUp(this.ref?.nativeElement, this.props);
    });
  }

  ngOnDestroy() {
    this._clerk.clerk$.pipe(take(1)).subscribe((clerk) => {
      clerk.unmountSignUp(this.ref?.nativeElement);
    });
  }
}
