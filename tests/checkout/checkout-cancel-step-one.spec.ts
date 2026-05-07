// spec: specs/saucedemo.test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { loginAsStandardUser } from '../helpers/auth';

test.describe('Checkout and Session', () => {
  test('Cancel on checkout step one returns to cart', async ({ page }) => {
    // 1. Open login page, login as standard_user with secret_sauce, add item, open checkout step one.
    await loginAsStandardUser(page);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);

    // 2. Click Cancel.
    await page.locator('[data-test="cancel"]').click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(page.locator('[data-test="item-4-title-link"]')).toHaveText('Sauce Labs Backpack');
  });
});
