import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export interface RuntimePackResult {
  totalFiles: number;
  totalCharacters: number;
  totalTokens: number;
  fileCharCounts: Record<string, number>;
  fileTokenCounts: Record<string, number>;
  suspiciousFilesResults: Array<{
    filePath: string;
    messages: string[];
  }>;
}

export interface RepomixRuntime {
  runDefaultAction: (
    directories: string[],
    cwd: string,
    cliOptions: Record<string, unknown>,
    progressCallback?: (message: string) => void,
  ) => Promise<{ packResult: RuntimePackResult }>;
  setLogLevel: (level: number) => void;
}

export async function prepareWorkerEnvironment(): Promise<() => void> {
  const previousWorkerPath = process.env.REPOMIX_WORKER_PATH;

  if (!previousWorkerPath) {
    const repoRoot = path.resolve(import.meta.dirname, '../../../../../');
    const builtWorkerPath = path.join(repoRoot, 'lib/shared/unifiedWorker.js');

    try {
      await fs.access(builtWorkerPath);
      process.env.REPOMIX_WORKER_PATH = pathToFileURL(builtWorkerPath).href;
    } catch {
      // Ignore missing build output and keep current environment
    }
  }

  return () => {
    if (previousWorkerPath === undefined) {
      delete process.env.REPOMIX_WORKER_PATH;
    } else {
      process.env.REPOMIX_WORKER_PATH = previousWorkerPath;
    }
  };
}

export async function loadRepomixRuntime(): Promise<RepomixRuntime> {
  try {
    const repomixModule = await import('repomix');
    return {
      runDefaultAction: repomixModule.runDefaultAction as RepomixRuntime['runDefaultAction'],
      setLogLevel: repomixModule.setLogLevel as RepomixRuntime['setLogLevel'],
    };
  } catch {
    const fallbackBasePath = path.resolve(import.meta.dirname, '../../../../../src');
    const [actionModule, loggerModule] = await Promise.all([
      import(pathToFileURL(path.join(fallbackBasePath, 'cli/actions/defaultAction.js')).href),
      import(pathToFileURL(path.join(fallbackBasePath, 'shared/logger.js')).href),
    ]);

    return {
      runDefaultAction: actionModule.runDefaultAction as RepomixRuntime['runDefaultAction'],
      setLogLevel: loggerModule.setLogLevel as RepomixRuntime['setLogLevel'],
    };
  }
}
