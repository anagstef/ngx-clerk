import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { ClerkService } from '../services/clerk.service';
import { take } from 'rxjs';
import { UserButtonProps } from '@clerk/types';

@Component({
  selector: 'clerk-user-button',
  standalone: true,
  imports: [],
  template: `<div #ref></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ClerkUserButtonComponent implements AfterViewInit, OnDestroy {
  @ViewChild('ref') ref: ElementRef | null = null;
  @Input() props: UserButtonProps | undefined;

  constructor(private _clerk: ClerkService) {}

  ngAfterViewInit() {
    this._clerk.clerk$.pipe(take(1)).subscribe((clerk) => {
      clerk.mountUserButton(this.ref?.nativeElement, this.props);
    });
  }

  ngOnDestroy() {
    this._clerk.clerk$.pipe(take(1)).subscribe((clerk) => {
      clerk.unmountUserButton(this.ref?.nativeElement);
    });
  }
}
