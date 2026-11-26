import { test, expect } from '@playwright/test';
import { signIn, expectNoHorizontalScroll } from './helpers.js';

test.describe('Requester dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test('every tab is reachable and fits the screen', async ({ page }) => {
    for (const view of ['post-task', 'notifications', 'wallet', 'analytics', 'dashboard']) {
      await page.locator(`.dash-nav-item[data-view="${view}"]`).click();
      await expect(page).toHaveURL(new RegExp(`#/${view}$`));
      await expect(page.locator(`.dash-nav-item[data-view="${view}"]`)).toHaveClass(/active/);
      await expectNoHorizontalScroll(page);
    }
  });

  test('stat counters finish on consistent values', async ({ page }) => {
    await expect(page.locator('#dash-total-tasks')).toHaveText('156');
    await expect(page.locator('#dash-completed-tasks')).toHaveText('140');
    await expect(page.locator('#dash-total-spent')).toHaveText('$2,000');
  });

  test('post task validates input before submitting', async ({ page }) => {
    await page.locator('.dash-nav-item[data-view="post-task"]').click();
    await page.fill('#pt-title', 'Check queue at Central Station');
    await page.fill('#pt-desc', 'short');
    await page.locator('#form-post-task button[type="submit"]').click();
    await expect(page.locator('#notification-container')).toContainText('min 10 chars');

    await page.fill('#pt-desc', 'Need a 10 second video of the main entrance.');
    await page.fill('#pt-budget', '20');
    await page.fill('#pt-deadline', '2030-01-01T10:00');
    await page.locator('#form-post-task button[type="submit"]').click();
    await expect(page.locator('#notification-container')).toContainText('Task posted successfully');
  });

  test('mark all read clears the notification badge', async ({ page }) => {
    const badge = page.locator('.dash-nav-badge');
    await expect(badge).toHaveText('3');
    await page.locator('.dash-nav-item[data-view="notifications"]').click();
    await page.locator('#btn-mark-all-read').click();
    await expect(badge).toBeHidden();
    await expect(page.locator('.dash-greeting-sub')).toHaveText('All caught up!');
  });
});
