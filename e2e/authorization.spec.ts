import { expect, test } from '@playwright/test';
import { clerk } from '@clerk/testing/playwright';
import { TEST_USER } from './constants';

test.describe('authorization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clerk.signIn({
      page,
      signInParams: { strategy: 'password', identifier: TEST_USER.email, password: TEST_USER.password },
    });
  });

  test('*clerkProtect renders the fallback for a user without the role', async ({ page }) => {
    await page.goto('/dashboard/protect');
    await expect(page.getByTestId('protect-fallback')).toBeVisible();
    await expect(page.getByTestId('protect-permission-value')).toHaveText('false');
  });

  test('canActivateProtect redirects an unauthorized user to unauthorizedUrl', async ({ page }) => {
    await page.goto('/dashboard/admin');
    await page.waitForURL(/\/dashboard$/);
    await expect(page).not.toHaveURL(/\/admin/);
  });
});
