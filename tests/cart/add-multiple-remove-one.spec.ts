// spec: specs/saucedemo.test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { loginAsStandardUser } from '../helpers/auth';

test.describe('Inventory and Cart', () => {
  test('Add multiple products and remove one in cart', async ({ page }) => {
    // 1. Open login page, login as standard_user with secret_sauce.
    await loginAsStandardUser(page);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');

    // 2. Add two different products to cart.
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');

    // 3. Open cart and click Remove for one product.
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

    await expect(page.locator('[data-test="item-4-title-link"]')).toHaveCount(0);
    await expect(page.locator('[data-test="item-0-title-link"]')).toHaveText('Sauce Labs Bike Light');
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });
});
