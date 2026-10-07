import { Page, expect } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async waitForLoader() {
    await this.page.locator('.oxd-loading-spinner').waitFor({ state: 'hidden' }).catch(() => {});
  }

  field(label: string) {
    return this.page.locator('.oxd-input-group', { hasText: label }).locator('input').first();
  }

  async expectToast(text: string | RegExp) {
    await expect(this.page.locator('.oxd-toast')).toContainText(text);
  }
}