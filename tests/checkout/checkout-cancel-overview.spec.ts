// spec: specs/saucedemo.test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { loginAsStandardUser } from '../helpers/auth';

test.describe('Checkout and Session', () => {
  test('Cancel on checkout overview returns to inventory', async ({ page }) => {
    // 1. Open login page, login with configured standard credentials, add item, proceed to checkout overview.
    await loginAsStandardUser(page);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill('Max');
    await page.locator('[data-test="lastName"]').fill('Mustermann');
    await page.locator('[data-test="postalCode"]').fill('8000');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);

    // 2. Click Cancel on overview.
    await page.locator('[data-test="cancel"]').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });
});
