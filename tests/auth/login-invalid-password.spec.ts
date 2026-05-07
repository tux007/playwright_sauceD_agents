// spec: specs/saucedemo.test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('Login fails with invalid password', async ({ page }) => {
    // 1. Open https://www.saucedemo.com/ from a fresh browser context.
    await page.goto('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="username"]')).toBeVisible();

    // 2. Enter username standard_user and an invalid password, then click Login.
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('wrong_password');
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL(/\/\/?$/);
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Username and password do not match any user in this service'
    );
  });
});
