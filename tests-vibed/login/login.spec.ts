import { test, expect } from '../fixtures/pages';

test.describe('Login', () => {
  test('renders the login form with a masked password field', async ({ loginPage }) => {
    await loginPage.goto();

    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('redirects unauthenticated users away from the board', async ({ page, loginPage }) => {
    await page.goto('/board');

    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('logs in with the first user from users.json', async ({ loginPage }) => {
    await loginPage.loginWithFirstUser();

    await expect(loginPage.page).toHaveURL(/\/board$/);
  });

  test('accepts credentials submitted with Enter', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.usernameInput.fill('buggy');
    await loginPage.passwordInput.fill('1970beetle');
    await loginPage.passwordInput.press('Enter');

    await expect(loginPage.page).toHaveURL(/\/board$/);
  });

  test('shows an error for invalid credentials', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.loginButton.click();
    await loginPage.usernameInput.fill('unknown-user');
    await loginPage.passwordInput.fill('wrong-password');
    await loginPage.loginButton.click();

    await expect(page.getByRole('alert')).toHaveText('Invalid username or password.');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('shows required-field errors for blank credentials', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.loginButton.click();

    await expect(page.getByRole('alert')).toHaveText('Please enter your username and password.');
  });

  test('preserves authentication after a refresh', async ({ loginPage, boardPage, page }) => {
    await loginPage.loginWithFirstUser();
    await page.reload();

    await expect(boardPage.bugsTable).toBeVisible();
    await expect(page).toHaveURL(/\/board$/);
  });
});
