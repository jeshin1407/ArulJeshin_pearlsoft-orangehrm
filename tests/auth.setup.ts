import { test as setup } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { config } from '../src/config/env';

setup('authenticate as admin', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(config.adminUser, config.adminPass);
  await login.expectLoggedIn();
  await page.context().storageState({ path: '.auth/admin.json' });
});