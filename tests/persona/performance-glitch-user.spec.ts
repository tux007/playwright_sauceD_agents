// spec: specs/saucedemo.test.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Persona-Specific Stability Checks', () => {
  test('performance_glitch_user login and inventory load within acceptable threshold', async ({ page }) => {
    // 1. Open login page and measure time from clicking Login (performance_glitch_user) to inventory visible.
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('performance_glitch_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');

    const loginStart = Date.now();
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');

    const durationMs = Date.now() - loginStart;
    const thresholdMs = Number(process.env.SAUCEDEMO_PERF_THRESHOLD_MS ?? '10000');
    test.info().annotations.push({ type: 'perf-login-ms', description: String(durationMs) });
    expect(durationMs).toBeLessThanOrEqual(thresholdMs);
  });
});
