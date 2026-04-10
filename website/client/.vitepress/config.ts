import { defineConfig } from 'vitepress';
import { configShard } from './config/configShard';
import { createSiteLocales, createSiteRewrites } from './config/siteLocaleConfig';

export default defineConfig({
  ...configShard,
  rewrites: createSiteRewrites(),
  locales: createSiteLocales(),
});
