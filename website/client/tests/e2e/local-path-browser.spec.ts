import { expect, test } from '@playwright/test';

function buildDirectoryListing(path: string | null) {
  switch (path) {
    case null:
      return {
        currentPath: null,
        parentPath: null,
        entries: [{ name: '/Users', path: '/Users' }],
      };
    case '/Users':
      return {
        currentPath: '/Users',
        parentPath: null,
        entries: [{ name: 'jones', path: '/Users/jones' }],
      };
    case '/Users/jones':
      return {
        currentPath: '/Users/jones',
        parentPath: '/Users',
        entries: [
          { name: 'Desktop', path: '/Users/jones/Desktop' },
          { name: 'Documents', path: '/Users/jones/Documents' },
        ],
      };
    case '/Users/jones/Desktop':
      return {
        currentPath: '/Users/jones/Desktop',
        parentPath: '/Users/jones',
        entries: [
          { name: 'superpowers', path: '/Users/jones/Desktop/superpowers' },
          { name: 'support', path: '/Users/jones/Desktop/support' },
        ],
      };
    case '/Users/jones/Desktop/superpowers':
      return {
        currentPath: '/Users/jones/Desktop/superpowers',
        parentPath: '/Users/jones/Desktop',
        entries: [{ name: 'docs', path: '/Users/jones/Desktop/superpowers/docs' }],
      };
    default:
      return {
        currentPath: path,
        parentPath: null,
        entries: [],
      };
  }
}

test('searches directories and restores recent local-path context after reload', async ({ page }) => {
  await page.route('**/api/local-path/directories**', async (route) => {
    const url = new URL(route.request().url());
    const selectedPath = url.searchParams.get('path');
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(buildDirectoryListing(selectedPath)),
    });
  });

  await page.goto('/');

  await page.locator('.tab-container button').nth(1).click();
  await page.getByRole('button', { name: '浏览本地目录' }).click();
  await expect(page.getByRole('button', { name: '/Users' })).toBeVisible();
  await page.getByRole('button', { name: '/Users' }).dblclick();
  await page.getByRole('button', { name: 'jones' }).dblclick();
  await page.getByRole('button', { name: 'Desktop' }).dblclick();

  await page.getByPlaceholder('搜索当前目录中的文件夹').fill('superp');
  await expect(page.getByRole('button', { name: 'superpowers' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'support' })).toHaveCount(0);

  await page.getByRole('button', { name: 'superpowers' }).dblclick();
  await page.getByRole('button', { name: '选择当前文件夹' }).click();

  await expect(page.locator('input[aria-label="本地绝对路径"]')).toHaveValue('/Users/jones/Desktop/superpowers');

  await page.reload();

  await page.locator('.tab-container button').nth(1).click();
  await expect(page.locator('input[aria-label="本地绝对路径"]')).toHaveValue('/Users/jones/Desktop/superpowers');
  await page.getByRole('button', { name: '浏览本地目录' }).click();

  await expect(page.getByText('最近访问')).toBeVisible();
  await expect(page.getByRole('button', { name: '/Users/jones/Desktop/superpowers' })).toBeVisible();
  await expect(page.locator('.selected-path')).toContainText('/Users/jones/Desktop/superpowers');
});
