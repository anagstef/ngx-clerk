import { expect, test } from '@playwright/test';
import { clerk, setupClerkTestingToken } from '@clerk/testing/playwright';
import { TEST_USER } from './constants';

test.describe('authentication', () => {
  test('loads Clerk and shows the signed-out state', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Sign in' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Dashboard' })).toHaveCount(0);
  });

  test('redirects unauthenticated visitors from a guarded route to sign-in', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL(/\/sign-in/);
    // The mounted <clerk-sign-in> UI renders a Clerk card
    await expect(page.locator('.cl-signIn-root, .cl-rootBox').first()).toBeVisible({ timeout: 15_000 });
  });

  test('renders the sign-in component on /sign-in', async ({ page }) => {
    await setupClerkTestingToken({ page });
    await page.goto('/sign-in');
    await expect(page.locator('.cl-signIn-root, .cl-rootBox').first()).toBeVisible({ timeout: 15_000 });
  });

  test('signs in, shows signed-in UI, and signs out', async ({ page }) => {
    await page.goto('/');
    await clerk.signIn({
      page,
      signInParams: { strategy: 'password', identifier: TEST_USER.email, password: TEST_USER.password },
    });

    // Control-flow directives flip: Dashboard link appears, Sign in disappears
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Dashboard' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign in' })).toHaveCount(0);

    // Guarded route now renders, UserButton mounts (clerk-js UI)
    await page.goto('/dashboard');
    await expect(page.locator('clerk-user-button .cl-userButton-root, clerk-user-button .cl-rootBox').first()).toBeVisible({
      timeout: 15_000,
    });

    await clerk.signOut({ page });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Sign in' }).first()).toBeVisible();
  });

  test('getToken() returns a JWT on the session-token page', async ({ page }) => {
    await page.goto('/');
    await clerk.signIn({
      page,
      signInParams: { strategy: 'password', identifier: TEST_USER.email, password: TEST_USER.password },
    });
    await page.goto('/dashboard/session-token');
    await page.getByRole('button', { name: 'Get token' }).click();
    await expect(page.getByTestId('session-token-value')).toContainText(/^ey/, { timeout: 15_000 });
  });
});
