import { test, expect } from '../fixtures/pages';
import { createBug, deleteBug, updateBug, uniqueTitle } from '../helpers/bugData';

test.describe('Bug status filters', () => {
  test('separates Open and Closed bugs', async ({ request, loginPage, boardPage }) => {
    const prefix = uniqueTitle('Status fixture');
    const openBug = await createBug(request, { title: `${prefix} open`, severity: 'low' });
    const closedBug = await createBug(request, { title: `${prefix} closed`, severity: 'high' });
    await updateBug(request, closedBug, { state: 'closed' });

    try {
      await loginPage.loginWithFirstUser();
      await boardPage.searchInput.fill(prefix);
      await expect(boardPage.getBugRowByTitle(openBug.title)).toBeVisible();
      await expect(boardPage.getBugRowByTitle(closedBug.title)).toHaveCount(0);

      await boardPage.filterByClosed();
      await expect(boardPage.getBugRowByTitle(closedBug.title)).toBeVisible();
      await expect(boardPage.getBugRowByTitle(openBug.title)).toHaveCount(0);
    } finally {
      await Promise.all([deleteBug(request, openBug.id), deleteBug(request, closedBug.id)]);
    }
  });
});
