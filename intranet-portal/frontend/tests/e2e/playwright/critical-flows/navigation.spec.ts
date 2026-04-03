import { expect, test } from '@playwright/test';

test.describe('Critical Flow - Navigation', () => {
  test('should navigate to dashboard after birim selection', async ({ page }) => {
    await page.goto('/select-birim');

    await expect(page).toHaveURL(/.*select-birim.*/i);
    await expect(page.getByRole('heading', { name: /birim/i })).toBeVisible();
  });
});
