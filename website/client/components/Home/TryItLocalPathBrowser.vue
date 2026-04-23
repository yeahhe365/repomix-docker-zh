<script setup lang="ts">
import { ChevronLeft, FolderOpen, LoaderCircle, RefreshCw, X } from 'lucide-vue-next';
import { computed, nextTick, ref, watch } from 'vue';
import {
  createDefaultLocalPathBrowserState,
  type LocalPathBrowserState,
  loadLocalPathBrowserState,
  saveLocalPathBrowserState,
} from '../../utils/tryItPersistence';
import { ApiError, browseLocalPathDirectories, type LocalPathDirectoryListing } from '../api/client';
import {
  buildLocalPathBreadcrumbs,
  filterLocalPathEntries,
  moveLocalPathSelection,
  pushRecentLocalPath,
} from './localPathBrowserNavigation';
import { useHomeUiText } from './useHomeUiText';

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  select: [path: string];
}>();

const uiText = useHomeUiText();
const listing = ref<LocalPathDirectoryListing | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const selectedIndex = ref(-1);
const dialogRef = ref<HTMLDivElement | null>(null);
const listRef = ref<HTMLUListElement | null>(null);
const browserState = ref<LocalPathBrowserState>(createDefaultLocalPathBrowserState());
const searchQuery = ref('');

const currentLabel = computed(() => {
  return listing.value?.currentPath ?? uiText.value.upload.localPathBrowserRoots;
});

const breadcrumbs = computed(() => buildLocalPathBreadcrumbs(listing.value?.currentPath ?? null));
const visibleEntries = computed(() => filterLocalPathEntries(listing.value?.entries ?? [], searchQuery.value));
const selectedEntry = computed(() => {
  if (selectedIndex.value < 0) {
    return null;
  }

  return visibleEntries.value[selectedIndex.value] ?? null;
});

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      browserState.value = loadLocalPathBrowserState();
      searchQuery.value = '';
      await loadDirectory(browserState.value.currentPath ?? undefined);
      dialogRef.value?.focus();
    } else if (listRef.value) {
      persistBrowserState({
        scrollTop: listRef.value.scrollTop,
      });
    }
  },
);

watch([() => listing.value?.entries, searchQuery], () => {
  const activeEntries = visibleEntries.value;
  if (!activeEntries.length) {
    selectedIndex.value = -1;
    persistBrowserState({ selectedPath: null });
    return;
  }

  const restoredIndex = browserState.value.selectedPath
    ? activeEntries.findIndex((entry) => entry.path === browserState.value.selectedPath)
    : -1;

  if (restoredIndex >= 0) {
    selectedIndex.value = restoredIndex;
    return;
  }

  selectedIndex.value = 0;
});

watch(selectedIndex, (index) => {
  if (index >= 0 && visibleEntries.value[index]) {
    persistBrowserState({
      selectedPath: visibleEntries.value[index].path,
    });
  }
});

function persistBrowserState(partial: Partial<LocalPathBrowserState>) {
  browserState.value = {
    ...browserState.value,
    ...partial,
  };
  saveLocalPathBrowserState(browserState.value);
}

async function loadDirectory(targetPath?: string) {
  loading.value = true;
  error.value = null;
  const previousPath = browserState.value.currentPath;
  const previousScrollTop = browserState.value.scrollTop;

  try {
    listing.value = await browseLocalPathDirectories(targetPath);
    const shouldRestoreScroll = previousPath === listing.value.currentPath;
    persistBrowserState({
      currentPath: listing.value.currentPath,
      scrollTop: shouldRestoreScroll ? previousScrollTop : 0,
    });
    await nextTick();
    if (listRef.value) {
      listRef.value.scrollTop = shouldRestoreScroll ? previousScrollTop : 0;
    }
  } catch (err) {
    error.value = err instanceof ApiError || err instanceof Error ? err.message : uiText.value.errors.unexpectedError;
  } finally {
    loading.value = false;
  }
}

function selectEntry(index: number) {
  selectedIndex.value = index;
}

async function enterDirectory(targetPath: string) {
  await loadDirectory(targetPath);
  persistBrowserState({
    recentPaths: pushRecentLocalPath(browserState.value.recentPaths, targetPath),
  });
}

async function enterSelectedDirectory() {
  if (!selectedEntry.value) {
    return;
  }

  await enterDirectory(selectedEntry.value.path);
}

async function loadParent() {
  if (listing.value?.parentPath) {
    await loadDirectory(listing.value.parentPath);
    return;
  }

  await loadDirectory();
}

function closeBrowser() {
  emit('update:open', false);
}

function selectCurrentPath() {
  if (!listing.value?.currentPath) {
    return;
  }

  persistBrowserState({
    recentPaths: pushRecentLocalPath(browserState.value.recentPaths, listing.value.currentPath),
  });
  emit('select', listing.value.currentPath);
  closeBrowser();
}

async function retry() {
  await loadDirectory(listing.value?.currentPath ?? undefined);
}

async function jumpToBreadcrumb(path: string) {
  await loadDirectory(path);
}

async function openRecentPath(path: string) {
  searchQuery.value = '';
  persistBrowserState({
    recentPaths: pushRecentLocalPath(browserState.value.recentPaths, path),
  });
  await loadDirectory(path);
}

async function handleKeydown(event: KeyboardEvent) {
  if (!props.open || loading.value) {
    return;
  }

  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
    event.preventDefault();
    selectCurrentPath();
    return;
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      selectedIndex.value = moveLocalPathSelection(selectedIndex.value, visibleEntries.value.length, 'next');
      break;
    case 'ArrowUp':
      event.preventDefault();
      selectedIndex.value = moveLocalPathSelection(selectedIndex.value, visibleEntries.value.length, 'previous');
      break;
    case 'Enter':
      event.preventDefault();
      await enterSelectedDirectory();
      break;
    case 'Backspace':
      event.preventDefault();
      await loadParent();
      break;
    case 'Escape':
      event.preventDefault();
      closeBrowser();
      break;
  }
}

function handleOverlayClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    closeBrowser();
  }
}

function handleListScroll() {
  if (!listRef.value) {
    return;
  }

  persistBrowserState({
    scrollTop: listRef.value.scrollTop,
  });
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="browser-overlay"
      @click="handleOverlayClick"
    >
      <div
        ref="dialogRef"
        class="browser-dialog"
        role="dialog"
        aria-modal="true"
        tabindex="0"
        :aria-label="uiText.upload.localPathBrowserTitle"
        @keydown="handleKeydown"
      >
        <div class="browser-header">
          <div class="header-copy">
            <h3>{{ uiText.upload.localPathBrowserTitle }}</h3>
            <div v-if="breadcrumbs.length" class="breadcrumbs" :aria-label="currentLabel">
              <button
                v-for="crumb in breadcrumbs"
                :key="crumb.path"
                type="button"
                class="breadcrumb-button"
                @click="jumpToBreadcrumb(crumb.path)"
              >
                {{ crumb.label }}
              </button>
            </div>
            <p v-else class="root-label">{{ currentLabel }}</p>
          </div>
          <button type="button" class="icon-button" :aria-label="uiText.upload.localPathBrowserClose" @click="closeBrowser">
            <X :size="18" />
          </button>
        </div>

        <div class="browser-actions">
          <button type="button" class="secondary-button" @click="loadParent" :disabled="loading">
            <ChevronLeft :size="16" />
            <span>{{ uiText.upload.localPathBrowserBack }}</span>
          </button>
        </div>

        <div class="browser-search">
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            :placeholder="uiText.upload.localPathBrowserSearchPlaceholder"
          />
        </div>

        <div v-if="browserState.recentPaths.length" class="recent-section">
          <p class="recent-title">{{ uiText.upload.localPathBrowserRecentTitle }}</p>
          <div class="recent-list">
            <button
              v-for="recentPath in browserState.recentPaths"
              :key="recentPath"
              type="button"
              class="recent-chip"
              @click="openRecentPath(recentPath)"
            >
              {{ recentPath }}
            </button>
          </div>
        </div>

        <div v-if="loading" class="browser-state">
          <LoaderCircle :size="18" class="spin" />
          <span>{{ uiText.upload.localPathBrowserLoading }}</span>
        </div>

        <div v-else-if="error" class="browser-state browser-error">
          <p>{{ error }}</p>
          <button type="button" class="secondary-button" @click="retry">
            <RefreshCw :size="16" />
            <span>{{ uiText.upload.localPathBrowserRetry }}</span>
          </button>
        </div>

        <ul v-else ref="listRef" class="directory-list" @scroll="handleListScroll">
          <li v-if="!listing?.entries.length" class="empty-state">
            {{ uiText.upload.localPathBrowserEmpty }}
          </li>
          <li v-for="(entry, index) in visibleEntries" :key="entry.path">
            <button
              type="button"
              class="directory-button"
              :class="{ selected: index === selectedIndex }"
              @click="selectEntry(index)"
              @dblclick="enterDirectory(entry.path)"
            >
              <FolderOpen :size="18" />
              <span class="directory-name">{{ entry.name }}</span>
            </button>
          </li>
        </ul>

        <div class="browser-footer">
          <div class="footer-copy">
            <p class="selected-path">
              {{ selectedEntry?.path ?? listing?.currentPath ?? currentLabel }}
            </p>
            <p class="keyboard-hint">{{ uiText.upload.localPathBrowserKeyboardHint }}</p>
          </div>
          <button
            type="button"
            class="primary-button footer-button"
            @click="selectCurrentPath"
            :disabled="loading || !listing?.currentPath"
          >
            {{ uiText.upload.localPathBrowserSelectCurrent }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.browser-overlay {
  position: fixed;
  inset: 0;
  background: rgb(15 23 42 / 45%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
}

.browser-dialog {
  width: min(720px, 100%);
  max-height: min(80vh, 720px);
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  box-shadow: 0 24px 80px rgb(15 23 42 / 18%);
  padding: 20px;
  outline: none;
}

.browser-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.header-copy h3 {
  margin: 0 0 8px;
  font-size: 18px;
}

.breadcrumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.breadcrumb-button {
  border: none;
  background: transparent;
  color: var(--vp-c-brand-1);
  padding: 0;
  cursor: pointer;
  font: inherit;
}

.breadcrumb-button:not(:last-child)::after {
  content: '/';
  color: var(--vp-c-text-3);
  margin-left: 8px;
}

.root-label {
  margin: 0;
  color: var(--vp-c-text-2);
}

.browser-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.browser-search {
  display: flex;
}

.search-input {
  width: 100%;
  height: 42px;
  border: 1px solid var(--vp-c-border);
  border-radius: 10px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  padding: 0 14px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.recent-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recent-title {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.recent-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.recent-chip {
  max-width: 100%;
  border: 1px solid var(--vp-c-border);
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.primary-button,
.secondary-button,
.icon-button,
.directory-button {
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border-radius: 10px;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.primary-button,
.secondary-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 14px;
}

.primary-button {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}

.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.directory-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
  flex: 1;
}

.directory-button {
  width: 100%;
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  text-align: left;
  cursor: pointer;
}

.directory-button.selected {
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, var(--vp-c-bg-soft));
  border-color: var(--vp-c-brand-1);
}

.directory-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.browser-state,
.empty-state {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-2);
  text-align: center;
}

.browser-error {
  flex-direction: column;
  gap: 12px;
}

.browser-footer {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  border-top: 1px solid var(--vp-c-border);
  padding-top: 14px;
}

.footer-copy {
  min-width: 0;
  flex: 1;
}

.selected-path,
.keyboard-hint {
  margin: 0;
}

.selected-path {
  color: var(--vp-c-text-1);
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.keyboard-hint {
  color: var(--vp-c-text-2);
  font-size: 13px;
  margin-top: 6px;
}

.footer-button {
  flex-shrink: 0;
}

.spin {
  animation: spin 1s linear infinite;
}

.primary-button:hover,
.secondary-button:hover,
.icon-button:hover,
.directory-button:hover {
  border-color: var(--vp-c-brand-1);
}

.primary-button:disabled,
.secondary-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .browser-overlay {
    padding: 12px;
  }

  .browser-dialog {
    padding: 16px;
  }

  .browser-actions {
    flex-direction: column;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
    justify-content: center;
  }

  .browser-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .footer-button {
    width: 100%;
  }

  .selected-path {
    white-space: normal;
    word-break: break-all;
  }
}
</style>
