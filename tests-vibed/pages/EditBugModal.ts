import { Page, Locator } from '@playwright/test';

export class EditBugModal {
  readonly page: Page;
  readonly dialog: Locator;
  readonly deleteButton: Locator;
  readonly cancelButton: Locator;
  readonly closeButton: Locator;
  readonly idInput: Locator;
  readonly titleInput: Locator;
  readonly severitySelect: Locator;
  readonly stateSelect: Locator;
  readonly ownerInput: Locator;
  readonly descriptionInput: Locator;
  readonly saveButton: Locator;
  readonly confirmationDialog: Locator;
  readonly confirmDeleteButton: Locator;
  readonly cancelDeleteConfirmationButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.getByRole('dialog', { name: /Edit bug/ });
    this.deleteButton = this.dialog.getByRole('button', { name: 'Delete' });
    this.cancelButton = this.dialog.getByRole('button', { name: 'Cancel' });
    this.closeButton = this.dialog.getByRole('button', { name: 'Close' });
    this.idInput = this.dialog.getByLabel('ID');
    this.titleInput = this.dialog.getByLabel('Title');
    this.severitySelect = this.dialog.getByLabel('Severity');
    this.stateSelect = this.dialog.getByLabel('State');
    this.ownerInput = this.dialog.getByLabel('Owner');
    this.descriptionInput = this.dialog.getByLabel('Description');
    this.saveButton = this.dialog.getByRole('button', { name: 'Save' });
    this.confirmationDialog = page.getByRole('dialog', { name: 'Confirm delete' });
    this.confirmDeleteButton = this.confirmationDialog.getByRole('button', { name: 'Delete' });
    this.cancelDeleteConfirmationButton = this.confirmationDialog.getByRole('button', { name: 'Cancel' });
  }

  async openDeleteConfirmation() {
    await this.deleteButton.click();
    await this.confirmationDialog.waitFor({ state: 'visible' });
  }

  async confirmDeletion() {
    await this.confirmDeleteButton.click();
    await this.dialog.waitFor({ state: 'hidden' });
  }

  async cancelDeleteConfirmation() {
    await this.cancelDeleteConfirmationButton.click();
    await this.confirmationDialog.waitFor({ state: 'hidden' });
    await this.dialog.waitFor({ state: 'visible' });
  }

  async delete() {
    await this.openDeleteConfirmation();
    await this.confirmDeletion();
  }

  async cancel() {
    await this.cancelButton.click();
    // Wait for modal to close
    await this.page.waitForSelector('[role="dialog"]', { state: 'hidden' });
  }

  async close() {
    await this.closeButton.click();
    await this.dialog.waitFor({ state: 'hidden' });
  }

  async pressEscape() {
    await this.page.keyboard.press('Escape');
    await this.dialog.waitFor({ state: 'hidden' });
  }

  async isVisible(): Promise<boolean> {
    return await this.dialog.isVisible().catch(() => false);
  }
}
