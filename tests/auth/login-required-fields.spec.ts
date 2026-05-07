// spec: specs/saucedemo.test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { openLoginPage } from '../helpers/auth';
import { SAUCEDEMO_USERS } from '../helpers/env';

test.describe('Authentication', () => {
  test('Login validation requires username and password', async ({ page }) => {
    // 1. Open login page from a fresh browser context.
    await openLoginPage(page);
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();

    // 2. Click Login with both fields empty.
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Username is required');

    // 3. Enter only username and click Login.
    await page.locator('[data-test="username"]').fill(SAUCEDEMO_USERS.standard);
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Password is required');
  });
});
