import { describe, it, expect, beforeEach } from 'vitest';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ClerkSignInButtonDirective,
  ClerkSignOutButtonDirective,
  ClerkSignUpButtonDirective,
} from './button.directives';
import { MockClerkService, provideMockClerk } from '../testing/mock-clerk';

@Component({
  standalone: true,
  imports: [ClerkSignInButtonDirective, ClerkSignUpButtonDirective, ClerkSignOutButtonDirective],
  template: `
    <button class="si-redirect" clerkSignInButton fallbackRedirectUrl="/dash">in</button>
    <button class="si-modal" clerkSignInButton mode="modal">in</button>
    <button class="su" clerkSignUpButton>up</button>
    <button class="so" clerkSignOutButton redirectUrl="/bye">out</button>
  `,
})
class HostComponent {}

describe('button directives', () => {
  let mock: MockClerkService;
  let fixture: ComponentFixture<HostComponent>;
  const click = (cls: string) => fixture.nativeElement.querySelector(`.${cls}`).click();

  beforeEach(() => {
    const { mock: m, providers } = provideMockClerk();
    mock = m;
    TestBed.configureTestingModule({ imports: [HostComponent], providers });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('redirects to sign-in by default, remapping the fallback url', () => {
    click('si-redirect');
    expect(mock.redirectToSignIn).toHaveBeenCalledWith(
      expect.objectContaining({ signInFallbackRedirectUrl: '/dash' }),
    );
    expect(mock.openSignIn).not.toHaveBeenCalled();
  });

  it('opens the sign-in modal in modal mode', () => {
    click('si-modal');
    expect(mock.openSignIn).toHaveBeenCalled();
    expect(mock.redirectToSignIn).not.toHaveBeenCalled();
  });

  it('redirects to sign-up on the sign-up button', () => {
    click('su');
    expect(mock.redirectToSignUp).toHaveBeenCalled();
  });

  it('signs out with the provided redirect url', () => {
    click('so');
    expect(mock.signOut).toHaveBeenCalledWith(expect.objectContaining({ redirectUrl: '/bye' }));
  });
});
