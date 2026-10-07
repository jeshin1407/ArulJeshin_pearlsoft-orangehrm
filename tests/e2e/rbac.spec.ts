import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { EmployeeApi } from '../../src/api/EmployeeApi';
import { newEmployee } from '../../src/utils/dataFactory';

test('ESS user cannot see admin modules @rbac @regression', async ({ request, browser }) => {
  const api = new EmployeeApi(request);
  const e = newEmployee();
  const empNumber = await api.create({ firstName: e.first, lastName: e.last, employeeId: e.id });
  const username = `ess_${e.id}${Date.now() % 1000}`;
  const password = 'Passw0rd!2026';

  const userRes = await request.post('/web/index.php/api/v2/admin/users', {
    data: { username, password, status: true, userRoleId: 2, empNumber },
  });
  expect(userRes.ok()).toBeTruthy();

  const ctx = await browser.newContext({ storageState: undefined });
  const page = await ctx.newPage();
  try {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(username, password);
    await login.expectLoggedIn();

    const menu = page.locator('.oxd-main-menu');
    await expect(menu.getByText('Admin', { exact: true })).toHaveCount(0);
    await expect(menu.getByText('PIM', { exact: true })).toHaveCount(0);
    await expect(menu.getByText('My Info')).toBeVisible();
  } finally {
    await ctx.close();
    await api.delete(empNumber);
  }
});