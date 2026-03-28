import { test, expect } from '@playwright/test';

test.describe('日本語ロケール (/ja/)', () => {
  test('トップページが正常にロードされる', async ({ page }) => {
    await page.goto('/ja/');
    await expect(page).toHaveTitle('VPM Catalog | Place to browse community packages for VCC');
  });

  test('日本語のコンテンツが表示される', async ({ page }) => {
    await page.goto('/ja/');
    // 日本語翻訳が適用されていることを確認（ja.ts の翻訳文字列を使用）
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  });

  test('/ja/packages が正常にロードされる', async ({ page }) => {
    await page.goto('/ja/packages');
    await expect(page).toHaveTitle(/VPM Catalog/);
    await expect(page.locator('.breadcrumbs')).toBeVisible();
  });

  test('/ja/repositories が正常にロードされる', async ({ page }) => {
    await page.goto('/ja/repositories');
    await expect(page).toHaveTitle(/VPM Catalog/);
    await expect(page.locator('.breadcrumbs')).toBeVisible();
  });

  test('言語切替メニューが表示される', async ({ page }) => {
    await page.goto('/ja/');
    // ナビゲーションバーに言語切替ボタンが存在する
    const langButton = page.locator('.navbar [aria-label="Language"]');
    await expect(langButton).toBeVisible();
  });
});
