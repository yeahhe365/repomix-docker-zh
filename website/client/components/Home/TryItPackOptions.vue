<script setup lang="ts">
import { HelpCircle } from 'lucide-vue-next';
import { AnalyticsAction } from '../utils/analytics';
import { handleOptionChange } from '../utils/requestHandlers';
import { useHomeUiText } from './useHomeUiText';

const props = defineProps<{
  format: 'xml' | 'markdown' | 'plain';
  includePatterns: string;
  ignorePatterns: string;
  fileSummary: boolean;
  directoryStructure: boolean;
  removeComments: boolean;
  removeEmptyLines: boolean;
  showLineNumbers: boolean;
  outputParsable: boolean;
  compress: boolean;
}>();

const uiText = useHomeUiText();

const emit = defineEmits<{
  'update:format': [value: 'xml' | 'markdown' | 'plain'];
  'update:includePatterns': [value: string];
  'update:ignorePatterns': [value: string];
  'update:fileSummary': [value: boolean];
  'update:directoryStructure': [value: boolean];
  'update:removeComments': [value: boolean];
  'update:removeEmptyLines': [value: boolean];
  'update:showLineNumbers': [value: boolean];
  'update:outputParsable': [value: boolean];
  'update:compress': [value: boolean];
}>();

function handleFormatChange(newFormat: 'xml' | 'markdown' | 'plain') {
  emit('update:format', newFormat);
  handleOptionChange(newFormat, AnalyticsAction.FORMAT_CHANGE);
}

function handleIncludePatternsUpdate(patterns: string) {
  emit('update:includePatterns', patterns);
  handleOptionChange(patterns, AnalyticsAction.UPDATE_INCLUDE_PATTERNS);
}

function handleIgnorePatternsUpdate(patterns: string) {
  emit('update:ignorePatterns', patterns);
  handleOptionChange(patterns, AnalyticsAction.UPDATE_IGNORE_PATTERNS);
}

function handleFileSummaryToggle(enabled: boolean) {
  emit('update:fileSummary', enabled);
  handleOptionChange(enabled, AnalyticsAction.TOGGLE_FILE_SUMMARY);
}

function handleDirectoryStructureToggle(enabled: boolean) {
  emit('update:directoryStructure', enabled);
  handleOptionChange(enabled, AnalyticsAction.TOGGLE_DIRECTORY_STRUCTURE);
}

function handleRemoveCommentsToggle(enabled: boolean) {
  emit('update:removeComments', enabled);
  handleOptionChange(enabled, AnalyticsAction.TOGGLE_REMOVE_COMMENTS);
}

function handleRemoveEmptyLinesToggle(enabled: boolean) {
  emit('update:removeEmptyLines', enabled);
  handleOptionChange(enabled, AnalyticsAction.TOGGLE_REMOVE_EMPTY_LINES);
}

function handleShowLineNumbersToggle(enabled: boolean) {
  emit('update:showLineNumbers', enabled);
  handleOptionChange(enabled, AnalyticsAction.TOGGLE_LINE_NUMBERS);
}

function handleOutputParsableToggle(enabled: boolean) {
  emit('update:outputParsable', enabled);
  handleOptionChange(enabled, AnalyticsAction.TOGGLE_OUTPUT_PARSABLE);
}

function handleCompressToggle(enabled: boolean) {
  emit('update:compress', enabled);
  handleOptionChange(enabled, AnalyticsAction.TOGGLE_COMPRESS);
}
</script>

<template>
  <div class="options-container">
    <div class="left-column">
      <div class="option-section">
        <p class="option-label">{{ uiText.options.outputFormat }}</p>
        <div class="format-buttons">
          <button
            class="format-button"
            :class="{ active: format === 'xml' }"
            @click="handleFormatChange('xml')"
            type="button"
          >
            {{ uiText.options.formatNames.xml }}
          </button>
          <button
            class="format-button"
            :class="{ active: format === 'markdown' }"
            @click="handleFormatChange('markdown')"
            type="button"
          >
            {{ uiText.options.formatNames.markdown }}
          </button>
          <button
            class="format-button"
            :class="{ active: format === 'plain' }"
            @click="handleFormatChange('plain')"
            type="button"
          >
            {{ uiText.options.formatNames.plain }}
          </button>
        </div>
      </div>

      <div class="option-section">
        <p class="option-label">
          {{ uiText.options.includePatternsPrefix }}
          <a href="https://github.com/mrmlnc/fast-glob#pattern-syntax" target="_blank" rel="noopener noreferrer">{{ uiText.options.globPatterns }}</a>
          {{ uiText.options.includePatternsSuffix }}
        </p>
        <div class="input-group">
          <input
            :value="includePatterns"
            @input="event => handleIncludePatternsUpdate((event.target as HTMLInputElement).value)"
            type="text"
            class="pattern-input"
            :placeholder="uiText.options.includePatternsPlaceholder"
            :aria-label="uiText.options.includePatternsAria"
          />
        </div>
      </div>

      <div class="option-section">
        <p class="option-label">{{ uiText.options.ignorePatterns }}</p>
        <div class="input-group">
          <input
            :value="ignorePatterns"
            @input="event => handleIgnorePatternsUpdate((event.target as HTMLInputElement).value)"
            type="text"
            class="pattern-input"
            :placeholder="uiText.options.ignorePatternsPlaceholder"
            :aria-label="uiText.options.ignorePatternsAria"
          />
        </div>
      </div>
    </div>

    <div class="right-column">


      <div class="option-section">
        <p class="option-label">{{ uiText.options.outputFormatOptions }}</p>
        <div class="checkbox-group">
          <label class="checkbox-label">
            <input
              :checked="fileSummary"
              @change="event => handleFileSummaryToggle((event.target as HTMLInputElement).checked)"
              type="checkbox"
              class="checkbox-input"
            />
            <span>{{ uiText.options.includeFileSummary }}</span>
          </label>
          <label class="checkbox-label">
            <input
              :checked="directoryStructure"
              @change="event => handleDirectoryStructureToggle((event.target as HTMLInputElement).checked)"
              type="checkbox"
              class="checkbox-input"
            />
            <span>{{ uiText.options.includeDirectoryStructure }}</span>
          </label>
          <label class="checkbox-label">
            <input
              :checked="showLineNumbers"
              @change="event => handleShowLineNumbersToggle((event.target as HTMLInputElement).checked)"
              type="checkbox"
              class="checkbox-input"
            />
            <span>{{ uiText.options.showLineNumbers }}</span>
          </label>
          <label class="checkbox-label">
            <input
              :checked="outputParsable"
              @change="event => handleOutputParsableToggle((event.target as HTMLInputElement).checked)"
              type="checkbox"
              class="checkbox-input"
            />
            <div class="parsable-option">
              <span>{{ uiText.options.outputParsableFormat }}</span>
              <div class="tooltip-container">
                <HelpCircle
                  :size="16"
                  class="help-icon"
                  :aria-label="uiText.options.outputParsableInfoAria"
                />
                <div class="tooltip-content">
                  {{ uiText.options.outputParsableHelp }}
                  <div class="tooltip-arrow"></div>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>

      <div class="option-section">
        <p class="option-label">{{ uiText.options.fileProcessingOptions }}</p>
        <div class="checkbox-group">
          <label class="checkbox-label">
            <input
              :checked="compress"
              @change="event => handleCompressToggle((event.target as HTMLInputElement).checked)"
              type="checkbox"
              class="checkbox-input"
            />
            <div class="option-with-tooltip">
              <span>{{ uiText.options.compressCode }}</span>
              <div class="tooltip-container">
                <HelpCircle
                  :size="16"
                  class="help-icon"
                  :aria-label="uiText.options.compressInfoAria"
                />
                <div class="tooltip-content">
                  {{ uiText.options.compressHelp }}
                  <div class="tooltip-arrow"></div>
                </div>
              </div>
            </div>
          </label>
          <label class="checkbox-label">
            <input
              :checked="removeComments"
              @change="event => handleRemoveCommentsToggle((event.target as HTMLInputElement).checked)"
              type="checkbox"
              class="checkbox-input"
            />
            <span>{{ uiText.options.removeComments }}</span>
          </label>
          <label class="checkbox-label">
            <input
              :checked="removeEmptyLines"
              @change="event => handleRemoveEmptyLinesToggle((event.target as HTMLInputElement).checked)"
              type="checkbox"
              class="checkbox-input"
            />
            <span>{{ uiText.options.removeEmptyLines }}</span>
          </label>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.options-container {
  display: grid;
  grid-template-columns: 60% 40%;
  gap: 24px;
  margin-bottom: 24px;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-column {
  gap: 18px;
}

.option-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.option-label {
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  color: var(--vp-c-text-2);
  padding-bottom: 4px;
}

.option-label a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.option-label a:hover {
  text-decoration: underline;
}

.option-with-tooltip {
  display: flex;
  align-items: center;
  gap: 4px;
}

.format-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.format-button {
  padding: 8px 16px;
  font-size: 14px;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.format-button:hover {
  border-color: var(--vp-c-brand-1);
}

.format-button.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--vp-c-text-1);
}

.checkbox-input {
  width: 16px;
  height: 16px;
  accent-color: var(--vp-c-brand-1);
}

.parsable-option {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tooltip-container {
  position: relative;
  display: inline-block;
}

.help-icon {
  color: #666;
  cursor: help;
  transition: color 0.2s;
}

.help-icon:hover {
  color: #333;
}

.tooltip-content {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  padding: 8px 12px;
  background: #333;
  color: white;
  font-size: 0.875rem;
  width: 250px;
  border-radius: 4px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
  z-index: 10;
  text-align: left;
}

.tooltip-container:hover .tooltip-content {
  opacity: 1;
  visibility: visible;
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

@media (max-width: 640px) {
  .options-container {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .left-column,
  .right-column {
    gap: 24px;
  }
}

.input-group {
  display: flex;
  gap: 8px;
}

.pattern-input {
  width: 100%;
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: border-color 0.2s;
}

.pattern-input:hover {
  border-color: var(--vp-c-brand-1);
}

.pattern-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

</style>
