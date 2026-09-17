import { Locator, Page } from '@playwright/test';

export class TitleBar {
  readonly page: Page;
  readonly header: Locator;
  readonly logo: Locator;
  readonly title: Locator;
  readonly newBugButton: Locator;
  readonly logoutButton: Locator;
  readonly searchInput: Locator;
  readonly clearSearchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByRole('banner');
    this.logo = this.header.getByRole('img', { name: 'BuggyBoard' });
    this.title = this.header.getByRole('heading', { name: 'BuggyBoard' });
    this.newBugButton = this.header.getByRole('button', { name: 'New Bug' });
    this.logoutButton = this.header.getByRole('button', { name: 'Logout' });
    this.searchInput = this.header.getByRole('search', { name: 'Search bugs by title' });
    this.clearSearchButton = this.header.getByRole('button', { name: 'Clear search' });
  }

  async logout() {
    await this.logoutButton.click();
    await this.page.waitForURL('**/login');
  }
}
