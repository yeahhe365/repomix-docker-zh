import { describe, expect, it } from 'vitest';
import { getHomeUiText } from '../../website/client/components/Home/homeUiText.js';

describe('homeUiText', () => {
  it('returns Chinese UI copy for zh-CN', () => {
    const text = getHomeUiText('zh-CN');

    expect(text.hero.prefix).toBe('将代码库打包为');
    expect(text.actions.pack).toBe('开始打包');
    expect(text.options.outputFormat).toBe('输出格式');
    expect(text.result.tabs.files).toBe('文件选择');
    expect(text.upload.browseLocalPath).toBe('浏览');
    expect(text.upload.localPathBrowserSelectCurrent).toBe('选择当前文件夹');
    expect(text.upload.localPathBrowserKeyboardHint).toBe('方向键选择，回车进入，退格返回，Esc 关闭');
    expect(text.upload.localPathBrowserSearchPlaceholder).toBe('搜索当前目录中的文件夹');
    expect(text.upload.localPathBrowserRecentTitle).toBe('最近访问');
  });

  it('returns English UI copy for en-US', () => {
    const text = getHomeUiText('en-US');

    expect(text.hero.prefix).toBe('Pack your codebase into');
    expect(text.actions.pack).toBe('Pack');
    expect(text.options.outputFormat).toBe('Output Format');
    expect(text.result.tabs.files).toBe('File Selection');
    expect(text.upload.browseLocalPath).toBe('Browse');
    expect(text.upload.localPathBrowserSelectCurrent).toBe('Select current folder');
    expect(text.upload.localPathBrowserKeyboardHint).toBe('Use arrow keys to move, Enter to open, Backspace to go up, Esc to close');
    expect(text.upload.localPathBrowserSearchPlaceholder).toBe('Search folders in the current directory');
    expect(text.upload.localPathBrowserRecentTitle).toBe('Recent');
  });
});
