<script setup lang="ts">
import ace, { type Ace } from 'ace-builds';
import themeTomorrowUrl from 'ace-builds/src-noconflict/theme-tomorrow?url';
import themeTomorrowNightUrl from 'ace-builds/src-noconflict/theme-tomorrow_night?url';
import { AlertTriangle, BarChart2, Copy, Download, GitFork, PackageSearch, Share, Terminal } from 'lucide-vue-next';
import { useData } from 'vitepress';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { VAceEditor } from 'vue3-ace-editor';
import type { PackOptions } from '../../composables/usePackOptions';
import type { PackResult } from '../api/client';
import { generateCliCommand } from '../utils/cliCommand';
import {
  canShareFiles,
  copyToClipboard,
  downloadResult,
  formatTimestamp,
  getEditorOptions,
  shareResult,
} from '../utils/resultViewer';
import SupportMessage from './SupportMessage.vue';
import { useHomeUiText } from './useHomeUiText';

ace.config.setModuleUrl('ace/theme/tomorrow', themeTomorrowUrl);
ace.config.setModuleUrl('ace/theme/tomorrow_night', themeTomorrowNightUrl);

const lightTheme = 'tomorrow';
const darkTheme = 'tomorrow_night';

const props = defineProps<{
  result: PackResult;
  packOptions?: PackOptions;
}>();

const copied = ref(false);
const shared = ref(false);
const canShare = ref(canShareFiles());
const { isDark } = useData();
const uiText = useHomeUiText();
const editorInstance = ref<Ace.Editor | null>(null);
const isMobile = ref(false);
const tooltipContainer = ref<HTMLElement | null>(null);
const tooltipContent = ref<HTMLElement | null>(null);

const editorOptions = computed(() => ({
  ...getEditorOptions(),
  theme: isDark.value ? `ace/theme/${darkTheme}` : `ace/theme/${lightTheme}`,
}));

watch(isDark, (newIsDark) => {
  if (editorInstance.value) {
    editorInstance.value.setTheme(newIsDark ? `ace/theme/${darkTheme}` : `ace/theme/${lightTheme}`);
  }
});

const hasSuspiciousFiles = computed(() => {
  return props.result.metadata.suspiciousFiles && props.result.metadata.suspiciousFiles.length > 0;
});

const formattedTimestamp = computed(() => {
  return formatTimestamp(props.result.metadata.timestamp);
});

const formattedResultFormat = computed(() => {
  return uiText.value.options.formatNames[props.result.format as keyof typeof uiText.value.options.formatNames] || props.result.format;
});

// Generate CLI command for local execution
const cliCommand = computed(() => {
  return generateCliCommand(props.result.metadata.repository, props.packOptions);
});

const commandCopied = ref(false);

const handleCopyCommand = async (event: Event) => {
  event.preventDefault();
  event.stopPropagation();

  try {
    await navigator.clipboard.writeText(cliCommand.value);
    commandCopied.value = true;
    setTimeout(() => {
      commandCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error(uiText.value.result.copyCommandError, err);
  }
};

const handleCopy = async (event: Event) => {
  event.preventDefault();
  event.stopPropagation();

  const success = await copyToClipboard(props.result.content, props.result.format);
  if (success) {
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  }
};

const handleDownload = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
  downloadResult(props.result.content, props.result.format, props.result);
};

const handleShare = async (event: Event) => {
  event.preventDefault();
  event.stopPropagation();

  // Only allow sharing on mobile devices with Web Share API support
  if (!isMobile.value || !canShare.value) {
    console.log(uiText.value.result.shareUnavailable);
    return;
  }

  const success = await shareResult(props.result.content, props.result.format, props.result);
  if (success) {
    shared.value = true;
    setTimeout(() => {
      shared.value = false;
    }, 2000);
  } else {
    console.log(uiText.value.result.shareFailed);
  }
};

const handleEditorMount = (editor: Ace.Editor) => {
  editorInstance.value = editor;
};

const updateTooltipPosition = () => {
  if (!tooltipContainer.value || !tooltipContent.value || isMobile.value) return;

  const containerRect = tooltipContainer.value.getBoundingClientRect();
  const tooltipEl = tooltipContent.value;

  // Position above the button with proper spacing for the arrow (like existing tooltips)
  tooltipEl.style.top = `${containerRect.top - 46}px`;
  tooltipEl.style.left = `${containerRect.left + containerRect.width / 2}px`;

  // Show tooltip (override CSS hover states)
  tooltipEl.style.opacity = '1';
  tooltipEl.style.visibility = 'visible';
};

const hideTooltip = () => {
  if (tooltipContent.value) {
    tooltipContent.value.style.opacity = '0';
    tooltipContent.value.style.visibility = 'hidden';
  }
};

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768;
};

const handleScroll = () => {
  // Hide tooltip on scroll to prevent detachment from button
  if (tooltipContent.value) {
    tooltipContent.value.style.opacity = '0';
    tooltipContent.value.style.visibility = 'hidden';
  }
};

onMounted(() => {
  isMobile.value = window.innerWidth <= 768;
  window.addEventListener('resize', handleResize);
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="content-wrapper">
    <div class="metadata-panel">
      <div class="metadata-section">
        <h3><GitFork :size="16" class="section-icon" /> {{ uiText.result.repositoryInfo }}</h3>
        <dl>
          <dt>{{ uiText.result.repository }}</dt>
          <dd>{{ result.metadata.repository }}</dd>
          <dt>{{ uiText.result.generatedAt }}</dt>
          <dd>{{ formattedTimestamp }}</dd>
          <dt>{{ uiText.result.format }}</dt>
          <dd>{{ formattedResultFormat }}</dd>
        </dl>
      </div>

      <div class="metadata-section">
        <h3><PackageSearch :size="16" class="section-icon" /> {{ uiText.result.packSummary }}</h3>
        <dl v-if="result.metadata.summary">
          <dt>{{ uiText.result.totalFiles }}</dt>
          <dd>{{ result.metadata.summary.totalFiles.toLocaleString() }} <span class="unit">{{ uiText.result.filesUnit }}</span></dd>
          <dt>{{ uiText.result.totalTokens }}</dt>
          <dd>{{ result.metadata.summary.totalTokens.toLocaleString() }} <span class="unit">{{ uiText.result.tokensUnit }}</span></dd>
          <dt>{{ uiText.result.totalSize }}</dt>
          <dd>{{ result.metadata.summary.totalCharacters.toLocaleString() }} <span class="unit">{{ uiText.result.charsUnit }}</span></dd>
        </dl>
      </div>

      <div class="metadata-section" v-if="result.metadata.topFiles">
        <h3><BarChart2 :size="16" class="section-icon" /> {{ uiText.result.topFiles(result.metadata.topFiles.length) }}</h3>
        <ol class="top-files-list">
          <li v-for="file in result.metadata.topFiles" :key="file.path">
            <div class="file-path">{{ file.path }}</div>
            <div class="file-stats">
              {{ file.tokenCount.toLocaleString() }} <span class="unit">{{ uiText.result.tokensUnit }}</span> <span class="separator-unit">|</span> {{ file.charCount.toLocaleString() }} <span class="unit">{{ uiText.result.charsUnit }}</span> <span class="separator-unit">|</span> {{ ((file.tokenCount / result.metadata.summary.totalTokens) * 100).toFixed(1) }}<span class="unit">%</span>
            </div>
          </li>
        </ol>
      </div>

      <div class="metadata-section security-warning" v-if="hasSuspiciousFiles">
        <h3><AlertTriangle :size="16" class="section-icon warning-icon" /> {{ uiText.result.securityAlert }}</h3>
        <p class="warning-description">{{ uiText.result.securityWarningDescription }}</p>
        <ul class="suspicious-files-list">
          <li v-for="file in result.metadata.suspiciousFiles" :key="file.filePath">
            <div class="file-path">{{ file.filePath }}</div>
            <div class="suspicious-messages">
              <span v-for="(message, index) in file.messages" :key="`${message}-${index}`" class="suspicious-message">{{ message }}</span>
            </div>
          </li>
        </ul>
      </div>

    </div>

    <div class="output-panel">
      <div class="output-actions">
        <button
          class="action-button"
          @click="handleCopy"
          :class="{ copied }"
        >
          <Copy :size="16" />
          {{ copied ? uiText.actions.copied : uiText.actions.copy }}
        </button>
        <button
          class="action-button"
          @click="handleDownload"
        >
          <Download :size="16" />
          {{ uiText.actions.download }}
        </button>
        <div v-if="canShare" class="mobile-only" style="flex-basis: 100%"></div>
        <div v-if="canShare" class="tooltip-container" ref="tooltipContainer" @mouseenter="updateTooltipPosition" @mouseleave="hideTooltip">
          <button
            class="action-button"
            @click="handleShare"
            :class="{ shared }"
            :disabled="!isMobile"
            :aria-label="uiText.actions.shareAria"
          >
            <Share :size="16" />
            {{ shared ? uiText.actions.shared : uiText.actions.openWithApp }}
          </button>
          <div class="tooltip-content desktop-only" ref="tooltipContent">
            {{ uiText.actions.onlyMobile }}
            <div class="tooltip-arrow"></div>
          </div>
        </div>
      </div>
      <div class="editor-container">
        <VAceEditor
          v-model:value="result.content"
          :lang="'text'"
          :style="{ height: '100%', width: '100%' }"
          :options="editorOptions"
          @mount="handleEditorMount"
        />
      </div>
    </div>
    <div class="cli-banner">
      <div class="cli-banner-content">
        <Terminal :size="16" class="cli-banner-icon" />
        <span class="cli-banner-label">{{ uiText.actions.runLocally }}</span>
        <code class="cli-banner-command">{{ cliCommand }}</code>
      </div>
      <button
        class="cli-banner-copy"
        @click="handleCopyCommand"
        :class="{ copied: commandCopied }"
      >
        <Copy :size="14" />
        <span>{{ commandCopied ? uiText.actions.copied : uiText.actions.copy }}</span>
      </button>
    </div>
    <div class="support-wrapper">
      <SupportMessage />
    </div>
  </div>
</template>

<style scoped>
.content-wrapper {
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 445px auto;
}

.metadata-panel {
  padding: 16px;
  border-right: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  overflow-y: auto;
}

.metadata-section {
  margin-bottom: 24px;
}

.metadata-section:last-child {
  margin-bottom: 0;
}

.metadata-section h3 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 6px;
}

.section-icon {
  color: var(--vp-c-text-2);
}

dl {
  margin: 0;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  font-size: 13px;
}

dt {
  color: var(--vp-c-text-2);
  font-weight: 500;
}

dd {
  margin: 0;
  color: var(--vp-c-text-1);
  text-transform: lowercase;
}

.unit {
  color: var(--vp-c-text-2);
  margin-left: 0.3em;
}

.separator-unit {
  color: var(--vp-c-text-3);
  margin: 0 0.5em;
}

.top-files-list {
  margin: 0;
  padding: 0 0 0 0;
  font-size: 13px;
}

.top-files-list li {
  margin-bottom: 8px;
  border-left: 2px solid var(--vp-c-divider);
  padding-left: 8px;
}

.security-warning {
  background: var(--vp-c-warning-soft);
  border-radius: 6px;
  padding: 12px;
}

.warning-icon {
  color: var(--vp-c-warning-1);
}

.warning-description {
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin: 0 0 8px;
}

.suspicious-files-list {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 13px;
}

.suspicious-files-list li {
  margin-bottom: 6px;
  border-left: 2px solid var(--vp-c-warning-1);
  padding-left: 8px;
}

.suspicious-files-list li:last-child {
  margin-bottom: 0;
}

.suspicious-messages {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.suspicious-message {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.file-path {
  color: var(--vp-c-text-1);
  margin-bottom: 2px;
  word-break: break-all;
}

.file-stats {
  font-size: 12px;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
}

.cli-banner {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 16px;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-border);
}

.cli-banner-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.cli-banner-icon {
  color: var(--vp-c-brand-1);
  flex-shrink: 0;
}

.cli-banner-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  flex-shrink: 0;
}

.cli-banner-command {
  font-size: 13px;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  padding: 4px 8px;
}

.cli-banner-copy {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cli-banner-copy:hover {
  background: var(--vp-c-brand-1);
  color: white;
}

.cli-banner-copy.copied {
  background: var(--vp-c-brand-1);
  color: white;
}

@media (max-width: 768px) {
  .cli-banner {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .cli-banner-content {
    flex-wrap: wrap;
  }

  .cli-banner-command {
    white-space: normal;
    word-break: break-all;
  }

  .cli-banner-copy {
    justify-content: center;
  }
}

.output-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 500px;
  background: var(--vp-c-bg);
  overflow: hidden;
}

.output-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-border);
  flex-shrink: 0;
}

.action-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button:hover {
  border-color: var(--vp-c-brand-1);
}

.action-button.copied {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

.action-button.shared {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

.editor-container {
  height: 100%;
  width: 100%;
  font-family: var(--vp-font-family-mono);
}

.support-wrapper {
  grid-column: 1 / -1;
}

.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    grid-template-rows: auto minmax(500px, auto) auto;
    height: auto;
  }

  .metadata-panel {
    border-right: none;
    border-bottom: 1px solid var(--vp-c-border);
    max-height: 400px;
    overflow-y: auto;
  }

  .output-panel {
    height: 500px;
  }

  .mobile-only {
    display: inline-flex;
  }
}

.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip-content {
  position: fixed;
  transform: translateX(-50%);
  margin-bottom: 8px;
  padding: 8px 12px;
  background: #333;
  color: white;
  font-size: 0.875rem;
  white-space: nowrap;
  border-radius: 4px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
  z-index: 9999;
  pointer-events: none;
  text-align: left;
}

.tooltip-arrow {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 8px;
  border-style: solid;
  border-color: #333 transparent transparent transparent;
}

.tooltip-container:hover .tooltip-content {
  opacity: 1;
  visibility: visible;
}

.desktop-only {
  display: block;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-button:disabled:hover {
  opacity: 0.5;
}

/* Dark mode support for tooltip */
html.dark .tooltip-content {
  background: #333;
  color: #ffffff;
}

html.dark .tooltip-arrow {
  border-color: #333 transparent transparent transparent;
}
</style>
