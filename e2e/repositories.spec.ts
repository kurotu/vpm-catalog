import { test, expect } from '@playwright/test';

test.describe('リポジトリ一覧ページ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/repositories');
  });

  test('ページタイトルが正しい', async ({ page }) => {
    await expect(page).toHaveTitle('Repositories | VPM Catalog');
  });

  test('パンくずナビに Home と Repositories が表示される', async ({ page }) => {
    const breadcrumbs = page.locator('.breadcrumbs');
    await expect(breadcrumbs.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(breadcrumbs).toContainText('Repositories');
  });

  test('パンくずナビの Home リンクがトップページへ遷移する', async ({ page }) => {
    await page.locator('.breadcrumbs').getByRole('link', { name: 'Home' }).click();
    await expect(page).toHaveURL('/');
  });

  test('データがある場合、リポジトリカードが表示される', async ({ page }) => {
    const cards = page.locator('.card');
    const count = await cards.count();
    if (count === 0) {
      console.log('⚠ リポジトリデータが存在しないため、カード表示テストをスキップします');
      return;
    }
    await expect(cards.first()).toBeVisible();
  });

  test('データがある場合、リポジトリカードをクリックすると詳細ページへ遷移する', async ({ page }) => {
    const firstLink = page.locator('.card-title a').first();
    if (await firstLink.count() === 0) {
      console.log('⚠ リポジトリデータが存在しないため、詳細ページ遷移テストをスキップします');
      return;
    }
    await firstLink.click();
    await expect(page).toHaveURL(/\/repositories\/.+/);
  });
});

test.describe('リポジトリ詳細ページ', () => {
  test('データがある場合、詳細ページのコンテンツが表示される', async ({ page }) => {
    await page.goto('/repositories');
    const firstLink = page.locator('.card-title a').first();
    if (await firstLink.count() === 0) {
      console.log('⚠ リポジトリデータが存在しないため、詳細ページテストをスキップします');
      return;
    }

    await firstLink.click();
    await expect(page).toHaveURL(/\/repositories\/.+/);

    // タイトルが "... | VPM Catalog" 形式
    await expect(page).toHaveTitle(/.+ \| VPM Catalog/);

    // パンくずナビに Home > Repositories > リポジトリ名
    const breadcrumbs = page.locator('.breadcrumbs');
    await expect(breadcrumbs.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(breadcrumbs.getByRole('link', { name: 'Repositories' })).toBeVisible();

    // サイドパネルのメタデータが表示される
    await expect(page.getByText('Repository ID')).toBeVisible();
    await expect(page.getByText('Author')).toBeVisible();
    await expect(page.getByText('Repository URL')).toBeVisible();

    // "Add to VCC" ボタンが表示される
    await expect(page.getByRole('link', { name: 'Add to VCC' })).toBeVisible();
  });
});
