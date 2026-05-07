// spec: specs/saucedemo.test.plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Browser } from '@playwright/test';
import { SAUCE_DEMO_URL } from '../helpers/auth';
import { SAUCEDEMO_PASSWORD, SAUCEDEMO_USERS } from '../helpers/env';
import { PRODUCTS } from '../helpers/test-data';

async function runPersonaSmokeSubcheck(browser: Browser, username: string): Promise<void> {
  const context = await browser.newContext();
  const page = await context.newPage();

  // 1. Run separate subchecks in isolated fresh contexts.
  await page.goto(SAUCE_DEMO_URL);
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill(SAUCEDEMO_PASSWORD);
  await page.locator('[data-test="login-button"]').click();

  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(page.getByRole('button', { name: 'Open Menu' })).toBeVisible();
  await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
  await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible();

  // 2. For each user, add one item and open cart.
  await page.locator(`[data-test="add-to-cart-${PRODUCTS.backpack.slug}"]`).click();
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page).toHaveURL(/\/cart\.html$/);
  await expect(page.locator('.cart_item')).toHaveCount(1);

  await context.close();
}

test.describe('Persona-Specific Stability Checks', () => {
  test('error and visual persona smoke checks', async ({ browser }) => {
    await runPersonaSmokeSubcheck(browser, SAUCEDEMO_USERS.error);
    await runPersonaSmokeSubcheck(browser, SAUCEDEMO_USERS.visual);
  });
});
