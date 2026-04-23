import fs from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('website server entry', () => {
  it('does not configure a hard API timeout middleware', async () => {
    const source = await fs.readFile(path.resolve(import.meta.dirname, '../../../website/server/src/index.ts'), 'utf8');

    expect(source).not.toContain("import { timeout } from 'hono/timeout';");
    expect(source).not.toContain('const API_TIMEOUT_MS = 35_000;');
    expect(source).not.toContain("app.use('/api', timeout(API_TIMEOUT_MS));");
  });
});
