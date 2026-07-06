import { describe, it, expect } from 'vitest';
import { clerkPropsEqual } from './mount';

describe('clerkPropsEqual', () => {
  it('treats structurally equal objects as equal', () => {
    expect(clerkPropsEqual({ a: 1, b: 'x' }, { a: 1, b: 'x' })).toBe(true);
  });

  it('detects content changes', () => {
    expect(clerkPropsEqual({ a: 1 }, { a: 2 })).toBe(false);
  });

  it('ignores function identity', () => {
    expect(clerkPropsEqual({ fn: () => 1 }, { fn: () => 2 })).toBe(true);
  });

  it('ignores object key order', () => {
    expect(clerkPropsEqual({ a: 1, b: 'x' }, { b: 'x', a: 1 })).toBe(true);
  });

  it('ignores key order in nested objects', () => {
    expect(
      clerkPropsEqual({ appearance: { variables: { colorPrimary: '#000' }, cssLayerName: 'clerk' } }, { appearance: { cssLayerName: 'clerk', variables: { colorPrimary: '#000' } } }),
    ).toBe(true);
  });

  it('treats undefined as equal to undefined', () => {
    expect(clerkPropsEqual(undefined, undefined)).toBe(true);
  });

  it('distinguishes undefined from a value', () => {
    expect(clerkPropsEqual(undefined, { a: 1 })).toBe(false);
  });
});
