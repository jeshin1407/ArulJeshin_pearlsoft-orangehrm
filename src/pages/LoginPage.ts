import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  async goto() { await this.page.goto('/web/index.php/auth/login'); }

  async login(user: string, pass: string) {
    await this.page.getByPlaceholder('Username').fill(user);
    await this.page.getByPlaceholder('Password').fill(pass);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  async expectLoggedIn() { await expect(this.page).toHaveURL(/dashboard/); }
  async expectInvalidLogin() { await expect(this.page.getByText('Invalid credentials')).toBeVisible(); }
}