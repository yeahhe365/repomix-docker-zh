import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { PackOptions, PackProgressCallback, PackResult } from '../../types.js';
import { AppError } from '../../utils/errorHandler.js';
import {
  assertLocalPathAllowlistConfigured,
  getBrowseRoots,
  isPathWithinRoot,
} from './localPathAccess.js';
import { loadRepomixRuntime, prepareWorkerEnvironment } from './localPathRuntime.js';

export interface LocalPathDirectoryEntry {
  name: string;
  path: string;
}

export interface LocalPathDirectoryListing {
  currentPath: string | null;
  parentPath: string | null;
  entries: LocalPathDirectoryEntry[];
}

export function isLocalPathModeEnabled(): boolean {
  return process.env.ENABLE_LOCAL_PATH_MODE === 'true';
}

export async function validateAndResolveLocalPath(localPath: string): Promise<string> {
  if (!isLocalPathModeEnabled()) {
    throw new AppError('Local path mode is disabled.', 403);
  }

  const trimmedPath = localPath.trim();
  if (!trimmedPath) {
    throw new AppError('Local path is required.', 400);
  }

  if (!path.isAbsolute(trimmedPath)) {
    throw new AppError('Local path must be an absolute path.', 400);
  }

  const resolvedPath = path.resolve(trimmedPath);
  const allowlistRoots = assertLocalPathAllowlistConfigured('access');

  if (!allowlistRoots.some((rootPath) => isPathWithinRoot(resolvedPath, rootPath))) {
    throw new AppError('Local path is outside the allowed directories.', 403);
  }

  let stats;
  try {
    stats = await fs.stat(resolvedPath);
  } catch {
    throw new AppError('Local path does not exist.', 404);
  }

  if (!stats.isDirectory()) {
    throw new AppError('Local path must point to a directory.', 400);
  }

  return resolvedPath;
}

export async function listLocalPathDirectories(localPath?: string): Promise<LocalPathDirectoryListing> {
  if (!isLocalPathModeEnabled()) {
    throw new AppError('Local path mode is disabled.', 403);
  }

  const browseRoots = getBrowseRoots();

  if (!localPath) {
    return {
      currentPath: null,
      parentPath: null,
      entries: browseRoots.map((rootPath) => ({
        name: rootPath,
        path: rootPath,
      })),
    };
  }

  const resolvedPath = await validateAndResolveLocalPath(localPath);
  const directoryEntries = await fs.readdir(resolvedPath, { withFileTypes: true });
  const entries = directoryEntries
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      name: entry.name,
      path: path.join(resolvedPath, entry.name),
    }))
    .sort((left, right) => left.name.localeCompare(right.name));

  const matchingRoot = browseRoots.find((rootPath) => isPathWithinRoot(resolvedPath, rootPath)) ?? null;
  const parentPath =
    matchingRoot && resolvedPath !== matchingRoot ? path.dirname(resolvedPath) : null;

  return {
    currentPath: resolvedPath,
    parentPath,
    entries,
  };
}

export async function processLocalPath(
  localPath: string,
  format: string,
  options: PackOptions,
  onProgress?: PackProgressCallback,
): Promise<PackResult> {
  const resolvedPath = await validateAndResolveLocalPath(localPath);
  const outputFilePath = path.join(os.tmpdir(), `repomix-output-${randomUUID()}.txt`);
  const repomixRuntime = await loadRepomixRuntime();

  const cliOptions = {
    output: outputFilePath,
    style: format,
    parsableStyle: options.outputParsable,
    removeComments: options.removeComments,
    removeEmptyLines: options.removeEmptyLines,
    outputShowLineNumbers: options.showLineNumbers,
    fileSummary: options.fileSummary,
    directoryStructure: options.directoryStructure,
    compress: options.compress,
    securityCheck: true,
    topFilesLen: 10,
    include: options.includePatterns,
    ignore: options.ignorePatterns,
    quiet: true,
  };

  repomixRuntime.setLogLevel(-1);
  const restoreWorkerEnvironment = await prepareWorkerEnvironment();

  try {
    await onProgress?.('processing');
    const packProgressCallback = (message: string) => {
      return onProgress?.('processing', message);
    };
    const result = await repomixRuntime.runDefaultAction(['.'], resolvedPath, cliOptions, packProgressCallback);
    const content = await fs.readFile(outputFilePath, 'utf-8');
    const packResult: RuntimePackResult = result.packResult;

    const suspiciousFiles =
      packResult.suspiciousFilesResults.length > 0
        ? packResult.suspiciousFilesResults.map((suspiciousResult) => ({
            filePath: suspiciousResult.filePath,
            messages: suspiciousResult.messages,
          }))
        : undefined;

    return {
      content,
      format,
      metadata: {
        repository: resolvedPath,
        timestamp: new Date().toISOString(),
        summary: {
          totalFiles: packResult.totalFiles,
          totalCharacters: packResult.totalCharacters,
          totalTokens: packResult.totalTokens,
        },
        topFiles: Object.entries(packResult.fileCharCounts)
          .map(([filePath, charCount]) => ({
            path: filePath,
            charCount,
            tokenCount: packResult.fileTokenCounts[filePath] || 0,
          }))
          .sort((a, b) => b.charCount - a.charCount)
          .slice(0, cliOptions.topFilesLen),
        allFiles: Object.entries(packResult.fileCharCounts)
          .map(([filePath, charCount]) => ({
            path: filePath,
            charCount,
            selected: true,
          }))
          .sort((a, b) => b.charCount - a.charCount),
        suspiciousFiles,
      },
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new AppError(`Local path processing failed.\n\n${error.message}`, 500);
    }

    throw new AppError('Local path processing failed.', 500);
  } finally {
    restoreWorkerEnvironment();
    try {
      await fs.unlink(outputFilePath);
    } catch {
      // Ignore cleanup errors
    }
  }
}
