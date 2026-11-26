import { test, expect } from '@playwright/test';
import { expectNoHorizontalScroll, isMobile } from './helpers.js';

test.describe('Home page', () => {
  test('shows the hero and both calls to action', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/GroundLens/);
    await expect(page.locator('.hero-title')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Request Ground View', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /Become a Scout/ })).toBeVisible();
  });

  test('does not scroll sideways', async ({ page }) => {
    await page.goto('/');
    await expectNoHorizontalScroll(page);
  });

  test('loads without JavaScript errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
  });

  test('nav links scroll to their sections', async ({ page }, testInfo) => {
    test.skip(isMobile(testInfo), 'Section links are hidden on small screens');
    await page.goto('/');
    for (const [label, id] of [['How It Works', 'how-it-works'], ['Trust', 'features'], ['Reviews', 'testimonials']]) {
      await page.locator('#nav-links').getByRole('link', { name: label }).click();
      await expect(page.locator(`#${id}`)).toBeInViewport();
    }
  });
});
