import { describe, expect, it } from 'vitest';
import { createSiteLocales, createSiteRewrites } from '../../website/client/.vitepress/config/siteLocaleConfig.js';

describe('siteLocaleConfig', () => {
  it('uses Simplified Chinese as the root locale and keeps English under /en/', () => {
    const locales = createSiteLocales();
    const rewrites = createSiteRewrites();

    expect(locales.root.label).toBe('简体中文');
    expect(locales.root.lang).toBe('zh-CN');
    expect(locales.en.label).toBe('English');
    expect(locales.en.themeConfig?.nav?.[0]?.link).toBe('/en/guide/');
    expect(rewrites).toEqual({
      'zh-cn/:rest*': ':rest*',
    });
  });
});
