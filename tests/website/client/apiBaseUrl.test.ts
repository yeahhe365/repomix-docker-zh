import { describe, expect, it } from 'vitest';
import { resolveApiBaseUrl } from '../../../website/client/components/api/baseUrl';

describe('resolveApiBaseUrl', () => {
  it('prefers VITE_REPOMIX_API_BASE_URL when provided', () => {
    expect(
      resolveApiBaseUrl({
        PROD: true,
        VITE_REPOMIX_API_BASE_URL: 'http://localhost:8080',
      }),
    ).toBe('http://localhost:8080');
  });

  it('uses the local API in development when no override is set', () => {
    expect(resolveApiBaseUrl({ PROD: false })).toBe('http://localhost:8080');
  });

  it('uses the hosted API in production when no override is set', () => {
    expect(resolveApiBaseUrl({ PROD: true })).toBe('https://api.repomix.com');
  });
});
