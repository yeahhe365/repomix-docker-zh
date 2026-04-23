import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, browseLocalPathDirectories } from '../../../website/client/components/api/client.js';

describe('browseLocalPathDirectories', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('requests the local directory listing from the website API', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          currentPath: '/Users',
          parentPath: null,
          entries: [
            {
              name: 'jones',
              path: '/Users/jones',
            },
          ],
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    vi.stubGlobal('fetch', fetchMock);

    const result = await browseLocalPathDirectories('/Users');

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/local-path/directories?path=%2FUsers');
    expect(result.entries[0]?.path).toBe('/Users/jones');
  });

  it('throws ApiError when the directory listing request fails', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: 'Local path mode is disabled.',
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    vi.stubGlobal('fetch', fetchMock);

    await expect(browseLocalPathDirectories()).rejects.toBeInstanceOf(ApiError);
  });

  it('surfaces a readable error when the server returns an HTML error page', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response('<html><h1>502 Bad Gateway</h1></html>', {
        status: 502,
        statusText: 'Bad Gateway',
        headers: {
          'Content-Type': 'text/html',
        },
      }),
    );

    vi.stubGlobal('fetch', fetchMock);

    await expect(browseLocalPathDirectories()).rejects.toMatchObject({
      message: expect.stringContaining('502'),
    });
  });
});
