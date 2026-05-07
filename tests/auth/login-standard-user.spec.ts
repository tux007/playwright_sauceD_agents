// spec: specs/saucedemo.test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { openLoginPage } from '../helpers/auth';
import { SAUCEDEMO_PASSWORD, SAUCEDEMO_USERS } from '../helpers/env';

test.describe('Authentication', () => {
  test('Login succeeds for configured standard account', async ({ page }) => {
    // 1. Open login page from a fresh browser context.
    await openLoginPage(page);
    await expect(page.locator('[data-test="username"]')).toBeVisible();
    await expect(page.locator('[data-test="password"]')).toBeVisible();
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();

    // 2. Enter configured username/password and click Login.
    await page.locator('[data-test="username"]').fill(SAUCEDEMO_USERS.standard);
    await page.locator('[data-test="password"]').fill(SAUCEDEMO_PASSWORD);
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    await expect(page.getByText('Epic sadface:')).toHaveCount(0);
  });
});
