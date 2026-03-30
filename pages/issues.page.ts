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
        await this.page.locator('tg-issue-type-button').getByText('Type').click();
        await this.page.locator('tg-issue-type-button').getByRole('link', { name: type, exact: true }).click();

        // Severity
        await this.page.locator('tg-issue-severity-button').getByText('Severity').click();
        await this.page.locator('tg-issue-severity-button').getByRole('link', { name: severity, exact: true }).click();

        // Priority
        await this.page.locator('tg-issue-priority-button').getByText('Priority').click();
        await this.page.locator('tg-issue-priority-button').getByRole('link', { name: priority, exact: true }).click();

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
        return ref ? String(Number(ref) + 1) : undefined;
    }

    async filterIssues(type: string, severity: string) {
        await this.page.getByRole('button', { name: 'Filters' }).click();
        await this.page.getByRole('button', { name: 'Type' }).click();
        await this.page.getByRole('button', { name: type }).click();
        await this.page.getByRole('button', { name: 'Severity' }).click();
        await this.page.getByRole('button', { name: severity }).click();

        // Vérifier que le filtre est appliqué
        await expect(this.page.getByText('Filtered by: Bug Critical')).toBeVisible();    
    }

    async deleteIssueByRef(ref: string) {
       //attendre que la liste se mette a jour
        await this.page.waitForTimeout(1000);

        // Rechercher par référence
        await this.page.getByRole('searchbox', { name: 'subject or reference' }).fill(ref);
        await this.page.getByText(new RegExp(`#${ref}`)).first().click();

        // Supprimer
        await this.page.locator('.btn-icon.button-delete').click();
        await this.page.getByRole('button', { name: 'Delete' }).click();

        // Vérifier que l'issue n'existe plus
        await this.page.getByRole('searchbox', { name: 'subject or reference' }).fill(ref);
        await expect(this.page.getByText(new RegExp(`#${ref}`))).not.toBeVisible();
    }
}

