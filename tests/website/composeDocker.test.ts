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

  it('restarts the local API container automatically after failures', () => {
    const compose = readFileSync(composePath, 'utf8');

    expect(compose).toMatch(/server:\n(?:.*\n)*?\s+restart:\s+unless-stopped/);
  });

  it('binds local deployment ports to localhost only', () => {
    const compose = readFileSync(composePath, 'utf8');

    expect(compose).toContain('"127.0.0.1:5173:80"');
    expect(compose).toContain('"127.0.0.1:8080:8080"');
    expect(compose).not.toContain('"5173:80"');
    expect(compose).not.toContain('"8080:8080"');
  });
});
