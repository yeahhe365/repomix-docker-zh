import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  listLocalPathDirectories,
  processLocalPath,
  validateAndResolveLocalPath,
} from '../../../website/server/src/domains/pack/localPath.js';

describe('localPath mode', () => {
  const originalEnable = process.env.ENABLE_LOCAL_PATH_MODE;
  const originalAllowlist = process.env.LOCAL_PATH_ALLOWLIST;

  beforeEach(() => {
    delete process.env.LOCAL_PATH_ALLOWLIST;
  });

  afterEach(() => {
    if (originalEnable === undefined) {
      delete process.env.ENABLE_LOCAL_PATH_MODE;
    } else {
      process.env.ENABLE_LOCAL_PATH_MODE = originalEnable;
    }

    if (originalAllowlist === undefined) {
      delete process.env.LOCAL_PATH_ALLOWLIST;
    } else {
      process.env.LOCAL_PATH_ALLOWLIST = originalAllowlist;
    }
  });

  it('allows an existing absolute path when local path mode is enabled', async () => {
    process.env.ENABLE_LOCAL_PATH_MODE = 'true';

    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'repomix-local-path-'));
    process.env.LOCAL_PATH_ALLOWLIST = tempDir;

    await expect(validateAndResolveLocalPath(tempDir)).resolves.toBe(tempDir);

    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('packs a local directory when local path mode is enabled', async () => {
    process.env.ENABLE_LOCAL_PATH_MODE = 'true';

    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'repomix-local-pack-'));
    process.env.LOCAL_PATH_ALLOWLIST = tempDir;
    await fs.writeFile(path.join(tempDir, 'hello.ts'), 'export const hello = "world";\n');

    const result = await processLocalPath(tempDir, 'plain', {});

    expect(result.metadata.repository).toBe(tempDir);
    expect(result.metadata.summary?.totalFiles).toBe(1);
    expect(result.content).toContain('hello = "world"');

    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('rejects browsing roots when no allowlist is configured', async () => {
    process.env.ENABLE_LOCAL_PATH_MODE = 'true';

    await expect(listLocalPathDirectories()).rejects.toMatchObject({
      message: 'Local path browsing requires LOCAL_PATH_ALLOWLIST to be configured.',
      statusCode: 403,
    });
  });

  it('rejects packing a local directory when no allowlist is configured', async () => {
    process.env.ENABLE_LOCAL_PATH_MODE = 'true';

    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'repomix-local-pack-no-allowlist-'));

    await expect(processLocalPath(tempDir, 'plain', {})).rejects.toMatchObject({
      message: 'Local path access requires LOCAL_PATH_ALLOWLIST to be configured.',
      statusCode: 403,
    });

    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('lists allowlist roots when browsing starts without a selected path', async () => {
    process.env.ENABLE_LOCAL_PATH_MODE = 'true';

    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'repomix-local-root-'));
    process.env.LOCAL_PATH_ALLOWLIST = tempRoot;

    const listing = await listLocalPathDirectories();

    expect(listing.currentPath).toBeNull();
    expect(listing.parentPath).toBeNull();
    expect(listing.entries).toEqual([
      {
        name: tempRoot,
        path: tempRoot,
      },
    ]);

    await fs.rm(tempRoot, { recursive: true, force: true });
  });

  it('lists only child directories for an allowlisted path', async () => {
    process.env.ENABLE_LOCAL_PATH_MODE = 'true';

    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'repomix-local-browse-'));
    const projectDir = path.join(tempRoot, 'project');
    await fs.mkdir(path.join(projectDir, 'src'), { recursive: true });
    await fs.mkdir(path.join(projectDir, 'docs'), { recursive: true });
    await fs.writeFile(path.join(projectDir, 'README.md'), '# hello\n');
    process.env.LOCAL_PATH_ALLOWLIST = tempRoot;

    const listing = await listLocalPathDirectories(projectDir);

    expect(listing.currentPath).toBe(projectDir);
    expect(listing.parentPath).toBe(tempRoot);
    expect(listing.entries).toEqual([
      {
        name: 'docs',
        path: path.join(projectDir, 'docs'),
      },
      {
        name: 'src',
        path: path.join(projectDir, 'src'),
      },
    ]);

    await fs.rm(tempRoot, { recursive: true, force: true });
  });
});
