import { test, expect } from '../fixtures/pages';
import { readFileSync } from 'fs';
import { join } from 'path';

interface User {
  username: string;
  password: string;
}

test('user can log in and create a new bug', async ({ loginPage, boardPage, createBugModal }) => {
  const usersPath = join(process.cwd(), 'users.json');
  const users = JSON.parse(readFileSync(usersPath, 'utf-8')) as User[];
  const user = users[0];
  const title = `Playwright bug ${Date.now()}`;

  await loginPage.goto();
  await loginPage.login(user.username, user.password);
  await boardPage.clickNewBugButton();
  await createBugModal.fillBugForm({
    title,
    severity: 'high',
    owner: user.username,
    description: 'Created by a Playwright test.',
  });
  await createBugModal.submit();

  const bugRow = await boardPage.getBugRowByTitle(title);
  await expect(bugRow).toBeVisible();
});