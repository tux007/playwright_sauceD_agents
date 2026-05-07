// spec: specs/saucedemo.test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('Login fails for locked_out_user', async ({ page }) => {
    // 1. Open https://www.saucedemo.com/ from a fresh browser context.
    await page.goto('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="username"]')).toBeVisible();

    // 2. Enter username locked_out_user and password secret_sauce, then click Login.
    await page.locator('[data-test="username"]').fill('locked_out_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL(/\/\/?$/);
    await expect(page.locator('[data-test="error"]')).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  });
});
