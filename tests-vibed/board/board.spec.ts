import { test, expect } from '../fixtures/pages';
import { createBug, deleteBug, uniqueTitle } from '../helpers/bugData';

test.describe('Bug board', () => {
  test('renders the board columns and a created bug', async ({ request, loginPage, boardPage }) => {
    const title = uniqueTitle('Board columns');
    const bug = await createBug(request, { title, severity: 'high', owner: 'buggy' });

    try {
      await loginPage.loginWithFirstUser();
      await expect(boardPage.bugsTable).toBeVisible();
      await expect(boardPage.bugsTable.locator('thead th button')).toHaveText([/^ID/, /^Severity/, /^Title/, /^Owner/]);
      const row = boardPage.getBugRowByTitle(title);
      await expect(row.locator('td').nth(1)).toHaveText('HIGH');
      await expect(row.locator('td').nth(2)).toHaveText(title);
      await expect(row.locator('td').nth(3)).toHaveText('buggy');
    } finally {
      await deleteBug(request, bug.id);
    }
  });

  test('opens the edit modal when a bug row is clicked', async ({ request, loginPage, boardPage, editBugModal }) => {
    const bug = await createBug(request, { title: uniqueTitle('Open edit') });

    try {
      await loginPage.loginWithFirstUser();
      await boardPage.getBugRowByTitle(bug.title).click();

      await expect(editBugModal.dialog).toBeVisible();
      await expect(editBugModal.dialog).toContainText(`Edit bug #${bug.id}`);
    } finally {
      await deleteBug(request, bug.id);
    }
  });
});
