// spec: specs/saucedemo.test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { loginAsStandardUser } from '../helpers/auth';

test.describe('Checkout and Session', () => {
  test('Checkout step one requires all mandatory fields', async ({ page }) => {
    // 1. Open login page, login with configured standard credentials, add one item, and open checkout step one.
    await loginAsStandardUser(page);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);

    // 2. Click Continue with all fields empty.
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');

    // 3. Fill First Name only and click Continue.
    await page.locator('[data-test="firstName"]').fill('Max');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('Last Name is required');

    // 4. Fill Last Name as well and click Continue without postal code.
    await page.locator('[data-test="lastName"]').fill('Mustermann');
    await page.locator('[data-test="postalCode"]').fill('');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('Postal Code is required');
  });
});
