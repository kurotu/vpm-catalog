import { test, expect } from '@playwright/test';

test.describe('カタログ API (/index.json)', () => {
  test('HTTP 200 を返す', async ({ request }) => {
    const response = await request.get('/index.json');
    expect(response.status()).toBe(200);
  });

  test('Content-Type が application/json である', async ({ request }) => {
    const response = await request.get('/index.json');
    expect(response.headers()['content-type']).toMatch(/application\/json/);
  });

  test('"packages" キーを持つ JSON オブジェクトが返される', async ({ request }) => {
    const response = await request.get('/index.json');
    const body = await response.json();
    expect(body).toHaveProperty('packages');
    expect(typeof body.packages).toBe('object');
  });

  test('"name" キーを持つ', async ({ request }) => {
    const response = await request.get('/index.json');
    const body = await response.json();
    expect(body).toHaveProperty('name');
  });
});
