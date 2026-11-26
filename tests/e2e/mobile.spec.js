import { test, expect } from '@playwright/test';
import { signIn, isMobile } from './helpers.js';

test.describe('Mobile layout', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(!isMobile(testInfo), 'Mobile-only checks');
  });

  test('dashboard tabs are available in a bottom bar', async ({ page }) => {
    await signIn(page);
    const sidebar = page.locator('.dash-sidebar');
    await expect(sidebar).toBeVisible();

    const box = await sidebar.boundingBox();
    const viewport = page.viewportSize();
    expect(box.y + box.height).toBeCloseTo(viewport.height, 0);

    await page.locator('.dash-nav-item[data-view="wallet"]').click();
    await expect(page).toHaveURL(/#\/wallet$/);
  });

  test('top nav keeps sign-in actions on screen', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeInViewport();
    await expect(page.getByRole('button', { name: 'Get Started' })).toBeInViewport();
  });
});
