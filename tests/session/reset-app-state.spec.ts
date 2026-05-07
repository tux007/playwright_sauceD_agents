// spec: specs/saucedemo.test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { loginAsStandardUser } from '../helpers/auth';
import { PRODUCTS } from '../helpers/test-data';

test.describe('Checkout and Session', () => {
  test('Reset App State clears cart badge and item state', async ({ page }) => {
    // 1. Open login page, login as standard_user with secret_sauce.
    await loginAsStandardUser(page);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');

    // 2. Add two products to cart.
    await page.locator(`[data-test="add-to-cart-${PRODUCTS.backpack.slug}"]`).click();
    await page.locator(`[data-test="add-to-cart-${PRODUCTS.bikeLight.slug}"]`).click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
    await expect(page.locator(`[data-test="remove-${PRODUCTS.backpack.slug}"]`)).toBeVisible();
    await expect(page.locator(`[data-test="remove-${PRODUCTS.bikeLight.slug}"]`)).toBeVisible();

    // 3. Open menu and click Reset App State.
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.locator('[data-test="reset-sidebar-link"]').click();
    await page.getByRole('button', { name: 'Close Menu' }).click();
    await page.reload();

    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);
    await expect(page.locator(`[data-test="add-to-cart-${PRODUCTS.backpack.slug}"]`)).toBeVisible();
    await expect(page.locator(`[data-test="add-to-cart-${PRODUCTS.bikeLight.slug}"]`)).toBeVisible();
  });
});
