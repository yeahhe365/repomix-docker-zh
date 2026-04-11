import { describe, expect, it } from 'vitest';
import { shouldBypassRateLimit } from '../../../website/server/src/middlewares/rateLimit.js';

describe('rateLimitMiddleware', () => {
  it('bypasses rate limiting for local path directory browsing', () => {
    expect(shouldBypassRateLimit('GET', '/api/local-path/directories')).toBe(true);
  });

  it('keeps rate limiting enabled for pack requests', () => {
    expect(shouldBypassRateLimit('POST', '/api/pack')).toBe(false);
  });
});
