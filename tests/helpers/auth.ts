import { expect, type Page } from '@playwright/test';
import { SAUCEDEMO_BASE_URL, SAUCEDEMO_PASSWORD, SAUCEDEMO_USERS } from './env';

export const SAUCE_DEMO_URL = SAUCEDEMO_BASE_URL;

export async function openLoginPage(page: Page): Promise<void> {
  await page.goto(SAUCE_DEMO_URL);
}

export async function loginAsUser(page: Page, username: string): Promise<void> {
  await openLoginPage(page);
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill(SAUCEDEMO_PASSWORD);
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL(/\/inventory\.html$/);
}

export async function loginAsStandardUser(page: Page): Promise<void> {
  await loginAsUser(page, SAUCEDEMO_USERS.standard);
}

export async function loginAsProblemUser(page: Page): Promise<void> {
  await loginAsUser(page, SAUCEDEMO_USERS.problem);
}
