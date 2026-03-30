import { test as setup, expect } from '@playwright/test';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const authFile = '.auth/user.json';

setup('authenticate', async ({ page }) => {
  if (!fs.existsSync('.auth')) fs.mkdirSync('.auth');

  await page.goto('https://tree.taiga.io/login');

  await page.getByPlaceholder('Username or email').fill(process.env.TAIGA_USERNAME!);
  await page.getByPlaceholder('Password').fill(process.env.TAIGA_PASSWORD!);
  await page.getByRole('button', { name: /login/i }).click();

  await expect(page).toHaveURL(/tree\.taiga\.io/, { timeout: 15000 });
  await expect(page.getByRole('navigation').getByRole('button')).toBeVisible();

  await page.context().storageState({ path: authFile });
});