import { test, expect } from '@playwright/test';
import { signIn } from './helpers.js';

test.describe('Authentication', () => {
  test('signing in opens the requester dashboard', async ({ page }) => {
    await signIn(page);
    await expect(page.locator('.nav-avatar')).toHaveText('A');
  });

  test('registration rejects mismatched passwords', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Get Started' }).click();
    await page.fill('#reg-name', 'Priya Sharma');
    await page.fill('#reg-email', 'priya@example.com');
    await page.fill('#reg-password', 'password123');
    await page.fill('#reg-confirm', 'password124');
    await page.locator('#form-register button[type="submit"]').click();

    await expect(page.locator('#notification-container')).toContainText('Passwords do not match');
    await expect(page.locator('#form-register')).toBeVisible();
  });

  test('user-supplied names are rendered as text, not HTML', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Get Started' }).click();
    await page.fill('#reg-name', '<img src=x onerror="window.__xss=1">');
    await page.fill('#reg-email', 'test@example.com');
    await page.fill('#reg-password', 'password123');
    await page.fill('#reg-confirm', 'password123');
    await page.locator('#form-register button[type="submit"]').click();

    await expect(page.locator('.dash-greeting')).toContainText('<img');
    expect(await page.evaluate(() => window.__xss)).toBeUndefined();
  });

  test('logging out returns to the home page', async ({ page }) => {
    await signIn(page);
    await page.getByRole('button', { name: 'Log out' }).click();
    await expect(page.locator('.hero-title')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    expect(new URL(page.url()).hash).toBe('');
  });
});
