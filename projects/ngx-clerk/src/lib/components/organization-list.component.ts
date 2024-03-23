import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { ClerkService } from '../services/clerk.service';
import { take } from 'rxjs';
import { OrganizationListProps } from '@clerk/types';

@Component({
  selector: 'clerk-organization-list',
  standalone: true,
  imports: [],
  template: `<div #ref></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ClerkOrganizationListComponent implements AfterViewInit, OnDestroy {
  @ViewChild('ref') ref: ElementRef | null = null;
  @Input() props: OrganizationListProps | undefined;

  constructor(private _clerk: ClerkService) {}

  ngAfterViewInit() {
    this._clerk.clerk$.pipe(take(1)).subscribe((clerk) => {
      clerk.mountOrganizationList(this.ref?.nativeElement, this.props);
    });
  }

  ngOnDestroy() {
    this._clerk.clerk$.pipe(take(1)).subscribe((clerk) => {
      clerk.unmountOrganizationList(this.ref?.nativeElement);
    });
  }
}
