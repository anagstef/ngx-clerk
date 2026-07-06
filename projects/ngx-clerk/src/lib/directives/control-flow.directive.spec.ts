import { describe, it, expect, beforeEach } from 'vitest';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ClerkLoadedDirective,
  ClerkLoadingDirective,
  ClerkSignedInDirective,
  ClerkSignedOutDirective,
} from './control-flow.directive';
import { MockClerkService, provideMockClerk } from '../testing/mock-clerk';

@Component({
  standalone: true,
  imports: [ClerkSignedInDirective, ClerkSignedOutDirective, ClerkLoadedDirective, ClerkLoadingDirective],
  template: `
    <span class="in" *clerkSignedIn>in</span>
    <span class="out" *clerkSignedOut>out</span>
    <span class="loaded" *clerkLoaded>loaded</span>
    <span class="loading" *clerkLoading>loading</span>
  `,
})
class HostComponent {}

describe('control-flow directives', () => {
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

  it('renders only *clerkLoading before Clerk has loaded', () => {
    expect(present('loading')).toBe(true);
    expect(present('loaded')).toBe(false);
    expect(present('in')).toBe(false);
    expect(present('out')).toBe(false);
  });

  it('renders *clerkLoaded and *clerkSignedOut once loaded and signed out', () => {
    mock.isLoaded.set(true);
    fixture.detectChanges();

    expect(present('loaded')).toBe(true);
    expect(present('loading')).toBe(false);
    expect(present('out')).toBe(true);
    expect(present('in')).toBe(false);
  });

  it('renders *clerkSignedIn and hides *clerkSignedOut once signed in', () => {
    mock.isLoaded.set(true);
    mock.isSignedIn.set(true);
    fixture.detectChanges();

    expect(present('in')).toBe(true);
    expect(present('out')).toBe(false);
    expect(present('loaded')).toBe(true);
  });

  it('reacts to signing back out', () => {
    mock.isLoaded.set(true);
    mock.isSignedIn.set(true);
    fixture.detectChanges();
    expect(present('in')).toBe(true);

    mock.isSignedIn.set(false);
    fixture.detectChanges();
    expect(present('in')).toBe(false);
    expect(present('out')).toBe(true);
  });
});
