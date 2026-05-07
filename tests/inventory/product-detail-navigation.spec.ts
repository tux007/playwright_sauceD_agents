// spec: specs/saucedemo.test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { loginAsStandardUser } from '../helpers/auth';

test.describe('Inventory and Cart', () => {
  test('Product detail navigation and back to list', async ({ page }) => {
    // 1. Open login page, login as standard_user with secret_sauce.
    await loginAsStandardUser(page);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');

    // 2. Click a product name or image to open detail page.
    await page.locator('[data-test="item-4-title-link"]').click();
    await expect(page).toHaveURL(/\/inventory-item\.html\?id=4$/);
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');

    // 3. Use Back to products.
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });
});
