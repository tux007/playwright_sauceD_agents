// spec: specs/saucedemo.test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { loginAsStandardUser } from '../helpers/auth';

test.describe('Checkout and Session', () => {
  test('Checkout happy path completes order', async ({ page }) => {
    // 1. Open login page and login with configured standard credentials.
    await loginAsStandardUser(page);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');

    // 2. Add one item to cart and open cart.
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('[data-test="item-4-title-link"]')).toHaveText('Sauce Labs Backpack');

    // 3. Click Checkout, fill First Name, Last Name, Zip/Postal Code, then Continue.
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill('Max');
    await page.locator('[data-test="lastName"]').fill('Mustermann');
    await page.locator('[data-test="postalCode"]').fill('8000');
    await page.locator('[data-test="continue"]').click();

    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(page.locator('[data-test="item-4-title-link"]')).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('[data-test="total-label"]')).toContainText('Total:');

    // 4. Click Finish.
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
  });
});
