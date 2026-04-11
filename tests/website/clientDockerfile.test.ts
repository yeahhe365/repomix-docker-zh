import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const dockerfilePath = path.resolve(import.meta.dirname, '../../website/client/Dockerfile');

describe('website client Dockerfile', () => {
  it('keeps the production build heap small enough for local Docker builds', () => {
    const dockerfile = readFileSync(dockerfilePath, 'utf8');
    const match = dockerfile.match(/max-old-space-size=(\d+)/);

    expect(match).not.toBeNull();
    expect(Number(match?.[1])).toBeLessThanOrEqual(2048);
  });
});
