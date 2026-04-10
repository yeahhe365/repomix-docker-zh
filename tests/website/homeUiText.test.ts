import { describe, expect, it } from 'vitest';
import { getHomeUiText } from '../../website/client/components/Home/homeUiText.js';

describe('homeUiText', () => {
  it('returns Chinese UI copy for zh-CN', () => {
    const text = getHomeUiText('zh-CN');

    expect(text.hero.prefix).toBe('将代码库打包为');
    expect(text.actions.pack).toBe('开始打包');
    expect(text.options.outputFormat).toBe('输出格式');
    expect(text.result.tabs.files).toBe('文件选择');
  });

  it('returns English UI copy for en-US', () => {
    const text = getHomeUiText('en-US');

    expect(text.hero.prefix).toBe('Pack your codebase into');
    expect(text.actions.pack).toBe('Pack');
    expect(text.options.outputFormat).toBe('Output Format');
    expect(text.result.tabs.files).toBe('File Selection');
  });
});
