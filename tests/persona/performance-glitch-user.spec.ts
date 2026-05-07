// spec: specs/saucedemo.test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { openLoginPage } from '../helpers/auth';
import { SAUCEDEMO_PASSWORD, SAUCEDEMO_USERS } from '../helpers/env';

test.describe('Persona-Specific Stability Checks', () => {
  test('performance persona login and inventory load within acceptable threshold', async ({ page }) => {
    // 1. Open login page and measure time from clicking Login to inventory visible.
    await openLoginPage(page);
    await page.locator('[data-test="username"]').fill(SAUCEDEMO_USERS.performanceGlitch);
    await page.locator('[data-test="password"]').fill(SAUCEDEMO_PASSWORD);

    const loginStart = Date.now();
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');

    const durationMs = Date.now() - loginStart;
    const thresholdMs = Number(process.env.SAUCEDEMO_PERF_THRESHOLD_MS ?? '10000');
    test.info().annotations.push({ type: 'perf-login-ms', description: String(durationMs) });
    expect(durationMs).toBeLessThanOrEqual(thresholdMs);
  });
});
