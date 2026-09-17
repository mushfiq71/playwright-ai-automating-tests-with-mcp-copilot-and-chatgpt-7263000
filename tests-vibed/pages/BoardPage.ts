import { Page, Locator } from '@playwright/test';

export class BoardPage {
  readonly page: Page;
  readonly newBugButton: Locator;
  readonly searchInput: Locator;
  readonly clearSearchButton: Locator;
  readonly bugsTable: Locator;
  readonly openFilterButton: Locator;
  readonly closedFilterButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newBugButton = page.getByRole('button', { name: 'New Bug' });
    this.searchInput = page.getByRole('search', { name: 'Search bugs by title' });
    this.clearSearchButton = page.getByRole('button', { name: 'Clear search' });
    this.bugsTable = page.locator('table[aria-label="Bugs"]');
    this.openFilterButton = page.getByRole('button', { name: 'Open', exact: true });
    this.closedFilterButton = page.getByRole('button', { name: 'Closed', exact: true });
  }

  async goto() {
    await this.page.goto('/board');
  }

  async clickNewBugButton() {
    await this.newBugButton.click();
  }

  async searchByTitle(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
  }

  async clearSearch() {
    await this.clearSearchButton.click();
  }

  async filterByOpen() {
    await this.openFilterButton.click();
  }

  async filterByClosed() {
    await this.closedFilterButton.click();
  }

  async sortBy(column: 'ID' | 'Severity' | 'Title' | 'Owner') {
    await this.bugsTable.getByRole('columnheader', { name: new RegExp(`^${column}`) }).getByRole('button').click();
  }

  getRows() {
    return this.bugsTable.locator('tbody tr[role="button"]');
  }

  async getColumnValues(column: 'ID' | 'Severity' | 'Title' | 'Owner'): Promise<string[]> {
    const index = { ID: 0, Severity: 1, Title: 2, Owner: 3 }[column];
    return this.getRows().evaluateAll((rows, cellIndex) =>
      rows.map((row) => row.querySelectorAll('td')[cellIndex as number]?.textContent?.trim() ?? ''),
      index
    );
  }

  getColumnHeader(column: 'ID' | 'Severity' | 'Title' | 'Owner') {
    return this.bugsTable.getByRole('columnheader', { name: new RegExp(`^${column}`) });
  }

  getNoBugsMessage() {
    return this.page.getByRole('cell', { name: 'No bugs.', exact: true });
  }

  getBugRowByTitle(title: string): Locator {
    return this.page.locator('table[aria-label="Bugs"] tbody tr', { hasText: title }).first();
  }

  async clickBugByTitle(title: string) {
    const row = await this.getBugRowByTitle(title);
    await row.click();
  }

  async getBugCellByTitle(title: string): Promise<Locator> {
    return this.page.getByRole('cell', { name: title, exact: true });
  }

  async getNoResultsMessage(): Promise<Locator> {
    return this.page.getByRole('cell', { name: 'No bugs matched.', exact: true });
  }
}
