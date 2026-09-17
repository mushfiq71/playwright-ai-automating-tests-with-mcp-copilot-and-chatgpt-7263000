import { test, expect } from '../fixtures/pages';
import { createBug, deleteBug, uniqueTitle } from '../helpers/bugData';

test.describe('Create bug modal', () => {
  test('defaults the owner to the authenticated user', async ({ loginPage, boardPage, createBugModal }) => {
    await loginPage.loginWithFirstUser();
    await boardPage.clickNewBugButton();

    await expect(createBugModal.ownerInput).toHaveValue('buggy');
  });

  test('keeps the modal open and reports required fields when saved blank', async ({ loginPage, boardPage, createBugModal, page }) => {
    await loginPage.loginWithFirstUser();
    await boardPage.clickNewBugButton();
    await createBugModal.saveButton.click();

    await expect(createBugModal.dialog).toBeVisible();
    await expect(page.getByRole('alert').locator('li')).toHaveText(['Title is required.', 'Description is required.']);
  });

  test('closes with Cancel, Escape, and the close button', async ({ loginPage, boardPage, createBugModal, page }) => {
    await loginPage.loginWithFirstUser();
    await boardPage.clickNewBugButton();
    await createBugModal.cancel();
    await expect(createBugModal.dialog).toBeHidden();

    await boardPage.clickNewBugButton();
    await page.keyboard.press('Escape');
    await expect(createBugModal.dialog).toBeHidden();

    await boardPage.clickNewBugButton();
    await createBugModal.dialog.getByRole('button', { name: 'Close' }).click();
    await expect(createBugModal.dialog).toBeHidden();
  });

  test('does not close when the backdrop is clicked', async ({ loginPage, boardPage, createBugModal }) => {
    await loginPage.loginWithFirstUser();
    await boardPage.clickNewBugButton();
    await createBugModal.dialog.click({ position: { x: 1, y: 1 } });

    await expect(createBugModal.dialog).toBeVisible();
  });

  test('saves a bug with the selected severity', async ({ request, loginPage, boardPage, createBugModal }) => {
    const title = uniqueTitle('Create modal');
    await loginPage.loginWithFirstUser();
    await boardPage.clickNewBugButton();
    await createBugModal.fillBugForm({
      title,
      severity: 'low',
      owner: 'buggy',
      description: 'Created through the modal.',
    });
    await createBugModal.submit();

    try {
      await expect(boardPage.getBugRowByTitle(title)).toContainText('LOW');
    } finally {
      const response = await request.get('http://localhost:3000/api/bugs');
      const bugs = (await response.json()) as Array<{ id: number; title: string }>;
      const created = bugs.find((bug) => bug.title === title);
      if (created) await deleteBug(request, created.id);
    }
  });
});
