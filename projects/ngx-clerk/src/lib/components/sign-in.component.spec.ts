import { describe, it, expect, beforeEach } from 'vitest';
import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { SignInProps } from '@clerk/shared/types';
import { ClerkSignInComponent } from './sign-in.component';
import { MockClerkService, provideMockClerk } from '../testing/mock-clerk';

@Component({
  standalone: true,
  imports: [ClerkSignInComponent],
  template: `<clerk-sign-in [props]="props()" />`,
})
class HostComponent {
  readonly props = signal<SignInProps | undefined>(undefined);
}

describe('ClerkSignInComponent', () => {
  let mock: MockClerkService;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    const { mock: m, providers } = provideMockClerk();
    mock = m;
    TestBed.configureTestingModule({ imports: [HostComponent], providers });
    fixture = TestBed.createComponent(HostComponent);
  });

  it('does not mount until Clerk has loaded', () => {
    fixture.detectChanges();
    expect(mock.instance['mountSignIn']).not.toHaveBeenCalled();
  });

  it('mounts into a host element once Clerk is available', () => {
    mock.clerk.set(mock.instance);
    fixture.detectChanges();

    expect(mock.instance['mountSignIn']).toHaveBeenCalledTimes(1);
    const node = mock.instance['mountSignIn'].mock.calls[0][0];
    expect(node).toBeInstanceOf(HTMLElement);
  });

  it('unmounts on destroy', () => {
    mock.clerk.set(mock.instance);
    fixture.detectChanges();
    fixture.destroy();

    expect(mock.instance['unmountSignIn']).toHaveBeenCalledTimes(1);
  });

  it('re-mounts when props change', () => {
    mock.clerk.set(mock.instance);
    fixture.detectChanges();
    expect(mock.instance['mountSignIn']).toHaveBeenCalledTimes(1);

    fixture.componentInstance.props.set({ routing: 'hash' });
    fixture.detectChanges();

    expect(mock.instance['unmountSignIn']).toHaveBeenCalledTimes(1);
    expect(mock.instance['mountSignIn']).toHaveBeenCalledTimes(2);
  });

  it('does not re-mount when an equal props literal is re-assigned', () => {
    mock.clerk.set(mock.instance);
    fixture.componentInstance.props.set({ routing: 'hash' });
    fixture.detectChanges();
    expect(mock.instance['mountSignIn']).toHaveBeenCalledTimes(1);

    // Same content, new object reference.
    fixture.componentInstance.props.set({ routing: 'hash' });
    fixture.detectChanges();
    expect(mock.instance['mountSignIn']).toHaveBeenCalledTimes(1);
  });
});
