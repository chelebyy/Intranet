import { expect, test } from '@playwright/test';

test.describe('Login', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Intranet|Login/i);

    await page.getByPlaceholder(/sicil/i).fill('00001');
    await page.getByPlaceholder(/şifre|password/i).fill('password');
    await page.getByRole('button', { name: /giriş|login/i }).click();

    await expect(page).toHaveURL(/.*select-birim|dashboard.*/i);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder(/sicil/i).fill('invalid');
    await page.getByPlaceholder(/şifre/i).fill('wrong');
    await page.getByRole('button', { name: /giriş/i }).click();

    await expect(page.getByText(/hatalı|error|invalid/i)).toBeVisible();
  });
});
