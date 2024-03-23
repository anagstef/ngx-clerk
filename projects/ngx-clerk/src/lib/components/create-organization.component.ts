import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { ClerkService } from '../services/clerk.service';
import { take } from 'rxjs';
import { CreateOrganizationProps } from '@clerk/types';

@Component({
  selector: 'clerk-create-organization',
  standalone: true,
  imports: [],
  template: `<div #ref></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ClerkCreateOrganizationComponent implements AfterViewInit, OnDestroy {
  @ViewChild('ref') ref: ElementRef | null = null;
  @Input() props: CreateOrganizationProps | undefined;

  constructor(private _clerk: ClerkService) {}

  ngAfterViewInit() {
    this._clerk.clerk$.pipe(take(1)).subscribe((clerk) => {
      clerk.mountCreateOrganization(this.ref?.nativeElement, this.props);
    });
  }

  ngOnDestroy() {
    this._clerk.clerk$.pipe(take(1)).subscribe((clerk) => {
      clerk.unmountCreateOrganization(this.ref?.nativeElement);
    });
  }
}
