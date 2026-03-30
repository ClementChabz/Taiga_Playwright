import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  fullyParallel: false,
  workers: 1,
  timeout: 50 * 1000,
  expect: { timeout: 10 * 1000 },
  use: {
    launchOptions: { slowMo: 500 },
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});