import { test, expect } from '../fixtures/pages';

test('shows the BuggyBoard title bar controls', async ({ loginPage, titleBar }) => {
  await loginPage.loginWithFirstUser();

  await expect(titleBar.header).toBeVisible();
  await expect(titleBar.logo).toBeVisible();
  await expect(titleBar.title).toHaveText('BuggyBoard');
  await expect(titleBar.searchInput).toBeVisible();
  await expect(titleBar.newBugButton).toBeVisible();
  await expect(titleBar.logoutButton).toBeVisible();
});
