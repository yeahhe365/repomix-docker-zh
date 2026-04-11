import { describe, expect, it } from 'vitest';
import {
  clearLocalPathBrowserState,
  createDefaultLocalPathBrowserState,
  loadLocalPathBrowserState,
  loadTryItPageState,
  resolveInitialTryItPageState,
  saveLocalPathBrowserState,
  saveTryItPageState,
  type StorageLike,
} from '../../../website/client/utils/tryItPersistence';
import { DEFAULT_PACK_OPTIONS } from '../../../website/client/composables/usePackOptions';

function createMemoryStorage(): StorageLike {
  const store = new Map<string, string>();
  return {
    getItem(key) {
      return store.get(key) ?? null;
    },
    setItem(key, value) {
      store.set(key, value);
    },
    removeItem(key) {
      store.delete(key);
    },
  };
}

describe('tryItPersistence', () => {
  it('round-trips persisted page state', () => {
    const storage = createMemoryStorage();

    saveTryItPageState(
      {
        mode: 'localPath',
        remoteUrl: 'yamadashy/repomix',
        localPath: '/Users/jones/Desktop/superpowers',
        packOptions: {
          ...DEFAULT_PACK_OPTIONS,
          format: 'markdown',
          compress: true,
        },
      },
      storage,
    );

    const restored = loadTryItPageState(DEFAULT_PACK_OPTIONS, storage);

    expect(restored).toEqual({
      mode: 'localPath',
      remoteUrl: 'yamadashy/repomix',
      localPath: '/Users/jones/Desktop/superpowers',
      packOptions: {
        ...DEFAULT_PACK_OPTIONS,
        format: 'markdown',
        compress: true,
      },
    });
  });

  it('prefers URL params over persisted remote state while preserving local path state', () => {
    const resolved = resolveInitialTryItPageState({
      defaultOptions: DEFAULT_PACK_OPTIONS,
      persistedState: {
        mode: 'localPath',
        remoteUrl: 'old/repo',
        localPath: '/Users/jones/Desktop/superpowers',
        packOptions: {
          ...DEFAULT_PACK_OPTIONS,
          format: 'plain',
        },
      },
      urlParams: {
        repo: 'new/repo',
        format: 'xml',
        directoryStructure: false,
      },
    });

    expect(resolved.mode).toBe('url');
    expect(resolved.remoteUrl).toBe('new/repo');
    expect(resolved.localPath).toBe('/Users/jones/Desktop/superpowers');
    expect(resolved.packOptions.format).toBe('xml');
    expect(resolved.packOptions.directoryStructure).toBe(false);
  });

  it('restores and clears persisted local path browser state', () => {
    const storage = createMemoryStorage();

    saveLocalPathBrowserState(
      {
        currentPath: '/Users/jones/Desktop',
        selectedPath: '/Users/jones/Desktop/superpowers',
        scrollTop: 128,
        recentPaths: ['/Users/jones/Desktop/superpowers'],
      },
      storage,
    );

    expect(loadLocalPathBrowserState(storage)).toEqual({
      currentPath: '/Users/jones/Desktop',
      selectedPath: '/Users/jones/Desktop/superpowers',
      scrollTop: 128,
      recentPaths: ['/Users/jones/Desktop/superpowers'],
    });

    clearLocalPathBrowserState(storage);

    expect(loadLocalPathBrowserState(storage)).toEqual(createDefaultLocalPathBrowserState());
  });
});
