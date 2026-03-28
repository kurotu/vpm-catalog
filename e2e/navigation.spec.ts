import { test, expect } from '@playwright/test';

test.describe('ナビゲーションバー', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"VPM Catalog" ロゴリンクがトップページにリンクしている', async ({ page }) => {
    const logoLink = page.locator('nav, .navbar').getByRole('link', { name: 'VPM Catalog' });
    await expect(logoLink).toBeVisible();
    await expect(logoLink).toHaveAttribute('href', '/');
  });

  test('"Packages" リンクが /packages に遷移する', async ({ page }) => {
    await page.locator('.navbar').getByRole('link', { name: 'Packages' }).click();
    await expect(page).toHaveURL(/\/packages\/?$/);
  });

  test('"Repositories" リンクが /repositories に遷移する', async ({ page }) => {
    await page.locator('.navbar').getByRole('link', { name: 'Repositories' }).click();
    await expect(page).toHaveURL(/\/repositories\/?$/);
  });
});

test.describe('フッター', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('著作権情報が表示される', async ({ page }) => {
    await expect(page.locator('footer')).toContainText('Copyright');
    await expect(page.locator('footer')).toContainText('kurotu');
  });

  test('GitHub リンクが表示される', async ({ page }) => {
    const githubLink = page.locator('footer').getByRole('link', { name: 'GitHub' });
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute('href', /github\.com/);
  });

  test('免責事項が表示される', async ({ page }) => {
    await expect(page.locator('footer')).toContainText('warranty');
  });
});

test.describe('404ページ', () => {
  test('存在しないルートで 404 ページが表示される', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist-xyz');
    expect(response?.status()).toBe(404);
  });
});
