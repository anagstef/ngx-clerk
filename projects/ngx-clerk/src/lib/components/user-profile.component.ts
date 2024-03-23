import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { ClerkService } from '../services/clerk.service';
import { take } from 'rxjs';
import { UserProfileProps } from '@clerk/types';

@Component({
  selector: 'clerk-user-profile',
  standalone: true,
  imports: [],
  template: `<div #ref></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ClerkUserProfileComponent implements AfterViewInit, OnDestroy {
  @ViewChild('ref') ref: ElementRef | null = null;
  @Input() props: UserProfileProps | undefined;

  constructor(private _clerk: ClerkService) {}

  ngAfterViewInit() {
    this._clerk.clerk$.pipe(take(1)).subscribe((clerk) => {
      clerk.mountUserProfile(this.ref?.nativeElement, this.props);
    });
  }

  ngOnDestroy() {
    this._clerk.clerk$.pipe(take(1)).subscribe((clerk) => {
      clerk.unmountUserProfile(this.ref?.nativeElement);
    });
  }
}
