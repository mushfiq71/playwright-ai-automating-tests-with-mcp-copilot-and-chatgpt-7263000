import { test, expect } from '../fixtures/pages';
import { createBug, deleteBug, uniqueTitle } from '../helpers/bugData';

test('search is case-insensitive and normalizes whitespace and punctuation', async ({ request, loginPage, boardPage }) => {
  const prefix = uniqueTitle('Search normalization');
  const bugs = await Promise.all([
    createBug(request, { title: `${prefix} Login fails` }),
    createBug(request, { title: `${prefix} Issue with log-in` }),
    createBug(request, { title: `${prefix} Password reset` }),
  ]);

  try {
    await loginPage.loginWithFirstUser();
    await boardPage.searchInput.fill('  LOGIN  ');

    await expect(boardPage.getBugRowByTitle(bugs[0].title)).toBeVisible();
    await expect(boardPage.getBugRowByTitle(bugs[1].title)).toBeVisible();
    await expect(boardPage.getBugRowByTitle(bugs[2].title)).toHaveCount(0);

    await boardPage.clearSearchButton.click();
    await expect(boardPage.searchInput).toHaveValue('');
    await expect(boardPage.getBugRowByTitle(bugs[2].title)).toBeVisible();
  } finally {
    await Promise.all(bugs.map((bug) => deleteBug(request, bug.id)));
  }
});
