import { describe, expect, it } from 'vitest';
import { getFrameAncestorsPolicy } from '../frame-ancestors';

describe('getFrameAncestorsPolicy', () => {
  it('should allow self and the allowed origins', () => {
    expect(
      getFrameAncestorsPolicy(['https://atb.no', 'https://*.atb.no'], false),
    ).toBe("frame-ancestors 'self' https://atb.no https://*.atb.no");
  });

  it('should only allow self when there are no allowed origins', () => {
    expect(getFrameAncestorsPolicy([], false)).toBe("frame-ancestors 'self'");
  });

  it('should allow localhost in development', () => {
    expect(getFrameAncestorsPolicy(['https://atb.no'], true)).toBe(
      "frame-ancestors 'self' https://atb.no http://localhost:*",
    );
  });
});
