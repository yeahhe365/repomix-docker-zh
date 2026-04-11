import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const composePath = path.resolve(import.meta.dirname, '../../website/compose.docker.yml');

describe('compose.docker.yml', () => {
  it('uses the lightweight prebuilt client image for local Docker deployment', () => {
    const compose = readFileSync(composePath, 'utf8');

    expect(compose).toMatch(/target:\s*prebuilt/);
    expect(compose).not.toMatch(/target:\s*production/);
  });
});
