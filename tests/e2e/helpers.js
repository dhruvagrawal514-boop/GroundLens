import { expect } from '@playwright/test';

export async function signIn(page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.locator('#form-login button[type="submit"]').click();
  await expect(page.locator('.dash-greeting')).toContainText('Alex');
}

export async function expectNoHorizontalScroll(page) {
  const [scrollWidth, innerWidth] = await page.evaluate(() => [
    document.documentElement.scrollWidth,
    window.innerWidth,
  ]);
  expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
}

export const isMobile = (testInfo) => testInfo.project.name === 'mobile';
