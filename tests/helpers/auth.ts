import { expect, type Page } from '@playwright/test';

export const SAUCE_DEMO_URL = 'https://www.saucedemo.com/';

export async function loginAsUser(page: Page, username: string): Promise<void> {
  await page.goto(SAUCE_DEMO_URL);
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL(/\/inventory\.html$/);
}

export async function loginAsStandardUser(page: Page): Promise<void> {
  await loginAsUser(page, 'standard_user');
}
