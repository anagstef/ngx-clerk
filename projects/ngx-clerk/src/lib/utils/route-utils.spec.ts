import { describe, it, expect } from 'vitest';
import { UrlSegment } from '@angular/router';
import { catchAllRoute } from './route-utils';

describe('catchAllRoute', () => {
  const seg = (path: string) => new UrlSegment(path, {});

  it('matches a URL whose first segment starts with the path', () => {
    const matcher = catchAllRoute('sign-in');
    const url = [seg('sign-in'), seg('factor-one')];
    expect(matcher(url)).toEqual({ consumed: url });
  });

  it('returns null when the first segment does not match', () => {
    const matcher = catchAllRoute('sign-in');
    expect(matcher([seg('dashboard')])).toBeNull();
  });

  it('returns null for an empty URL', () => {
    const matcher = catchAllRoute('sign-in');
    expect(matcher([])).toBeNull();
  });
});
