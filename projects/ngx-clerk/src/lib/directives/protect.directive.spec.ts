import { describe, it, expect, beforeEach } from 'vitest';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClerkProtectDirective } from './protect.directive';
import { MockClerkService, provideMockClerk } from '../testing/mock-clerk';

@Component({
  standalone: true,
  imports: [ClerkProtectDirective],
  template: `
    <span class="admin" *clerkProtect="{ role: 'org:admin' }; else denied">admin</span>
    <ng-template #denied><span class="denied">denied</span></ng-template>
  `,
})
class HostComponent {}

describe('ClerkProtectDirective', () => {
  let mock: MockClerkService;
  let fixture: ComponentFixture<HostComponent>;
  const present = (cls: string) => !!fixture.nativeElement.querySelector(`.${cls}`);

  beforeEach(() => {
    const { mock: m, providers } = provideMockClerk();
    mock = m;
    TestBed.configureTestingModule({ imports: [HostComponent], providers });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('renders neither branch while Clerk is loading', () => {
    expect(present('admin')).toBe(false);
    expect(present('denied')).toBe(false);
  });

  it('renders the else template when signed out', () => {
    mock.isLoaded.set(true);
    fixture.detectChanges();

    expect(present('admin')).toBe(false);
    expect(present('denied')).toBe(true);
  });

  it('renders content when the user is authorized', () => {
    mock.isLoaded.set(true);
    mock.isSignedIn.set(true);
    mock.has.mockReturnValue(true);
    fixture.detectChanges();

    expect(present('admin')).toBe(true);
    expect(present('denied')).toBe(false);
    expect(mock.has).toHaveBeenCalledWith({ role: 'org:admin' });
  });

  it('renders the else template when signed in but unauthorized', () => {
    mock.isLoaded.set(true);
    mock.isSignedIn.set(true);
    mock.has.mockReturnValue(false);
    fixture.detectChanges();

    expect(present('admin')).toBe(false);
    expect(present('denied')).toBe(true);
  });
});
