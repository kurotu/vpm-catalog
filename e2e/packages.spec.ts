import { test, expect } from '@playwright/test';

test.describe('パッケージ一覧ページ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/packages');
  });

  test('ページタイトルが正しい', async ({ page }) => {
    await expect(page).toHaveTitle('Packages | VPM Catalog');
  });

  test('パンくずナビに Home と Packages が表示される', async ({ page }) => {
    const breadcrumbs = page.locator('.breadcrumbs');
    await expect(breadcrumbs.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(breadcrumbs).toContainText('Packages');
  });

  test('パンくずナビの Home リンクがトップページへ遷移する', async ({ page }) => {
    await page.locator('.breadcrumbs').getByRole('link', { name: 'Home' }).click();
    await expect(page).toHaveURL('/');
  });

  test('データがある場合、パッケージカードが表示される', async ({ page }) => {
    const cards = page.locator('.card');
    const count = await cards.count();
    if (count === 0) {
      console.log('⚠ パッケージデータが存在しないため、カード表示テストをスキップします');
      return;
    }
    await expect(cards.first()).toBeVisible();
  });

  test('データがある場合、パッケージカードをクリックすると詳細ページへ遷移する', async ({ page }) => {
    const firstLink = page.locator('.card-title a').first();
    if (await firstLink.count() === 0) {
      console.log('⚠ パッケージデータが存在しないため、詳細ページ遷移テストをスキップします');
      return;
    }
    await firstLink.click();
    await expect(page).toHaveURL(/\/packages\/.+/);
  });
});

test.describe('パッケージ詳細ページ', () => {
  test('データがある場合、詳細ページのコンテンツが表示される', async ({ page }) => {
    await page.goto('/packages');
    const firstLink = page.locator('.card-title a').first();
    if (await firstLink.count() === 0) {
      console.log('⚠ パッケージデータが存在しないため、詳細ページテストをスキップします');
      return;
    }

    await firstLink.click();
    await expect(page).toHaveURL(/\/packages\/.+/);

    // タイトルが "... | VPM Catalog" 形式
    await expect(page).toHaveTitle(/.+ \| VPM Catalog/);

    // パンくずナビに Home > Packages > パッケージ名
    const breadcrumbs = page.locator('.breadcrumbs');
    await expect(breadcrumbs.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(breadcrumbs.getByRole('link', { name: 'Packages' })).toBeVisible();

    // Side Pane のメタデータ見出しが表示される
    await expect(page.locator('#vpm-catalog-package-name')).toBeVisible();
    await expect(page.locator('#vpm-catalog-package-version')).toBeVisible();
    await expect(page.locator('#vpm-catalog-package-author')).toBeVisible();
    await expect(page.locator('#vpm-catalog-package-license')).toBeVisible();
  });
});
