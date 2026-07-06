import { defineConfig, devices } from '@playwright/test';

// Loads the local secret key when present; CI provides env vars directly.
try {
  process.loadEnvFile('e2e/.env');
} catch {
  // no local env file — fine in CI
}

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global.setup.ts',
  timeout: 60_000,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
