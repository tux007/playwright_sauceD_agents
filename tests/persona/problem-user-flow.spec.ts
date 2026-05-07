// spec: specs/saucedemo.test.plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page } from '@playwright/test';
import { loginAsProblemUser } from '../helpers/auth';
import { CHECKOUT_DATA, PRODUCTS } from '../helpers/test-data';

async function fillCheckoutInfoUntilStable(page: Page): Promise<void> {
  const { firstName, lastName, postalCode } = CHECKOUT_DATA.problemUser;

  for (let attempt = 0; attempt < 3; attempt++) {
    await page.locator('[data-test="firstName"]').fill(firstName);
    await page.locator('[data-test="lastName"]').fill(lastName);
    await page.locator('[data-test="postalCode"]').fill(postalCode);

    const currentFirstName = await page.locator('[data-test="firstName"]').inputValue();
    const currentLastName = await page.locator('[data-test="lastName"]').inputValue();
    const currentPostalCode = await page.locator('[data-test="postalCode"]').inputValue();

    if (currentFirstName === firstName && currentLastName === lastName && currentPostalCode === postalCode) {
      return;
    }
  }
}

test.describe('Persona-Specific Stability Checks', () => {
  test('problem persona shows stable last-name validation defect on checkout step one', async ({ page }) => {
    // 1. Open login page and login as configured problem persona.
    await loginAsProblemUser(page);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');

    // 2. Add one item, open cart, proceed through checkout and complete order.
    await page.locator(`[data-test="add-to-cart-${PRODUCTS.backpack.slug}"]`).click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await fillCheckoutInfoUntilStable(page);
    await expect(page.locator('[data-test="postalCode"]')).toHaveValue(CHECKOUT_DATA.problemUser.postalCode);
    await page.locator('[data-test="continue"]').click();

    // The configured problem persona is expected to stay on step one and show the validation error consistently.
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(page.locator('[data-test="error"]')).toContainText('Last Name is required');
  });
});
