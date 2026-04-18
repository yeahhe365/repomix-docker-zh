import path from 'node:path';
import { AppError } from '../../utils/errorHandler.js';

export function getAllowlistRoots(): string[] {
  const raw = process.env.LOCAL_PATH_ALLOWLIST?.trim();
  if (!raw) {
    return [];
  }

  return raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => path.resolve(item));
}

export function assertLocalPathAllowlistConfigured(purpose: 'access' | 'browse'): string[] {
  const allowlistRoots = getAllowlistRoots();

  if (allowlistRoots.length === 0) {
    if (purpose === 'browse') {
      throw new AppError('Local path browsing requires LOCAL_PATH_ALLOWLIST to be configured.', 403);
    }

    throw new AppError('Local path access requires LOCAL_PATH_ALLOWLIST to be configured.', 403);
  }

  return allowlistRoots;
}

export function getBrowseRoots(): string[] {
  return assertLocalPathAllowlistConfigured('browse');
}

export function isPathWithinRoot(targetPath: string, rootPath: string): boolean {
  const relative = path.relative(rootPath, targetPath);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}
