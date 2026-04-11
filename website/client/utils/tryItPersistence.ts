import type { PackOptions } from '../composables/usePackOptions';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export type PersistedInputMode = 'url' | 'file' | 'localPath';

export interface TryItPageState {
  mode: PersistedInputMode;
  remoteUrl: string;
  localPath: string;
  packOptions: PackOptions;
}

export interface LocalPathBrowserState {
  currentPath: string | null;
  selectedPath: string | null;
  scrollTop: number;
  recentPaths: string[];
}

const TRY_IT_PAGE_STATE_KEY = 'repomix-tryit-page-state-v1';
const LOCAL_PATH_BROWSER_STATE_KEY = 'repomix-local-path-browser-state-v1';

function getDefaultStorage(storage?: StorageLike): StorageLike | null {
  if (storage) {
    return storage;
  }

  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  return window.localStorage;
}

function isPersistedInputMode(value: unknown): value is PersistedInputMode {
  return value === 'url' || value === 'file' || value === 'localPath';
}

function setPackOption(target: PackOptions, key: keyof PackOptions, value: PackOptions[keyof PackOptions]) {
  (target as Record<keyof PackOptions, PackOptions[keyof PackOptions]>)[key] = value;
}

export function createDefaultLocalPathBrowserState(): LocalPathBrowserState {
  return {
    currentPath: null,
    selectedPath: null,
    scrollTop: 0,
    recentPaths: [],
  };
}

function sanitizePackOptions(defaultOptions: PackOptions, candidate: unknown): PackOptions {
  if (!candidate || typeof candidate !== 'object') {
    return { ...defaultOptions };
  }

  const nextOptions = { ...defaultOptions };

  for (const key of Object.keys(defaultOptions) as Array<keyof PackOptions>) {
    const value = (candidate as Partial<PackOptions>)[key];
    if (typeof defaultOptions[key] === 'boolean') {
      if (typeof value === 'boolean') {
        setPackOption(nextOptions, key, value);
      }
      continue;
    }

    if (typeof defaultOptions[key] === 'string' && typeof value === 'string') {
      setPackOption(nextOptions, key, value);
    }
  }

  return nextOptions;
}

export function loadTryItPageState(defaultOptions: PackOptions, storage?: StorageLike): TryItPageState | null {
  const resolvedStorage = getDefaultStorage(storage);
  if (!resolvedStorage) {
    return null;
  }

  try {
    const raw = resolvedStorage.getItem(TRY_IT_PAGE_STATE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<TryItPageState>;
    return {
      mode: isPersistedInputMode(parsed.mode) ? parsed.mode : 'url',
      remoteUrl: typeof parsed.remoteUrl === 'string' ? parsed.remoteUrl : '',
      localPath: typeof parsed.localPath === 'string' ? parsed.localPath : '',
      packOptions: sanitizePackOptions(defaultOptions, parsed.packOptions),
    };
  } catch {
    return null;
  }
}

export function saveTryItPageState(state: TryItPageState, storage?: StorageLike): void {
  const resolvedStorage = getDefaultStorage(storage);
  if (!resolvedStorage) {
    return;
  }

  resolvedStorage.setItem(TRY_IT_PAGE_STATE_KEY, JSON.stringify(state));
}

export function clearTryItPageState(storage?: StorageLike): void {
  const resolvedStorage = getDefaultStorage(storage);
  resolvedStorage?.removeItem(TRY_IT_PAGE_STATE_KEY);
}

export function resolveInitialTryItPageState({
  defaultOptions,
  persistedState,
  urlParams,
}: {
  defaultOptions: PackOptions;
  persistedState: TryItPageState | null;
  urlParams: Record<string, unknown>;
}): TryItPageState {
  const baseState: TryItPageState = persistedState ?? {
    mode: 'url',
    remoteUrl: '',
    localPath: '',
    packOptions: { ...defaultOptions },
  };

  const nextState: TryItPageState = {
    mode: baseState.mode,
    remoteUrl: baseState.remoteUrl,
    localPath: baseState.localPath,
    packOptions: sanitizePackOptions(defaultOptions, baseState.packOptions),
  };

  if (typeof urlParams.repo === 'string' && urlParams.repo.trim()) {
    nextState.mode = 'url';
    nextState.remoteUrl = urlParams.repo.trim();
  }

  for (const key of Object.keys(defaultOptions) as Array<keyof PackOptions>) {
    const value = urlParams[key];
    if (typeof defaultOptions[key] === 'boolean' && typeof value === 'boolean') {
      setPackOption(nextState.packOptions, key, value);
    }
    if (typeof defaultOptions[key] === 'string' && typeof value === 'string') {
      setPackOption(nextState.packOptions, key, value);
    }
  }

  return nextState;
}

export function loadLocalPathBrowserState(storage?: StorageLike): LocalPathBrowserState {
  const resolvedStorage = getDefaultStorage(storage);
  if (!resolvedStorage) {
    return createDefaultLocalPathBrowserState();
  }

  try {
    const raw = resolvedStorage.getItem(LOCAL_PATH_BROWSER_STATE_KEY);
    if (!raw) {
      return createDefaultLocalPathBrowserState();
    }

    const parsed = JSON.parse(raw) as Partial<LocalPathBrowserState>;
    return {
      currentPath: typeof parsed.currentPath === 'string' ? parsed.currentPath : null,
      selectedPath: typeof parsed.selectedPath === 'string' ? parsed.selectedPath : null,
      scrollTop: typeof parsed.scrollTop === 'number' ? parsed.scrollTop : 0,
      recentPaths: Array.isArray(parsed.recentPaths)
        ? parsed.recentPaths.filter((value): value is string => typeof value === 'string')
        : [],
    };
  } catch {
    return createDefaultLocalPathBrowserState();
  }
}

export function saveLocalPathBrowserState(state: LocalPathBrowserState, storage?: StorageLike): void {
  const resolvedStorage = getDefaultStorage(storage);
  if (!resolvedStorage) {
    return;
  }

  resolvedStorage.setItem(LOCAL_PATH_BROWSER_STATE_KEY, JSON.stringify(state));
}

export function clearLocalPathBrowserState(storage?: StorageLike): void {
  const resolvedStorage = getDefaultStorage(storage);
  resolvedStorage?.removeItem(LOCAL_PATH_BROWSER_STATE_KEY);
}
