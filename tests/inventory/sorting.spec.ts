// spec: specs/saucedemo.test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { loginAsStandardUser } from '../helpers/auth';

test.describe('Inventory and Cart', () => {
  test('Inventory sorting works for all options', async ({ page }) => {
    // 1. Open login page and login with configured standard credentials.
    await loginAsStandardUser(page);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    await expect(page.locator('[data-test="active-option"]')).toHaveText('Name (A to Z)');

    // 2. Select Name (Z to A).
    await page.locator('[data-test="product-sort-container"]').selectOption('za');
    await expect(page.locator('[data-test="inventory-item-name"]').first()).toHaveText('Test.allTheThings() T-Shirt (Red)');

    // 3. Select Price (low to high).
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    await expect(page.locator('[data-test="inventory-item-price"]').first()).toHaveText('$7.99');

    // 4. Select Price (high to low).
    await page.locator('[data-test="product-sort-container"]').selectOption('hilo');
    await expect(page.locator('[data-test="inventory-item-price"]').first()).toHaveText('$49.99');
  });
});
