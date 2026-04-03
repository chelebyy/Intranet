import { expect, test } from '@playwright/test';

test.describe('Critical Flow - Permissions', () => {
  test('should block unauthorized page access', async ({ page }) => {
    await page.goto('/users');

    await expect(page).toHaveURL(/.*(unauthorized|dashboard|login).*/i);
    await expect(page.getByText(/yetki|unauthorized|erişim/i)).toBeVisible();
  });
});
