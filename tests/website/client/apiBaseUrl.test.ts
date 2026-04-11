import { describe, expect, it } from 'vitest';
import { resolveApiBaseUrl } from '../../../website/client/components/api/baseUrl';

describe('resolveApiBaseUrl', () => {
  const localhostLocation = {
    origin: 'http://localhost:5173',
    hostname: 'localhost',
  };

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

  it('uses the current origin for local production deployments when no override is set', () => {
    expect(resolveApiBaseUrl({ PROD: true }, localhostLocation)).toBe('http://localhost:5173');
  });

  it('uses the current origin for local production deployments when a local override was baked into the bundle', () => {
    expect(
      resolveApiBaseUrl(
        {
          PROD: true,
          VITE_REPOMIX_API_BASE_URL: 'http://localhost:8081',
        },
        localhostLocation,
      ),
    ).toBe('http://localhost:5173');
  });
});
