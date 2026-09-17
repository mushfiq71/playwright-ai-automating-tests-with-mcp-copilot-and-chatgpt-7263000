import { APIRequestContext } from '@playwright/test';

export const apiBase = 'http://localhost:3000';

export interface CreatedBug {
  id: number;
  title: string;
  severity: string;
  owner: string;
  description: string;
  state: string;
}

export function uniqueTitle(prefix: string) {
  return `${prefix} ${Date.now()} ${Math.random().toString(16).slice(2)}`;
}

export async function createBug(
  request: APIRequestContext,
  details: Partial<Pick<CreatedBug, 'title' | 'severity' | 'owner' | 'description'>> = {}
) {
  const bug = {
    title: details.title ?? uniqueTitle('UI test bug'),
    severity: details.severity ?? 'mid',
    owner: details.owner ?? 'buggy',
    description: details.description ?? 'Created for an independent UI test.',
  };
  const response = await request.post(`${apiBase}/api/bugs`, { data: bug });
  if (!response.ok()) {
    throw new Error(`Unable to create test bug: ${response.status()}`);
  }
  return (await response.json()) as CreatedBug;
}

export async function updateBug(
  request: APIRequestContext,
  bug: CreatedBug,
  changes: Partial<Pick<CreatedBug, 'title' | 'severity' | 'owner' | 'description' | 'state'>>
) {
  const response = await request.put(`${apiBase}/api/bugs/${bug.id}`, {
    data: {
      title: changes.title ?? bug.title,
      severity: changes.severity ?? bug.severity,
      owner: changes.owner ?? bug.owner,
      description: changes.description ?? bug.description,
      state: changes.state ?? bug.state,
    },
  });
  if (!response.ok()) {
    throw new Error(`Unable to update test bug: ${response.status()}`);
  }
  return (await response.json()) as CreatedBug;
}

export async function deleteBug(request: APIRequestContext, id: number) {
  await request.delete(`${apiBase}/api/bugs/${id}`);
}
