import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const devcontainerPath = path.resolve(import.meta.dirname, '../../.devcontainer/devcontainer.json');
const bootstrapScriptPath = path.resolve(import.meta.dirname, '../../.devcontainer/bootstrap-workspace.sh');
const startScriptPath = path.resolve(import.meta.dirname, '../../.devcontainer/start-website-services.sh');

describe('devcontainer website startup', () => {
  it('installs root, server, and client dependencies during container creation', () => {
    const devcontainer = JSON.parse(readFileSync(devcontainerPath, 'utf8')) as {
      postCreateCommand?: string;
    };

    expect(devcontainer.postCreateCommand).toBe('bash .devcontainer/bootstrap-workspace.sh');

    const bootstrapScript = readFileSync(bootstrapScriptPath, 'utf8');

    expect(bootstrapScript).toContain('npm install');
    expect(bootstrapScript).toContain('npm --prefix website/server install');
    expect(bootstrapScript).toContain('npm --prefix website/client install');
  });

  it('runs firewall setup and auto-starts website server and client when the container starts', () => {
    const devcontainer = JSON.parse(readFileSync(devcontainerPath, 'utf8')) as {
      postStartCommand?: string;
    };

    expect(devcontainer.postStartCommand).toBe('bash .devcontainer/start-website-services.sh');

    const startScript = readFileSync(startScriptPath, 'utf8');

    expect(startScript).toContain('sudo /usr/local/bin/init-firewall.sh');
    expect(startScript).toContain('npm run dev');
    expect(startScript).toContain('npm run docs:dev -- --host 0.0.0.0 --port 5173');
  });
});
