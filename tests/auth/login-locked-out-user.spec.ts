// spec: specs/saucedemo.test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { openLoginPage } from '../helpers/auth';
import { SAUCEDEMO_PASSWORD, SAUCEDEMO_USERS } from '../helpers/env';

test.describe('Authentication', () => {
  test('Login fails for configured locked account', async ({ page }) => {
    // 1. Open login page from a fresh browser context.
    await openLoginPage(page);
    await expect(page.locator('[data-test="username"]')).toBeVisible();

    // 2. Enter configured locked account and password, then click Login.
    await page.locator('[data-test="username"]').fill(SAUCEDEMO_USERS.lockedOut);
    await page.locator('[data-test="password"]').fill(SAUCEDEMO_PASSWORD);
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL(/\/\/?$/);
    await expect(page.locator('[data-test="error"]')).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  });
});
