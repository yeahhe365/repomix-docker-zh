import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const dockerfilePath = path.resolve(import.meta.dirname, '../../website/server/Dockerfile');

describe('website server Dockerfile', () => {
  it('caps node heap usage for local packaged deployments', () => {
    const dockerfile = readFileSync(dockerfilePath, 'utf8');

    expect(dockerfile).toMatch(/NODE_OPTIONS=--max-old-space-size=\d+/);
  });
});
