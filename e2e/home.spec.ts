import { test, expect } from '@playwright/test';

test.describe('ホームページ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('ページタイトルが正しい', async ({ page }) => {
    await expect(page).toHaveTitle('VPM Catalog | Place to browse community packages for VCC');
  });

  test('ヒーローセクションの見出しが表示される', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('browse community packages for VCC');
  });

  test('パッケージ数とリポジトリ数が数値として表示される', async ({ page }) => {
    const counts = page.locator('.hero-content .text-4xl');
    await expect(counts).toHaveCount(2);
    for (const count of await counts.all()) {
      const text = await count.textContent();
      expect(Number(text?.trim())).not.toBeNaN();
    }
  });

  test('"Browse Packages" ボタンが /packages にリンクしている', async ({ page }) => {
    const btn = page.getByRole('link', { name: 'Browse Packages' });
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute('href', /\/packages\/?$/);
  });

  test('"Browse Repositories" ボタンが /repositories にリンクしている', async ({ page }) => {
    const btn = page.getByRole('link', { name: 'Browse Repositories' });
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute('href', /\/repositories\/?$/);
  });

  test('"Random Pickup" セクションが表示される', async ({ page }) => {
    await expect(page.getByText('Random Pickup')).toBeVisible();
  });

  test('データがある場合、パッケージカードが表示される', async ({ page }) => {
    const cards = page.locator('.card');
    const count = await cards.count();
    if (count > 0) {
      await expect(cards.first()).toBeVisible();
    }
  });
});
