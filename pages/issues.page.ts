import { Page, expect } from '@playwright/test';

export class IssuesPage {
    constructor(private page: Page) {}

    async createIssue(subject: string, description: string, type: string, severity: string, priority: string) {
        await this.page.getByRole('button', { name: 'NEW ISSUE' }).click();

        // Subject
        await this.page.getByRole('textbox', { name: 'Subject' }).fill(subject);

        // Description
        await this.page.getByRole('textbox', { name: 'Please add descriptive text' }).fill(description);

        // Type
        await this.page.locator('div').filter({ hasText: new RegExp(`^${type}$`) }).click();
        await this.page.getByRole('link', { name: type, exact: true }).click();

        // Severity
        await this.page.locator('div').filter({ hasText: new RegExp(`^${severity}$`) }).click();
        await this.page.getByRole('link', { name: severity, exact: true }).click();

        // Priority
        await this.page.locator('tg-issue-priority-button span').filter({ hasText: severity }).click();
        await this.page.getByRole('link', { name: priority, exact: true }).click();

        // Fermer cookie warning si présent
        const cookieWarning = this.page.locator('cookie-warning').getByRole('link', { name: 'close' });
        if (await cookieWarning.isVisible()) await cookieWarning.click();

        await this.page.getByRole('button', { name: 'Create' }).click();

        // Vérifier que l'issue apparaît dans la liste
        // Après le clic sur Create, attendre la nouvelle issue en tête de liste
        await expect(this.page.getByRole('link', { name: new RegExp(subject) }).first()).toBeVisible();

        // Récupérer le numéro pour pouvoir le réutiliser plus tard
        const issueLink = this.page.getByRole('link', { name: new RegExp(subject) }).first();
        const title = await issueLink.getAttribute('title');
        const ref = title?.match(/#(\d+)/)?.[1];
        return ref;
    }
}