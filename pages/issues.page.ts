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

        // Après (fiable)
        const [response] = await Promise.all([
        this.page.waitForResponse(resp => 
            resp.url().includes('/api/v1/issues') && resp.status() === 201
        ),
        this.page.getByRole('button', { name: 'Create' }).click(),
        ]);
        const body = await response.json();
        return String(body.ref);
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
        // Rechercher par référence
        await this.page.getByRole('searchbox', { name: 'subject or reference' }).fill(ref);
        await this.page.waitForTimeout(1000);

        // Fermer le cookie warning si présent
        const cookieWarning = this.page.locator('cookie-warning').getByRole('link', { name: 'close' });
        if (await cookieWarning.isVisible()) await cookieWarning.click();

        // Vérifier que l'issue existe bien dans la liste
        const issueLink = this.page.getByRole('link', { name: new RegExp(`^#${ref} `) });
        await expect(issueLink, `L'issue #${ref} n'existe pas`).toBeVisible();

        // Naviguer directement vers l'issue
        await this.page.goto(`https://tree.taiga.io/project/${process.env.TAIGA_PROJECT_SLUG}/issue/${ref}`);

        // Supprimer
        await this.page.locator('.btn-icon.button-delete').click();
        await this.page.getByRole('button', { name: 'Delete' }).click();

        // Vérifier qu'on est redirigé vers la liste
        await expect(this.page).toHaveURL(/\/issues$/);

        // Vérifier que l'issue n'apparaît plus dans la recherche
        await this.page.getByRole('searchbox', { name: 'subject or reference' }).fill(ref);
        await this.page.waitForTimeout(1000);
        await expect(
            this.page.getByRole('link', { name: new RegExp(`^#${ref} `) })
        ).not.toBeVisible();
    }
}

