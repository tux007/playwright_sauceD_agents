// spec: specs/saucedemo.test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { openLoginPage } from '../helpers/auth';
import { SAUCEDEMO_PASSWORD_INVALID, SAUCEDEMO_USERS } from '../helpers/env';

test.describe('Authentication', () => {
  test('Login fails with invalid password', async ({ page }) => {
    // 1. Open login page from a fresh browser context.
    await openLoginPage(page);
    await expect(page.locator('[data-test="username"]')).toBeVisible();

    // 2. Enter configured standard username and configured invalid password, then click Login.
    await page.locator('[data-test="username"]').fill(SAUCEDEMO_USERS.standard);
    await page.locator('[data-test="password"]').fill(SAUCEDEMO_PASSWORD_INVALID);
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL(/\/\/?$/);
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Username and password do not match any user in this service'
    );
  });
});
