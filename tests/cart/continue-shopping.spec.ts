// spec: specs/saucedemo.test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { loginAsStandardUser } from '../helpers/auth';
import { PRODUCTS } from '../helpers/test-data';

test.describe('Inventory and Cart', () => {
  test('Continue Shopping navigates back to inventory', async ({ page }) => {
    // 1. Open login page, login with configured standard credentials, add at least one item, open cart.
    await loginAsStandardUser(page);
    await page.locator(`[data-test="add-to-cart-${PRODUCTS.backpack.slug}"]`).click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(page.locator('.cart_item')).toHaveCount(1);

    // 2. Click Continue Shopping.
    await page.locator('[data-test="continue-shopping"]').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });
});
