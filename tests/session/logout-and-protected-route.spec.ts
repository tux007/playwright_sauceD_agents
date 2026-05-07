// spec: specs/saucedemo.test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { loginAsStandardUser } from '../helpers/auth';

test.describe('Checkout and Session', () => {
  test('Logout from menu returns to login and blocks protected page', async ({ page }) => {
    // 1. Open login page, login as standard_user with secret_sauce.
    await loginAsStandardUser(page);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');

    // 2. Open menu and click Logout.
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.locator('[data-test="logout-sidebar-link"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();

    // 3. Attempt to open /inventory.html directly.
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});
