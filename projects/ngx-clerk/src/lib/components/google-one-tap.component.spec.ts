import { describe, it, expect, beforeEach } from 'vitest';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClerkGoogleOneTapComponent } from './google-one-tap.component';
import { MockClerkService, provideMockClerk } from '../testing/mock-clerk';

@Component({
  standalone: true,
  imports: [ClerkGoogleOneTapComponent],
  template: `<clerk-google-one-tap />`,
})
class HostComponent {}

describe('ClerkGoogleOneTapComponent', () => {
  let mock: MockClerkService;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    const { mock: m, providers } = provideMockClerk();
    mock = m;
    TestBed.configureTestingModule({ imports: [HostComponent], providers });
    fixture = TestBed.createComponent(HostComponent);
  });

  it('does not open before Clerk loads', () => {
    fixture.detectChanges();
    expect(mock.instance['openGoogleOneTap']).not.toHaveBeenCalled();
  });

  it('opens with default options once Clerk is available', () => {
    mock.clerk.set(mock.instance);
    fixture.detectChanges();

    expect(mock.instance['openGoogleOneTap']).toHaveBeenCalledWith(
      expect.objectContaining({ cancelOnTapOutside: true, itpSupport: true, fedCmSupport: true }),
    );
  });

  it('closes on destroy', () => {
    mock.clerk.set(mock.instance);
    fixture.detectChanges();
    fixture.destroy();

    expect(mock.instance['closeGoogleOneTap']).toHaveBeenCalled();
  });
});
