import { test, expect } from '@playwright/test';
import { ProjectPage } from '../pages/project.page';

test('01 - Naviguer vers les issues du projet', async ({ page }) => {
  const project = new ProjectPage(page);
  await project.goToIssues();
  
  await expect(page.getByRole('heading', { name: 'Issues' })).toBeVisible();
});