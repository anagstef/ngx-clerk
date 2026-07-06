import { describe, it, expect, beforeEach } from 'vitest';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClerkAuthenticateWithRedirectCallbackComponent } from './authenticate-with-redirect-callback.component';
import { MockClerkService, provideMockClerk } from '../testing/mock-clerk';

@Component({
  standalone: true,
  imports: [ClerkAuthenticateWithRedirectCallbackComponent],
  template: `<clerk-authenticate-with-redirect-callback [props]="props" />`,
})
class HostComponent {
  props = { signInForceRedirectUrl: '/dashboard' };
}

describe('ClerkAuthenticateWithRedirectCallbackComponent', () => {
  let mock: MockClerkService;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    const { mock: m, providers } = provideMockClerk();
    mock = m;
    TestBed.configureTestingModule({ imports: [HostComponent], providers });
    fixture = TestBed.createComponent(HostComponent);
  });

  it('does nothing before Clerk loads', () => {
    fixture.detectChanges();
    expect(mock.handleRedirectCallback).not.toHaveBeenCalled();
  });

  it('handles the redirect callback once Clerk is available', () => {
    mock.clerk.set(mock.instance);
    fixture.detectChanges();

    expect(mock.handleRedirectCallback).toHaveBeenCalledWith({ signInForceRedirectUrl: '/dashboard' });
  });
});
