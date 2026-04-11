import { configDe } from './configDe';
import { configEnUs } from './configEnUs';
import { configEs } from './configEs';
import { configFr } from './configFr';
import { configHi } from './configHi';
import { configId } from './configId';
import { configIt } from './configIt';
import { configJa } from './configJa';
import { configKo } from './configKo';
import { configPtBr } from './configPtBr';
import { configRu } from './configRu';
import { configTr } from './configTr';
import { configVi } from './configVi';
import { configZhCn } from './configZhCn';
import { configZhTw } from './configZhTw';

const ZH_CN_PREFIX = '/zh-cn';
const EN_PREFIX = '/en';

type ThemeConfig = NonNullable<typeof configEnUs.themeConfig>;
type Nav = NonNullable<ThemeConfig['nav']>;
type Sidebar = NonNullable<ThemeConfig['sidebar']>;

function stripLocalePrefix(value: string, prefix: string): string {
  const marker = value.startsWith('^') ? '^' : '';
  const raw = marker ? value.slice(1) : value;

  if (!raw.startsWith('/')) {
    return value;
  }

  let result = raw;
  if (raw === prefix) {
    result = '/';
  } else if (raw.startsWith(`${prefix}/`)) {
    result = raw.slice(prefix.length);
  }

  return `${marker}${result}`;
}

function addLocalePrefix(value: string, prefix: string): string {
  const marker = value.startsWith('^') ? '^' : '';
  const raw = marker ? value.slice(1) : value;

  if (!raw.startsWith('/') || raw.startsWith(`${prefix}/`) || raw === prefix) {
    return value;
  }

  const result = raw === '/' ? prefix : `${prefix}${raw}`;
  return `${marker}${result}`;
}

function remapNav(nav: Nav | undefined, remap: (value: string) => string): Nav | undefined {
  return nav?.map((item) => {
    if ('link' in item) {
      return {
        ...item,
        link: remap(item.link),
        ...(item.activeMatch ? { activeMatch: remap(item.activeMatch) } : {}),
      };
    }

    if ('items' in item) {
      return {
        ...item,
        items: item.items.map((child) => {
          if ('link' in child) {
            return { ...child, link: remap(child.link) };
          }
          return child;
        }),
      };
    }

    return item;
  });
}

function remapSidebar(sidebar: Sidebar | undefined, remap: (value: string) => string): Sidebar | undefined {
  if (!sidebar) {
    return sidebar;
  }

  return Object.fromEntries(
    Object.entries(sidebar).map(([sectionPath, groups]) => [
      remap(sectionPath),
      groups.map((group: (typeof groups)[number]) => ({
        ...group,
        items: group.items.map((item: (typeof group.items)[number]) => ({
          ...item,
          link: remap(item.link),
        })),
      })),
    ]),
  );
}

function remapThemeConfig(themeConfig: ThemeConfig | undefined, remap: (value: string) => string): ThemeConfig | undefined {
  if (!themeConfig) {
    return themeConfig;
  }

  return {
    ...themeConfig,
    nav: remapNav(themeConfig.nav, remap),
    sidebar: remapSidebar(themeConfig.sidebar, remap),
  };
}

function createRootZhCnConfig() {
  return {
    ...configZhCn,
    themeConfig: remapThemeConfig(configZhCn.themeConfig, (value) => stripLocalePrefix(value, ZH_CN_PREFIX)),
  };
}

function createEnglishLocaleConfig() {
  return {
    ...configEnUs,
    themeConfig: remapThemeConfig(configEnUs.themeConfig, (value) => addLocalePrefix(value, EN_PREFIX)),
  };
}

export function createSiteRewrites() {
  return {
    'zh-cn/:rest*': ':rest*',
  };
}

export function createSiteLocales() {
  return {
    root: { label: '简体中文', ...createRootZhCnConfig() },
    en: { label: 'English', ...createEnglishLocaleConfig() },
    'zh-tw': { label: '繁體中文', ...configZhTw },
    ja: { label: '日本語', ...configJa },
    es: { label: 'Español', ...configEs },
    'pt-br': { label: 'Português', ...configPtBr },
    ko: { label: '한국어', ...configKo },
    de: { label: 'Deutsch', ...configDe },
    fr: { label: 'Français', ...configFr },
    it: { label: 'Italiano', ...configIt },
    hi: { label: 'हिन्दी', ...configHi },
    id: { label: 'Indonesia', ...configId },
    vi: { label: 'Tiếng Việt', ...configVi },
    ru: { label: 'Русский', ...configRu },
    tr: { label: 'Türkçe', ...configTr },
  };
}
