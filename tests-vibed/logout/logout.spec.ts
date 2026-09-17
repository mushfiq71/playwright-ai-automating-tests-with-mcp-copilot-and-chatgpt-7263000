import { test, expect } from '../fixtures/pages';

test.describe('Logout', () => {
  test('logs out and redirects to the login page', async ({ loginPage, titleBar, page }) => {
    await loginPage.loginWithFirstUser();
    await titleBar.logout();

    await expect(page).not.toHaveURL(/\/board$/);
  });

  test('does not restore the protected board after browser Back', async ({ loginPage, titleBar, page }) => {
    await loginPage.loginWithFirstUser();
    await titleBar.logout();
    await page.goBack();

    await expect(page).not.toHaveURL(/\/board$/);
  });
});
