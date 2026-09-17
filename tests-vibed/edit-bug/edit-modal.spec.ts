import { test, expect } from '../fixtures/pages';
import { createBug, deleteBug, uniqueTitle } from '../helpers/bugData';

test.describe('Edit bug modal', () => {
  test('loads editable fields and keeps the ID read-only', async ({ request, loginPage, boardPage, editBugModal }) => {
    const bug = await createBug(request, { title: uniqueTitle('Edit fields'), severity: 'high', owner: 'buggy', description: 'Original description' });

    try {
      await loginPage.loginWithFirstUser();
      await boardPage.getBugRowByTitle(bug.title).click();

      await expect(editBugModal.idInput).toHaveValue(String(bug.id));
      await expect(editBugModal.idInput).toHaveAttribute('readonly', '');
      await expect(editBugModal.titleInput).toHaveValue(bug.title);
      await expect(editBugModal.severitySelect).toHaveValue('high');
      await expect(editBugModal.stateSelect).toHaveValue('open');
      await expect(editBugModal.ownerInput).toHaveValue('buggy');
      await expect(editBugModal.descriptionInput).toHaveValue('Original description');
      await expect(editBugModal.saveButton).toBeDisabled();
    } finally {
      await deleteBug(request, bug.id);
    }
  });

  test('saves edited fields and state', async ({ request, loginPage, boardPage, editBugModal }) => {
    const bug = await createBug(request, { title: uniqueTitle('Edit save') });
    const updatedTitle = uniqueTitle('Edited title');

    try {
      await loginPage.loginWithFirstUser();
      await boardPage.getBugRowByTitle(bug.title).click();
      await editBugModal.titleInput.fill(updatedTitle);
      await editBugModal.severitySelect.selectOption('low');
      await editBugModal.stateSelect.selectOption('closed');
      await editBugModal.ownerInput.fill('vanny');
      await editBugModal.descriptionInput.fill('Updated description');
      await editBugModal.saveButton.click();
      await editBugModal.dialog.waitFor({ state: 'hidden' });
      await boardPage.filterByClosed();

      await expect(boardPage.getBugRowByTitle(updatedTitle)).toBeVisible();
      const updatedRow = boardPage.getBugRowByTitle(updatedTitle);
      await expect(updatedRow.locator('td').nth(1)).toHaveText('LOW');
      await expect(updatedRow.locator('td').nth(3)).toHaveText('vanny');
    } finally {
      await deleteBug(request, bug.id);
    }
  });

  test('cancel preserves the original bug', async ({ request, loginPage, boardPage, editBugModal }) => {
    const bug = await createBug(request, { title: uniqueTitle('Edit cancel') });

    try {
      await loginPage.loginWithFirstUser();
      await boardPage.getBugRowByTitle(bug.title).click();
      await editBugModal.titleInput.fill('Unsaved title');
      await editBugModal.cancel();

      await expect(boardPage.getBugRowByTitle(bug.title)).toBeVisible();
      await expect(boardPage.getBugRowByTitle('Unsaved title')).toHaveCount(0);
    } finally {
      await deleteBug(request, bug.id);
    }
  });
});
