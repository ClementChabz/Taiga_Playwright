import { test, expect } from '@playwright/test';
import { ProjectPage } from '../pages/project.page';
import { IssuesPage } from '../pages/issues.page';


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