// spec: specs/saucedemo.test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { loginAsStandardUser } from '../helpers/auth';
import { PRODUCTS } from '../helpers/test-data';

test.describe('Inventory and Cart', () => {
  test('Add single product to cart from inventory', async ({ page }) => {
    // 1. Open login page and login with configured standard credentials.
    await loginAsStandardUser(page);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');

    // 2. Click Add to cart for Sauce Labs Backpack.
    await page.locator(`[data-test="add-to-cart-${PRODUCTS.backpack.slug}"]`).click();
    await expect(page.locator(`[data-test="remove-${PRODUCTS.backpack.slug}"]`)).toBeVisible();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

    // 3. Open cart via cart icon.
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(page.getByRole('link', { name: PRODUCTS.backpack.name })).toBeVisible();
    await expect(page.locator('.cart_quantity').first()).toHaveText('1');
    await expect(page.locator('.inventory_item_price').first()).toHaveText(PRODUCTS.backpack.price);
  });
});
