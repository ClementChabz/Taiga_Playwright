import { test, expect } from '@playwright/test';
import { ProjectPage } from '../pages/project.page';
import { IssuesPage } from '../pages/issues.page';
import issues from '../data/issues.json';

test('01 - Naviguer vers les issues du projet', async ({ page }) => {
    const project = new ProjectPage(page);
    await project.goToIssues();

    await expect(page.getByRole('heading', { name: 'Issues' })).toBeVisible();
});

test('02 - Créer une issue', async ({ page }) => {
    const project = new ProjectPage(page);
    const issues = new IssuesPage(page);

    await project.goToIssues();
    await issues.createIssue(
        "Problème d'affichage",
        "Ajouter une pastille de couleur pour donner un retour visuel",
        'Bug',
        'Normal',
        'Normal'
    );
    });

test('03 - Créer 20 issues depuis JSON', async ({ page }) => {
  const project = new ProjectPage(page);
  const issuesPage = new IssuesPage(page);

  await project.goToIssues();

  for (const issue of issues) {
    await issuesPage.createIssue(
      issue.subject,
      issue.description,
      issue.type,
      issue.severity,
      issue.priority
    );
  }
});