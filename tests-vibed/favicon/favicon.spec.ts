import { test, expect } from '@playwright/test';

test.describe('Favicon', () => {
  test('references the BuggyBoard favicon', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.ico');
  });

  test('serves the favicon resource', async ({ request }) => {
    const response = await request.get('http://localhost:5173/favicon.ico');

    expect(response.ok()).toBeTruthy();
    expect((await response.body()).length).toBeGreaterThan(0);
  });
});
