import { test, expect } from '../tests-vibed/fixtures/pages';

test.describe('Seed tests', () => {
  test('login with first user from users.json', { tag: '@seed' }, async ({ loginPage, boardPage, page }) => {
    await loginPage.loginWithFirstUser();

    await expect(page).toHaveURL(/\/board$/);
    await expect(boardPage.bugsTable).toBeVisible();
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  });
});
