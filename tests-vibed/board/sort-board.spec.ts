import { test, expect } from '../fixtures/pages';
import { createBug, deleteBug, uniqueTitle } from '../helpers/bugData';

test('sorts severity in both directions and exposes the active sort', async ({ request, loginPage, boardPage }) => {
  const prefix = uniqueTitle('Sort fixture');
  const bugs = await Promise.all([
    createBug(request, { title: `${prefix} low`, severity: 'low' }),
    createBug(request, { title: `${prefix} mid`, severity: 'mid' }),
    createBug(request, { title: `${prefix} high`, severity: 'high' }),
  ]);

  try {
    await loginPage.loginWithFirstUser();
    await boardPage.searchInput.fill(prefix);
    await Promise.all(bugs.map((bug) => expect(boardPage.getBugRowByTitle(bug.title)).toBeVisible()));
    await expect(boardPage.getColumnHeader('Severity')).toHaveAttribute('aria-sort', 'descending');
    await expect(await boardPage.getColumnValues('Severity')).toEqual(['HIGH', 'MID', 'LOW']);

    await boardPage.sortBy('Severity');
    await expect(boardPage.getColumnHeader('Severity')).toHaveAttribute('aria-sort', 'ascending');
    await expect(await boardPage.getColumnValues('Severity')).toEqual(['LOW', 'MID', 'HIGH']);

    await boardPage.sortBy('Title');
    await expect(boardPage.getColumnHeader('Severity')).not.toHaveAttribute('aria-sort');
    await expect(boardPage.getColumnHeader('Title')).toHaveAttribute('aria-sort', 'ascending');
  } finally {
    await Promise.all(bugs.map((bug) => deleteBug(request, bug.id)));
  }
});
