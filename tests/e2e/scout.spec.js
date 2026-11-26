import { test, expect } from '@playwright/test';

test('a new scout can pick a task on the radar and accept it', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Become a Scout/ }).click();
  await expect(page.locator('#role-doer-card')).toHaveAttribute('aria-pressed', 'true');

  await page.fill('#reg-name', 'Rahul Verma');
  await page.fill('#reg-email', 'rahul@example.com');
  await page.fill('#reg-password', 'password123');
  await page.fill('#reg-confirm', 'password123');
  await page.locator('#form-register button[type="submit"]').click();

  const pins = page.locator('.radar-marker');
  await expect(pins).toHaveCount(4);

  await pins.first().click();
  const panel = page.locator('#doer-task-action-panel');
  await expect(panel).toContainText('Verify Central Park Cafe is open');

  await panel.getByRole('button', { name: 'Accept task' }).click();
  await expect(panel.getByRole('button', { name: /Accepted/ })).toBeDisabled();
  await expect(pins.first()).toHaveClass(/accepted/);
});
