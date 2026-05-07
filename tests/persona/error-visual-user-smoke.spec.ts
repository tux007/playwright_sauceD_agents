// spec: specs/saucedemo.test.plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Browser } from '@playwright/test';
import { SAUCE_DEMO_URL } from '../helpers/auth';
import { PRODUCTS } from '../helpers/test-data';

async function runPersonaSmokeSubcheck(browser: Browser, username: 'error_user' | 'visual_user'): Promise<void> {
  const context = await browser.newContext();
  const page = await context.newPage();

  // 1. Run separate subchecks for error_user and visual_user in isolated fresh contexts.
  await page.goto(SAUCE_DEMO_URL);
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill('secret_sauce');
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
  test('error_user and visual_user smoke checks', async ({ browser }) => {
    await runPersonaSmokeSubcheck(browser, 'error_user');
    await runPersonaSmokeSubcheck(browser, 'visual_user');
  });
});
