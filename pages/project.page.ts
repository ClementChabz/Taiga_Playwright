import { Page, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export class ProjectPage {
    constructor(private page: Page) {}

    async goToIssues() {
        await this.page.goto(`https://tree.taiga.io/project/${process.env.TAIGA_PROJECT_SLUG}/issues`);
        await expect(this.page).toHaveURL(/\/issues/);
    }
}