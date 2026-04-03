import { expect, test as setup } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const authFile = 'tests/e2e/playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Sicil').fill('00001');
  await page.getByLabel('Şifre').fill('test-password');
  await page.getByRole('button', { name: 'Giriş Yap' }).click();

  await page.waitForURL('**/select-birim');
  await expect(page).toHaveURL(/.*select-birim.*/i);

  mkdirSync('tests/e2e/playwright/.auth', { recursive: true });
  await page.context().storageState({ path: authFile });
});
